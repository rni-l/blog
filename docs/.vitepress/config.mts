import { defineConfig } from 'vitepress'
import { generatePathTree, generateVuepressChildren } from './utils'
import { join, dirname } from 'path'
import { SearchPlugin } from "vitepress-plugin-search";

// @ts-ignore
const dir = __dirname
console.log('dir', dir);
const articlePaths = generatePathTree(join(dir, '../article'), '/article')
const notePaths = generatePathTree(join(dir, '../note'), '/note')
const lifePaths = generatePathTree(join(dir, '../life'), '/life')
console.log(generateVuepressChildren(notePaths));
// https://vitepress.dev/reference/site-config
export default async () => {
  process.env.VITE_EXTRA_EXTENSIONS = 'crx'
  return defineConfig({
    title: "Rni-L Blog",
    description: "Rni-L 的技术记录。",
    lang: 'zh-CN',
    markdown: { attrs: { disable: true } },
    head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
    ignoreDeadLinks: true,
  
  
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      logo: '/avatar.png',
      lastUpdated: true,
      nav: [
        {
          text: '主页',
          link: '/',
        },
  
        {
          text: '记录',
          link: '/note/index.html'
        },
        {
          text: '技术',
          link: '/article/index.html'
        },
        {
          text: '关于我',
          link: '/about.html',
        },
      ],
  
      sidebar: {
        '/article': generateVuepressChildren(articlePaths),
        '/note': generateVuepressChildren(notePaths),
        '/life': generateVuepressChildren(lifePaths),
      },
      // sidebar: generateSidebar({}),
  
      socialLinks: [
        { icon: 'github', link: 'https://github.com/rni-l' }
      ],
  
      search: {
        provider: 'local'
      },
  
      footer: {
        copyright: '<a href="https://beian.miit.gov.cn/" target="_blank" data-v-1d66672c="">粤ICP备17068856号-1</a>'
      }
    }
  })
}
