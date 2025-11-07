# 调试增强公式插件

## 问题

你的公式 HTML 是正确的：
```html
<span data-w-e-type="enhanced-formula" data-w-e-is-void data-w-e-is-inline data-value="\begin{align}SH_i &= \frac{SHLG - GMIN}{GMAX - GMIN} \\V_{shi} &= \frac{2^{2 \times SH_i} - 1}{2^2 - 1}\end{align}"></span>
```

但公式没有正确显示。

## 调试步骤

### 1. 检查自定义元素是否注册

打开浏览器控制台，输入：
```javascript
console.log(window.customElements.get('enhanced-formula-card'))
```

应该看到自定义元素的类定义。

### 2. 检查公式是否被解析

在控制台查看是否有以下日志：
- "Enhanced formula card registered"
- "Rendering formula: ..."
- "Processed formula: ..."
- "Formula rendered successfully"

### 3. 手动测试自定义元素

在控制台执行：
```javascript
const card = document.createElement('enhanced-formula-card')
card.setAttribute('data-value', 'x^2 + y^2 = z^2')
document.body.appendChild(card)
```

看看公式是否显示。

### 4. 检查 KaTeX 是否加载

```javascript
console.log(typeof katex)
```

应该显示 "object"。

### 5. 测试公式预处理

```javascript
const formula = "\\begin{align}SH_i &= \\frac{SHLG - GMIN}{GMAX - GMIN} \\\\V_{shi} &= \\frac{2^{2 \\times SH_i} - 1}{2^2 - 1}\\end{align}"
console.log('Original:', formula)

// 测试 KaTeX 直接渲染
const div = document.createElement('div')
document.body.appendChild(div)
katex.render(formula, div, { throwOnError: false, output: 'html' })
```

## 可能的问题

### 问题 1: 自定义元素未注册

**解决方案**: 确保 `register-custom-elem.ts` 被导入。检查 `index.ts` 的第一行：
```typescript
import './register-custom-elem'
```

### 问题 2: 编辑器没有使用 renderElem

**解决方案**: 检查插件是否正确注册：
```typescript
Boot.registerModule(enhancedFormulaModule)
```

### 问题 3: HTML 没有被解析为元素

**解决方案**: 检查 `parse-elem-html.ts` 的选择器是否正确：
```typescript
selector: 'span[data-w-e-type="enhanced-formula"]'
```

### 问题 4: KaTeX 渲染错误

**解决方案**: 查看控制台的错误信息，可能是：
- 公式语法错误
- KaTeX 版本不兼容
- 缺少 KaTeX CSS

## 快速修复

如果公式仍然不显示，尝试以下操作：

1. **刷新页面** - 清除缓存
2. **重新创建编辑器** - 点击"销毁编辑器"然后"创建编辑器"
3. **检查 KaTeX CSS** - 确保引入了 `katex.min.css`
4. **查看网络请求** - 确保 KaTeX 库加载成功

## 测试页面

访问 `/test-custom-element.html` 测试自定义元素是否工作。

## 预期结果

公式应该显示为：

```
SH_i = (SHLG - GMIN)/(GMAX - GMIN)
V_shi = (2^(2×SH_i) - 1)/(2^2 - 1)
```

（以数学格式渲染）
