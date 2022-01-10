<!--
 * @Author: Lu
 * @Date: 2022-01-09 10:05:59
 * @LastEditTime: 2022-01-10 10:31:40
 * @LastEditors: Lu
 * @Description: 
-->
<template>
  <div class="kn-map">
    <mindmap
      class="kn-map-container"
      v-model="data"
      @click="handleClick"
      :drag="true"
      :zoom="true"
    ></mindmap>
  </div>
</template>

<script>
import mindmap from 'vue3-mindmap'
import 'vue3-mindmap/dist/style.css'
import { getMap, findLinkByName, maps } from './config'

export default {
  components: { mindmap },
  name: 'kn-map',
  data: () => ({
    data: getMap()
  }),

  methods: {
    handleClick(e, node) {
      if (e && e.target && e.target.__data__) {
        const name = e.target.__data__.name
        console.log(name);
        const link = findLinkByName(name, maps)
        console.log(link);
        if (link) this.$router.push(link)
      }
    }
  }
}
</script>

<style scoped>
.kn-map {
  width: 100%;
  height: 800px;
}
</style>