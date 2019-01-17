<template>
    <!-- 图钉钉在某一个位置 -->
    <div>
        <div ref="point" :class="classes" :style="styles">
            <!-- 插槽 -->
            <slot></slot>
        </div>
        <div v-show="slot" :style="slotStyle"></div>
    </div>
</template>
<script>
    // 事件监听 和取消事件监听
    import { on, off } from '../../utils/dom';
    const prefixCls = 'ivu-affix';
    // 获取到滚动事件
    function getScroll(target, top) {
        //  属性返回文档在窗口左上角水平和垂直方向滚动的像素。
        const prop = top ? 'pageYOffset' : 'pageXOffset';
        // 返回滚动的距离  可以返回被卷去的高度 
        const method = top ? 'scrollTop' : 'scrollLeft';
        // 目标
        let ret = target[prop];

        if (typeof ret !== 'number') {
            ret = window.document.documentElement[method];
        }

        return ret;
    }

    function getOffset(element) {
        // 用于获取某个元素相对于视窗的位置集合
        const rect = element.getBoundingClientRect();

        const scrollTop = getScroll(window, true);
        const scrollLeft = getScroll(window);

        const docEl = window.document.body;
        // 当前元素块距离顶部的距离 
        const clientTop = docEl.clientTop || 0;
        const clientLeft = docEl.clientLeft || 0;
        // 返回距离左边和顶部的距离
        return {
            // 当前距离上面的高度 + 被卷起的高度 -当前元素块距离顶部的距离
            top: rect.top + scrollTop - clientTop,
            // 
            left: rect.left + scrollLeft - clientLeft
        };
    }

    export default {
        name: 'Affix',
        props: {
            offsetTop: {
                type: Number,
                default: 0
            },
            offsetBottom: {
                type: Number
            }
        },
        data () {
            return {
                affix: false,
                styles: {},
                slot: false,
                slotStyle: {}
            };
        },
        computed: {
            offsetType () {
                let type = 'top';
                if (this.offsetBottom >= 0) {
                    type = 'bottom';
                }

                return type;
            },
            classes () {
                return [
                    {
                        [`${prefixCls}`]: this.affix
                    }
                ];
            }
        },
        mounted () {
//            window.addEventListener('scroll', this.handleScroll, false);
//            window.addEventListener('resize', this.handleScroll, false);
            on(window, 'scroll', this.handleScroll);
            on(window, 'resize', this.handleScroll);
        },
        beforeDestroy () {
//            window.removeEventListener('scroll', this.handleScroll, false);
//            window.removeEventListener('resize', this.handleScroll, false);
            off(window, 'scroll', this.handleScroll);
            off(window, 'resize', this.handleScroll);
        },
        methods: {
            handleScroll () {
                const affix = this.affix;
                const scrollTop = getScroll(window, true);
                const elOffset = getOffset(this.$el);
                // 获取到页面高度
                const windowHeight = window.innerHeight;
                // 获取到当前目标的高度 内容高度+padding+边框
                const elHeight = this.$el.getElementsByTagName('div')[0].offsetHeight;

                // Fixed Top  固定在顶部   
                // 如果我们目标距离顶部的高度 减去 距离窗口顶部达到指定偏移量后触发 如果小于 滚动的高度
                // 并且offsetType 是top 并且 affix 取反
                if ((elOffset.top - this.offsetTop) < scrollTop && this.offsetType == 'top' && !affix) {
                    this.affix = true;
                    // 插槽样式
                    this.slotStyle = {
                        // 宽度 dom的 内容的可视高度（不包括边框，边距或滚动条） clientWidth=conter+padding
                        width: this.$refs.point.clientWidth + 'px',
                        height: this.$refs.point.clientHeight + 'px'
                    };
                    this.slot = true;
                    this.styles = {
                        top: `${this.offsetTop}px`,
                        left: `${elOffset.left}px`,
                        width: `${this.$el.offsetWidth}px`
                    };

                    this.$emit('on-change', true);
                } else if ((elOffset.top - this.offsetTop) > scrollTop && this.offsetType == 'top' && affix) {
                    this.slot = false;
                    this.slotStyle = {};
                    this.affix = false;
                    this.styles = null;

                    this.$emit('on-change', false);
                }

                // Fixed Bottom
                if ((elOffset.top + this.offsetBottom + elHeight) > (scrollTop + windowHeight) && this.offsetType == 'bottom' && !affix) {
                    this.affix = true;
                    this.styles = {
                        bottom: `${this.offsetBottom}px`,
                        left: `${elOffset.left}px`,
                        width: `${this.$el.offsetWidth}px`
                    };

                    this.$emit('on-change', true);
                } else if ((elOffset.top + this.offsetBottom + elHeight) < (scrollTop + windowHeight) && this.offsetType == 'bottom' && affix) {
                    this.affix = false;
                    this.styles = null;

                    this.$emit('on-change', false);
                }
            }
        }
    };
</script>
