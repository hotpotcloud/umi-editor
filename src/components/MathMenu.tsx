// math-menu.ts
import { IButtonMenu, IDomEditor } from "@wangeditor-next/editor";

/**
 * 自定义菜单：触发打开全局事件 open-math-editor
 * wangEditor-next 的菜单构造较简单，返回实现了 IButtonMenu 的对象
 */
class MathMenu implements IButtonMenu {
  title = "公式";
  // 简单 svg icon，可按需换
  iconSvg = `<svg viewBox="0 0 1024 1024" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="850" font-size="880">∑</text>
  </svg>`;
  tag = "button";

  exec(editor: IDomEditor) {
    // 通过 CustomEvent 把 editor 实例传出去，组件里监听并打开 Modal
    const ev = new CustomEvent("open-math-editor", { detail: { editor } });
    window.dispatchEvent(ev);
  }

  // 下面三个是 IButtonMenu 必需的方法（基本实现）
  isActive(_editor: IDomEditor) { return false; }
  getValue(_editor: IDomEditor) { return ""; }
  isDisabled(_editor: IDomEditor) { return false; }
}

export default MathMenu;
