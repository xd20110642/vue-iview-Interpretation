<template>
    <!-- 点击旁边文字 我跳入选择框 li-->
    <label :class="wrapClasses">
        <span :class="checkboxClasses">
            <span :class="innerClasses"></span>
            <!-- 如果是数组 就渲染这个-->
            <input
                v-if="group"
                type="checkbox"
                :class="inputClasses"
                :disabled="disabled"
                :value="label"
                v-model="model"
                :name="name"
                @change="change"
                @focus="onFocus"
                @blur="onBlur">
            <input
                v-else
                type="checkbox"
                :class="inputClasses"
                :disabled="disabled"
                :checked="currentValue"
                :name="name"
                @change="change"
                @focus="onFocus"
                @blur="onBlur">
        </span>
        <!-- 普通插槽 -->
        <slot>
            <span v-if="showSlot">{{ label }}</span>
        </slot>
    </label>
</template>
<script>
    import { findComponentUpward, oneOf } from '../../utils/assist';
    import Emitter from '../../mixins/emitter';

    const prefixCls = 'ivu-checkbox';

    export default {
        name: 'Checkbox',
        // 混合
        mixins: [ Emitter ],
        props: {
            // 是否允许点击
            disabled: {
                type: Boolean,
                default: false
            },
            // 单独使用可用 只在单独使用时有效。可以使用 v-model 双向绑定数据	
            value: {
                type: [String, Number, Boolean],
                default: false
            },
            // 选中的值
            trueValue: {
                type: [String, Number, Boolean],
                default: true
            },
            // 
            falseValue: {
                type: [String, Number, Boolean],
                default: false
            },
            //  只在组合使用时有效。指定当前选项的 value 值，组合会自动判断是否选中
            label: {
                type: [String, Number, Boolean]
            },
            // 全选的状态
            indeterminate: {
                type: Boolean,
                default: false
            },
            size: {
                validator (value) {
                    return oneOf(value, ['small', 'large', 'default']);
                },
                default () {
                    return !this.$IVIEW || this.$IVIEW.size === '' ? 'default' : this.$IVIEW.size;
                }
            },
            name: {
                type: String
            }
        },
        data () {
            return {
                model: [],
                currentValue: this.value,//当前值
                group: false,//是否是组
                showSlot: true,
                parent: findComponentUpward(this, 'CheckboxGroup'),//查找父组件
                focusInner: false
            };
        },
        computed: {
            wrapClasses () {
                return [
                    `${prefixCls}-wrapper`,
                    {
                        [`${prefixCls}-group-item`]: this.group,
                        [`${prefixCls}-wrapper-checked`]: this.currentValue,
                        [`${prefixCls}-wrapper-disabled`]: this.disabled,
                        [`${prefixCls}-${this.size}`]: !!this.size
                    }
                ];
            },
            checkboxClasses () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-checked`]: this.currentValue,
                        [`${prefixCls}-disabled`]: this.disabled,
                        [`${prefixCls}-indeterminate`]: this.indeterminate
                    }
                ];
            },
            innerClasses () {
                return [
                    `${prefixCls}-inner`,
                    {
                        [`${prefixCls}-focus`]: this.focusInner
                    }
                ];
            },
            inputClasses () {
                return `${prefixCls}-input`;
            }
        },
        mounted () {
            // 查找父组件 CheckboxGroup组件
            this.parent = findComponentUpward(this, 'CheckboxGroup');
            if (this.parent) {//如果向上能够查询到组件 那么就展示数组的形式
                this.group = true;
            }

            if (this.group) {
                this.parent.updateModel(true);
            } else {
                this.updateModel();
                this.showSlot = this.$slots.default !== undefined;
            }
        },
        methods: {
            // 监听事件
            change (event) {
                // 如果是禁止点击 那么就返回；
                if (this.disabled) {
                    return false;
                }
                // 获取到选中的值
                const checked = event.target.checked;
                // 当前值 等于 选中的值
                this.currentValue = checked;
                // value值等于 checked 存在 那么就是 被选中值 否则就是  没有选中的值
                const value = checked ? this.trueValue : this.falseValue;
                // 向父组件 传递事件
                this.$emit('input', value);
                // 如果是数组
                if (this.group) {
                    this.parent.change(this.model);
                } else {
                    this.$emit('on-change', value);
                    this.dispatch('FormItem', 'on-form-change', value);
                }
            },
            // 更新模型
            updateModel () {
                // 当前值  等于  value  也等于 选中的值
                this.currentValue = this.value === this.trueValue;
            },
            // 失去焦点
            onBlur () {
                this.focusInner = false;
            },
            // 获得焦点
            onFocus () {
                this.focusInner = true;
            }
        },
        watch: {
            // 监听把valuet值 如果当前新的值 等于选中的值 并且  新的值  等于 没有选中  那么就更新视图
            value (val) {
                if (val === this.trueValue || val === this.falseValue) {
                    this.updateModel();
                } else {
                    throw 'Value should be trueValue or falseValue.';
                }
            }
        }
    };
</script>
