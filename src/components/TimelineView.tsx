import React, { useState } from 'react';
import { Clock, Activity, Play, ChevronRight, FileText, Copy, Check } from 'lucide-react';
import { TimelineItem } from '../types';

interface TimelineViewProps {
  summary: string;
  timeline: TimelineItem[];
  onSeekTo?: (seconds: number) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  summary,
  timeline,
  onSeekTo,
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const handleCopySummary = () => {
    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Detailed Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">详细内容摘要</h3>
              <p className="text-xs text-slate-400">视频全景情节剖析与核心冲突焦点</p>
            </div>
          </div>
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            {copiedSummary ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                已复制
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                复制摘要
              </>
            )}
          </button>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          {summary}
        </p>
      </div>

      {/* Structured Key Event Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">关键事件时间轴</h3>
              <p className="text-xs text-slate-400">时间节点、具体动作细节与戏剧张力递进</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
            共 {timeline.length} 个关键节点
          </span>
        </div>

        <div className="relative pl-6 space-y-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-sky-500 before:via-indigo-500 before:to-slate-800">
          {timeline.map((item, idx) => {
            const isHot = item.tension >= 90;
            return (
              <div
                key={idx}
                onClick={() => {
                  setActiveItem(idx);
                  if (onSeekTo && item.timeSec !== undefined) {
                    onSeekTo(item.timeSec);
                  }
                }}
                className={`relative group bg-slate-950/60 hover:bg-slate-800/80 border p-3.5 rounded-xl transition cursor-pointer ${
                  activeItem === idx
                    ? 'border-sky-500 bg-slate-800/90 shadow-md'
                    : 'border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-[1.85rem] top-4 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                    isHot
                      ? 'bg-rose-500 border-white shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                      : 'bg-sky-400 border-slate-950'
                  }`}
                />

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/80 border border-sky-800 px-2 py-0.5 rounded">
                      {item.timestamp}
                    </span>
                    <h4 className="text-white font-semibold text-sm group-hover:text-sky-300 transition">
                      {item.title}
                    </h4>
                  </div>

                  {/* Tension Meter */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 text-xs">
                    <Activity
                      className={`w-3.5 h-3.5 ${
                        isHot ? 'text-rose-400 animate-pulse' : 'text-slate-400'
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        isHot ? 'text-rose-400' : 'text-slate-400'
                      }`}
                    >
                      张力: {item.tension}%
                    </span>
                  </div>
                </div>

                {/* Specific Action Detail */}
                <p className="mt-2 text-xs text-slate-300 leading-relaxed pl-1 border-l-2 border-slate-700/60">
                  <span className="text-slate-400 font-medium">动作细节：</span>
                  {item.actionDetail}
                </p>

                {onSeekTo && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-sky-400/80 group-hover:text-sky-300 transition">
                    <Play className="w-3 h-3 fill-current" />
                    点击同步跳转画面
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
