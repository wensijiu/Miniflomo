# ria 原生应用打包快速指南

## 🎯 目标

将 ria Web 应用打包成：
- 📱 **Android APK/AAB** - 可上架 Google Play 或直接安装
- 🍎 **iOS IPA** - 可上架 App Store 或 TestFlight 测试

---

## ⚡ 快速开始（5 步搞定）

### 步骤 1: 下载项目到本地

从 Figma Make 导出项目代码，或使用 Git 克隆到本地。

### 步骤 2: 安装依赖

```bash
cd ria-project
npm install
```

### 步骤 3: 构建 Web 应用

```bash
npm run build
```

这会在 `dist/` 目录生成打包好的 Web 文件。

### 步骤 4: 添加原生平台

**Android:**
```bash
npx cap add android
```

**iOS (仅 macOS):**
```bash
npx cap add ios
cd ios/App
pod install
```

### 步骤 5: 打开原生项目

**Android:**
```bash
npx cap open android
```
在 Android Studio 中点击 ▶️ 运行或构建 APK

**iOS:**
```bash
npx cap open ios
```
在 Xcode 中点击 ▶️ 运行或 Archive

---

## 📱 Android 打包详细步骤

### 开发版本（测试用）

1. 在 Android Studio 中打开项目
2. Build → Build Bundle(s) / APK(s) → Build APK(s)
3. 等待构建完成
4. APK 位置: `android/app/build/outputs/apk/debug/app-debug.apk`

### 发布版本（上架用）

#### 1. 生成签名密钥（首次）

```bash
keytool -genkey -v -keystore ria-release.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias ria-key
```

按提示输入：
- 密钥库密码（记住！）
- 个人信息
- 密钥密码（可以与密钥库密码相同）

#### 2. 配置签名

编辑 `android/app/build.gradle`：

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file("../../ria-release.jks")
            storePassword "你的密钥库密码"
            keyAlias "ria-key"
            keyPassword "你的密钥密码"
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt')
        }
    }
}
```

#### 3. 构建发布版本

**APK（直接安装）:**
```bash
cd android
./gradlew assembleRelease
```
输出: `android/app/build/outputs/apk/release/app-release.apk`

**AAB（Google Play 上架）:**
```bash
cd android
./gradlew bundleRelease
```
输出: `android/app/build/outputs/bundle/release/app-release.aab`

#### 4. 上传到 Google Play

1. 注册 [Google Play 开发者账号](https://play.google.com/console) ($25)
2. 创建新应用
3. 上传 AAB 文件
4. 填写商店信息、截图、描述
5. 提交审核

---

## 🍎 iOS 打包详细步骤

### 前置要求

- macOS 系统
- Xcode 15+
- Apple Developer 账号 ($99/年)

### 开发测试

1. 在 Xcode 中打开 `ios/App/App.xcworkspace`
2. 选择开发团队（Signing & Capabilities）
3. 连接 iPhone/iPad
4. 点击 ▶️ 运行

### App Store 发布

#### 1. 配置版本号

在 Xcode 中：
- General → Identity
- Version: 1.0.0
- Build: 1

#### 2. Archive

1. Product → Archive
2. 等待构建完成
3. Window → Organizer

#### 3. 验证和上传

1. 在 Organizer 中选择 Archive
2. 点击 "Distribute App"
3. 选择 "App Store Connect"
4. 点击 "Upload"

#### 4. App Store Connect

1. 登录 [App Store Connect](https://appstoreconnect.apple.com)
2. My Apps → + → New App
3. 填写应用信息
4. 选择上传的构建版本
5. 提交审核

---

## 🎨 自定义应用

### 修改应用图标

1. 打开 `/resources/icon-generator.html`
2. 点击下载所有图标
3. 放置到对应目录：
   - Android: `android/app/src/main/res/mipmap-*/`
   - iOS: Xcode → Assets → AppIcon

### 修改启动屏幕

1. 打开 `/resources/splash-generator.html`
2. 下载生成的启动图
3. 放置到对应位置：
   - Android: `android/app/src/main/res/drawable/splash.png`
   - iOS: Xcode → Assets → Splash

### 修改应用名称

**Android:**
`android/app/src/main/res/values/strings.xml`
```xml
<string name="app_name">你的应用名</string>
```

**iOS:**
Xcode → Target → General → Display Name

### 修改应用 ID

编辑 `capacitor.config.ts`:
```typescript
appId: 'com.yourcompany.ria',
```

然后重新同步：
```bash
npx cap sync
```

---

## 🔄 更新应用

### 1. 修改代码
   
在 Figma Make 或本地修改你的 React 代码

### 2. 更新版本号

**package.json:**
```json
"version": "1.0.1"
```

**Android** - `android/app/build.gradle`:
```gradle
versionCode 2      // 每次+1
versionName "1.0.1"
```

**iOS** - Xcode 项目设置:
- Version: 1.0.1
- Build: 2

### 3. 重新构建并同步

```bash
npm run build
npx cap sync
```

### 4. 重新打包上传

按照上面的打包步骤重新构建和上传

---

## 📊 应用商店准备清单

### 必需材料

- [ ] 应用图标（各种尺寸）
- [ ] 启动屏幕
- [ ] 应用截图（3-8 张）
- [ ] 应用描述（简短+详细）
- [ ] 应用分类
- [ ] 隐私政策链接
- [ ] 联系邮箱

### 截图要求

**Android (Google Play):**
- 手机: 至少 2 张，推荐 1080x1920
- 平板: 可选，推荐 1800x2560

**iOS (App Store):**
- 6.5" Display: 1284x2778 (必需)
- 5.5" Display: 1242x2208 (可选)
- iPad Pro: 2048x2732 (如果支持)

### 描述模板

**短描述 (80 字符):**
```
极简的碎片化想法收集器，随时记录灵感和思考
```

**详细描述:**
```
ria 是一款极简的碎片化想法收集器，帮助你：

✨ 特色功能
• 快速记录 - 打开即写，秒速保存想法
• 标签管理 - 灵活的标签系统，轻松分类
• 时间轴 - 按时间浏览，追溯思考历程
• 随机回顾 - 重新发现被遗忘的想法
• 数据统计 - 记录习惯，激励坚持

🎯 设计理念
Notion 风格的极简设计，专注内容本身
黑白灰配色，减少视觉干扰
扁平的信息架构，保持简单

💾 数据安全
支持云端同步，多设备访问
本地降级存储，离线依然可用

立即下载，开始记录你的想法！
```

---

## 🐛 常见问题

### Q: Android Studio 无法找到 SDK？

A: File → Project Structure → SDK Location，设置 Android SDK 路径

### Q: iOS 构建失败 "No signing certificate"？

A: Xcode → Preferences → Accounts → 添加 Apple ID → Download Manual Profiles

### Q: 应用无法联网？

A: 
- Android: 检查 `AndroidManifest.xml` 是否有 `<uses-permission android:name="android.permission.INTERNET"/>`
- iOS: Info.plist 添加 NSAppTransportSecurity 配置

### Q: 更新后用户看不到新版本？

A: 
- 确保更新了 versionCode/Build 号
- Google Play/App Store 需要审核通过后才能下载

### Q: 如何启用相机、定位等权限？

A: 安装对应的 Capacitor 插件：
```bash
npm install @capacitor/camera
npm install @capacitor/geolocation
```

---

## 📚 相关文档

- 完整教程：[CAPACITOR_SETUP.md](./CAPACITOR_SETUP.md)
- 图标生成器：[/resources/icon-generator.html](./resources/icon-generator.html)
- 启动屏生成器：[/resources/splash-generator.html](./resources/splash-generator.html)

---

## 🎉 完成！

按照以上步骤，你就可以将 ria 打包成真正的原生应用，上架到 Google Play 和 App Store 了！

**预计时间：**
- Android 首次打包：1-2 小时
- iOS 首次打包：2-3 小时
- 应用商店审核：1-7 天

如有问题，请参考 [Capacitor 官方文档](https://capacitorjs.com/docs) 或社区。
