<template>
  <a-card :bordered="false" class="card-area">
    <div class="search">
      <a-form layout="horizontal">
        <a-row :gutter="15">
          <a-col :md="6" :sm="24">
            <a-form-item label="患者ID" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input v-model="queryParams.patientId"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="医院" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-select v-model="queryParams.hospitalId" placeholder="请选择医院" allowClear>
                <a-select-option v-for="(name, id) in hospitalDict" :key="id" :value="parseInt(id)">{{ name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="医生ID" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input v-model="queryParams.doctorId"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="处方类型" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-select v-model="queryParams.presType" placeholder="请选择处方类型" allowClear>
                <a-select-option value="0">普通处方</a-select-option>
                <a-select-option value="1">TBS处方</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="状态" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-select v-model="queryParams.status" placeholder="请选择状态" allowClear>
                <a-select-option value="0">草稿</a-select-option>
                <a-select-option value="1">已下发</a-select-option>
                <a-select-option value="2">执行中</a-select-option>
                <a-select-option value="3">完成</a-select-option>
                <a-select-option value="4">异常</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="治疗部位" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-select 
                v-model="queryParams.presPartId" 
                placeholder="请选择治疗部位"
                allowClear
                showSearch
                style="width: 100%"
              >
                <a-select-option v-for="option in stimulationSiteOptions" :key="option.value" :value="option.value">
                  [{{ option.category }}] {{ option.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="标准处方" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input v-model="queryParams.standardPresName" placeholder="请输入标准处方名称"/>
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
          <a-button type="primary" ghost @click="add">新增</a-button>
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
        <div style="margin-bottom: 16px; color: #666; font-size: 12px;">
          <a-icon type="info-circle" /> 点击"展开"按钮可查看和编辑详细的处方参数信息
        </div>
      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        :rowSelection="rowSelection"
        :scroll="{ x: 1000 }"
        @change="handleTableChange">
        <template slot="expand" slot-scope="text, record">
          <a-button 
            type="link" 
            size="small" 
            @click="toggleExpand(record)"
            :icon="record.expanded ? 'up' : 'down'"
          >
            {{ record.expanded ? '收起详情' : '展开详情' }}
          </a-button>
        </template>
        
        <template slot="operation" slot-scope="text, record">
          <a-icon type="eye" @click="handlePrescriptionViewOpen(record)" title="详情" style="margin-right: 10px" />
          <a-icon type="save" @click="saveRow(record)" title="保存" style="margin-right: 10px" v-if="record.editing" />
          <a-icon type="close" @click="cancelEdit(record)" title="取消" style="margin-right: 10px" v-if="record.editing" />
          <a-icon type="edit" @click="startEdit(record)" title="编辑" style="margin-right: 10px" v-if="!record.editing" />
          <a-icon type="delete" @click="remove(record)" title="删除" />
        </template>
        <template slot="presType" slot-scope="text, record">
          <a-select v-if="record.editing" v-model="record.presType" size="small" style="width: 100%">
            <a-select-option value="0">普通处方</a-select-option>
            <a-select-option value="1">TBS处方</a-select-option>
          </a-select>
          <a-tag v-else-if="text == 0" color="blue">普通处方</a-tag>
          <a-tag v-else-if="text == 1" color="green">TBS处方</a-tag>
          <span v-else>{{ getPresTypeText(text) || text || '-' }}</span>
        </template>
        <template slot="status" slot-scope="text, record">
          <a-select v-if="record.editing" v-model="record.status" size="small" style="width: 100%">
            <a-select-option value="0">草稿</a-select-option>
            <a-select-option value="1">已下发</a-select-option>
            <a-select-option value="2">执行中</a-select-option>
            <a-select-option value="3">完成</a-select-option>
            <a-select-option value="4">异常</a-select-option>
          </a-select>
          <a-tag v-else-if="text == 0" color="dashed" style="border-color: #d9d9d9; color: #666;">草稿</a-tag>
          <a-tag v-else-if="text == 1" color="blue">已下发</a-tag>
          <a-tag v-else-if="text == 2" color="orange">执行中</a-tag>
          <a-tag v-else-if="text == 3" color="green">完成</a-tag>
          <a-tag v-else-if="text == 4" color="red">异常</a-tag>
          <span v-else>{{ getStatusText(text) || text || '-' }}</span>
        </template>
        <template slot="tbsType" slot-scope="text, record">
          <a-select v-if="record.editing" v-model="record.tbsType" size="small" style="width: 100%">
            <a-select-option value="0">iTBS</a-select-option>
            <a-select-option value="1">cTBS</a-select-option>
          </a-select>
          <a-tag v-else-if="text == 0" color="purple">iTBS</a-tag>
          <a-tag v-else-if="text == 1" color="cyan">cTBS</a-tag>
          <span v-else>{{ text || '-' }}</span>
        </template>
        
        <!-- 简化的可编辑单元格模板 -->
        <template slot="patientId" slot-scope="text, record">
          <a-input v-if="record.editing" v-model="record.patientId" size="small" />
          <span v-else>{{ text }}</span>
        </template>
        
        <template slot="hospitalId" slot-scope="text, record">
          <a-select v-if="record.editing" v-model="record.hospitalId" size="small" style="width: 100%">
            <a-select-option v-for="(name, id) in hospitalDict" :key="id" :value="parseInt(id)">{{ name }}</a-select-option>
          </a-select>
          <span v-else>{{ getHospitalName(text) }}</span>
        </template>
        
        <template slot="doctorId" slot-scope="text, record">
          <a-input v-if="record.editing" v-model="record.doctorId" size="small" />
          <span v-else>{{ text }}</span>
        </template>
        
        <template slot="presPartName" slot-scope="text, record">
          <a-select v-if="record.editing" v-model="record.presPartId" size="small" style="width: 100%">
            <a-select-option v-for="option in stimulationSiteOptions" :key="option.value" :value="option.value">
              [{{ option.category }}] {{ option.label }}
            </a-select-option>
          </a-select>
          <span v-else>{{ getStimulationSiteName(record.presPartId) }}</span>
        </template>
        
        <template slot="standardPresName" slot-scope="text, record">
          <a-input v-if="record.editing" v-model="record.standardPresName" size="small" />
          <span v-else>{{ text || '-' }}</span>
        </template>
      </a-table>
      
      <!-- 展开的详细信息 -->
      <div v-for="record in dataSource" :key="record.id" v-if="record.expanded" class="expanded-detail">
        <div class="expanded-row">
          <div class="expanded-header">
            <h3>详细参数</h3>
            <div class="expanded-actions">
              <a-button 
                v-if="!record.editing" 
                type="primary" 
                size="small" 
                @click="startEdit(record)"
                icon="edit"
              >
                编辑
              </a-button>
              <a-button 
                v-if="record.editing" 
                type="primary" 
                size="small" 
                @click="saveRow(record)"
                icon="save"
                :loading="loading"
              >
                保存
              </a-button>
              <a-button 
                v-if="record.editing" 
                size="small" 
                @click="cancelEdit(record)"
                icon="close"
              >
                取消
              </a-button>
            </div>
          </div>
          
          <!-- 验证提示区域 -->
          <div v-if="record.editing" class="validation-area" style="margin-bottom: 16px; padding: 12px; background: #f6ffed; border: 1px solid #b7eb8f; border-radius: 4px;">
            <h4 style="margin: 0 0 8px 0; color: #52c41a;">参数验证</h4>
            <div v-if="getValidationMessage(record)" style="color: #ff4d4f; font-size: 12px;">
              <a-icon type="warning" /> {{ getValidationMessage(record) }}
            </div>
            <div v-else style="color: #52c41a; font-size: 12px;">
              <a-icon type="check-circle" /> 参数验证通过
            </div>
          </div>
          
          <a-row :gutter="16">
            <a-col :span="8">
              <h4>处方参数</h4>
              <div class="param-item">
                <label>刺激强度：</label>
                <a-input-number 
                  v-if="record.editing" 
                  v-model="record.presStrength" 
                  size="small" 
                  :min="0" 
                  :max="100" 
                  style="width: 100%"
                />
                <span v-else>{{ record.presStrength }}%</span>
              </div>
              <div class="param-item">
                <label>刺激频率：</label>
                <a-input-number 
                  v-if="record.editing" 
                  v-model="record.presFreq" 
                  size="small" 
                  :min="0" 
                  :max="50" 
                  :step="0.1" 
                  style="width: 100%"
                  @change="autoCalculateTotalCount(record)"
                />
                <span v-else>{{ record.presFreq }}Hz</span>
              </div>
              <div class="param-item">
                <label>刺激时间：</label>
                <a-input-number 
                  v-if="record.editing" 
                  v-model="record.lastTime" 
                  size="small" 
                  :min="0" 
                  :max="60" 
                  :step="0.1" 
                  style="width: 100%"
                  @change="autoCalculateTotalCount(record)"
                />
                <span v-else>{{ record.lastTime }} 秒</span>
              </div>
              <div class="param-item">
                <label>间歇时间：</label>
                <a-input-number 
                  v-if="record.editing" 
                  v-model="record.pauseTime" 
                  size="small" 
                  :min="0" 
                  :max="300" 
                  style="width: 100%"
                />
                <span v-else>{{ record.pauseTime }} 秒</span>
              </div>
            </a-col>
            
            <a-col :span="8">
              <h4>执行参数</h4>
              <div class="param-item">
                <label>重复次数：</label>
                <a-input-number 
                  v-if="record.editing" 
                  v-model="record.repeatCount" 
                  size="small" 
                  :min="0" 
                  :max="1000" 
                  style="width: 100%"
                  @change="autoCalculateTotalCount(record)"
                />
                <span v-else>{{ record.repeatCount }}次</span>
              </div>
              <div class="param-item">
                <label>周期数：</label>
                <a-input-number 
                  v-if="record.editing" 
                  v-model="record.periods" 
                  size="small" 
                  :min="1" 
                  :max="1000" 
                  style="width: 100%"
                  @change="autoCalculateTotalCount(record)"
                />
                <span v-else>{{ record.periods || 1 }}个</span>
              </div>
              <div class="param-item">
                <label>总脉冲数：</label>
                <a-input-number 
                  v-if="record.editing" 
                  v-model="record.totalCount" 
                  size="small" 
                  :min="0" 
                  :max="10000" 
                  style="width: 100%"
                  @change="calculateTotalCount(record)"
                />
                <span v-else>{{ record.totalCount }}个</span>
                <div v-if="record.editing" style="font-size: 11px; color: #666; margin-top: 2px;">
                  <a-icon type="calculator" /> 自动计算值
                </div>
              </div>
              <div class="param-item">
                <label>总时间：</label>
                <a-input-number 
                  v-if="record.editing" 
                  v-model="record.totalTime" 
                  size="small" 
                  :min="0" 
                  :max="7200" 
                  style="width: 100%"
                />
                <span v-else>{{ record.totalTime }} 秒</span>
              </div>
              <div class="param-item">
                <label>标准处方：</label>
                <div v-if="record.editing" style="display: flex; align-items: center; width: 100%;">
                  <a-input 
                    v-model="record.standardPresName" 
                    size="small"
                    placeholder="点击选择标准处方"
                    readonly
                    style="cursor: pointer; flex: 1; margin-right: 8px;"
                    @click="showStandardPrescriptionModalForRow(record)"
                  />
                  <a-button 
                    type="primary" 
                    size="small"
                    icon="search"
                    @click="showStandardPrescriptionModalForRow(record)"
                  >
                    选择
                  </a-button>
                </div>
                <span v-else>{{ record.standardPresName || '-' }}</span>
              </div>
            </a-col>
            
            <a-col :span="8">
              <h4>TBS参数</h4>
              <div class="param-item">
                <label>TBS类型：</label>
                <a-select 
                  v-if="record.editing" 
                  v-model="record.tbsType" 
                  size="small" 
                  style="width: 100%"
                  @change="onTBSTypeChange(record, $event)"
                >
                  <a-select-option value="0">iTBS</a-select-option>
                  <a-select-option value="1">cTBS</a-select-option>
                </a-select>
                <span v-else>
                  {{ record.tbsType == 0 ? 'iTBS' : record.tbsType == 1 ? 'cTBS' : '-' }}
                </span>
              </div>
              <div class="param-item">
                <label>丛内频率：</label>
                <a-input-number 
                  v-if="record.editing" 
                  v-model="record.innerFreq" 
                  size="small" 
                  :min="0.1" 
                  :max="200" 
                  :step="0.1" 
                  style="width: 100%"
                  disabled
                />
                <span v-else>{{ record.innerFreq || '-' }}Hz</span>
              </div>
              <div class="param-item">
                <label>丛内个数：</label>
                <a-input-number 
                  v-if="record.editing" 
                  v-model="record.innerCount" 
                  size="small" 
                  :min="1" 
                  :max="200" 
                  style="width: 100%"
                  disabled
                />
                <span v-else>{{ record.innerCount || '-' }}个</span>
              </div>
              <div class="param-item">
                <label>丛间频率：</label>
                <a-input-number 
                  v-if="record.editing" 
                  v-model="record.interFreq" 
                  size="small" 
                  :min="0.1" 
                  :max="200" 
                  :step="0.1" 
                  style="width: 100%"
                  disabled
                />
                <span v-else>{{ record.interFreq || '-' }}Hz</span>
              </div>
              <div class="param-item">
                <label>丛间个数：</label>
                <a-input-number 
                  v-if="record.editing" 
                  v-model="record.interCount" 
                  size="small" 
                  :min="1" 
                  :max="200" 
                  style="width: 100%"
                  disabled
                />
                <span v-else>{{ record.interCount || '-' }}个</span>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
    <prescription-add
      ref="prescriptionAdd"
      v-if="prescriptionAdd.visiable"
      @close="handlePrescriptionAddClose"
      @success="handlePrescriptionAddSuccess"
      @openStandardPrescriptionModal="handleOpenStandardPrescriptionModal"
      :prescriptionAddVisiable="prescriptionAdd.visiable">
    </prescription-add>
    
    <!-- 标准处方选择弹窗 -->
    <standard-prescription-modal
      :visible.sync="standardPrescriptionModal.visible"
      @standardPrescriptionSelected="handleStandardPrescriptionSelected"
    />
    <prescription-view
      @close="handlePrescriptionViewClose"
      :prescriptionShow="prescriptionView.visiable"
      :prescriptionData="prescriptionView.data">
    </prescription-view>
    
    <!-- 编辑页面也需要标准处方选择功能 -->
    <prescription-edit
      ref="prescriptionEdit"
      v-if="prescriptionEdit.visiable"
      @close="handlePrescriptionEditClose"
      @success="handlePrescriptionEditSuccess"
      @openStandardPrescriptionModal="handleOpenStandardPrescriptionModal"
      :prescriptionEditVisiable="prescriptionEdit.visiable">
    </prescription-edit>
  </a-card>
</template>

<script>
import prescriptionAdd from './PrescriptionAdd.vue'
import prescriptionEdit from './PrescriptionEdit.vue'
import prescriptionView from './PrescriptionView.vue'
import StandardPrescriptionModal from './StandardPrescriptionModal.vue'
import { hospitalDict, getStimulationSiteName, loadStimulationSiteData, getStimulationSiteOptions } from '@/utils/dict'
import { validatePrescription, calculateRTMSTotalCount, calculateTBSTotalCount, getTBSDefaultParams } from '@/utils/prescriptionValidator'
export default {
  name: 'Prescription',
  components: { prescriptionAdd, prescriptionEdit, prescriptionView, StandardPrescriptionModal },
  data () {
    return {
      prescriptionAdd: { visiable: false },
      prescriptionEdit: { visiable: false },
      prescriptionView: { visiable: false, data: null },
      standardPrescriptionModal: { visible: false },
      currentEditingRow: null, // 当前正在编辑的行
      queryParams: {},
      dataSource: [],
      loading: false,
      selectedRowKeys: [],
      hospitalDict: hospitalDict,
      stimulationSiteOptions: [],
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
          width: 60,
          scopedSlots: { customRender: 'expand' }
        },
        { title: '处方ID', dataIndex: 'id', width: 80 },
        { 
          title: '患者ID', 
          dataIndex: 'patientId',
          width: 100,
          scopedSlots: { customRender: 'patientId' }
        },
        {
          title: '医院',
          dataIndex: 'hospitalId',
          width: 120,
          scopedSlots: { customRender: 'hospitalId' }
        },
        { 
          title: '医生ID', 
          dataIndex: 'doctorId',
          width: 100,
          scopedSlots: { customRender: 'doctorId' }
        },
        {
          title: '处方类型',
          dataIndex: 'presType',
          width: 100,
          scopedSlots: { customRender: 'presType' }
        },
        { 
          title: '治疗部位', 
          dataIndex: 'presPartName',
          width: 150,
          scopedSlots: { customRender: 'presPartName' }
        },
        {
          title: '标准处方',
          dataIndex: 'standardPresName',
          width: 150,
          scopedSlots: { customRender: 'standardPresName' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 100,
          scopedSlots: { customRender: 'status' }
        },
        { title: '创建时间', dataIndex: 'createTime', width: 150 },
        { title: '操作', dataIndex: 'operation', width: 120, fixed: 'right', scopedSlots: { customRender: 'operation' } }
      ]
    },
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    search (pageNum, pageSize) {
      this.loading = true
      const params = {
        pageNum: pageNum || this.pagination.current,
        pageSize: pageSize || this.pagination.pageSize,
        ...this.queryParams
      }
      this.$get('/prescription/page', params).then(res => {
        if (res && res.data) {
          this.dataSource = res.data.records || res.data.list || []
          this.pagination.total = res.data.total || 0
          this.pagination.current = params.pageNum
          this.pagination.pageSize = params.pageSize
          
          // 调试：检查TBS类型数据
          if (this.dataSource.length > 0) {
            console.log('加载的数据中TBS类型示例:', this.dataSource.map(item => ({
              id: item.id,
              tbsType: item.tbsType,
              tbsTypeType: typeof item.tbsType
            })))
          }
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    reset () {
      this.queryParams = {
        presPartId: undefined
      }
      this.search()
    },
    add () {
      this.prescriptionAdd.visiable = true
    },
    startEdit (row) {
      // 保存原始数据用于取消编辑
      row.originalData = { ...row }
      this.$set(row, 'editing', true)
      this.currentEditingRow = row
    },
    saveRow (row) {
      console.log('保存行数据，原始TBS类型:', row.tbsType, '类型:', typeof row.tbsType)
      
      const submitData = {
        id: row.id,
        patientId: parseInt(row.patientId),
        hospitalId: parseInt(row.hospitalId),
        doctorId: parseInt(row.doctorId),
        presType: parseInt(row.presType),
        presStrength: parseFloat(row.presStrength),
        presFreq: parseFloat(row.presFreq),
        lastTime: parseFloat(row.lastTime),
        pauseTime: parseInt(row.pauseTime),
        repeatCount: parseInt(row.repeatCount),
        periods: parseInt(row.periods) || 1,
        totalCount: parseInt(row.totalCount),
        totalTime: parseInt(row.totalTime),
        presPartId: row.presPartId ? parseInt(row.presPartId) : null,
        presPartName: row.presPartName,
        standardPresName: row.standardPresName,
        tbsType: row.tbsType !== null && row.tbsType !== undefined ? parseInt(row.tbsType) : null,
        innerFreq: row.innerFreq !== null && row.innerFreq !== undefined ? parseFloat(row.innerFreq) : null,
        innerCount: row.innerCount !== null && row.innerCount !== undefined ? parseInt(row.innerCount) : null,
        interFreq: row.interFreq !== null && row.interFreq !== undefined ? parseFloat(row.interFreq) : null,
        interCount: row.interCount !== null && row.interCount !== undefined ? parseInt(row.interCount) : null,
        status: parseInt(row.status)
      }
      
      // 获取治疗部位名称
      const selectedSite = this.stimulationSiteOptions.find(option => option.value === submitData.presPartId)
      submitData.presPartName = selectedSite ? selectedSite.label : ''
      
      // 验证处方参数
      const validation = validatePrescription(submitData, this.stimulationSiteOptions.map(option => option.label))
      if (!validation.valid) {
        this.$message.error(validation.message)
        return
      }
      
      console.log('提交的数据:', submitData)
      
      this.loading = true
      this.$putJson('/prescription', submitData).then(() => {
        this.$message.success('保存成功')
        this.$set(row, 'editing', false)
        delete row.originalData
        this.currentEditingRow = null
        this.loading = false
        
        // 调试：检查保存后的数据
        console.log('保存成功后的行数据:', {
          id: row.id,
          tbsType: row.tbsType,
          tbsTypeType: typeof row.tbsType
        })
      }).catch(() => {
        this.loading = false
      })
    },
    cancelEdit (row) {
      // 恢复原始数据
      if (row.originalData) {
        Object.keys(row.originalData).forEach(key => {
          if (key !== 'editing' && key !== 'originalData') {
            this.$set(row, key, row.originalData[key])
          }
        })
        delete row.originalData
      }
      this.$set(row, 'editing', false)
      this.currentEditingRow = null
    },

    remove (row) {
      this.$confirm({
        title: '确认删除',
        content: '确定要删除这条处方记录吗？',
        onOk: () => {
          this.$delete(`/prescription/${row.id}`).then(() => {
            this.$message.success('删除成功')
            this.search()
          })
        }
      })
    },
    batchDelete () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择要删除的记录')
        return
      }
      this.$confirm({
        title: '确认批量删除',
        content: `确定要删除选中的 ${this.selectedRowKeys.length} 条记录吗？`,
        onOk: () => {
          this.$postJson('/prescription/batch', this.selectedRowKeys).then(() => {
            this.$message.success('批量删除成功')
            this.selectedRowKeys = []
            this.search()
          })
        }
      })
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.search()
    },
    handlePrescriptionAddClose () {
      this.prescriptionAdd.visiable = false
    },
    handlePrescriptionAddSuccess () {
      this.prescriptionAdd.visiable = false
      this.search()
    },

    handlePrescriptionViewOpen (row) {
      this.prescriptionView.data = row
      this.prescriptionView.visiable = true
    },
    handlePrescriptionViewClose () {
      this.prescriptionView.visiable = false
    },
    exportExcel () {
      this.$export('prescription/excel', {
        ...this.queryParams
      })
    },
    toggleExpand (record) {
      this.$set(record, 'expanded', !record.expanded)
    },
    getHospitalName (hospitalId) {
     
      
      if (!hospitalId && hospitalId !== 0) return '-'
      
      // 尝试多种方式匹配医院名称
      const result = this.hospitalDict[hospitalId] || 
                    this.hospitalDict[hospitalId.toString()] || 
                    this.hospitalDict[parseInt(hospitalId)] || 
                    hospitalId
      
      return result
    },
    getStatusText (status) {
      const statusMap = {
        0: '草稿',
        1: '已下发',
        2: '执行中',
        3: '完成',
        4: '异常'
      }
      return statusMap[status] || status
    },
    getPresTypeText (presType) {
      const presTypeMap = {
        0: '普通处方',
        1: 'TBS处方'
      }
      return presTypeMap[presType] || presType
    },
    handleOpenStandardPrescriptionModal () {
      this.currentEditingRow = null // 重置当前编辑行
      this.standardPrescriptionModal.visible = true
    },
    handleStandardPrescriptionSelected (standardPrescription) {
      // 将标准处方数据传递给当前激活的组件（添加、编辑或展开行）
      if (this.prescriptionAdd.visiable && this.$refs.prescriptionAdd) {
        this.$refs.prescriptionAdd.applyStandardPrescription(standardPrescription)
      } else if (this.prescriptionEdit.visiable && this.$refs.prescriptionEdit) {
        this.$refs.prescriptionEdit.applyStandardPrescription(standardPrescription)
      } else if (this.currentEditingRow) {
        // 应用到展开行编辑
        this.applyStandardPrescriptionToRow(this.currentEditingRow, standardPrescription)
      }
    },
    showStandardPrescriptionModalForRow (record) {
      this.currentEditingRow = record
      this.standardPrescriptionModal.visible = true
    },
    applyStandardPrescriptionToRow (row, standardPrescription) {
      console.log('应用标准处方到展开行，原始数据:', standardPrescription)
      
      // 应用标准处方数据到展开行
      row.standardPresName = `${standardPrescription.indication1} - ${standardPrescription.indication2}`
      
      // 更新相关参数 - 根据后端数据结构调整
      row.presFreq = standardPrescription.presFreq
      row.lastTime = standardPrescription.lastTime // 后端返回的是秒，需要转换为分钟
      row.pauseTime = standardPrescription.pauseTime
      row.repeatCount = standardPrescription.repeatCount
      row.totalTime = standardPrescription.totalTime * 60 // 后端返回的是分钟，需要转换为秒
      // 根据标准处方的治疗部位名称查找对应的presPartId
      const siteOption = this.stimulationSiteOptions.find(option => option.label === standardPrescription.presPart)
      row.presPartId = siteOption ? siteOption.value : null
      row.presPartName = standardPrescription.presPart
      
      console.log('应用后的行数据:', {
        standardPresName: row.standardPresName,
        presFreq: row.presFreq,
        lastTime: row.lastTime,
        pauseTime: row.pauseTime,
        repeatCount: row.repeatCount,
        totalTime: row.totalTime,
        presPartName: row.presPartName
      })
      
      this.$message.success('标准处方参数已自动填充到当前行')
      this.currentEditingRow = null
    },
    handlePrescriptionEditClose () {
      this.prescriptionEdit.visiable = false
    },
    handlePrescriptionEditSuccess () {
      this.prescriptionEdit.visiable = false
      this.search()
    },

    getStimulationSiteName (siteId) {
      // 本地方法，以防导入的函数有问题
      if (!siteId) return '-'
      const siteOption = this.stimulationSiteOptions.find(option => option.value === siteId)
      return siteOption ? siteOption.label : '-'
    },
    getValidationMessage (record) {
      try {
        const validationData = {
          presType: parseInt(record.presType),
          presStrength: parseFloat(record.presStrength),
          presFreq: parseFloat(record.presFreq),
          lastTime: parseFloat(record.lastTime),
                  pauseTime: parseInt(record.pauseTime),
        repeatCount: parseInt(record.repeatCount),
        periods: parseInt(record.periods) || 1,
        totalCount: parseInt(record.totalCount),
        tbsType: record.tbsType !== null && record.tbsType !== undefined ? parseInt(record.tbsType) : null,
        innerFreq: record.innerFreq !== null && record.innerFreq !== undefined ? parseFloat(record.innerFreq) : 0,
        innerCount: record.innerCount !== null && record.innerCount !== undefined ? parseInt(record.innerCount) : 0,
        interFreq: record.interFreq !== null && record.interFreq !== undefined ? parseFloat(record.interFreq) : 0,
        interCount: record.interCount !== null && record.interCount !== undefined ? parseInt(record.interCount) : 0,
        presPartName: this.getStimulationSiteName(record.presPartId)
        }
        
        const validation = validatePrescription(validationData, this.stimulationSiteOptions.map(option => option.label))
        return validation.valid ? null : validation.message
      } catch (error) {
        return '验证过程中出现错误'
      }
    },
    getCalculatedTotalCount (record) {
      try {
        const presType = parseInt(record.presType)
        if (presType === 0) { // rTMS模式
          return calculateRTMSTotalCount(
            parseFloat(record.presFreq) || 0,
            parseFloat(record.lastTime) || 0,
            parseInt(record.repeatCount) || 0
          )
        } else if (presType === 1) { // TBS模式
          const innerCount = parseInt(record.innerCount) || 0
          const interCount = parseInt(record.interCount) || 0
          const periods = parseInt(record.periods) || 1 // 使用周期数
          
          return calculateTBSTotalCount(innerCount, interCount, periods)
        }
        return 0
      } catch (error) {
        return 0
      }
    },
    calculateTotalCount (record) {
      const calculatedCount = this.getCalculatedTotalCount(record)
      if (calculatedCount > 0) {
        record.totalCount = calculatedCount
      }
    },
    onTBSTypeChange (record, value) {
      // 根据TBS类型设置固定参数
      const tbsParams = getTBSDefaultParams(parseInt(value))
      Object.keys(tbsParams).forEach(key => {
        this.$set(record, key, tbsParams[key])
      })
      // 重新计算总脉冲数
      this.autoCalculateTotalCount(record)
    },
    autoCalculateTotalCount (record) {
      // 自动计算并填充总次数
      const calculatedCount = this.getCalculatedTotalCount(record)
      if (calculatedCount > 0) {
        this.$set(record, 'totalCount', calculatedCount)
      }
    }
  },
  async mounted () {
    // 加载刺激部位数据
    await loadStimulationSiteData(this)
    this.stimulationSiteOptions = await getStimulationSiteOptions(this)
    
    console.log('刺激部位数据加载完成:', {
      options: this.stimulationSiteOptions.length
    })
    
    this.search()
  }
}
</script>

<style scoped>
.card-area {
  margin: 24px;
}
.operator {
  margin-bottom: 16px;
}
.ant-table-tbody > tr > td {
  padding: 8px;
}
.ant-input-sm, .ant-select-sm, .ant-input-number-sm {
  font-size: 12px;
}
.expanded-row {
  background: #fafafa;
  padding: 20px;
}
.expanded-row h4 {
  margin-bottom: 12px;
  color: #1890ff;
  font-size: 14px;
}
.expanded-row p {
  margin-bottom: 8px;
  font-size: 12px;
}
.expanded-detail {
  margin-top: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}
.expanded-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
}
.expanded-header h3 {
  margin: 0;
  color: #1890ff;
  font-size: 16px;
}
.expanded-actions {
  display: flex;
  gap: 8px;
}
.param-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  border-radius: 4px;
  background: #fff;
}
.param-item label {
  min-width: 80px;
  font-weight: 500;
  color: #333;
  margin-right: 8px;
}
.param-item span {
  color: #666;
}
</style> 