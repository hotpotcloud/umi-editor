/**
 * @description 解析 HTML 为元素
 */

import { IDomEditor, SlateDescendant, SlateElement } from '@wangeditor-next/editor'

interface EnhancedFormulaElement extends SlateElement {
  type: 'enhanced-formula'
  value: string
  children: Array<{ text: '' }>
}

function parseHtml(
  elem: Element,
  _children: SlateDescendant[],
  _editor: IDomEditor,
): SlateElement {
  const value = elem.getAttribute('data-value') || ''

  return {
    type: 'enhanced-formula',
    value,
    children: [{ text: '' }],
  } as any
}

const parseHtmlConf = {
  selector: 'span[data-w-e-type="enhanced-formula"]',
  parseElemHtml: parseHtml,
} as any

export default parseHtmlConf
