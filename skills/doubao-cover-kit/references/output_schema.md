# 输出 JSON Schema（`doubao_cover_kit` 结构化交付协议）

当用户需要机器可读的结构化物料时，按以下 schema 输出 JSON。

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "DoubaoCoverKitOutput",
  "description": "短视频爆款物料生产数据协议",
  "type": "object",
  "required": ["summary", "timeline", "coverDesign", "viralTitles", "viewerComment", "commentTitle"],
  "properties": {
    "summary": {
      "type": "string",
      "description": "详细内容摘要：剧情冲突、人物心理起伏与反转"
    },
    "timeline": {
      "type": "array",
      "description": "关键时间轴节点列表",
      "items": {
        "type": "object",
        "required": ["timestamp", "title", "actionDetail", "tension"],
        "properties": {
          "timestamp": { "type": "string", "description": "格式如 00:15" },
          "timeSec": { "type": "number", "description": "秒数" },
          "title": { "type": "string", "description": "节点核心事件" },
          "actionDetail": { "type": "string", "description": "具体动作细节" },
          "tension": { "type": "number", "description": "戏剧张力分值 1-100" }
        }
      }
    },
    "coverDesign": {
      "type": "object",
      "required": ["shortTitle", "subtitle", "characterExpression", "visualDescription",
                   "promptChinese", "promptEnglish", "titlePosition", "titlePositionReason", "titleSource"],
      "properties": {
        "shortTitle": { "type": "string", "description": "主标题（粗大醒目）" },
        "subtitle": { "type": "string", "description": "副标题（大小字、位置不限）" },
        "characterExpression": { "type": "string", "description": "还原真实自然生活微表情，不夸张" },
        "visualDescription": { "type": "string", "description": "3:4 封面画面构图与光影描述" },
        "promptChinese": { "type": "string", "description": "中文生图提示词" },
        "promptEnglish": { "type": "string", "description": "英文生图提示词" },
        "titlePosition": {
          "type": "string",
          "enum": ["top", "upper_middle", "middle", "bottom"],
          "description": "避让人脸的最佳排版位置"
        },
        "titlePositionReason": { "type": "string", "description": "位置决策与防挡脸理由" },
        "titleSource": {
          "type": "string",
          "enum": ["voiceover", "visual_action"],
          "description": "标题来源：台词金句或纯画面动作"
        }
      }
    },
    "viralTitles": {
      "type": "array",
      "description": "4 条爆款长标题",
      "items": {
        "type": "object",
        "required": ["title", "hookType"],
        "properties": {
          "title": { "type": "string", "description": "爆款长标题" },
          "hookType": { "type": "string", "description": "钩子类型：反转悬念、情绪共鸣等" }
        }
      }
    },
    "viewerComment": {
      "type": "string",
      "description": "第三人称川味大白话反思评论"
    },
    "commentTitle": {
      "type": "string",
      "maxLength": 25,
      "description": "评论标题，严格 ≤ 25 个汉字字符"
    }
  }
}
```
