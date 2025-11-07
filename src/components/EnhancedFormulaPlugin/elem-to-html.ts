/**
 * @description 元素转 HTML
 */

import { SlateElement } from '@wangeditor-next/editor'

interface EnhancedFormulaElement extends SlateElement {
  type: 'enhanced-formula'
  value: string
}

function enhancedFormulaToHtml(elem: SlateElement, _childrenHtml: string): string {
  const { value = '' } = elem as EnhancedFormulaElement
  return `<span data-w-e-type="enhanced-formula" data-w-e-is-void data-w-e-is-inline data-value="${value}"></span>`
}

const conf = {
  type: 'enhanced-formula',
  elemToHtml: enhancedFormulaToHtml,
}

export default conf
