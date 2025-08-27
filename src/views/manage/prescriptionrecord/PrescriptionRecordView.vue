<template>
  <a-modal 
    v-model="show" 
    title="治疗记录详情" 
    @cancel="onClose" 
    :width="1200"
    :footer="null"
  >
    <div style="font-size: 13px; font-family: SimHei" v-if="recordData !== null">
      <!-- 基本信息 -->
      <div class="info-section">
        <h3>基本信息</h3>
        <a-row :gutter="16">
          <a-col :span="8">
            <div class="info-item">
              <label>记录ID:</label>
              <span>{{ recordData.id }}</span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="info-item">
              <label>消息ID:</label>
              <span>{{ recordData.messageId }}</span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="info-item">
              <label>设备ID:</label>
              <span>{{ recordData.deviceId }}</span>
            </div>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="8">
            <div class="info-item">
              <label>患者姓名:</label>
              <span>{{ recordData.patientName }}</span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="info-item">
              <label>患者ID:</label>
              <span>{{ recordData.patientId }}</span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="info-item">
              <label>性别:</label>
              <a-tag v-if="recordData.patientSex === '男'" color="blue">男</a-tag>
              <a-tag v-else-if="recordData.patientSex === '女'" color="pink">女</a-tag>
              <span v-else>{{ recordData.patientSex || '-' }}</span>
            </div>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="8">
            <div class="info-item">
              <label>年龄:</label>
              <span>{{ recordData.patientAgeStr }}</span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="info-item">
              <label>病房:</label>
              <span>{{ recordData.patientRoom || '-' }}</span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="info-item">
              <label>床号:</label>
              <span>{{ recordData.patientBed || '-' }}</span>
            </div>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="8">
            <div class="info-item">
              <label>患者编号:</label>
              <span>{{ recordData.patientNo }}</span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="info-item">
              <label>医生姓名:</label>
              <span>{{ recordData.doctorName || '-' }}</span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="info-item">
              <label>MEP值:</label>
              <span v-if="recordData.mepValue !== null && recordData.mepValue !== undefined">{{ recordData.mepValue }}%</span>
              <span v-else>-</span>
            </div>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="8">
            <div class="info-item">
              <label>治疗日期:</label>
              <span>{{ recordData.presDate }}</span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="info-item">
              <label>治疗时间:</label>
              <span>{{ recordData.presTime }}</span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="info-item">
              <label>消息类型:</label>
              <a-tag v-if="recordData.messageType === 'TREATMENT_RECORD_CREATED'" color="green">治疗记录创建</a-tag>
              <a-tag v-else-if="recordData.messageType === 'TREATMENT_RECORD_UPDATED'" color="blue">治疗记录更新</a-tag>
              <a-tag v-else-if="recordData.messageType === 'TREATMENT_RECORD_COMPLETED'" color="orange">治疗记录完成</a-tag>
              <span v-else>{{ recordData.messageType || '-' }}</span>
            </div>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="8">
            <div class="info-item">
              <label>创建时间:</label>
              <span>{{ formatDateTime(recordData.createTime) }}</span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="info-item">
              <label>更新时间:</label>
              <span>{{ formatDateTime(recordData.updateTime) }}</span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="info-item">
              <label>备注:</label>
              <span>{{ recordData.medicalRecordRemark || '-' }}</span>
            </div>
          </a-col>
        </a-row>
      </div>
      
      <!-- 标准处方记录 -->
      <div v-if="recordData.prescriptionRecords && recordData.prescriptionRecords.length > 0" class="info-section">
        <h3>标准处方记录</h3>
        <a-table 
          :columns="prescriptionColumns" 
          :dataSource="recordData.prescriptionRecords" 
          :pagination="false"
          size="small"
          :rowKey="item => item.id"
          :scroll="{ x: 1200 }"
        />
      </div>
      
      <!-- TBS处方记录 -->
      <div v-if="recordData.tbsPrescriptions && recordData.tbsPrescriptions.length > 0" class="info-section">
        <h3>TBS处方记录</h3>
        <a-table 
          :columns="tbsColumns" 
          :dataSource="recordData.tbsPrescriptions" 
          :pagination="false"
          size="small"
          :rowKey="item => item.id"
          :scroll="{ x: 1200 }"
        />
      </div>
      
      <!-- MEP记录 -->
      <div v-if="recordData.mepRecords && recordData.mepRecords.length > 0" class="info-section">
        <h3>MEP记录</h3>
        <div v-for="mepRecord in recordData.mepRecords" :key="mepRecord.id" class="mep-record-detail">
          <div class="mep-record-header">
            <h4>MEP记录 #{{ mepRecord.id }}</h4>
            <div class="mep-record-info">
              <span><strong>类型:</strong> {{ getMepTypeText(mepRecord.dType) }}</span>
              <span><strong>时间:</strong> {{ formatDateTime(mepRecord.inTime) }}</span>
            </div>
          </div>
          
          <a-table 
            :columns="mepDataColumns" 
            :dataSource="mepRecord.mepDataList" 
            :pagination="false"
            size="small"
            :rowKey="item => item.id"
            :scroll="{ x: 1000 }"
          />
        </div>
      </div>
      
      <!-- 无关联数据提示 -->
      <div v-if="(!recordData.prescriptionRecords || recordData.prescriptionRecords.length === 0) && 
                  (!recordData.tbsPrescriptions || recordData.tbsPrescriptions.length === 0) && 
                  (!recordData.mepRecords || recordData.mepRecords.length === 0)" 
           class="no-data-tip">
        <a-empty description="暂无关联数据" />
      </div>
    </div>
    
    <div class="modal-footer">
      <a-button type="primary" @click="onClose">关闭</a-button>
    </div>
  </a-modal>
</template>

<script>


export default {
  name: 'PrescriptionRecordView',
  props: {
    recordShow: {
      type: Boolean,
      default: false
    },
    recordData: {
      type: Object,
      default: null
    }
  },
  computed: {
    show: {
      get: function () {
        return this.recordShow
      },
      set: function () {}
    },
    
    // 标准处方记录列
    prescriptionColumns () {
      return [
        { title: 'ID', dataIndex: 'id', width: 60 },
        { title: '刺激强度', dataIndex: 'presStrength', width: 80, customRender: (text) => `${text}%` },
        { title: '频率', dataIndex: 'presFreq', width: 80, customRender: (text) => `${text}Hz` },
        { title: '持续时间', dataIndex: 'lastTime', width: 80, customRender: (text) => `${text}秒` },
        { title: '间歇时间', dataIndex: 'pauseTime', width: 80, customRender: (text) => `${text}秒` },
        { title: '重复次数', dataIndex: 'repeatCount', width: 80 },
        { title: '总脉冲数', dataIndex: 'totalCount', width: 80 },
        { title: '总时间', dataIndex: 'totalTimeStr', width: 80 },
        { title: '治疗部位', dataIndex: 'presPart', width: 120 },
        { title: '标准处方', dataIndex: 'standardPresName', width: 120 },
        { title: '周期数', dataIndex: 'periods', width: 80 }
      ]
    },
    
    // TBS处方记录列
    tbsColumns () {
      return [
        { title: 'ID', dataIndex: 'id', width: 60 },
        { title: '刺激强度', dataIndex: 'presStrength', width: 80, customRender: (text) => `${text}%` },
        { title: '丛内频率', dataIndex: 'innerFreq', width: 80, customRender: (text) => `${text}Hz` },
        { title: '丛内个数', dataIndex: 'innerCount', width: 80 },
        { title: '丛间频率', dataIndex: 'interFreq', width: 80, customRender: (text) => `${text}Hz` },
        { title: '丛间个数', dataIndex: 'interCount', width: 80 },
        { title: '间歇时间', dataIndex: 'pauseTime', width: 80, customRender: (text) => `${text}秒` },
        { title: '重复次数', dataIndex: 'repeatCount', width: 80 },
        { title: '总脉冲数', dataIndex: 'totalCount', width: 80 },
        { title: '总时间', dataIndex: 'totalTimeStr', width: 80 },
        { title: '治疗部位', dataIndex: 'presPart', width: 120 },
        { title: '周期数', dataIndex: 'periods', width: 80 },
        { title: 'TBS类型', dataIndex: 'tbsType', width: 80, customRender: (text) => text === '0' ? 'iTBS' : 'cTBS' }
      ]
    },
    
    // MEP数据列
    mepDataColumns () {
      return [
        { title: 'ID', dataIndex: 'id', width: 60 },
        { title: 'MT值', dataIndex: 'mt', width: 60, customRender: (text) => `${text}%` },
        { title: '通道', dataIndex: 'ch', width: 60 },
        { title: '最大值(μV)', dataIndex: 'maxValue', width: 90, customRender: (text) => text ? `${text.toFixed(1)}μV` : '-' },
        { title: '最大值时间', dataIndex: 'maxTime', width: 100, customRender: (text) => text ? `${text}ms` : '-' },
        { title: '最小值(μV)', dataIndex: 'minValue', width: 90, customRender: (text) => text ? `${text.toFixed(1)}μV` : '-' },
        { title: '最小值时间', dataIndex: 'minTime', width: 100, customRender: (text) => text ? `${text}ms` : '-' },
        { title: '振幅(μV)', dataIndex: 'amplitude', width: 90, customRender: (text) => text ? `${text.toFixed(1)}μV` : '-' },
        { title: '刺激部位', dataIndex: 'part', width: 120 },
        { title: '记录部位', dataIndex: 'recordPart', width: 120 }
      ]
    }
  },
  
  watch: {
    recordShow: function (value) {
      if (value && this.recordData && this.recordData.id) {
        // 如果只有基础数据，加载详细数据
        if (!this.recordData.prescriptionRecords && !this.recordData.tbsPrescriptions && !this.recordData.mepRecords) {
          this.loadDetailData()
        }
      }
    }
  },
  
  methods: {
    onClose () {
      this.$emit('close')
    },
    
    loadDetailData () {
      this.$get(`/treatmentRecord/detail/${this.recordData.id}`).then((r) => {
        if (r.data && r.data.success) {
          const detailData = r.data.data
          // 更新父组件的数据
          this.$emit('update:recordData', detailData)
        }
      }).catch((error) => {
        console.error('加载详细数据失败:', error)
        this.$message.error('加载详细数据失败')
      })
    },
    
    getMepTypeText (dType) {
      const typeMap = {
        0: '术前',
        1: '术中',
        2: '术后'
      }
      return typeMap[dType] || dType
    },
    
    formatDateTime (dateTimeStr) {
      if (!dateTimeStr) return '-'
      return this.$moment(dateTimeStr).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped>
.info-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
}

.info-section h3 {
  margin: 0 0 16px 0;
  color: #1890ff;
  font-size: 16px;
  font-weight: 500;
}

.info-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.info-item label {
  font-weight: 500;
  color: #333;
  min-width: 80px;
  margin-right: 8px;
}

.info-item span {
  color: #666;
}

.mep-record-detail {
  margin-bottom: 20px;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
}

.mep-record-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.mep-record-header h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.mep-record-info {
  display: flex;
  gap: 24px;
  font-size: 12px;
  color: #666;
}

.no-data-tip {
  text-align: center;
  padding: 32px 0;
  color: #999;
}

.modal-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
}
</style>
