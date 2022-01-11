<!--
 * @Author: Lu
 * @Date: 2022-01-09 10:05:59
 * @LastEditTime: 2022-01-10 10:31:40
 * @LastEditors: Lu
 * @Description: 
-->
<template>
  <div class="kn-map">
    <!-- <mindmap
      class="kn-map-container"
      v-model="data"
      @click="handleClick"
      :drag="true"
      :zoom="true"
    ></mindmap> -->
    <el-tree
      :data="data"
      :props="defaultProps"
      :default-expand-all="true"
      @node-click="handleNodeClick" />
  </div>
</template>

<script lang="ts">
// import mindmap from 'vue3-mindmap'
// import 'vue3-mindmap/dist/style.css'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { ElTree } from 'element-plus'
import 'element-plus/dist/index.css'
import { getMap, findLinkByName, maps } from './config'

export default defineComponent({
  components: { ElTree },

  name: 'kn-map',
  
  setup() {
    const router = useRouter()
    const handleNodeClick = ({ link }) => {
      if (link) router.push(link)
    }
    const defaultProps = {
      children: 'children',
      label: 'name',
    }
    return {
      handleNodeClick,
      defaultProps,
      data: getMap()
    }
  }
})
</script>

<style scoped>
.kn-map {
  width: 100%;
  height: 800px;
}
</style>