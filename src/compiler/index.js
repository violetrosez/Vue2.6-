/* @flow */

import { parse } from "./parser/index";
import { optimize } from "./optimizer";
import { generate } from "./codegen/index";
import { createCompilerCreator } from "./create-compiler";

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile(
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 模板 -> ast
  // 将模版解析为 AST，每个节点的 ast 对象上都设置了元素的所有信息，比如，标签信息、属性信息、插槽信息、父节点、子节点等
  const ast = parse(template.trim(), options);
  if (options.optimize !== false) {
    // 优化，遍历 AST，为每个节点做静态标记
    // 标记每个节点是否为静态节点，然后进一步标记出静态根节点
    // 这样在后续更新中就可以跳过这些静态节点了
    // 标记静态根，用于生成渲染函数阶段，生成静态根节点的渲染函数
    optimize(ast, options);
  }
  // ast -> 渲染函数 "_c('div',{attrs:{"id":"app"}},_l((arr),function(item){return _c('div',{key:item},[_v(_s(item))])}),0)"
  const code = generate(ast, options);
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns,
  };
});
