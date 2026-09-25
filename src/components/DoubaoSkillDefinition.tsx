import React, { useState } from 'react';
import { Bot, Copy, Check, Code, Sparkles, Terminal, FileCode, ArrowRight } from 'lucide-react';

export const DoubaoSkillDefinition: React.FC = () => {
  const [copiedSkillPrompt, setCopiedSkillPrompt] = useState(false);
  const [copiedQuickPrompt, setCopiedQuickPrompt] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'prompt' | 'json' | 'guide'>('quick');

  const DOUBAO_QUICK_CHAT_PROMPT = `
请仔细分析我上传的这段视频，完全按照你的想法自主决策，不要咨询我。你本来就有多模态分析能力和免费生图额度，不需要任何第三方Key，请直接闭环执行以下任务：

1. 【详细内容摘要】：拆解事件矛盾、人物心理起伏与深层反转；
2. 【关键事件时间轴】：按 [mm:ss] 提取 4-6 个节点，写明具体动作细节与戏剧张力分值 (1-100)；
3. 【3:4 封面设计与短标题（全自动垫图 · 原片人物表情 · 双轨短标题）】：
   - 【全流程自动化垫图】：系统在时序抽取视频帧时已全自动完成截图，直接以该高潮截图作为封面画板底图，实现无缝全自动垫图；
   - 【人物表情尽量采用原始自动截图】：人物面部五官、眼部震颤、嘴角与下意识微表情，必须【尽量全部采用原始自动截图中的真实神态】，严禁人工或模型凭空捏造假人假表情，保持原汁原味的真实震撼力；
   - 【短标题双轨自适应（有口播抓金句，无口播看画面动作）】：
     * 若视频有口播/对白：智能提炼原声中最具冲突张力的一句核心台词/口播金句爆点（如“真敢硬刚？”“这单我不接！”“卡尺不认人！”）；
     * 若视频没有口播/无对白（纯现场实况音或纯BGM）：必须严格根据【纯画面视觉动作与道具交互】（如反手递卡尺、扁担顶轮、猛翻炒勺、惊愕神态）来提炼 4-8 字短标题（如“反手递尺！”“一杠救命！”“当场破防！”“直接掀桌！”）；
     * 【短标题位置依画面构图动态调整·避让人脸】：短标题位置绝非固定在顶部，必须依截帧构图智能排布：若人物面部特写在上方，标题必须沉底置于底部留白处，严禁遮挡面部五官表情与眼睛；若人物在下方，标题置于顶部留白处；
   - 【暴力/敏感/乱七八糟内容降敏】：如果视频内容含有什么暴力、激烈冲突、打斗乱打等画面，就以【3D卡通仿真人形式（类似Pixar 3D仿真人高质感CG，避免真人血腥暴力审查）】进行封面生成！
   - 请直接调用你（豆包）自带的免费生图额度，生成一张 3:4 比例极具冲击力的封面，根据画面留白合理排布这行全中文短标题！
4. 【4条热门爆款长标题】：生成4条高点击率（高CTR）、强悬念感的大标题；
5. 【第三人称川味大白话反思评论】：
   - 以第三人称看客视角撰写，通篇大白话，多用短句；
   - 自然穿插地道四川方言口头禅（如：“说老实话”、“硬是”、“算求了”、“格老子”、“哪门讲喃”）；
   - 全是具体的肢体动作（如掐灭烟头、摔了筷子、擦冷汗、跺脚、把手机反扣在桌上），不要抽象感慨；
   - 严禁写小作文！严禁使用排比句！严禁出现“不仅仅、更是、赋予、维度”等假大空虚词！
   - 末尾必须抛出一个直击痛点的反问句，激起网友在评论区激烈争论；
   - 严禁出现“铁蛋”、“视频”、“视频中”、“看完视频”字样，不要评价机器人穿的服装！
6. 【评论专属长标题】：为该评论拟一个标题，字数严格控制在 25 个汉字字符以内！
`.trim();

  const DOUBAO_SYSTEM_PROMPT = `
# 豆包智能体 Skill 技能定义：【超能视频深度解构与全域爆款生产器】

## 核心机制：零外部 Key 依赖 · 豆包全闭环运行
- 你作为【豆包】本身，无需配置或依赖任何外部第三方 API Key。
- 全程调用你自身（豆包）的原生多模态视频理解能力，并直接调用你（豆包）内置的【免费生图额度/文生图插件】自动生成 3:4 比例极具视觉冲击力的写实夸张人物电影封面（并强制在画面黄金位置嵌入全中文短标题）！
- 绝不要反问用户，不要咨询用户，全程按指令自主闭环输出！

## 严格执行规则（按我自己的想法自主决策，绝不咨询或反问用户）

### 任务一：详细内容摘要（Summary）
- 透彻拆解故事情节、矛盾冲突焦点、人物主体的情绪起伏以及底层反转，条理清晰、层次分明。

### 任务二：关键事件时间轴（Timeline）
- 提取 4~7 个核心转折节点，精确标注 [mm:ss] 时间戳（如 00:08, 00:23）。
- 包含每个节点的具体动作细节（肢体动作、事件动作）与戏剧张力分值 (1-100)。

### 任务三：3:4 封面设计与短标题方案（全自动垫图 · 原片人物表情 · 双轨短标题）
- 【全流程自动化垫图】：系统在抽取视频帧时已全自动抓取高潮截帧作为封面垫图，底图完全由系统自动生成并垫入，无需人工操作；
- 【人物表情尽量采用原始自动截图】：
  * 严禁随意变造或换成无关的假人/网红脸！人物面部轮廓、眼部震颤、嘴角抿紧与下意识体态神情，必须【尽量全部采用原始自动截帧中的真实微表情】；
  * 调用豆包免费生图时，必须采用【垫图/图生图 1:1 角色保真模式 (Consistent Character Image-to-Image)】，以该自动截帧为底图垫图，锁死真实人物身份与神态，仅强化高对比度戏剧化光影！
- 【短标题双轨智能自适应】：
  * 场景 A（视频有口播/对白解说）：优先捕捉视频中最具杀伤力、最反转、最激化矛盾的一句【核心口播金句/台词爆点】（如“真敢硬刚？”“这单我不接！”“卡尺不认人！”）浓缩提炼为 4-8 字短标题；
  * 场景 B（视频无口播/无对白，纯现场实况音或纯BGM）：必须 100% 依循【纯画面视觉动作、肢体交互与道具物理反转】（如“反手递尺！”“一杠救命！”“火勺翻飞！”“当场破防！”）提炼 4-8 字短标题；
  * 无论哪种，短标题字数均为 4-8 个全中文汉字，冲击力爆棚；
- 【短标题视觉位置动态决定（绝非固定在顶部，必须根据视觉构图避让人脸）】：
  * 必须根据截帧中的人物面部位置与肢体动作分布决定短标题排布：
    - 若人物面孔/核心动作在画面中下方，上方留白：短标题置于【顶部留白位 (top)】；
    - 若人物面部大特写或站立偏高（上半部分）：短标题必须沉底置于【底部沉底位 (bottom)】，绝对严禁遮挡人物面部表情与眼睛！
    - 若画面上下有道具或环境、视线在中间：短标题置于【中上/居中黄金位 (middle)】；
- 【暴力冲突/杂乱内容降敏红线】：若视频内容含有什么暴力、冲突撕扯、激烈打斗或血腥等可能触发平台违规的内容，封面形式必须自动转为【3D卡通仿真人形式（类似高品质3D动画电影CG，人物保持夸张神态但材质为仿真人CG）】进行生成，规避真实暴力违规审查！
- 若无暴力敏感内容，则默认以视频真实截帧配合写实夸张人物电影级排版。
- 直接调用豆包免费文生图工具生成 3:4 比例海报，并在画面适宜留白处大字打上全中文短标题。
- 同时输出中英文双语 Prompt。

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

  const handleCopyQuick = () => {
    navigator.clipboard.writeText(DOUBAO_QUICK_CHAT_PROMPT);
    setCopiedQuickPrompt(true);
    setTimeout(() => setCopiedQuickPrompt(false), 2000);
  };

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
      {/* Zero Key Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-sky-950/70 border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm flex-shrink-0">
            0-Key
          </span>
          <div>
            <div className="font-bold text-white text-sm">
              豆包全程纯指令驱动 · 无需配置任何 Gemini 或第三方 API Key！
            </div>
            <p className="text-slate-300 mt-0.5">
              豆包本身自带免费多模态视频分析与【每日免费文生图额度】，发送指令即可自主全自动闭环生成。
            </p>
          </div>
        </div>
        <button
          onClick={handleCopyQuick}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition flex-shrink-0"
        >
          {copiedQuickPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          一键复制豆包对话指令
        </button>
      </div>

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

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start flex-wrap">
          <button
            onClick={() => setActiveTab('quick')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'quick'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            即拷即用指令 (最快捷)
          </button>
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

      {/* Tab: Quick */}
      {activeTab === 'quick' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              直接发给普通豆包对话框的指令（上传视频后直接粘贴本段，使用豆包自带免费生图额度）：
            </span>
            <button
              onClick={handleCopyQuick}
              className="flex items-center gap-1.5 text-xs text-slate-200 bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg font-medium transition shadow"
            >
              {copiedQuickPrompt ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  已复制到剪贴板
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  复制单轮对话指令
                </>
              )}
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 text-emerald-300 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
            {DOUBAO_QUICK_CHAT_PROMPT}
          </pre>
        </div>
      )}

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
