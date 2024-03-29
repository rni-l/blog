/*
 * @Author: Lu
 * @Date: 2022-01-09 09:50:42
 * @LastEditTime: 2022-01-10 10:23:16
 * @LastEditors: Lu
 * @Description: 
 */
import { defineUserConfig, HeadConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
import { generatePathTree, generateVuepressChildren } from './utils'
import { join, resolve } from 'path'
import { baidu } from '../../local.config'
import { searchPlugin } from '@vuepress/plugin-search'
import { defaultTheme } from '@vuepress/theme-default'
import * as path from 'path'


const articlePaths = generatePathTree(join(__dirname, '../article'), '/article')
const notePaths = generatePathTree(join(__dirname, '../note'), '/note')
const lifePaths = generatePathTree(join(__dirname, '../life'), '/life')

export default defineUserConfig({
  // 站点配置
  lang: 'zh-cn',
  title: '个人记录...',
  description: '记录',

  plugins: [
    searchPlugin
  ],

  markdown: {
    toc: {
      level: [2,3,4],
      shouldAllowNested: true
    }
  },

  head: [
    baidu?.()
  ].filter(v => v) as HeadConfig[],

  theme: defaultTheme({
    logo: './avatar.png',
    lastUpdated: true,
    contributors: false,
    navbar: [
      {
        text: '主页',
        link: '/',
      },
      {
        text: '技术',
        link: '/article'
      },
      {
        text: '笔记',
        link: '/note'
      },{
        text: '生活',
        link: '/life'
      },
      {
        text: '关于我',
        link: '/about',
      },
    ],
    sidebar: {
      '/article': generateVuepressChildren(articlePaths),
      '/note': generateVuepressChildren(notePaths),
      '/life': generateVuepressChildren(lifePaths),
    }
  })
})