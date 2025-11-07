/**
 * @description 插入增强公式菜单
 */

import {
  DomEditor,
  genModalButtonElems,
  genModalTextareaElems,
  IDomEditor,
  IModalMenu,
  SlateNode,
  SlateRange,
} from '@wangeditor-next/editor'
import { nanoid } from 'nanoid'

const SIGMA_SVG = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor"><path d="M878.08 192H241.92c-17.664 0-32 14.336-32 32s14.336 32 32 32h636.16c17.664 0 32-14.336 32-32s-14.336-32-32-32zM878.08 768H241.92c-17.664 0-32 14.336-32 32s14.336 32 32 32h636.16c17.664 0 32-14.336 32-32s-14.336-32-32-32zM560 384c-17.664 0-32 14.336-32 32v192c0 17.664 14.336 32 32 32s32-14.336 32-32V416c0-17.664-14.336-32-32-32z"/></svg>`

interface EnhancedFormulaElement {
  type: 'enhanced-formula'
  value: string
  children: Array<{ text: '' }>
}

function genDomID(): string {
  return `w-e-insert-enhanced-formula-${nanoid()}`
}

class InsertEnhancedFormulaMenu implements IModalMenu {
  readonly title = '插入公式'
  readonly iconSvg = SIGMA_SVG
  readonly tag = 'button'
  readonly showModal = true
  readonly modalWidth = 300

  private $content: Element | null = null
  private readonly textareaId = genDomID()
  private readonly buttonId = genDomID()

  getValue(_editor: IDomEditor): string | boolean {
    return ''
  }

  isActive(_editor: IDomEditor): boolean {
    return false
  }

  exec(_editor: IDomEditor, _value: string | boolean) {
    // 点击菜单时，弹出 modal 之前，不需要执行其他代码
  }

  isDisabled(editor: IDomEditor): boolean {
    const { selection } = editor as any
    if (selection == null) return true
    if (SlateRange.isExpanded(selection)) return true

    const selectedElems = DomEditor.getSelectedElems(editor)
    const hasVoidElem = selectedElems.some(elem => (editor as any).isVoid(elem))
    if (hasVoidElem) return true

    const hasPreElem = selectedElems.some(elem => DomEditor.getNodeType(elem) === 'pre')
    if (hasPreElem) return true

    return false
  }

  getModalPositionNode(_editor: IDomEditor): SlateNode | null {
    return null
  }

  getModalContentElem(editor: IDomEditor): Element {
    const { textareaId, buttonId } = this

    const [textareaContainerElem, textareaElem] = genModalTextareaElems(
      '公式',
      textareaId,
      '输入 LaTeX 公式（不需要 $ 符号）',
    )
    const [buttonContainerElem] = genModalButtonElems(buttonId, '确定')

    if (this.$content == null) {
      const container = document.createElement('div')
      
      // 绑定按钮点击事件
      container.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        if (target.id === buttonId) {
          e.preventDefault()
          const textarea = container.querySelector(`#${textareaId}`) as HTMLTextAreaElement
          const value = textarea?.value?.trim() || ''
          this.insertFormula(editor, value)
          editor.hidePanelOrModal()
        }
      })

      this.$content = container
    }

    const container = this.$content
    container.innerHTML = ''
    container.appendChild(textareaContainerElem)
    container.appendChild(buttonContainerElem)

    // 聚焦到 textarea
    setTimeout(() => {
      const textarea = container.querySelector(`#${textareaId}`) as HTMLTextAreaElement
      textarea?.focus()
    })

    return container
  }

  private insertFormula(editor: IDomEditor, value: string) {
    if (!value) return

    editor.restoreSelection()
    if (this.isDisabled(editor)) return

    const formulaElem: EnhancedFormulaElement = {
      type: 'enhanced-formula',
      value,
      children: [{ text: '' }],
    }

    ;(editor as any).insertNode(formulaElem)
  }
}

export default InsertEnhancedFormulaMenu
