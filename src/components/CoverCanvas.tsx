import React, { useRef, useEffect, useState } from 'react';
import { Download, Sparkles, Copy, Check, Palette, Eye, RefreshCw } from 'lucide-react';
import { CoverDesign } from '../types';

interface CoverCanvasProps {
  coverDesign: CoverDesign;
  frameImage?: string;
  themeColor?: string;
}

type CoverTheme = 'hazard' | 'crimson' | 'darkgold' | 'cyber';

interface ThemeConfig {
  name: string;
  bgColor1: string;
  bgColor2: string;
  bannerBg: string;
  bannerBorder: string;
  textColor: string;
  strokeColor: string;
  badgeBg: string;
  badgeText: string;
}

const THEMES: Record<CoverTheme, ThemeConfig> = {
  hazard: {
    name: '警示亮黄 (高频吸睛)',
    bgColor1: '#111827',
    bgColor2: '#030712',
    bannerBg: '#EAB308',
    bannerBorder: '#CA8A04',
    textColor: '#000000',
    strokeColor: '#FEF08A',
    badgeBg: '#DC2626',
    badgeText: '#FFFFFF',
  },
  crimson: {
    name: '猩红风暴 (极端冲突)',
    bgColor1: '#3F0B13',
    bgColor2: '#0A0103',
    bannerBg: '#DC2626',
    bannerBorder: '#991B1B',
    textColor: '#FFFFFF',
    strokeColor: '#000000',
    badgeBg: '#F59E0B',
    badgeText: '#000000',
  },
  darkgold: {
    name: '极夜黑金 (电影纪实)',
    bgColor1: '#262013',
    bgColor2: '#0D0B08',
    bannerBg: '#F59E0B',
    bannerBorder: '#D97706',
    textColor: '#18181B',
    strokeColor: '#FEF3C7',
    badgeBg: '#78350F',
    badgeText: '#FDE68A',
  },
  cyber: {
    name: '赛博深蓝 (未来张力)',
    bgColor1: '#0B2239',
    bgColor2: '#020617',
    bannerBg: '#06B6D4',
    bannerBorder: '#0891B2',
    textColor: '#041628',
    strokeColor: '#E0F2FE',
    badgeBg: '#6366F1',
    badgeText: '#FFFFFF',
  },
};

export const CoverCanvas: React.FC<CoverCanvasProps> = ({
  coverDesign,
  frameImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<CoverTheme>('hazard');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  const drawCover = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRendering(true);

    // 3:4 vertical ratio: 900 x 1200 resolution
    const width = 900;
    const height = 1200;
    canvas.width = width;
    canvas.height = height;

    const theme = THEMES[selectedTheme];

    const renderLayers = (bgImg?: HTMLImageElement) => {
      // 1. Background Base
      if (bgImg) {
        // Draw image scaled to cover canvas 3:4
        const imgRatio = bgImg.width / bgImg.height;
        const targetRatio = width / height;
        let sWidth = bgImg.width;
        let sHeight = bgImg.height;
        let sx = 0;
        let sy = 0;

        if (imgRatio > targetRatio) {
          sWidth = bgImg.height * targetRatio;
          sx = (bgImg.width - sWidth) / 2;
        } else {
          sHeight = bgImg.width / targetRatio;
          sy = (bgImg.height - sHeight) / 2;
        }

        ctx.drawImage(bgImg, sx, sy, sWidth, sHeight, 0, 0, width, height);

        // Dark gradient & contrast overlay
        const overlayGrad = ctx.createLinearGradient(0, 0, 0, height);
        overlayGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
        overlayGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.2)');
        overlayGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.4)');
        overlayGrad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
        ctx.fillStyle = overlayGrad;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Procedural dramatic cinematic backdrop
        const grad = ctx.createRadialGradient(
          width / 2,
          height * 0.45,
          100,
          width / 2,
          height * 0.5,
          width * 0.8
        );
        grad.addColorStop(0, theme.bgColor1);
        grad.addColorStop(1, theme.bgColor2);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Realistic cinematic lens beam
        ctx.save();
        ctx.translate(width / 2, height * 0.35);
        ctx.rotate(-0.15);
        const lightBeam = ctx.createLinearGradient(-width, 0, width, 0);
        lightBeam.addColorStop(0, 'rgba(255, 255, 255, 0)');
        lightBeam.addColorStop(0.5, 'rgba(255, 255, 255, 0.12)');
        lightBeam.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = lightBeam;
        ctx.fillRect(-width, -120, width * 2, 240);
        ctx.restore();
      }

      // Vignette effect
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.4,
        width / 2,
        height / 2,
        width * 0.9
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // Top Warning Badge
      const badgeText = coverDesign.badgeText || '现场实录 · 深度反转';
      ctx.font = 'bold 28px sans-serif';
      const badgeWidth = ctx.measureText(badgeText).width + 50;
      const badgeX = (width - badgeWidth) / 2;
      const badgeY = 70;

      ctx.fillStyle = theme.badgeBg;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, 52, 10);
      ctx.fill();

      // Badge border glow
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = theme.badgeText;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, width / 2, badgeY + 26);

      // 3. MANDATORY CHINESE SHORT TITLE (强力全中文短标题)
      const title = coverDesign.shortTitle || '当场破防！';

      // Title Banner Background container
      const bannerHeight = 170;
      const bannerY = 160;

      ctx.save();
      // Slight aggressive tilt for impact (-2 degrees)
      ctx.translate(width / 2, bannerY + bannerHeight / 2);
      ctx.rotate(-0.025);

      // Drop shadow for the whole banner block
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 15;

      // Banner background
      ctx.fillStyle = theme.bannerBg;
      ctx.beginPath();
      ctx.roundRect(-width * 0.45, -bannerHeight / 2, width * 0.9, bannerHeight, 20);
      ctx.fill();

      // Banner border stroke
      ctx.strokeStyle = theme.bannerBorder;
      ctx.lineWidth = 6;
      ctx.stroke();

      // Black hazard slashes on sides
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      for (let i = -width * 0.43; i < -width * 0.35; i += 24) {
        ctx.fillRect(i, -bannerHeight / 2 + 10, 12, bannerHeight - 20);
      }
      for (let i = width * 0.35; i < width * 0.43; i += 24) {
        ctx.fillRect(i, -bannerHeight / 2 + 10, 12, bannerHeight - 20);
      }

      // Title text rendering
      // Dynamic font size depending on title length
      let fontSize = 92;
      if (title.length > 5) fontSize = 78;
      if (title.length > 7) fontSize = 66;

      ctx.font = `900 ${fontSize}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Text 3D bottom extrusion
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillText(title, 0, 8);

      // Main Text Fill
      ctx.fillStyle = theme.textColor;
      ctx.fillText(title, 0, 0);

      // Crisp contrast stroke
      ctx.strokeStyle = theme.strokeColor;
      ctx.lineWidth = 4;
      ctx.strokeText(title, 0, 0);

      ctx.restore();

      // 4. Character Expression & Realism Tag (Middle/Lower Area)
      const expBoxY = height - 310;
      const expBoxHeight = 170;

      ctx.fillStyle = 'rgba(10, 15, 25, 0.82)';
      ctx.beginPath();
      ctx.roundRect(40, expBoxY, width - 80, expBoxHeight, 16);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label: 写实人物张力
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('【写实夸张人物刻画】', 65, expBoxY + 22);

      // Expression content
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '500 24px sans-serif';
      const maxTextWidth = width - 150;
      const desc = coverDesign.characterExpression || '极度震撼神情，戏剧张力拉满，写实电影级质感';

      // Simple word wrapping
      const chars = desc.split('');
      let line = '';
      let lineY = expBoxY + 62;
      for (let n = 0; n < chars.length; n++) {
        const testLine = line + chars[n];
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxTextWidth && n > 0) {
          ctx.fillText(line, 65, lineY);
          line = chars[n];
          lineY += 34;
          if (lineY > expBoxY + expBoxHeight - 30) break;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 65, lineY);

      // 5. Bottom Footer / Quality Watermark
      const footerY = height - 85;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillRect(0, footerY - 15, width, 100);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('3:4 比例超清封面 · 豆包全自动写实生成', 50, footerY + 20);

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('高点击率 · 视觉核弹', width - 50, footerY + 20);

      setIsRendering(false);
    };

    if (frameImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => renderLayers(img);
      img.onerror = () => renderLayers();
      img.src = frameImage;
    } else {
      renderLayers();
    }
  };

  useEffect(() => {
    drawCover();
  }, [coverDesign, frameImage, selectedTheme]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `3比4写实夸张封面_${coverDesign.shortTitle || '爆款'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyPrompt = () => {
    const promptText = `【3:4写实夸张封面 Prompt】\n中文提示词：\n${coverDesign.promptChinese || coverDesign.visualDescription}\n\n英文生成提示词（可用于 Midjourney / 豆包文生图 / SD）：\n${coverDesign.promptEnglish}`;
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col xl:flex-row gap-6">
      {/* 3:4 Preview Container */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="flex items-center justify-between w-full mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-sm">
              3:4
            </span>
            <span className="font-semibold text-white text-sm">写实夸张竖版封面</span>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3" />
            强制嵌入中文短标题
          </span>
        </div>

        {/* Scaled Preview Box */}
        <div className="relative group w-[270px] sm:w-[300px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700 bg-black">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
          />
          {isRendering && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-white gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              正在渲染 3:4 封面...
            </div>
          )}
        </div>

        {/* Direct Download Button */}
        <button
          onClick={handleDownload}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm py-2.5 px-4 rounded-xl shadow-lg transition-all active:scale-[0.98]"
        >
          <Download className="w-4 h-4" />
          下载 3:4 高清封面 (900×1200)
        </button>
      </div>

      {/* Control & Details Side Panel */}
      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Mandatory Short Title Highlight */}
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 mb-4">
            <div className="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              封面核心爆点 · 全中文短标题（强制印于画面黄金位）
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-200 tracking-wider">
              {coverDesign.shortTitle || '当场破防！'}
            </div>
            <p className="text-xs text-amber-300/70 mt-1">
              字数短小精悍，视觉张力极强，直击下沉自媒体与全网用户第一眼神经
            </p>
          </div>

          {/* Theme Selector */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-sky-400" />
              封面视觉风格排版
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(THEMES) as CoverTheme[]).map((themeKey) => {
                const item = THEMES[themeKey];
                const isSelected = selectedTheme === themeKey;
                return (
                  <button
                    key={themeKey}
                    onClick={() => setSelectedTheme(themeKey)}
                    className={`flex items-center gap-2 text-left p-2 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-slate-800 text-white shadow'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0"
                      style={{ backgroundColor: item.bannerBg }}
                    />
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Character & Visual Specification */}
          <div className="space-y-3 bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-xs">
            <div>
              <span className="text-slate-400 font-semibold">人物夸张写实神态：</span>
              <p className="text-slate-200 mt-0.5 leading-relaxed">
                {coverDesign.characterExpression}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold">构图与光影张力：</span>
              <p className="text-slate-300 mt-0.5 leading-relaxed">
                {coverDesign.visualDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Copy Prompt for Doubao / Midjourney */}
        <div className="pt-2">
          <button
            onClick={handleCopyPrompt}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                已复制生图专业提示词 (Prompt)
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                一键复制 3:4 封面生图 Prompt (中/英双语)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
