<template>
  <a-modal v-model="show" title="处方详情" @cancel="onClose" :width="900">
    <template slot="footer">
      <a-button key="back" @click="onClose" type="danger">关闭</a-button>
    </template>
    <div style="font-size: 13px;font-family: SimHei" v-if="prescriptionData !== null">
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col style="margin-bottom: 15px"><span style="font-size: 15px;font-weight: 650;color: #000c17">基础信息</span></a-col>
        <a-col :span="8"><b>处方ID：</b>{{ prescriptionData.id }}</a-col>
        <a-col :span="8"><b>患者ID：</b>{{ prescriptionData.patientId }}</a-col>
        <a-col :span="8"><b>医院ID：</b>{{ hospitalDict[prescriptionData.hospitalId] || prescriptionData.hospitalId }}</a-col>
      </a-row>
      <br/>
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col :span="8"><b>医生ID：</b>{{ prescriptionData.doctorId }}</a-col>
        <a-col :span="8"><b>处方类型：</b>
          <a-tag v-if="prescriptionData.presType == 0" color="blue">普通处方</a-tag>
          <a-tag v-else-if="prescriptionData.presType == 1" color="green">TBS处方</a-tag>
          <span v-else>{{ getPresTypeText(prescriptionData.presType) || prescriptionData.presType || '-' }}</span>
        </a-col>
        <a-col :span="8"><b>状态：</b>
          <a-tag v-if="prescriptionData.status == 0" color="dashed" style="border-color: #d9d9d9; color: #666;">草稿</a-tag>
          <a-tag v-else-if="prescriptionData.status == 1" color="blue">已下发</a-tag>
          <a-tag v-else-if="prescriptionData.status == 2" color="orange">执行中</a-tag>
          <a-tag v-else-if="prescriptionData.status == 3" color="green">完成</a-tag>
          <a-tag v-else-if="prescriptionData.status == 4" color="red">异常</a-tag>
          <span v-else>{{ getStatusText(prescriptionData.status) || prescriptionData.status || '-' }}</span>
        </a-col>
      </a-row>
      <br/>
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col style="margin-bottom: 15px"><span style="font-size: 15px;font-weight: 650;color: #000c17">处方参数</span></a-col>
        <a-col :span="8"><b>刺激强度：</b>{{ prescriptionData.presStrength }}</a-col>
        <a-col :span="8"><b>刺激频率：</b>{{ prescriptionData.presFreq }}</a-col>
        <a-col :span="8"><b>刺激时间(秒)：</b>{{ prescriptionData.lastTime }}</a-col>
      </a-row>
      <br/>
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col :span="8"><b>间歇时间(秒)：</b>{{ prescriptionData.pauseTime }}</a-col>
        <a-col :span="8"><b>重复次数：</b>{{ prescriptionData.repeatCount }}</a-col>
        <a-col :span="8"><b>周期数：</b>{{ prescriptionData.periods || 1 }}</a-col>
        <a-col :span="8"><b>总脉冲数：</b>{{ prescriptionData.totalCount }}</a-col>
      </a-row>
      <br/>
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col :span="8"><b>总时间(秒)：</b>{{ prescriptionData.totalTime }}</a-col>
        <a-col :span="8"><b>治疗部位：</b>{{ getStimulationSiteName(prescriptionData.presPartId) }}</a-col>
        <a-col :span="8"><b>标准处方：</b>{{ prescriptionData.standardPresName || '-' }}</a-col>
      </a-row>
      <br/>
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col style="margin-bottom: 15px"><span style="font-size: 15px;font-weight: 650;color: #000c17">TBS专用参数</span></a-col>
        <a-col :span="8"><b>TBS类型：</b>
          <a-tag v-if="prescriptionData.tbsType == 0" color="purple">iTBS</a-tag>
          <a-tag v-else-if="prescriptionData.tbsType == 1" color="cyan">cTBS</a-tag>
          <span v-else>{{ getTbsTypeText(prescriptionData.tbsType) || prescriptionData.tbsType || '-' }}</span>
        </a-col>
        <a-col :span="8"><b>丛内频率：</b>{{ prescriptionData.innerFreq || '-' }}</a-col>
        <a-col :span="8"><b>丛内个数：</b>{{ prescriptionData.innerCount || '-' }}</a-col>
        <a-col :span="8"><b>丛间频率：</b>{{ prescriptionData.interFreq || '-' }}</a-col>
        <a-col :span="8"><b>丛间个数：</b>{{ prescriptionData.interCount || '-' }}</a-col>
      </a-row>
      <br/>
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col style="margin-bottom: 15px"><span style="font-size: 15px;font-weight: 650;color: #000c17">审计信息</span></a-col>
        <a-col :span="8"><b>创建人：</b>{{ prescriptionData.createBy || '-' }}</a-col>
        <a-col :span="8"><b>创建时间：</b>{{ prescriptionData.createTime }}</a-col>
        <a-col :span="8"><b>更新人：</b>{{ prescriptionData.updateBy || '-' }}</a-col>
      </a-row>
      <br/>
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col :span="8"><b>更新时间：</b>{{ prescriptionData.updateTime || '-' }}</a-col>
        <a-col :span="8"><b>备注：</b>{{ prescriptionData.remark || '-' }}</a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script>
import { hospitalDict, getStimulationSiteName } from '@/utils/dict'
export default {
  name: 'PrescriptionView',
  props: {
    prescriptionShow: {
      type: Boolean,
      default: false
    },
    prescriptionData: {
      type: Object
    }
  },
  data() {
    return {
      hospitalDict
    }
  },
  computed: {
    show: {
      get: function () {
        return this.prescriptionShow
      },
      set: function () {}
    }
  },
  methods: {
    onClose () {
      this.$emit('close')
    },
    getStatusText (status) {
      const statusMap = {
        0: '草稿',
        1: '已下发',
        2: '执行中',
        3: '完成',
        4: '异常'
      }
      return statusMap[status] || status
    },
    getPresTypeText (presType) {
      const presTypeMap = {
        0: '普通处方',
        1: 'TBS处方'
      }
      return presTypeMap[presType] || presType
    },
    getTbsTypeText (tbsType) {
      const tbsTypeMap = {
        0: 'iTBS',
        1: 'cTBS'
      }
      return tbsTypeMap[tbsType] || tbsType
    }
  }
}
</script>

<style scoped>
</style> 