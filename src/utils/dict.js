export const hospitalDict = {
  1: "协和医院",
  2: "人民医院"
}

export const departmentDict = {
  1: "内科",
  2: "外科"
}

// 刺激部位字典
let stimulationSiteDict = {}
let stimulationSiteCategories = []

// 获取刺激部位字典
export const getStimulationSiteDict = () => stimulationSiteDict

// 获取刺激部位分类
export const getStimulationSiteCategories = () => stimulationSiteCategories

// 根据ID获取刺激部位名称
export const getStimulationSiteName = (siteId) => {
  return stimulationSiteDict[siteId] || '-'
}

// 根据ID获取刺激部位名称（别名，保持兼容性）
export const getPresPartName = (presPartId) => {
  return stimulationSiteDict[presPartId] || '-'
}

// 加载刺激部位数据
export const loadStimulationSiteData = async (httpClient) => {
  try {
    const res = await httpClient.$get('/stimulation-site/list')
    console.log('刺激部位API响应:', res)
    
    // 检查不同的数据结构
    let data = []
    if (res && Array.isArray(res)) {
      data = res
    } else if (res && res.data && Array.isArray(res.data)) {
      data = res.data
    } else if (res && res.data && res.data.data && Array.isArray(res.data.data)) {
      // 处理嵌套的data结构：response.data.data
      data = res.data.data
    } else if (res && res.result && Array.isArray(res.result)) {
      data = res.result
    } else if (res && res.content && Array.isArray(res.content)) {
      data = res.content
    }
    
    console.log('处理后的刺激部位数据:', data)
    
    if (data.length > 0) {
      stimulationSiteDict = {}
      const categorySet = new Set()
      
      data.forEach(site => {
        if (site.isActive === 1) {
          stimulationSiteDict[site.siteId] = site.siteName
          if (site.siteCategory) {
            categorySet.add(site.siteCategory)
          }
        }
      })
      
      stimulationSiteCategories = Array.from(categorySet).sort()
      console.log('刺激部位字典:', stimulationSiteDict)
    }
  } catch (error) {
    console.error('加载刺激部位数据失败:', error)
  }
}

// 获取刺激部位选项（用于下拉选择）
export const getStimulationSiteOptions = async (httpClient) => {
  try {
    const res = await httpClient.$get('/stimulation-site/list')
    console.log('获取刺激部位选项API响应:', res)
    
    // 检查不同的数据结构
    let data = []
    if (res && Array.isArray(res)) {
      data = res
    } else if (res && res.data && Array.isArray(res.data)) {
      data = res.data
    } else if (res && res.data && res.data.data && Array.isArray(res.data.data)) {
      // 处理嵌套的data结构：response.data.data
      data = res.data.data
    } else if (res && res.result && Array.isArray(res.result)) {
      data = res.result
    } else if (res && res.content && Array.isArray(res.content)) {
      data = res.content
    }
    
    console.log('处理后的刺激部位选项数据:', data)
    
    if (data.length > 0) {
      return data
        .filter(site => site.isActive === 1)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(site => ({
          value: site.siteId,
          label: site.siteName,
          category: site.siteCategory
        }))
    }
    return []
  } catch (error) {
    console.error('获取刺激部位选项失败:', error)
    return []
  }
}

// 获取刺激部位选项（按分类分组）
export const getStimulationSiteGroupedOptions = async (httpClient) => {
  try {
    const res = await httpClient.$get('/stimulation-site/list')
    console.log('获取刺激部位分组选项API响应:', res)
    
    // 检查不同的数据结构
    let data = []
    if (res && Array.isArray(res)) {
      data = res
    } else if (res && res.data && Array.isArray(res.data)) {
      data = res.data
    } else if (res && res.data && res.data.data && Array.isArray(res.data.data)) {
      // 处理嵌套的data结构：response.data.data
      data = res.data.data
    } else if (res && res.result && Array.isArray(res.result)) {
      data = res.result
    } else if (res && res.content && Array.isArray(res.content)) {
      data = res.content
    }
    
    console.log('处理后的刺激部位分组选项数据:', data)
    
    if (data.length > 0) {
      const grouped = {}
      data
        .filter(site => site.isActive === 1)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .forEach(site => {
          const category = site.siteCategory || '其他'
          if (!grouped[category]) {
            grouped[category] = []
          }
          grouped[category].push({
            value: site.siteId,
            label: site.siteName,
            category: site.siteCategory
          })
        })
      console.log('分组后的刺激部位选项:', grouped)
      return grouped
    }
    return {}
  } catch (error) {
    console.error('获取刺激部位分组选项失败:', error)
    return {}
  }
} 