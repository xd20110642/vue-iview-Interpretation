<template>
    <!-- 类似于li -->
    <div :class="itemClasses">
        <!-- 头部组件 -->
        <div :class="headerClasses" @click="toggle">
            <!-- 图标组件 -->
            <Icon type="ios-arrow-forward" v-if="!hideArrow"></Icon>
            <!-- 普通插槽 -->
            <slot></slot>
        </div>
        <!-- 添加动画效果组件 -->
        <collapse-transition>
            <div :class="contentClasses" v-show="isActive">
                <div :class="boxClasses">
                    <!-- 具名插槽 -->
                    <slot name="content"></slot>
                </div>
            </div>
        </collapse-transition>
    </div>
</template>
<script>
    import Icon from '../icon/icon.vue';
    import CollapseTransition from '../base/collapse-transition';
    const prefixCls = 'ivu-collapse';

    export default {
        name: 'Panel',
        components: { Icon, CollapseTransition },
        props: {
            // 当前面板的 name，与 Collapse的value对应，不填为索引值
            name: {
                type: String
            },
            // 隐藏箭头
            hideArrow: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                index: 0, // use index for default when name is null
                isActive: false
            };
        },
        computed: {
            itemClasses () {
                return [
                    `${prefixCls}-item`,
                    {
                        [`${prefixCls}-item-active`]: this.isActive
                    }
                ];
            },
            headerClasses () {
                return `${prefixCls}-header`;
            },
            contentClasses () {
                return `${prefixCls}-content`;
            },
            boxClasses () {
                return `${prefixCls}-content-box`;
            }
        },
        methods: {
            toggle () {
                this.$parent.toggle({
                    name: this.name || this.index,
                    isActive: this.isActive
                });
            }
        }
    };
</script>
