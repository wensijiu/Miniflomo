# 📱 ria Android 应用打包完整指南

## 🎯 当前状态
✅ Capacitor 已配置完成  
✅ 应用 ID: `com.ria.app`  
✅ 应用名称: `ria`  
❌ Android 项目尚未创建（需要执行以下步骤）

---

## 📋 准备工作清单

### ✅ 必需软件（请确认已安装）

1. **Node.js** (v16 或更高)
   - 检查版本：`node --version`
   
2. **npm 或 pnpm**
   - 检查版本：`npm --version` 或 `pnpm --version`

3. **Android Studio** (最新版 - Hedgehog 或更高)
   - 下载地址：https://developer.android.com/studio
   - 必须安装 Android SDK Platform 34 或更高
   - 必须安装 Android Build Tools

4. **Java JDK 17** (Android Studio 会自带)
   - 检查版本：`java --version`
   - Android Studio 会自动配置 JDK 路径

---

## 🚀 步骤 1: 构建 Web 应用

在项目根目录打开终端，执行：

```bash
npm run build
```

这会在 `dist/` 目录生成优化后的 Web 应用文件。

**预期输出**：
```
✓ built in 5.32s
dist/index.html              1.23 kB
dist/assets/index-abc123.js  234.56 kB
...
```

---

## 📱 步骤 2: 创建 Android 项目

执行以下命令创建 Android 项目：

```bash
npx cap add android
```

**预期输出**：
```
✔ Adding native android project in android in 3.45s
✔ Syncing Gradle in 10.23s
✔ add in 13.68s
```

这会在项目根目录创建 `android/` 文件夹，包含完整的 Android Studio 项目。

**创建的文件结构**：
```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── AndroidManifest.xml
│   │       ├── java/com/ria/app/
│   │       └── res/
│   └── build.gradle
├── gradle/
├── build.gradle
└── settings.gradle
```

---

## 🔄 步骤 3: 同步代码到 Android

执行以下命令将 Web 应用同步到 Android 项目：

```bash
npx cap sync android
```

**预期输出**：
```
✔ Copying web assets from dist to android/app/src/main/assets/public in 324ms
✔ Copying native bridge in 2ms
✔ Copying capacitor.config.json in 1ms
✔ copy android in 327ms
✔ Updating Android plugins in 5.23ms
✔ update android in 10.45ms
```

---

## 🎨 步骤 4: 在 Android Studio 中打开项目

### 方法 A: 命令行打开（推荐）

```bash
npx cap open android
```

这会自动启动 Android Studio 并打开项目。

### 方法 B: 手动打开

1. 打开 Android Studio
2. 选择 "Open"
3. 导航到项目根目录的 `android/` 文件夹
4. 点击 "OK"

---

## ⚙️ 步骤 5: Android Studio 配置（重要）

### 5.1 等待 Gradle 同步完成

首次打开项目时，Android Studio 会自动下载依赖和同步 Gradle。

**状态栏提示**：
```
Gradle sync in progress...
```

**请耐心等待 3-10 分钟**（取决于网络速度）

### 5.2 检查 SDK 配置

1. 点击 `File` → `Project Structure` → `SDK Location`
2. 确认 Android SDK 路径已正确配置（通常在 `~/Library/Android/sdk` 或 `C:\Users\你的用户名\AppData\Local\Android\Sdk`）
3. 确认 JDK 路径已配置（通常使用 Android Studio 内置的 JDK 17）

### 5.3 安装缺失的 SDK 组件（如果提示）

如果 Android Studio 提示缺少 SDK 组件，点击提示中的链接自动安装。

---

## 📱 步骤 6: 连接手机并运行应用

### 6.1 准备手机

1. **开启开发者选项**：
   - 进入 `设置` → `关于手机`
   - 连续点击 "版本号" 7次
   - 返回上一级，进入 `开发者选项`

2. **开启 USB 调试**：
   - 在 `开发者选项` 中，开启 "USB 调试"
   - （可选）开启 "USB 安装" 或 "通过 USB 验证应用"

3. **连接手机到电脑**：
   - 使用 USB 数据线连接
   - 手机上会弹出 "允许 USB 调试？" → 点击 "允许"

### 6.2 在 Android Studio 中选择设备

1. 在 Android Studio 顶部工具栏，找到设备选择下拉菜单
2. 应该能看到你的手机型号（例如："Xiaomi Mi 11"）
3. 如果看不到：
   - 检查 USB 线是否连接正常
   - 检查是否允许了 USB 调试
   - 尝试重新插拔 USB 线

### 6.3 运行应用

点击 Android Studio 顶部的 **绿色三角形 ▶️ 按钮** 或按 `Shift + F10`

**预期过程**：
```
Building...
Installing APK...
Launching app...
```

应用会自动安装并在手机上启动！🎉

---

## 📦 步骤 7: 生成 APK 文件（独立安装包）

### 7.1 生成调试版 APK（用于测试分享）

在项目根目录执行：

```bash
cd android
./gradlew assembleDebug
```

**Windows 用户使用**：
```bash
cd android
gradlew.bat assembleDebug
```

**生成的 APK 位置**：
```
android/app/build/outputs/apk/debug/app-debug.apk
```

**文件大小**：约 8-15 MB

**用途**：可以直接发送给朋友安装测试（需要开启"允许安装未知来源"）

### 7.2 安装 APK 到手机

**方法 A：通过 USB**
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**方法 B：直接传输**
1. 将 `app-debug.apk` 复制到手机
2. 在手机上打开文件管理器
3. 点击 APK 文件
4. 允许安装未知来源
5. 点击"安装"

---

## 🚀 步骤 8: 生成发布版 APK（上架 Google Play）

### 8.1 创建签名密钥（首次发布）

在项目根目录执行：

```bash
keytool -genkey -v -keystore ria-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias ria
```

**提示问题回答示例**：
```
输入密钥库口令: [输入密码，例如：mypassword123]
再次输入新口令: [再次输入相同密码]
您的名字与姓氏是什么? [输入你的名字]
您的组织单位名称是什么? [输入组织，例如：ria Team]
您的组织名称是什么? [输入公司名，例如：ria]
您所在的城市或区域名称是什么? [输入城市，例如：Beijing]
您所在的省/市/自治区名称是什么? [输入省份，例如：Beijing]
该单位的双字母国家/地区代码是什么? [输入国家代码，例如：CN]
```

**⚠️ 重要**：
- 妥善保管生成的 `ria-release-key.jks` 文件和密码
- 丢失密钥将无法更新应用！
- 建议备份到云盘

### 8.2 配置签名

编辑 `android/app/build.gradle`，在 `android {` 块中添加：

```gradle
android {
    ...
    
    signingConfigs {
        release {
            storeFile file('../../ria-release-key.jks')
            storePassword 'mypassword123'  // 替换为你的密码
            keyAlias 'ria'
            keyPassword 'mypassword123'    // 替换为你的密码
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 8.3 构建发布版 APK

```bash
cd android
./gradlew assembleRelease
```

**生成的 APK 位置**：
```
android/app/build/outputs/apk/release/app-release.apk
```

### 8.4 构建 AAB（Google Play 上架格式）

Google Play 现在推荐使用 AAB 格式：

```bash
cd android
./gradlew bundleRelease
```

**生成的 AAB 位置**：
```
android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🎨 步骤 9: 自定义应用图标（可选）

### 9.1 准备图标文件

需要一张 **1024x1024** 的 PNG 图标（背景透明）

### 9.2 使用在线工具生成

访问：https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html

1. 上传你的 1024x1024 图标
2. 调整边距、形状
3. 下载生成的 ZIP 文件
4. 解压后，将文件复制到 `android/app/src/main/res/` 目录（覆盖原有文件）

### 9.3 重新构建

```bash
npx cap sync android
```

---

## 🔄 步骤 10: 更新应用流程

每次修改代码后：

```bash
# 1. 构建 Web 应用
npm run build

# 2. 同步到 Android
npx cap sync android

# 3. 在 Android Studio 中重新运行
# 或重新生成 APK
cd android && ./gradlew assembleDebug
```

**快捷命令**（一键构建并同步）：
```bash
npm run cap:build
```

---

## 🐛 常见问题解决

### Q1: "Gradle sync failed" 错误

**解决方案**：
```bash
# 1. 清理 Gradle 缓存
cd android
./gradlew clean

# 2. 重新同步
npx cap sync android

# 3. 在 Android Studio 中
File → Invalidate Caches → Restart
```

### Q2: 手机连接不上 / 看不到设备

**解决方案**：
1. 检查 USB 线是否是数据线（不是只能充电的）
2. 尝试切换 USB 端口
3. 在手机 `开发者选项` 中，切换 "USB 配置" 为 "文件传输 (MTP)"
4. 重启 ADB：
   ```bash
   adb kill-server
   adb start-server
   adb devices
   ```

### Q3: "INSTALL_FAILED_UPDATE_INCOMPATIBLE" 错误

**原因**：手机上已有相同包名但签名不同的应用

**解决方案**：
```bash
# 先卸载旧版本
adb uninstall com.ria.app

# 然后重新安装
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Q4: 应用打开后显示白屏

**解决方案**：
1. 检查是否执行了 `npm run build`
2. 检查是否执行了 `npx cap sync android`
3. 在 Chrome 浏览器访问 `chrome://inspect`，可以调试应用的 WebView

### Q5: "SDK location not found" 错误

**解决方案**：
在 `android/local.properties` 中添加（根据你的系统调整路径）：

**Mac/Linux**：
```
sdk.dir=/Users/你的用户名/Library/Android/sdk
```

**Windows**：
```
sdk.dir=C:\\Users\\你的用户名\\AppData\\Local\\Android\\Sdk
```

---

## 📊 版本号管理

### Android 版本配置

编辑 `android/app/build.gradle`：

```gradle
android {
    defaultConfig {
        versionCode 1        // 每次更新时递增（整数）
        versionName "1.0.0"  // 显示给用户的版本号
    }
}
```

**更新规则**：
- `versionCode`: 必须递增（1 → 2 → 3...），用于 Google Play 识别新版本
- `versionName`: 语义化版本号（1.0.0 → 1.0.1 → 1.1.0），用于显示

---

## 🎯 快速命令参考

```bash
# 构建 Web 应用
npm run build

# 添加 Android 平台（仅首次）
npx cap add android

# 同步代码到 Android
npx cap sync android

# 一键构建并同步
npm run cap:build

# 打开 Android Studio
npx cap open android

# 生成调试版 APK
cd android && ./gradlew assembleDebug

# 生成发布版 APK
cd android && ./gradlew assembleRelease

# 生成 AAB（Google Play 上架）
cd android && ./gradlew bundleRelease

# 查看连接的设备
adb devices

# 安装 APK 到手机
adb install android/app/build/outputs/apk/debug/app-debug.apk

# 卸载应用
adb uninstall com.ria.app
```

---

## 📱 测试清单

在发布前，请确保测试以下功能：

- [ ] 应用能正常启动
- [ ] 所有页面可以正常跳转
- [ ] 快速输入页可以添加笔记
- [ ] 笔记列表可以正常显示
- [ ] 左滑删除功能正常
- [ ] 标签筛选功能正常
- [ ] 随机回顾功能正常
- [ ] 数据统计页显示正常
- [ ] 登录/注册功能正常（如果有网络）
- [ ] 离线状态下使用 localStorage 正常
- [ ] 应用图标显示正常
- [ ] 启动屏幕显示正常
- [ ] 横屏/竖屏切换正常
- [ ] 不同 Android 版本兼容（建议测试 Android 10, 11, 12, 13, 14）

---

## 🎉 完成！

现在您已经成功将 ria Web 应用打包成 Android APK！

**生成的文件**：
- 调试版：`android/app/build/outputs/apk/debug/app-debug.apk`
- 发布版：`android/app/build/outputs/apk/release/app-release.apk`
- Google Play：`android/app/build/outputs/bundle/release/app-release.aab`

**下一步建议**：
1. 在多台设备上测试 APK
2. 收集用户反馈
3. 准备应用商店素材（截图、描述）
4. 上架 Google Play 或其他应用商店

---

## 📚 更多资源

- [Capacitor 官方文档](https://capacitorjs.com/docs)
- [Android 开发者文档](https://developer.android.com/)
- [Google Play 发布指南](https://developer.android.com/distribute)
- [Android Studio 用户指南](https://developer.android.com/studio/intro)

**遇到问题？**
- 查看 Capacitor 官方文档
- 搜索 Stack Overflow
- 查看项目中的 `CAPACITOR_SETUP.md` 文件

---

**🚀 祝您打包顺利！如有问题，请参考上述常见问题或查阅官方文档。**
