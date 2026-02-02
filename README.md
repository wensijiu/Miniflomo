# ria - 碎片化想法收集器

<div align="center">

**极简的碎片化想法收集器，随时记录灵感和思考**

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Ready-3ECF8E?style=flat-square&logo=supabase)

</div>

---

## ✨ 特色功能

- 🚀 **快速输入** - 打开即写，秒速保存想法
- 🏷️ **标签管理** - 灵活的标签系统，轻松分类
- 📅 **时间轴浏览** - 按时间查看，追溯思考历程
- 🎲 **随机回顾** - 重新发现被遗忘的想法
- 📊 **数据统计** - 记录习惯，激励坚持
- 🎯 **目标设定** - 设定每日/每周记录目标
- 📆 **日历视图** - 可视化记录日历热力图
- 🔐 **账号系统** - 手机号登录，云端同步
- 💾 **降级存储** - 后端不可用时自动使用 localStorage
- 🎨 **Notion 风格** - 极简黑白灰设计

---

## 📱 打包成原生应用

想要将 ria 打包成 **Android APK** 或 **iOS 应用**？

### 🚀 查看完整打包指南

📖 **[README_NATIVE.md - 原生应用打包完全指南](./README_NATIVE.md)**

这份指南包含：
- ✅ 从 Figma Make 导出项目代码
- ✅ 配置 Capacitor
- ✅ 生成应用图标和启动屏幕
- ✅ 打包 Android APK/AAB
- ✅ 打包 iOS IPA
- ✅ 上架 Google Play 和 App Store

### 📚 相关文档

| 文档 | 说明 |
|------|------|
| [EXPORT_GUIDE.md](./EXPORT_GUIDE.md) | 📦 如何从 Figma Make 导出项目 |
| [NATIVE_APP_GUIDE.md](./NATIVE_APP_GUIDE.md) | ⚡ 快速开始指南（5 步搞定） |
| [CAPACITOR_SETUP.md](./CAPACITOR_SETUP.md) | 🔧 详细的技术配置文档 |

### 🎨 工具

| 工具 | 用途 |
|------|------|
| [icon-generator.html](./resources/icon-generator.html) | 📱 生成所有尺寸的应用图标 |
| [splash-generator.html](./resources/splash-generator.html) | 🚀 生成启动屏幕 |

---

## 🛠️ 技术栈

- **前端框架**: React 18.3.1 + TypeScript
- **样式**: Tailwind CSS 4.x
- **UI 组件**: Radix UI + shadcn/ui
- **图标**: Lucide React
- **动画**: Motion (Framer Motion)
- **日期处理**: date-fns
- **通知**: Sonner
- **后端**: Supabase (可选)
- **原生打包**: Capacitor 8.x

---

## 🏗️ 项目结构

```
ria/
├── src/
│   ├── app/
│   │   ├── components/        # React 组件
│   │   │   ├── QuickInputPage.tsx      # 快速输入页
│   │   │   ├── NoteListPage.tsx        # 笔记列表页
│   │   │   ├── TagsPage.tsx            # 标签管理页
│   │   │   ├── RandomReviewPage.tsx    # 随机回顾页
│   │   │   ├── ProfilePage.tsx         # 个人中心页
│   │   │   ├── StatsPage.tsx           # 数据统计页
│   │   │   ├── CalendarPage.tsx        # 日历页
│   │   │   ├── AuthPage.tsx            # 登录注册页
│   │   │   └── ui/                     # UI 组件库
│   │   ├── utils/
│   │   │   └── api.ts                  # Supabase API
│   │   └── App.tsx            # 主应用组件
│   └── styles/                # 样式文件
├── supabase/                  # Supabase 后端函数
├── resources/                 # 图标和启动屏生成器
├── capacitor.config.ts        # Capacitor 配置
└── package.json
```

---

## 🚀 本地开发

### 前置要求

- Node.js 18+ 
- npm 或 pnpm

### 安装依赖

```bash
npm install
```

### 启动开发服务器

在 Figma Make 中直接预览，或导出到本地后运行：

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

---

## 💾 数据存储

### localStorage (默认)

- 用户数据: `ria-user`
- 笔记数据: `ria-notes`
- 目标设置: `ria-goals`
- 提醒设置: `ria-reminder-settings`

### Supabase (可选)

应用支持 Supabase 后端，提供云端同步功能：

- ✅ 跨设备数据同步
- ✅ 账号系统（手机号验证码登录）
- ✅ 自动降级到 localStorage

配置说明见 Supabase 集成文档。

---

## 🎨 设计系统

### 配色方案 (Notion 风格)

- 主色: `#37352F` - 深灰色
- 背景: `#FFFFFF` - 纯白
- 次要背景: `#F7F6F3` - 浅米灰
- 文字: `#37352F` - 深灰
- 次要文字: `#787774` - 灰色
- 边框: `#E3E2E0` - 浅灰

### 设计原则

- ✅ 极简主义 - 去除多余元素
- ✅ 内容优先 - 专注于笔记内容
- ✅ 扁平结构 - 保持简单的信息架构
- ✅ 快速交互 - 减少操作步骤

---

## 📖 使用指南

### 快速输入

1. 打开应用，默认在"输入"页面
2. 输入笔记内容
3. 添加标签（可选）
4. 点击"保存"或按 Enter

### 浏览笔记

1. 切换到"回顾"标签
2. 按时间线浏览所有笔记
3. 点击标签筛选特定分类
4. 左滑删除笔记

### 标签管理

1. 切换到"标签"标签
2. 查看所有标签和统计
3. 点击标签查看相关笔记
4. 长按重命名或删除标签

### 随机回顾

1. 在"我的"页面点击"随机回顾"
2. 随机显示一条历史笔记
3. 重新发现被遗忘的想法

---

## 🔐 账号系统

### 注册/登录

- 使用手机号 + 验证码
- 测试环境验证码固定为: `123456`
- 支持设置昵称

### 数据同步

- 登录后自动同步到云端
- 支持多设备访问
- 后端不可用时降级到本地存储

---

## 📊 功能列表

### 核心功能
- [x] 快速输入笔记
- [x] 标签添加和管理
- [x] 时间轴浏览
- [x] 笔记编辑和删除
- [x] 标签筛选
- [x] 随机回顾
- [x] 数据统计
- [x] 日历热力图
- [x] 目标设定
- [x] 成就环显示

### 账号功能
- [x] 手机号登录注册
- [x] 昵称设置
- [x] 云端数据同步
- [x] localStorage 降级

### 原生应用
- [x] Capacitor 配置
- [x] Android 支持
- [x] iOS 支持
- [x] 应用图标生成器
- [x] 启动屏幕生成器

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 🙏 鸣谢

- UI 组件: [shadcn/ui](https://ui.shadcn.com/)
- 图标: [Lucide](https://lucide.dev/)
- 后端: [Supabase](https://supabase.com/)
- 原生打包: [Capacitor](https://capacitorjs.com/)

---

<div align="center">

**📱 想要打包成原生应用？查看 [README_NATIVE.md](./README_NATIVE.md)**

Made with ❤️ in Figma Make

</div>
