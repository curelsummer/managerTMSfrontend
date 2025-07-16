<template>
    <a-card :bordered="false" class="card-area">
      <div class="search">
        <a-form layout="horizontal">
          <a-row :gutter="15">
            <a-col :md="6" :sm="24">
              <a-form-item label="姓名" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.name"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="患者唯一码" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.code"/>
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
          :rowKey="record => record.id"
          :dataSource="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange">
          <template slot="operation" slot-scope="text, record">
            <a-icon type="eye" @click="handlePatientViewOpen(record)" title="详情" style="margin-right: 10px" />
            <a-icon type="edit" @click="edit(record)" title="编辑" style="margin-right: 10px" />
            <a-icon type="delete" @click="remove(record)" title="删除" />
          </template>
        </a-table>
      </div>
      <patient-add
        v-if="patientAdd.visiable"
        @close="handlePatientAddClose"
        @success="handlePatientAddSuccess"
        :patientAddVisiable="patientAdd.visiable">
      </patient-add>
      <patient-edit
        ref="patientEdit"
        @close="handlePatientEditClose"
        @success="handlePatientEditSuccess"
        :patientEditVisiable="patientEdit.visiable">
      </patient-edit>
      <patient-view
        @close="handlePatientViewClose"
        :patientShow="patientView.visiable"
        :patientData="patientView.data">
      </patient-view>
    </a-card>
  </template>
  
  <script>
  import patientAdd from './PatientAdd.vue'
  import patientEdit from './PatientEdit.vue'
  import patientView from './PatientView.vue'
  
  const hospitalDict = {
    1: "协和医院",
    2: "人民医院"
  }
  const departmentDict = {
    1: "内科",
    2: "外科"
  }

  export default {
    name: 'Patient',
    components: { patientAdd, patientEdit, patientView },
    data () {
      return {
        patientAdd: { visiable: false },
        patientEdit: { visiable: false },
        patientView: { visiable: false, data: null },
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
        }
      }
    },
    computed: {
      columns () {
        return [
          {
            title: '所属医院',
            dataIndex: 'hospitalId',
            customRender: (text) => hospitalDict[text] || text
          },
          {
            title: '所属科室',
            dataIndex: 'departmentId',
            customRender: (text) => departmentDict[text] || text
          },
          { title: '姓名', dataIndex: 'name' },
          {
            title: '性别',
            dataIndex: 'gender',
            customRender: (text) => text === 'M' ? '男' : (text === 'F' ? '女' : '')
          },
          { title: '出生日期', dataIndex: 'birthday' },
          { title: '患者唯一码', dataIndex: 'code' },
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
        this.$get('/patient/page', params).then(res => {
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
        this.search(1, this.pagination.pageSize)
      },
      add () {
        this.patientAdd.visiable = true
      },
      edit (row) {
        this.patientEdit.visiable = true
        this.$nextTick(() => {
          this.$refs.patientEdit.setFormValues(row)
        })
      },
      remove (row) {
        this.$confirm({
          title: '确认删除该患者吗？',
          onOk: () => {
            this.$delete(`/patient/${row.id}`).then(() => {
              this.$message.success('删除成功')
              this.search()
            })
          }
        })
      },
      handleTableChange (pagination) {
        this.pagination.current = pagination.current
        this.pagination.pageSize = pagination.pageSize
        this.search(pagination.current, pagination.pageSize)
      },
      handlePatientAddClose () {
        this.patientAdd.visiable = false
      },
      handlePatientAddSuccess () {
        this.patientAdd.visiable = false
        this.search()
      },
      handlePatientEditClose () {
        this.patientEdit.visiable = false
      },
      handlePatientEditSuccess () {
        this.patientEdit.visiable = false
        this.search()
      },
      handlePatientViewOpen (row) {
        this.patientView.data = row
        this.patientView.visiable = true
      },
      handlePatientViewClose () {
        this.patientView.visiable = false
      }
    },
    mounted () {
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
  </style>
  