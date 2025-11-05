import React, { useEffect, useRef, useState } from 'react';
import { MathfieldElement } from 'mathlive';
import 'mathlive/mathlive-fonts.css';
import './MathEditor.css';

interface MathEditorProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (latex: string) => void;
  initialValue?: string;
}

const MathEditor: React.FC<MathEditorProps> = ({
  visible,
  onClose,
  onConfirm,
  initialValue = ''
}) => {
  const mathfieldRef = useRef<MathfieldElement | null>(null);
  const previewRef = useRef<MathfieldElement | null>(null);
  const [latex, setLatex] = useState(initialValue);

  // 初始化MathLive
  useEffect(() => {
    const initMathLive = async () => {
      // 动态导入MathLive以确保正确加载
      const { MathfieldElement } = await import('mathlive');
      
      // 确保自定义元素已注册
      if (!customElements.get('math-field')) {
        customElements.define('math-field', MathfieldElement);
      }
    };

    initMathLive();
  }, []);

  useEffect(() => {
    if (visible && mathfieldRef.current) {
      mathfieldRef.current.value = initialValue;
      setLatex(initialValue);
      // 延迟聚焦以确保元素完全渲染
      setTimeout(() => {
        mathfieldRef.current?.focus();
      }, 100);
    }
  }, [visible, initialValue]);

  // 更新预览
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.value = latex;
    }
  }, [latex]);

  const handleConfirm = () => {
    if (mathfieldRef.current) {
      const latexValue = mathfieldRef.current.value;
      onConfirm(latexValue);
    }
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="math-editor-overlay">
      <div className="math-editor-modal">
        <h3 className="math-editor-title">数学公式编辑器</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            输入数学公式 (LaTeX):
          </label>
          <math-field
            ref={mathfieldRef}
            className="math-field-input"
            value={latex}
            onInput={(evt: any) => {
              const newValue = evt.target.value;
              setLatex(newValue);
            }}
            style={{
              width: '100%',
              minHeight: '60px',
              border: '2px solid #d9d9d9',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '16px',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div className="math-preview">
          <div className="math-preview-label">预览:</div>
          <div style={{
            border: '1px solid #f0f0f0',
            padding: '15px',
            borderRadius: '6px',
            minHeight: '50px',
            backgroundColor: '#fafafa',
            textAlign: 'center'
          }}>
            <math-field
              ref={previewRef}
              read-only
              value={latex}
              style={{ 
                border: 'none', 
                backgroundColor: 'transparent',
                fontSize: '18px'
              }}
            />
          </div>
        </div>

        <div className="math-editor-buttons">
          <button
            onClick={onClose}
            className="math-editor-button math-editor-button-cancel"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="math-editor-button math-editor-button-confirm"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export default MathEditor;