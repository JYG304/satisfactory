# 《修仙工厂》（Satisfactory · 修仙工厂）项目工程规范与目录导航

这是一个基于虚幻引擎 5（UE5）架构设计的 3D 修仙自动化工厂游戏策划与 Web HUD 原型验证工程。

---

## 一、在线与本地试玩

- **GitHub Pages 在线试玩**：<https://jyg304.github.io/satisfactory/>
- **本地直接试玩**：直接双击打开根目录下的 `index.html` 或 `satisfactory_hud_replica.html`（建议使用任意静态 Web 服务器启动，避免本地跨域限制）。

---

## 二、工作区目录架构

整个工作区已完成系统性标准化规整，各模块分类存放：

```
f:\UE5\修仙工厂策划案\
│
├── [Web 主原型工程] (双击 index.html 即可直接运行，无外部依赖)
│   ├── index.html                    # GitHub Pages 引导入口
│   ├── satisfactory_hud_replica.html # 完整 3D 修仙 HUD 与工厂控制原型
│   ├── astrolabe_bg_texture.jpg      # 天道阵盘背景图
│   ├── xiuxian_data.js               # 核心物料、机器与配方数据驱动
│   ├── css/                          # 界面样式库
│   └── js/                           # 背包、机器、任务、建筑、天道阵盘逻辑
│
├── 01_核心策划案/ (Current GDD - 当前最新有效策划方案)
│   ├── 修仙工厂_与DSP_幸福工厂对比及全球竞品深度调研研报.md  # 最新全景万字研报 (含与DSP/幸福工厂及11款竞品对比)
│   ├── 中央处理器模型与交互功能策划案_图文修订版.docx         # 最新 CPU 模型构件与工控交互规范 (图文版)
│   ├── 法宝系统与万魂幡策划案_图文修订版.docx                # 最新法宝炼制、万魂幡与煞气对冲策划 (图文版)
│   ├── 天道阵盘_中央处理器玩法设计.md                       # 天道阵盘背包乱斗 (8x8网格/星级指向/脉冲/温度) 规范
│   ├── 天道阵盘_构件数据表.csv                              # 天道阵盘芯片与构件数据
│   ├── HUD快捷面板设计规范.md                               # 快捷操作栏与工控 HUD 交互标准
│   ├── 策划案.txt                                          # DEMO 基础建筑总表 (BD101~BD144) 与基础配方
│   └── 配置.txt                                            # 基础生产线与数值对齐配置
│
├── 02_数值与配置数据表/ (Data Tables - 最新生效数据，后续新增数据表均放此处)
│   ├── bd_table.xlsx     # 建筑/设施总表
│   ├── item_table.xlsx   # 物料/道具总表
│   └── recipe_table.xlsx # 配方总表
│
├── 03_功能测试与验证原型/ (Prototypes & Sandboxes - 历史独立功能验证页面)
│   ├── optical_array_prototype.html       # 光路阵盘沙盒原型
│   ├── conveyor_limiter_prototype.html    # 传送带限速器验证
│   ├── cpu_alchemy_sandbox.html           # 炼丹与阵盘连携沙盒
│   ├── cpu_battles_prototype.html         # 背包乱斗式构筑对战测试
│   ├── cpu_sandbox_test.html              # CPU 核心多米诺脉冲沙盒
│   ├── HUD快捷面板原型.html
│   ├── 游戏案例库_截图画廊.html
│   ├── processor/                         # 独立 CPU 处理器原型模块
│   └── 中央处理器_光路阵盘/
│
├── 04_参考素材与截图/ (References & Art - 美术参考与规范)
│   ├── 参考UI与交互截图/                  # 游戏 UI、提交窗口、缺少材料提示等参考截图
│   ├── GameScreenshots/                   # 各标杆竞品截图库
│   ├── UI表.docx                          # 早期 UI 与交互设计参照
│   ├── 动作表.docx                        # 角色与交互动作定义
│   └── Sect Automation Control-2026-09-07-012614.png
│
├── 05_历史版本与归档/ (Archive - 归档的老版草稿与临时缓存)
│   ├── 历史策划草稿/                      # 早期草稿 (中央处理器V1.0、法宝相关草稿、ACT旧案等)
│   └── 历史数据表与解析缓存/              # 历史 xlsx 表格及巨型 ndjson 缓存 (不影响主工程)
│
└── 06_运维与脚本工具/ (Tools & Scripts)
    ├── download_all_screenshots.ps1 / .py # 截图自动化下载脚本
    └── search_sheets.js                   # 表格内容快速检索工具
```
