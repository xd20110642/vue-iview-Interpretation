<template>
    <!-- 添加动画 指令 -->
    <div v-transfer-dom :data-transfer="transfer">
        <!-- 添加过渡效果 -->
        <transition name="fade">
            <!-- 遮罩层样式	 -->
            <div :class="maskClasses" :style="maskStyle" v-show="visible" v-if="mask" @click="handleMask"></div>
        </transition>
        <!--  -->
        <div :class="wrapClasses" @click="handleWrapClick">
            <!-- 动画 效果 这里面是拼接字符串-->
            <transition :name="'move-' + placement">
                <div :class="classes" :style="mainStyles" v-show="visible">
                    <!-- 获取到 content DOM实例-->
                    <div :class="contentClasses" ref="content">
                        <!-- 是否显示关闭按钮 -->
                        <a class="ivu-drawer-close" v-if="closable" @click="close">
                            <!-- 插槽 关闭的图标 -->
                            <slot name="close">
                                <Icon type="ios-close"></Icon>
                            </slot>
                        </a>
                        <!-- 抽屉的头部 -->
                        <div :class="[prefixCls + '-header']" v-if="showHead">
                            <!-- 头部插槽 -->
                            <slot name="header">
                                <div :class="[prefixCls + '-header-inner']">{{ title }}</div>
                            </slot>
                        </div>
                        <!-- 主要内容 -->
                        <div :class="[prefixCls + '-body']" :style="styles">
                            <slot></slot>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
    import Icon from '../icon';
    import { oneOf } from '../../utils/assist';
    import TransferDom from '../../directives/transfer-dom';
    import Emitter from '../../mixins/emitter';
    import ScrollbarMixins from '../modal/mixins-scrollbar';

    const prefixCls = 'ivu-drawer';

    export default {
        name: 'Drawer',
        mixins: [ Emitter, ScrollbarMixins ],
        components: { Icon },
        directives: { TransferDom },
        props: {
            // 抽屉是否显示 可以用v-model 来完成
            value: {
                type: Boolean,
                default: false
            },
            // 抽屉标题，如果使用 slot 自定义了页头，则 title 无效
            title: {
                type: String
            },
            // 宽度
            width: {
                type: [Number, String],
                default: 256
            },
            // 是否显示关闭按钮 
            closable: {
                type: Boolean,
                default: true
            },
            // 是否允许点击遮罩层关闭	
            maskClosable: {
                type: Boolean,
                default: true
            },
            // 是否显示遮罩层	
            mask: {
                type: Boolean,
                default: true
            },
            // 遮罩层样式	
            maskStyle: {
                type: Object
            },
            // 抽屉中间层的样式	
            styles: {
                type: Object
            },
            // 页面是否可以滚动
            scrollable: {
                type: Boolean,
                default: false
            },
            // 抽屉的方向
            placement: {
                validator (value) {
                    return oneOf(value, ['left', 'right']);
                },
                default: 'right'
            },
            // 层级
            zIndex: {
                type: Number,
                default: 1000
            },
            // 是否将抽屉放置于 body 内
            transfer: {
                type: Boolean,
                default () {
                    return !this.$IVIEW || this.$IVIEW.transfer === '' ? true : this.$IVIEW.transfer;
                }
            },
            // 设置抽屉容器.ivu-drawer-wrap的类名
            className: {
                type: String
            },
            // 是否设置抽屉在某个元素内打开，开启此属性时，应当关闭 transfer 属性	
            inner: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                prefixCls: prefixCls,
                visible: this.value,//就是是否显示
                wrapShow: false,
                showHead: true,
            };
        },
        computed: {
            wrapClasses () {
                return [
                    `${prefixCls}-wrap`,
                    {
                        [`${prefixCls}-hidden`]: !this.wrapShow,
                        [`${this.className}`]: !!this.className,
                        [`${prefixCls}-no-mask`]: !this.mask,
                        [`${prefixCls}-wrap-inner`]: this.inner
                    }
                ];
            },
            mainStyles () {
                let style = {};

                const width = parseInt(this.width);

                const styleWidth = {
                    width: width <= 100 ? `${width}%` : `${width}px`
                };

                Object.assign(style, styleWidth);

                return style;
            },
            contentClasses () {
                return [
                    `${prefixCls}-content`,
                    {
                        [`${prefixCls}-content-no-mask`]: !this.mask
                    }
                ];
            },
            classes () {
                return [
                    `${prefixCls}`,
                    `${prefixCls}-${this.placement}`,
                    {
                        [`${prefixCls}-no-header`]: !this.showHead,
                        [`${prefixCls}-inner`]: this.inner
                    }
                ];
            },
            maskClasses () {
                return [
                    `${prefixCls}-mask`,
                    {
                        [`${prefixCls}-mask-inner`]: this.inner
                    }
                ];
            }
        },
        methods: {
            // 点击关闭
            close () {
                this.visible = false;
                this.$emit('input', false);
                this.$emit('on-close');
            }, 
            // 点击蒙层关闭
            handleMask () {
                // 允许点击旁边可以关 
                if (this.maskClosable && this.mask) {
                    this.close();
                }
            },
            handleWrapClick (event) {
                // use indexOf,do not use === ,because ivu-modal-wrap can have other custom className
                const className = event.target.getAttribute('class');
                if (className && className.indexOf(`${prefixCls}-wrap`) > -1) this.handleMask();
            },
        },
        mounted () {
            if (this.visible) {
                this.wrapShow = true;
            }

            let showHead = true;

            if (this.$slots.header === undefined && !this.title) {
                showHead = false;
            }

            this.showHead = showHead;
        },
        beforeDestroy () {
            this.removeScrollEffect();
        },
        watch: {
            value (val) {
                this.visible = val;
            },
            visible (val) {
                if (val === false) {
                    this.timer = setTimeout(() => {
                        this.wrapShow = false;
                        this.removeScrollEffect();
                    }, 300);
                } else {
                    if (this.timer) clearTimeout(this.timer);
                    this.wrapShow = true;
                    if (!this.scrollable) {
                        this.addScrollEffect();
                    }
                }
                this.broadcast('Table', 'on-visible-change', val);
                this.broadcast('Slider', 'on-visible-change', val);  // #2852
                this.$emit('on-visible-change', val);
            },
            scrollable (val) {
                if (!val) {
                    this.addScrollEffect();
                } else {
                    this.removeScrollEffect();
                }
            },
            title (val) {
                if (this.$slots.header === undefined) {
                    this.showHead = !!val;
                }
            }
        }
    };
</script>