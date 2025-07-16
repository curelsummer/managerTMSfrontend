<template>
    <a-modal v-model="show" title="患者详情" @cancel="onClose" :width="850">
      <template slot="footer">
        <a-button key="back" @click="onClose" type="danger">关闭</a-button>
      </template>
      <div style="font-size: 13px;font-family: SimHei" v-if="patientData !== null">
        <a-row style="padding-left: 24px;padding-right: 24px;">
          <a-col style="margin-bottom: 15px"><span style="font-size: 15px;font-weight: 650;color: #000c17">患者信息</span></a-col>
          <a-col :span="8"><b>所属医院：</b>{{ hospitalDict[patientData.hospitalId] || patientData.hospitalId }}</a-col>
          <a-col :span="8"><b>所属科室：</b>{{ departmentDict[patientData.departmentId] || patientData.departmentId }}</a-col>
          <a-col :span="8"><b>姓名：</b>{{ patientData.name }}</a-col>
        </a-row>
        <br/>
        <a-row style="padding-left: 24px;padding-right: 24px;">
          <a-col :span="8"><b>性别：</b>
            <a-tag v-if="patientData.gender == 'M'" color="blue">男</a-tag>
            <a-tag v-if="patientData.gender == 'F'" color="pink">女</a-tag>
          </a-col>
          <a-col :span="8"><b>出生日期：</b>{{ patientData.birthday }}</a-col>
          <a-col :span="8"><b>患者唯一码：</b>{{ patientData.code }}</a-col>
        </a-row>
      </div>
    </a-modal>
  </template>
  
  <script>
  import moment from 'moment'
  export default {
    name: 'PatientView',
    props: {
      patientShow: {
        type: Boolean,
        default: false
      },
      patientData: {
        type: Object
      }
    },
    data() {
      return {
        hospitalDict: {
          1: "协和医院",
          2: "人民医院"
        },
        departmentDict: {
          1: "内科",
          2: "外科"
        }
      }
    },
    computed: {
      show: {
        get: function () {
          return this.patientShow
        },
        set: function () {}
      }
    },
    watch: {
      patientShow: function (value) {
        if (value && this.patientData && this.patientData.id) {
          this.$get(`/patient/${this.patientData.id}`).then(res => {
            if (res && res.data) {
              this.$emit('update:patientData', res.data)
            }
          })
        }
      }
    },
    methods: {
      onClose () {
        this.$emit('close')
      }
    }
  }
  </script>
  
  <style scoped>
  </style>
  