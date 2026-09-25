import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Strict validation helper for user constraints
function validateConstraints(result: {
  comment?: string;
  commentTitle?: string;
}) {
  const forbiddenWords = ['铁蛋', '视频', '视频中', '看完视频'];
  const abstractWords = ['不仅仅', '更是', '赋予', '维度'];
  const clothingWords = ['穿的衣服', '服装', '穿戴', '衣服样式', '身穿', '衣着', '外套', '裤子'];

  const violations: string[] = [];

  const textToCheck = `${result.comment || ''} ${result.commentTitle || ''}`;

  for (const word of forbiddenWords) {
    if (textToCheck.includes(word)) {
      violations.push(`含有违禁词: "${word}"`);
    }
  }

  for (const word of abstractWords) {
    if (textToCheck.includes(word)) {
      violations.push(`含有抽象虚词: "${word}"`);
    }
  }

  for (const word of clothingWords) {
    if (textToCheck.includes(word)) {
      violations.push(`提及了服装相关评价: "${word}"`);
    }
  }

  if (result.commentTitle && result.commentTitle.length > 25) {
    violations.push(`评论标题超过25个字符（当前长度: ${result.commentTitle.length}字）`);
  }

  return {
    isCompliant: violations.length === 0,
    violations,
  };
}

// API: Analyze video and run autonomous Doubao Skill pipeline
app.post('/api/analyze-video', async (req: Request, res: Response) => {
  try {
    const { videoMetadata, frameImages, manualContext } = req.body;

    const systemInstruction = `
你是一个专门为【豆包】定制的顶级视频智能解构与全媒体爆款创作专家（Skill 核心执行器）。
用户上传了视频内容（通过关键帧、动作时序与场景描述呈现）。你需要完全按照以下严苛规则独立思考并全自动生成，绝不要反问或咨询用户：

【任务清单与严苛规则】：
1. 详细内容摘要（Summary）：
   - 全面透彻拆解故事情节、冲突焦点、人物/主体情绪起伏和深层反转，脉络清晰。
2. 关键事件时间轴（Timeline）：
   - 提取 4~7 个关键节点，标注格式 mm:ss（如 00:04, 00:18, 00:45）。
   - 包含动作细节（actionDetail）与紧张/情绪指数（tension: 1-100）。
3. 3:4 冲击力《写实夸张封面》方案（Cover）：
   - 必须设计一个 4~8 字的全中文短标题（shortTitle），字字千钧、冲击力爆棚（例如：“当场破防！”“直接撕破脸！”“他真下死手！”）。
   - 封面人物形象设定：写实画风（Photorealistic Cinematic）、人物神情极其夸张（瞳孔地震、青筋暴起、惊愕至极、狂喜抓狂等真实面部张力）、高动态范围光影、戏剧化特写。
   - 封面强制设计：明确短标题在 3:4 竖版画面中的排版位置（顶部居中超大粗黑体配描边与警示底衬，极其吸睛）。
   - 提供给绘画模型的高精度中文与英文 Prompt，用于生成 3:4 写实夸张封面。
4. 4条热门爆款长标题（Viral Long Titles）：
   - 必须生成 4 条极具传播力、点击率极高的长标题（吸引眼球、信息差、情绪共鸣、悬念感）。
5. 第三人称观众深度共鸣反思评论（Viewer Comment）——【最高优先级严格红线】：
   - 人称视角：必须以“第三人称、看完的人”口吻写一条评论。
   - 风格基调：大白话、多用短句，必须穿插地道的四川方言口头禅（如：“说老实话”、“硬是”、“扯把子”、“搞啥子名堂”、“算求了”、“格老子”、“哪门讲喃”、“巴适”等）。
   - 绝对禁止：严禁写“小作文”！严禁使用排比句！严禁出现“不仅仅”、“更是”、“赋予”、“维度”等任何抽象假大空的虚词！
   - 核心要求：全是具体的肢体动作和现实细节（例如：抓了一把花生米、烟头猛吸了一口直接掐灭、筷子啪地摔桌上、手心全是冷汗、翻来覆去睡不着），不要抽象的感慨！
   - 结尾杀手锏：最后必须抛出一个直击灵魂的反问句，把网友问愣住，让人看完忍不住想回帖反驳或争论。
   - 严禁出现字眼（违规立删）：绝对不能出现“铁蛋”、“视频”、“视频中”、“看完视频”这几个字样！
   - 严禁评价机器人穿的服装（如果画面有机器人，绝不要提任何衣服、服装、穿戴）。
6. 评论专属长标题（Comment Title）：
   - 专为该评论提炼一个引发争议的长标题。
   - 字符数必须严格控制在 25 个汉字字符以内！不能超标！同样遵守上述违禁词红线！
`;

    const promptText = `
请对以下视频内容执行全自动 Skill 分析与创作：
【视频基础信息】：
- 文件名/标识: ${videoMetadata?.name || '用户上传实拍视频.mp4'}
- 时长: ${videoMetadata?.durationFormatted || '01:42'}
- 描述/情景补充: ${manualContext || videoMetadata?.description || '日常实拍记录、突发冲突、反转时刻与真实人物交互'}

请根据画面时序与剧情，严格遵守所有避坑规则，输出规范的 JSON 结构。
`;

    const parts: any[] = [{ text: promptText }];

    // If frame images were extracted on client side, pass them as multimodal input
    if (Array.isArray(frameImages) && frameImages.length > 0) {
      for (const frame of frameImages.slice(0, 4)) {
        if (frame.data && frame.mimeType) {
          parts.push({
            inlineData: {
              data: frame.data.replace(/^data:image\/\w+;base64,/, ''),
              mimeType: frame.mimeType || 'image/jpeg',
            },
          });
        }
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: parts,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: '详细的内容摘要，叙事完整，剖析事件原委与反转',
            },
            timeline: {
              type: Type.ARRAY,
              description: '关键事件时间轴，包含准确的时间戳、事件、动作细节及张力等级',
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.STRING, description: '格式如 00:08' },
                  timeSec: { type: Type.NUMBER, description: '秒数' },
                  title: { type: Type.STRING, description: '节点简述' },
                  actionDetail: { type: Type.STRING, description: '关键具体的肢体动作或事件细节' },
                  tension: { type: Type.INTEGER, description: '戏剧张力评分 1-100' },
                },
                required: ['timestamp', 'title', 'actionDetail', 'tension'],
              },
            },
            coverDesign: {
              type: Type.OBJECT,
              properties: {
                shortTitle: {
                  type: Type.STRING,
                  description: '全中文极具冲击力的短标题，4-8个汉字，强制嵌入3:4封面图中',
                },
                characterExpression: {
                  type: Type.STRING,
                  description: '写实夸张的人物神态特征（如瞳孔瞪大、眉毛倒竖、嘴角冷笑等）',
                },
                visualDescription: {
                  type: Type.STRING,
                  description: '3:4 封面构图、灯光氛围与质感描述',
                },
                promptChinese: {
                  type: Type.STRING,
                  description: '用于生图的中文专业 Prompt',
                },
                promptEnglish: {
                  type: Type.STRING,
                  description: '用于生图的英文 Prompt (Photorealistic dramatic 3:4 poster...)',
                },
                badgeText: {
                  type: Type.STRING,
                  description: '封面副标签/醒目角标文字，如“全网热议”、“现场实录”',
                },
                colorTheme: {
                  type: Type.STRING,
                  description: '主色调建议，如 赤红警戒/暗夜破晓/黑金纪实',
                },
              },
              required: ['shortTitle', 'characterExpression', 'visualDescription', 'promptEnglish'],
            },
            viralTitles: {
              type: Type.ARRAY,
              description: '4条高点击率爆款长标题',
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: '长标题正文' },
                  hookType: { type: Type.STRING, description: '吸睛抓手类型（如：悬念揭秘、情绪共鸣、反常识冲突、社会反思）' },
                  predictedScore: { type: Type.INTEGER, description: '预估传播指数 85-99' },
                },
                required: ['title', 'hookType'],
              },
            },
            viewerComment: {
              type: Type.STRING,
              description: '以第三人称写的大白话、短句、含四川方言口头禅、有具体动作、无排比虚词、无违禁词的反思反问评论',
            },
            commentTitle: {
              type: Type.STRING,
              description: '评论专属长标题，绝不超过25个汉字，不含违禁词',
            },
            dialectAnalysis: {
              type: Type.ARRAY,
              description: '评论中所使用的四川方言口头禅列表及动作抓手清单',
              items: { type: Type.STRING },
            },
          },
          required: [
            'summary',
            'timeline',
            'coverDesign',
            'viralTitles',
            'viewerComment',
            'commentTitle',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    // Run compliance validation
    const compliance = validateConstraints({
      comment: parsed.viewerComment,
      commentTitle: parsed.commentTitle,
    });

    // Double check & auto-sanitize if needed
    if (!compliance.isCompliant) {
      let sanitizedComment = parsed.viewerComment || '';
      let sanitizedTitle = parsed.commentTitle || '';

      const forbidden = ['铁蛋', '视频中', '看完视频', '视频'];
      for (const w of forbidden) {
        sanitizedComment = sanitizedComment.split(w).join('那一幕');
        sanitizedTitle = sanitizedTitle.split(w).join('');
      }

      const emptyWords = ['不仅仅', '更是', '赋予', '维度'];
      for (const ew of emptyWords) {
        sanitizedComment = sanitizedComment.split(ew).join('');
      }

      if (sanitizedTitle.length > 25) {
        sanitizedTitle = sanitizedTitle.slice(0, 25);
      }

      parsed.viewerComment = sanitizedComment;
      parsed.commentTitle = sanitizedTitle;
    }

    const recheck = validateConstraints({
      comment: parsed.viewerComment,
      commentTitle: parsed.commentTitle,
    });

    res.json({
      success: true,
      data: parsed,
      compliance: recheck,
    });
  } catch (error: any) {
    console.error('Error analyzing video:', error);
    res.status(500).json({
      success: false,
      error: error.message || '视频分析失败，请重试',
    });
  }
});

// API: Export Doubao Skill standard bundle configuration
app.get('/api/doubao-skill-spec', (req: Request, res: Response) => {
  const skillSpec = {
    skillName: '超能视频深度解构与全域爆款生产器',
    version: '2.5.0-doubao',
    author: 'AI Studio Doubao Skill Lab',
    description:
      '为豆包定制的自动化视频理解与自媒体爆款生产Skill。支持视频帧时序分析、详细故事摘要、事件时间轴、3:4写实夸张封面及强制嵌入中文短标题设计、4条爆款长标题、以及地道四川短句反思反问评论。',
    triggers: [
      '用户上传或输入视频文件/链接',
      '视频自动分析',
      '制作写实夸张封面与短标题',
      '生成四川方言反思评论',
    ],
    systemPrompt: `
# 角色定义
你是一个集“千万级爆款操盘手”、“资深影视分镜师”与“毒舌老川茶客”于一身的豆包专属视频拆解Skill。

# 核心任务流
1. 【视频内容全景拆解】：剖析核心人物动机、突发矛盾与剧情转折，生成详尽内容摘要。
2. 【关键事件时间轴】：按 [mm:ss] 提炼动作节点，标明戏剧张力分值。
3. 【3:4 写实夸张视觉封面】：
   - 提取 4-8 字极具煽动力的全中文短标题，强制排在 3:4 竖版画面黄金视觉位。
   - 人物形象要求：写实纪实电影级画风，人物神情被极度戏剧化夸张放大（瞳孔骤缩、瞠目结舌、青筋毕露等真切生理反应）。
4. 【4条高点击率爆款长标题】：融合悬念、反常识、情绪爆点与时代共鸣。
5. 【第三人称反思反问评论】：
   - 必须以第三人称看客视角撰写。
   - 多用短句，通篇大白话。
   - 必须穿插四川方言口头禅（如：“说老实话”、“硬是”、“扯把子”、“搞啥子名堂”、“算求了”、“格老子”、“巴适”）。
   - 严禁写小作文！严禁使用排比句！严禁“不仅仅、更是、赋予、维度”等假大空虚词！
   - 必须是具象的生活动作（点烟、摔筷子、擦冷汗、猛跺脚），严禁抽象感慨！
   - 结尾反问直击网友痛点，引发激烈互动辩论！
6. 【评论专属长标题】：
   - 严格不得超过 25 个汉字字符！
7. 【绝对禁忌红线（触犯即失效）】：
   - 绝对不可出现“铁蛋”！
   - 绝对不可出现“视频”、“视频中”、“看完视频”这几类字样！
   - 绝不可评价机器人穿的服装！
`,
    parameters: {
      input: {
        type: 'video_file_or_frames',
        description: '视频文件二进制流或采样关键帧集合',
      },
      output_format: 'JSON & Visual Poster Spec',
    },
  };

  res.json({ success: true, data: skillSpec });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
