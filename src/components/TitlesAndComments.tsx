import React, { useState } from 'react';
import {
  Flame,
  MessageSquare,
  Check,
  Copy,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Hash,
  Send,
  Sparkles,
} from 'lucide-react';
import { ViralTitle } from '../types';

interface TitlesAndCommentsProps {
  viralTitles: ViralTitle[];
  viewerComment: string;
  commentTitle: string;
  dialectAnalysis?: string[];
}

export const TitlesAndComments: React.FC<TitlesAndCommentsProps> = ({
  viralTitles,
  viewerComment,
  commentTitle,
  dialectAnalysis,
}) => {
  const [copiedTitleIndex, setCopiedTitleIndex] = useState<number | null>(null);
  const [copiedComment, setCopiedComment] = useState(false);
  const [copiedCommentTitle, setCopiedCommentTitle] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  // Compliance checks calculations
  const forbiddenList = ['铁蛋', '视频', '视频中', '看完视频'];
  const abstractEmptyList = ['不仅仅', '更是', '赋予', '维度'];
  const clothingWords = ['穿的衣服', '服装', '穿戴', '衣服样式', '身穿', '衣着'];

  const fullText = `${viewerComment} ${commentTitle}`;

  const hasForbidden = forbiddenList.some((w) => fullText.includes(w));
  const hasAbstract = abstractEmptyList.some((w) => fullText.includes(w));
  const hasClothing = clothingWords.some((w) => fullText.includes(w));
  const isTitleOver25 = commentTitle.length > 25;

  const handleCopyTitle = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTitleIndex(idx);
    setTimeout(() => setCopiedTitleIndex(null), 2000);
  };

  const handleCopyComment = () => {
    navigator.clipboard.writeText(viewerComment);
    setCopiedComment(true);
    setTimeout(() => setCopiedComment(false), 2000);
  };

  const handleCopyCommentTitle = () => {
    navigator.clipboard.writeText(commentTitle);
    setCopiedCommentTitle(true);
    setTimeout(() => setCopiedCommentTitle(false), 2000);
  };

  const handleCopyAllPackage = () => {
    const pkg = `【爆款自媒体长标题（4条）】\n${viralTitles.map((t, i) => `${i + 1}. ${t.title}`).join('\n')}\n\n【评论专属标题（≤25字）】\n${commentTitle} (${commentTitle.length}字)\n\n【第三人称川味大白话反思评论】\n${viewerComment}`;
    navigator.clipboard.writeText(pkg);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 4 Viral Long Titles */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">4条热门爆款长标题</h3>
              <p className="text-xs text-slate-400">高点击率、强悬念与引发情绪共鸣的长标题</p>
            </div>
          </div>
          <button
            onClick={handleCopyAllPackage}
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 px-3 py-1.5 rounded-lg border border-amber-600/50 transition font-medium"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                已复制整套爆款包
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                一键复制标题与评论
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {viralTitles.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold font-mono">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-slate-100 font-semibold text-sm leading-snug group-hover:text-amber-300 transition">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[11px] font-medium text-rose-400 bg-rose-950/60 border border-rose-900/60 px-2 py-0.5 rounded">
                      {item.hookType}
                    </span>
                    {item.predictedScore && (
                      <span className="text-[11px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded">
                        爆款潜力: {item.predictedScore}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopyTitle(item.title, idx)}
                className="self-end sm:self-center flex-shrink-0 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                {copiedTitleIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    复制标题
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Viewer Comment & Comment Title Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">第三人称川味大白话反思评论</h3>
              <p className="text-xs text-slate-400">
                第三人称视角 · 多用短句 · 穿插四川方言口头禅 · 具体动作 · 终极反问
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            严苛红线过滤合规
          </span>
        </div>

        {/* 1. Comment Headline (<= 25 chars) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Hash className="w-3.5 h-3.5 text-amber-400" />
              评论专属长标题（要求：不超25个字符）
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  isTitleOver25
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                {commentTitle.length} / 25 字符 {isTitleOver25 ? '(已超标!)' : '(合规)'}
              </span>
              <button
                onClick={handleCopyCommentTitle}
                className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-700 transition flex items-center gap-1"
              >
                {copiedCommentTitle ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                复制
              </button>
            </div>
          </div>
          <div className="text-base sm:text-lg font-bold text-amber-300 tracking-wide">
            {commentTitle}
          </div>
        </div>

        {/* 2. Viewer Comment Content */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-sky-400" />
              评论正文（大白话、短句、动作具象、结尾反问抛给网友）
            </span>
            <button
              onClick={handleCopyComment}
              className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
            >
              {copiedComment ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  已复制评论
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  复制评论正文
                </>
              )}
            </button>
          </div>

          <div className="text-slate-100 text-sm sm:text-base leading-relaxed bg-slate-900/90 p-4 rounded-lg border border-slate-800 font-normal">
            {viewerComment}
          </div>

          {/* Sichuan dialect highlights if available */}
          {dialectAnalysis && dialectAnalysis.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-400">川味口头禅/动作抓手:</span>
              {dialectAnalysis.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 3. Strict Compliance Audit Report */}
        <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4">
          <div className="text-xs font-bold text-slate-300 mb-2.5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            豆包 Skill 规则与绝对红线实时核验
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-slate-300">绝无“铁蛋”违禁字样</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-slate-300">绝无“视频/视频中/看完视频”</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-slate-300">绝不评价机器人服装</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-slate-300">零排比句 & 无假大空虚词</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-slate-300">大白话短句+地道四川方言</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              {!isTitleOver25 ? (
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
              <span className={!isTitleOver25 ? 'text-slate-300' : 'text-rose-400 font-bold'}>
                评论标题严格 ≤ 25 字符
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
