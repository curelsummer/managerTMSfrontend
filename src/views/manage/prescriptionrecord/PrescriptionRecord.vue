<template>
  <a-card :bordered="false" class="card-area">
    <div class="search">
      <a-form layout="horizontal">
        <a-row :gutter="15">
          <a-col :md="6" :sm="24">
            <a-form-item label="患者姓名" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input v-model="queryParams.patientName" placeholder="请输入患者姓名"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="患者ID" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input v-model="queryParams.patientId" placeholder="请输入患者ID"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="设备ID" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input v-model="queryParams.deviceId" placeholder="请输入设备ID"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="医生姓名" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input v-model="queryParams.doctorName" placeholder="请输入医生姓名"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="治疗日期" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-date-picker 
                v-model="queryParams.presDate" 
                placeholder="请选择治疗日期"
                style="width: 100%"
                format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="消息类型" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-select v-model="queryParams.messageType" placeholder="请选择消息类型" allowClear>
                <a-select-option value="TREATMENT_RECORD_CREATED">治疗记录创建</a-select-option>
                <a-select-option value="TREATMENT_RECORD_UPDATED">治疗记录更新</a-select-option>
                <a-select-option value="TREATMENT_RECORD_COMPLETED">治疗记录完成</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          </span>
        </a-row>
      </a-form>
    </div>

    <div>
      <div class="operator">
        <a-button type="danger" ghost @click="batchDelete" style="margin-left: 8px">批量删除</a-button>
        <a-dropdown style="margin-left: 8px">
          <a-menu slot="overlay">
            <a-menu-item key="export-data" @click="exportExcel">导出Excel</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
      
      <div style="margin-bottom: 16px; color: #1890ff; font-size: 13px; font-weight: 500; background: #f0f8ff; padding: 8px 12px; border-radius: 4px; border-left: 4px solid #1890ff;">
        <a-icon type="info-circle" style="color: #1890ff; margin-right: 6px;" /> 点击表格中的 <a-icon type="down" style="color: #1890ff;" /> 箭头图标可展开查看详细的处方记录、TBS处方记录和MEP记录
        <div style="margin-top: 8px;">
          <a-button type="link" size="small" @click="expandAll" style="padding: 0; height: auto; color: #1890ff;">
            <a-icon type="down" /> 全部展开
          </a-button>
          <a-button type="link" size="small" @click="collapseAll" style="padding: 0; height: auto; color: #1890ff; margin-left: 16px;">
            <a-icon type="up" /> 全部收起
          </a-button>
        </div>
      </div>

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        :rowSelection="rowSelection"
        :scroll="{ x: 1400 }"
        @change="handleTableChange">
        
        <template slot="expand" slot-scope="text, record">
          <a-button 
            type="link" 
            size="small" 
            @click="toggleExpand(record)"
            :icon="record.expanded ? 'up' : 'down'"
            style="padding: 0; height: auto; min-width: auto;"
            :title="record.expanded ? '收起详情' : '展开详情'"
            :loading="record.loading"
          />
        </template>
        
        <template slot="operation" slot-scope="text, record">
          <a-icon type="eye" @click="handleRecordViewOpen(record)" title="详情" style="margin-right: 8px" />
          <a-icon type="delete" @click="remove(record)" title="删除" />
        </template>
        
        <template slot="patientSex" slot-scope="text">
          <a-tag v-if="text === '男'" color="blue">男</a-tag>
          <a-tag v-else-if="text === '女'" color="pink">女</a-tag>
          <span v-else>{{ text || '-' }}</span>
        </template>
        
        <template slot="messageType" slot-scope="text">
          <a-tag v-if="text === 'TREATMENT_RECORD_CREATED'" color="green">治疗记录创建</a-tag>
          <a-tag v-else-if="text === 'TREATMENT_RECORD_UPDATED'" color="blue">治疗记录更新</a-tag>
          <a-tag v-else-if="text === 'TREATMENT_RECORD_COMPLETED'" color="orange">治疗记录完成</a-tag>
          <span v-else>{{ text || '-' }}</span>
        </template>
        
        <template slot="mepValue" slot-scope="text">
          <span v-if="text !== null && text !== undefined">{{ text }}%</span>
          <span v-else>-</span>
        </template>
      </a-table>
      
      <!-- 展开的详细信息 -->
      <transition-group name="expand" tag="div">
        <div v-for="record in dataSource" :key="record.id" v-if="record.expanded" class="expanded-detail">
          <div class="expanded-row">
            <div class="expanded-header">
              <h3>治疗详情</h3>
              <!-- 统计信息区域 -->
              <div class="stats-info">
                <a-tag v-if="record.prescriptionRecords && record.prescriptionRecords.length > 0" color="blue">
                  标准处方记录：{{ record.prescriptionRecords.length }}条
                </a-tag>
                <a-tag v-if="record.tbsPrescriptions && record.tbsPrescriptions.length > 0" color="green">
                  TBS处方记录：{{ record.tbsPrescriptions.length }}条
                </a-tag>
                <a-tag v-if="record.mepRecords && record.mepRecords.length > 0" color="orange">
                  MEP记录：{{ record.mepRecords.length }}条
                </a-tag>
                <a-tag v-if="getTotalMepDataCount(record) > 0" color="purple">
                  MEP数据：{{ getTotalMepDataCount(record) }}条
                </a-tag>
              </div>
            </div>
            
                         <!-- 使用标签页组织数据 -->
             <a-tabs 
               v-model="record.activeTab" 
               type="card" 
               size="small"
               @change="handleTabChange"
             >
               <!-- 标准处方记录标签页 -->
               <a-tab-pane 
                 v-if="record.prescriptionRecords && record.prescriptionRecords.length > 0"
                 key="prescription" 
                 tab="标准处方记录"
               >
                 <a-table 
                   :columns="prescriptionColumns" 
                   :dataSource="record.prescriptionRecords" 
                   :pagination="false"
                   size="small"
                   :rowKey="item => item.id"
                   :scroll="{ x: 1200 }"
                 />
               </a-tab-pane>
               
               <!-- TBS处方记录标签页 -->
               <a-tab-pane 
                 v-if="record.tbsPrescriptions && record.tbsPrescriptions.length > 0"
                 key="tbs" 
                 tab="TBS处方记录"
               >
                 <a-table 
                   :columns="tbsColumns" 
                   :dataSource="record.tbsPrescriptions" 
                   :pagination="false"
                   size="small"
                   :rowKey="item => item.id"
                   :scroll="{ x: 1200 }"
                 />
               </a-tab-pane>
               
               <!-- MEP记录标签页 -->
               <a-tab-pane 
                 v-if="record.mepRecords && record.mepRecords.length > 0"
                 key="mep" 
                 tab="MEP记录"
               >
                 <div v-for="mepRecord in record.mepRecords" :key="mepRecord.id" class="mep-record">
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
               </a-tab-pane>
             </a-tabs>
          </div>
        </div>
      </transition-group>
    </div>
    
    <!-- 详情查看弹窗 -->
    <prescription-record-view
      @close="handleRecordViewClose"
      :recordShow="recordView.visiable"
      :recordData="recordView.data">
    </prescription-record-view>
  </a-card>
</template>

<script>
import PrescriptionRecordView from './PrescriptionRecordView.vue'


export default {
  name: 'PrescriptionRecord',
  components: { PrescriptionRecordView },
  data () {
    return {
      recordView: { visiable: false, data: null },
      queryParams: {},
      dataSource: [],
      loading: false,
      selectedRowKeys: [],
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`,
        total: 0
      }
    }
  },
  computed: {
    columns () {
      return [
        { 
          title: '展开', 
          dataIndex: 'expand', 
          width: 40,
          scopedSlots: { customRender: 'expand' }
        },
        { title: '记录ID', dataIndex: 'id', width: 80 },
        { title: '患者姓名', dataIndex: 'patientName', width: 100 },
        { title: '患者ID', dataIndex: 'patientId', width: 80 },
        { 
          title: '性别', 
          dataIndex: 'patientSex',
          width: 60,
          scopedSlots: { customRender: 'patientSex' }
        },
        { title: '年龄', dataIndex: 'patientAgeStr', width: 80 },
        { title: '病房', dataIndex: 'patientRoom', width: 80 },
        { title: '床号', dataIndex: 'patientBed', width: 80 },
        { title: '设备ID', dataIndex: 'deviceId', width: 80 },
        { title: '医生姓名', dataIndex: 'doctorName', width: 100 },
        { title: '治疗日期', dataIndex: 'presDate', width: 100 },
        { title: '治疗时间', dataIndex: 'presTime', width: 80 },
        { 
          title: 'MEP值', 
          dataIndex: 'mepValue',
          width: 80,
          scopedSlots: { customRender: 'mepValue' }
        },
        { 
          title: '消息类型', 
          dataIndex: 'messageType',
          width: 120,
          scopedSlots: { customRender: 'messageType' }
        },
        { title: '创建时间', dataIndex: 'createTime', width: 120 },
        { title: '操作', dataIndex: 'operation', width: 120, fixed: 'right', scopedSlots: { customRender: 'operation' } }
      ]
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
    },
    
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  
  mounted () {
    this.search()
  },
  
  methods: {
    search (pageNum, pageSize) {
      this.loading = true
      const params = {
        pageNum: pageNum || this.pagination.current,
        pageSize: pageSize || this.pagination.pageSize,
        ...this.queryParams
      }
      
      // 处理日期参数
      if (params.presDate) {
        params.presDate = this.$moment(params.presDate).format('YYYY-MM-DD')
      }
      
      this.$get('/treatmentRecord', params).then((r) => {
        if (r.data && r.data.success) {
          const data = r.data.data
          const pagination = {...this.pagination}
          pagination.total = data.total
          pagination.current = data.current
          this.dataSource = data.records
          this.pagination = pagination
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    
    reset () {
      this.queryParams = {}
      this.selectedRowKeys = []
      this.pagination.current = 1
      this.search()
    },
    
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.search()
    },
    
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    
    toggleExpand (record) {
      if (!record.expanded) {
        // 展开时加载详细数据
        this.loadDetailData(record)
      }
      this.$set(record, 'expanded', !record.expanded)
    },
    
         loadDetailData (record) {
       if (record.detailLoaded) return
       
       // 设置loading状态
       this.$set(record, 'loading', true)
       
       this.$get(`/treatmentRecord/detail/${record.id}`).then((r) => {
         if (r.data && r.data.success) {
           const detailData = r.data.data
           // 合并详细数据到记录中
           Object.assign(record, {
             prescriptionRecords: detailData.prescriptionRecords || [],
             tbsPrescriptions: detailData.tbsPrescriptions || [],
             mepRecords: detailData.mepRecords || [],
             detailLoaded: true
           })
           
           // 设置默认激活的标签页
           this.$set(record, 'activeTab', this.getDefaultActiveTab(detailData))
         }
         this.$set(record, 'loading', false)
       }).catch((error) => {
         console.error('加载详细数据失败:', error)
         this.$message.error('加载详细数据失败')
         this.$set(record, 'loading', false)
       })
     },
    
    handleRecordViewOpen (record) {
      this.recordView.data = record
      this.recordView.visiable = true
    },
    
    handleRecordViewClose () {
      this.recordView.visiable = false
    },
    
    remove (record) {
      this.$confirm({
        title: '确定删除这条治疗记录?',
        content: '删除后将无法恢复',
        onOk: () => {
          this.$delete(`/treatmentRecord/${record.id}`).then(() => {
            this.$message.success('删除成功')
            this.search()
          })
        }
      })
    },
    
    batchDelete () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要删除的记录')
        return
      }
      
      this.$confirm({
        title: '确定删除选中的治疗记录?',
        content: '删除后将无法恢复',
        onOk: () => {
          const ids = this.selectedRowKeys.join(',')
          this.$delete(`/treatmentRecord/batch/${ids}`).then(() => {
            this.$message.success('批量删除成功')
            this.selectedRowKeys = []
            this.search()
          })
        }
      })
    },
    
    exportExcel () {
      this.$export('treatmentRecord/excel', {
        ...this.queryParams
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
    },
    
    // 全部展开
    expandAll () {
      this.dataSource.forEach(record => {
        if (!record.expanded) {
          this.toggleExpand(record)
        }
      })
    },
    
    // 全部收起
    collapseAll () {
      this.dataSource.forEach(record => {
        if (record.expanded) {
          this.$set(record, 'expanded', false)
        }
      })
    },
    
    // 获取MEP数据总数
    getTotalMepDataCount (record) {
      if (!record.mepRecords || record.mepRecords.length === 0) return 0
      return record.mepRecords.reduce((total, mepRecord) => {
        return total + (mepRecord.mepDataList ? mepRecord.mepDataList.length : 0)
      }, 0)
    },
    
         // 获取默认激活的标签页
     getDefaultActiveTab (detailData) {
       if (detailData.prescriptionRecords && detailData.prescriptionRecords.length > 0) {
         return 'prescription'
       } else if (detailData.tbsPrescriptions && detailData.tbsPrescriptions.length > 0) {
         return 'tbs'
       } else if (detailData.mepRecords && detailData.mepRecords.length > 0) {
         return 'mep'
       }
       // 如果没有数据，返回第一个可用的标签页
       return 'prescription'
     },
     
     // 处理标签页切换
     handleTabChange (activeKey) {
       // 这里可以添加标签页切换的逻辑，比如记录用户偏好等
       console.log('标签页切换到:', activeKey)
       
       // 可以在这里添加标签页切换后的逻辑
       // 比如：记录用户偏好、触发数据加载等
     }
  }
}
</script>

<style scoped>
.card-area {
  margin: 16px;
}

.search {
  margin-bottom: 16px;
}

.operator {
  margin-bottom: 16px;
}

.expanded-detail {
  margin: 16px 0;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
}

.expanded-header {
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8e8e8;
}

.expanded-header h3 {
  margin: 0;
  color: #1890ff;
}

.stats-info {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stats-info .ant-tag {
  margin: 0;
  font-size: 12px;
  padding: 2px 8px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  margin-bottom: 12px;
  color: #333;
  font-weight: 500;
}

.mep-record {
  margin-bottom: 16px;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
}

.mep-record-header {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
}

.no-data-tip {
  text-align: center;
  padding: 32px 0;
  color: #999;
}

/* 展开动画效果 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-20px);
  max-height: 0;
}

.expand-enter-to,
.expand-leave {
  opacity: 1;
  transform: translateY(0);
  max-height: 1000px;
}

/* 标签页样式优化 */
.expanded-detail .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab {
  padding: 6px 12px;
  font-size: 13px;
}

.expanded-detail .ant-tabs-content {
  padding: 16px 0;
}

/* 表格在标签页中的样式 */
.expanded-detail .ant-table-wrapper {
  margin-top: 8px;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .stats-info {
    flex-direction: column;
    gap: 4px;
  }
  
  .expanded-detail {
    padding: 12px;
  }
}
</style>
