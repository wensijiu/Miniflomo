# Android 图标配置说明

## 📱 快速应用图标（推荐方法）

### 方法 1：使用在线工具（最简单）

1. 访问 [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)
2. 上传你的图标 PNG 文件（建议 1024x1024）
3. 调整参数：
   - Shape: 选择 Square 或 Circle
   - Background: 选择 White 或 Transparent
4. 点击 "Download" 下载 zip 文件
5. 解压后，将 `res/` 目录下的所有文件复制到：
   ```
   android/app/src/main/res/
   ```

### 方法 2：手动配置（使用项目中的图片）

项目已经包含了你选择的 Logo 图片。我们可以使用 Capacitor 的配置自动处理。

修改 `capacitor.config.ts`，添加：

```typescript
android: {
  icon: 'resources/icon.png'
}
```

然后运行 `npx cap sync android` 会自动生成所有尺寸。

### 方法 3：使用 Image Magick（本地批量生成）

如果你安装了 ImageMagick，可以运行以下脚本：

在 PowerShell 中：

```powershell
# 安装 ImageMagick (使用 Chocolatey)
choco install imagemagick

# 进入 resources 目录
cd "D:\Android Studio\MiniFlomo\resources"

# 将你的图标保存为 icon.png (1024x1024)
# 然后运行：

# 生成各种尺寸
magick icon.png -resize 48x48 ../android/app/src/main/res/mipmap-mdpi/ic_launcher.png
magick icon.png -resize 72x72 ../android/app/src/main/res/mipmap-hdpi/ic_launcher.png
magick icon.png -resize 96x96 ../android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
magick icon.png -resize 144x144 ../android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
magick icon.png -resize 192x192 ../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
```

## 🎯 当前项目图标路径

项目中的 Logo 图片资源：
- 图片 ID: `ef9309da961e9457aa6501aaf4a15a9b1839dd32.png`
- 使用位置: `src/app/components/AuthPage.tsx`

## 📋 需要生成的图标尺寸

Android 应用需要以下尺寸的图标：

| 密度    | 文件夹          | 尺寸      |
|---------|----------------|-----------|
| mdpi    | mipmap-mdpi    | 48x48     |
| hdpi    | mipmap-hdpi    | 72x72     |
| xhdpi   | mipmap-xhdpi   | 96x96     |
| xxhdpi  | mipmap-xxhdpi  | 144x144   |
| xxxhdpi | mipmap-xxxhdpi | 192x192   |

每个文件夹需要两个文件：
- `ic_launcher.png` (方形图标)
- `ic_launcher_round.png` (圆形图标)

## ✅ 验证图标是否生效

1. 生成图标后，运行：
   ```powershell
   npm run build
   npx cap sync android
   cd android
   .\gradlew clean
   .\gradlew assembleDebug
   ```

2. 安装到手机/模拟器
3. 在应用列表中查看图标是否已更新
