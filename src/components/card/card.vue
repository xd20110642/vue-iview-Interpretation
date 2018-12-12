<template>
    <div :class="classes">
        <div :class="headClasses" v-if="showHead">
            <!-- 具名插槽 如果使用的时候没有传入内容  那么就会默认渲染 插槽里面的内容-->
            <slot name="title">
                <!-- title 是父组件传递的 -->
            <p v-if="title">
                <Icon v-if="icon" :type="icon"></Icon>
                <span>{{title}}</span>
            </p>
            </slot>
        </div>
        <div :class="extraClasses" v-if="showExtra">
            <!-- 具名插槽  额外显示的内容-->
            <slot name="extra"></slot>
            </div>
        <div :class="bodyClasses" :style="bodyStyles">
            <!-- 普通插槽 显示没有匹配到的其他数据-->
            <slot></slot>
        </div>
    </div>
</template>
<script>
    const prefixCls = 'ivu-card';
    const defaultPadding = 16;
    import Icon from '../icon/icon.vue';

    export default {
        name: 'Card',
        components: { Icon },
        props: {
            bordered: {
                type: Boolean,
                default: true
            },
            disHover: {
                type: Boolean,
                default: false
            },
            shadow: {
                type: Boolean,
                default: false
            },
            padding: {
                type: Number,
                default: defaultPadding
            },
            title: {
                type: String,
            },
            icon: {
                type: String,
            }
        },
        data () {
            return {
                showHead: true,
                showExtra: true
            };
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-bordered`]: this.bordered && !this.shadow,
                        [`${prefixCls}-dis-hover`]: this.disHover || this.shadow,
                        [`${prefixCls}-shadow`]: this.shadow
                    }
                ];
            },
            headClasses () {
                return `${prefixCls}-head`;
            },
            extraClasses () {
                return `${prefixCls}-extra`;
            },
            bodyClasses () {
                return `${prefixCls}-body`;
            },
            bodyStyles () {
                if (this.padding !== defaultPadding) {
                    return {
                        padding: `${this.padding}px`
                    };
                } else {
                    return '';
                }
            }
        },
        mounted () {
            // 判断是否显示头部  根据传入的title 和获取到插槽实例的值   this.$slots.title 获取到的是插槽的值
            this.showHead = this.title || this.$slots.title !== undefined;
            // 同上
            this.showExtra = this.$slots.extra !== undefined;
        }
    };
</script>
