/*
 * @Author: Lu
 * @Date: 2024-04-17 23:30:45
 * @LastEditTime: 2024-04-18 10:23:08
 * @LastEditors: Lu
 * @Description: 
 */
import { join } from 'path'
import { readdirSync, statSync } from 'fs'

export type GeneratePathTree = {
  name: string
  absolutePath: string
  relativePath: string
  children?: GeneratePathTree[]
  isDirectory: boolean
}

export const generatePathTree = (targetRootPath: string, relativePath: string = '') => {
  // // @ts-ignore
  // const modules = import.meta.globEager(join(targetRootPath, '**/*.md'))
  // console.log(modules);
  const res = readdirSync(targetRootPath, { encoding: 'utf-8' })
  return res.reduce((acc: GeneratePathTree[], v) => {
    const curPath = `${targetRootPath}/${v}`
    // const curRelativePath = `${relativePath}/${v.replace('md', 'html')}`
    const curRelativePath = `${relativePath}/${v}`
    // 判断是否文件夹
    const statVal = statSync(curPath)
    if (statVal.isDirectory()) {
      const children = generatePathTree(curPath, curRelativePath)
      if (children.length) {
        acc.push({
          name: v,
          relativePath: curRelativePath,
          absolutePath: curPath,
          isDirectory: true,
          children
        })
      }
    } else if (v.includes('.md')) {
      acc.push({
        name: v,
        absolutePath: curPath,
        relativePath: curRelativePath,
        isDirectory: false
      })
    }
    return acc
  }, [])
}

export const generateVuepressChildren = (tree: GeneratePathTree[]) => {
  return tree.map(v => ({
    link: v.isDirectory ? undefined : v.relativePath,
    text: v.name,
    items: v.isDirectory ? generateVuepressChildren(v.children ?? []) : undefined
  }))
}
