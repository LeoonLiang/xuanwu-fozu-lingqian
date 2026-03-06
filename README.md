# 玄武山佛祖灵签（数据集）

51 签数据集，每签一个 JSON 文件。面向开源使用场景，提供统一索引、基础结构规范与校验脚本，便于第三方系统直接消费。

## 获取方式
- 读取索引
  - 入口文件：`index.json`，包含全部签的文件列表（`files`）与计数（`count`）
  - 列表项路径格式：`data/NN.json`（如 `data/01.json`、`data/51.json`）
- 原始文件（GitHub Raw）
  - `https://raw.githubusercontent.com/LeoonLiang/xuanwu-fozu-lingqian/main/index.json`
  - `https://raw.githubusercontent.com/LeoonLiang/xuanwu-fozu-lingqian/main/data/01.json`
  - 如默认分支非 `main`，将路径中的 `main` 替换为实际分支名
- Web/Node 代码示例（按索引遍历）
```js
// Node 18+ 或浏览器环境
const base = "https://raw.githubusercontent.com/LeoonLiang/xuanwu-fozu-lingqian/main/";
const index = await fetch(base + "index.json").then(r => r.json());
const items = await Promise.all(
  index.files.map(f => fetch(base + f).then(r => r.json()))
);
console.log(index.count, items.length); // 51, 51

const liteItems = await Promise.all(
  index.lite.files.map(f => fetch(base + f).then(r => r.json()))
);
console.log(index.lite.count, liteItems.length); // 51, 51

// 串联：从简约版跳转详情
function toFullPath(litePath) {
  return litePath.replace("data-lite", "data");
}
// 或使用映射表
const idTo = new Map(index.map.map(m => [m.id, m]));
const detail01 = await fetch(base + idTo.get("01").full).then(r => r.json());

// 直接获取简约版聚合
const allLite = await fetch(base + "data-lite/all.json").then(r => r.json());
console.log(allLite.length); // 51
```
- 可选：GitHub Pages
  - 若开启 Pages，将根目录公开后，也可通过 `https://LeoonLiang.github.io/xuanwu-fozu-lingqian/index.json` 读取

## 目录结构
- `data/`：完整版 51 个签的 JSON（`01.json`–`51.json`）
- `data-lite/`：简约版 51 个签（仅五项：签号、签名、签文类型、卦象、生肖）
- `index.json`：数据入口与清单（包含 `files` 路径、`count`、`version`）
  - 统一索引：`index.json` 同时包含：
    - `files`：完整版文件列表
    - `lite.files`：简约版文件列表
    - `map`：按编号映射 `full` 与 `lite` 路径，便于串联请求
 - `data-lite/all.json`：简约版聚合文件，一次性获取 51 条简约数据
- `schema.json`：字段结构的参考规范（JSON Schema，允许增量字段）
- `scripts/validate.mjs`：轻量数据校验脚本（存在性与关键块检查）
- `package.json`：运行脚本配置

## 数据结构
- 每个签为一个对象，包含但不限于以下关键块：
  - 基本信息：`签号`、`签名`、`签文类型`、`卦象`、`生肖`
  - 概览：`签文简介`（含 `戏文`、`诗曰`、`内兆`）
  - 家宅：`家宅运势`（含 `签文`、`解曰`）
  - 岁君：`岁君签`（含 `总诗`、`年龄运势` 数组：`年龄`、`男`、`女`）
  - 专题：`生意`、`出外`、`谋望求财`、`学艺功名`、`行舟六畜`、`移徙`、`行人`、`婚姻`、`官讼`、`失物`、`占病`、`其他`
- 规范参考见：`schema.json`

## 校验与开发
- 运行轻量校验
  - `npm run validate` 或 `node scripts/validate.mjs`
  - 输出包含 `summary`（ok/warn/error）与逐文件 `results`
- 严格 Schema 校验（可选）
  - 如需按 `schema.json` 强校验（类型与结构），可扩展脚本接入 AJV 等库

## 内容与图片来源
- 本数据集的文字内容与配图均整理自“汕尾市玄武山旅游区”官方公众号
- 开源目的为学习与交流，引用时请保留来源说明；若涉及版权问题，请联系维护者处理

## 版本与演进
- `index.json` 内的 `version` 字段用于标识数据结构版本
- 若有结构调整（例如字段重命名），请同步：
  - 更新 `schema.json`
  - bump `index.json.version`
  - 维护 `scripts/validate.mjs` 的检查逻辑

## 贡献
- 欢迎通过 Issue/PR 补充或修正数据
- 提交前请运行校验脚本并保证通过或仅有合理的 `warn`

## 许可
- 建议采用常见开源许可（如 MIT）。请仓库维护者决定后更新 LICENSE 与本节说明。
