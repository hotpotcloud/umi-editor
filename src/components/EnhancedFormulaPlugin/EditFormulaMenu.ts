/**
 * @description 编辑增强公式菜单
 */

import {
  DomEditor,
  genModalButtonElems,
  genModalTextareaElems,
  IDomEditor,
  IModalMenu,
  SlateNode,
  SlateRange,
  SlateTransforms,
} from '@wangeditor-next/editor'
import { nanoid } from 'nanoid'

const PENCIL_SVG = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor"><path d="M862.7 181.3c-20-20-47.1-31.3-75.4-31.3s-55.4 11.3-75.4 31.3L150.3 742.9c-1.5 1.5-2.4 3.5-2.4 5.7v128c0 4.4 3.6 8 8 8h128c2.1 0 4.2-.8 5.7-2.4L851.2 320.6c41.6-41.6 41.6-109.2 0-150.8l-11.5-11.5zM283.7 810.3H219v-64.7l476.2-476.2 64.7 64.7-476.2 476.2z"/></svg>`

interface EnhancedFormulaElement {
  type: 'enhanced-formula'
  value: string
  children: Array<{ text: '' }>
}

function genDomID(): string {
  return `w-e-edit-enhanced-formula-${nanoid()}`
}

class EditEnhancedFormulaMenu implements IModalMenu {
  readonly title = '编辑公式'
  readonly iconSvg = PENCIL_SVG
  readonly tag = 'button'
  readonly showModal = true
  readonly modalWidth = 300

  private $content: Element | null = null
  private readonly textareaId = genDomID()
  private readonly buttonId = genDomID()

  private getSelectedElem(editor: IDomEditor): EnhancedFormulaElement | null {
    const node = DomEditor.getSelectedNodeByType(editor, 'enhanced-formula')
    if (node == null) return null
    return node as EnhancedFormulaElement
  }

  getValue(editor: IDomEditor): string | boolean {
    const formulaElem = this.getSelectedElem(editor)
    if (formulaElem) {
      return formulaElem.value || ''
    }
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

    const formulaElem = this.getSelectedElem(editor)
    if (formulaElem == null) return true

    return false
  }

  getModalPositionNode(editor: IDomEditor): SlateNode | null {
    return this.getSelectedElem(editor)
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
          this.updateFormula(editor, value)
          editor.hidePanelOrModal()
        }
      })

      this.$content = container
    }

    const container = this.$content
    container.innerHTML = ''
    container.appendChild(textareaContainerElem)
    container.appendChild(buttonContainerElem)

    // 设置当前值
    const value = this.getValue(editor)
    const textarea = container.querySelector(`#${textareaId}`) as HTMLTextAreaElement
    if (textarea) {
      textarea.value = value as string
    }

    // 聚焦到 textarea
    setTimeout(() => {
      textarea?.focus()
    })

    return container
  }

  private updateFormula(editor: IDomEditor, value: string) {
    if (!value) return

    editor.restoreSelection()
    if (this.isDisabled(editor)) return

    const selectedElem = this.getSelectedElem(editor)
    if (selectedElem == null) return

    const path = DomEditor.findPath(editor, selectedElem)
    const props: Partial<EnhancedFormulaElement> = { value }

    SlateTransforms.setNodes(editor as any, props, { at: path })
  }
}

export default EditEnhancedFormulaMenu
