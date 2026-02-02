# 从 Figma Make 导出项目代码

## 📦 导出方法

Figma Make 提供了几种方式将项目代码导出到本地：

---

## 方法 1: 直接下载 ZIP 文件（推荐）

### 步骤：

1. **在 Figma Make 界面中**
   - 点击右上角的 **"..."** (更多选项) 或 **"Share"** 按钮
   - 查找 **"Download"** 或 **"Export"** 选项
   - 选择 **"Download as ZIP"**

2. **解压文件**
   ```bash
   # macOS/Linux
   unzip ria-project.zip
   cd ria-project
   
   # Windows
   # 右键 → 解压缩全部文件
   ```

3. **安装依赖**
   ```bash
   npm install
   # 或
   pnpm install
   ```

4. **现在你可以开始打包了！**
   ```bash
   npm run build
   npx cap add android
   ```

---

## 方法 2: 使用 Git Clone（如果项目已连接 Git）

如果你的 Figma Make 项目已连接到 GitHub/GitLab：

```bash
# 克隆仓库
git clone https://github.com/your-username/ria.git
cd ria

# 安装依赖
npm install

# 开始构建
npm run build
```

---

## 方法 3: 手动复制文件

如果找不到导出按钮，可以手动复制文件：

### 步骤：

1. **在 Figma Make 的文件浏览器中**
   - 点击左侧的文件树
   - 选择根目录 `/`

2. **复制所有文件**
   - 创建本地项目文件夹
   - 逐个复制以下重要文件/文件夹：

```
ria-project/
├── src/                    # 源代码（必需）
│   ├── app/               
│   │   ├── components/    
│   │   ├── utils/         
│   │   └── App.tsx        
│   ├── styles/            
│   └── main.tsx           
├── public/                 # 静态资源
├── resources/              # 图标生成器
├── package.json            # 依赖配置（必需）
├── vite.config.ts          # 构建配置（必需）
├── capacitor.config.ts     # Capacitor 配置（必需）
├── tsconfig.json           # TypeScript 配置
├── index.html              # 入口文件（必需）
└── README.md              
```

3. **重建 node_modules**
   ```bash
   npm install
   ```

---

## 方法 4: 使用 Figma Make CLI（如果支持）

某些版本的 Figma Make 可能提供 CLI 工具：

```bash
# 安装 Figma Make CLI
npm install -g @figma/make-cli

# 导出项目
figma-make export --project-id=xxx --output=./ria-project

# 进入项目目录
cd ria-project
npm install
```

---

## 📋 导出后的检查清单

导出完成后，确认以下文件存在：

- [ ] ✅ `package.json` - 包含所有依赖
- [ ] ✅ `vite.config.ts` - Vite 构建配置
- [ ] ✅ `capacitor.config.ts` - Capacitor 配置
- [ ] ✅ `src/` 文件夹 - 所有源代码
- [ ] ✅ `index.html` - HTML 入口文件
- [ ] ✅ `tsconfig.json` - TypeScript 配置

---

## 🔧 导出后的初始化步骤

### 1. 检查 Node.js 版本

```bash
node -v  # 应该是 v18 或更高
npm -v   # 应该是 v9 或更高
```

如果版本过低，请从 [nodejs.org](https://nodejs.org) 下载最新 LTS 版本。

### 2. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm（更快）
npm install -g pnpm
pnpm install

# 或使用 yarn
npm install -g yarn
yarn install
```

### 3. 测试构建

```bash
npm run build
```

如果构建成功，你会看到 `dist/` 文件夹被创建。

### 4. 安装 Capacitor CLI（如果还没有）

```bash
npm install -g @capacitor/cli
```

### 5. 验证 Capacitor 配置

```bash
npx cap --version
```

---

## 🚀 开始打包原生应用

现在你已经成功导出项目，可以开始打包了：

### Android

```bash
# 1. 构建 Web 应用
npm run build

# 2. 添加 Android 平台
npx cap add android

# 3. 同步代码
npx cap sync android

# 4. 打开 Android Studio
npx cap open android
```

### iOS（仅 macOS）

```bash
# 1. 构建 Web 应用
npm run build

# 2. 添加 iOS 平台
npx cap add ios

# 3. 安装 CocoaPods 依赖
cd ios/App
pod install
cd ../..

# 4. 同步代码
npx cap sync ios

# 5. 打开 Xcode
npx cap open ios
```

---

## 📱 生成图标和启动屏幕

### 方式 1: 使用浏览器打开

```bash
# 在项目目录中启动一个本地服务器
npx serve .

# 然后在浏览器中访问：
# http://localhost:3000/resources/icon-generator.html
# http://localhost:3000/resources/splash-generator.html
```

### 方式 2: 直接用浏览器打开文件

```bash
# macOS
open resources/icon-generator.html

# Windows
start resources/icon-generator.html

# Linux
xdg-open resources/icon-generator.html
```

---

## 🐛 常见问题

### Q: 导出后 npm install 报错？

**A:** 删除 `package-lock.json` 和 `node_modules`，重新安装：

```bash
rm -rf node_modules package-lock.json
npm install
```

### Q: 缺少某些文件？

**A:** 检查 Figma Make 是否有隐藏文件。确保导出了：
- 配置文件（`.ts`, `.json`）
- 隐藏的配置文件（如果有 `.gitignore` 等）

### Q: Capacitor 命令找不到？

**A:** 全局安装 Capacitor CLI：

```bash
npm install -g @capacitor/cli
```

### Q: 构建失败，提示缺少依赖？

**A:** 检查 `package.json`，确保所有 Capacitor 包都已安装：

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
```

### Q: 我没有 Android Studio 或 Xcode？

**A:** 
- **Android Studio**: 从 [developer.android.com](https://developer.android.com/studio) 下载
- **Xcode**: 从 Mac App Store 下载（仅 macOS，免费）

---

## 📂 推荐的文件夹结构

导出后，你的本地项目应该是这样的：

```
ria-project/
├── android/                 # (运行 cap add android 后生成)
├── ios/                     # (运行 cap add ios 后生成)
├── dist/                    # (运行 npm run build 后生成)
├── node_modules/            # (运行 npm install 后生成)
├── public/
├── resources/
│   ├── icon-generator.html
│   └── splash-generator.html
├── src/
│   ├── app/
│   ├── styles/
│   └── main.tsx
├── capacitor.config.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── CAPACITOR_SETUP.md
├── NATIVE_APP_GUIDE.md
└── EXPORT_GUIDE.md         # (你正在读的文件)
```

---

## ✅ 完成检查

导出并设置完成后，运行以下命令验证：

```bash
# ✅ 检查依赖
npm list --depth=0

# ✅ 检查构建
npm run build

# ✅ 检查 Capacitor
npx cap doctor
```

如果都没有错误，恭喜你！可以开始打包原生应用了！

---

## 📞 需要帮助？

- 📖 查看 [NATIVE_APP_GUIDE.md](./NATIVE_APP_GUIDE.md) - 快速开始指南
- 📖 查看 [CAPACITOR_SETUP.md](./CAPACITOR_SETUP.md) - 详细技术文档
- 🌐 访问 [Capacitor 官方文档](https://capacitorjs.com/docs)
- 💬 在 Capacitor Discord/GitHub 社区寻求帮助

---

**🎉 现在你已经知道如何导出项目了，开始打包你的原生应用吧！**
