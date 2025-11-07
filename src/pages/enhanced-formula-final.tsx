/**
 * @description 增强公式插件最终测试页面
 */

import React, { useState, useEffect } from 'react'
import '@wangeditor-next/editor/dist/css/style.css'
import 'katex/dist/katex.min.css'

const EnhancedFormulaFinal: React.FC = () => {
  const [editorCreated, setEditorCreated] = useState(false)
  const [editorInstance, setEditorInstance] = useState<any>(null)
  const [toolbarInstance, setToolbarInstance] = useState<any>(null)

  useEffect(() => {
    // 清理函数
    return () => {
      if (editorInstance) {
        editorInstance.destroy()
      }
    }
  }, [editorInstance])

  const createEditor = async () => {
    // 动态导入编辑器
    const { createEditor, createToolbar, Boot } = await import('@wangeditor-next/editor')
    
    // 动态导入增强公式插件
    const enhancedFormulaModule = (await import('../components/EnhancedFormulaPlugin')).default
    
    // 注册插件
    Boot.registerModule(enhancedFormulaModule)
    
    // 编辑器配置
    const editorConfig = {
      placeholder: '请输入内容...',
      onChange: (editor: any) => {
        console.log('content changed:', editor.getHtml())
      },
      hoverbarKeys: {
        'enhanced-formula': {
          menuKeys: ['editEnhancedFormula'],
        },
      },
    }

    // 工具栏配置
    const toolbarConfig = {
      insertKeys: {
        index: 0,
        keys: ['insertEnhancedFormula'],
      },
    }

    // 创建编辑器
    const editor = createEditor({
      selector: '#editor-text-area-final',
      config: editorConfig,
    })

    // 创建工具栏
    const toolbar = createToolbar({
      editor,
      selector: '#editor-toolbar-final',
      config: toolbarConfig,
    })

    setEditorInstance(editor)
    setToolbarInstance(toolbar)
    setEditorCreated(true)

    // 设置初始内容
    editor.setHtml(`
      <h2>增强公式插件测试</h2>
      <p>点击工具栏的 Σ 按钮插入数学公式。</p>
      <h3>改进点：</h3>
      <ul>
        <li>自动移除外层 $ 符号</li>
        <li>处理 HTML 实体编码</li>
        <li>使用 HTML 输出而不是 MathML</li>
        <li>友好的错误处理</li>
      </ul>
    `)
  }

  const getHtml = () => {
    if (editorInstance) {
      const html = editorInstance.getHtml()
      console.log('HTML:', html)
      alert('HTML 已输出到控制台')
    }
  }

  const destroyEditor = () => {
    if (editorInstance) {
      editorInstance.destroy()
      setEditorInstance(null)
      setToolbarInstance(null)
      setEditorCreated(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>🧮 Enhanced Formula Plugin - Final Test</h1>

      <div style={{
        background: '#e6f7ff',
        border: '1px solid #91d5ff',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginTop: 0 }}>📝 使用说明</h3>
        <ol>
          <li>点击"创建编辑器"按钮</li>
          <li>点击工具栏的 Σ 按钮插入公式</li>
          <li>输入 LaTeX 公式（不需要 $ 符号）</li>
          <li>公式会自动渲染显示</li>
        </ol>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={createEditor}
          disabled={editorCreated}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            background: editorCreated ? '#ccc' : '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: editorCreated ? 'not-allowed' : 'pointer'
          }}
        >
          创建编辑器
        </button>
        <button
          onClick={getHtml}
          disabled={!editorCreated}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            background: editorCreated ? '#52c41a' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: editorCreated ? 'pointer' : 'not-allowed'
          }}
        >
          获取 HTML
        </button>
        <button
          onClick={destroyEditor}
          disabled={!editorCreated}
          style={{
            padding: '10px 20px',
            background: editorCreated ? '#ff4d4f' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: editorCreated ? 'pointer' : 'not-allowed'
          }}
        >
          销毁编辑器
        </button>
      </div>

      <div>
        <div
          id="editor-toolbar-final"
          style={{
            border: '1px solid #ccc',
            borderBottom: 'none',
            borderRadius: '4px 4px 0 0'
          }}
        ></div>
        <div
          id="editor-text-area-final"
          style={{
            border: '1px solid #ccc',
            borderRadius: '0 0 4px 4px',
            minHeight: '400px'
          }}
        ></div>
      </div>

      <div style={{
        background: '#fff7e6',
        border: '1px solid #ffd591',
        borderRadius: '4px',
        padding: '15px',
        marginTop: '20px'
      }}>
        <h3 style={{ marginTop: 0 }}>🧪 测试公式</h3>
        <p>可以尝试输入以下公式：</p>
        {/* <ul style={{ fontFamily: 'monospace', fontSize: '14px' }}>
          <li>x^2 + y^2 = z^2</li>
          <li>\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}</li>
          <li>\int_0^1 x dx</li>
          <li>\sum_{i=1}^n i = \frac{n(n+1)}{2}</li>
          <li>\begin{align}SH_i &= \frac{SHLG - GMIN}{GMAX - GMIN} \\V_{shi} &= \frac{2^{2 \times SH_i} - 1}{2^2 - 1}\end{align}</li>
        </ul> */}
        <p><strong>注意：</strong>最后一个公式在原版插件中会报错，但在增强版中可以正常显示。</p>
      </div>
    </div>
  )
}

export default EnhancedFormulaFinal
