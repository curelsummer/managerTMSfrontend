<template>
  <a-modal v-model="show" title="新增处方" @cancel="onClose" :width="900">
    <template slot="footer">
      <a-button key="back" @click="onClose">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
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
            <a-select v-decorator="['presType', { initialValue: 0, rules: [{ required: true, message: '请选择处方类型!' }] }]" @change="onPresTypeChange">
              <a-select-option value="0">普通处方</a-select-option>
              <a-select-option value="1">TBS处方</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='刺激强度(%)'>
            <a-input-number v-decorator="['presStrength', { initialValue: 80, rules: [{ required: true, message: '请输入刺激强度!' }] }]" :min="0" :max="100" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='刺激频率(Hz)'>
            <a-input-number v-decorator="['presFreq', { initialValue: 10.0, rules: [{ required: true, message: '请输入刺激频率!' }] }]" :min="0" :max="50" :step="0.1" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='刺激时间(秒)'>
            <a-input-number v-decorator="['lastTime', { initialValue: 5.0, rules: [{ required: true, message: '请输入刺激时间!' }] }]" :min="0" :max="60" :step="0.1" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='间歇时间(秒)'>
            <a-input-number v-decorator="['pauseTime', { initialValue: 25, rules: [{ required: true, message: '请输入间歇时间!' }] }]" :min="0" :max="300" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='重复次数(次)'>
            <a-input-number v-decorator="['repeatCount', { initialValue: 40, rules: [{ required: true, message: '请输入重复次数!' }] }]" :min="0" :max="1000" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='周期数(个)'>
            <a-input-number v-decorator="['periods', { initialValue: 1, rules: [{ required: true, message: '请输入周期数!' }] }]" :min="1" :max="1000" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='总脉冲数(个)'>
            <a-input-number v-decorator="['totalCount', { initialValue: 200, rules: [{ required: true, message: '请输入总脉冲数!' }] }]" :min="0" :max="10000" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='总时间(秒)'>
            <a-input-number v-decorator="['totalTime', { initialValue: 1200, rules: [{ required: true, message: '请输入总时间!' }] }]" :min="0" :max="7200" style="width: 100%"/>
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
        <a-col :md="12" :sm="24">
            <a-form-item label="标准处方" :labelCol="{span: 6}" :wrapperCol="{span: 17}">
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
                    选择标准处方
                  </a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
        <a-col :span="8">
          <a-form-item label='TBS类型'>
            <a-select v-decorator="['tbsType', { initialValue: null }]" @change="onTBSTypeChange" :disabled="!isTBSMode">
              <a-select-option value="0">iTBS</a-select-option>
              <a-select-option value="1">cTBS</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='丛内频率(Hz)'>
            <a-input-number v-decorator="['innerFreq', { initialValue: null }]" :min="0.1" :max="200" :step="0.1" style="width: 100%" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='丛内个数(个)'>
            <a-input-number v-decorator="['innerCount', { initialValue: null }]" :min="1" :max="200" style="width: 100%" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='丛间频率(Hz)'>
            <a-input-number v-decorator="['interFreq', { initialValue: null }]" :min="0.1" :max="200" :step="0.1" style="width: 100%" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='丛间个数(个)'>
            <a-input-number v-decorator="['interCount', { initialValue: null }]" :min="1" :max="200" style="width: 100%" disabled/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label='状态'>
            <a-select v-decorator="['status', { initialValue: 0 }]">
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
import { validatePrescription, calculateRTMSTotalCount, calculateTBSTotalCount, getTBSDefaultParams, getTBSCompliantParams } from '@/utils/prescriptionValidator'

export default {
  name: 'PrescriptionAdd',
  props: {
    prescriptionAddVisiable: {
      default: false
    }
  },
  computed: {
    show: {
      get: function () {
        return this.prescriptionAddVisiable
      },
      set: function () {}
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      loading: false,
      selectedStandardPrescriptionName: '', // 新增：用于存储选中的标准处方名称
      stimulationSiteOptions: [],
      isTBSMode: false // 是否为TBS模式
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
    reset () {
      this.loading = false
      this.form.resetFields()
      this.selectedStandardPrescriptionName = '' // 重置时清空选中的标准处方名称
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
          this.$postJson('/prescription', submitData).then(() => {
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
      console.log('应用标准处方到添加表单，原始数据:', standardPrescription)
      
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
    onPresTypeChange (value) {
      const presType = parseInt(value)
      this.isTBSMode = presType === 1
      
      if (presType === 0) {
        // 普通处方模式：清空TBS相关字段
        this.form.setFieldsValue({
          tbsType: null,
          innerFreq: null,
          innerCount: null,
          interFreq: null,
          interCount: null
        })
      } else if (presType === 1) {
        // TBS模式：设置默认TBS类型为iTBS，并设置符合验证规则的默认参数
        this.form.setFieldsValue({
          tbsType: 0
        })
        // 设置符合TBS验证规则的默认参数
        const compliantParams = getTBSCompliantParams(0)
        this.form.setFieldsValue(compliantParams)
      }
      
      // 重新计算总脉冲数
      this.autoCalculateTotalCount()
    },
    onTBSTypeChange (value) {
      // 根据TBS类型设置符合验证规则的参数
      const compliantParams = getTBSCompliantParams(parseInt(value))
      this.form.setFieldsValue(compliantParams)
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