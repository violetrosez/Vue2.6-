/* @flow */

import { parseText } from "compiler/parser/text-parser";
import { getAndRemoveAttr, getBindingAttr, baseWarn } from "compiler/helpers";
// 从 el 上解析出静态的 style 属性和动态绑定的 style 属性，分别赋值给： el.staticStyle 和 el.styleBinding
function transformNode(el: ASTElement, options: CompilerOptions) {
  const warn = options.warn || baseWarn;
  const staticClass = getAndRemoveAttr(el, "class");
  if (process.env.NODE_ENV !== "production" && staticClass) {
    const res = parseText(staticClass, options.delimiters);
    if (res) {
      warn(
        `class="${staticClass}": ` +
          "Interpolation inside attributes has been removed. " +
          "Use v-bind or the colon shorthand instead. For example, " +
          'instead of <div class="{{ val }}">, use <div :class="val">.',
        el.rawAttrsMap["class"]
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  const classBinding = getBindingAttr(el, "class", false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData(el: ASTElement): string {
  let data = "";
  if (el.staticClass) {
    data += `staticClass:${el.staticClass},`;
  }
  if (el.classBinding) {
    data += `class:${el.classBinding},`;
  }
  return data;
}

export default {
  staticKeys: ["staticClass"],
  transformNode,
  genData,
};
