<template>
  <a-card :bordered="false" class="card-area">
    <div class="search">
      <a-form layout="horizontal">
        <a-row :gutter="15">
          <a-col :md="6" :sm="24">
            <a-form-item label="医院ID" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input v-model="queryParams.hospitalId"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="设备SN码" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input v-model="queryParams.sn"/>
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
      </div>
      <a-table
        :columns="columns"
        :rowKey="record => record.device_id"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange">
        <template slot="operation" slot-scope="text, record">
          <a-icon type="eye" @click="handleDeviceViewOpen(record)" title="详情" style="margin-right: 10px" />
          <a-icon type="edit" @click="edit(record)" title="编辑" style="margin-right: 10px" />
          <a-icon type="delete" @click="remove(record)" title="删除" />
        </template>
        <template slot="status" slot-scope="text">
          <a-tag v-if="text === 'online'" color="green">在线</a-tag>
          <a-tag v-else-if="text === 'offline'" color="red">离线</a-tag>
          <a-tag v-else-if="text === 'error'" color="orange">故障</a-tag>
          <a-tag v-else-if="text === 'unknown'">未知</a-tag>
          <span v-else>{{ text || '-' }}</span>
        </template>
      </a-table>
    </div>
    <device-add
      v-if="deviceAdd.visiable"
      @close="handleDeviceAddClose"
      @success="handleDeviceAddSuccess"
      :deviceAddVisiable="deviceAdd.visiable">
    </device-add>
    <device-edit
      ref="deviceEdit"
      @close="handleDeviceEditClose"
      @success="handleDeviceEditSuccess"
      :deviceEditVisiable="deviceEdit.visiable">
    </device-edit>
    <device-view
      @close="handleDeviceViewClose"
      :deviceShow="deviceView.visiable"
      :deviceData="deviceView.data">
    </device-view>
  </a-card>
</template>

<script>
import deviceAdd from './DeviceAdd.vue'
import deviceEdit from './DeviceEdit.vue'
import deviceView from './DeviceView.vue'
import { hospitalDict, departmentDict } from '@/utils/dict'
export default {
  name: 'Device',
  components: { deviceAdd, deviceEdit, deviceView },
  data () {
    return {
      deviceAdd: { visiable: false },
      deviceEdit: { visiable: false },
      deviceView: { visiable: false, data: null },
      queryParams: {},
      dataSource: [],
      loading: false,
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`,
        total: 0
      },
      ws: null // WebSocket实例
    }
  },
  computed: {
    columns () {
      return [
        { title: '设备ID', dataIndex: 'deviceId' },
        {
          title: '医院ID',
          dataIndex: 'hospitalId',
          customRender: (text) => hospitalDict[text] || text
        },
        { title: '设备类型', dataIndex: 'deviceType' },
        { title: 'SN码', dataIndex: 'sn' },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        { title: '最后心跳时间', dataIndex: 'lastHeartbeat' },
        { title: '预留字段1', dataIndex: 'extendField1' },
        { title: '预留字段2', dataIndex: 'extendField2' },
        { title: '预留字段3', dataIndex: 'extendField3' },
        { title: '操作', dataIndex: 'operation', scopedSlots: { customRender: 'operation' } }
      ]
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
      this.$get('/device/page', params).then(res => {
        if (res && res.data) {
          this.dataSource = res.data.records || res.data.list || []
          this.pagination.total = res.data.total || 0
          this.pagination.current = params.pageNum
          this.pagination.pageSize = params.pageSize
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    reset () {
      this.queryParams = {}
      this.search()
    },
    add () {
      this.deviceAdd.visiable = true
    },
    edit (row) {
      this.$refs.deviceEdit.setFormValues(row)
      this.deviceEdit.visiable = true
    },
    remove (row) {},
    handleTableChange () {},
    handleDeviceAddClose () {
      this.deviceAdd.visiable = false
    },
    handleDeviceAddSuccess () {
      this.deviceAdd.visiable = false
      this.search()
    },
    handleDeviceEditClose () {
      this.deviceEdit.visiable = false
    },
    handleDeviceEditSuccess () {
      this.deviceEdit.visiable = false
      this.search()
    },
    handleDeviceViewOpen (row) {
      this.deviceView.data = row
      this.deviceView.visiable = true
    },
    handleDeviceViewClose () {
      this.deviceView.visiable = false
    },
    initWebSocket() {
    
      this.ws = new WebSocket('ws://127.0.0.1:9527/ws/device');
      this.ws.onopen = () => {
        console.log('WebSocket 连接已建立');
      };
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.deviceId && data.status) {
            const device = this.dataSource.find(d => d.deviceId === data.deviceId);
            if (device) {
              this.$set(device, 'status', data.status);
            }
          }
        } catch (e) {
          console.warn('WebSocket消息解析失败', e);
        }
      };
      this.ws.onclose = () => {
        console.log('WebSocket 连接已关闭');
      };
      this.ws.onerror = (err) => {
        console.error('WebSocket 发生错误', err);
      };
    }
  },
  mounted () {
    this.search();
    this.initWebSocket();
  },
  beforeDestroy() {
    if (this.ws) {
      this.ws.close();
    }
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
</style>
