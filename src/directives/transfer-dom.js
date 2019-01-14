// Thanks to: https://github.com/airyland/vux/blob/v2/src/directives/transfer-dom/index.js
// Thanks to: https://github.com/calebroseland/vue-dom-portal
// 动画指令
/**
 * Get target DOM Node 获取到目标节点
 * @param {(Node|string|Boolean)} [node=document.body] DOM Node, CSS selector, or Boolean
 * @return {Node} The target that the el will be appended to  将附加el的目标
 */
// 获取目标节点
function getTarget (node) {
    // 如果节点 是为空 那么node 就为 目标节点   body
    if (node === void 0) {
        node = document.body
    }
    if (node === true) { return document.body }
    //  判断node节点 是不是在全局的node节点上  如果存在 那么 就返回节点本身 否则就返回 选择的接地
    return node instanceof window.Node ? node : document.querySelector(node)
}
// 定义指令对象  可参考官网的https://cn.vuejs.org/v2/guide/custom-directive.html#ad 自定义指令
// 就是封装v-show指令的
const directive = {
    // 插入
    inserted (el, { value }, vnode) {
        // el.dataset 访问自定义属性   并且 el.dataset.transfer 有traansfer 自定义属性
        if ( el.dataset && el.dataset.transfer !== 'true') return false;
        // el设置class属性 如果存在 那么  就加一个 v-transfer-dom class
        el.className = el.className ? el.className + ' v-transfer-dom' : 'v-transfer-dom';
        // 获取目标元素的父节点
        const parentNode = el.parentNode;
        // 如果父节点不存在  那么就返回空
        if (!parentNode) return;
        // 创建一个注释节点
        const home = document.createComment('');
        // 判断是否移动到外面
        let hasMovedOut = false;
        // 如果value值不为假  那么
        if (value !== false) {
            // 那么在父节点中 用注释节点 替换目标元素
            parentNode.replaceChild(home, el); // moving out, el is no longer in the document
            // 搬到新的地方 将目标元素插入到 新的节点后面
            getTarget(value).appendChild(el); // moving into new place
            // 移动到外面
            hasMovedOut = true
        }
        // 如果目标元素没有transferDomData 方法
        if (!el.__transferDomData) {
            // 那么就添加该方法  对象
            el.__transferDomData = {
                // 父节点
                parentNode: parentNode,
                // 是否添加一个注释节点
                home: home,
                // 目标
                target: getTarget(value),
                // 是否移除
                hasMovedOut: hasMovedOut
            }
        }
    },
    // 组件已更新
    componentUpdated (el, { value }) {
        if ( el.dataset && el.dataset.transfer !== 'true') return false;
        // need to make sure children are done updating (vs. `update`)
        // 需要确保子节点完成更新（与`更新'相比）
        const ref$1 = el.__transferDomData;
        // 如果ref$1存在 那么就返回空
        if (!ref$1) return;
        // homes.get(el)
        // 父节点为 ref$1 节点
        const parentNode = ref$1.parentNode;
        const home = ref$1.home;
        const hasMovedOut = ref$1.hasMovedOut; // recall where home is

        if (!hasMovedOut && value) {
            // remove from document and leave placeholder
            // 替换节点
            parentNode.replaceChild(home, el);
            // append to target
            getTarget(value).appendChild(el);
            // 创建一个空对象  赋值和拷贝 然后合并相同的属性 将el.__transferDomData { hasMovedOut: true, target: getTarget(value) } 
            el.__transferDomData = Object.assign({}, el.__transferDomData, { hasMovedOut: true, target: getTarget(value) });
        } else if (hasMovedOut && value === false) {
            // previously moved, coming back home
            parentNode.replaceChild(el, home);
            el.__transferDomData = Object.assign({}, el.__transferDomData, { hasMovedOut: false, target: getTarget(value) });
        } else if (value) {
            // already moved, going somewhere else
            getTarget(value).appendChild(el);
        }
    },
    // 卸载绑定
    unbind (el) {
        if (el.dataset && el.dataset.transfer !== 'true') return false;
        // 匹配正则将 v-transfer-dom 属性 替换为 空
        el.className = el.className.replace('v-transfer-dom', '');
        const ref$1 = el.__transferDomData;
        if (!ref$1) return;
        if (el.__transferDomData.hasMovedOut === true) {
            el.__transferDomData.parentNode && el.__transferDomData.parentNode.appendChild(el)
        }
        el.__transferDomData = null
    }
};
// 导出指令
export default directive;