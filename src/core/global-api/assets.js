/* @flow */

import { ASSET_TYPES } from "shared/constants";
import { isPlainObject, validateComponentName } from "../util/index";
//  * ASSET_TYPES = ['component', 'directive', 'filter']
export function initAssetRegisters(Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach((type) => {
    /**
     * 比如：Vue.component(name, definition)
     * @param {*} id name
     * @param {*} definition 组件构造函数或者配置对象
     * @returns 返回组件构造函数
     */
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + "s"][id];
      } else {
        /* istanbul ignore if */
        // 组件名合法性
        if (process.env.NODE_ENV !== "production" && type === "component") {
          validateComponentName(id);

        }
        if (type === "component" && isPlainObject(definition)) {
          // 组件内name的优先级大于参数传入的name
          // extend 就是 Vue.extend，所以这时的 definition 就变成了 组件构造函数，使用时可直接 new Definition()
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === "directive" && typeof definition === "function") {
          definition = { bind: definition, update: definition };
        }
        // 加入到全局的option对象中，子组件初始化会合并到子组件的option对象
        this.options[type + "s"][id] = definition;
        return definition;
      }
    };
  });
}
