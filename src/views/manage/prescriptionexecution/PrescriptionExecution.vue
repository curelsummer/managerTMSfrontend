<template>
  <a-card :bordered="false" class="card-area">
    <div class="search">
      <a-form layout="horizontal">
        <a-row :gutter="15">
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
            <a-form-item label="处方ID" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input v-model="queryParams.prescriptionId" placeholder="请输入处方ID"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="执行人ID" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input v-model="queryParams.executorId" placeholder="请输入执行人ID"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="状态" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-select v-model="queryParams.status" placeholder="请选择状态" allowClear>
                <a-select-option value="0">待下发</a-select-option>
                <a-select-option value="1">已下发</a-select-option>
                <a-select-option value="2">执行中</a-select-option>
                <a-select-option value="3">完成</a-select-option>
                <a-select-option value="4">异常</a-select-option>
              </a-select>
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
            <a-form-item label="创建时间" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-range-picker 
                v-model="dateRange" 
                @change="onDateChange"
                format="YYYY-MM-DD"
                :placeholder="['开始日期', '结束日期']"
              />
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
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item key="export-data" @click="exportExcel">导出Excel</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ x: 1500 }"
        @change="handleTableChange">
        <template slot="status" slot-scope="text">
          <a-tag v-if="text === 0" color="orange">待下发</a-tag>
          <a-tag v-else-if="text === 1" color="blue">已下发</a-tag>
          <a-tag v-else-if="text === 2" color="green">执行中</a-tag>
          <a-tag v-else-if="text === 3" color="green">完成</a-tag>
          <a-tag v-else-if="text === 4" color="red">异常</a-tag>
          <a-tag v-else color="default">未知</a-tag>
        </template>

      </a-table>
    </div>
  </a-card>
</template>

<script>
import { hospitalDict } from '@/utils/dict'

export default {
  name: 'PrescriptionExecution',
  data () {
    return {
      dataSource: [],
      loading: false,
      hospitalDict,
      dateRange: [],
      queryParams: {
        patientId: '',
        deviceId: '',
        prescriptionId: '',
        executorId: '',
        status: '',
        hospitalId: '',
        startDate: '',
        endDate: ''
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        hideOnSinglePage: true,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`
      }
    }
  },
  computed: {
    columns () {
      return [
        {
          title: '跟踪ID',
          dataIndex: 'id',
          key: 'id',
          width: 100
        },
        {
          title: '患者ID',
          dataIndex: 'patientId',
          key: 'patientId',
          width: 100
        },
        {
          title: '设备ID',
          dataIndex: 'deviceId',
          key: 'deviceId',
          width: 100
        },
        {
          title: '处方ID',
          dataIndex: 'prescriptionId',
          key: 'prescriptionId',
          width: 100
        },
        {
          title: '执行人ID',
          dataIndex: 'executorId',
          key: 'executorId',
          width: 100
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '进度描述',
          dataIndex: 'progress',
          key: 'progress',
          width: 200
        },
        {
          title: '异常原因',
          dataIndex: 'exception',
          key: 'exception',
          width: 200
        },
        {
          title: '创建人ID',
          dataIndex: 'createdBy',
          key: 'createdBy',
          width: 100
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: 150
        },
        {
          title: '最近操作人ID',
          dataIndex: 'updatedBy',
          key: 'updatedBy',
          width: 120
        },
        {
          title: '最近操作时间',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          width: 150
        },
        {
          title: '医院ID',
          dataIndex: 'hospitalId',
          key: 'hospitalId',
          width: 100
        }
      ]
    }
  },
  mounted () {
    console.log('PrescriptionExecution 组件已挂载')
    // 确保pagination对象的所有必需属性都存在
    this.pagination = {
      ...this.pagination,
      current: 1,
      pageSize: 10,
      total: 0
    }
    // 设置默认查询参数
    this.queryParams = {
      ...this.queryParams
    }
    this.loadData()
  },
  methods: {
    onDateChange (dates, dateStrings) {
      this.queryParams.startDate = dateStrings[0]
      this.queryParams.endDate = dateStrings[1]
    },
    loadData () {
      console.log('开始加载数据...')
      this.loading = true
      this.$get('/prescription-execution', {
        ...this.queryParams,
        current: this.pagination.current,
        size: this.pagination.pageSize
      }).then((r) => {
        console.log('数据加载成功:', r)
        // 根据实际API响应结构调整数据获取逻辑
        let dataArray = []
        if (Array.isArray(r.data)) {
          dataArray = r.data
          this.pagination.total = r.data.length
        } else if (r.data && r.data.records) {
          // 如果API返回的是分页格式
          dataArray = r.data.records || []
          this.pagination.total = r.data.total || 0
        } else {
          dataArray = []
          this.pagination.total = 0
        }
        
        // 前端排序：按创建时间倒序排列
        this.dataSource = dataArray.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.createTime || 0)
          const dateB = new Date(b.createdAt || b.createTime || 0)
          return dateB - dateA // 倒序：最新的在前
        })
        
        console.log('排序后的数据:', this.dataSource.map(item => ({
          id: item.id,
          createdAt: item.createdAt || item.createTime,
          sorted: true
        })))
        
        this.loading = false
      }).catch((error) => {
        console.error('数据加载失败:', error)
        this.loading = false
      })
    },
    search () {
      this.pagination.current = 1
      this.loadData()
    },
    reset () {
      this.queryParams = {
        patientId: '',
        deviceId: '',
        prescriptionId: '',
        executorId: '',
        status: '',
        hospitalId: '',
        startDate: '',
        endDate: ''
      }
      this.dateRange = []
      this.pagination.current = 1
      this.loadData()
    },
    exportExcel () {
      this.$message.info('导出功能开发中...')
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.loadData()
    }
  }
}
</script>

<style scoped>
.card-area {
  margin: 16px;
}
.operator {
  margin-bottom: 18px;
}
</style> 