# 🚀 快速开始 - 清空数据测试

## 方法 1：使用应用内按钮（推荐）⭐

1. **打开应用**
2. **点击底部"我的"Tab**（最右边）
3. **滚动到页面最底部**
4. **点击"清空所有数据"**（红色警告图标 ⚠️）
5. **确认对话框中点击"确定"**
6. ✅ 页面自动刷新，回到空白状态

---

## 方法 2：使用浏览器控制台

### 完全清空（推荐）
```javascript
localStorage.clear();
location.reload();
```

### 只清空笔记数据
```javascript
localStorage.removeItem('weimo-notes');
location.reload();
```

### 只清空目标设置
```javascript
localStorage.removeItem('goals');
location.reload();
```

---

## ✅ 验证清空成功

清空后，你应该看到：

### 1️⃣ 快速输入页（默认页）
- ✅ 空白输入框
- ✅ "暂无常用标签"

### 2️⃣ 回顾页
- ✅ "还没有笔记"
- ✅ "开始记录你的想法吧"

### 3️⃣ 标签页
- ✅ Hash 图标 #
- ✅ "还没有标签"

### 4️⃣ 我的页面
- ✅ 数据全部显示 0
- ✅ 进度条下方显示"未设置"
- ✅ 显示提示：💡 "还没有设置目标？去设置"

---

## 🧪 测试完整流程

### Step 1: 清空数据
使用上述任一方法清空数据

### Step 2: 记录第一条笔记
1. 在快速输入页输入："今天天气真好"
2. 添加标签：输入"#生活"，按回车
3. 点击发送按钮
4. ✅ 看到 Toast 提示"已保存"

### Step 3: 验证数据同步
1. 切换到"回顾"Tab
   - ✅ 看到刚才记录的笔记
2. 切换到"标签"Tab
   - ✅ 看到"生活"标签（1 条笔记）
3. 切换到"我的"Tab
   - ✅ 连续天数：1 天
   - ✅ 本周笔记：1 条
   - ✅ 总笔记：1 条
   - ✅ 进度条依然显示"未设置"（因为没设置目标）

### Step 4: 设置目标
1. 在"我的"页面，点击"目标设置"
2. 设置：
   - 连续记录目标：7 天
   - 本周笔记目标：10 条
   - 总笔记里程碑：50 条
3. 点击"保存目标"
4. ✅ 返回个人中心，看到进度条显示：
   - "1/7"（连续天数）
   - "1/10"（本周笔记）
   - "1/50"（总笔记）
5. ✅ 💡 提示消失了

### Step 5: 刷新测试持久化
1. 刷新页面（F5）
2. ✅ 笔记依然存在
3. ✅ 标签依然存在
4. ✅ 目标设置依然存在
5. ✅ 数据正确显示

---

## 🐛 常见问题

### Q1: 点击"清空所有数据"没反应？
**A:** 确保浏览器允许弹窗，可能是确认对话框被拦截了。

### Q2: 清空后刷新，示例数据又回来了？
**A:** 这说明代码没有正确更新。请：
1. 硬刷新（Ctrl + Shift + R）
2. 如果还不行，检查 App.tsx 中是否还有示例数据

### Q3: 目标设置显示的还是默认值？
**A:** 请：
1. 在浏览器控制台执行：`localStorage.removeItem('goals')`
2. 刷新页面
3. 检查是否显示"未设置"

### Q4: 如何恢复到有数据的状态？
**A:** 手动记录几条笔记即可，或者：
```javascript
// 在控制台执行以下代码添加测试数据
const testNote = {
  id: Date.now().toString(),
  content: '测试笔记',
  tags: ['测试'],
  timestamp: Date.now()
};
const notes = JSON.parse(localStorage.getItem('weimo-notes') || '[]');
notes.unshift(testNote);
localStorage.setItem('weimo-notes', JSON.stringify(notes));
location.reload();
```

---

## 📦 localStorage Keys

应用使用的所有 localStorage 键：

1. **`weimo-notes`** - 笔记数据
2. **`goals`** - 目标设置
3. **`weimo-reminder-settings`** - 提醒设置

---

## 🎯 开发建议

### 开发时保持数据
如果不想每次刷新都清空数据，可以注释掉开发环境的清空逻辑。

### 测试不同数据量
```javascript
// 生成 100 条测试笔记
const notes = [];
for (let i = 0; i < 100; i++) {
  notes.push({
    id: (Date.now() - i * 86400000).toString(),
    content: `测试笔记 ${i + 1}`,
    tags: ['测试', '批量数据'],
    timestamp: Date.now() - i * 86400000
  });
}
localStorage.setItem('weimo-notes', JSON.stringify(notes));
location.reload();
```

---

**提示**: 清空数据是不可恢复的操作，请谨慎使用！建议在测试完成后，手动记录一些真实的笔记来体验应用。
