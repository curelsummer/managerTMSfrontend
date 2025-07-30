<template>
  <a-modal
    title="选择患者"
    :visible="visible"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
    width="1000px"
    :maskClosable="false"
  >
    <div class="search-area">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-input
            v-model="searchParams.name"
            placeholder="患者姓名"
            allowClear
            @change="handleSearch"
          />
        </a-col>
        <a-col :span="8">
          <a-input
            v-model="searchParams.code"
            placeholder="患者唯一码"
            allowClear
            @change="handleSearch"
          />
        </a-col>
        <a-col :span="8">
          <a-button type="primary" @click="handleSearch" icon="search">
            搜索
          </a-button>
          <a-button @click="handleReset" style="margin-left: 8px">
            重置
          </a-button>
        </a-col>
      </a-row>
    </div>

    <a-table
      :columns="columns"
      :dataSource="patientList"
      :loading="tableLoading"
      :pagination="pagination"
      :rowSelection="rowSelection"
      :scroll="{ y: 400 }"
      @change="handleTableChange"
      rowKey="id"
    >
      <template slot="hospitalId" slot-scope="text">
        {{ hospitalDict[text] || text }}
      </template>
      <template slot="departmentId" slot-scope="text">
        {{ departmentDict[text] || text }}
      </template>
      <template slot="gender" slot-scope="text">
        {{ text === 'M' ? '男' : (text === 'F' ? '女' : '') }}
      </template>
      <template slot="status" slot-scope="text">
        <a-tag v-if="text === 'online'" color="green">在线</a-tag>
        <a-tag v-else-if="text === 'offline'" color="red">离线</a-tag>
        <a-tag v-else-if="text === 'error'" color="orange">故障</a-tag>
        <a-tag v-else-if="text === 'unknown'">未知</a-tag>
        <span v-else>{{ text || '-' }}</span>
      </template>
    </a-table>
  </a-modal>
</template>

<script>
import { hospitalDict, departmentDict } from '@/utils/dict'

export default {
  name: 'PatientSelectModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      tableLoading: false,
      patientList: [],
      selectedPatient: null,
      searchParams: {
        name: '',
        code: ''
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
      },
      columns: [
        { title: '所属医院', dataIndex: 'hospitalId', key: 'hospitalId', scopedSlots: { customRender: 'hospitalId' } },
        { title: '所属科室', dataIndex: 'departmentId', key: 'departmentId', scopedSlots: { customRender: 'departmentId' } },
        { title: '患者姓名', dataIndex: 'name', key: 'name' },
        { title: '性别', dataIndex: 'gender', key: 'gender', scopedSlots: { customRender: 'gender' } },
        { title: '出生日期', dataIndex: 'birthday', key: 'birthday' },
        { title: '患者唯一码', dataIndex: 'code', key: 'code' },
        { title: '状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' } },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime' }
      ],
      hospitalDict,
      departmentDict
    }
  },
  computed: {
    rowSelection () {
      return {
        type: 'radio',
        selectedRowKeys: this.selectedPatient ? [this.selectedPatient.id] : [],
        onChange: this.onSelectChange
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.loadPatientList()
      }
    }
  },
  methods: {
    async loadPatientList () {
      this.tableLoading = true
      try {
        const params = {
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
          ...this.searchParams
        }
        
        const res = await this.$get('/patient/page', params)
        if (res && res.data) {
          this.patientList = res.data.records || res.data.list || []
          this.pagination.total = res.data.total || 0
        }
      } catch (error) {
        console.error('加载患者列表失败:', error)
        this.$message.error('加载患者列表失败')
      } finally {
        this.tableLoading = false
      }
    },
    
    handleSearch () {
      this.pagination.current = 1
      this.loadPatientList()
    },
    
    handleReset () {
      this.searchParams = {
        name: '',
        code: ''
      }
      this.pagination.current = 1
      this.loadPatientList()
    },
    
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.loadPatientList()
    },
    
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedPatient = selectedRows.length > 0 ? selectedRows[0] : null
    },
    
    handleOk () {
      if (!this.selectedPatient) {
        this.$message.warning('请选择一个患者')
        return
      }
      
      this.loading = true
      // 触发父组件的患者选择完成事件
      this.$emit('patientSelected', this.selectedPatient)
      this.loading = false
    },
    
    handleCancel () {
      this.selectedPatient = null
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
.search-area {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}
</style> 