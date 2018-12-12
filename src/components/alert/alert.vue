<template>
    <transition name="fade">
        <div v-if="!closed" :class="wrapClasses">
            <span :class="iconClasses" v-if="showIcon">
                <!-- 这里定义了一个具名插槽 -->
                <slot name="icon">
                    <!-- 使用组件 -->
                    <Icon :type="iconType"></Icon>
                </slot>
            </span>
            <span :class="messageClasses">
                <!-- 定义了一个普通插槽 -->
                <slot></slot>
            </span>
            <span :class="descClasses">
                <!-- 定义了一个具名插槽 -->
                <slot name="desc"></slot>
            </span>
            <a :class="closeClasses" v-if="closable" @click="close">
                <!-- 具名插槽 -->
                <slot name="close">
                    <!-- 使用组件 -->
                    <Icon type="ios-close"></Icon>
                </slot>
            </a>
        </div>
    </transition>
</template>
<script>
    import Icon from '../icon';
    import { oneOf } from '../../utils/assist';

    const prefixCls = 'ivu-alert';

    export default {
        name: 'Alert',
        components: { Icon },
        // 定义从父组件传递过来的数据
        props: {
            type: {
                // 定义校验规则
                validator (value) {
                    return oneOf(value, ['success', 'info', 'warning', 'error']);
                },
                // 默认值
                default: 'info'
            },
            closable: {
                type: Boolean,
                default: false
            },
            showIcon: {
                type: Boolean,
                default: false
            },
            banner: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                closed: false,
                desc: false
            };
        },
        computed: {
            // 动态计算class属性  
            wrapClasses () {
                // 返回一个数组
                return [
                    `${prefixCls}`,
                    `${prefixCls}-${this.type}`,
                    {
                        [`${prefixCls}-with-icon`]: this.showIcon,
                        [`${prefixCls}-with-desc`]: this.desc,
                        [`${prefixCls}-with-banner`]: this.banner
                    }
                ];
            },
            messageClasses () {
                return `${prefixCls}-message`;
            },
            descClasses () {
                return `${prefixCls}-desc`;
            },
            closeClasses () {
                return `${prefixCls}-close`;
            },
            iconClasses () {
                return `${prefixCls}-icon`;
            },
            iconType () {
                let type = '';

                switch (this.type) {
                    case 'success':
                        type = 'ios-checkmark-circle';
                        break;
                    case 'info':
                        type = 'ios-information-circle';
                        break;
                    case 'warning':
                        type = 'ios-alert';
                        break;
                    case 'error':
                        type = 'ios-close-circle';
                        break;
                }

                if (this.desc) type += '-outline';
                return type;
            }
        },
        methods: {
            close (e) {
                this.closed = true;
                // 向父组件传递事件
                this.$emit('on-close', e);
            }
        },
        mounted () {
            // this.$slots访问插槽里面的内容
            this.desc = this.$slots.desc !== undefined;
        }
    };
</script>
