/**
 * @description 渲染增强公式元素
 */

import { DomEditor, IDomEditor, SlateElement } from '@wangeditor-next/editor'
import { h, VNode } from 'snabbdom'

interface EnhancedFormulaElement extends SlateElement {
  type: 'enhanced-formula'
  value: string
  children: Array<{ text: '' }>
}

function renderEnhancedFormula(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  const selected = DomEditor.isNodeSelected(editor, elem)
  const { value = '' } = elem as EnhancedFormulaElement
  
  const formulaVnode = h(
    'enhanced-formula-card',
    {
      dataset: { value },
    },
    null,
  )

  const containerVnode = h(
    'div',
    {
      className: 'w-e-textarea-enhanced-formula-container',
      props: {
        contentEditable: false,
      },
      style: {
        display: 'inline-block',
        marginLeft: '3px',
        marginRight: '3px',
        border: selected
          ? '2px solid var(--w-e-textarea-selected-border-color)'
          : '2px solid transparent',
        borderRadius: '3px',
        padding: '3px 3px',
      },
    },
    [formulaVnode],
  )

  return containerVnode
}

const conf = {
  type: 'enhanced-formula',
  renderElem: renderEnhancedFormula,
}

export default conf
