# 治疗记录管理页面

## 功能概述

治疗记录管理页面用于显示和管理数据库中的治疗记录，采用主从表结构展示一个治疗记录对应的多条标准处方记录、TBS处方记录、MEP记录和MEP数据。

## 页面特性

### 1. 主表显示
- **治疗记录基本信息**：记录ID、患者信息、医生信息、治疗时间、状态等
- **分页查询**：支持分页显示，可配置每页显示数量
- **查询筛选**：支持按患者姓名、患者ID、设备ID、医生姓名、治疗日期、消息类型等条件筛选

### 2. 展开行详情
- **标准处方记录**：显示刺激强度、频率、持续时间、间歇时间、重复次数、总脉冲数、总时间、治疗部位、标准处方、周期数等参数
- **TBS处方记录**：显示TBS类型、丛内频率、丛内个数、丛间频率、丛间个数等TBS特有参数
- **MEP记录**：显示MEP类型、时间等基本信息
- **MEP数据**：显示MT值、通道、最大值、最小值、振幅、刺激部位、记录部位等详细数据

### 3. 操作功能
- **查看详情**：点击眼睛图标查看完整记录信息
- **删除记录**：支持单条删除和批量删除
- **导出Excel**：支持数据导出功能

## 文件结构

```
src/views/manage/prescriptionrecord/
├── PrescriptionRecord.vue      # 主页面组件
├── PrescriptionRecordView.vue  # 详情查看弹窗组件
└── README.md                   # 说明文档
```

## API接口

### 基础查询接口
- `GET /treatmentRecord` - 分页查询列表
- `GET /treatmentRecord/{id}` - 查询主记录
- `GET /treatmentRecord/list` - 查询列表（不分页）

### 完整详情查询接口
- `GET /treatmentRecord/detail/{id}` - 查询完整详情（包含所有关联数据）

### 删除接口
- `DELETE /treatmentRecord/{id}` - 删除单条记录
- `DELETE /treatmentRecord/batch/{ids}` - 批量删除

## 数据结构

### 治疗记录主表
```json
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
  "patientRoom": "",
  "patientNo": "12324341",
  "patientBed": "",
  "presDate": "2025-08-26",
  "presTime": "11:57:29",
  "doctorName": "",
  "mepValue": 50,
  "medicalRecordRemark": "",
  "messageType": "TREATMENT_RECORD_CREATED",
  "createTime": "2025-08-26T11:57:31.685+0800",
  "updateTime": "2025-08-26T11:57:31.685+0800"
}
```

### 标准处方记录
```json
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
  "standardPresName": "",
  "periods": 1,
  "presDate": "2025-08-26",
  "presTime": "11:57:29"
}
```

### TBS处方记录
```json
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
```

### MEP记录
```json
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
    }
  ]
}
```

## 使用方法

### 1. 查询记录
- 在查询表单中输入相应的查询条件
- 点击"查询"按钮执行查询
- 点击"重置"按钮清空查询条件

### 2. 查看详情
- 点击表格中的眼睛图标查看完整记录信息
- 在弹窗中查看基本信息、标准处方记录、TBS处方记录、MEP记录等

### 3. 展开行查看
- 点击表格中的展开箭头图标
- 展开行会显示该记录关联的所有详细数据
- 再次点击箭头图标收起展开行

### 4. 删除操作
- 单条删除：点击表格中的删除图标
- 批量删除：勾选要删除的记录，点击"批量删除"按钮

### 5. 导出数据
- 点击"更多操作"下拉菜单
- 选择"导出Excel"选项

## 注意事项

1. **数据加载**：展开行时才会加载详细的关联数据，避免一次性加载过多数据
2. **权限控制**：删除操作需要相应的权限
3. **数据验证**：删除操作会弹出确认对话框，防止误操作
4. **响应式设计**：页面支持不同屏幕尺寸的响应式布局

## 技术实现

- **前端框架**：Vue.js 2.x + Ant Design Vue
- **状态管理**：Vuex
- **HTTP请求**：Axios
- **日期处理**：Moment.js
- **样式**：Less + CSS3

## 扩展功能

未来可以考虑添加的功能：
- 治疗记录的编辑功能
- 数据统计图表
- 高级筛选条件
- 数据导入功能
- 打印功能
