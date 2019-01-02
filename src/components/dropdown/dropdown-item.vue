<template>
    <!-- 使用插槽 -->
    <li :class="classes" @click="handleClick"><slot></slot></li>
</template>
<script>
    const prefixCls = 'ivu-dropdown-item';
    import { findComponentUpward } from '../../utils/assist';
    export default {
        name: 'DropdownItem',
        props: {
            name: {
                type: [String, Number]
            },
            disabled: {
                type: Boolean,
                default: false
            },
            selected: {
                type: Boolean,
                default: false
            },
            divided: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-disabled`]: this.disabled,
                        [`${prefixCls}-selected`]: this.selected,
                        [`${prefixCls}-divided`]: this.divided
                    }
                ];
            }
        },
        methods: {
            handleClick () {
                // 向上查找Dropdown 组件 并且赋值为父组件
                const $parent = findComponentUpward(this, 'Dropdown');
                // 父组件
                const hasChildren = this.$parent && this.$parent.$options.name === 'Dropdown';
                // 是否允许点击
                if (this.disabled) {
                    // 异步更新数据
                    this.$nextTick(() => {
                        $parent.currentVisible = true;
                    });
                } else if (hasChildren) {
                    // 如果有子组件 那么就想父组件传递事件
                    this.$parent.$emit('on-haschild-click');
                } else {
                    if ($parent && $parent.$options.name === 'Dropdown') {
                        $parent.$emit('on-hover-click');
                    }
                }
                // 向父组件传递事件 并且携带接受的name
                $parent.$emit('on-click', this.name);
            }
        }
    };
</script>
