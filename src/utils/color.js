import { message } from 'ant-design-vue/es'

let lessNodesAppended
let currentThemeColor = null // 记录当前主题颜色

/**
 * 更新主题颜色
 * @param {string} primaryColor - 主题颜色，格式：rgb(r, g, b) 或 #rrggbb
 * @param {boolean} silent - 是否静默更新（不显示加载提示），默认 false
 * @param {boolean} force - 是否强制更新（即使颜色相同），默认 false
 * @returns {Promise} 返回 Promise 对象
 */
const updateTheme = (primaryColor, silent = false, force = false) => {
  return new Promise((resolve, reject) => {
    if (!primaryColor) {
      reject(new Error('未提供主题颜色'))
      return
    }
    
    // 标准化颜色值，方便比较
    const normalizeColor = (color) => {
      if (!color) return null
      // 统一转换为小写并去除空格
      return color.toLowerCase().replace(/\s/g, '')
    }
    
    const normalizedNewColor = normalizeColor(primaryColor)
    const normalizedCurrentColor = normalizeColor(currentThemeColor)
    
    // 智能判断：如果颜色没有变化且不是强制更新，则静默跳过
    if (normalizedNewColor === normalizedCurrentColor && !force) {
      console.log('主题颜色未变化，跳过更新')
      resolve()
      return
    }
    
    // 只在颜色真正变化且非静默模式时显示提示
    let hideMessage = null
    if (!silent) {
      hideMessage = message.loading('加载主题...', 0)
    }
    
    function buildIt () {
      if (!window.less) {
        if (hideMessage) hideMessage()
        reject(new Error('Less.js 未加载'))
        return
      }
      setTimeout(() => {
        window.less
          .modifyVars({
            '@primary-color': primaryColor
          })
          .then(() => {
            // 更新成功后记录当前颜色
            currentThemeColor = primaryColor
            if (hideMessage) hideMessage()
            resolve()
          })
          .catch((e) => {
            console.error('主题更新失败:', e)
            if (hideMessage) hideMessage()
            // 只在非静默模式下显示错误提示
            if (!silent) {
              message.error('主题更新失败')
            }
            reject(e)
          })
      }, 200)
    }
    
    if (!lessNodesAppended) {
      // insert less.js and color.less
      const lessStyleNode = document.createElement('link')
      const lessConfigNode = document.createElement('script')
      const lessScriptNode = document.createElement('script')
      lessStyleNode.setAttribute('rel', 'stylesheet/less')
      lessStyleNode.setAttribute('href', '/static/less/Color.less')
      lessConfigNode.innerHTML = `
        window.less = {
          async: true,
          env: 'production',
          javascriptEnabled: true
        }
      `
      lessScriptNode.src = 'https://cdn.bootcss.com/less.js/3.9.0/less.min.js'
      lessScriptNode.async = true
      lessScriptNode.onload = () => {
        buildIt()
        lessScriptNode.onload = null
      }
      document.body.appendChild(lessStyleNode)
      document.body.appendChild(lessConfigNode)
      document.body.appendChild(lessScriptNode)
      lessNodesAppended = true
    } else {
      buildIt()
    }
  })
}

export { updateTheme }
