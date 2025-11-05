// MathElement.tsx - 数学公式元素定义和渲染

// 定义数学公式元素的类型
export interface MathElement {
  type: 'math';
  latex: string;
  children: { text: '' }[];
}

// 注册数学公式元素
const withMath = (editor: any) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element: any) => {
    return element.type === 'math' ? true : isInline(element);
  };

  editor.isVoid = (element: any) => {
    return element.type === 'math' ? true : isVoid(element);
  };

  return editor;
};

// 渲染数学公式的函数
const renderMathElement = (elemNode: any, _children: any, _editor: any) => {
  if (elemNode.type !== 'math') return;
  
  const { latex } = elemNode;
  
  // 创建一个包含 math-field 的容器
  const container = document.createElement('span');
  container.className = 'math-formula-container';
  container.contentEditable = 'false';
  
  const mathField = document.createElement('math-field') as any;
  mathField.setAttribute('read-only', 'true');
  mathField.value = latex;
  mathField.className = 'math-formula-field';
  
  // 双击编辑功能
  mathField.addEventListener('dblclick', () => {
    const event = new CustomEvent('edit-math-formula', {
      detail: { latex, element: elemNode }
    });
    window.dispatchEvent(event);
  });
  
  // 添加提示
  mathField.title = '双击编辑公式';
  
  container.appendChild(mathField);
  
  return container;
};

export { withMath, renderMathElement };