import "@wangeditor-next/editor/dist/css/style.css";
import 'mathlive/static.css';
// import '../styles/math-formula.css';
import React, { useRef, useEffect, useMemo } from 'react';
import { Boot } from '@wangeditor-next/editor';
import { Editor, Toolbar } from '@wangeditor-next/editor-for-react';
import MathLiveMenu from './MathLiveMenu';

// 注册公式元素类型
const formulaElementConf = {
    type: 'formula', // 节点 type ，重要！！！
    elemToHtml: (elemNode, childrenHtml) => {
        const { value } = elemNode;
        return `<span data-w-e-type="formula" data-w-e-is-void data-value="${value}">$$${value}$$</span>`;
    },
    parseElemHtml: (domElem, children, editor) => {
        const value = domElem.getAttribute('data-value') || '';
        return {
            type: 'formula',
            value,
            children: [{ text: '' }], // void node 必须有一个空白 text
        };
    },
    isInline: true,
    isVoid: true,
};
Boot.registerElement(formulaElementConf);

// 注册自定义菜单
const mathLiveMenuConf = {
    key: 'mathLive', // 唯一标识
    factory() {
        return new MathLiveMenu();
    }
};
Boot.registerMenu(mathLiveMenuConf);

const WangEditorWithMath = () => {
    const editorRef = useRef(null);
    const [html, setHtml] = React.useState('<p><br></p>');
    const [editor, setEditor] = React.useState(null);

    // 工具栏配置
    const toolbarConfig = useMemo(() => ({
        insertKeys: {
            index: 10, // 插入位置（在现有菜单后）
            keys: ['mathLive'] // 添加自定义菜单
        }
    }), []);

    // 编辑器配置
    const editorConfig = useMemo(() => ({
        placeholder: '请输入内容...',
        onChange: (editor) => {
            setHtml(editor.getHtml());
        },
        onCreated: (editor) => {
            editorRef.current = editor;
            setEditor(editor);

            // 绑定编辑器实例到菜单
            const mathMenu = editor.getMenuByKey('mathLive');
            if (mathMenu) {
                mathMenu.bindEditor(editor);
            }
        }
    }), []);

    // 组件卸载时销毁编辑器
    useEffect(() => {
        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, []);

    return (
        <div style={{ border: '1px solid #ccc', width: '100%', maxWidth: '800px' }}>
            {editor && (
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{ borderBottom: '1px solid #ccc' }}
                />
            )}
            <Editor
                defaultConfig={editorConfig}
                value={html}
                mode="default"
                style={{ height: '500px', overflowY: 'auto' }}
            />
        </div>
    );
};

export default WangEditorWithMath;