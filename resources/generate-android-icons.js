/**
 * Android 图标生成脚本
 * 
 * 使用说明：
 * 1. 将 1024x1024 的 PNG 图标放在 resources/ 目录，命名为 icon.png
 * 2. 运行: node resources/generate-android-icons.js
 * 3. 图标会自动生成到 android/app/src/main/res/ 的各个目录
 * 
 * 需要的依赖：
 * npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Android 图标尺寸配置
const ICON_SIZES = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 },
];

// 路径配置
const SOURCE_ICON = path.join(__dirname, 'icon.png');
const ANDROID_RES_DIR = path.join(__dirname, '../android/app/src/main/res');

async function generateIcons() {
  try {
    // 检查源图标是否存在
    if (!fs.existsSync(SOURCE_ICON)) {
      console.error('❌ 错误: 找不到 resources/icon.png');
      console.log('📝 请将 1024x1024 的 PNG 图标放在 resources/ 目录，命名为 icon.png');
      return;
    }

    console.log('🚀 开始生成 Android 图标...\n');

    // 为每个尺寸生成图标
    for (const { folder, size } of ICON_SIZES) {
      const outputDir = path.join(ANDROID_RES_DIR, folder);
      
      // 创建目录（如果不存在）
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // 生成图标
      const outputPath = path.join(outputDir, 'ic_launcher.png');
      await sharp(SOURCE_ICON)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ ${folder}/ic_launcher.png (${size}x${size})`);

      // 同时生成圆形图标
      const roundOutputPath = path.join(outputDir, 'ic_launcher_round.png');
      await sharp(SOURCE_ICON)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(roundOutputPath);

      console.log(`✅ ${folder}/ic_launcher_round.png (${size}x${size})`);
    }

    console.log('\n🎉 所有图标生成完成！');
    console.log('\n📋 下一步：');
    console.log('1. 运行: npm run build');
    console.log('2. 运行: npx cap sync android');
    console.log('3. 在 Android Studio 中重新构建应用');

  } catch (error) {
    console.error('❌ 生成图标时出错:', error);
  }
}

generateIcons();
