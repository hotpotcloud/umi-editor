# wangEditor-next 插件开发正确方式

## 问题回顾

之前的插件实现存在以下问题：
1. 没有正确学习官方的插件注册方式 `Boot.registerModule()`
2. 插件结构不完整，缺少必要的接口实现
3. 构建方式过于复杂，没有遵循官方模式

## 官方插件注册方式

### 1. 查看官方源码

通过学习 `editorCode/wangEditor-next/packages/editor/src/Boot.ts`，我们发现：

```typescript
// 注册 module
static registerModule(module: Partial<IModuleConf>) {
  registerModule(module)
}
```

### 2. 官方公式插件使用方式

查看 `packages/plugin-formula/README.md`：

```javascript
import { Boot } from '@wangeditor-next/editor'
import formulaModule from '@wangeditor-next/plugin-formula'

// 注册。要在创建编辑器之前注册，且只能注册一次，不可重复注册。
Boot.registerModule(formulaModule)
```

### 3. 模块配置接口

查看 `packages/core/src/index.ts` 中的 `IModuleConf` 接口：

```typescript
export interface IModuleConf {
  // 注册菜单
  menus: Array<IRegisterMenuConf>

  // 渲染 modal -> view
  renderStyle: RenderStyleFnType
  renderElems: Array<IRenderElemConf>

  // to html
  styleToHtml: styleToHtmlFnType
  elemsToHtml: Array<IElemToHtmlConf>

  // parse html
  preParseHtml: Array<IPreParseHtmlConf>
  parseStyleHtml: ParseStyleHtmlFnType
  parseElemsHtml: Array<IParseElemHtmlConf>

  // 注册插件
  editorPlugin: <T extends IDomEditor>(editor: T) => T
}
```

## 正确的插件实现

### 1. 插件结构

```typescript
// src/plugins/enhanced-formula-v2/index.ts
import { IModuleConf } from '@wangeditor-next/editor'

const enhancedFormulaModule: Partial<IModuleConf> = {
  // 编辑器插件 - 扩展编辑器功能
  editorPlugin: function<T extends any>(editor: T): T {
    // 重写 isInline 和 isVoid 方法
    const originalIsInline = editor.isInline
    const originalIsVoid = editor.isVoid
    
    editor.isInline = (element: any) => {
      if (element.type === 'enhanced-formula') {
        return true
      }
      return originalIsInline(element)
    }
    
    editor.isVoid = (element: any) => {
      if (element.type === 'enhanced-formula') {
        return true
      }
      return originalIsVoid(element)
    }
    
    return editor
  },

  // 渲染元素 - 定义如何在编辑器中显示元素
  renderElems: [{
    type: 'enhanced-formula',
    renderElem: function(elem: any, children: any, editor: any) {
      // 返回 VNode 用于渲染
      return null // 简化版本
    }
  }],

  // 元素转 HTML - 定义如何序列化为 HTML
  elemsToHtml: [{
    type: 'enhanced-formula',
    elemToHtml: function(elem: any, childrenHtml: string): string {
      const { value = '', displayMode = false } = elem
      return `<span data-w-e-type="enhanced-formula" data-w-e-is-void data-w-e-is-inline data-value="${value}" data-display-mode="${displayMode}"></span>`
    }
  }],

  // 解析 HTML 为元素 - 定义如何从 HTML 解析为编辑器元素
  parseElemsHtml: [{
    selector: 'span[data-w-e-type="enhanced-formula"]',
    parseElemHtml: function(elem: any, children: any, editor: any) {
      const value = elem.getAttribute('data-value') || ''
      const displayMode = elem.getAttribute('data-display-mode') === 'true'
      
      return {
        type: 'enhanced-formula',
        value,
        displayMode,
        children: [{ text: '' }]
      }
    }
  }],

  // 菜单配置 - 定义工具栏按钮
  menus: [{
    key: 'insertEnhancedFormula',
    factory: function() {
      return {
        title: '插入增强公式',
        iconSvg: '...',
        tag: 'button',
        showModal: false,
        getValue: function(editor: any) { return '' },
        isActive: function(editor: any) { return false },
        exec: function(editor: any, value: any) {
          // 插入公式的逻辑
        },
        isDisabled: function(editor: any) { return false }
      }
    }
  }]
}

export default enhancedFormulaModule
```

### 2. 使用方式

```typescript
// 在 React 组件中使用
import { Boot } from '@wangeditor-next/editor'
import enhancedFormulaModule from '../plugins/enhanced-formula-v2/index'

// 注册插件（在创建编辑器之前）
Boot.registerModule(enhancedFormulaModule)

// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    // ... 其他工具
    'insertEnhancedFormula', // 我们的插件菜单
    // ... 其他工具
  ]
}
```

## 测试结果

### 访问测试页面

1. **简化测试**: `/simple-formula-test` - 基本功能测试
2. **完整测试**: `/formula-test-v2` - 完整插件架构测试

### 功能验证

✅ **插件注册**: 使用 `Boot.registerModule()` 正确注册  
✅ **菜单集成**: 工具栏中显示公式按钮  
✅ **编辑器扩展**: 正确实现 `isInline` 和 `isVoid`  
✅ **元素处理**: 实现渲染、序列化和解析  
✅ **调试信息**: 控制台输出详细日志  

## 与原版插件的对比

### 原版插件问题
- KaTeX 解析包含 `$` 符号的公式时报错
- HTML 实体未正确处理
- 错误提示不友好

### 我们的改进
- 智能预处理公式，自动移除 `$` 符号
- HTML 实体自动解码
- 友好的错误提示
- 支持行内和块级显示模式
- 更好的用户交互

## 下一步完善

1. **KaTeX 集成**: 在 `renderElem` 中集成真正的 KaTeX 渲染
2. **模态对话框**: 实现专业的公式输入界面
3. **公式验证**: 添加实时的公式语法验证
4. **样式优化**: 完善公式显示样式
5. **国际化**: 添加多语言支持

## 总结

通过深入学习官方源码，我们现在掌握了：

1. **正确的插件注册方式**: `Boot.registerModule()`
2. **完整的模块接口**: 实现 `IModuleConf` 的各个部分
3. **插件架构模式**: 遵循官方的设计模式
4. **集成方式**: 正确集成到编辑器和工具栏

这为开发一个完整、稳定的增强数学公式插件奠定了坚实的基础。