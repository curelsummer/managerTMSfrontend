<template>
  <a-modal v-model="show" title="编辑设备" @cancel="onClose" :width="800">
    <template slot="footer">
      <a-button key="back" @click="onClose">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">修改</a-button>
    </template>
    <a-form :form="form" layout="vertical">
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item label='医院ID'>
            <a-input v-decorator="['hospitalId', { rules: [{ required: true, message: '请输入医院ID!' }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label='设备类型'>
            <a-input v-decorator="['deviceType', { rules: [{ required: true, message: '请输入设备类型!' }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label='SN码'>
            <a-input v-decorator="['sn', { rules: [{ required: true, message: '请输入SN码!' }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label='设备编号'>
            <a-input-number v-decorator="['deviceNo', { min: 0 }]" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label='拍子使用次数'>
            <a-input-number v-decorator="['batTimes', { min: 0 }]" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label='电容使用次数'>
            <a-input-number v-decorator="['capTimes', { min: 0 }]" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label='治疗状态'>
            <a-radio-group v-decorator="['treatmentStatus']">
              <a-radio :value="0">非刺激状态</a-radio>
              <a-radio :value="1">刺激状态</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'DeviceEdit',
  props: {
    deviceEditVisiable: {
      default: false
    }
  },
  computed: {
    show: {
      get: function () {
        return this.deviceEditVisiable
      },
      set: function () {}
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      loading: false,
      rowId: null
    }
  },
  methods: {
    setFormValues (row) {
      this.rowId = row.deviceId
      let obj = {}
      let fields = ['hospitalId', 'deviceType', 'sn', 'deviceNo', 'batTimes', 'capTimes', 'treatmentStatus']
      fields.forEach(key => {
        obj[key] = row[key]
      })
      this.form.setFieldsValue(obj)
    },
    reset () {
      this.loading = false
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          values.deviceId = this.rowId
          this.$putJson('/device', values).then(() => {
            this.reset()
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
