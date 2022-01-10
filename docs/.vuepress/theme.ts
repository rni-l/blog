/*
 * @Author: Lu
 * @Date: 2022-01-10 10:07:43
 * @LastEditTime: 2022-01-10 10:11:24
 * @LastEditors: Lu
 * @Description: 
 */
import type { ThemeObject } from '@vuepress/core'
import * as path from 'path'

const fooTheme: ThemeObject = {
  // 你的主题
  name: 'vuepress-theme-foo',
  // 要继承的父主题
  extends: '@vuepress/theme-default',
  // 覆盖父主题的布局
  layouts: {
    HomeLayout: path.resolve(__dirname, '../components/HomeLayout.vue'),
  },
}

export default fooTheme