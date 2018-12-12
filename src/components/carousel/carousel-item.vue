<template>
    <!-- 下面的轮播实例 单独一项一项的 类似 ul 下面的li-->
    <div :class="prefixCls" :style="styles">
        <!-- 插槽 -->
        <slot></slot>
    </div>
</template>
<script>
    const prefixCls = 'ivu-carousel-item';

    export default {
        componentName: 'carousel-item',
        name: 'CarouselItem',
        data () {
            return {
                prefixCls: prefixCls,
                width: 0,
                height: 'auto',
                left: 0
            };
        },
        computed: {
            // 动态计算样式
            styles () {
                return {
                    width: `${this.width}px`,
                    height: `${this.height}`,
                    left: `${this.left}px`
                };
            }
        },
        mounted () {
            // 获取到父组件的实例上面的方法 
            this.$parent.slotChange();
        },
        watch: {
            // val是新值 old后面是旧值
            width (val) {
                // 如果新值的出现 和父组件的同时存在 那么就使用异步更新父组件的 初始化赋值
                if (val && this.$parent.loop) {
                    this.$nextTick(() => {
                        this.$parent.initCopyTrackDom();
                    });
                }
            },
            height (val) {
                // 高度同上
                if (val && this.$parent.loop) {
                    this.$nextTick(() => {
                        this.$parent.initCopyTrackDom();
                    });
                }
            }
        },
        beforeDestroy () {
            // 生命周期执行 插槽改变事件
            this.$parent.slotChange();
        }
    };
</script>
