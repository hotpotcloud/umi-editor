import 'mathlive/static.css';
import { MathfieldElement } from 'mathlive';

class MathLiveMenu {
    constructor() {
        this.title = '数学公式';
        this.iconSvg = '<svg viewBox="0 0 1024 1024"><text x="50%" y="70%" font-size="800" text-anchor="middle">∑</text></svg>';
        this.tag = 'button';
        this.editor = null;
        this.mathField = null;
        this.modal = null;
    }

    // 绑定编辑器实例
    bindEditor(editor) {
        this.editor = editor;
    }

    // 创建模态框
    createModal() {
        // 创建模态框容器
        const modalOverlay = document.createElement('div');
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
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            width: 520px;
            max-width: 90vw;
            max-height: 90vh;
            overflow: hidden;
        `;

        const modalHeader = document.createElement('div');
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
            <span>插入数学公式</span>
            <button id="closeBtn" style="border: none; background: none; font-size: 18px; cursor: pointer; padding: 4px;">×</button>
        `;

        const modalBody = document.createElement('div');
        modalBody.style.cssText = `
            padding: 24px;
        `;

        const mathContainer = document.createElement('div');
        mathContainer.style.cssText = `
            min-height: 120px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 16px;
        `;

        const tipText = document.createElement('div');
        tipText.style.cssText = `
            font-size: 12px;
            color: #666;
            margin-bottom: 16px;
        `;
        tipText.textContent = '提示：可以直接输入LaTeX代码，如 x^2, \\frac{a}{b}, \\sqrt{x}';

        const modalFooter = document.createElement('div');
        modalFooter.style.cssText = `
            padding: 10px 16px;
            border-top: 1px solid #f0f0f0;
            text-align: right;
        `;
        modalFooter.innerHTML = `
            <button id="cancelBtn" style="margin-right: 8px; padding: 4px 15px; border: 1px solid #d9d9d9; background: white; border-radius: 4px; cursor: pointer;">取消</button>
            <button id="okBtn" style="padding: 4px 15px; border: 1px solid #1890ff; background: #1890ff; color: white; border-radius: 4px; cursor: pointer;">确定</button>
        `;

        // 组装模态框
        modalBody.appendChild(mathContainer);
        modalBody.appendChild(tipText);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modalOverlay.appendChild(modalContent);

        // 创建 MathLive 输入框
        this.mathField = new MathfieldElement({
            virtualKeyboardMode: 'off',
        });
        this.mathField.placeholder = '输入 LaTeX 公式（例如：x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}）';
        this.mathField.style.cssText = `
            width: 100%;
            min-height: 100px;
            border: none;
            outline: none;
            font-size: 16px;
        `;
        mathContainer.appendChild(this.mathField);

        // 绑定事件
        modalHeader.querySelector('#closeBtn').onclick = () => this.hideModal();
        modalFooter.querySelector('#cancelBtn').onclick = () => this.hideModal();
        modalFooter.querySelector('#okBtn').onclick = () => this.insertFormula();

        // 点击遮罩关闭（可选）
        modalOverlay.onclick = (e) => {
            if (e.target === modalOverlay) {
                this.hideModal();
            }
        };

        // ESC键关闭
        document.addEventListener('keydown', this.handleKeyDown);

        this.modal = modalOverlay;
        return modalOverlay;
    }

    handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            this.hideModal();
        }
    };

    // 显示模态框
    showModal() {
        if (this.modal) {
            this.hideModal();
        }

        const modal = this.createModal();
        document.body.appendChild(modal);

        // 聚焦到输入框
        setTimeout(() => {
            if (this.mathField) {
                this.mathField.focus();
            }
        }, 100);
    }

    // 隐藏模态框
    hideModal() {
        if (this.modal) {
            document.removeEventListener('keydown', this.handleKeyDown);
            document.body.removeChild(this.modal);
            this.modal = null;
            this.mathField = null;
        }
    }

    // 插入公式到编辑器
    insertFormula() {
        if (this.mathField && this.mathField.value && this.editor) {
            const latexValue = this.mathField.value;

            // 简单的方式：直接插入LaTeX代码，用$$包围表示数学公式
            const mathHtml = `<span class="math-formula" data-latex="${latexValue}" contenteditable="false">$$${latexValue}$$</span>`;

            // 使用 WangEditor 的 dangerouslyInsertHtml 方法
            this.editor.dangerouslyInsertHtml(mathHtml);

            const val = this.editor.getHtml();

            console.log(val, '插入公式:', latexValue);
        }
        this.hideModal();
    }

    // 菜单点击事件
    exec() {
        this.showModal();
    }

    // 其他必要方法
    isActive() { return false; }
    isDisabled() { return false; }
    getValue() { return ''; }
}

export default MathLiveMenu;