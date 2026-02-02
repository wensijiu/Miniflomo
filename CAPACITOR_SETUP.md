# ria Capacitor 原生应用打包指南

## 📱 将 ria 打包成原生 App

本指南将帮助你将 ria Web 应用打包成 **Android APK** 和 **iOS IPA** 原生应用。

---

## ✅ 已完成的配置

- ✅ 安装了 Capacitor 核心包
- ✅ 配置了 `capacitor.config.ts`
- ✅ 添加了构建脚本到 `package.json`
- ✅ 应用 ID: `com.ria.app`
- ✅ 应用名称: `ria`

---

## 🚀 步骤 1: 准备本地开发环境

### 前置要求

#### Android 开发
- **Android Studio** (最新版)
- **Java JDK 17** 或更高
- Android SDK Platform 34 或更高
- Android Build Tools

#### iOS 开发 (仅限 macOS)
- **Xcode 15** 或更高
- **CocoaPods** (通过 `sudo gem install cocoapods` 安装)
- macOS 13 或更高

---

## 🔧 步骤 2: 下载项目到本地

1. 从 Figma Make 导出或克隆项目代码到本地
2. 在项目根目录打开终端
3. 安装依赖：
   ```bash
   npm install
   # 或
   pnpm install
   ```

---

## 📦 步骤 3: 构建 Web 应用

```bash
npm run build
```

这会在 `dist/` 目录生成优化后的 Web 应用文件。

---

## 🤖 步骤 4: 创建 Android 项目

### 4.1 初始化 Android 项目

```bash
# 添加 Android 平台
npx cap add android
```

这会在项目根目录创建 `android/` 文件夹，包含完整的 Android Studio 项目。

### 4.2 同步代码到 Android

每次修改 Web 代码后需要同步：

```bash
npm run cap:build
```

或手动执行：

```bash
npm run build
npx cap sync android
```

### 4.3 在 Android Studio 中打开

```bash
npx cap open android
```

或手动：打开 Android Studio → Open → 选择 `android/` 目录

### 4.4 配置签名 (发布版本)

在 `android/app/build.gradle` 中添加签名配置：

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file("your-keystore.jks")
            storePassword "your-store-password"
            keyAlias "your-key-alias"
            keyPassword "your-key-password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 4.5 生成密钥库 (首次发布)

```bash
keytool -genkey -v -keystore ria-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias ria
```

### 4.6 构建 APK

#### 调试版本 (用于测试)
```bash
cd android
./gradlew assembleDebug
```
APK 位置: `android/app/build/outputs/apk/debug/app-debug.apk`

#### 发布版本 (用于上架)
```bash
cd android
./gradlew assembleRelease
```
APK 位置: `android/app/build/outputs/apk/release/app-release.apk`

#### 构建 AAB (Google Play 上架格式)
```bash
cd android
./gradlew bundleRelease
```
AAB 位置: `android/app/build/outputs/bundle/release/app-release.aab`

---

## 🍎 步骤 5: 创建 iOS 项目 (仅限 macOS)

### 5.1 初始化 iOS 项目

```bash
# 添加 iOS 平台
npx cap add ios
```

这会在项目根目录创建 `ios/` 文件夹。

### 5.2 安装 CocoaPods 依赖

```bash
cd ios/App
pod install
```

### 5.3 同步代码到 iOS

```bash
npm run cap:build
```

或手动：

```bash
npm run build
npx cap sync ios
```

### 5.4 在 Xcode 中打开

```bash
npx cap open ios
```

或手动：打开 Xcode → Open → 选择 `ios/App/App.xcworkspace` (注意是 .xcworkspace 不是 .xcodeproj)

### 5.5 配置签名和证书

1. 在 Xcode 中选择项目 → Signing & Capabilities
2. 选择你的开发团队 (需要 Apple Developer 账号)
3. Bundle Identifier: `com.ria.app`

### 5.6 构建 iOS 应用

#### 真机测试
1. 连接 iPhone/iPad 到 Mac
2. 在 Xcode 中选择你的设备
3. 点击 ▶️ 按钮运行

#### Archive (上架 App Store)
1. Product → Archive
2. Window → Organizer
3. 选择构建的 Archive
4. Distribute App → App Store Connect
5. 按照向导完成上传

---

## 🎨 步骤 6: 自定义图标和启动屏幕

### Android 图标

需要准备以下尺寸的图标（放在 `android/app/src/main/res/` 下）：

- `mipmap-mdpi/ic_launcher.png` - 48x48
- `mipmap-hdpi/ic_launcher.png` - 72x72
- `mipmap-xhdpi/ic_launcher.png` - 96x96
- `mipmap-xxhdpi/ic_launcher.png` - 144x144
- `mipmap-xxxhdpi/ic_launcher.png` - 192x192

**推荐工具：**
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)
- [App Icon Generator](https://www.appicon.co/)

### iOS 图标

在 Xcode 中：
1. 打开 `ios/App/App/Assets.xcassets/AppIcon.appiconset`
2. 拖拽对应尺寸的图标
3. 需要尺寸：20x20, 29x29, 40x40, 60x60, 76x76, 83.5x83.5, 1024x1024（各种倍数）

**推荐工具：**
- Xcode 内置 Icon Set
- [App Icon Generator](https://www.appicon.co/)

### Android 启动屏幕

编辑 `android/app/src/main/res/drawable/splash.xml`：

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background"/>
    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/splash_image"/>
    </item>
</layer-list>
```

在 `android/app/src/main/res/values/colors.xml` 添加：

```xml
<color name="splash_background">#37352F</color>
```

### iOS 启动屏幕

1. 在 Xcode 中打开 `ios/App/App/Assets.xcassets/Splash.imageset`
2. 添加启动图片（建议 2048x2048）
3. 或使用 LaunchScreen.storyboard 自定义

---

## 📱 步骤 7: 测试应用

### Android 测试

1. **模拟器测试：**
   - 在 Android Studio 中启动模拟器
   - 点击 Run 按钮

2. **真机测试：**
   - 手机开启开发者选项和 USB 调试
   - USB 连接到电脑
   - 在 Android Studio 中选择设备运行

3. **安装 APK：**
   - 将生成的 APK 传到手机
   - 开启"允许安装未知来源"
   - 点击 APK 文件安装

### iOS 测试

1. **模拟器测试：**
   - Xcode → Product → Destination → 选择模拟器
   - 点击 ▶️ 运行

2. **真机测试：**
   - 连接 iPhone/iPad
   - 选择设备作为 Destination
   - 点击运行（需要开发者证书）

3. **TestFlight 测试：**
   - Archive 后上传到 App Store Connect
   - 添加测试用户
   - 通过 TestFlight App 安装

---

## 🚀 步骤 8: 发布应用

### Android - Google Play

1. **创建 Google Play 开发者账号** ($25 一次性费用)
2. **创建应用：**
   - 登录 [Google Play Console](https://play.google.com/console)
   - 创建新应用
3. **上传 AAB：**
   - Production → Create new release
   - 上传 `app-release.aab`
4. **填写应用信息：**
   - 应用详情、截图、描述
   - 分类、内容分级
   - 隐私政策链接
5. **提交审核**

### iOS - App Store

1. **创建 Apple Developer 账号** ($99/年)
2. **在 App Store Connect 创建应用：**
   - 登录 [App Store Connect](https://appstoreconnect.apple.com)
   - My Apps → + → New App
3. **上传构建：**
   - 在 Xcode 中 Archive
   - Upload to App Store Connect
4. **填写应用信息：**
   - 应用详情、截图、描述
   - 分类、年龄评级
   - 隐私政策
5. **提交审核**

---

## 🔄 步骤 9: 更新应用

### 更新流程

1. 修改 Web 代码
2. 更新版本号：
   - `package.json` 中的 `version`
   - Android: `android/app/build.gradle` 中的 `versionCode` 和 `versionName`
   - iOS: Xcode 项目设置中的 Version 和 Build
3. 构建并同步：
   ```bash
   npm run cap:build
   ```
4. 重新构建原生应用
5. 上传到应用商店

---

## 🛠️ 常用命令速查

```bash
# 构建 Web 应用
npm run build

# 同步到所有平台
npx cap sync

# 同步到 Android
npx cap sync android

# 同步到 iOS
npx cap sync ios

# 打开 Android Studio
npx cap open android

# 打开 Xcode
npx cap open ios

# 一键构建并同步
npm run cap:build

# 清理并重建
npm run build && npx cap sync
```

---

## 📚 应用配置

### 修改应用 ID

编辑 `capacitor.config.ts`：

```typescript
appId: 'com.yourcompany.ria',  // 修改为你的应用 ID
```

同步到原生项目：
```bash
npx cap sync
```

### 修改应用名称

**Android:** `android/app/src/main/res/values/strings.xml`
```xml
<string name="app_name">你的应用名</string>
```

**iOS:** Xcode 项目设置 → General → Display Name

---

## 🐛 常见问题

### Q: Android Studio 无法识别项目？
A: 确保已安装最新版 Android Studio 和 Gradle，File → Invalidate Caches → Restart

### Q: iOS CocoaPods 安装失败？
A: 
```bash
sudo gem install cocoapods
cd ios/App
pod install --repo-update
```

### Q: 应用无法访问网络？
A: 
- Android: 检查 `AndroidManifest.xml` 中的 Internet 权限
- iOS: 检查 `Info.plist` 中的 App Transport Security 设置

### Q: 如何启用原生功能（相机、GPS 等）？
A: 安装对应的 Capacitor 插件：
```bash
npm install @capacitor/camera
npm install @capacitor/geolocation
```

---

## 📖 更多资源

- [Capacitor 官方文档](https://capacitorjs.com/docs)
- [Android 开发者文档](https://developer.android.com/)
- [iOS 开发者文档](https://developer.apple.com/documentation/)
- [Google Play 发布指南](https://developer.android.com/distribute)
- [App Store 审核指南](https://developer.apple.com/app-store/review/guidelines/)

---

**🎉 现在你可以将 ria 打包成真正的原生应用了！**

如果遇到问题，请参考 Capacitor 官方文档或在社区寻求帮助。
