/*
 * @Author: Lu
 * @Date: 2022-01-09 09:50:42
 * @LastEditTime: 2022-01-10 10:23:16
 * @LastEditors: Lu
 * @Description: 
 */
import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
import { generatePathTree, generateVuepressChildren } from './utils'
import { join, resolve } from 'path'

const articlePaths = generatePathTree(join(__dirname, '../record/article'), '/record/article')
const notePaths = generatePathTree(join(__dirname, '../record/note'), '/record/note')

export default defineUserConfig<DefaultThemeOptions>({
  // 站点配置
  lang: 'zh-cn',
  title: 'Blog',
  description: '记录',

  plugins: [
    [
      '@vuepress/plugin-search',
      {
        locales: {
          '/': {
            placeholder: '搜索',
          },
        },
      },
    ],
  ],

  // 主题和它的配置
  // theme: '@vuepress/theme-default',
  theme: resolve(__dirname, './theme.ts'),
  themeConfig: {
    logo: './avatar.png',
    navbar: [
      // NavbarItem
      {
        text: '首页',
        link: '/',
      },
      // NavbarGroup
      {
        text: '记录',
        link: '/record',
        children: [
          {
            text: '文章',
            link: '/record/article'
          },
          {
            text: '笔记',
            link: '/record/note'
          }
        ]
      },
      {
        text: '关于我',
        link: '/about',
      },
    ],
    sidebar: [
      // SidebarItem
      {
        text: '记录',
        link: '/record',
        children: [
          // SidebarItem
          {
            text: '文章',
            link: '/record/article',
            children: generateVuepressChildren(articlePaths),
          },
          {
            text: '笔记',
            link: '/record/note',
            children: generateVuepressChildren(notePaths),
          },
        ],
      },
    ],
  },
})