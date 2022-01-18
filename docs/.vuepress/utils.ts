/*
 * @Author: Lu
 * @Date: 2022-01-09 10:49:27
 * @LastEditTime: 2022-01-09 11:08:06
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
    link: v.relativePath,
    text: v.name,
    children: v.isDirectory ? generateVuepressChildren(v.children ?? []) : undefined
  }))
}
