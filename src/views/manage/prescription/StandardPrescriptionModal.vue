<template>
  <a-modal 
    v-model="visible" 
    title="选择标准处方" 
    width="1200px"
    :footer="null"
    @cancel="onCancel"
  >
    <!-- 搜索和筛选区域 -->
    <div class="search-section" style="margin-bottom: 20px;">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-input-search 
            v-model="searchKeyword" 
            placeholder="搜索适应症或关键词"
            @search="onSearch"
            allowClear
          />
        </a-col>
        <a-col :span="4">
          <a-select 
            v-model="filterIndication1" 
            placeholder="适应症分类" 
            allowClear
            @change="onFilterChange"
          >
            <a-select-option v-for="item in indication1Options" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select 
            v-model="filterIndication2" 
            placeholder="具体疾病" 
            allowClear
            @change="onFilterChange"
          >
            <a-select-option v-for="item in indication2Options" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-select 
            v-model="filterPresPart" 
            placeholder="治疗部位" 
            allowClear
            @change="onFilterChange"
          >
            <a-select-option v-for="item in presPartOptions" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-select 
            v-model="sortBy" 
            placeholder="排序方式" 
            @change="onSortChange"
          >
            <a-select-option value="standard_pres_id">默认排序</a-select-option>
            <a-select-option value="indication1">适应症分类</a-select-option>
            <a-select-option value="pres_part">治疗部位</a-select-option>
            <a-select-option value="evidence_level">证据等级</a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </div>

    <!-- 标准处方列表 -->
    <div class="prescription-grid" style="max-height: 500px; overflow-y: auto;">
      <!-- 加载状态 -->
      <div v-if="loading" style="text-align: center; padding: 40px;">
        <a-spin size="large" />
        <p style="margin-top: 16px; color: #666;">正在加载标准处方数据...</p>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="filteredStandardPrescriptions.length === 0" style="text-align: center; padding: 40px;">
        <a-empty description="暂无标准处方数据" />
      </div>
      
      <!-- 数据列表 -->
      <a-row v-else :gutter="16">
        <a-col 
          v-for="item in filteredStandardPrescriptions" 
          :key="item.standardPresId"
          :span="12"
          style="margin-bottom: 16px;"
        >
          <a-card 
            class="prescription-item"
            :class="{ 'selected': selectedStandardId === item.standardPresId }"
            @click="selectStandardPrescription(item)"
            hoverable
            size="small"
          >
            <div class="prescription-header">
              <h4 style="margin: 0 0 8px 0; color: #1890ff;">
                {{ item.indication1 }} - {{ item.indication2 }}
              </h4>
              <div style="margin-bottom: 8px;">
                <a-tag v-if="item.indication3" color="blue" size="small">{{ item.indication3 }}</a-tag>
                <a-tag v-if="item.builtIn === 1" color="green" size="small">系统内置</a-tag>
                <a-tag v-else color="orange" size="small">用户自定义</a-tag>
              </div>
            </div>
            
            <div class="prescription-content">
              <div class="indication-info" style="margin-bottom: 12px;">
                <p style="margin: 0; color: #666; font-size: 12px;">
                  <strong>适应症：</strong>{{ item.indication1 }} > {{ item.indication2 }}
                  <span v-if="item.indication3"> > {{ item.indication3 }}</span>
                </p>
                <p v-if="item.indication_keyword" style="margin: 4px 0 0 0; color: #999; font-size: 11px;">
                  <strong>关键词：</strong>{{ item.indication_keyword }}
                </p>
              </div>
              
              <div class="params-grid" style="margin-bottom: 12px;">
                <a-row :gutter="8">
                  <a-col :span="12">
                    <div class="param-item">
                      <label>刺激频率:</label>
                      <span>{{ item.presFreq }}Hz</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="param-item">
                      <label>持续时间:</label>
                      <span>{{ item.lastTime }}秒</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="param-item">
                      <label>脉冲数量:</label>
                      <span>{{ item.lastCount }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="param-item">
                      <label>间歇时间:</label>
                      <span>{{ item.pauseTime }}秒</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="param-item">
                      <label>重复次数:</label>
                      <span>{{ item.repeatCount }}</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="param-item">
                      <label>总时间:</label>
                      <span>{{ item.totalTime }}分钟</span>
                    </div>
                  </a-col>
                </a-row>
              </div>
              
              <div class="treatment-info" style="margin-bottom: 8px;">
                <a-tag color="purple" size="small">{{ item.presPart }}</a-tag>
              </div>
              
              <div class="evidence-info" style="font-size: 11px; color: #999;">
                <p v-if="item.evidenceLevel" style="margin: 0;">
                  <strong>证据等级：</strong>{{ item.evidenceLevel }}
                </p>
                <p v-if="item.provenance" style="margin: 4px 0 0 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  <strong>来源：</strong>{{ item.provenance }}
                </p>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 操作按钮 -->
    <div class="modal-footer" style="text-align: right; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e8e8e8;">
      <a-button @click="onCancel">取消</a-button>
      <a-button 
        type="primary" 
        @click="applySelectedStandardPrescription"
        :disabled="!selectedStandardId"
        style="margin-left: 8px;"
      >
        应用选中的标准处方
      </a-button>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'StandardPrescriptionModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchKeyword: '',
      filterIndication1: '',
      filterIndication2: '',
      filterPresPart: '',
      sortBy: 'standard_pres_id',
      selectedStandardId: null,
      selectedStandardPrescription: null,
      standardPrescriptions: [],
      loading: false,
      indication1Options: [],
      indication2Options: [],
      presPartOptions: []
    }
  },
  computed: {
    filteredStandardPrescriptions() {
      console.log('计算过滤后的标准处方，原始数据长度:', this.standardPrescriptions.length)
      
      let result = this.standardPrescriptions.filter(item => {
        // 搜索过滤
        if (this.searchKeyword) {
          const keyword = this.searchKeyword.toLowerCase()
          const searchText = `${item.indication1 || ''} ${item.indication2 || ''} ${item.indication3 || ''} ${item.indicationKeyword || ''} ${item.presPart || ''}`.toLowerCase()
          if (!searchText.includes(keyword)) return false
        }
        
        // 适应症分类过滤
        if (this.filterIndication1 && item.indication1 !== this.filterIndication1) return false
        
        // 具体疾病过滤
        if (this.filterIndication2 && item.indication2 !== this.filterIndication2) return false
        
        // 治疗部位过滤
        if (this.filterPresPart && item.presPart !== this.filterPresPart) return false
        
        return true
      })
      
      // 排序
      result.sort((a, b) => {
        if (this.sortBy === 'standard_pres_id') {
          return (a.standardPresId || 0) - (b.standardPresId || 0)
        } else if (this.sortBy === 'pres_part') {
          return (a.presPart || '').localeCompare(b.presPart || '')
        } else {
          return (a[this.sortBy] || '').localeCompare(b[this.sortBy] || '')
        }
      })
      
      console.log('过滤后的标准处方数量:', result.length)
      return result
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.loadStandardPrescriptions()
      }
    }
  },
  methods: {
    async loadStandardPrescriptions() {
      this.loading = true
      try {
        const res = await this.$get('/standard-prescription/list')
        console.log('标准处方API响应:', res) // 调试日志
        
        // 检查不同的数据结构
        if (res && Array.isArray(res)) {
          this.standardPrescriptions = res
        } else if (res && res.data && Array.isArray(res.data)) {
          this.standardPrescriptions = res.data
        } else if (res && res.result && Array.isArray(res.result)) {
          this.standardPrescriptions = res.result
        } else if (res && res.content && Array.isArray(res.content)) {
          this.standardPrescriptions = res.content
        } else if (res && res.data && res.data.data && Array.isArray(res.data.data)) {
          // 处理 {data: {code: 200, data: Array, message: 'success'}} 结构
          this.standardPrescriptions = res.data.data
        } else {
          console.error('标准处方数据格式异常:', res)
          this.$message.error('标准处方数据格式异常')
          this.standardPrescriptions = []
        }
        
        console.log('处理后的标准处方数据:', this.standardPrescriptions)
        this.extractFilterOptions()
      } catch (error) {
        console.error('加载标准处方失败:', error)
        this.$message.error('加载标准处方失败: ' + error.message)
        this.standardPrescriptions = []
      } finally {
        this.loading = false
      }
    },
    
    extractFilterOptions() {
      // 提取筛选选项
      const indication1Set = new Set()
      const indication2Set = new Set()
      const presPartSet = new Set()
      
      console.log('开始提取筛选选项，数据长度:', this.standardPrescriptions.length)
      
      this.standardPrescriptions.forEach((item, index) => {
        console.log(`处理第${index + 1}条数据:`, item)
        if (item.indication1) indication1Set.add(item.indication1)
        if (item.indication2) indication2Set.add(item.indication2)
        if (item.presPart) presPartSet.add(item.presPart)
      })
      
      this.indication1Options = Array.from(indication1Set).sort()
      this.indication2Options = Array.from(indication2Set).sort()
      this.presPartOptions = Array.from(presPartSet).sort()
      
      console.log('筛选选项提取完成:', {
        indication1: this.indication1Options,
        indication2: this.indication2Options,
        presPart: this.presPartOptions
      })
    },
    
    selectStandardPrescription(item) {
      this.selectedStandardId = item.standardPresId
      this.selectedStandardPrescription = item
    },
    
    applySelectedStandardPrescription() {
      if (!this.selectedStandardPrescription) {
        this.$message.warning('请先选择一个标准处方')
        return
      }
      
      // 发送选中的标准处方数据给父组件
      this.$emit('standardPrescriptionSelected', this.selectedStandardPrescription)
      this.onCancel()
    },
    
    onSearch() {
      // 搜索逻辑已在computed中处理
    },
    
    onFilterChange() {
      // 筛选逻辑已在computed中处理
    },
    
    onSortChange() {
      // 排序逻辑已在computed中处理
    },
    
    onCancel() {
      this.selectedStandardId = null
      this.selectedStandardPrescription = null
      this.searchKeyword = ''
      this.filterIndication1 = ''
      this.filterIndication2 = ''
      this.filterPresPart = ''
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>
.prescription-item {
  cursor: pointer;
  transition: all 0.3s;
}

.prescription-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.prescription-item.selected {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.param-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 12px;
}

.param-item label {
  color: #666;
  font-weight: 500;
}

.param-item span {
  color: #333;
  font-weight: 600;
}

.search-section .ant-select {
  width: 100%;
}
</style> 