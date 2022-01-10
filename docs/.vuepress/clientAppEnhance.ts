/*
 * @Author: Lu
 * @Date: 2022-01-09 10:19:58
 * @LastEditTime: 2022-01-09 10:23:15
 * @LastEditors: Lu
 * @Description: 
 */
// @ts-ignore
const modules = import.meta.globEager('../components/**/*.vue')
import { defineClientAppEnhance } from '@vuepress/client'
const components = []

for (const path in modules) {
  components.push(modules[path].default)
}

export default defineClientAppEnhance(({ app, router, siteData }) => {
  components.forEach(component => {
    console.log(component)
    app.component(component.name, component)
  })
})