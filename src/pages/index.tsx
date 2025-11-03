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
// 注册。要在创建编辑器之前注册，且只能注册一次，不可重复注册。
Boot.registerModule(formulaModule);
Boot.registerModule(formulaEditor);
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

export default MyEditor;
