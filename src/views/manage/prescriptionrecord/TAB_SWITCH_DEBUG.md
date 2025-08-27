# 标签页切换功能调试说明

## 🔍 问题分析

### 原始问题
展开行中的标签页无法正常切换，点击标签页没有反应。

### 问题原因
1. **`v-if` 与标签页冲突**：使用 `v-if` 会导致标签页被动态创建和销毁，影响切换功能
2. **`activeTab` 初始化问题**：`record.activeTab` 可能没有正确初始化
3. **缺少事件处理**：没有处理标签页切换事件

## 🛠️ 修复方案

### 1. 替换 `v-if` 为 `v-show`
```vue
<!-- 修复前：使用 v-if 会导致标签页无法切换 -->
<a-tab-pane 
  v-if="record.prescriptionRecords && record.prescriptionRecords.length > 0"
  key="prescription" 
  tab="标准处方记录"
>

<!-- 修复后：使用 v-show 保持标签页结构稳定 -->
<a-tab-pane 
  key="prescription" 
  tab="标准处方记录"
  v-show="record.prescriptionRecords && record.prescriptionRecords.length > 0"
>
```

### 2. 正确初始化 `activeTab`
```javascript
loadDetailData (record) {
  // ... 其他代码 ...
  
  // 确保 activeTab 正确初始化
  this.$set(record, 'activeTab', this.getDefaultActiveTab(detailData))
}
```

### 3. 添加标签页切换事件
```vue
<a-tabs 
  v-model="record.activeTab" 
  type="card" 
  size="small"
  @change="handleTabChange"
>
```

## 🧪 测试步骤

### 1. 基础功能测试
- [ ] 展开行正常显示
- [ ] 标签页标签正确显示
- [ ] 默认标签页正确激活

### 2. 标签页切换测试
- [ ] 点击不同标签页可以切换
- [ ] 切换后内容正确显示
- [ ] 控制台有切换日志输出

### 3. 数据展示测试
- [ ] 标准处方记录标签页内容正确
- [ ] TBS处方记录标签页内容正确
- [ ] MEP记录标签页内容正确

## 🔧 调试方法

### 1. 检查控制台输出
```javascript
// 在 handleTabChange 方法中添加日志
handleTabChange (activeKey) {
  console.log('标签页切换到:', activeKey)
  console.log('当前记录:', this.dataSource.find(r => r.expanded))
}
```

### 2. 检查 Vue DevTools
- 查看组件状态
- 检查 `activeTab` 值是否正确
- 观察数据变化

### 3. 检查网络请求
- 确认 API 调用成功
- 验证返回数据结构
- 检查数据是否正确合并

## 📋 常见问题排查

### 问题1：标签页点击无反应
**可能原因**：
- `activeTab` 没有正确初始化
- 标签页的 `key` 值重复或冲突

**解决方案**：
- 检查 `loadDetailData` 方法中的 `activeTab` 设置
- 确保每个标签页的 `key` 唯一

### 问题2：标签页内容不显示
**可能原因**：
- 数据没有正确加载
- 条件判断逻辑错误

**解决方案**：
- 检查 API 返回的数据结构
- 验证 `v-show` 条件判断

### 问题3：标签页切换后状态丢失
**可能原因**：
- 组件重新渲染
- 数据被重置

**解决方案**：
- 使用 `v-show` 而不是 `v-if`
- 确保数据状态持久化

## ✅ 修复完成标准

当以下功能都正常工作时，说明标签页切换功能已经修复：

1. ✅ 展开行正常显示
2. ✅ 标签页标签正确显示
3. ✅ 默认标签页正确激活
4. ✅ 点击标签页可以正常切换
5. ✅ 切换后内容正确显示
6. ✅ 控制台有切换日志输出
7. ✅ 各标签页内容正确展示

## 🚀 优化建议

### 1. 用户体验优化
- 添加标签页切换动画
- 记住用户上次选择的标签页
- 添加标签页切换提示

### 2. 性能优化
- 懒加载标签页内容
- 缓存已加载的数据
- 优化标签页渲染性能

### 3. 功能扩展
- 支持标签页拖拽排序
- 添加标签页关闭功能
- 支持自定义标签页

---

**注意**：如果问题仍然存在，请检查浏览器控制台的错误信息，并按照上述排查步骤进行问题定位。
