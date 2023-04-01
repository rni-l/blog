import { defineClientConfig } from '@vuepress/client'
import Layout from '../components/CommonLayout.vue'

const modules = import.meta.globEager('../components/**/*.vue')
const components = []

for (const path in modules) {
  components.push(modules[path].default)
}
export default defineClientConfig({
  enhance({ app, router, siteData }) {
    components.forEach(component => {
      app.component(component.name, component)
    })
  },
  setup() {},
  rootComponents: [],
  // layouts: {
  //   Layout
  // }
})