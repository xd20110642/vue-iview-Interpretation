<template>
    <!-- 这个是input输入框 -->
    <div :class="wrapClasses">
        <!-- 根据模板渲染 如果类型不是文本输入框的话 就渲染为input模板-->
        <template v-if="type !== 'textarea'">
            <div :class="[prefixCls + '-group-prepend']" v-if="prepend" v-show="slotReady">
                <!-- 具名插槽 -->
                <slot name="prepend"></slot>
            </div>
            <!-- i图标 -->
            <i class="ivu-icon" :class="['ivu-icon-ios-close-circle', prefixCls + '-icon', prefixCls + '-icon-clear' , prefixCls + '-icon-normal']" v-if="clearable && currentValue" @click="handleClear"></i>
            <i class="ivu-icon" :class="['ivu-icon-' + icon, prefixCls + '-icon', prefixCls + '-icon-normal']" v-else-if="icon" @click="handleIconClick"></i>
            <i class="ivu-icon ivu-icon-ios-search" :class="[prefixCls + '-icon', prefixCls + '-icon-normal', prefixCls + '-search-icon']" v-else-if="search && enterButton === false" @click="handleSearch"></i>
            <span class="ivu-input-suffix" v-else-if="showSuffix">
                <!-- 具名插槽 如果不使用插槽 那么就显示默认的内容 后图标具名插槽-->
                <slot name="suffix">
                    <i class="ivu-icon" :class="['ivu-icon-' + suffix]" v-if="suffix"></i>
                </slot
            ></span>
            <!-- 添加过度效果 -->
            <transition name="fade">
                <i class="ivu-icon ivu-icon-ios-loading ivu-load-loop" :class="[prefixCls + '-icon', prefixCls + '-icon-validate']" v-if="!icon"></i>
            </transition>
            <!-- 输入框 -->
            <input
                :id="elementId"
                :autocomplete="autocomplete"
                :spellcheck="spellcheck"
                ref="input"
                :type="type"
                :class="inputClasses"
                :placeholder="placeholder"
                :disabled="disabled"
                :maxlength="maxlength"
                :readonly="readonly"
                :name="name"
                :value="currentValue"
                :number="number"
                :autofocus="autofocus"
                @keyup.enter="handleEnter"
                @keyup="handleKeyup"
                @keypress="handleKeypress"
                @keydown="handleKeydown"
                @focus="handleFocus"
                @blur="handleBlur"
                @input="handleInput"
                @change="handleChange">
               <!-- 如果是 后置内容 那么就渲染 -->
            <div :class="[prefixCls + '-group-append']" v-if="append" v-show="slotReady">
                <!-- 具名插槽 后置内容插槽-->
                <slot name="append"></slot>
            </div>
            <!-- 如果是搜索 就渲染 -->
            <div :class="[prefixCls + '-group-append', prefixCls + '-search']" v-else-if="search && enterButton" @click="handleSearch">
                <i class="ivu-icon ivu-icon-ios-search" v-if="enterButton === true"></i>
                <!--  -->
                <!-- 如果不是 那么就按钮 -->
                <template v-else>{{ enterButton }}</template>
            </div>
            <span class="ivu-input-prefix" v-else-if="showPrefix">
                <!-- 输入框头部图标 插槽 -->
                <slot name="prefix">
                    <i class="ivu-icon" :class="['ivu-icon-' + prefix]" v-if="prefix"></i>
                </slot>
            </span>
        </template>
        <!-- 渲染为文本输入框 -->
        <textarea
            v-else
            :id="elementId"
            :wrap="wrap"
            :autocomplete="autocomplete"
            :spellcheck="spellcheck"
            ref="textarea"
            :class="textareaClasses"
            :style="textareaStyles"
            :placeholder="placeholder"
            :disabled="disabled"
            :rows="rows"
            :maxlength="maxlength"
            :readonly="readonly"
            :name="name"
            :value="currentValue"
            :autofocus="autofocus"
            @keyup.enter="handleEnter"
            @keyup="handleKeyup"
            @keypress="handleKeypress"
            @keydown="handleKeydown"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="handleInput">
        </textarea>
    </div>
</template>
<script>
    import { oneOf, findComponentUpward } from '../../utils/assist';
    import calcTextareaHeight from '../../utils/calcTextareaHeight';
    import Emitter from '../../mixins/emitter';

    const prefixCls = 'ivu-input';

    export default {
        name: 'Input',
        mixins: [ Emitter ],
        props: {
            // 输入的类别
            type: {
                validator (value) {
                    return oneOf(value, ['text', 'textarea', 'password', 'url', 'email', 'date']);
                },
                default: 'text'
            },
            // 值
            value: {
                type: [String, Number],
                default: ''
            },
            // 组件大小
            size: {
                validator (value) {
                    return oneOf(value, ['small', 'large', 'default']);
                },
                default () {
                    return !this.$IVIEW || this.$IVIEW.size === '' ? 'default' : this.$IVIEW.size;
                }
            },
            // 默认值
            placeholder: {
                type: String,
                default: ''
            },
            // 最大长度
            maxlength: {
                type: Number
            },
            // 是否允许点击
            disabled: {
                type: Boolean,
                default: false
            },
            // 输入框尾部图标，仅在 text 类型下有效
            icon: String,
            autosize: {
                type: [Boolean, Object],
                default: false
            },
            // 文本域默认行数，仅在 textarea 类型下有效
            rows: {
                type: Number,
                default: 2
            },
            //  是否只读
            readonly: {
                type: Boolean,
                default: false
            },
            // 
            name: {
                type: String
            },
            // 将用户的输入转换为 Number 类型
            number: {
                type: Boolean,
                default: false
            },
            // 自动获取焦点
            autofocus: {
                type: Boolean,
                default: false
            },
            //  对输入内容检查
            spellcheck: {
                type: Boolean,
                default: false
            },
            // 是否允许自动完成
            autocomplete: {
                validator (value) {
                    return oneOf(value, ['on', 'off']);
                },
                default: 'off'
            },
            // 是否显示清空按钮
            clearable: {
                type: Boolean,
                default: false
            },
            // 给表单元素设置 id，详见 Form 用法。
            elementId: {
                type: String
            },
            // 是否允许换行
            wrap: {
                validator (value) {
                    return oneOf(value, ['hard', 'soft']);
                },
                default: 'soft'
            },
            // 输入框头部图标
            prefix: {
                type: String,
                default: ''
            },
            // 输入框尾部图标
            suffix: {
                type: String,
                default: ''
            },
            // 是否显示为搜索型输入框
            search: {
                type: Boolean,
                default: false
            },
            // 开启 search 时可用，是否有确认按钮，可设为按钮文字
            enterButton: {
                type: [Boolean, String],
                default: false
            }
        },
        data () {
            return {
                currentValue: this.value,//获取到当前值
                prefixCls: prefixCls,//
                prepend: true,//前置
                append: true,//附加
                slotReady: false,//插槽是否就绪
                textareaStyles: {},//文本输入框的样式
                showPrefix: false,//是否展示前置
                showSuffix: false//是否展示后置
            };
        },
        computed: {
            wrapClasses () {
                return [
                    `${prefixCls}-wrapper`,
                    {
                        [`${prefixCls}-wrapper-${this.size}`]: !!this.size,
                        [`${prefixCls}-type`]: this.type,
                        [`${prefixCls}-group`]: this.prepend || this.append || (this.search && this.enterButton),
                        [`${prefixCls}-group-${this.size}`]: (this.prepend || this.append || (this.search && this.enterButton)) && !!this.size,
                        [`${prefixCls}-group-with-prepend`]: this.prepend,
                        [`${prefixCls}-group-with-append`]: this.append || (this.search && this.enterButton),
                        [`${prefixCls}-hide-icon`]: this.append,  // #554
                        [`${prefixCls}-with-search`]: (this.search && this.enterButton)
                    }
                ];
            },
            inputClasses () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-${this.size}`]: !!this.size,
                        [`${prefixCls}-disabled`]: this.disabled,
                        [`${prefixCls}-with-prefix`]: this.showPrefix,
                        [`${prefixCls}-with-suffix`]: this.showSuffix || (this.search && this.enterButton === false)
                    }
                ];
            },
            textareaClasses () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-disabled`]: this.disabled
                    }
                ];
            }
        },
        methods: {
            handleEnter (event) {
                this.$emit('on-enter', event);
                if (this.search) this.$emit('on-search', this.currentValue);
            },
            handleKeydown (event) {
                this.$emit('on-keydown', event);
            },
            handleKeypress(event) {
                this.$emit('on-keypress', event);
            },
            handleKeyup (event) {
                this.$emit('on-keyup', event);
            },
            handleIconClick (event) {
                this.$emit('on-click', event);
            },
            handleFocus (event) {
                this.$emit('on-focus', event);
            },
            handleBlur (event) {
                this.$emit('on-blur', event);
                if (!findComponentUpward(this, ['DatePicker', 'TimePicker', 'Cascader', 'Search'])) {
                    this.dispatch('FormItem', 'on-form-blur', this.currentValue);
                }
            },
            handleInput (event) {
                let value = event.target.value;
                if (this.number && value !== '') value = Number.isNaN(Number(value)) ? value : Number(value);
                this.$emit('input', value);
                this.setCurrentValue(value);
                this.$emit('on-change', event);
            },
            handleChange (event) {
                this.$emit('on-input-change', event);
            },
            setCurrentValue (value) {
                if (value === this.currentValue) return;
                this.$nextTick(() => {
                    this.resizeTextarea();
                });
                this.currentValue = value;
                if (!findComponentUpward(this, ['DatePicker', 'TimePicker', 'Cascader', 'Search'])) {
                    this.dispatch('FormItem', 'on-form-change', value);
                }
            },
            resizeTextarea () {
                const autosize = this.autosize;
                if (!autosize || this.type !== 'textarea') {
                    return false;
                }

                const minRows = autosize.minRows;
                const maxRows = autosize.maxRows;

                this.textareaStyles = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
            },
            focus () {
                if (this.type === 'textarea') {
                    this.$refs.textarea.focus();
                } else {
                    this.$refs.input.focus();
                }
            },
            blur () {
                if (this.type === 'textarea') {
                    this.$refs.textarea.blur();
                } else {
                    this.$refs.input.blur();
                }
            },
            handleClear () {
                const e = { target: { value: '' } };
                this.$emit('input', '');
                this.setCurrentValue('');
                this.$emit('on-change', e);
            },
            handleSearch () {
                if (this.disabled) return false;
                this.$refs.input.focus();
                this.$emit('on-search', this.currentValue);
            }
        },
        watch: {
            value (val) {
                this.setCurrentValue(val);
            }
        },
        mounted () {
            if (this.type !== 'textarea') {
                this.prepend = this.$slots.prepend !== undefined;
                this.append = this.$slots.append !== undefined;
                this.showPrefix = this.prefix !== '' || this.$slots.prefix !== undefined;
                this.showSuffix = this.suffix !== '' || this.$slots.suffix !== undefined;
            } else {
                this.prepend = false;
                this.append = false;
            }
            this.slotReady = true;
            this.resizeTextarea();
        }
    };
</script>
