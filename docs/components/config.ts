/*
 * @Author: Lu
 * @Date: 2022-01-10 09:29:08
 * @LastEditTime: 2022-01-10 10:30:57
 * @LastEditors: Lu
 * @Description: 
 */

export type MapType = {
  name: string
  children?: MapType[]
  link?: string
}

export const getMap = (): MapType[] => [{
  name:"个人知识图谱",
  children: [
    {
      name: "计算机基础",
      children: [
        { name: "数据结构", link: '/record/note/base/数据结构.html' },
        { name: "算法", link: '/record/note/base/算法题.html' },
        { name: "计算机网络" },
        { name: "操作系统" },
      ]
    },
    {
      name: "JavaScript",
      children: [
        { name: "HTML & CSS" },
        { name: "JavaScript" },
      ]
    },
    {
      name: "TypeScript",
      children: [
        { name: "HTML & CSS" },
        { name: "JavaScript" },
      ]
    },
    {
      name: "前端工具",
      children: [
        { name: "HTML & CSS" },
        { name: "JavaScript" },
      ]
    },
    {
      name: "CSS",
      children: [
        { name: "HTML & CSS" },
        { name: "JavaScript" },
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
