<template>
    <div :class="classes" :style="styles" @click="back">
        <slot>
            <div :class="innerClasses">
                <i class="ivu-icon ivu-icon-ios-arrow-up"></i>
            </div>
        </slot>
    </div>
</template>
<script>
// 引入滚动函数
    import { scrollTop } from '../../utils/assist';
    import { on, off } from '../../utils/dom';
    const prefixCls = 'ivu-back-top';

    export default {
        props: {
            height: {
                type: Number,
                default: 400
            },
            bottom: {
                type: Number,
                default: 30
            },
            right: {
                type: Number,
                default: 30
            },
            duration: {
                type: Number,
                default: 1000
            }
        },
        data () {
            return {
                backTop: false
            };
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
        computed: {
            classes () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-show`]: this.backTop
                    }
                ];
            },
            styles () {
                return {
                    bottom: `${this.bottom}px`,
                    right: `${this.right}px`
                };
            },
            innerClasses () {
                return `${prefixCls}-inner`;
            }
        },
        methods: {
            handleScroll () {
                // 是否显示跳转按钮  当页面的垂直距离大于了 我们设置的高度 就会显示
                this.backTop = window.pageYOffset >= this.height;
            },
            back () {//回到首页 
            // 获取当前页面滚动条的纵坐标的位置
                const sTop = document.documentElement.scrollTop || document.body.scrollTop;
                scrollTop(window, sTop, 0, this.duration);
                this.$emit('on-click');
            }
        }
    };
</script>
