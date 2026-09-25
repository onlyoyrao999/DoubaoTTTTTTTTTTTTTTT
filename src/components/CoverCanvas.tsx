import React, { useRef, useEffect, useState } from 'react';
import {
  Download,
  Sparkles,
  Copy,
  Check,
  Palette,
  RefreshCw,
  Camera,
  ShieldAlert,
  Smile,
  Layers,
  Sparkle,
  Mic,
  Volume2,
  Edit3,
  UserCheck,
  Flame,
  Crown,
  MoveVertical,
  Eye,
  Sliders,
} from 'lucide-react';
import { CoverDesign, ExtractedFrame } from '../types';

interface CoverCanvasProps {
  coverDesign: CoverDesign;
  frameImage?: string;
  themeColor?: string;
  availableFrames?: ExtractedFrame[];
  onSelectFrame?: (dataUrl: string) => void;
  onSnapshotVideo?: () => void;
  cartoon3dImage?: string;
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
  availableFrames = [],
  onSelectFrame,
  onSnapshotVideo,
  cartoon3dImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<CoverTheme>('hazard');
  // Visual Mode: 'realistic' (Captured Video Frame) vs '3d-cartoon' (Stylized 3D Avatar for sensitive/violent content)
  const [artMode, setArtMode] = useState<'realistic' | '3d-cartoon'>(
    coverDesign.styleMode || 'realistic'
  );

  // Dual-track Title Source: 'visual_action' (无口播，纯看画面动作) vs 'voiceover' (有口播，提炼对白金句)
  const [titleSourceMode, setTitleSourceMode] = useState<'visual_action' | 'voiceover'>(
    coverDesign.titleSource === 'voiceover' ? 'voiceover' : 'visual_action'
  );
  const [currentShortTitle, setCurrentShortTitle] = useState<string>(
    coverDesign.shortTitle || '当场破防！'
  );
  const [currentSubtitle, setCurrentSubtitle] = useState<string>(
    coverDesign.subtitle || '30年老钳工突袭测试 · 机械臂3秒精准复测'
  );
  // Subtitle placement: 'bottom_bar' (默认：封面底部独立横条 - 爆款短视频标配) | 'attached' (紧跟主标题下方)
  const [subtitlePlacement, setSubtitlePlacement] = useState<'bottom_bar' | 'attached'>('bottom_bar');

  // Dynamic Visual Composition Title Position: 'top' | 'upper_middle' | 'middle' | 'bottom'
  const [titlePosition, setTitlePosition] = useState<'top' | 'upper_middle' | 'middle' | 'bottom'>(
    coverDesign.titlePosition || 'top'
  );
  const [customOffsetY, setCustomOffsetY] = useState<number>(0);

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedDoubaoDraw, setCopiedDoubaoDraw] = useState(false);
  const [copied3dPrompt, setCopied3dPrompt] = useState(false);
  const [copied1to1Prompt, setCopied1to1Prompt] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  // Sync art mode & title if coverDesign changes
  useEffect(() => {
    if (coverDesign.styleMode) {
      setArtMode(coverDesign.styleMode);
    }
    if (coverDesign.shortTitle) {
      setCurrentShortTitle(coverDesign.shortTitle);
    }
    if (coverDesign.subtitle !== undefined) {
      setCurrentSubtitle(coverDesign.subtitle);
    }
    if (coverDesign.titleSource) {
      setTitleSourceMode(coverDesign.titleSource === 'voiceover' ? 'voiceover' : 'visual_action');
    }
    if (coverDesign.titlePosition) {
      setTitlePosition(coverDesign.titlePosition);
    }
  }, [coverDesign]);

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
        overlayGrad.addColorStop(0.25, 'rgba(0, 0, 0, 0.2)');
        overlayGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.35)');
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

      // 2. Dynamic positioning according to visual composition (依画面构图智能决定，避让人脸与核心动作)
      const is3D = artMode === '3d-cartoon';
      const badgeText = is3D
        ? '3D仿真人卡通 · 避险降敏'
        : coverDesign.badgeText || '现场实录 · 深度反转';

      let baseBannerY = 160;
      let baseBadgeY = 70;
      let expBoxY = height - 310;
      let expBoxHeight = 170;

      if (titlePosition === 'upper_middle') {
        baseBannerY = 360;
        baseBadgeY = 275;
        expBoxY = height - 260;
        expBoxHeight = 150;
      } else if (titlePosition === 'middle') {
        baseBannerY = 510;
        baseBadgeY = 425;
        expBoxY = height - 250;
        expBoxHeight = 140;
      } else if (titlePosition === 'bottom') {
        baseBannerY = 780;
        baseBadgeY = 695;
        // When title is at bottom, move expression box to top to keep character face clean & visible
        expBoxY = 65;
        expBoxHeight = 150;
      }

      // 3. MANDATORY CHINESE MAIN TITLE + SUBTITLE (双层主副标题架构：大字主标题 + 小字副标题)
      const title = currentShortTitle || coverDesign.shortTitle || '当场破防！';
      const subTitle = currentSubtitle !== undefined ? currentSubtitle : (coverDesign.subtitle || '');
      const hasSubtitle = Boolean(subTitle && subTitle.trim().length > 0);
      const isSubtitleAttached = hasSubtitle && subtitlePlacement === 'attached';
      const isSubtitleAtBottom = hasSubtitle && subtitlePlacement === 'bottom_bar';

      const bannerHeight = isSubtitleAttached ? 220 : 170;
      const bannerY = Math.max(60, Math.min(height - (isSubtitleAttached ? 290 : 240), baseBannerY + customOffsetY));
      const badgeY = Math.max(10, Math.min(height - 310, baseBadgeY + customOffsetY));

      ctx.font = 'bold 28px sans-serif';
      const badgeWidth = ctx.measureText(badgeText).width + 50;
      const badgeX = (width - badgeWidth) / 2;

      ctx.fillStyle = is3D ? '#0284c7' : theme.badgeBg;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, 52, 10);
      ctx.fill();

      // Badge border glow
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, width / 2, badgeY + 26);

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

      // 3A. MAIN TITLE RENDERING (主标题醒目大字)
      const maxTitleWidth = width * 0.9 * 0.72;
      let fontSize = isSubtitleAttached ? 84 : 94;
      ctx.font = `900 ${fontSize}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
      let textWidth = ctx.measureText(title).width;

      while (textWidth > maxTitleWidth && fontSize > 28) {
        fontSize -= 3;
        ctx.font = `900 ${fontSize}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
        textWidth = ctx.measureText(title).width;
      }

      const titleY = isSubtitleAttached ? -bannerHeight * 0.18 : 0;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Text 3D bottom extrusion
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillText(title, 0, titleY + Math.max(4, fontSize * 0.08));

      // Main Text Fill
      ctx.fillStyle = theme.textColor;
      ctx.fillText(title, 0, titleY);

      // Crisp contrast stroke
      ctx.strokeStyle = theme.strokeColor;
      ctx.lineWidth = Math.max(2, fontSize * 0.05);
      ctx.strokeText(title, 0, titleY);

      // 3B. SUBTITLE RENDERING (副标题小字 - 紧随主标题模式)
      if (isSubtitleAttached) {
        const subY = bannerHeight * 0.25;
        let subFontSize = 30;
        const maxSubWidth = width * 0.9 * 0.82;
        ctx.font = `bold ${subFontSize}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
        let subWidth = ctx.measureText(subTitle).width;

        while (subWidth > maxSubWidth && subFontSize > 18) {
          subFontSize -= 2;
          ctx.font = `bold ${subFontSize}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
          subWidth = ctx.measureText(subTitle).width;
        }

        // Subtitle container pill
        const subPillWidth = Math.min(width * 0.82, subWidth + 40);
        const subPillHeight = Math.max(38, subFontSize + 14);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.52)';
        ctx.beginPath();
        ctx.roundRect(-subPillWidth / 2, subY - subPillHeight / 2, subPillWidth, subPillHeight, 10);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Subtitle Text Fill
        ctx.fillStyle = '#FEF08A';
        ctx.font = `bold ${subFontSize}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 6;
        ctx.fillText(subTitle, 0, subY);
      }

      ctx.restore();

      // 3C. SUBTITLE RENDERING (副标题小字 - 封面底部经典解说条模式 / 爆款短视频标配)
      if (isSubtitleAtBottom) {
        const subBarY = titlePosition === 'bottom' ? expBoxY + expBoxHeight + 20 : height - 175;
        const subBarHeight = 64;
        const subBarWidth = width - 80;
        const subBarX = 40;

        ctx.save();
        // Drop shadow for bottom subtitle bar
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 8;

        // Gradient dark bar background
        const grad = ctx.createLinearGradient(subBarX, subBarY, subBarX + subBarWidth, subBarY);
        grad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
        grad.addColorStop(0.5, 'rgba(2, 6, 23, 0.98)');
        grad.addColorStop(1, 'rgba(15, 23, 42, 0.95)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(subBarX, subBarY, subBarWidth, subBarHeight, 16);
        ctx.fill();

        // Gold border stroke
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Left Tag Badge: 【剧情速递】
        const tagText = '● 关键反转';
        ctx.font = 'bold 20px "Noto Sans SC", sans-serif';
        const tagWidth = ctx.measureText(tagText).width + 24;
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.roundRect(subBarX + 16, subBarY + 12, tagWidth, subBarHeight - 24, 8);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '900 18px "Noto Sans SC", sans-serif';
        ctx.fillText(tagText, subBarX + 16 + tagWidth / 2, subBarY + subBarHeight / 2);

        // Subtitle Text beside tag
        const availableTextWidth = subBarWidth - tagWidth - 60;
        let subFontSize = 26;
        ctx.font = `bold ${subFontSize}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
        let subWidth = ctx.measureText(subTitle).width;

        while (subWidth > availableTextWidth && subFontSize > 16) {
          subFontSize -= 2;
          ctx.font = `bold ${subFontSize}px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`;
          subWidth = ctx.measureText(subTitle).width;
        }

        ctx.fillStyle = '#FEF08A';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 8;
        ctx.fillText(subTitle, subBarX + tagWidth + 30, subBarY + subBarHeight / 2);

        ctx.restore();
      }

      // 4. Character Expression / 3D Stylized Label (位置根据标题自适应排布)
      ctx.fillStyle = 'rgba(10, 15, 25, 0.85)';
      ctx.beginPath();
      ctx.roundRect(40, expBoxY, width - 80, expBoxHeight, 16);
      ctx.fill();

      ctx.strokeStyle = is3D ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label: 模式标识
      ctx.fillStyle = is3D ? '#38bdf8' : '#94A3B8';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(
        is3D ? '【3D仿真人卡通神态 · 规避违规】' : '【原片自动截帧垫图 · 真实人物表情】',
        65,
        expBoxY + 22
      );

      // Expression content
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '500 24px sans-serif';
      const maxTextWidth = width - 150;
      const desc = is3D
        ? `3D Pixar仿真人质感：${coverDesign.characterExpression} (避免真人敏感内容违规)`
        : coverDesign.characterExpression || '沿用原片自动截帧真实面容与表情：眼神震颤，下意识动作紧绷，100%源自原片实况抓拍';

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
      ctx.fillText(
        is3D ? '3:4 比例超清封面 · 3D仿真人模式' : '3:4 比例超清封面 · 视频实况截取设计',
        50,
        footerY + 20
      );

      ctx.fillStyle = is3D ? '#38bdf8' : '#fbbf24';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('高点击率 · 视觉核弹', width - 50, footerY + 20);

      setIsRendering(false);
    };

    // Determine which image to load based on artMode
    const activeImageSrc = artMode === '3d-cartoon' && cartoon3dImage ? cartoon3dImage : frameImage;

    if (activeImageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => renderLayers(img);
      img.onerror = () => renderLayers();
      img.src = activeImageSrc;
    } else {
      renderLayers();
    }
  };

  useEffect(() => {
    drawCover();
  }, [coverDesign, frameImage, cartoon3dImage, selectedTheme, artMode, currentShortTitle, currentSubtitle, subtitlePlacement, titlePosition, customOffsetY]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `3比4${artMode === '3d-cartoon' ? '3D仿真人' : '实况写实'}封面_${coverDesign.shortTitle || '爆款'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyPrompt = () => {
    const promptText = `【3:4真实写实封面 Prompt】\n中文提示词：\n${coverDesign.promptChinese || coverDesign.visualDescription}\n\n英文生成提示词（可用于 Midjourney / 豆包文生图 / SD）：\n${coverDesign.promptEnglish}`;
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleCopyDoubaoDraw = () => {
    const is3D = artMode === '3d-cartoon';
    const stylePrefix = is3D
      ? '3D Pixar风格的仿真人高品质CG动画封面海报（规避暴力杂乱真实违规）'
      : '真人写实风格电影级封面海报';

    const positionDesc =
      titlePosition === 'bottom'
        ? '画面底部空白留白处（尽量写在空白处，严禁遮挡人物人脸与眼神）'
        : titlePosition === 'middle'
        ? '画面居中留白空白处（避开人脸）'
        : titlePosition === 'upper_middle'
        ? '画面中上留白空白处（避开人脸）'
        : '画面顶部空白留白处（尽量写在空白处，严禁遮挡人物人脸与眼神）';

    const titleText = currentSubtitle
      ? `醒目大字印上主标题“${currentShortTitle || coverDesign.shortTitle || '当场破防！'}”，并在${subtitlePlacement === 'bottom_bar' ? '封面底部横条' : '主标题下方'}排版副标题小字“${currentSubtitle}”`
      : `用醒目加粗艺术字体印上封面标题“${currentShortTitle || coverDesign.shortTitle || '当场破防！'}”`;

    const doubaoDrawPrompt = `@豆包 帮我画一张3:4比例的${stylePrefix}：画面主体为特写人物，采用真人写真纪实质感，面部表情不用刻意夸张，注重还原截图中很原始自然的真实神情与生活微表情：${coverDesign.characterExpression}；在${positionDesc}${titleText}（标题不限制字数，双层主副排版，尽量写在空白处，不在他人脸就行）；电影级景深光影，真实感拉满！`;
    navigator.clipboard.writeText(doubaoDrawPrompt);
    setCopiedDoubaoDraw(true);
    setTimeout(() => setCopiedDoubaoDraw(false), 2500);
  };

  const handleCopy3dPrompt = () => {
    const positionDesc =
      titlePosition === 'bottom'
        ? '画面底部留白空白处（沉底排版，严禁遮挡面部或关键道具）'
        : titlePosition === 'middle'
        ? '画面正中视觉冲击位（避开人脸）'
        : titlePosition === 'upper_middle'
        ? '画面中上留白空白处（避开人脸）'
        : '画面顶部留白空白处（置顶排版，避免遮挡中下部人物动作）';

    const titleText = currentSubtitle
      ? `印上主标题大字“${currentShortTitle || coverDesign.shortTitle || '当场破防！'}”并在${subtitlePlacement === 'bottom_bar' ? '封面底部横条' : '主标题下方'}印上副标题小字“${currentSubtitle}”`
      : `印上封面标题“${currentShortTitle || coverDesign.shortTitle || '当场破防！'}”`;

    const prompt3d = `@豆包 请用3D卡通仿真人形式重新绘制生成3:4封面：画面人物为逼真3D动画角色，真实还原生活神情，避开血腥暴力，在${positionDesc}${titleText}（标题不限制字数，双层主副排版，尽量写在空白处，不在他人脸就行）。提示词：${coverDesign.cartoon3dPrompt || '3D stylized CGI character, Pixar style, high details, cinematic lighting.'}`;
    navigator.clipboard.writeText(prompt3d);
    setCopied3dPrompt(true);
    setTimeout(() => setCopied3dPrompt(false), 2500);
  };

  const handleCopy1to1Prompt = () => {
    const positionDesc =
      titlePosition === 'bottom'
        ? '画面底部空白留白处（排版尽量写在空白处，绝不能遮挡他的人脸和眼睛）'
        : titlePosition === 'middle'
        ? '画面居中空白处（避开人脸）'
        : titlePosition === 'upper_middle'
        ? '画面中上空白处（避开人脸）'
        : '画面顶部空白留白处（排版尽量写在空白处，绝不能遮挡他的人脸和眼睛）';

    const titleText = currentSubtitle
      ? `醒目大字印上主标题“${currentShortTitle}”，并在${subtitlePlacement === 'bottom_bar' ? '封面底部横条' : '主标题下方'}排版副标题小字“${currentSubtitle}”`
      : `醒目大字印上封面标题“${currentShortTitle}”`;

    const prompt1to1 = `@豆包 【核心铁律：自动截取的这张图必须用于垫图重新生成！】请务必以我上传的这张视频原片自动截图为垫图底图（以图生图重新生成）：必须采用真人写实画风，严格 1:1 还原截图中人物的真实面孔、五官特征、皮肤质感与衣着细节（严禁脱离本图凭空乱画假人！）；面部表情不用刻意夸张，完全还原截图本身的原始真实生活表情与自然微表情；在${positionDesc}${titleText}（标题不要去限制多少字，大字主标题+小字副标题双层层次，依内容自然精炼表达；尽量写在空白处，不在他的人脸就行！），重新生成 3:4 比例超清真人写实电影质感封面海报！`;
    navigator.clipboard.writeText(prompt1to1);
    setCopied1to1Prompt(true);
    setTimeout(() => setCopied1to1Prompt(false), 2500);
  };

  const handleDownloadRawUnderlay = () => {
    if (!frameImage) return;
    const link = document.createElement('a');
    link.download = `原片自动截帧垫图_${coverDesign.recommendedFrameTimestamp || '高潮分镜'}.jpg`;
    link.href = frameImage;
    link.click();
  };

  const handleCopyRawUnderlayToClipboard = async () => {
    if (!frameImage) return;
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = frameImage;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.naturalWidth || img.width;
      tempCanvas.height = img.naturalHeight || img.height;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        tempCanvas.toBlob(async (blob) => {
          if (blob && navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopiedImage(true);
            setTimeout(() => setCopiedImage(false), 2500);
          } else {
            handleDownloadRawUnderlay();
          }
        }, 'image/png');
      }
    } catch {
      handleDownloadRawUnderlay();
    }
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
            <span className="font-semibold text-white text-sm">
              {artMode === '3d-cartoon' ? '3D仿真人竖版封面' : '真实写实竖版封面'}
            </span>
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

        {/* Export Raw Captured Snapshot Underlay */}
        {frameImage && (
          <button
            onClick={handleDownloadRawUnderlay}
            className="mt-2 w-full flex items-center justify-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs py-2 px-3 rounded-xl border border-slate-700 transition active:scale-[0.98]"
            title="导出当前全自动截取的原片高清底图，无文字覆盖"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            导出当前自动截帧原图 (纯净无字垫图)
          </button>
        )}
      </div>

      {/* Control & Details Side Panel */}
      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Mandatory Short Title Highlight with Dual-Track Adaptation */}
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 mb-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-2.5">
              <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3:4 封面短标题 · 双轨自适应设计</span>
              </div>

              {/* Dual-Track Source Switcher */}
              <div className="flex items-center gap-1 bg-black/50 p-1 rounded-lg border border-amber-500/30 text-[11px]">
                <button
                  onClick={() => {
                    setTitleSourceMode('visual_action');
                    if (titleSourceMode === 'voiceover') {
                      setCurrentShortTitle('当场破防！');
                    }
                  }}
                  className={`px-2 py-1 rounded font-medium flex items-center gap-1 transition ${
                    titleSourceMode === 'visual_action'
                      ? 'bg-amber-500 text-black font-bold shadow'
                      : 'text-amber-300/70 hover:text-white'
                  }`}
                >
                  <Camera className="w-3 h-3" />
                  无口播 · 纯画面动作
                </button>
                <button
                  onClick={() => {
                    setTitleSourceMode('voiceover');
                    if (titleSourceMode === 'visual_action') {
                      setCurrentShortTitle(coverDesign.voiceoverQuote ? `${coverDesign.voiceoverQuote.slice(0, 5)}！` : '真敢硬刚？');
                    }
                  }}
                  className={`px-2 py-1 rounded font-medium flex items-center gap-1 transition ${
                    titleSourceMode === 'voiceover'
                      ? 'bg-sky-500 text-black font-bold shadow'
                      : 'text-amber-300/70 hover:text-white'
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  有口播 · 提炼台词金句
                </button>
              </div>
            </div>

            {/* Current Title & Subtitle Dual-Track Live Edit */}
            <div className="space-y-3">
              {/* Main Title Input (大字) */}
              <div>
                <div className="flex items-center justify-between mb-1 text-[11px] text-amber-300/80">
                  <span className="flex items-center gap-1">
                    <span className="bg-amber-500 text-black font-extrabold px-1.5 py-0.5 rounded text-[10px]">大字</span>
                    <strong>主标题</strong>
                    {titleSourceMode === 'voiceover' ? '（提取原声冲突金句）' : '（纯画面动作反转）'}
                  </span>
                  <span className="text-[11px] text-amber-300/90 font-medium">
                    ✨ 不限字数 · 字号自适应
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={currentShortTitle}
                    onChange={(e) => setCurrentShortTitle(e.target.value)}
                    placeholder="输入主标题大字（如：当场破防！、一杠救命！、真敢硬刚？）..."
                    className="w-full bg-slate-950/90 border-2 border-amber-500/60 focus:border-amber-400 text-amber-100 font-black text-xl sm:text-2xl px-3 py-2 rounded-xl focus:outline-none tracking-wider shadow-inner"
                  />
                  <Edit3 className="w-4 h-4 text-amber-400/60 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Subtitle Input (小字) */}
              <div>
                <div className="flex items-center justify-between mb-1 text-[11px] text-amber-300/80">
                  <span className="flex items-center gap-1">
                    <span className="bg-amber-900/90 text-amber-200 border border-amber-600 font-bold px-1.5 py-0.5 rounded text-[10px]">小字</span>
                    <strong>副标题（补充说明/剧情反转）</strong>
                  </span>
                  <span className="text-[11px] text-amber-300/70">
                    {currentSubtitle ? '双层排版已启用' : '（留空则为单层大字）'}
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={currentSubtitle}
                    onChange={(e) => setCurrentSubtitle(e.target.value)}
                    placeholder="输入副标题小字（如：30年老钳工突袭测试 · 机械臂3秒精准复测）..."
                    className="w-full bg-slate-950/90 border border-amber-500/40 focus:border-amber-400 text-amber-200 font-medium text-xs sm:text-sm px-3 py-2 rounded-xl focus:outline-none tracking-wide shadow-inner"
                  />
                  {currentSubtitle && (
                    <button
                      onClick={() => setCurrentSubtitle('')}
                      className="absolute right-2.5 top-2 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2 py-1 rounded"
                    >
                      清空
                    </button>
                  )}
                </div>

                {/* Subtitle Placement Toggle */}
                {currentSubtitle && (
                  <div className="mt-2 bg-slate-950/60 p-2 rounded-xl border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
                    <span className="text-[11px] text-amber-300/90 font-medium flex items-center gap-1">
                      <span>📐 副标题位置：</span>
                    </span>
                    <div className="flex gap-1.5 w-full sm:w-auto">
                      <button
                        onClick={() => setSubtitlePlacement('bottom_bar')}
                        className={`flex-1 sm:flex-none text-[11px] py-1 px-2.5 rounded-lg border font-bold transition flex items-center justify-center gap-1 ${
                          subtitlePlacement === 'bottom_bar'
                            ? 'bg-amber-400 text-black border-amber-300 shadow-md'
                            : 'bg-slate-900/90 text-amber-200/70 border-slate-700 hover:border-amber-500/50'
                        }`}
                        title="顶部大字抓眼球，底部黑金解说条交代背景剧情，短视频爆款标准构图"
                      >
                        <span>📌 封面底部横条（推荐·爆款标配）</span>
                      </button>
                      <button
                        onClick={() => setSubtitlePlacement('attached')}
                        className={`flex-1 sm:flex-none text-[11px] py-1 px-2.5 rounded-lg border font-bold transition flex items-center justify-center gap-1 ${
                          subtitlePlacement === 'attached'
                            ? 'bg-amber-400 text-black border-amber-300 shadow-md'
                            : 'bg-slate-900/90 text-amber-200/70 border-slate-700 hover:border-amber-500/50'
                        }`}
                        title="将副标题小字紧贴主标题大字下方，组合在同一标题卡片中"
                      >
                        <span>📎 紧跟主标题下方</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Candidate Preset Chips */}
            <div className="space-y-2">
              <div>
                <div className="text-[11px] text-amber-400/90 font-medium mb-1.5 flex items-center gap-1">
                  <span>⚡ 常用【主标题大字】快速备选：</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(titleSourceMode === 'visual_action'
                    ? ['反手递尺！', '一杠救命！', '当场破防！', '火勺翻飞！', '直接掀桌！', '三秒打脸！']
                    : ['真敢硬刚？', '这单我不接！', '卡尺不认人！', '凭啥算力强？', '别逼我动手！', '尊严砸了？']
                  ).map((t) => (
                    <button
                      key={t}
                      onClick={() => setCurrentShortTitle(t)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition font-bold ${
                        currentShortTitle === t
                          ? 'bg-amber-400 text-black border-amber-300 shadow'
                          : 'bg-black/40 border-amber-500/30 text-amber-200 hover:border-amber-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-amber-400/90 font-medium mb-1.5 flex items-center gap-1">
                  <span>⚡ 常用【副标题小字】快速备选：</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '30年老钳工突袭测试 · 机械臂3秒精准复测',
                    '暴雨无人车失控打滑 · 卖菜大叔舍身顶轮',
                    '20年掌勺被芯片取代 · 蹲在后门点烟出神',
                    '全车间瞬间鸦雀无声',
                    '下意识愣在原地3秒',
                    '一根旧扁担救了全场',
                  ].map((st) => (
                    <button
                      key={st}
                      onClick={() => setCurrentSubtitle(st)}
                      className={`text-[11px] px-2 py-0.5 rounded-lg border transition ${
                        currentSubtitle === st
                          ? 'bg-amber-900/90 text-amber-200 border-amber-400 font-bold'
                          : 'bg-black/30 border-amber-500/20 text-slate-300 hover:text-white hover:border-amber-500/40'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-amber-300/70 leading-relaxed border-t border-amber-500/20 pt-2">
              💡 自适应机制：<strong>有口播就抓金句，没口播就抓画面动作</strong>。标题实时同步绘制到 3:4 超清封面画板，无需人工二开！
            </p>
          </div>

          {/* Short Title Visual Position Controller: Dynamic based on visual composition */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-3 mb-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <MoveVertical className="w-3.5 h-3.5 text-amber-400" />
                <span>短标题排版位置（依画面构图动态调整 · 避让人脸）</span>
              </span>
              <span className="text-[10px] font-mono bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                {titlePosition === 'top'
                  ? '🔝 顶部留白位'
                  : titlePosition === 'upper_middle'
                  ? '⬆️ 中上焦点位'
                  : titlePosition === 'middle'
                  ? '🎯 居中黄金位'
                  : '⬇️ 底部沉底位 (防挡脸)'}
              </span>
            </div>

            {/* 4 Position Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'top', label: '🔝 顶部留白', desc: '人物主体在中下部' },
                { id: 'upper_middle', label: '⬆️ 中上焦点', desc: '视线汇聚偏上方' },
                { id: 'middle', label: '🎯 居中黄金位', desc: '上下对称留白' },
                { id: 'bottom', label: '⬇️ 底部沉底', desc: '★防遮挡人脸神技' },
              ].map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => {
                    setTitlePosition(pos.id as any);
                    setCustomOffsetY(0);
                  }}
                  className={`px-2 py-1.5 rounded-lg border text-left transition flex flex-col ${
                    titlePosition === pos.id
                      ? 'bg-amber-500 text-black border-amber-400 font-bold shadow'
                      : 'bg-black/50 border-slate-700 text-slate-300 hover:border-amber-400/60 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-semibold">{pos.label}</span>
                  <span
                    className={`text-[9px] ${
                      titlePosition === pos.id ? 'text-black/80 font-medium' : 'text-slate-400'
                    }`}
                  >
                    {pos.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Fine-tune Y offset Slider */}
            <div className="flex items-center gap-3 pt-1 border-t border-slate-800 text-[11px] text-slate-300">
              <span className="flex items-center gap-1 text-slate-400 flex-shrink-0">
                <Sliders className="w-3 h-3 text-amber-400" />
                垂直微调 (Y轴):
              </span>
              <input
                type="range"
                min={-120}
                max={120}
                step={5}
                value={customOffsetY}
                onChange={(e) => setCustomOffsetY(Number(e.target.value))}
                className="flex-1 accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="font-mono text-xs w-10 text-right text-amber-300">
                {customOffsetY > 0 ? `+${customOffsetY}` : customOffsetY}px
              </span>
              {customOffsetY !== 0 && (
                <button
                  onClick={() => setCustomOffsetY(0)}
                  className="text-[10px] text-slate-400 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700"
                >
                  重置
                </button>
              )}
            </div>

            {/* Composition Tip */}
            <div className="flex items-start gap-1.5 text-[11px] text-amber-200/80 bg-amber-950/30 p-2 rounded-lg border border-amber-500/20">
              <Eye className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="leading-snug">
                <strong>构图避让依据：</strong>
                <span>
                  {coverDesign.titlePositionReason ||
                    (titlePosition === 'bottom'
                      ? '已启用底部沉底排版：当人物面孔特写位于画面上方时，标题沉底确保眼神与五官表情 100% 完整可见！'
                      : '当人物主体集中在中下部时，短标题置顶可充分利用背景自然留白，视觉冲击力最佳。')}
                </span>
              </div>
            </div>
          </div>

          {/* Mode Switcher: 视频实况写实 vs 3D卡通仿真人 */}
          <div className="mb-4 bg-slate-950/90 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                封面形式与安全降敏：
              </span>
              {coverDesign.hasSensitiveContent && (
                <span className="text-[11px] text-rose-400 bg-rose-950/80 border border-rose-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  监测到敏感/剧烈内容，推荐3D卡通
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setArtMode('realistic')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-bold transition-all ${
                  artMode === 'realistic'
                    ? 'border-amber-400 bg-amber-950/40 text-amber-200 shadow'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4 text-amber-400" />
                <span>视频实况截取设计 (真实写实还原)</span>
              </button>

              <button
                onClick={() => setArtMode('3d-cartoon')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-bold transition-all ${
                  artMode === '3d-cartoon'
                    ? 'border-sky-400 bg-sky-950/40 text-sky-200 shadow'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <Smile className="w-4 h-4 text-sky-400" />
                <span>3D卡通仿真人 (防暴力/防乱套)</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              💡 规则提示：若视频含暴力冲突或杂乱画面，系统自动切换为<strong>【3D卡通仿真人】</strong>，保持原始真实神态的同时规避违规审查！
            </p>
          </div>

          {/* Video Frames Selector: 截取最适爆款分镜并1:1还原人物 */}
          {availableFrames.length > 0 && (
            <div className="mb-4 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  智能爆款选帧 · 截取最具点击张力的一帧做封面 (1:1还原人物)：
                </span>
                {onSnapshotVideo && (
                  <button
                    onClick={onSnapshotVideo}
                    className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 self-start sm:self-auto"
                  >
                    <Camera className="w-3 h-3" />
                    截取当前播放瞬时
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {availableFrames.map((f, i) => {
                  const isCurrent = frameImage === f.dataUrl;
                  const isViralBest = f.isRecommendedCover || (f.viralScore && f.viralScore >= 96);
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (onSelectFrame) onSelectFrame(f.dataUrl);
                        if (artMode === '3d-cartoon') setArtMode('realistic');
                      }}
                      className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all group ${
                        isCurrent
                          ? 'border-amber-400 ring-2 ring-amber-500/40 scale-105 shadow-lg'
                          : isViralBest
                          ? 'border-rose-500/80 hover:border-rose-400'
                          : 'border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-600'
                      }`}
                    >
                      <img src={f.dataUrl} alt="frame" className="w-full h-full object-cover" />
                      
                      {/* Viral Climax Tag */}
                      {isViralBest && (
                        <span className="absolute top-0.5 left-0.5 bg-gradient-to-r from-rose-600 to-amber-600 text-white text-[8px] font-black px-1 rounded flex items-center gap-0.5 shadow">
                          <Crown className="w-2.5 h-2.5" />
                          爆款推荐
                        </span>
                      )}

                      {/* Time stamp */}
                      <span className="absolute bottom-0.5 right-0.5 bg-black/80 font-mono text-[9px] text-white px-1 rounded">
                        {f.formattedTime}
                      </span>

                      {/* Viral Tension Score */}
                      {f.viralScore && (
                        <span className="absolute bottom-0.5 left-0.5 bg-black/75 text-amber-300 text-[8px] font-mono px-1 rounded">
                          {f.viralScore}分
                        </span>
                      )}

                      {isCurrent && (
                        <span className="absolute top-0.5 right-0.5 bg-amber-500 text-black text-[9px] font-black px-1 rounded">
                          当前底图
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Recommendation explanation */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1 text-amber-300">
                  <Flame className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <strong>爆款选帧逻辑：</strong>
                  <span>{coverDesign.recommendedFrameReason || '精准定位全片冲突反转高潮点，情绪张力最大，最易引发停留点击！'}</span>
                </span>
              </div>
            </div>
          )}

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

          {/* 1:1 Character Fidelity Lock & Visual Specification */}
          <div className="space-y-2.5 mb-4">
            {/* 1:1 Character Fidelity Card & Automated Underlay */}
            <div className="bg-emerald-950/50 border-2 border-emerald-500/60 rounded-xl p-3.5 text-xs space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-emerald-300 font-bold">
                <span className="flex items-center gap-1.5 text-sm">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  🔥 核心铁律：自动截取的图必须用于垫图重新生成！
                </span>
                <span className="text-[10px] bg-emerald-900/90 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-500 font-mono font-bold">
                  以图生图 · 强制垫图
                </span>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed">
                {coverDesign.characterTraits1to1 || '严禁脱离截图直接生图！系统已全自动截取视频高潮分镜，该图必须作为垫图底图（以图生图）重新生成 3:4 封面海报；必须忠实还原原片截图中人物微表情与生活真实神态（不用刻意夸张）；封面标题不限字数，字号自适应缩放，智能排布在画面空白处，绝不遮挡他的人脸！'}
              </p>
              <div className="pt-1.5 border-t border-emerald-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-300 font-medium">
                <span>✅ 必须以此自动截图为垫图底图重新生成</span>
                <span>✅ 还原截图表情不用夸张</span>
                <span>✅ 标题写在空白处避让人脸</span>
              </div>
            </div>

            {/* Character & Visual Specification */}
            <div className="space-y-3 bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-xs">
              <div>
                <span className="text-slate-400 font-semibold">
                  {artMode === '3d-cartoon' ? '3D仿真人角色设计：' : '原始自动截帧 · 人物真实表情与下意识神态：'}
                </span>
                <p className="text-slate-200 mt-0.5 leading-relaxed font-medium">
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
        </div>

        {/* Action Buttons: 垫图真人写实风格重绘 / 豆包文生图 / 3D防违规备选 */}
        <div className="pt-2 space-y-2.5">
          {/* Priority 1: Mandatory Image-to-Image with Auto-captured Underlay */}
          <button
            onClick={handleCopy1to1Prompt}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 hover:from-teal-500 hover:to-green-500 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg transition-all active:scale-[0.98] ring-2 ring-emerald-400/40"
          >
            {copied1to1Prompt ? (
              <>
                <Check className="w-5 h-5 text-white" />
                已复制【自动截图垫图 1:1 重新生成指令】(自动截取的图必须用于垫图重新生成)
              </>
            ) : (
              <>
                <UserCheck className="w-5 h-5 text-emerald-200" />
                一键复制【自动截图垫图 1:1 重新生成指令】(自动截取的图必须用于垫图重新生成)
              </>
            )}
          </button>

          {/* Underlay Image Delivery: Copy to Clipboard (Ctrl+V) & Direct Download */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={handleCopyRawUnderlayToClipboard}
              className="flex items-center justify-center gap-2 bg-indigo-950/80 hover:bg-indigo-900/90 text-indigo-200 border border-indigo-700/80 font-semibold text-xs py-2.5 px-3 rounded-xl transition-all shadow active:scale-[0.98]"
            >
              {copiedImage ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">已复制截图！去豆包直接 Ctrl+V 粘贴垫图</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-indigo-300" />
                  <span>复制截图到剪贴板 (直接 Ctrl+V 粘贴垫图)</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadRawUnderlay}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs py-2.5 px-3 rounded-xl transition-all"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>下载截图原图 (本地垫图文件上传)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCopyDoubaoDraw}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-xs py-2 px-3 rounded-xl transition-all"
            >
              {copiedDoubaoDraw ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>已复制文生图备用指令</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>复制文生图指令 (备用)</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyPrompt}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-300 border border-slate-800 text-xs font-medium py-2 px-3 rounded-xl transition-colors"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>已复制中英通用 Prompt</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>复制通用 Prompt (中/英文)</span>
                </>
              )}
            </button>
          </div>

          {artMode === '3d-cartoon' && (
            <button
              onClick={handleCopy3dPrompt}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-700 via-indigo-700 to-purple-700 hover:from-sky-600 hover:to-purple-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow transition-all active:scale-[0.98]"
            >
              {copied3dPrompt ? (
                <>
                  <Check className="w-4 h-4" />
                  已复制 3D 仿真人专属指令 (防暴力防违规)
                </>
              ) : (
                <>
                  <Smile className="w-4 h-4 text-sky-200" />
                  复制【3D仿真人专属指令】(打斗/敏感画面降敏防封)
                </>
              )}
            </button>
          )}

          <button
            onClick={handleCopyPrompt}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-300 border border-slate-800 text-[11px] font-medium py-1.5 px-4 rounded-xl transition-colors"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                已复制中英双语 Prompt
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                复制通用生图 Prompt (中/英文)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
