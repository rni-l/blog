<template>
  <div class="m-home">
    <div class="profile">
      <img src="/avatar.png" alt="" class="avatar">
      <div class="profile-item name">Rni-L</div>
      <div class="profile-item">Web 前端开发</div>
    </div>

    <div class="category">
      <div class="category-item"
        v-for="v in category" :key="v.path"
        @click="go(v)"
      >
        <img class="category-item-img" :src="v.icon" />
        <div class="category-item-name">{{ v.name }}</div>
      </div>
    </div>
    <footer><a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备17068856号-1</a></footer>
  </div>
</template>

<script lang="ts">
const Home = {
  name: 'HomeContent',

  data() {
    return {
      category: [
        { name: '文章', path: '/article', icon: '/home/article.png' },
        { name: '笔记', path: '/note', icon: '/home/note.png' },
        { name: '生活', path: '/life', icon: '/home/life.png' }
      ]
    }
  },

  methods: {
    go({ path }) {
      this.$router.push({ path })
    }
  }
}

export default Home

</script>

<style lang="scss" scoped>
.m-home {
  $b: rgba(#000, .2);
  .profile {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    .avatar {
      width: 150px;
      height: 150px;
      border-radius: 50%;
    }
    &-item {
      font-size: 24px;
      padding-bottom: 8px;
      &.name {
        font-size: 28px;
      }
    }
  }

  .category {
    display: flex;
    justify-content: space-between;
    max-width: 800px;
    padding: 24px;
    margin: 0 auto;
    &-item {
      height: 200px;
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 24px 48px;
      border: solid 1px $b;
      cursor: pointer;
      transition: all .3s linear;
      &:hover {
        transform: translateY(-20px);
        box-shadow: 0 0 10px 5px $b;
      }
      &-img {
        width: 150px;
        height: 150px;
        display: block;
      }
      &-name {
        font-size: 18px;
        text-align: center;
        padding-top: 12px;
      }
    }
  }
}
</style>
