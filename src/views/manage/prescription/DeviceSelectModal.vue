<template>
  <a-modal
    title="选择设备"
    :visible="visible"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
    width="1200px"
    :maskClosable="false"
  >
    <div class="search-area">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-input
            v-model="searchParams.hospitalId"
            placeholder="医院ID"
            allowClear
            @change="handleSearch"
          />
        </a-col>
        <a-col :span="6">
          <a-input
            v-model="searchParams.sn"
            placeholder="设备SN码"
            allowClear
            @change="handleSearch"
          />
        </a-col>
        <a-col :span="6">
          <a-select
            v-model="searchParams.status"
            placeholder="设备状态"
            allowClear
            @change="handleSearch"
            style="width: 100%"
          >
            <a-select-option value="online">在线</a-select-option>
            <a-select-option value="offline">离线</a-select-option>
            <a-select-option value="error">故障</a-select-option>
            <a-select-option value="unknown">未知</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
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
      :dataSource="deviceList"
      :loading="tableLoading"
      :pagination="pagination"
      :rowSelection="rowSelection"
      :scroll="{ y: 400 }"
      @change="handleTableChange"
      rowKey="deviceId"
    >
      <template slot="hospitalId" slot-scope="text">
        {{ hospitalDict[text] || text }}
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
import { hospitalDict } from '@/utils/dict'

export default {
  name: 'DeviceSelectModal',
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
      deviceList: [],
      selectedDevice: null,
      searchParams: {
        hospitalId: '',
        sn: '',
        status: undefined
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
        { title: '设备ID', dataIndex: 'deviceId', key: 'deviceId' },
        { title: '医院ID', dataIndex: 'hospitalId', key: 'hospitalId', scopedSlots: { customRender: 'hospitalId' } },
        { title: '设备类型', dataIndex: 'deviceType', key: 'deviceType' },
        { title: 'SN码', dataIndex: 'sn', key: 'sn' },
        { title: '状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' } },
        { title: '最后心跳时间', dataIndex: 'lastHeartbeat', key: 'lastHeartbeat' },
        { title: '预留字段1', dataIndex: 'extendField1', key: 'extendField1' },
        { title: '预留字段2', dataIndex: 'extendField2', key: 'extendField2' },
        { title: '预留字段3', dataIndex: 'extendField3', key: 'extendField3' }
      ],
      hospitalDict
    }
  },
  computed: {
    rowSelection () {
      return {
        type: 'radio',
        selectedRowKeys: this.selectedDevice ? [this.selectedDevice.deviceId] : [],
        onChange: this.onSelectChange
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.loadDeviceList()
      }
    }
  },
  methods: {
    async loadDeviceList () {
      this.tableLoading = true
      try {
        const params = {
          pageNum: this.pagination.current,
          pageSize: this.pagination.pageSize,
          ...this.searchParams
        }
        
        const res = await this.$get('/device/page', params)
        if (res && res.data) {
          this.deviceList = res.data.records || res.data.list || []
          this.pagination.total = res.data.total || 0
        }
      } catch (error) {
        console.error('加载设备列表失败:', error)
        this.$message.error('加载设备列表失败')
      } finally {
        this.tableLoading = false
      }
    },
    
    handleSearch () {
      this.pagination.current = 1
      this.loadDeviceList()
    },
    
    handleReset () {
      this.searchParams = {
        hospitalId: '',
        sn: '',
        status: undefined
      }
      this.pagination.current = 1
      this.loadDeviceList()
    },
    
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.loadDeviceList()
    },
    
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedDevice = selectedRows.length > 0 ? selectedRows[0] : null
    },
    
    handleOk () {
      if (!this.selectedDevice) {
        this.$message.warning('请选择一个设备')
        return
      }
      
      // 检查设备状态，只有在线设备才能下发
      if (this.selectedDevice.status !== 'online') {
        this.$message.error('只能选择在线状态的设备进行下发')
        return
      }
      
      this.loading = true
      // 触发父组件的设备选择完成事件
      this.$emit('deviceSelected', this.selectedDevice)
      this.loading = false
    },
    
    handleCancel () {
      this.selectedDevice = null
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