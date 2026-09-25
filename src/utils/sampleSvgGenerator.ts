// High quality procedural SVG frame generator for sample scenarios
// Generates realistic photographic & cinematic 3D style frame previews

export function generateSampleFrameSvg(
  scenarioId: string,
  timestamp: string,
  mode: 'realistic' | '3d-cartoon' = 'realistic'
): string {
  if (mode === '3d-cartoon') {
    // 3D Cartoon / Stylized CGI Avatar version (for sensitive/action/dramatic scenes)
    if (scenarioId === 'factory-patrol') {
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="50%" stop-color="#0f172a"/>
            <stop offset="100%" stop-color="#020617"/>
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="skin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fed7aa"/>
            <stop offset="100%" stop-color="#f97316"/>
          </linearGradient>
          <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#e2e8f0"/>
            <stop offset="50%" stop-color="#64748b"/>
            <stop offset="100%" stop-color="#1e293b"/>
          </linearGradient>
        </defs>
        <rect width="900" height="1200" fill="url(#bg)"/>
        <circle cx="450" cy="500" r="400" fill="url(#glow)"/>
        
        <!-- Factory machinery silhouette background -->
        <path d="M50 700 L200 650 L200 900 L50 900 Z" fill="#1e293b" opacity="0.6"/>
        <path d="M700 600 L850 630 L850 950 L700 950 Z" fill="#1e293b" opacity="0.6"/>
        
        <!-- Stylized 3D Robot Sensor Laser -->
        <line x1="720" y1="520" x2="380" y2="580" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" opacity="0.8"/>
        <circle cx="720" cy="520" r="16" fill="#38bdf8"/>
        
        <!-- 3D Cartoon Stylized Character (Machinist) -->
        <!-- Torso -->
        <path d="M250 820 Q450 780 650 820 L680 1200 L220 1200 Z" fill="#1d4ed8"/>
        <!-- Neck -->
        <rect x="400" y="680" width="100" height="120" rx="30" fill="url(#skin)"/>
        <!-- Head -->
        <ellipse cx="450" cy="530" rx="170" ry="200" fill="url(#skin)"/>
        <!-- 3D Stylized Cap -->
        <path d="M270 450 C270 320 630 320 630 450 C660 460 670 480 650 490 L250 490 Z" fill="#0f172a"/>
        <!-- Exaggerated Shocked Eyes (Wide open 3D Pixar style) -->
        <ellipse cx="380" cy="520" rx="42" ry="52" fill="#ffffff"/>
        <ellipse cx="520" cy="520" rx="42" ry="52" fill="#ffffff"/>
        <circle cx="390" cy="520" r="22" fill="#1e293b"/>
        <circle cx="510" cy="520" r="22" fill="#1e293b"/>
        <circle cx="400" cy="510" r="8" fill="#ffffff"/>
        <circle cx="500" cy="510" r="8" fill="#ffffff"/>
        <!-- Tense Raised Eyebrows -->
        <path d="M330 460 Q380 430 420 450" stroke="#475569" stroke-width="12" stroke-linecap="round" fill="none"/>
        <path d="M570 460 Q520 430 480 450" stroke="#475569" stroke-width="12" stroke-linecap="round" fill="none"/>
        <!-- 3D Nose -->
        <path d="M450 520 L440 590 L465 590 Z" fill="#ea580c"/>
        <!-- Shocked O-shaped Mouth -->
        <ellipse cx="450" cy="640" rx="36" ry="46" fill="#7f1d1d"/>
        <ellipse cx="450" cy="640" rx="26" ry="36" fill="#450a0a"/>
        
        <!-- Hand holding Caliper tool in foreground -->
        <rect x="240" y="620" width="220" height="28" rx="6" transform="rotate(-25 350 630)" fill="url(#metal)"/>
        <circle cx="280" cy="690" r="60" fill="url(#skin)"/>
        
        <!-- Cyber/3D Badge -->
        <rect x="40" y="1120" width="820" height="60" rx="12" fill="#000000" opacity="0.6"/>
        <text x="450" y="1160" font-family="sans-serif" font-size="28" font-weight="bold" fill="#38bdf8" text-anchor="middle">
          ⚡ 3D仿真人高能抓拍 · 电影级角色模型
        </text>
      </svg>`;
    } else if (scenarioId === 'market-delivery') {
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
        <defs>
          <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0284c7"/>
            <stop offset="60%" stop-color="#0369a1"/>
            <stop offset="100%" stop-color="#082f49"/>
          </linearGradient>
          <linearGradient id="rain" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#bae6fd" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#0284c7" stop-opacity="0.1"/>
          </linearGradient>
        </defs>
        <rect width="900" height="1200" fill="url(#bg2)"/>
        <!-- Rain Streaks -->
        <line x1="100" y1="100" x2="80" y2="400" stroke="#bae6fd" stroke-width="3" opacity="0.4"/>
        <line x1="300" y1="50" x2="280" y2="350" stroke="#bae6fd" stroke-width="4" opacity="0.5"/>
        <line x1="550" y1="120" x2="530" y2="420" stroke="#bae6fd" stroke-width="3" opacity="0.4"/>
        <line x1="800" y1="80" x2="780" y2="380" stroke="#bae6fd" stroke-width="4" opacity="0.5"/>
        
        <!-- 3D Cartoon Hero Character Exerting Full Strength -->
        <ellipse cx="430" cy="520" rx="160" ry="190" fill="#fed7aa"/>
        <!-- Rain droplets on 3D face -->
        <circle cx="360" cy="480" r="10" fill="#e0f2fe" opacity="0.7"/>
        <circle cx="500" cy="460" r="12" fill="#e0f2fe" opacity="0.7"/>
        <!-- Grit Teeth Mouth (Exaggerated 3D) -->
        <path d="M360 630 Q430 600 500 630 Q430 670 360 630 Z" fill="#ffffff" stroke="#991b1b" stroke-width="6"/>
        <!-- Fierce Eyes -->
        <ellipse cx="370" cy="510" rx="35" ry="25" fill="#ffffff"/>
        <ellipse cx="490" cy="510" rx="35" ry="25" fill="#ffffff"/>
        <circle cx="380" cy="510" r="16" fill="#0f172a"/>
        <circle cx="480" cy="510" r="16" fill="#0f172a"/>
        
        <!-- Bamboo Pole 3D Element across screen -->
        <rect x="50" y="700" width="800" height="48" rx="16" transform="rotate(-18 450 720)" fill="#eab308" stroke="#ca8a04" stroke-width="6"/>
        
        <rect x="40" y="1120" width="820" height="60" rx="12" fill="#000000" opacity="0.6"/>
        <text x="450" y="1160" font-family="sans-serif" font-size="28" font-weight="bold" fill="#38bdf8" text-anchor="middle">
          ⚡ 3D仿真雨夜救援 · 夸张张力渲染
        </text>
      </svg>`;
    } else {
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
        <defs>
          <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#450a0a"/>
            <stop offset="60%" stop-color="#18181b"/>
            <stop offset="100%" stop-color="#09090b"/>
          </linearGradient>
        </defs>
        <rect width="900" height="1200" fill="url(#bg3)"/>
        <!-- Dramatic Fire/Flame Glow -->
        <circle cx="450" cy="500" r="380" fill="#f97316" opacity="0.3"/>
        
        <!-- 3D Chef Avatar -->
        <ellipse cx="450" cy="540" rx="160" ry="190" fill="#fed7aa"/>
        <!-- Chef Hat (Toque) 3D Cartoon -->
        <path d="M310 400 C310 220 590 220 590 400 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="6"/>
        <rect x="330" y="380" width="240" height="50" rx="10" fill="#f1f5f9"/>
        <!-- Tired / Pensive Eyes -->
        <ellipse cx="380" cy="530" rx="35" ry="20" fill="#ffffff"/>
        <ellipse cx="520" cy="530" rx="35" ry="20" fill="#ffffff"/>
        <circle cx="390" cy="530" r="14" fill="#18181b"/>
        <circle cx="510" cy="530" r="14" fill="#18181b"/>
        <!-- Cigarette Smoke Swirl 3D -->
        <path d="M480 640 Q540 600 520 520 Q500 450 560 380" stroke="#e2e8f0" stroke-width="12" stroke-linecap="round" fill="none" opacity="0.6"/>
        <rect x="440" y="635" width="50" height="12" rx="3" fill="#ffffff"/>
        <rect x="480" y="635" width="10" height="12" rx="2" fill="#ef4444"/>
        
        <rect x="40" y="1120" width="820" height="60" rx="12" fill="#000000" opacity="0.6"/>
        <text x="450" y="1160" font-family="sans-serif" font-size="28" font-weight="bold" fill="#f59e0b" text-anchor="middle">
          ⚡ 3D仿真烟火纪实 · 夸张市井角色
        </text>
      </svg>`;
    }
  }

  // Realistic Cinematic Captured Frame Version
  if (scenarioId === 'factory-patrol') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
      <defs>
        <radialGradient id="rg1" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="#451a03"/>
          <stop offset="40%" stop-color="#1c1917"/>
          <stop offset="100%" stop-color="#0c0a09"/>
        </radialGradient>
        <linearGradient id="laser" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#06b6d4" stop-opacity="0"/>
          <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="900" height="1200" fill="url(#rg1)"/>
      <!-- Background industrial textures -->
      <line x1="0" y1="480" x2="900" y2="480" stroke="url(#laser)" stroke-width="14"/>
      <!-- Cinematic Vignette & Gritty Machinery -->
      <circle cx="450" cy="500" r="280" fill="#000000" opacity="0.3"/>
      <!-- Realistic Weathered Worker Silhouette & Eye tension -->
      <ellipse cx="450" cy="550" rx="180" ry="220" fill="#292524" opacity="0.95"/>
      <ellipse cx="380" cy="520" rx="30" ry="38" fill="#ffffff" opacity="0.9"/>
      <ellipse cx="520" cy="520" rx="30" ry="38" fill="#ffffff" opacity="0.9"/>
      <circle cx="390" cy="520" r="16" fill="#000000"/>
      <circle cx="510" cy="520" r="16" fill="#000000"/>
      <!-- Laser reflection on iris -->
      <circle cx="394" cy="516" r="6" fill="#38bdf8"/>
      <circle cx="514" cy="516" r="6" fill="#38bdf8"/>
      <rect x="40" y="1120" width="820" height="60" rx="12" fill="#000000" opacity="0.6"/>
      <text x="450" y="1160" font-family="sans-serif" font-size="28" font-weight="bold" fill="#facc15" text-anchor="middle">
        📹 截取自真实视频分镜 · 超写实震撼特写
      </text>
    </svg>`;
  } else if (scenarioId === 'market-delivery') {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
      <defs>
        <radialGradient id="rg2" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="#0c4a6e"/>
          <stop offset="60%" stop-color="#082f49"/>
          <stop offset="100%" stop-color="#020617"/>
        </radialGradient>
      </defs>
      <rect width="900" height="1200" fill="url(#rg2)"/>
      <!-- Heavy Rain Lines -->
      <line x1="150" y1="0" x2="100" y2="1200" stroke="#7dd3fc" stroke-width="2" opacity="0.3"/>
      <line x1="450" y1="0" x2="400" y2="1200" stroke="#7dd3fc" stroke-width="3" opacity="0.4"/>
      <line x1="750" y1="0" x2="700" y2="1200" stroke="#7dd3fc" stroke-width="2" opacity="0.3"/>
      <!-- Strong Streetlight Glow -->
      <circle cx="500" cy="420" r="320" fill="#38bdf8" opacity="0.2"/>
      <rect x="40" y="1120" width="820" height="60" rx="12" fill="#000000" opacity="0.6"/>
      <text x="450" y="1160" font-family="sans-serif" font-size="28" font-weight="bold" fill="#38bdf8" text-anchor="middle">
        📹 截取自真实视频分镜 · 暴雨夜实况定格
      </text>
    </svg>`;
  } else {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
      <defs>
        <radialGradient id="rg3" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="#7c2d12"/>
          <stop offset="60%" stop-color="#27272a"/>
          <stop offset="100%" stop-color="#09090b"/>
        </radialGradient>
      </defs>
      <rect width="900" height="1200" fill="url(#rg3)"/>
      <circle cx="450" cy="480" r="320" fill="#ea580c" opacity="0.25"/>
      <rect x="40" y="1120" width="820" height="60" rx="12" fill="#000000" opacity="0.6"/>
      <text x="450" y="1160" font-family="sans-serif" font-size="28" font-weight="bold" fill="#fb923c" text-anchor="middle">
        📹 截取自真实视频分镜 · 烟火后厨实况定格
      </text>
    </svg>`;
  }
}
