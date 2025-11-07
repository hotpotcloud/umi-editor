/**
 * @description 增强公式插件 - 完全按照官方方式
 */

import { DomEditor, IDomEditor } from '@wangeditor-next/editor'

function withEnhancedFormula<T extends IDomEditor>(editor: T): T {
  const { isInline, isVoid } = editor as any
  const newEditor = editor

  // 重写 isInline
  ;(newEditor as any).isInline = (elem: any) => {
    const type = DomEditor.getNodeType(elem)

    if (type === 'enhanced-formula') {
      return true
    }

    return isInline(elem)
  }

  // 重写 isVoid
  ;(newEditor as any).isVoid = (elem: any) => {
    const type = DomEditor.getNodeType(elem)

    if (type === 'enhanced-formula') {
      return true
    }

    return isVoid(elem)
  }

  return newEditor
}

export default withEnhancedFormula
