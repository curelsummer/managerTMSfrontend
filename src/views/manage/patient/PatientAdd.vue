<template>
    <a-modal v-model="show" title="新增患者" @cancel="onClose" :width="800">
      <template slot="footer">
        <a-button key="back" @click="onClose">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
      </template>
      <a-form :form="form" layout="vertical">
        <a-row :gutter="20">
          <a-col :span="12">
            <a-form-item label='所属医院'>
              <a-input v-decorator="['hospitalId', { rules: [{ required: true, message: '请输入所属医院!' }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label='所属科室'>
              <a-input v-decorator="['departmentId', { rules: [{ required: true, message: '请输入所属科室!' }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label='姓名'>
              <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入姓名!' }] }]"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label='性别'>
              <a-select v-decorator="['gender', { rules: [{ required: true, message: '请选择性别!' }] }]">
                <a-select-option value="M">男</a-select-option>
                <a-select-option value="F">女</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label='出生日期'>
              <a-date-picker v-decorator="['birthday', { rules: [{ required: true, message: '请选择出生日期!' }] }]" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label='患者唯一码'>
              <a-input v-decorator="['code', { rules: [{ required: true, message: '请输入患者唯一码!' }] }]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </template>
  
  <script>
  export default {
    name: 'PatientAdd',
    props: {
      patientAddVisiable: {
        default: false
      }
    },
    computed: {
      show: {
        get: function () {
          return this.patientAddVisiable
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
            if (values.birthday && values.birthday.format) {
              values.birthday = values.birthday.format('YYYY-MM-DD')
            }
            this.$postJson('/patient', values).then(() => {
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
  