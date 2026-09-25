export interface SampleVideoOption {
  id: string;
  title: string;
  tag: string;
  durationFormatted: string;
  description: string;
  previewColor: string;
  mockTimeline: Array<{
    timestamp: string;
    timeSec: number;
    title: string;
    actionDetail: string;
    tension: number;
  }>;
  mockShortTitle: string;
  mockCoverPrompt: string;
  mockViewerComment: string;
  mockCommentTitle: string;
  mockViralTitles: Array<{
    title: string;
    hookType: string;
    predictedScore: number;
  }>;
}

export const SAMPLE_VIDEOS: SampleVideoOption[] = [
  {
    id: 'factory-patrol',
    title: '车间老钳工与高精度双足巡检机器人的突发较量',
    tag: '工厂实录 / 悬念较劲',
    durationFormatted: '01:28',
    description: '重工业机械车间里，从业32年的老师傅老周盯着新进场调试的双足机器人。当机器人的激光探头扫过工件时，老周突然反手递过去一把磨损的卡尺，机器人手臂骤停3秒后竟精准完成了毫米级复测，老周当场愣在原地，周围工友瞬间围了上来。',
    previewColor: 'from-amber-900 to-stone-900',
    mockTimeline: [
      {
        timestamp: '00:08',
        timeSec: 8,
        title: '双足巡检设备入场调试，工人冷眼旁观',
        actionDetail: '老周双手抱胸靠在数控车床旁，斜眼盯着机械臂缓缓展开探头',
        tension: 65,
      },
      {
        timestamp: '00:24',
        timeSec: 24,
        title: '老工匠突然出手突袭测试',
        actionDetail: '老周突然从工装口袋摸出一把生锈的老卡尺，反手横插在探头光路前',
        tension: 88,
      },
      {
        timestamp: '00:46',
        timeSec: 46,
        title: '高能反转！机械臂悬停3秒重新校准',
        actionDetail: '机械臂关节蜂鸣器轻响，蓝色激光快速三次闪烁，当场完成微米级补偿复测',
        tension: 97,
      },
      {
        timestamp: '01:15',
        timeSec: 75,
        title: '全场寂静，老手艺人震惊愣住',
        actionDetail: '老周嘴唇发白，默默把卡尺揣回兜里，右手狠拍了下大腿转身走向后门',
        tension: 92,
      },
    ],
    mockShortTitle: '当场破防！',
    mockCoverPrompt: 'Photorealistic dramatic 3:4 cinematic movie poster, close-up shot of an elderly weathered Chinese blue-collar machinist with grease on forehead, eyes wide open in sheer shock, mouth slightly parted, tense facial muscles, holding a metal wrench in hand, glowing industrial laser reflection in background, high contrast lighting, gritty documentary texture.',
    mockViewerComment: '说老实话，老周把那根烟猛抽到过滤嘴，一把掐灭在机器底座上。手指头还发着抖，狠搓了两把脸。硬是没想到三十多年的手艺，被个铁架子三秒钟看穿。大家辛辛苦苦熬白了头，明天还能靠这双手吃上饭不？',
    mockCommentTitle: '老周掐灭烟头那一刻，三十年饭碗还端得稳吗',
    mockViralTitles: [
      {
        title: '车间老工人不服气递上一把生锈卡尺，下一秒整间厂房彻底鸦雀无声！',
        hookType: '极致反转悬念',
        predictedScore: 98,
      },
      {
        title: '30年工龄老钳工当场愣在原地：科技真要把我们最后的尊严踩在地上？',
        hookType: '情绪共鸣爆点',
        predictedScore: 96,
      },
      {
        title: '现场突发！巡检机械臂骤停3秒做出惊人举动，围观工友全都坐不住了',
        hookType: '突发事件好奇',
        predictedScore: 93,
      },
      {
        title: '这不是科幻电影！当现实工匠遭遇算法碾压，谁才是下一个被淘汰的人？',
        hookType: '深度社会反思',
        predictedScore: 91,
      },
    ],
  },
  {
    id: 'market-delivery',
    title: '暴雨天无人物流配送车陷在泥泞陡坡，卖菜大叔抄起扁担',
    tag: '市井烟火 / 暖心反转',
    durationFormatted: '00:54',
    description: '傍晚菜市场下起大雨，一辆小型无人物流车车轮在湿滑的青石板上疯狂打滑并发出蜂鸣报警。路边卖红苕的李大叔二话不说，将扁担垫入后轮下，弓着腰死死顶住车尾，直到小车重新爬上主干道。大叔抹了一把脸上的雨水，默默走回摊位。',
    previewColor: 'from-blue-900 to-slate-900',
    mockTimeline: [
      {
        timestamp: '00:06',
        timeSec: 6,
        title: '暴雨突袭老街，无人车失控打滑',
        actionDetail: '黄色无人物流小车在青石板陡坡疯狂空转，黄色警示灯爆闪',
        tension: 70,
      },
      {
        timestamp: '00:19',
        timeSec: 19,
        title: '路人纷纷避让，卖菜大叔提棍冲出',
        actionDetail: '大叔脚踩胶鞋，单手抄起两米长的厚木扁担直接穿过雨幕狂奔',
        tension: 86,
      },
      {
        timestamp: '00:35',
        timeSec: 35,
        title: '人机死磕，用肩背死死顶住',
        actionDetail: '扁担死死卡在后轮底，大叔青筋暴起弓腰死撑，小车猛然脱困冲上斜坡',
        tension: 98,
      },
      {
        timestamp: '00:48',
        timeSec: 48,
        title: '雨中孤独背影，市井良知',
        actionDetail: '大叔擦了一把顺着下巴淌的雨水，把扁担重重立在菜摊旁',
        tension: 89,
      },
    ],
    mockShortTitle: '一杠救命！',
    mockCoverPrompt: 'Photorealistic ultra-detailed 3:4 poster, an intense middle-aged Asian street vendor drenched in heavy rain, gritting his teeth in extreme physical exertion, veins bulging on muscular neck, using a bamboo shoulder pole to push a high-tech delivery pod up a slippery street, splashing muddy water, dramatic streetlights and neon reflection, emotional documentary cinema style.',
    mockViewerComment: '算求了，抹一把脸上的雨水，大叔转身把扁担往菜筐旁边一扔。双手冰凉，骨头节都冻得发红。满大街都是算力算法，陷在烂泥巴里还不是靠人力硬撑。往后真要全靠机器，大街上还能剩下几个活人的人情味？',
    mockCommentTitle: '大叔扔掉扁担抹把雨水，算力能算得出人心温度吗',
    mockViralTitles: [
      {
        title: '暴雨中无人车疯狂报警打滑，卖菜大叔这一弯腰，瞬间看哭全网百万网友！',
        hookType: '情感泪点共鸣',
        predictedScore: 99,
      },
      {
        title: '当最高端的人工智能陷进老街烂泥，真正救场的居然是一根旧扁担！',
        hookType: '反常识对比',
        predictedScore: 97,
      },
      {
        title: '暴雨街头无人敢扶！他满身泥水冲了上去，背影让无数城里人脸红',
        hookType: '社会良知拷问',
        predictedScore: 94,
      },
      {
        title: '算法算不出人间疾苦！雨夜这一幕，狠狠打了多少科技巨头的脸？',
        hookType: '辛辣争议反思',
        predictedScore: 92,
      },
    ],
  },
  {
    id: 'chef-stirfry',
    title: '深夜大排档智能炒菜机精准颠勺，老厨子蹲在台阶默默点烟',
    tag: '时代变迁 / 辛酸纪实',
    durationFormatted: '01:12',
    description: '烟熏火燎的大排档后厨，新装的六轴智能炒菜臂正以标准频率起锅翻炒，火光四溅，三分钟出一道爆炒肥肠。而掌勺二十年的主厨老陈则解下围裙，蹲在后门的石阶上，火机啪嗒响了三声才点着烟，望着那一锅标准化的火焰出神。',
    previewColor: 'from-red-950 to-orange-950',
    mockTimeline: [
      {
        timestamp: '00:10',
        timeSec: 10,
        title: '机械臂开火颠勺，火焰腾起两米高',
        actionDetail: '六轴机械臂精准下料，翻勺频率分秒不差，后厨火光耀眼',
        tension: 75,
      },
      {
        timestamp: '00:28',
        timeSec: 28,
        title: '老主厨解下油腻围裙走出后厨',
        actionDetail: '老陈把沾满油渍的毛巾搭在肩上，步伐沉重地推开生锈的后门',
        tension: 82,
      },
      {
        timestamp: '00:50',
        timeSec: 50,
        title: '石阶点烟，眼神里的落寞与迷茫',
        actionDetail: '打火机连按了三下才冒出火苗，双手布满老茧和烫伤疤痕，烟圈在冷风中飘散',
        tension: 95,
      },
      {
        timestamp: '01:05',
        timeSec: 65,
        title: '隔壁传出出餐铃声，老陈深吸一口气',
        actionDetail: '老陈猛地把烟蒂按进墙缝踩了一脚，转身呆立在阴影里',
        tension: 90,
      },
    ],
    mockShortTitle: '饭碗砸了？',
    mockCoverPrompt: 'Photorealistic 3:4 movie still poster, close-up of a rugged Asian chef sitting on stone steps in dark alley, smoke rising from a cigarette between his rough fingers, tired eyes reflecting glowing restaurant neon, mouth pressed into a bitter tight line, face bathed in dramatic warm orange and cold blue chiaroscuro lighting, visceral dramatic tension.',
    mockViewerComment: '格老子，老陈在台阶上猛跺了两脚，把烟蒂直接按进墙缝里。火星子在黑夜里一闪就熄了。二十年练就的一条舌头和颠勺功夫，抵不上一个芯片调的火候。要是连锅气都能按克计算，咱们以后下的馆子到底算是食堂还是流水线？',
    mockCommentTitle: '老陈把烟蒂按进墙缝，连锅气都能量化我们还吃啥',
    mockViralTitles: [
      {
        title: '深夜后厨机器人颠勺火花四溅，掌勺20年的老主厨蹲在后门默默红了眼眶！',
        hookType: '辛酸反差冲击',
        predictedScore: 97,
      },
      {
        title: '当大排档换上机械手臂！3分钟出一道招牌菜，顾客却再也吃不出当年的味道',
        hookType: '怀旧与现实碰撞',
        predictedScore: 95,
      },
      {
        title: '老手艺人的黄昏！一锅冷酷的标准化火焰，到底烧没了多少代人的烟火气？',
        hookType: '时代痛点共鸣',
        predictedScore: 93,
      },
      {
        title: '连街头大排档都容不下活人了！我们拼命追求的高效，真的能换来幸福吗？',
        hookType: '生活哲学质问',
        predictedScore: 90,
      },
    ],
  },
];
