/**
 * @description 增强公式插件入口
 */

import './register-custom-elem'

import { IModuleConf } from '@wangeditor-next/editor'
import withEnhancedFormula from './plugin'
import renderElemConf from './render-elem'
import elemToHtmlConf from './elem-to-html'
import parseHtmlConf from './parse-elem-html'
import InsertEnhancedFormulaMenu from './InsertFormulaMenu'
import EditEnhancedFormulaMenu from './EditFormulaMenu'

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

export default enhancedFormulaModule
