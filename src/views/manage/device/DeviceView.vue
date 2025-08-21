<template>
  <a-modal v-model="show" title="设备详情" @cancel="onClose" :width="850">
    <template slot="footer">
      <a-button key="back" @click="onClose" type="danger">关闭</a-button>
    </template>
    <div style="font-size: 13px;font-family: SimHei" v-if="deviceData !== null">
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col style="margin-bottom: 15px"><span style="font-size: 15px;font-weight: 650;color: #000c17">设备信息</span></a-col>
        <a-col :span="8"><b>设备ID：</b>{{ deviceData.deviceId }}</a-col>
        <a-col :span="8"><b>医院ID：</b>{{ hospitalDict[deviceData.hospitalId] || deviceData.hospitalId }}</a-col>
        <a-col :span="8"><b>设备类型：</b>{{ deviceData.deviceType }}</a-col>
      </a-row>
      <br/>
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col :span="8"><b>SN码：</b>{{ deviceData.sn }}</a-col>
        <a-col :span="8"><b>状态：</b>
          <a-tag v-if="deviceData.status === 'online'" color="green">在线</a-tag>
          <a-tag v-else-if="deviceData.status === 'offline'" color="red">离线</a-tag>
          <a-tag v-else-if="deviceData.status === 'error'" color="orange">故障</a-tag>
          <a-tag v-else-if="deviceData.status === 'unknown'">未知</a-tag>
          <span v-else>{{ deviceData.status || '-' }}</span>
        </a-col>
        <a-col :span="8"><b>最后心跳时间：</b>{{ deviceData.lastHeartbeat }}</a-col>
      </a-row>
      <br/>
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col :span="8"><b>设备编号：</b>{{ deviceData.deviceNo || 0 }}</a-col>
        <a-col :span="8"><b>拍子使用次数：</b>{{ deviceData.batTimes || 0 }}</a-col>
        <a-col :span="8"><b>电容使用次数：</b>{{ deviceData.capTimes || 0 }}</a-col>
      </a-row>
      <br/>
      <a-row style="padding-left: 24px;padding-right: 24px;">
        <a-col :span="8"><b>治疗状态：</b>
          <a-tag v-if="deviceData.treatmentStatus === 1" color="green">刺激状态</a-tag>
          <a-tag v-else color="red">非刺激状态</a-tag>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script>
import { hospitalDict } from '@/utils/dict'
export default {
  name: 'DeviceView',
  props: {
    deviceShow: {
      type: Boolean,
      default: false
    },
    deviceData: {
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
        return this.deviceShow
      },
      set: function () {}
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
