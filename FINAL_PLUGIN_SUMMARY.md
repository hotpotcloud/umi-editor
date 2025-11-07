# 增强公式插件 - 最终版本

## 学习过程总结

### 第一次尝试的问题
- 没有完整学习官方插件的实现方式
- 对 `Boot.registerModule()` 的使用不正确
- 构建方式过于复杂

### 第二次尝试的问题  
- 误以为 `isInline` 和 `isVoid` 不存在
- 没有查看编辑器的完整 API 文档
- 没有参考官方示例代码

### 正确的学习路径

1. **查看官方示例** (`packages/editor/examples/`)
   - `default-mode.html` - 基础使用方式
   - `new-menu.html` - 如何注册新菜单
   - 了解 `createEditor` 和 `createToolbar` 的用法

2. **学习编辑器接口** (`packages/core/src/editor/interface.ts`)
   - `IDomEditor` 继承自 Slate 的 `Editor`
   - Slate Editor 有 `isInline` 和 `isVoid` 方法
   - 了解可用的 API 方法

3. **研究官方公式插件** (`packages/plugin-formula/`)
   - 完整的模块结构
   - 自定义元素注册
   - 菜单实现方式
   - 渲染和序列化逻辑

## 最终插件结构

```
src/components/EnhancedFormulaPlugin/
├── index.ts                    # 插件入口，导出模块配置
├── plugin.ts                   # 编辑器插件，扩展 isInline 和 isVoid
├── register-custom-elem.ts     # 注册自定义 Web Component
├── render-elem.ts              # 渲染元素为 VNode
├── elem-to-html.ts             # 元素序列化为 HTML
├── parse-elem-html.ts          # HTML 解析为元素
├── InsertFormulaMenu.ts        # 插入公式菜单
├── EditFormulaMenu.ts          # 编辑公式菜单
└── style.css                   # 样式文件
```

## 核心改进

### 1. 公式预处理
```typescript
function preprocessFormula(value: string): string {
  if (!value) return ''
  
  let processed = value.trim()
  
  // 移除双重 $$ 符号
  if (processed.startsWith('$$') && processed.endsWith('$$')) {
    processed = processed.slice(2, -2).trim()
  }
  // 移除单个 $ 符号
  else if (processed.startsWith('$') && processed.endsWith('$')) {
    processed = processed.slice(1, -1).trim()
  }
  
  // 处理 HTML 实体
  processed = processed
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
  
  return processed
}
```

### 2. 使用 HTML 输出
```typescript
katex.render(processedValue, this.span, {
  throwOnError: false,
  output: 'html',  // 使用 HTML 而不是 MathML
})
```

### 3. 完整的模块配置
```typescript
const enhancedFormulaModule: Partial<IModuleConf> = {
  editorPlugin: withEnhancedFormula,
  renderElems: [renderElemConf],
  elemsToHtml: [elemToHtmlConf],
  parseElemsHtml: [parseHtmlConf],
  menus: [
    {
      key: 'insertEnhancedFormula',
      factory() {
        return new InsertEnhancedFormulaMenu()
      },
    },
    {
      key: 'editEnhancedFormula',
      factory() {
        return new EditEnhancedFormulaMenu()
      },
    },
  ],
}
```

## 使用方式

### 1. 作为独立组件使用

访问测试页面：`/enhanced-formula-final`

### 2. 在项目中集成

```typescript
import { Boot } from '@wangeditor-next/editor'
import enhancedFormulaModule from '@/components/EnhancedFormulaPlugin'

// 注册插件（在创建编辑器之前）
Boot.registerModule(enhancedFormulaModule)

// 编辑器配置
const editorConfig = {
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
```

## 解决的问题

### 原版插件报错的公式
```latex
$\begin{align}SH_i &= \frac{SHLG - GMIN}{GMAX - GMIN} \\V_{shi} &= \frac{2^{2 \times SH_i} - 1}{2^2 - 1}\end{align}$
```

### 增强版正确处理
```latex
\begin{align}SH_i &= \frac{SHLG - GMIN}{GMAX - GMIN} \\V_{shi} &= \frac{2^{2 \times SH_i} - 1}{2^2 - 1}\end{align}
```

## 关键要点

1. **完全按照官方模式**：不要自己发明新的实现方式
2. **先学习示例代码**：官方示例是最好的学习资料
3. **理解接口定义**：知道哪些 API 可用，哪些不可用
4. **保持简单**：不要过度设计，先实现基本功能
5. **测试验证**：创建简单的测试页面验证功能

## 下一步

插件的核心架构已经正确实现，可以：
1. 添加更多的公式模板
2. 优化用户界面
3. 添加公式预览功能
4. 支持更多的 KaTeX 选项
5. 添加国际化支持

## 总结

通过深入学习官方源码和示例，我们现在有了一个：
- ✅ 架构正确的插件实现
- ✅ 完全兼容 wangEditor-next 的插件系统
- ✅ 解决了原版插件的 KaTeX 解析问题
- ✅ 可以直接在项目中使用的组件

这个插件可以作为学习 wangEditor-next 插件开发的完整示例。
