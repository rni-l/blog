<template>
  <div class="content-list"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useSiteData } from '@vuepress/client'

const ContentList = defineComponent({
  name: 'ContentList',

  setup(props) {
    const data = useSiteData()
    console.log(data);
  }
})

export default ContentList

</script>

<style lang="scss" scoped>
.content-list {}
</style>
