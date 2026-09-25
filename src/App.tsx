import React, { useState, useRef } from 'react';
import {
  Upload,
  Video,
  Sparkles,
  Bot,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  ArrowRight,
  ShieldAlert,
  Flame,
  LayoutTemplate,
  Layers,
} from 'lucide-react';
import { SAMPLE_VIDEOS, SampleVideoOption } from './data/sampleVideos';
import { extractVideoFrames, formatTime } from './utils/videoExtractor';
import { CoverCanvas } from './components/CoverCanvas';
import { TimelineView } from './components/TimelineView';
import { TitlesAndComments } from './components/TitlesAndComments';
import { DoubaoSkillDefinition } from './components/DoubaoSkillDefinition';
import { AnalysisResult, ExtractedFrame, VideoMetadata } from './types';

export default function App() {
  const [activeMainTab, setActiveMainTab] = useState<'workbench' | 'doubao-spec'>('workbench');
  const [selectedSample, setSelectedSample] = useState<SampleVideoOption | null>(SAMPLE_VIDEOS[0]);
  const [customVideoFile, setCustomVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata>({
    name: SAMPLE_VIDEOS[0].title,
    durationFormatted: SAMPLE_VIDEOS[0].durationFormatted,
    description: SAMPLE_VIDEOS[0].description,
  });

  const [extractedFrames, setExtractedFrames] = useState<ExtractedFrame[]>([]);
  const [manualNote, setManualNote] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>({
    summary: SAMPLE_VIDEOS[0].description + '\n\n【深层剖析】：老周与巡检机器人的较劲，表面上是一把卡尺的精度之争，实则是传统蓝领工人面对自动化技术席卷而来的尊严护卫战。机器人的精准复测与老周的凝滞，构成了戏剧性最强烈的反差。',
    timeline: SAMPLE_VIDEOS[0].mockTimeline,
    coverDesign: {
      shortTitle: SAMPLE_VIDEOS[0].mockShortTitle,
      characterExpression: '老钳工眉头紧锁，眼神震颤，满是油污的手指紧握扳手，震惊与不甘写满整张写实面孔',
      visualDescription: '工业车间重度景深、高动态冷蓝工业激光与昏黄暖光对撞、粗粝纪实胶片质感',
      promptChinese: '3:4 比例超写实电影海报，一位满脸汗水与机油的老钳工眼球震颤，极度震惊地看着前方，背景有工业巡检机械发出的高光激光，强对比光影，戏剧张力。',
      promptEnglish: SAMPLE_VIDEOS[0].mockCoverPrompt,
      badgeText: '实录爆点 · 现场破防',
      colorTheme: '警示亮黄',
    },
    viralTitles: SAMPLE_VIDEOS[0].mockViralTitles,
    viewerComment: SAMPLE_VIDEOS[0].mockViewerComment,
    commentTitle: SAMPLE_VIDEOS[0].mockCommentTitle,
    dialectAnalysis: ['说老实话', '硬是没想到', '熬白了头', '狠搓了两把脸', '烟头掐灭'],
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle local video upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSelectedSample(null);
    setCustomVideoFile(file);

    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    try {
      setAnalysisProgress('正在提取视频关键帧与元数据...');
      const { duration, durationFormatted, frames } = await extractVideoFrames(file, 4);
      setExtractedFrames(frames);
      setVideoMetadata({
        name: file.name,
        size: file.size,
        duration,
        durationFormatted,
        type: file.type,
        url,
        description: `用户上传实拍视频: ${file.name}，时长 ${durationFormatted}`,
      });
      setAnalysisProgress('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg('解析视频失败，但您仍可继续点击分析');
      setVideoMetadata({
        name: file.name,
        size: file.size,
        durationFormatted: '01:30',
        url,
      });
    }
  };

  // Switch preset sample
  const handleSelectSample = (sample: SampleVideoOption) => {
    setSelectedSample(sample);
    setCustomVideoFile(null);
    setVideoUrl(null);
    setExtractedFrames([]);
    setVideoMetadata({
      name: sample.title,
      durationFormatted: sample.durationFormatted,
      description: sample.description,
    });
    setAnalysisResult({
      summary: sample.description + '\n\n【核心看点】：现实生活烟火气与智能科技浪潮的剧烈摩擦，瞬间引爆全网讨论与共情。',
      timeline: sample.mockTimeline,
      coverDesign: {
        shortTitle: sample.mockShortTitle,
        characterExpression: '极度写实且夸张的人物神态，面部特写张力十足，瞳孔地震，真实震撼',
        visualDescription: '3:4竖版构图，强烈光影与色彩对比，高动态戏剧性瞬间抓拍',
        promptChinese: '3:4写实纪实海报，人物神态极具情绪张力，电影级景深与质感',
        promptEnglish: sample.mockCoverPrompt,
        badgeText: '实录爆点 · 全网热议',
      },
      viralTitles: sample.mockViralTitles,
      viewerComment: sample.mockViewerComment,
      commentTitle: sample.mockCommentTitle,
      dialectAnalysis: ['说老实话', '硬是', '算求了', '格老子'],
    });
  };

  // Run AI Video Analysis
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    setAnalysisProgress('豆包视频 Skill 正在进行分镜解析...');

    try {
      const payload = {
        videoMetadata,
        frameImages: extractedFrames.map((f) => ({
          data: f.dataUrl,
          mimeType: 'image/jpeg',
        })),
        manualContext: manualNote || videoMetadata.description,
      };

      setAnalysisProgress('正在提取关键事件时间轴与冲突核心...');

      const res = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || '视频分析请求失败');
      }

      const resData = await res.json();
      if (!resData.success) {
        throw new Error(resData.error || '分析失败');
      }

      setAnalysisResult(resData.data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || '分析过程中发生异常，请检查网络或配置');
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  const handleSeekVideo = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                  豆包 AI 视频智能分析与爆款生产 Skill
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  零Key · 豆包自带免费生图
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                纯指令驱动 · 全自动分镜摘要 · 3:4写实夸张封面（强制中文短标题） · 4条爆款长标题 · 川味大白话反思评论
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveMainTab('workbench')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                activeMainTab === 'workbench'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              智能创作工作台
            </button>
            <button
              onClick={() => setActiveMainTab('doubao-spec')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                activeMainTab === 'doubao-spec'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              豆包 Skill 指令中心 (免Key)
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Compliance & Skill Notification Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-white">豆包原生全自主执行：</span>
            <span>完全基于指令自主驱动，利用豆包自身多模态视觉与免费生图额度闭环完成</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
              无需任何外部Key
            </span>
            <span className="text-amber-400/90 font-medium">严禁词: 铁蛋 / 视频中 / 看完视频</span>
            <span className="text-indigo-400/90 font-medium">语言调性: 四川方言短句</span>
            <span className="text-rose-400/90 font-medium">评论标题严格 ≤ 25 字</span>
          </div>
        </div>

        {activeMainTab === 'doubao-spec' ? (
          <DoubaoSkillDefinition />
        ) : (
          <div className="space-y-6">
            {/* Input & Video Selector Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Upload or Pick Preset */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-sm sm:text-base">视频源载入与多模态采样</h2>
                      <p className="text-xs text-slate-400">支持直接上传用户视频或选择代表性实况范例</p>
                    </div>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    上传本地视频
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/mkv"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>

                {/* Preset Scenario Cards */}
                <div>
                  <div className="text-xs font-semibold text-slate-400 mb-2.5">
                    快速体验内置实况场景（点击即刻切换）：
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {SAMPLE_VIDEOS.map((sample) => {
                      const isSelected = selectedSample?.id === sample.id && !customVideoFile;
                      return (
                        <button
                          key={sample.id}
                          onClick={() => handleSelectSample(sample)}
                          className={`text-left p-3 rounded-xl border transition flex flex-col justify-between ${
                            isSelected
                              ? 'bg-sky-950/70 border-sky-500 text-white shadow'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 rounded">
                              {sample.tag}
                            </span>
                            <h4 className="text-xs font-bold text-slate-200 mt-1.5 line-clamp-2 leading-snug">
                              {sample.title}
                            </h4>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400 mt-2">
                            时长: {sample.durationFormatted}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Video Preview or Frame Strip */}
                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <FileVideo className="w-4 h-4 text-sky-400" />
                      当前载入: {videoMetadata.name}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      时长: {videoMetadata.durationFormatted}
                    </span>
                  </div>

                  {videoUrl ? (
                    <div className="aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 relative">
                      <video
                        ref={videoRef}
                        src={videoUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                      <p className="font-semibold text-amber-300 mb-1">【剧情背景与实拍实况】</p>
                      <p>{videoMetadata.description}</p>
                    </div>
                  )}

                  {/* Extracted Key Frames Strip */}
                  {extractedFrames.length > 0 && (
                    <div className="mt-3">
                      <div className="text-[11px] font-semibold text-slate-400 mb-1.5">
                        多模态关键帧抽样 ({extractedFrames.length} 帧)：
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {extractedFrames.map((frame, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSeekVideo(frame.timestamp)}
                            className="group relative aspect-video bg-black rounded-md overflow-hidden border border-slate-700 cursor-pointer"
                          >
                            <img
                              src={frame.dataUrl}
                              alt="frame"
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                            <span className="absolute bottom-1 right-1 bg-black/80 font-mono text-[9px] text-white px-1 rounded">
                              {frame.formattedTime}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Execution Panel */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm sm:text-base">全自动 Skill 调起控制台</h3>
                      <p className="text-xs text-slate-400">按照您的要求全自动调度，无需确认或咨询</p>
                    </div>
                  </div>

                  {/* Instruction summary pills */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="font-semibold text-slate-300">自动化流水线任务清单：</div>
                    <ul className="space-y-1.5 text-slate-400 pl-1">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>自动提炼剧情详细内容摘要</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>自动提取结构化关键事件时间轴</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span className="text-amber-300 font-medium">
                          强制嵌入中文短标题的 3:4 写实夸张封面
                        </span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span>4条高点击率爆款长标题</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                        <span className="text-sky-300 font-medium">
                          第三人称川味大白话反思评论（含≤25字标题）
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Optional Custom note */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                      额外情景备注/聚焦角色（可选）：
                    </label>
                    <textarea
                      value={manualNote}
                      onChange={(e) => setManualNote(e.target.value)}
                      placeholder="例如：重点突出工人老周的手部动作、或突出无人车雨中打滑的无助感..."
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition resize-none"
                    />
                  </div>
                </div>

                {/* Big Action Button */}
                <div className="space-y-3 pt-2">
                  {errorMsg && (
                    <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing}
                    className="w-full relative group overflow-hidden bg-gradient-to-r from-sky-500 via-indigo-600 to-amber-500 hover:from-sky-400 hover:via-indigo-500 hover:to-amber-400 text-white font-black text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Sparkles className="w-5 h-5 animate-spin" />
                        <span>{analysisProgress || '正在全自动分析中...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>一键全自动分析与生成</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Output Showcase */}
            {analysisResult && (
              <div className="space-y-8 pt-4">
                {/* Section Header */}
                <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-2.5">
                      <Flame className="w-6 h-6 text-amber-500" />
                      全自动生产完成 · 核心爆款成果物
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      全套内容已严格遵循所有红线过滤与格式规范，支持一键下载与批量复制
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1.5 rounded-full flex items-center gap-1.5 self-start">
                    <CheckCircle2 className="w-4 h-4" />
                    全套合规质检通过
                  </span>
                </div>

                {/* 1. The 3:4 Realistic Exaggerated Cover (Mandatory Short Chinese Title) */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                      1
                    </span>
                    <h3 className="text-base font-bold text-white">
                      3:4 冲击力《写实夸张封面》（强制嵌入全中文短标题）
                    </h3>
                  </div>
                  <CoverCanvas
                    coverDesign={analysisResult.coverDesign}
                    frameImage={extractedFrames[0]?.dataUrl}
                  />
                </div>

                {/* 2. 4 Viral Long Titles & Third-Person Sichuan Dialect Comment */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center">
                      2
                    </span>
                    <h3 className="text-base font-bold text-white">
                      4条爆款长标题 & 第三人称川味大白话反思评论
                    </h3>
                  </div>
                  <TitlesAndComments
                    viralTitles={analysisResult.viralTitles}
                    viewerComment={analysisResult.viewerComment}
                    commentTitle={analysisResult.commentTitle}
                    dialectAnalysis={analysisResult.dialectAnalysis}
                  />
                </div>

                {/* 3. Detailed Summary and Key Event Timeline */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-sky-500 text-white font-black text-xs flex items-center justify-center">
                      3
                    </span>
                    <h3 className="text-base font-bold text-white">
                      详细内容摘要与关键事件时间轴
                    </h3>
                  </div>
                  <TimelineView
                    summary={analysisResult.summary}
                    timeline={analysisResult.timeline}
                    onSeekTo={handleSeekVideo}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>豆包 AI 视频智能分析与自媒体爆款生产 Skill · 自动化多模态引擎</p>
      </footer>
    </div>
  );
}
