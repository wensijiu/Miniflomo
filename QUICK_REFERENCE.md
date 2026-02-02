# ria 原生应用打包 - 快速参考卡

## 🎯 一张图看懂整个流程

```
┌─────────────────────────────────────────────────────────────┐
│  1. 从 Figma Make 导出项目                                   │
│     → 下载 ZIP / Git Clone                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. 本地安装依赖                                             │
│     $ npm install                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. 生成图标和启动屏幕                                        │
│     → 打开 resources/icon-generator.html                    │
│     → 打开 resources/splash-generator.html                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. 构建 Web 应用                                            │
│     $ npm run build                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┴───────────────────┐
        ↓                                       ↓
┌──────────────────┐                  ┌──────────────────┐
│  5a. Android     │                  │  5b. iOS         │
│  $ npx cap add   │                  │  $ npx cap add   │
│    android       │                  │    ios           │
│  $ npx cap open  │                  │  $ cd ios/App    │
│    android       │                  │  $ pod install   │
│                  │                  │  $ npx cap open  │
│  → Android       │                  │    ios           │
│    Studio        │                  │  → Xcode         │
└──────────────────┘                  └──────────────────┘
        ↓                                       ↓
┌──────────────────┐                  ┌──────────────────┐
│  6a. 打包        │                  │  6b. 打包        │
│  Build APK/AAB   │                  │  Product →       │
│                  │                  │  Archive         │
└──────────────────┘                  └──────────────────┘
        ↓                                       ↓
┌──────────────────┐                  ┌──────────────────┐
│  7a. 发布        │                  │  7b. 发布        │
│  Google Play     │                  │  App Store       │
│  ($25)           │                  │  ($99/年)        │
└──────────────────┘                  └──────────────────┘
```

---

## ⚡ 常用命令速查

### 基础命令

```bash
# 安装依赖
npm install

# 构建 Web 应用
npm run build

# 添加 Android 平台
npx cap add android

# 添加 iOS 平台
npx cap add ios

# 同步代码到原生项目
npx cap sync

# 打开 Android Studio
npx cap open android

# 打开 Xcode
npx cap open ios

# 一键构建并同步
npm run cap:build

# 检查配置
npx cap doctor
```

### Android 专用

```bash
# 构建调试版 APK
cd android
./gradlew assembleDebug

# 构建发布版 APK
./gradlew assembleRelease

# 构建 AAB (Google Play)
./gradlew bundleRelease

# 生成签名密钥
keytool -genkey -v -keystore ria-release.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias ria-key
```

### iOS 专用

```bash
# 安装 CocoaPods 依赖
cd ios/App
pod install

# 更新 Pods
pod update

# 清理并重装
pod deintegrate
pod install
```

---

## 📂 关键文件位置

### 配置文件

| 文件 | 用途 |
|------|------|
| `capacitor.config.ts` | Capacitor 主配置 |
| `package.json` | npm 依赖和脚本 |
| `vite.config.ts` | Vite 构建配置 |

### Android 文件

| 文件 | 用途 |
|------|------|
| `android/app/build.gradle` | 版本号、签名配置 |
| `android/app/src/main/res/values/strings.xml` | 应用名称 |
| `android/app/src/main/res/mipmap-*/` | 应用图标 |
| `android/app/src/main/res/drawable/splash.png` | 启动屏幕 |
| `android/app/src/main/AndroidManifest.xml` | 权限配置 |

### iOS 文件

| 文件 | 用途 |
|------|------|
| `ios/App/App/Info.plist` | 应用配置 |
| `ios/App/App/Assets.xcassets/AppIcon.appiconset/` | 应用图标 |
| `ios/App/App/Assets.xcassets/Splash.imageset/` | 启动屏幕 |
| Xcode → General → Display Name | 应用名称 |
| Xcode → General → Version | 版本号 |

### 输出文件

| 文件 | 位置 |
|------|------|
| Android APK (Debug) | `android/app/build/outputs/apk/debug/` |
| Android APK (Release) | `android/app/build/outputs/apk/release/` |
| Android AAB | `android/app/build/outputs/bundle/release/` |
| iOS Archive | Xcode Organizer |

---

## 🔧 常见配置

### 修改应用 ID

**capacitor.config.ts:**
```typescript
appId: 'com.yourcompany.ria'
```

然后运行: `npx cap sync`

### 修改应用名称

**Android - strings.xml:**
```xml
<string name="app_name">你的应用名</string>
```

**iOS:**
Xcode → Target → General → Display Name

### 修改版本号

**package.json:**
```json
"version": "1.0.0"
```

**Android - build.gradle:**
```gradle
versionCode 1      // 整数，每次递增
versionName "1.0.0"
```

**iOS:**
Xcode → General → Version: `1.0.0`, Build: `1`

### 配置签名 (Android)

**android/app/build.gradle:**
```gradle
android {
    signingConfigs {
        release {
            storeFile file("../../ria-release.jks")
            storePassword "your-password"
            keyAlias "ria-key"
            keyPassword "your-password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

---

## 🎨 图标尺寸速查

### Android (mipmap)

| 文件夹 | 尺寸 |
|--------|------|
| `mipmap-mdpi` | 48×48 |
| `mipmap-hdpi` | 72×72 |
| `mipmap-xhdpi` | 96×96 |
| `mipmap-xxhdpi` | 144×144 |
| `mipmap-xxxhdpi` | 192×192 |

### iOS

| 用途 | 尺寸 |
|------|------|
| 20pt @1x | 20×20 |
| 20pt @2x | 40×40 |
| 20pt @3x | 60×60 |
| 29pt @1x | 29×29 |
| 29pt @2x | 58×58 |
| 29pt @3x | 87×87 |
| 40pt @1x | 40×40 |
| 40pt @2x | 80×80 |
| 40pt @3x | 120×120 |
| 60pt @2x | 120×120 |
| 60pt @3x | 180×180 |
| 76pt @1x | 76×76 |
| 76pt @2x | 152×152 |
| 83.5pt @2x | 167×167 |
| App Store | 1024×1024 |

---

## 📸 应用商店截图尺寸

### Google Play

| 设备 | 尺寸 | 要求 |
|------|------|------|
| 手机 | 1080×1920 | 最少 2 张 |
| 7" 平板 | 1200×1920 | 可选 |
| 10" 平板 | 1800×2560 | 可选 |

### App Store

| 设备 | 尺寸 | 要求 |
|------|------|------|
| 6.5" iPhone | 1284×2778 | 必需 |
| 6.7" iPhone | 1290×2796 | 推荐 |
| 5.5" iPhone | 1242×2208 | 可选 |
| iPad Pro 12.9" | 2048×2732 | 如果支持 |

---

## 🐛 故障排除速查

| 问题 | 解决方案 |
|------|----------|
| `npm install` 失败 | `rm -rf node_modules package-lock.json && npm install` |
| Capacitor 命令找不到 | `npm install -g @capacitor/cli` |
| Android SDK 找不到 | Android Studio → SDK Manager → 安装 SDK |
| iOS 签名错误 | Xcode → Preferences → Accounts → 添加 Apple ID |
| 应用无法联网 | 检查 AndroidManifest.xml 和 Info.plist 权限 |
| 构建失败 | `npx cap doctor` 检查配置 |
| 同步失败 | `npx cap sync --force` |
| 缓存问题 | `npm run build && npx cap sync` |
| Gradle 错误 | Android Studio → File → Invalidate Caches |
| CocoaPods 错误 | `cd ios/App && pod deintegrate && pod install` |

---

## 📚 文档导航

| 文档 | 用途 | 适合人群 |
|------|------|----------|
| [README.md](./README.md) | 项目介绍 | 所有人 |
| [README_NATIVE.md](./README_NATIVE.md) | 完整打包指南 | 首次打包 |
| [EXPORT_GUIDE.md](./EXPORT_GUIDE.md) | 导出项目 | Figma Make 用户 |
| [NATIVE_APP_GUIDE.md](./NATIVE_APP_GUIDE.md) | 快速开始 | 想快速上手 |
| [CAPACITOR_SETUP.md](./CAPACITOR_SETUP.md) | 详细技术文档 | 遇到问题 |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | 快速参考 | 查命令 |

---

## 🎯 检查清单

### 打包前

- [ ] Node.js 18+ 已安装
- [ ] Android Studio 已安装（Android）
- [ ] Xcode 已安装（iOS，仅 macOS）
- [ ] 已运行 `npm install`
- [ ] 已运行 `npm run build` 成功
- [ ] 已生成应用图标
- [ ] 已生成启动屏幕
- [ ] 已修改应用 ID
- [ ] 已修改应用名称
- [ ] 已设置版本号

### 发布前

- [ ] 准备好截图（3-8 张）
- [ ] 准备好应用描述
- [ ] 准备好隐私政策链接
- [ ] 配置好签名（Android）
- [ ] 配置好证书（iOS）
- [ ] 注册了开发者账号
- [ ] 在真机测试通过
- [ ] 版本号正确

---

## ⏱️ 预期时间

| 任务 | 首次 | 后续 |
|------|------|------|
| 导出项目 | 15 分钟 | - |
| 环境配置 | 1-2 小时 | - |
| 生成图标 | 15 分钟 | 5 分钟 |
| Android 打包 | 1-2 小时 | 15 分钟 |
| iOS 打包 | 2-3 小时 | 20 分钟 |
| 商店素材 | 1-2 小时 | 30 分钟 |
| Google Play 审核 | 1-3 天 | 1-3 天 |
| App Store 审核 | 1-7 天 | 1-7 天 |

---

## 💰 费用

| 项目 | 费用 | 说明 |
|------|------|------|
| Google Play 开发者 | $25 | 一次性 |
| Apple Developer | $99/年 | 年费 |
| 开发测试 | 免费 | 不需要付费账号 |

---

## 🔗 重要链接

### 开发者平台
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Apple Developer](https://developer.apple.com)

### 开发工具
- [Android Studio](https://developer.android.com/studio)
- [Xcode](https://developer.apple.com/xcode/)
- [Node.js](https://nodejs.org/)

### 文档
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Docs](https://developer.android.com/)
- [iOS Docs](https://developer.apple.com/documentation/)

### 工具
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/)
- [App Icon Generator](https://www.appicon.co/)

---

**📌 收藏本页，随时查阅！**
