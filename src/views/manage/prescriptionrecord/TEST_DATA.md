# 治疗记录页面测试数据

## 🧪 测试前准备

### 1. 确保 moment.js 已正确配置
- 检查 `src/main.js` 中是否已添加 `Vue.prototype.$moment = moment`
- 检查是否已导入 `import 'moment/locale/zh-cn'`
- 检查是否已设置 `moment.locale('zh-cn')`

### 2. 检查 API 接口
确保以下接口可以正常访问：
- `GET /treatmentRecord` - 分页查询列表
- `GET /treatmentRecord/detail/{id}` - 查询完整详情

## 📊 模拟数据结构

### 治疗记录主表数据
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": 1,
        "messageId": "373c5c01-ed17-4821-87b7-1b3edb845702",
        "timestamp": 1756180651651,
        "deviceId": 2,
        "deviceNo": 2,
        "medicalRecordId": 25,
        "patientId": 3,
        "patientName": "里斯",
        "patientSex": "女",
        "patientAgeStr": "0 岁",
        "patientRoom": "301",
        "patientNo": "12324341",
        "patientBed": "1",
        "presDate": "2025-08-26",
        "presTime": "11:57:29",
        "doctorName": "张医生",
        "mepValue": 50,
        "medicalRecordRemark": "测试备注",
        "messageType": "TREATMENT_RECORD_CREATED",
        "createTime": "2025-08-26T11:57:31.685+0800",
        "updateTime": "2025-08-26T11:57:31.685+0800"
      },
      {
        "id": 2,
        "messageId": "473c5c01-ed17-4821-87b7-1b3edb845703",
        "timestamp": 1756180651652,
        "deviceId": 3,
        "deviceNo": 3,
        "medicalRecordId": 26,
        "patientId": 4,
        "patientName": "王五",
        "patientSex": "男",
        "patientAgeStr": "35 岁",
        "patientRoom": "302",
        "patientNo": "12324342",
        "patientBed": "2",
        "presDate": "2025-08-26",
        "presTime": "14:30:00",
        "doctorName": "李医生",
        "mepValue": 65,
        "medicalRecordRemark": "",
        "messageType": "TREATMENT_RECORD_COMPLETED",
        "createTime": "2025-08-26T14:30:00.000+0800",
        "updateTime": "2025-08-26T14:30:00.000+0800"
      }
    ],
    "total": 2,
    "size": 10,
    "current": 1,
    "pages": 1
  }
}
```

### 完整详情数据
```json
{
  "success": true,
  "data": {
    "id": 1,
    "messageId": "373c5c01-ed17-4821-87b7-1b3edb845702",
    "timestamp": 1756180651651,
    "deviceId": 2,
    "deviceNo": 2,
    "medicalRecordId": 25,
    "patientId": 3,
    "patientName": "里斯",
    "patientSex": "女",
    "patientAgeStr": "0 岁",
    "patientRoom": "301",
    "patientNo": "12324341",
    "patientBed": "1",
    "presDate": "2025-08-26",
    "presTime": "11:57:29",
    "doctorName": "张医生",
    "mepValue": 50,
    "medicalRecordRemark": "测试备注",
    "messageType": "TREATMENT_RECORD_CREATED",
    "createTime": "2025-08-26T11:57:31.685+0800",
    "updateTime": "2025-08-26T11:57:31.685+0800",
    
    "prescriptionRecords": [
      {
        "id": 1,
        "treatmentRecordId": 1,
        "patientPresId": 1,
        "presStrength": 40,
        "presFreq": 1.0,
        "lastTime": 1.0,
        "pauseTime": 1,
        "repeatCount": 1,
        "totalCount": 1,
        "totalTimeStr": "02秒",
        "presPart": "C6-7棘突",
        "standardPresName": "标准处方A",
        "periods": 1,
        "presDate": "2025-08-26",
        "presTime": "11:57:29"
      },
      {
        "id": 2,
        "treatmentRecordId": 1,
        "patientPresId": 2,
        "presStrength": 50,
        "presFreq": 2.0,
        "lastTime": 2.0,
        "pauseTime": 2,
        "repeatCount": 2,
        "totalCount": 4,
        "totalTimeStr": "08秒",
        "presPart": "C7-T1棘突",
        "standardPresName": "标准处方B",
        "periods": 2,
        "presDate": "2025-08-26",
        "presTime": "11:57:29"
      }
    ],
    
    "tbsPrescriptions": [
      {
        "id": 1,
        "treatmentRecordId": 1,
        "patientPresTbsId": 1,
        "presStrength": 40,
        "innerFreq": 50.0,
        "innerCount": 3,
        "interFreq": 5.0,
        "interCount": 1,
        "pauseTime": 0,
        "repeatCount": 1,
        "totalCount": 3,
        "totalTimeStr": "00秒",
        "presPart": "C6-7棘突",
        "periods": 1,
        "tbsType": "0",
        "presDate": "2025-08-26",
        "presTime": "11:57:29"
      }
    ],
    
    "mepRecords": [
      {
        "id": 1,
        "treatmentRecordId": 1,
        "mepRecordId": 1,
        "dType": 0,
        "inTime": "2025-08-26T09:58:39",
        "mepDataList": [
          {
            "id": 1,
            "mepRecordId": 1,
            "mt": 50,
            "ch": "CH1",
            "maxValue": 100.5,
            "maxTime": 15.2,
            "minValue": -50.3,
            "minTime": 8.7,
            "amplitude": 150.8,
            "part": "C6-7棘突",
            "recordPart": "拇短展肌"
          },
          {
            "id": 2,
            "mepRecordId": 1,
            "mt": 50,
            "ch": "CH2",
            "maxValue": 95.2,
            "maxTime": 14.8,
            "minValue": -45.1,
            "minTime": 9.1,
            "amplitude": 140.3,
            "part": "C6-7棘突",
            "recordPart": "拇短展肌"
          },
          {
            "id": 3,
            "mepRecordId": 1,
            "mt": 55,
            "ch": "CH3",
            "maxValue": 110.8,
            "maxTime": 16.5,
            "minValue": -55.2,
            "minTime": 9.3,
            "amplitude": 166.0,
            "part": "C6-7棘突",
            "recordPart": "拇短展肌"
          }
        ]
      }
    ]
  }
}
```

## 🧪 测试步骤

### 1. 基础功能测试
- [ ] 页面正常加载
- [ ] 查询表单显示正常
- [ ] 表格列显示正确
- [ ] 分页功能正常

### 2. 展开行功能测试
- [ ] 点击展开箭头图标
- [ ] 展开行显示统计信息
- [ ] 标签页正常显示
- [ ] 数据表格内容正确

### 3. 交互功能测试
- [ ] 全部展开按钮功能
- [ ] 全部收起按钮功能
- [ ] Loading状态显示
- [ ] 动画效果表现

### 4. 数据展示测试
- [ ] 标准处方记录标签页
- [ ] TBS处方记录标签页
- [ ] MEP记录标签页
- [ ] 统计信息标签显示

## 🐛 常见问题排查

### 1. moment.js 错误
**错误信息**：`TypeError: this.$moment is not a function`
**解决方案**：
- 检查 `src/main.js` 中是否正确配置了 `Vue.prototype.$moment = moment`
- 确保已导入 `import moment from 'moment'`
- 重启开发服务器

### 2. 数据不显示
**可能原因**：
- API 接口返回数据格式不正确
- 数据结构与组件期望的不匹配
- 网络请求失败

**排查步骤**：
- 检查浏览器控制台是否有错误信息
- 检查 Network 面板中的 API 请求
- 验证返回的数据结构

### 3. 样式问题
**可能原因**：
- CSS 样式冲突
- Ant Design Vue 版本兼容性
- 响应式样式问题

**排查步骤**：
- 检查浏览器开发者工具的 Elements 面板
- 验证 CSS 类名是否正确应用
- 检查是否有样式覆盖

## 📱 响应式测试

### 桌面端测试
- 屏幕宽度 > 768px
- 统计信息标签水平排列
- 展开行完整显示

### 移动端测试
- 屏幕宽度 ≤ 768px
- 统计信息标签垂直排列
- 展开行内边距适当减少

## ✅ 测试完成标准

当以下功能都正常工作时，说明页面已经成功实现：

1. ✅ 页面正常加载，无 JavaScript 错误
2. ✅ 查询表单功能正常
3. ✅ 表格数据正确显示
4. ✅ 展开行功能正常
5. ✅ 统计信息正确显示
6. ✅ 标签页切换正常
7. ✅ 全部展开/收起功能正常
8. ✅ Loading 状态显示正常
9. ✅ 动画效果流畅
10. ✅ 响应式布局正常

---

**注意**：如果遇到问题，请先检查浏览器控制台的错误信息，然后按照上述排查步骤进行问题定位。
