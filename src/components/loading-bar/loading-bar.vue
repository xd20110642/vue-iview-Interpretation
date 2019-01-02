<template>
    <!-- 添加动画 -->
    <transition name="fade">
        <div :class="classes" :style="outerStyles" v-show="show">
            <div :class="innerClasses" :style="styles"></div>
        </div>
    </transition>
</template>
<script>
//    import { oneOf } from '../../utils/assist';

    const prefixCls = 'ivu-loading-bar';

    export default {
        props: {
//            percent: {
//                type: Number,
//                default: 0
//            },
            // 配置颜色
            color: {
                type: String,
                default: 'primary'
            },
            // 失败的颜色
            failedColor: {
                type: String,
                default: 'error'
            },
            // 高度
            height: {
                type: Number,
                default: 2
            },
//            status: {
//                type: String,
//                validator (value) {
//                    return oneOf(value, ['success', 'error']);
//                },
//                default: 'success'
//            },
//            show: {
//                type: Boolean,
//                default: false
//            }
        },
        data () {
            return {
                percent: 0,
//                color: 'primary',
//                failedColor: 'error',
//                height: 2,
                status: 'success',
                show: false
            };
        },
        computed: {
            classes () {
                return `${prefixCls}`;
            },
            innerClasses () {
                return [
                    `${prefixCls}-inner`,
                    {
                        [`${prefixCls}-inner-color-primary`]: this.color === 'primary' && this.status === 'success',
                        [`${prefixCls}-inner-failed-color-error`]: this.failedColor === 'error' && this.status === 'error'
                    }
                ];
            },
            outerStyles () {
                return {
                    height: `${this.height}px`
                };
            },
            styles () {
                let style = {
                    width: `${this.percent}%`,
                    height: `${this.height}px`
                };

                if (this.color !== 'primary' && this.status === 'success') {
                    style.backgroundColor = this.color;
                }

                if (this.failedColor !== 'error' && this.status === 'error') {
                    style.backgroundColor = this.failedColor;
                }

                return style;
            }
        }
    };
</script>
