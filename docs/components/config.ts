/*
 * @Author: Lu
 * @Date: 2022-01-10 09:29:08
 * @LastEditTime: 2022-01-10 14:23:22
 * @LastEditors: Lu
 * @Description: 
 */

export type MapType = {
  name: string
  children?: MapType[]
  link?: string
  left?: boolean
}

export const getMap = (): MapType[] => [{
  name:"个人知识图谱",
  children: [
    {
      name: "计算机基础",
      left: true,
      children: [
        { name: "数据结构", link: '/note/base/数据结构.html' },
        { name: "算法", link: '/note/base/算法题.html' },
        { name: "设计模式" },
        { name: "计算机网络" },
        { name: "操作系统" },
      ],
    },
    {
      name: "JavaScript 体系",
      children: [
        {
          name: "JavaScript 基础",
          children: [
            { name: "作用域" },
            { name: "原型" },
            { name: "闭包" },
            { name: "EventLoop" },
            { name: "异步" },
            { name: "正则" },
            { name: "Ajax" },
            { name: "位运算", link: '/note/frontend/位运算.html' },
          ]
        },
        {
          name: "TypeScript",
          children: [
            { name: "什么是 TypeScript？" },
            { name: "泛型" },
            { name: "tsconfig.json 配置" },
          ]
        },
        {
          name: "前端",
          children: [
            {
              name: "框架/其他",
              children: [
                {
                  name: "Vue",
                  children: [
                    {
                      name: "Vue2",
                      children: [
                        {
                          name: "Vue2 原理"
                        }
                      ]
                    },
                    {
                      name: "Vue3",
                      children: [
                        {
                          name: "Vue3 原理"
                        },
                        {
                          name: "Vue3 和 Vue2 的区别"
                        }
                      ]
                    }
                  ]
                },
                { name: "React" },
                { name: "微信小程序" },
                { name: "Chrome 插件" },
                { name: "微信小程序" },
                {
                  name: "混合开发",
                  children: [
                    {
                      name: 'JSBridge'
                    }
                  ]
                },
              ]
            },
            {
              name: "CSS",
              children: [
                { name: "CSS/CSS3" },
                { name: "Scss/Sass/Less" },
                { name: "动画" },
                { name: "Svg" },
              ]
            },
            {
              name: "Canvas",
              children: [
                { name: "概念" },
                { name: "fabricjs 库使用", link: "/note/frontend/fabricjs的学习使用.hmtl" },
              ]
            },
            {
              name: "性能优化",
              children: [
                { name: "浏览器渲染逻辑" },
                { name: "资源优化" },
              ]
            },
            {
              name: "工具",
              children: [
                { name: "Eslint" },
                { name: "CommitLint" },
              ]
            },
          ]
        },
        {
          name: "后端",
          children: [
            {
              name: "NodeJS",
              children: [
                { name: "基础" },
                { name: "性能、内存" },
                { name: "Debug" },
                { name: "Npm" },
                { name: "开发一个工具库", link: "/article/批量管理 package.json 项目.html" },
              ]
            },
            {
              name: "框架",
              children: [
                { name: "Express&Koa2" },
                { name: "NestJS" },
                { name: "EggJS" },
              ]
            },
            {
              name: "数据库",
              children: [
                { name: "Mysql" },
                { name: "Mongodb" },
                { name: "Sequelize" },
              ]
            },
          ]
        },
        {
          name: "Electron",
          children: [
            {
              name: "原理",
            },
            {
              name: "跨域处理",
            },
            {
              name: "更新/构建",
            }
          ]
        },
        {
          name: "构建工具/工程化相关",
          children: [
            { name: "Webpack" },
            {
              name: "Vite",
              children: [
                { name: "原理/概念", link: "" },
                { name: "遇到的问题", link: "" }
              ]
            },
            {
              name: "Babel",
              children: [
                { name: "原理/概念", link: "/note/frontend/babel.html" },
                { name: "遇到的问题", link: "" },
                { name: "开发一个 Babel 插件", link: "" }
              ]
            },
            {
              name: "Monorepo",
              children: [
                { name: "Lerna", link: "/note/frontend/lerna.html" },
                { name: "多个独立包模式", link: "/note/frontend/lerna.html" },
                { name: "Lerna vs Turborepor vs Nx", link: "/note/frontend/lerna.html" }
              ]
            },
            { name: "项目工程化设计" },
          ]
        },
        {
          name: "测试",
          children: [
            { name: "测试概念", link: "/note/base/单元测试.html" },
            {
              name: "单元测试",
              children: [
                {
                  name: 'Jest'
                },
                {
                  name: 'Vue 组件测试'
                }
              ]
            },
            {
              name: "集成测试",
              children: [
                {
                  name: "Cypress"
                }
              ]
            },
          ]
        },
        {
          name: "安全",
          children: [
            {
              name: "前端安全",
              children: [
                { name: 'Cookie' }
              ]
            },
            { name: "后端安全" },
            { name: "数据库安全" },
          ]
        },
      ]
    },
    {
      name: "服务端/工具",
      left: true,
      children: [
        {
          name: 'Git',
          children: [
            { name: '常用命令' },
            { name: 'git hook' },
            { name: '遇到的问题' },
          ]
        },
        {
          name: 'Nginx',
          children: [
            { name: '常用配置' },
            { name: '遇到的问题' },
          ]
        },
        {
          name: 'Docker',
          children: [
            { name: '原理' },
            { name: '常用命令' }
          ]
        },
        {
          name: 'Linux',
          children: [
            {
              name: '常用命令', link: '/note/command_and_serve/linux指令.html'
            },
            {
              name: 'Vim', link: '/note/command_and_serve/vim.html'
            },
            {
              name: '编写脚本', link: '/note/command_and_serve/vim.html'
            }
          ]
        }
      ]
    },
    {
      name: "软技能",
      left: true,
      children: [
        {
          name: '英语',
        },
        {
          name: '知识储备',
        },
        {
          name: '项目管理',
        },
        {
          name: '画图',
          children: [
            {
              name: '工具',
              children: [
                { name: 'draw.io' },
                { name: 'miro' },
              ]
            },
            {
              name: '图类型',
              children: [
                { name: 'ER 图' },
                { name: '流程图' },
                { name: '数据流程图' },
                { name: '架构图' },
                { name: '用户故事' },
              ]
            }
          ]
        },
        {
          name: '文档工具',
          children: [
            { name: 'vuepress' },
            { name: 'storybook' }
          ]
        }
      ]
    },
    {
      name: "Ios 体系",
      left: true,
      children: [
        {
          name: 'Swift',
          children: [
            { name: '常见问题', link: '/note/ios/swift/常见问题.html' },
            {
              name: 'SwiftUI',
              children: [
                { name: '常见问题', link: '/note/ios/swift/swiftui/常见问题.html' },
                { name: '总结', link: '/note/ios/swift/swiftui/总结.html' }
              ]
            },
            {
              name: 'uikit',
              children: [
                { name: '布局排版实现方式', link: '/note/ios/swift/uikit/布局排版实现方式.html' },
                { name: '实现的功能', link: '/note/ios/swift/uikit/实现的功能.html' },
              ]
            },
          ]
        },
      ]
    },
    {
      name: '面试',
      left: true,
      children: [
        {
          name: 'JS 工具库实现原理',
          children: []
        },
        {
          name: '算法题',
          children: []
        },
        {
          name: '如何写简历',
          children: []
        },
        {
          name: '如何发起问题',
          children: []
        },
      ]
    },
  ]
}]

export const maps = getMap()

export const findLinkByName = (name: string, list: MapType[]) => {
  let output = ''
  list.find(v => {
    if (v.name === name) {
      output = v.link
      return true
    } else if (v.children && v.children.length) {
      output = findLinkByName(name, v.children)
      if (output) return true
    }
    return false
  })
  return output
}
