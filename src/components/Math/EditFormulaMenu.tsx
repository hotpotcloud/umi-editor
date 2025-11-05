import { DomEditor, SlateRange, IDomEditor, SlateElement } from '@wangeditor-next/editor';
import MathLiveMenu from './MathLiveMenu';

interface FormulaElement extends SlateElement {
  type: 'formula';
  value: string;
}

// 自定义编辑公式菜单 - 使用MathLive（仅用于编辑现有公式）
class EditFormulaMenu {
  readonly title: string = 'MathLive编辑';
  readonly iconSvg: string = '<svg viewBox="0 0 1024 1024"><text x="50%" y="70%" font-size="800" text-anchor="middle">∑</text></svg>';
  readonly tag: string = 'button';

  // 获取当前选中的公式元素（使用官方API）
  private getSelectedElem(editor: IDomEditor): FormulaElement | null {
    const node = DomEditor.getSelectedNodeByType(editor, 'formula');
    if (node == null) return null;
    return node as FormulaElement;
  }

  // 获取公式值
  getValue(editor: IDomEditor): string | boolean {
    const formulaElem = this.getSelectedElem(editor);
    if (formulaElem) {
      return formulaElem.value || '';
    }
    return '';
  }

  // 不需要激活状态
  isActive(_editor: IDomEditor): boolean {
    return false;
  }

  // 只有在选中公式时才启用（参考官方逻辑）
  isDisabled(editor: IDomEditor): boolean {
    const { selection } = editor;

    // 没有选区时禁用
    if (selection == null) return true;

    // 选区非折叠时禁用（即有文本被选中）
    if (SlateRange.isExpanded(selection)) return true;

    // 未匹配到 formula node 则禁用
    const formulaElem = this.getSelectedElem(editor);
    if (formulaElem == null) return true;

    return false;
  }

  // 执行编辑（仅编辑模式）
  exec(editor: IDomEditor): void {
    console.log('=== MathLive编辑被点击 ===');

    const formulaElem = this.getSelectedElem(editor);

    if (!formulaElem) {
      console.error('未找到公式节点，无法编辑');
      return;
    }

    const value = formulaElem.value || '';
    console.log('找到公式节点，值为:', value);

    // 创建MathLiveMenu实例并调用编辑方法
    const menu = new MathLiveMenu();
    menu.editFormula(editor, value, formulaElem);
  }
}

export default EditFormulaMenu;
