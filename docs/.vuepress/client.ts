import { defineClientConfig } from '@vuepress/client'

const modules = import.meta.globEager('../components/**/*.vue')
const components = []
console.log(modules);
for (const path in modules) {
  console.log(path);
  components.push(modules[path].default)
}
export default defineClientConfig({
  enhance({ app, router, siteData }) {
    console.log('components', components);
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