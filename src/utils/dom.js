import Vue from 'vue';
// 在原型上挂载服务
const isServer = Vue.prototype.$isServer;

/* istanbul ignore next 立即执行函数*/
export const on = (function() {
    // 监听事件  
    if (!isServer && document.addEventListener) {
        // 绑定监听事件 回调函数
        return function(element, event, handler) {
            if (element && event && handler) {
                // 对事件进行监听
                element.addEventListener(event, handler, false);
            }
        };
    } else {
        // 对事件监听 进行兼容处理
        return function(element, event, handler) {
            if (element && event && handler) {
                element.attachEvent('on' + event, handler);
            }
        };
    }
})();

/* istanbul ignore next 取消事件监听*/
export const off = (function() {
    if (!isServer && document.removeEventListener) {
        return function(element, event, handler) {
            if (element && event) {
                element.removeEventListener(event, handler, false);
            }
        };
    } else {
        return function(element, event, handler) {
            if (element && event) {
                element.detachEvent('on' + event, handler);
            }
        };
    }
})();
