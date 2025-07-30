/**
 * 处方验证工具类
 * 包含rTMS和TBS模式的所有验证规则
 */

// 配置常量
const CONFIG = {
  MAX_FREQ: 200, // 最大频率
  MAX_TOTAL_TIME: 1800, // 最大总时间（30分钟 = 1800秒）
  iTBS_PAUSE_TIME_MIN: 8, // iTBS最小间歇时间
  iTBS_INNER_FREQ: 50, // iTBS丛内频率
  iTBS_INNER_COUNT: 3, // iTBS丛内个数
  iTBS_INTER_FREQ: 5, // iTBS丛间频率
  iTBS_INTER_COUNT: 10, // iTBS丛间个数
  cTBS_PAUSE_TIME: 0, // cTBS间歇时间
  cTBS_INNER_FREQ: 50, // cTBS丛内频率
  cTBS_INNER_COUNT: 3, // cTBS丛内个数
  cTBS_INTER_FREQ: 5, // cTBS丛间频率
  cTBS_INTER_COUNT: 200, // cTBS丛间个数
  cTBS_PERIODS: 1 // cTBS周期数
}

/**
 * 获取最大允许强度（功率限制验证）
 * @param {number} presFreq - 刺激频率
 * @param {number} lastTime - 刺激时间
 * @param {number} pauseTime - 间歇时间
 * @returns {number} 最大允许强度
 */
function getMaxStrength(presFreq, lastTime, pauseTime) {
  // 规则1：频率1Hz或2-5Hz且时间≤1秒
  if ((presFreq === 1) || (presFreq >= 2 && presFreq <= 5 && lastTime <= 1)) {
    return 100
  }
  // 规则2：频率6-20Hz且时间≤1秒且间歇≥1秒
  else if ((presFreq >= 6 && presFreq <= 20 && lastTime <= 1 && pauseTime >= 1) ||
           (presFreq >= 21 && presFreq <= 30 && lastTime <= 0.4 && pauseTime >= 2) ||
           (presFreq >= 31 && presFreq <= 40 && lastTime <= 0.2 && pauseTime >= 2) ||
           (presFreq >= 41 && presFreq <= 50 && lastTime <= 0.1 && pauseTime >= 1)) {
    return 99
  }
  // 规则3：频率11-20Hz且时间≤0.5秒且间歇≥1秒
  else if ((presFreq >= 11 && presFreq <= 20 && lastTime <= 0.5 && pauseTime >= 1) ||
           (presFreq >= 21 && presFreq <= 30 && lastTime <= 0.3 && pauseTime >= 1) ||
           (presFreq >= 31 && presFreq <= 50 && lastTime <= 0.2 && pauseTime >= 2) ||
           (presFreq >= 51 && presFreq <= 60 && lastTime <= 0.1 && pauseTime >= 1)) {
    return 90
  }
  // 规则4：频率6-10Hz且时间≤0.5秒且间歇≥1秒
  else if ((presFreq >= 6 && presFreq <= 10 && lastTime <= 0.5 && pauseTime >= 1) ||
           (presFreq >= 11 && presFreq <= 20 && lastTime <= 0.3 && pauseTime >= 1) ||
           (presFreq >= 21 && presFreq <= 30 && lastTime <= 0.2 && pauseTime >= 1) ||
           (presFreq >= 31 && presFreq <= 50 && lastTime <= 0.1 && pauseTime >= 1)) {
    return 80
  }
  // 规则5：频率1-5Hz且时间≤0.5秒且间歇≥1秒
  else if ((presFreq >= 1 && presFreq <= 5 && lastTime <= 0.5 && pauseTime >= 1) ||
           (presFreq >= 6 && presFreq <= 10 && lastTime <= 0.3 && pauseTime >= 1) ||
           (presFreq >= 11 && presFreq <= 20 && lastTime <= 0.2 && pauseTime >= 1) ||
           (presFreq >= 21 && presFreq <= 30 && lastTime <= 0.1 && pauseTime >= 1)) {
    return 70
  }
  // 规则6：频率1-5Hz且时间≤0.3秒且间歇≥1秒
  else if ((presFreq >= 1 && presFreq <= 5 && lastTime <= 0.3 && pauseTime >= 1) ||
           (presFreq >= 6 && presFreq <= 10 && lastTime <= 0.2 && pauseTime >= 1) ||
           (presFreq >= 11 && presFreq <= 20 && lastTime <= 0.1 && pauseTime >= 1)) {
    return 60
  }
  // 规则7：频率1-5Hz且时间≤0.2秒且间歇≥1秒
  else if ((presFreq >= 1 && presFreq <= 5 && lastTime <= 0.2 && pauseTime >= 1) ||
           (presFreq >= 6 && presFreq <= 10 && lastTime <= 0.1 && pauseTime >= 1)) {
    return 50
  }
  // 规则8：频率1-5Hz且时间≤0.1秒且间歇≥1秒
  else if ((presFreq >= 1 && presFreq <= 5 && lastTime <= 0.1 && pauseTime >= 1)) {
    return 40
  }
  // 规则9：其他情况
  else if (pauseTime >= 1) {
    return 30
  }
  // 规则10：最低强度
  else {
    return 1
  }
}

/**
 * 验证rTMS模式参数
 * @param {Object} params - 处方参数
 * @returns {Object} 验证结果 {valid: boolean, message: string}
 */
export function validateRTMS(params) {
  const {
    presStrength,
    presFreq,
    lastTime,
    pauseTime,
    repeatCount,
    periods,
    totalCount
  } = params

  // 1.1 基础参数范围验证
  if (presStrength < 1 || presStrength > 100) {
    return { valid: false, message: '刺激强度范围：1～100%' }
  }

  if (presFreq < 0.1 || presFreq > CONFIG.MAX_FREQ) {
    return { valid: false, message: `刺激频率范围：0.1～${CONFIG.MAX_FREQ}Hz` }
  }

  if (lastTime < 0.1 || lastTime > 60) {
    return { valid: false, message: '刺激时间范围：0.1～60秒' }
  }

  if (pauseTime < 0 || pauseTime > 90) {
    return { valid: false, message: '间歇时间范围：0～90秒' }
  }

  if (repeatCount < 1 || repeatCount > 1000) {
    return { valid: false, message: '重复次数范围：1～1000次' }
  }

  if (periods < 1 || periods > 1000) {
    return { valid: false, message: '周期数范围：1～1000个' }
  }

  // 1.2 功率限制验证
  const maxStrength = getMaxStrength(presFreq, lastTime, pauseTime)
  if (presStrength > maxStrength) {
    return { valid: false, message: `当前参数组合下最大允许强度为${maxStrength}%` }
  }

  // 1.3 总时间验证
  const totalTimeSeconds = Math.floor((lastTime + pauseTime) * repeatCount)
  if (totalTimeSeconds > CONFIG.MAX_TOTAL_TIME) {
    return { valid: false, message: '总治疗时间不能超过30分钟' }
  }

  // 3.2 自动计算字段验证
  const expectedTotalCount = Math.floor((presFreq * lastTime) * repeatCount)
  if (totalCount !== expectedTotalCount) {
    return { valid: false, message: `总脉冲数计算错误，应为${expectedTotalCount}个` }
  }

  return { valid: true, message: '验证通过' }
}

/**
 * 验证TBS模式参数
 * @param {Object} params - 处方参数
 * @returns {Object} 验证结果 {valid: boolean, message: string}
 */
export function validateTBS(params) {
  const {
    presStrength,
    tbsType,
    innerFreq,
    innerCount,
    interFreq,
    interCount,
    periods,
    pauseTime,
    totalCount
  } = params

  // 2.1 基础参数范围验证
  if (presStrength < 1 || presStrength > 60) {
    return { valid: false, message: 'TBS模式刺激强度范围：1～60%' }
  }

  // 检查TBS类型是否有效
  if (tbsType === null || tbsType === undefined || (tbsType !== 0 && tbsType !== 1)) {
    return { valid: false, message: 'TBS模式必须选择有效的TBS类型（iTBS或cTBS）' }
  }

  if (innerFreq < 0.1 || innerFreq > CONFIG.MAX_FREQ) {
    return { valid: false, message: '丛内频率范围：0.1～200Hz' }
  }

  if (innerCount < 1 || innerCount > 200) {
    return { valid: false, message: '丛内个数范围：1～200个' }
  }

  if (interFreq < 0.1 || interFreq > CONFIG.MAX_FREQ) {
    return { valid: false, message: '丛间频率范围：0.1～200Hz' }
  }

  if (interCount < 1 || interCount > 200) {
    return { valid: false, message: '丛间个数范围：1～200个' }
  }

  if (periods < 1 || periods > 1000) {
    return { valid: false, message: '周期数范围：1～1000个' }
  }

  // 2.2 TBS类型特定验证
  if (tbsType === 0) { // iTBS模式
    if (pauseTime < CONFIG.iTBS_PAUSE_TIME_MIN) {
      return { valid: false, message: 'iTBS模式间歇时间不能少于8秒' }
    }

    if (innerFreq !== CONFIG.iTBS_INNER_FREQ) {
      return { valid: false, message: 'iTBS模式丛内频率应为50Hz' }
    }

    if (innerCount !== CONFIG.iTBS_INNER_COUNT) {
      return { valid: false, message: 'iTBS模式丛内个数应为3个' }
    }

    if (interFreq !== CONFIG.iTBS_INTER_FREQ) {
      return { valid: false, message: 'iTBS模式丛间频率应为5Hz' }
    }

    if (interCount !== CONFIG.iTBS_INTER_COUNT) {
      return { valid: false, message: 'iTBS模式丛间个数应为10个' }
    }
  } else if (tbsType === 1) { // cTBS模式
    if (pauseTime !== CONFIG.cTBS_PAUSE_TIME) {
      return { valid: false, message: 'cTBS模式间歇时间必须为0秒' }
    }

    if (innerFreq !== CONFIG.cTBS_INNER_FREQ) {
      return { valid: false, message: 'cTBS模式丛内频率应为50Hz' }
    }

    if (innerCount !== CONFIG.cTBS_INNER_COUNT) {
      return { valid: false, message: 'cTBS模式丛内个数应为3个' }
    }

    if (interFreq !== CONFIG.cTBS_INTER_FREQ) {
      return { valid: false, message: 'cTBS模式丛间频率应为5Hz' }
    }

    if (interCount !== CONFIG.cTBS_INTER_COUNT) {
      return { valid: false, message: 'cTBS模式丛间个数应为200个' }
    }

    if (periods !== CONFIG.cTBS_PERIODS) {
      return { valid: false, message: 'cTBS模式周期数应为1个' }
    }
  }

  // TBS模式总治疗时间验证
  const tempLastTime = interCount / interFreq
  const totalTimeSeconds = Math.floor((tempLastTime + pauseTime) * periods)
  if (totalTimeSeconds > CONFIG.MAX_TOTAL_TIME) {
    return { valid: false, message: 'TBS模式总治疗时间不能超过30分钟' }
  }

  // 3.2 自动计算字段验证
  const expectedTotalCount = Math.floor((innerCount * interCount) * periods)
  if (totalCount !== expectedTotalCount) {
    return { valid: false, message: `总脉冲数计算错误，应为${expectedTotalCount}个` }
  }

  return { valid: true, message: '验证通过' }
}

/**
 * 验证治疗部位
 * @param {string} presPartName - 治疗部位名称
 * @param {Array} validParts - 有效的治疗部位列表
 * @returns {Object} 验证结果 {valid: boolean, message: string}
 */
export function validatePresPart(presPartName, validParts) {
  if (!presPartName || presPartName.trim() === '') {
    return { valid: false, message: '治疗部位不能为空' }
  }

  if (!validParts || !validParts.includes(presPartName)) {
    return { valid: false, message: `不支持的治疗部位：${presPartName}` }
  }

  return { valid: true, message: '验证通过' }
}

/**
 * 综合验证处方
 * @param {Object} prescription - 处方对象
 * @param {Array} validParts - 有效的治疗部位列表
 * @returns {Object} 验证结果 {valid: boolean, message: string}
 */
export function validatePrescription(prescription, validParts = []) {
  const { presType, presPartName } = prescription

  // 3.1 治疗部位验证
  const partValidation = validatePresPart(presPartName, validParts)
  if (!partValidation.valid) {
    return partValidation
  }

  // 根据处方类型进行验证
  if (presType === 0) { // rTMS模式
    return validateRTMS(prescription)
  } else if (presType === 1) { // TBS模式
    return validateTBS(prescription)
  } else {
    return { valid: false, message: '无效的处方类型' }
  }
}

/**
 * 计算rTMS模式的总脉冲数
 * @param {number} presFreq - 刺激频率
 * @param {number} lastTime - 刺激时间
 * @param {number} repeatCount - 重复次数
 * @returns {number} 总脉冲数
 */
export function calculateRTMSTotalCount(presFreq, lastTime, repeatCount) {
  return Math.floor((presFreq * lastTime) * repeatCount)
}

/**
 * 计算TBS模式的总脉冲数
 * @param {number} innerCount - 丛内个数
 * @param {number} interCount - 丛间个数
 * @param {number} periods - 周期数
 * @returns {number} 总脉冲数
 */
export function calculateTBSTotalCount(innerCount, interCount, periods) {
  return Math.floor((innerCount * interCount) * periods)
}

/**
 * 获取TBS模式的默认参数
 * @param {number} tbsType - TBS类型 (0: iTBS, 1: cTBS)
 * @returns {Object} 默认参数
 */
export function getTBSDefaultParams(tbsType) {
  if (tbsType === 0) { // iTBS
    return {
      innerFreq: CONFIG.iTBS_INNER_FREQ,
      innerCount: CONFIG.iTBS_INNER_COUNT,
      interFreq: CONFIG.iTBS_INTER_FREQ,
      interCount: CONFIG.iTBS_INTER_COUNT,
      pauseTime: CONFIG.iTBS_PAUSE_TIME_MIN
    }
  } else if (tbsType === 1) { // cTBS
    return {
      innerFreq: CONFIG.cTBS_INNER_FREQ,
      innerCount: CONFIG.cTBS_INNER_COUNT,
      interFreq: CONFIG.cTBS_INTER_FREQ,
      interCount: CONFIG.cTBS_INTER_COUNT,
      pauseTime: CONFIG.cTBS_PAUSE_TIME,
      periods: CONFIG.cTBS_PERIODS
    }
  }
  return {}
}

/**
 * 获取符合TBS验证规则的默认处方参数
 * @param {number} tbsType - TBS类型（0:iTBS, 1:cTBS）
 * @returns {Object} 符合TBS验证规则的默认参数
 */
export function getTBSCompliantParams(tbsType) {
  const tbsParams = getTBSDefaultParams(tbsType)
  
  if (tbsType === 0) { // iTBS
    return {
      presStrength: 50, // TBS模式刺激强度范围：1～60%
      presFreq: 5, // 丛间频率
      lastTime: 2, // 单次刺激时长（秒）
      pauseTime: 8, // iTBS最小间歇时间
      repeatCount: 1, // 重复次数
      ...tbsParams
    }
  } else if (tbsType === 1) { // cTBS
    return {
      presStrength: 50, // TBS模式刺激强度范围：1～60%
      presFreq: 5, // 丛间频率
      lastTime: 40, // 单次刺激时长（秒）：200个脉冲 / 5Hz = 40秒
      pauseTime: 0, // cTBS间歇时间必须为0秒
      repeatCount: 1, // 重复次数
      ...tbsParams
    }
  }
  
  return {}
}

export default {
  validateRTMS,
  validateTBS,
  validatePresPart,
  validatePrescription,
  calculateRTMSTotalCount,
  calculateTBSTotalCount,
  getTBSDefaultParams,
  getTBSCompliantParams,
  getMaxStrength
} 