/**
 *  点击外面 指令  就是封装相当于v-show之类的 
 */
export default {
    // 绑定
    bind (el, binding, vnode) {     
        // 文件处理程序
        function documentHandler (e) {
            // Contains方法就是比较实用的函数，如果A元素包含B元素，则返回true，否则false 
            // 可返回事件的目标节点
            // 如果目标DOM 包含了事件的目标  那么就返回 false
            if (el.contains(e.target)) {
                return false;
            }
            if (binding.expression) {
                binding.value(e);
            }
        }
        // 在el对象目标上面 添加一个方法
        el.__vueClickOutside__ = documentHandler;
        // 监听click 事件 然后调用 后面的函数
        document.addEventListener('click', documentHandler);
    },
    update () {

    },
    // 卸载监听事件
    unbind (el, binding) {
        // 卸载和监听 必须是同一个函数
        document.removeEventListener('click', el.__vueClickOutside__);
        // 在原型上面 删除方法
        delete el.__vueClickOutside__;
    }
};