<template>
  <a-modal v-model="show" title="新增设备" @cancel="onClose" :width="800">
    <template slot="footer">
      <a-button key="back" @click="onClose">取消</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
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
            <a-input v-decorator="['deviceType', { initialValue: 'TMS', rules: [{ required: true, message: '请输入设备类型!' }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label='SN码'>
            <a-input v-decorator="['sn', { rules: [{ required: true, message: '请输入SN码!' }] }]"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label='预留字段1'>
            <a-input v-decorator="['extendField1']"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label='预留字段2'>
            <a-input v-decorator="['extendField2']"/>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label='预留字段3'>
            <a-input v-decorator="['extendField3']"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'DeviceAdd',
  props: {
    deviceAddVisiable: {
      default: false
    }
  },
  computed: {
    show: {
      get: function () {
        return this.deviceAddVisiable
      },
      set: function () {}
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      loading: false
    }
  },
  methods: {
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
          values.status = 'offline'
          this.$postJson('/device', values).then(() => {
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
