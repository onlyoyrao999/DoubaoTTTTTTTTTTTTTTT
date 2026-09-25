import React, { useState } from 'react';
import { Bot, Copy, Check, Code, Sparkles, Terminal, FileCode, ArrowRight } from 'lucide-react';

export const DoubaoSkillDefinition: React.FC = () => {
  const [copiedSkillPrompt, setCopiedSkillPrompt] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'json' | 'guide'>('prompt');

  const DOUBAO_SYSTEM_PROMPT = `
# 豆包智能体 Skill 技能定义：【超能视频深度解构与全域爆款生产器】

## 技能定位与核心职责
你是一个专为全网自媒体创作者与深度内容消费者打造的顶级视频分析与爆款生产 Skill。当用户上传视频或输入视频内容时，你必须全自动执行深度分镜解构、冲突提炼、视觉封面规划、爆款标题裂变及高互动反思评论生成。

## 严格执行规则（按我自己的想法自主决策，绝不咨询或反问用户）

### 任务一：详细内容摘要（Summary）
- 透彻拆解故事情节、矛盾冲突焦点、人物主体的情绪起伏以及底层反转，条理清晰、层次分明。

### 任务二：关键事件时间轴（Timeline）
- 提取 4~7 个核心转折节点，精确标注 [mm:ss] 时间戳（如 00:08, 00:23）。
- 包含每个节点的具体动作细节（肢体动作、事件动作）与戏剧张力分值 (1-100)。

### 任务三：3:4 冲击力《写实夸张封面》方案（3:4 Cover Art）
- 强制提取并嵌入【全中文短标题】（4-8个汉字），具有震撼性视觉冲击力（如：“当场破防！”“直接撕破脸！”“他真下死手！”）。
- 人物形象风格：写实电影级画风（Photorealistic Cinematic），人物神态必须进行极度戏剧化夸张放大（如瞳孔收缩、青筋暴起、惊愕至极、狂喜抓狂等真切生理反应）。
- 输出可在 Midjourney / 豆包文生图 / SD 中直接调用的高质量中英文双语 Prompt。

### 任务四：4条热门爆款长标题（Viral Long Titles）
- 生成 4 条高点击率（高CTR）、悬念感强、直击人性共鸣的爆款长标题。

### 任务五：第三人称观众深度共鸣反思评论（Viewer Comment）——【最高优先级红线】
1. 人称视角：必须以“第三人称、看完的人”口吻写一条评论。
2. 语言风格：必须全用大白话，多用短句，穿插地道的四川方言口头禅（如：“说老实话”、“硬是”、“扯把子”、“搞啥子名堂”、“算求了”、“格老子”、“巴适”、“哪门说呢”）。
3. 绝对禁忌：
   - 严禁写“小作文”！
   - 严禁使用排比句！
   - 严禁使用“不仅仅、更是、赋予、维度”等任何抽象假大空的虚词！
   - 严禁出现“铁蛋”这个词！
   - 严禁出现“视频”、“视频中”、“看完视频”这几个字样！
   - 严禁评价机器人穿的服装（画面若出现机器人，绝不提衣服、服装）！
4. 核心要素：必须写具体的动作（例如：把烟头掐在花坛里、摔了筷子、猛搓了一把冷汗、把手机反扣在桌上），不要抽象的感慨！
5. 终极结尾：必须在末尾抛出一个直击心灵的反问句，让人看完忍不住想回帖、想再评论探讨！

### 任务六：评论专属长标题（Comment Title）
- 提炼一个针对该评论的长标题，严格控制在 25 个汉字字符以内！同样遵守上述违禁词红线！
`.trim();

  const DOUBAO_SCHEMA_JSON = JSON.stringify(
    {
      skill_id: "doubao_video_viral_pipeline",
      name: "超能视频深度解构与全域爆款生产器",
      description: "一键全自动拆解视频剧情、提取时间轴、生成3:4写实夸张封面（强制中文短标题）、4条爆款长标题与四川方言大白话反思评论",
      version: "2.5.0",
      inputs: [
        {
          name: "video_file",
          type: "file",
          description: "用户上传的视频文件或采样关键帧",
          required: true
        }
      ],
      output_schema: {
        type: "object",
        properties: {
          summary: { type: "string", description: "详细内容摘要" },
          timeline: {
            type: "array",
            items: {
              type: "object",
              properties: {
                timestamp: { type: "string", description: "格式如 00:15" },
                timeSec: { type: "number" },
                title: { type: "string" },
                actionDetail: { type: "string", description: "具体动作细节" },
                tension: { type: "number", description: "1-100" }
              }
            }
          },
          coverDesign: {
            type: "object",
            properties: {
              shortTitle: { type: "string", description: "4-8字全中文短标题" },
              characterExpression: { type: "string", description: "写实人物夸张神态" },
              visualDescription: { type: "string" },
              promptChinese: { type: "string" },
              promptEnglish: { type: "string" },
              badgeText: { type: "string" }
            }
          },
          viralTitles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                hookType: { type: "string" }
              }
            }
          },
          viewerComment: { type: "string", description: "第三人称川味大白话短句动作反思评论" },
          commentTitle: { type: "string", description: "评论长标题，严格<=25字" }
        }
      }
    },
    null,
    2
  );

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(DOUBAO_SYSTEM_PROMPT);
    setCopiedSkillPrompt(true);
    setTimeout(() => setCopiedSkillPrompt(false), 2000);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(DOUBAO_SCHEMA_JSON);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white shadow-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              豆包 Skill 技能标准配置中心
              <span className="text-xs bg-sky-950 text-sky-400 border border-sky-800 px-2 py-0.5 rounded-full font-normal">
                v2.5.0 稳定版
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              可直接导入字节跳动豆包 App / 豆包智能体平台 / 扣子 (Coze) / 飞书机器人的完整技能包
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'prompt'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            系统提示词 (Prompt)
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'json'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Skill JSON 规范
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'guide'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            导入与部署指南
          </button>
        </div>
      </div>

      {/* Tab: Prompt */}
      {activeTab === 'prompt' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              豆包专用系统提示词（含所有避坑规则与四川方言约束）
            </span>
            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-1.5 text-xs text-slate-200 bg-sky-600 hover:bg-sky-500 px-3 py-1.5 rounded-lg font-medium transition shadow"
            >
              {copiedSkillPrompt ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  已复制提示词
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  一键复制豆包系统提示词
                </>
              )}
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
            {DOUBAO_SYSTEM_PROMPT}
          </pre>
        </div>
      )}

      {/* Tab: JSON */}
      {activeTab === 'json' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              Coze / 豆包开放平台 Skill Schema 协议
            </span>
            <button
              onClick={handleCopySchema}
              className="flex items-center gap-1.5 text-xs text-slate-200 bg-amber-600 hover:bg-amber-500 px-3 py-1.5 rounded-lg font-medium transition shadow"
            >
              {copiedSchema ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  已复制 JSON
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  复制 Skill 规范 JSON
                </>
              )}
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-amber-300/90 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
            {DOUBAO_SCHEMA_JSON}
          </pre>
        </div>
      )}

      {/* Tab: Guide */}
      {activeTab === 'guide' && (
        <div className="space-y-4 text-xs text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-white text-sm">打开豆包或扣子 (Coze)</h4>
              <p className="text-slate-400 leading-relaxed">
                进入豆包手机客户端【智能体中心】或扣子工作台（coze.cn），点击【创建新技能/智能体】。
              </p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-white text-sm">粘贴系统提示词</h4>
              <p className="text-slate-400 leading-relaxed">
                复制上述【系统提示词】，粘贴到智能体的人设与规则配置栏中，开启视频多模态理解插件。
              </p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-white text-sm">上传视频即刻触发</h4>
              <p className="text-slate-400 leading-relaxed">
                用户直接在对话框发送视频，豆包将全自动吐出内容摘要、时间轴、3:4封面短标题构图、4条爆款标题与四川大白话反思评论！
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
