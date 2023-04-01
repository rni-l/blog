<!--
 * @Author: Lu
 * @Date: 2022-01-10 10:08:43
 * @LastEditTime: 2022-01-10 10:14:11
 * @LastEditors: Lu
 * @Description: 
-->
<template>
  <Layout class="home-layout">
  </Layout>
</template>

<script>
import Layout from '@vuepress/theme-default/lib/client/layouts/Layout.vue'

export default {
  components: {
    Layout,
  },
  created() {
    console.log('ok');
  }
}
</script>

<style lang="scss">
.home-layout {
  .theme-default-content {
    max-width: 1200px;
  }
}
</style>