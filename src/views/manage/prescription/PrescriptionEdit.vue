<template>
  <a-modal v-model="show" title="编辑处方" @cancel="onClose" :width="900">
    <template slot="footer">
      <a-button key="back" @click="onClose">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">修改</a-button>
    </template>
    <a-form :form="form" layout="vertical">
      <a-row :gutter="20">
        <a-col :span="8">
          <a-form-item label='患者ID'>
            <a-input v-decorator="['patientId', { rules: [{ required: true, message: '请输入患者ID!' }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='医院ID'>
            <a-input v-decorator="['hospitalId', { rules: [{ required: true, message: '请输入医院ID!' }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='医生ID'>
            <a-input v-decorator="['doctorId', { rules: [{ required: true, message: '请输入医生ID!' }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='处方类型'>
            <a-select v-decorator="['presType', { rules: [{ required: true, message: '请选择处方类型!' }] }]">
              <a-select-option value="0">普通处方</a-select-option>
              <a-select-option value="1">TBS处方</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='刺激强度(%)'>
            <a-input-number v-decorator="['presStrength', { rules: [{ required: true, message: '请输入刺激强度!' }] }]" :min="0" :max="100" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='刺激频率(Hz)'>
            <a-input-number v-decorator="['presFreq', { rules: [{ required: true, message: '请输入刺激频率!' }] }]" :min="0" :max="50" :step="0.1" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='刺激时间(秒)'>
            <a-input-number v-decorator="['lastTime', { rules: [{ required: true, message: '请输入刺激时间!' }] }]" :min="0" :max="60" :step="0.1" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='间歇时间(秒)'>
            <a-input-number v-decorator="['pauseTime', { rules: [{ required: true, message: '请输入间歇时间!' }] }]" :min="0" :max="300" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='重复次数(次)'>
            <a-input-number v-decorator="['repeatCount', { rules: [{ required: true, message: '请输入重复次数!' }] }]" :min="0" :max="1000" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='周期数(个)'>
            <a-input-number v-decorator="['periods', { rules: [{ required: true, message: '请输入周期数!' }] }]" :min="1" :max="1000" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='总脉冲数(个)'>
            <a-input-number v-decorator="['totalCount', { rules: [{ required: true, message: '请输入总脉冲数!' }] }]" :min="0" :max="10000" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='总时间(秒)'>
            <a-input-number v-decorator="['totalTime', { rules: [{ required: true, message: '请输入总时间!' }] }]" :min="0" :max="7200" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='治疗部位'>
            <a-select v-decorator="['presPartId', { rules: [{ required: true, message: '请选择治疗部位!' }] }]" placeholder="请选择治疗部位">
                          <a-select-option v-for="option in stimulationSiteOptions" :key="option.value" :value="option.value">
              [{{ option.category }}] {{ option.label }}
            </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='标准处方'>
            <a-row :gutter="16">
              <a-col :span="16">
                <a-input 
                  v-model="selectedStandardPrescriptionName" 
                  placeholder="点击选择标准处方" 
                  readonly
                  style="cursor: pointer;"
                  @click="showStandardPrescriptionModal"
                />
              </a-col>
              <a-col :span="8">
                <a-button 
                  type="primary" 
                  @click="showStandardPrescriptionModal"
                  icon="search"
                >
                  选择
                </a-button>
              </a-col>
            </a-row>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='TBS类型'>
            <a-select v-decorator="['tbsType']" @change="onTBSTypeChange">
              <a-select-option value="0">iTBS</a-select-option>
              <a-select-option value="1">cTBS</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='丛内频率(Hz)'>
            <a-input-number v-decorator="['innerFreq']" :min="0.1" :max="200" :step="0.1" style="width: 100%" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='丛内个数(个)'>
            <a-input-number v-decorator="['innerCount']" :min="1" :max="200" style="width: 100%" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='丛间频率(Hz)'>
            <a-input-number v-decorator="['interFreq']" :min="0.1" :max="200" :step="0.1" style="width: 100%" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='丛间个数(个)'>
            <a-input-number v-decorator="['interCount']" :min="1" :max="200" style="width: 100%" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='状态'>
            <a-select v-decorator="['status']">
              <a-select-option value="0">草稿</a-select-option>
              <a-select-option value="1">已下发</a-select-option>
              <a-select-option value="2">执行中</a-select-option>
              <a-select-option value="3">完成</a-select-option>
              <a-select-option value="4">异常</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { getStimulationSiteOptions } from '@/utils/dict'
import { validatePrescription, calculateRTMSTotalCount, calculateTBSTotalCount, getTBSDefaultParams } from '@/utils/prescriptionValidator'

export default {
  name: 'PrescriptionEdit',
  props: {
    prescriptionEditVisiable: {
      default: false
    }
  },
  computed: {
    show: {
      get: function () {
        return this.prescriptionEditVisiable
      },
      set: function () {}
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      loading: false,
      rowId: null,
      selectedStandardPrescriptionName: '',
      stimulationSiteOptions: []
    }
  },
  async mounted () {
    this.stimulationSiteOptions = await getStimulationSiteOptions(this)
    // 设置表单监听器
    this.$nextTick(() => {
      this.setupFormWatchers()
    })
  },
  methods: {
    setFormValues (row) {
      this.rowId = row.id
      let obj = {}
      let fields = [
        'patientId', 'hospitalId', 'doctorId', 'presType', 'presStrength', 
        'presFreq', 'lastTime', 'pauseTime', 'repeatCount', 'totalCount', 
        'totalTime', 'presPartId', 'presPartName', 'standardPresName', 'tbsType', 
        'innerPulseCount', 'outerFreq', 'status'
      ]
      fields.forEach(key => {
        obj[key] = row[key]
      })
      this.form.setFieldsValue(obj)
      
      // 设置标准处方名称显示
      this.selectedStandardPrescriptionName = row.standardPresName || ''
    },
    reset () {
      this.loading = false
      this.form.resetFields()
      this.selectedStandardPrescriptionName = ''
      // 清理定时器
      if (this.formWatcher) {
        clearInterval(this.formWatcher)
        this.formWatcher = null
      }
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    beforeDestroy () {
      // 组件销毁时清理定时器
      if (this.formWatcher) {
        clearInterval(this.formWatcher)
        this.formWatcher = null
      }
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          // 转换数值类型
          const submitData = {
            ...values,
            id: this.rowId,
            presType: parseInt(values.presType),
            presStrength: parseFloat(values.presStrength),
            presFreq: parseFloat(values.presFreq),
            lastTime: parseFloat(values.lastTime),
            pauseTime: parseInt(values.pauseTime),
            repeatCount: parseInt(values.repeatCount),
            totalCount: parseInt(values.totalCount),
            totalTime: parseInt(values.totalTime),
            tbsType: values.tbsType !== null && values.tbsType !== undefined ? parseInt(values.tbsType) : null,
            innerPulseCount: values.innerPulseCount !== null && values.innerPulseCount !== undefined ? parseInt(values.innerPulseCount) : null,
            outerFreq: values.outerFreq !== null && values.outerFreq !== undefined ? parseFloat(values.outerFreq) : null,
            status: parseInt(values.status)
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
          
          this.loading = true
          this.$putJson('/prescription', submitData).then(() => {
            this.reset()
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    showStandardPrescriptionModal () {
      this.$emit('openStandardPrescriptionModal')
    },
    applyStandardPrescription (standardPrescription) {
      console.log('应用标准处方到编辑表单，原始数据:', standardPrescription)
      
      // 应用标准处方数据到表单
      this.selectedStandardPrescriptionName = `${standardPrescription.indication1} - ${standardPrescription.indication2}`
      
      // 设置表单值 - 根据后端数据结构调整
      const formValues = {
        presFreq: standardPrescription.presFreq,
        lastTime: standardPrescription.lastTime, // 后端返回的是秒，需要转换为分钟
        pauseTime: standardPrescription.pauseTime,
        repeatCount: standardPrescription.repeatCount,
        totalTime: standardPrescription.totalTime * 60, // 后端返回的是分钟，需要转换为秒
                    presPartId: this.getSiteIdByName(standardPrescription.presPart),
            presPartName: standardPrescription.presPart,
        standardPresName: this.selectedStandardPrescriptionName
      }
      
      console.log('设置的表单值:', formValues)
      this.form.setFieldsValue(formValues)
      
      this.$message.success('标准处方参数已自动填充')
    },
    getSiteIdByName (siteName) {
      const siteOption = this.stimulationSiteOptions.find(option => option.label === siteName)
      return siteOption ? siteOption.value : null
    },
    setupFormWatchers () {
      // 使用定时器定期检查表单值变化
      this.formWatcher = setInterval(() => {
        this.autoCalculateTotalCount()
      }, 500) // 每500ms检查一次
    },
    onTBSTypeChange (value) {
      // 根据TBS类型设置固定参数
      const tbsParams = getTBSDefaultParams(parseInt(value))
      this.form.setFieldsValue(tbsParams)
      // 重新计算总脉冲数
      this.autoCalculateTotalCount()
    },
    autoCalculateTotalCount () {
      const values = this.form.getFieldsValue()
      const presType = parseInt(values.presType)
      
      if (presType === 0) { // rTMS模式
        const totalCount = calculateRTMSTotalCount(
          parseFloat(values.presFreq) || 0,
          parseFloat(values.lastTime) || 0,
          parseInt(values.repeatCount) || 0
        )
        if (totalCount > 0) {
          this.form.setFieldsValue({ totalCount })
        }
      } else if (presType === 1) { // TBS模式
        const totalCount = calculateTBSTotalCount(
          parseInt(values.innerCount) || 0,
          parseInt(values.interCount) || 0,
          parseInt(values.periods) || 1 // 使用周期数
        )
        if (totalCount > 0) {
          this.form.setFieldsValue({ totalCount })
        }
      }
    }
  }
}
</script>

<style scoped>
</style> 