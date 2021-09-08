/* @flow */

import { mergeOptions } from '../util/index'
// 在vue的默认配置上合并mixin
export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
