import "@wangeditor-next/editor/dist/css/style.css"; // 引入 css

import React, { useState, useEffect, useMemo } from "react";
import { Editor, Toolbar } from "@wangeditor-next/editor-for-react";
import {
  IDomEditor,
  IEditorConfig,
  IToolbarConfig,
  Boot,
} from "@wangeditor-next/editor";
import formulaModule from "@wangeditor-next/plugin-formula";
import formulaEditor from 'easy-formula-editor'
// import katexOverrideModule from "../plugins/katex-override";
// 注册。要在创建编辑器之前注册，且只能注册一次，不可重复注册。
// Boot.registerModule(formulaModule);
// Boot.registerModule(formulaEditor);
// 使用 KaTeX 覆盖公式渲染（需在 formula 之后注册，以覆盖 renderElem）
// Boot.registerModule(katexOverrideModule);
function MyEditor() {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法
  // const [editor, setEditor] = useState(null)                   // JS 语法

  // 编辑器内容
  const [html, setHtml] = useState("<p>hello</p>");

  // 模拟 ajax 请求，异步设置 html

  // 工具栏配置（用 useMemo 固定，避免重渲导致内部状态丢失）
  const toolbarConfig = useMemo<Partial<IToolbarConfig>>(
    () => ({
      insertKeys: {
        index: 0,
        keys: [
          "insertFormula", // “插入公式”菜单
          // 'editFormula' // “编辑公式”菜单
        ],
      },

      // 其他...
    }),
    []
  );
  // const toolbarConfig = { }                        // JS 语法

  // 编辑器配置（同上，保持引用稳定）
  const editorConfig = useMemo<Partial<IEditorConfig>>(
    () => ({
      placeholder: "请输入内容...",
      hoverbarKeys: {
        formula: {
          menuKeys: ["editFormula"], // “编辑公式”菜单
        },
      },
    }),
    []
  );

  // 卸载时销毁 editor（避免内存泄漏）
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  return (
    <div>
      <div style={{ border: "1px solid #ccc", position: "relative" }}>
        {editor && (
          <Toolbar
            editor={editor}
            defaultConfig={toolbarConfig}
            mode="default"
            style={{
              borderBottom: "1px solid #ccc",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          />
        )}
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(ed: IDomEditor) => setHtml(ed.getHtml())}
          mode="default"
          style={{ height: "500px", overflowY: "auto", zIndex: 1 }}
        />
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🚀 wangEditor-next 插件开发学习</h1>
      
      <div style={{ 
        background: 'white', 
        borderRadius: '8px', 
        padding: '20px', 
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
      }}>
        <h2>原版编辑器</h2>
        <MyEditor />
      </div>

      <div style={{ 
        background: '#f0f8ff', 
        borderRadius: '8px', 
        padding: '20px', 
        marginBottom: '20px',
        border: '1px solid #d6e4ff'
      }}>
        <h2>🧮 增强数学公式插件测试</h2>
        <p>通过学习 wangEditor-next 源码，开发了增强版数学公式插件，解决了原版插件的 KaTeX 解析问题。</p>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
          <a 
            href="/formula-demo" 
            style={{ 
              padding: '10px 20px', 
              background: '#1890ff', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '4px',
              display: 'inline-block'
            }}
          >
            📊 完整演示页面
          </a>
          
          <a 
            href="/simple-formula-test" 
            style={{ 
              padding: '10px 20px', 
              background: '#52c41a', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '4px',
              display: 'inline-block'
            }}
          >
            🧪 简单功能测试
          </a>
          
          <a 
            href="/formula-test-v2" 
            style={{ 
              padding: '10px 20px', 
              background: '#722ed1', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '4px',
              display: 'inline-block'
            }}
          >
            ⚡ 正确架构实现
          </a>
        </div>
      </div>

      <div style={{ 
        background: '#fff7e6', 
        borderRadius: '8px', 
        padding: '20px', 
        border: '1px solid #ffd591'
      }}>
        <h3>📚 学习成果</h3>
        <ul>
          <li>✅ 深入学习了 wangEditor-next 源码结构</li>
          <li>✅ 掌握了官方插件开发模式</li>
          <li>✅ 理解了 <code>Boot.registerModule()</code> 注册机制</li>
          <li>✅ 实现了完整的 <code>IModuleConf</code> 接口</li>
          <li>✅ 解决了原版公式插件的 KaTeX 解析问题</li>
          <li>✅ 创建了可工作的插件原型</li>
        </ul>
        
        <h3>🔧 主要改进</h3>
        <ul>
          <li>智能预处理公式，自动移除 <code>$</code> 符号</li>
          <li>HTML 实体自动解码处理</li>
          <li>友好的错误提示机制</li>
          <li>支持行内和块级显示模式</li>
          <li>使用 HTML 输出提高兼容性</li>
        </ul>
      </div>
    </div>
  )
}

export default HomePage;
