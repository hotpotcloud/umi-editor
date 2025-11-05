import "mathlive/static.css";
import { MathfieldElement } from "mathlive";
import {
  DomEditor,
  SlateTransforms,
  IDomEditor,
  SlateElement,
} from "@wangeditor-next/editor";

interface ModalOptions {
  mode?: "insert" | "edit";
  title?: string;
  okText?: string;
}

interface FormulaElement extends SlateElement {
  type: "formula";
  value: string;
}

class MathLiveMenu {
  readonly title: string = "数学公式";
  readonly iconSvg: string =
    '<svg viewBox="0 0 1024 1024"><text x="50%" y="70%" font-size="800" text-anchor="middle">∑</text></svg>';
  readonly tag: string = "button";

  private editor: IDomEditor | null = null;
  private mathField: MathfieldElement | null = null;
  private modal: HTMLDivElement | null = null;
  private savedSelection: any = null;
  private editingFormulaElem: FormulaElement | null = null;
  private isEditing: boolean = false;

  // 编辑现有公式（接收公式元素）
  editFormula(
    editor: IDomEditor,
    latexValue: string,
    formulaElem: FormulaElement
  ): void {
    console.log("编辑公式:", latexValue);
    this.editor = editor;
    this.isEditing = true;
    this.editingFormulaElem = formulaElem;
    this.showModal(latexValue, {
      mode: "edit",
      title: "编辑数学公式",
      okText: "更新",
    });
  }

  // 创建模态框
  private createModal(options: ModalOptions = {}): HTMLDivElement {
    const { title = "插入数学公式", okText = "确定" } = options;

    const modalOverlay = document.createElement("div");
    modalOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    `;

    const modalContent = document.createElement("div");
    modalContent.style.cssText = `
      background: white;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      width: 520px;
      max-width: 90vw;
      max-height: 90vh;
      overflow: visible;
      pointer-events: auto;
    `;

    const modalHeader = document.createElement("div");
    modalHeader.style.cssText = `
      padding: 16px 24px;
      border-bottom: 1px solid #f0f0f0;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    modalHeader.innerHTML = `
      <span>${title}</span>
      <button id="closeBtn" style="border: none; background: none; font-size: 18px; cursor: pointer; padding: 4px;">×</button>
    `;

    const modalBody = document.createElement("div");
    modalBody.style.cssText = `
      padding: 24px;
    `;

    const mathContainer = document.createElement("div");
    mathContainer.style.cssText = `
      min-height: 120px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      padding: 8px;
      margin-bottom: 16px;
      position: relative;
    `;

    const tipText = document.createElement("div");
    tipText.style.cssText = `
      font-size: 12px;
      color: #666;
      margin-bottom: 16px;
    `;
    tipText.textContent =
      "提示：可以直接输入LaTeX代码，如 x^2, \\frac{a}{b}, \\sqrt{x}。点击键盘图标可使用虚拟键盘和颜色选择";

    const modalFooter = document.createElement("div");
    modalFooter.style.cssText = `
      padding: 10px 16px;
      border-top: 1px solid #f0f0f0;
      text-align: right;
    `;
    modalFooter.innerHTML = `
      <button id="cancelBtn" style="margin-right: 8px; padding: 4px 15px; border: 1px solid #d9d9d9; background: white; border-radius: 4px; cursor: pointer;">取消</button>
      <button id="okBtn" style="padding: 4px 15px; border: 1px solid #1890ff; background: #1890ff; color: white; border-radius: 4px; cursor: pointer;">${okText}</button>
    `;

    // 组装模态框
    modalBody.appendChild(mathContainer);
    modalBody.appendChild(tipText);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modalOverlay.appendChild(modalContent);

    // 创建 MathLive 输入框
    this.mathField = new MathfieldElement();
    this.mathField.style.cssText = `
      width: 100%;
      min-height: 100px;
      border: none;
      outline: none;
      font-size: 16px;
    `;
    mathContainer.appendChild(this.mathField);

    // 绑定事件
    const closeBtn = modalHeader.querySelector(
      "#closeBtn"
    ) as HTMLButtonElement;
    const cancelBtn = modalFooter.querySelector(
      "#cancelBtn"
    ) as HTMLButtonElement;
    const okBtn = modalFooter.querySelector("#okBtn") as HTMLButtonElement;

    if (closeBtn) closeBtn.onclick = () => this.hideModal();
    if (cancelBtn) cancelBtn.onclick = () => this.hideModal();
    if (okBtn) okBtn.onclick = () => this.insertFormula();

    // ESC键关闭
    document.addEventListener("keydown", this.handleKeyDown);

    this.modal = modalOverlay;
    return modalOverlay;
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      this.hideModal();
    }
  };

  // 显示模态框
  private showModal(
    initialValue: string = "",
    options: ModalOptions = {}
  ): void {
    if (this.modal) {
      this.hideModal();
    }

    const modal = this.createModal(options);
    document.body.appendChild(modal);

    // 设置初始值并聚焦
    setTimeout(() => {
      if (this.mathField) {
        if (initialValue) {
          this.mathField.value = initialValue;
        }
        this.mathField.focus();
        console.log("MathField已聚焦，初始值:", initialValue);
      }
    }, 200);
  }

  // 隐藏模态框
  private hideModal(): void {
    if (this.modal) {
      document.removeEventListener("keydown", this.handleKeyDown);
      document.body.removeChild(this.modal);
      this.modal = null;
      this.mathField = null;
    }
  }

  // 插入或更新公式
  private insertFormula(): void {
    const mode = this.isEditing ? "编辑" : "插入";
    console.log(`=== 开始${mode}公式 ===`);
    console.log("编辑模式:", this.isEditing);

    if (!this.mathField || !this.mathField.value || !this.editor) {
      console.error("缺少必要条件");
      this.hideModal();
      this.isEditing = false;
      return;
    }

    // 获取包含颜色和样式的完整 LaTeX
    // getValue('latex-expanded') 会包含 \textcolor 等命令
    const latexValue =
      this.mathField.getValue("latex-expanded") || this.mathField.value;
    console.log("LaTeX值:", latexValue);
    console.log("原始value:", this.mathField.value);

    // 先隐藏模态框
    this.hideModal();

    // 延迟执行插入
    setTimeout(() => {
      if (!this.editor) return;

      try {
        // 恢复编辑器焦点
        this.editor.focus();
        console.log("编辑器已重新获得焦点");

        // 如果是编辑模式，使用官方API更新节点
        if (this.isEditing && this.editingFormulaElem) {
          try {
            // 还原选区
            this.editor.restoreSelection();

            // 获取节点路径
            const path = DomEditor.findPath(
              this.editor,
              this.editingFormulaElem
            );

            // 更新节点属性
            const props: Partial<FormulaElement> = { value: latexValue };
            SlateTransforms.setNodes(this.editor as any, props, { at: path });

            console.log("✅ 公式更新成功");
          } catch (error) {
            console.error("更新公式失败:", error);
          }
        } else {
          // 插入模式：恢复选择状态
          if (this.savedSelection) {
            try {
              // 使用 restoreSelection 恢复选区
              this.editor.restoreSelection();
              console.log("选择状态已恢复");
            } catch (error) {
              console.warn("恢复选择状态失败:", error);
            }
          }

          // 插入新的公式节点
          try {
            const formulaNode: FormulaElement = {
              type: "formula",
              value: latexValue,
              children: [{ text: "" }],
            };
            this.editor.insertNode(formulaNode);
            console.log("✅ 公式插入成功");
          } catch (error1) {
            console.warn("insertNode失败:", error1);

            // 备用方法：插入HTML
            try {
              const mathHtml = `<span data-w-e-type="formula" data-w-e-is-void data-value="${latexValue}"></span>`;
              this.editor.dangerouslyInsertHtml(mathHtml);
              console.log("✅ 备用方法成功");
            } catch (error2) {
              console.warn("备用方法失败:", error2);
            }
          }
        }
      } catch (error) {
        console.error("❌ 操作失败:", error);
      } finally {
        // 重置编辑模式
        this.isEditing = false;
        this.editingFormulaElem = null;
      }
    }, 100);
  }

  // 菜单点击事件
  exec(editor: IDomEditor): void {
    console.log("=== exec被调用 ===");
    this.editor = editor;

    // 保存当前的选择状态
    try {
      this.savedSelection = editor.selection;
      console.log("保存选择状态");
    } catch (error) {
      console.warn("无法保存选择状态:", error);
      this.savedSelection = null;
    }

    this.showModal();
  }

  // 其他必要方法
  isActive(): boolean {
    return false;
  }

  isDisabled(): boolean {
    return false;
  }

  getValue(): string {
    return "";
  }
}

export default MathLiveMenu;
