# Enhanced Formula Plugin - 增强数学公式插件

## 项目概述

基于对 wangEditor-next 源码的深入学习，我重新开发了一个增强的数学公式插件，解决了原版插件中 KaTeX 解析错误的问题。

## 问题分析

原版插件存在的问题：
1. **KaTeX 解析错误**：无法处理包含 `$` 符号的公式
2. **HTML 实体未解码**：`&amp;`、`&lt;` 等实体导致渲染失败
3. **错误提示不友好**：显示红色错误信息而不是友好提示
4. **输出格式限制**：使用 MathML 输出可能有兼容性问题

## 解决方案

### 1. 智能公式预处理
```typescript
export function preprocessFormula(formula: string): string {
  let processed = formula.trim()

  // 移除双重 $$ 符号（先处理双重的）
  if (processed.startsWith('$$') && processed.endsWith('$$')) {
    processed = processed.slice(2, -2).trim()
  }
  // 移除外层的 $ 符号
  else if (processed.startsWith('$') && processed.endsWith('$')) {
    processed = processed.slice(1, -1).trim()
  }

  // 处理 HTML 实体编码
  processed = processed
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return processed
}
```

### 2. 公式验证机制
```typescript
export function validateFormula(formula: string): { valid: boolean; error?: string } {
  const processed = preprocessFormula(formula)
  
  if (!processed) {
    return { valid: false, error: 'Empty formula' }
  }

  // 括号匹配检查
  const brackets = [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' }
  ]

  for (const bracket of brackets) {
    const openCount = (processed.match(new RegExp('\\' + bracket.open, 'g')) || []).length
    const closeCount = (processed.match(new RegExp('\\' + bracket.close, 'g')) || []).length
    
    if (openCount !== closeCount) {
      return { 
        valid: false, 
        error: `Mismatched ${bracket.open}${bracket.close} brackets` 
      }
    }
  }

  return { valid: true }
}
```

### 3. 增强的自定义元素
```typescript
class EnhancedFormulaCard extends HTMLElement {
  private render(value: string) {
    // 清空之前的内容
    this.container.innerHTML = ''
    this.errorContainer.style.display = 'none'

    if (!value) {
      this.showError('Empty formula')
      return
    }

    // 预处理和验证
    const processedFormula = preprocessFormula(value)
    const validation = validateFormula(processedFormula)
    
    if (!validation.valid) {
      this.showError(validation.error || 'Invalid formula')
      return
    }

    try {
      // 使用 HTML 输出而不是 MathML
      const options = getKaTeXOptions()
      katex.render(processedFormula, this.container, options)
    } catch (error) {
      // 友好的错误处理
      this.showError(`Render error: ${error.message}`)
    }
  }
}
```

### 4. 支持显示模式选择
- **行内模式**：公式与文字在同一行
- **块级模式**：公式独占一行，居中显示

## 项目结构

```
src/plugins/enhanced-formula/
├── package.json                    # 包配置
├── tsconfig.json                   # TypeScript 配置
├── rollup.config.js               # 构建配置
├── build.js                       # 简化构建脚本
├── README.md                      # 项目说明
├── USAGE.md                       # 使用指南
├── example.html                   # 演示页面
├── test/
│   └── formula-parser.test.js     # 核心功能测试
├── src/
│   ├── index.ts                   # 入口文件
│   ├── assets/
│   │   └── style.css             # 样式文件
│   ├── constants/
│   │   └── icon-svg.ts           # 图标定义
│   ├── utils/
│   │   ├── formula-parser.ts     # 公式解析核心
│   │   ├── dom.ts               # DOM 工具
│   │   └── util.ts              # 通用工具
│   ├── register-custom-elem/
│   │   └── index.ts             # 自定义元素注册
│   └── module/
│       ├── index.ts             # 模块入口
│       ├── custom-types.ts      # 类型定义
│       ├── plugin.ts            # 编辑器插件
│       ├── render-elem.ts       # 元素渲染
│       ├── elem-to-html.ts      # HTML 序列化
│       ├── parse-elem-html.ts   # HTML 解析
│       ├── local.ts             # 国际化
│       └── menu/
│           ├── index.ts         # 菜单入口
│           ├── InsertFormula.ts # 插入公式菜单
│           └── EditFormula.ts   # 编辑公式菜单
└── dist/                          # 构建输出
    ├── index.js
    ├── index.d.ts
    └── css/
        └── style.css
```

## 核心改进

### 1. 解决原版插件报错的公式
**原版插件会报错：**
```
$\begin{align}SH_i &= \frac{SHLG - GMIN}{GMAX - GMIN} \\V_{shi} &= \frac{2^{2 \times SH_i} - 1}{2^2 - 1}\end{align}$
```

**增强插件正常处理：**
```
\begin{align}SH_i &= \frac{SHLG - GMIN}{GMAX - GMIN} \\V_{shi} &= \frac{2^{2 \times SH_i} - 1}{2^2 - 1}\end{align}
```

### 2. 更好的用户体验
- ✅ 自动移除外层 `$` 符号
- ✅ HTML 实体自动解码
- ✅ 友好的错误提示
- ✅ 公式语法验证
- ✅ 支持行内和块级显示
- ✅ 响应式设计
- ✅ 国际化支持

### 3. 技术改进
- 使用 HTML 输出而不是 MathML，提高兼容性
- 增强的错误处理机制
- 更好的样式控制
- 完整的 TypeScript 支持

## 测试结果

所有核心功能测试通过：
```
🧪 Running Enhanced Formula Plugin Tests

✅ preprocessFormula removes outer $ symbols
✅ preprocessFormula handles HTML entities
✅ preprocessFormula handles the problematic formula
✅ validateFormula detects bracket mismatches
✅ validateFormula handles empty formulas
✅ validateFormula accepts valid formulas

🎉 Tests completed!
```

## 使用方法

### 1. 构建插件
```bash
cd src/plugins/enhanced-formula
node build.js
```

### 2. 在项目中使用
```typescript
import enhancedFormulaModule from './path/to/enhanced-formula/dist/index.js'
import './path/to/enhanced-formula/dist/css/style.css'

// 注册插件
editor.use(enhancedFormulaModule)

// 配置工具栏
toolbarConfig.toolbarKeys = [
  // ... 其他工具
  'insertEnhancedFormula',  // 插入公式
  'editEnhancedFormula',    // 编辑公式
]
```

### 3. 访问演示页面
```
http://localhost:8000/formula-demo
```

## 总结

通过深入学习 wangEditor-next 的插件系统和源码结构，我成功开发了一个增强的数学公式插件，解决了原版插件的关键问题：

1. **问题定位准确**：通过分析错误信息，定位到 KaTeX 无法解析包含 `$` 符号的公式
2. **解决方案完整**：不仅修复了核心问题，还增加了验证、错误处理、显示模式等功能
3. **代码质量高**：遵循原版插件的架构模式，保持了良好的可维护性
4. **用户体验佳**：提供友好的错误提示和灵活的显示选项

这个插件可以完全替代原版的数学公式插件，为用户提供更稳定、更强大的数学公式编辑功能。