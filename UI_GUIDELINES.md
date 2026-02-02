# 微默 UI 设计规范

## 🎨 设计系统总览

### 设计理念
- **极简主义**: Notion 风格的克制美学
- **功能优先**: 去除装饰性元素，保留功能性图标
- **一致性**: 所有页面保持统一的布局和交互模式
- **轻量级**: 快速响应，流畅体验

---

## 🖼️ 图片使用规范

### ⚠️ 重要规则

**只使用 PNG 格式，禁止使用 SVG**

#### 获取图片
```tsx
// 使用 unsplash_tool 获取 PNG 图片
const imageUrl = await unsplash_tool({ query: "minimalist workspace" });
```

#### 展示图片
```tsx
// 必须使用 ImageWithFallback 组件
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

<ImageWithFallback 
  src={imageUrl}
  alt="工作空间"
  className="w-full h-48 object-cover rounded-2xl"
/>
```

#### 图片搜索建议
- 使用 2-3 个关键词（英文）
- 示例: "minimalist desk", "modern workspace", "simple notebook"
- 保持图片风格简约，与 Notion 美学一致

#### ❌ 禁止事项
- ❌ 不要使用 SVG 格式
- ❌ 不要直接使用 `<img>` 标签
- ❌ 不要使用 `figma:asset` 导入方式
- ❌ 不要导入 SVG 路径数据

#### ✅ 正确做法
```tsx
// ✅ 正确：使用 ImageWithFallback + unsplash_tool
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

function MyComponent() {
  return (
    <ImageWithFallback 
      src="https://images.unsplash.com/..."
      alt="描述"
      className="w-full h-auto"
    />
  );
}
```

---

## 📐 布局规范

### 页面结构标准

#### 1. 顶部导航栏
```
高度: 56px (h-14)
背景: 白色 (bg-white)
边框: 底部 1px 浅灰 (border-b border-border)
定位: 粘性定位 (sticky top-0 z-10)
```

**左中右三栏布局**:
```tsx
<div className="flex items-center justify-between px-4 h-14 border-b border-border bg-white sticky top-0 z-10">
  {/* 左侧: 返回/关闭按钮 */}
  <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors">
    <X className="w-5 h-5" />
  </button>
  
  {/* 居中: 页面标题 */}
  <h1 className="text-base absolute left-1/2 -translate-x-1/2">页面标题</h1>
  
  {/* 右侧: 功能按钮或占位 */}
  <div className="w-8" />
</div>
```

**纯居中布局**:
```tsx
<div className="flex items-center justify-center h-14 border-b border-border bg-white">
  <h1 className="text-base">页面标题</h1>
</div>
```

#### 2. 内容区域
```
背景: 浅米灰 (bg-background = #F7F6F3)
底部内边距: 80px (pb-20) - 避免被 TabBar 遮挡
```

#### 3. 底部导航栏
```
高度: 64px
背景: 白色 (bg-white)
边框: 顶部 1px 浅灰 (border-t border-border)
定位: 固定在底部 (fixed bottom-0)
```

---

## 🎨 颜色系统

### CSS 变量定义

```css
:root {
  /* 主色系 */
  --primary: #37352F;                  /* Notion 深灰黑 */
  --primary-foreground: #ffffff;       /* 白色 */
  
  /* 背景色系 */
  --background: #ffffff;               /* 纯白 */
  --secondary: #F7F6F3;                /* 浅米灰 */
  --accent: #EDECE9;                   /* 浅灰 */
  
  /* 文字色系 */
  --foreground: #37352F;               /* 主文字 */
  --muted-foreground: #9B9A97;         /* 次要文字 */
  
  /* 功能色 */
  --destructive: #EB5757;              /* 红色（删除） */
  --destructive-foreground: #ffffff;   /* 白色 */
  
  /* 边框 */
  --border: rgba(55, 53, 47, 0.09);    /* 浅灰边框 */
  
  /* 输入框 */
  --input-background: #F7F6F3;         /* 输入框背景 */
  --switch-background: #D1D0CE;        /* 开关背景 */
}
```

### Tailwind 类名映射

| 用途 | Tailwind 类名 | 实际颜色 |
|------|--------------|---------|
| 主按钮背景 | `bg-primary` | `#37352F` |
| 主按钮文字 | `text-primary-foreground` | `#ffffff` |
| 页面背景 | `bg-background` | `#ffffff` |
| 卡片背景 | `bg-white` | `#ffffff` |
| 浅色背景 | `bg-secondary` 或 `bg-accent` | `#F7F6F3` 或 `#EDECE9` |
| 主文字 | `text-foreground` | `#37352F` |
| 次要文字 | `text-muted-foreground` | `#9B9A97` |
| 边框 | `border-border` | `rgba(55, 53, 47, 0.09)` |
| 删除按钮 | `bg-destructive` | `#EB5757` |
| 删除文字 | `text-destructive` | `#EB5757` |

### 使用示例

```tsx
{/* 主按钮 */}
<button className="bg-primary text-primary-foreground">
  保存
</button>

{/* 次要按钮 */}
<button className="bg-accent text-accent-foreground">
  取消
</button>

{/* 删除按钮 */}
<button className="bg-destructive text-destructive-foreground">
  删除
</button>

{/* 标签 */}
<span className="bg-primary/10 text-primary">
  #标签
</span>

{/* 输入框 */}
<input className="bg-input-background text-foreground placeholder-muted-foreground" />
```

---

## 🔤 字体规范

### 字号系统

| 元素 | Tailwind 类 | 实际大小 | 用途 |
|------|------------|----------|------|
| 主标题 | `text-base` | 16px | 页面标题、按钮文字 |
| 副标题 | `text-sm` | 14px | 卡片标题、描述文字 |
| 辅助文字 | `text-xs` | 12px | 时间戳、提示文字 |
| 正文 | 默认 | 16px | 笔记内容 |

### 字重系统

| 用途 | Tailwind 类 | 实际字重 |
|------|------------|----------|
| 常规文字 | `font-normal` | 400 |
| 中等强调 | `font-medium` | 500 |

**注意**: 不使用 `font-bold`，保持 Notion 的克制风格

### 行高系统

- 默认: `line-height: 1.5`（在 theme.css 中设置）
- 不使用自定义 leading-xxx 类（除非特殊需求）

### 字体使用示例

```tsx
{/* 页面标题 */}
<h1 className="text-base">页面标题</h1>

{/* 卡片标题 */}
<h2 className="text-sm font-medium">卡片标题</h2>

{/* 描述文字 */}
<p className="text-sm text-muted-foreground">这是一段描述</p>

{/* 时间戳 */}
<span className="text-xs text-muted-foreground">2小时前</span>

{/* 笔记内容 */}
<div className="text-foreground">今天学到了一个新的产品设计理念...</div>
```

---

## 📏 间距规范

### 边距系统

| 用途 | Tailwind 类 | 实际大小 |
|------|------------|----------|
| 页面水平边距 | `px-4` | 16px |
| 页面垂直边距 | `py-4` | 16px |
| 卡片内边距 | `p-5` | 20px |
| 小内边距 | `p-3` | 12px |
| 底部安全距离 | `pb-20` | 80px |

### 间隙系统

| 用途 | Tailwind 类 | 实际大小 |
|------|------------|----------|
| 小间隙 | `gap-2` | 8px |
| 中间隙 | `gap-3` | 12px |
| 大间隙 | `gap-4` | 16px |

### 分组间距

| 用途 | Tailwind 类 | 实际大小 |
|------|------------|----------|
| 卡片组间距 | `mb-3` | 12px |
| 区块间距 | `mb-4` | 16px |

### 间距使用示例

```tsx
{/* 页面容器 */}
<div className="px-4 py-4 pb-20">
  {/* 内容 */}
</div>

{/* 卡片组 */}
<div className="space-y-3">
  <div className="bg-white rounded-2xl p-5">卡片1</div>
  <div className="bg-white rounded-2xl p-5">卡片2</div>
</div>

{/* Flex 布局 */}
<div className="flex items-center gap-3">
  <div>元素1</div>
  <div>元素2</div>
</div>
```

---

## 🔘 圆角规范

### 圆角系统

| 用途 | Tailwind 类 | 实际大小 |
|------|------------|----------|
| 小圆角 | `rounded-sm` | 6px |
| 中圆角 | `rounded-md` | 8px |
| 基础圆角 | `rounded-lg` | 10px |
| 大圆角 | `rounded-xl` | 14px |
| 卡片圆角 | `rounded-2xl` | 16px |
| 超大圆角 | `rounded-3xl` | 24px |
| 完全圆角 | `rounded-full` | 9999px |

### 应用场景

| 元素 | 圆角类 |
|------|--------|
| 按钮（主要） | `rounded-full` |
| 卡片 | `rounded-2xl` |
| 弹窗 | `rounded-3xl` |
| 标签 | `rounded-full` |
| 输入框 | `rounded-lg` |
| 小图标按钮 | `rounded-full` |
| 头像 | `rounded-full` |
| 图片 | `rounded-2xl` |

### 圆角使用示例

```tsx
{/* 主按钮 */}
<button className="rounded-full bg-primary text-primary-foreground px-6 py-3">
  发送
</button>

{/* 卡片 */}
<div className="rounded-2xl bg-white p-5">
  卡片内容
</div>

{/* 图片 */}
<ImageWithFallback 
  src={imageUrl}
  alt="描述"
  className="rounded-2xl w-full h-48 object-cover"
/>

{/* 标签 */}
<span className="rounded-full bg-primary/10 text-primary px-3 py-1.5">
  #标签
</span>

{/* 弹窗 */}
<div className="rounded-3xl bg-white p-6">
  弹窗内容
</div>
```

---

## 🖼️ 组件样式规范

### 1. 按钮 (Button)

#### 主按钮
```tsx
<button className="w-full h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95">
  <Send className="w-5 h-5" />
  <span>发送</span>
</button>
```

#### 次要按钮
```tsx
<button className="px-4 py-2 bg-accent text-accent-foreground rounded-full hover:bg-accent/70 transition-colors">
  取消
</button>
```

#### 删除按钮
```tsx
<button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors">
  删除
</button>
```

#### 图标按钮
```tsx
<button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent/50 transition-colors">
  <X className="w-5 h-5" />
</button>
```

### 2. 卡片 (Card)

#### 基础卡片
```tsx
<div className="bg-white rounded-2xl p-5">
  卡片内容
</div>
```

#### 可点击卡片
```tsx
<button className="w-full bg-white rounded-2xl p-5 text-left hover:bg-accent/30 transition-colors">
  卡片内容
</button>
```

#### 左滑删除卡片（笔记卡片）
```tsx
import { Trash2 } from 'lucide-react';

// 需要状态管理
const [swipeOffset, setSwipeOffset] = useState(0);
const [isDeleting, setIsDeleting] = useState(false);

// 左滑删除逻辑
const handleTouchStart = (e: React.TouchEvent) => {
  // 实现触摸滑动逻辑
};

return (
  <div className="relative overflow-hidden">
    {/* Delete Button Background */}
    {(swipeOffset > 0 || isDeleting) && (
      <button
        onClick={handleDeleteClick}
        className="absolute right-0 top-0 bottom-0 w-20 bg-destructive flex items-center justify-center rounded-r-2xl"
      >
        <Trash2 className="w-5 h-5 text-white" />
      </button>
    )}
    
    <div 
      className="bg-white rounded-2xl p-5 transition-transform"
      style={{ 
        transform: `translateX(-${swipeOffset}px)`,
        transition: swipeOffset === 0 ? 'transform 0.3s ease' : 'none'
      }}
      onTouchStart={handleTouchStart}
    >
      卡片内容
    </div>
  </div>
);
```

#### 带图片的卡片
```tsx
<div className="bg-white rounded-2xl overflow-hidden">
  <ImageWithFallback 
    src={imageUrl}
    alt="图片描述"
    className="w-full h-48 object-cover"
  />
  <div className="p-5">
    <h3 className="text-sm font-medium">卡片标题</h3>
    <p className="text-sm text-muted-foreground mt-2">卡片描述</p>
  </div>
</div>
```

#### 渐变卡片（特殊强调）
```tsx
<div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5">
  特殊内容
</div>
```

### 3. 标签 (Tag)

#### 普通标签
```tsx
<span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
  #标签名
</span>
```

#### 可点击标签
```tsx
<button className="px-3 py-1.5 rounded-full text-sm transition-all bg-accent text-accent-foreground hover:bg-accent/70">
  #标签名
</button>
```

#### 选中状态标签
```tsx
<button className="px-3 py-1.5 rounded-full text-sm bg-primary text-primary-foreground shadow-sm">
  #已选中
</button>
```

### 4. 输入框 (Input)

#### 文本输入框
```tsx
<input
  type="text"
  placeholder="请输入..."
  className="w-full px-4 py-3 bg-input-background border-none outline-none text-foreground placeholder-muted-foreground rounded-lg"
/>
```

#### 多行文本框
```tsx
<textarea
  placeholder="请输入..."
  className="w-full px-4 py-3 bg-input-background border-none outline-none text-foreground placeholder-muted-foreground rounded-lg resize-none"
  rows={4}
/>
```

#### 无背景输入框（快速输入页）
```tsx
<textarea
  placeholder="发生了什么？想到什么？记下来..."
  className="w-full resize-none border-none outline-none text-foreground placeholder-muted-foreground bg-transparent text-center"
/>
```

### 5. 图片组件

#### 使用 ImageWithFallback
```tsx
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

{/* 基础用法 */}
<ImageWithFallback 
  src={imageUrl}
  alt="图片描述"
  className="w-full h-48 object-cover rounded-2xl"
/>

{/* 头像 */}
<ImageWithFallback 
  src={avatarUrl}
  alt="用户头像"
  className="w-12 h-12 rounded-full object-cover"
/>

{/* 封面图 */}
<ImageWithFallback 
  src={coverUrl}
  alt="封面"
  className="w-full h-64 object-cover rounded-t-2xl"
/>
```

### 6. 菜单项 (MenuItem)

```tsx
<button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-accent/50 transition-colors text-left border-b border-border">
  {/* 图标 */}
  <div className="text-primary">
    <Icon className="w-5 h-5" />
  </div>
  
  {/* 文字 */}
  <div className="flex-1">
    <div className="text-foreground">主标题</div>
    <div className="text-sm text-muted-foreground mt-0.5">描述文字</div>
  </div>
  
  {/* 右箭头 */}
  <div className="text-muted-foreground">›</div>
</button>
```

### 7. 分割线

#### 水平分割线
```tsx
<div className="border-b border-border" />
```

#### 卡片组分割
```tsx
<div className="h-3" /> {/* 12px 间距 */}
```

### 8. 空状态 (Empty State)

```tsx
<div className="flex flex-col items-center justify-center py-20 text-center">
  <div className="text-6xl mb-4">📝</div>
  <h3 className="text-base mb-2">暂无笔记</h3>
  <p className="text-sm text-muted-foreground">快去记录你的第一个想法吧</p>
</div>
```

### 9. Toast 提示

```tsx
<div className="fixed top-20 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-full shadow-lg z-50">
  已保存
</div>
```

### 10. 弹窗 (Modal)

```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
    {/* Header */}
    <div className="flex items-center justify-between p-5 border-b border-border">
      <h2 className="text-lg font-medium">弹窗标题</h2>
      <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent/50">
        <X className="w-5 h-5" />
      </button>
    </div>
    
    {/* Content */}
    <div className="p-5">
      弹窗内容
    </div>
    
    {/* Footer */}
    <div className="flex gap-3 p-5 border-t border-border">
      <button className="flex-1 py-3 bg-accent text-accent-foreground rounded-full">
        取消
      </button>
      <button className="flex-1 py-3 bg-primary text-primary-foreground rounded-full">
        确定
      </button>
    </div>
  </div>
</div>
```

---

## 🎭 图标规范

### 图标库
- **主要库**: Lucide React
- **大小**: 默认 `w-5 h-5` (20px)
- **颜色**: 继承父元素 `text-xxx`

### 常用图标

| 功能 | 图标组件 | 用途 |
|------|---------|------|
| 发送 | `<Send />` | 提交按钮 |
| 关闭 | `<X />` | 关闭/返回 |
| 删除 | `<Trash2 />` | 删除操作 |
| 标签 | `<Hash />` | 标签功能 |
| 用户 | `<User />` | 个人中心 |
| 时钟 | `<Clock />` | 回顾功能 |
| 编辑 | `<PenLine />` | 快速输入 |
| 随机 | `<Shuffle />` | 随机回顾 |
| 统计 | `<TrendingUp />` | 数据统计 |
| 日历 | `<Calendar />` | 日历功能 |
| 目标 | `<Target />` | 目标设置 |
| 提醒 | `<Bell />` | 提醒设置 |
| 关于 | `<Info />` | 关于页面 |
| 帮助 | `<HelpCircle />` | 帮助功能 |
| 图片 | `<Image />` | 图片功能 |
| 右箭头 | `›` | 菜单项（文本符号） |

### 图标使用示例

```tsx
{/* 按钮内图标 */}
<button>
  <Send className="w-5 h-5" />
  <span>发送</span>
</button>

{/* 菜单项图标 */}
<div className="text-primary">
  <Target className="w-5 h-5" />
</div>

{/* 图标按钮 */}
<button className="w-8 h-8 flex items-center justify-center">
  <X className="w-5 h-5" />
</button>
```

### Emoji 使用规范

**原则**: 极度克制，仅用于装饰性场景

**允许场景**:
- 头像占位: `📝` (text-xl)
- 空状态: `📝` `🏷️` (text-6xl)
- 功能说明: 小 emoji (text-base) + 文字

**禁止场景**:
- ❌ 页面标题
- ❌ 按钮文字
- ❌ 导航栏

**示例**:
```tsx
{/* ✅ 允许: 头像 */}
<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
  <span className="text-xl">📝</span>
</div>

{/* ✅ 允许: 空状态 */}
<div className="text-6xl">📝</div>

{/* ✅ 允许: 功能说明（小尺寸） */}
<div className="flex items-start gap-3">
  <div className="text-base">✍️</div>
  <div>
    <h4 className="text-sm font-medium">快速记录</h4>
    <p className="text-xs text-muted-foreground">随时捕捉灵感</p>
  </div>
</div>

{/* ❌ 禁止: 页面标题 */}
<h1 className="text-base">关于微默</h1>  // 不加 📝
```

---

## 🎬 动画规范

### 动画库
- **主要库**: Motion (Framer Motion)
- **原则**: 轻量、快速、有意义

### 常用动画

#### 1. 页面进入动画
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.2 }}
>
  页面内容
</motion.div>
```

#### 2. 列表项动画
```tsx
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.15 }}
>
  列表项
</motion.div>
```

#### 3. 按钮点击动画
```tsx
<button className="active:scale-95 transition-all">
  点击我
</button>
```

#### 4. Hover 动画
```tsx
<button className="hover:bg-accent/50 transition-colors">
  悬停效果
</button>
```

### 时长规范
- **快速**: 150ms - 用于小元素、hover
- **标准**: 200ms - 用于弹窗、页面切换
- **慢速**: 300ms - 用于大面积变化

---

## 📱 响应式规范

### 断点系统
- **移动端**: < 640px (默认)
- **平板**: 640px - 1024px
- **桌面**: > 1024px

### 适配原则
1. **移动优先**: 默认为移动端设计
2. **固定宽度**: 在大屏幕上限制最大宽度
3. **居中显示**: 大屏幕内容居中

### 最大宽度
```tsx
<div className="max-w-md mx-auto"> {/* 最大 448px */}
  应用内容
</div>
```

---

## ✅ 开发检查清单

### 布局检查
- [ ] 顶部导航栏高度 56px
- [ ] 底部 TabBar 高度 64px
- [ ] 内容区底部内边距 80px (避免遮挡)
- [ ] 页面水平边距 16px

### 颜色检查
- [ ] 使用语义化颜色类 (bg-primary, text-muted-foreground)
- [ ] 不使用硬编码颜色值
- [ ] 主色为 #37352F
- [ ] 背景为纯白 #FFFFFF

### 字体检查
- [ ] 不使用自定义 font-size (除非特殊需求)
- [ ] 不使用 font-bold
- [ ] 标题使用 text-base
- [ ] 描述使用 text-sm
- [ ] 辅助文字使用 text-xs

### 圆角检查
- [ ] 按钮使用 rounded-full
- [ ] 卡片使用 rounded-2xl
- [ ] 弹窗使用 rounded-3xl
- [ ] 标签使用 rounded-full
- [ ] 图片使用 rounded-2xl

### 图标检查
- [ ] 图标大小统一 w-5 h-5
- [ ] 使用 Lucide React 图标
- [ ] Emoji 使用克制（仅装饰性场景）
- [ ] 页面标题不使用 emoji

### 图片检查
- [ ] 只使用 PNG 格式
- [ ] 禁止使用 SVG 格式
- [ ] 使用 ImageWithFallback 组件
- [ ] 通过 unsplash_tool 获取图片
- [ ] 图片有合适的 alt 属性
- [ ] 图片使用 rounded-2xl 圆角

### 交互检查
- [ ] 按钮有 hover 效果
- [ ] 主按钮有 active:scale-95
- [ ] 使用 transition-colors 或 transition-all
- [ ] 禁用状态有 disabled:opacity-50

### 一致性检查
- [ ] 所有页面标题栏高度一致
- [ ] 所有卡片样式一致
- [ ] 所有按钮样式统一
- [ ] 所有间距符合规范

---

## 🚫 常见错误

### ❌ 不要做的事

1. **不要使用自定义颜色**
```tsx
// ❌ 错误
<div style={{ backgroundColor: '#333' }}>

// ✅ 正确
<div className="bg-primary">
```

2. **不要使用内联样式**
```tsx
// ❌ 错误
<div style={{ padding: '20px' }}>

// ✅ 正确
<div className="p-5">
```

3. **不要自定义字体大小**
```tsx
// ❌ 错误
<h1 className="text-2xl font-bold">

// ✅ 正确
<h1 className="text-base">  // 默认已是 medium
```

4. **不要在标题加 emoji**
```tsx
// ❌ 错误
<h1 className="text-base">📝 关于微默</h1>

// ✅ 正确
<h1 className="text-base">关于微默</h1>
```

5. **不要使用 SVG**
```tsx
// ❌ 错误
import svgPaths from '@/imports/svg-xxx';
import logo from './logo.svg';

// ✅ 正确
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
<ImageWithFallback src={pngUrl} alt="Logo" />
```

6. **不要直接使用 img 标签**
```tsx
// ❌ 错误
<img src={url} alt="图片" />

// ✅ 正确
<ImageWithFallback src={url} alt="图片" />
```

7. **不要忘记禁用状态**
```tsx
// ❌ 错误
<button disabled>提交</button>

// ✅ 正确
<button disabled className="disabled:opacity-50 disabled:cursor-not-allowed">
  提交
</button>
```

---

## 📋 代码模板

### 页面组件模板
```tsx
import { X } from 'lucide-react';

interface XxxPageProps {
  onClose: () => void;
  // 其他 props
}

export function XxxPage({ onClose }: XxxPageProps) {
  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-border bg-white sticky top-0 z-10">
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h1 className="text-base absolute left-1/2 -translate-x-1/2">页面标题</h1>
        <div className="w-8" />
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-20">
        {/* 页面内容 */}
      </div>
    </div>
  );
}
```

### 卡片组件模板
```tsx
<div className="bg-white rounded-2xl overflow-hidden">
  {/* 卡片内容区域 */}
  <div className="p-5">
    <h3 className="text-sm font-medium mb-2">卡片标题</h3>
    <p className="text-sm text-muted-foreground">卡片描述</p>
  </div>
</div>
```

### 带图片卡片模板
```tsx
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

<div className="bg-white rounded-2xl overflow-hidden">
  <ImageWithFallback 
    src={imageUrl}
    alt="图片描述"
    className="w-full h-48 object-cover"
  />
  <div className="p-5">
    <h3 className="text-sm font-medium mb-2">卡片标题</h3>
    <p className="text-sm text-muted-foreground">卡片描述</p>
  </div>
</div>
```

### 按钮组模板
```tsx
<div className="flex gap-3 px-4 py-4">
  <button className="flex-1 py-3 bg-accent text-accent-foreground rounded-full hover:bg-accent/70 transition-colors">
    取消
  </button>
  <button className="flex-1 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
    确定
  </button>
</div>
```

---

## 🎯 设计原则总结

1. **极简**: 去除所有非必要元素
2. **克制**: Emoji 和装饰性元素极度克制使用
3. **一致**: 保持所有页面的布局和交互一致性
4. **功能**: 优先展示功能，而非装饰
5. **清晰**: 层次分明，信息易读
6. **轻量**: 快速响应，流畅体验
7. **PNGOnly**: 只使用 PNG 格式图片，禁止 SVG

---

**Made with ❤️ for beautiful note-taking**