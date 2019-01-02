<template>
    
    <div
        :class="[prefixCls]"
        v-click-outside="onClickoutside"
        @mouseenter="handleMouseenter"
        @mouseleave="handleMouseleave">
        <!-- 设置默认的内容 如果有自定义内容那么就显示插槽内容 -->
        <div :class="relClasses" ref="reference" @click="handleClick" @contextmenu.prevent="handleRightClick">
            <!-- 添加插槽 -->
            <slot></slot>
        </div>
        <!-- 添加动画过渡 -->
        <transition name="transition-drop">
            <!-- 使用组件  并且使用父子组件传递值   -->
            <Drop
                :class="dropdownCls"
                v-show="currentVisible"
                :placement="placement"
                ref="drop"
                @mouseenter.native="handleMouseenter"
                @mouseleave.native="handleMouseleave"
                :data-transfer="transfer"
                :transfer="transfer"
                v-transfer-dom>
                <!-- 使用具名插槽 -->
                <slot name="list"></slot>
            </Drop>
        </transition>
    </div>
</template>
<script>
    import Drop from '../select/dropdown.vue';
    import {directive as clickOutside} from 'v-click-outside-x';
    import TransferDom from '../../directives/transfer-dom';
    import { oneOf, findComponentUpward } from '../../utils/assist';

    const prefixCls = 'ivu-dropdown';

    export default {
        name: 'Dropdown',
        // 使用私有化指令
        directives: { clickOutside, TransferDom },
        components: { Drop },
        props: {
            // 触发的方式
            trigger: {
                validator (value) {
                    return oneOf(value, ['click', 'hover', 'custom', 'contextMenu']);
                },
                default: 'hover'
            },
            // 下拉菜单出现的位置
            placement: {
                validator (value) {
                    return oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
                },
                default: 'bottom'
            },
            // 手动控制下拉框的显示
            visible: {
                type: Boolean,
                default: false
            },
            // 是否将弹层放置于 body 内
            transfer: {
                type: Boolean,
                default () {
                    return !this.$IVIEW || this.$IVIEW.transfer === '' ? false : this.$IVIEW.transfer;
                }
            }
        },
        computed: {
            transition () {
                return ['bottom-start', 'bottom', 'bottom-end'].indexOf(this.placement) > -1 ? 'slide-up' : 'fade';
            },
            dropdownCls () {
                return {
                    [prefixCls + '-transfer']: this.transfer
                };
            },
            relClasses () {
                return [
                    `${prefixCls}-rel`,
                    {
                        [`${prefixCls}-rel-user-select-none`]: this.trigger === 'contextMenu'
                    }
                ];
            }
        },
        data () {
            return {
                prefixCls: prefixCls,
                currentVisible: this.visible//目前可见 等于手动控制的位置
            };
        },
        watch: {
            // 监听visble的变化  让currentVisible 等于最新的值
            visible (val) {
                this.currentVisible = val;
            },
            // 监听 currentVisible的变化  如果有变化 那么就使用 获取到DOM实例 的update()方法
            currentVisible (val) {
                if (val) {
                    this.$refs.drop.update();
                } else {
                    this.$refs.drop.destroy();
                }
                // 向父组件触发事件
                this.$emit('on-visible-change', val);
            }
        },
        methods: {
            handleClick () {
                if (this.trigger === 'custom') return false;
                if (this.trigger !== 'click') {
                    return false;
                }
                this.currentVisible = !this.currentVisible;
            },
            handleRightClick () {
                if (this.trigger === 'custom') return false;
                if (this.trigger !== 'contextMenu') {
                    return false;
                }
                this.currentVisible = !this.currentVisible;
            },
            handleMouseenter () {
                if (this.trigger === 'custom') return false;
                if (this.trigger !== 'hover') {
                    return false;
                }
                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.currentVisible = true;
                }, 250);
            },
            handleMouseleave () {
                if (this.trigger === 'custom') return false;
                if (this.trigger !== 'hover') {
                    return false;
                }
                if (this.timeout) {
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                        this.currentVisible = false;
                    }, 150);
                }
            },
            onClickoutside (e) {
                this.handleClose();
                this.handleRightClose();
                if (this.currentVisible) this.$emit('on-clickoutside', e);
            },
            handleClose () {
                if (this.trigger === 'custom') return false;
                if (this.trigger !== 'click') {
                    return false;
                }
                this.currentVisible = false;
            },
            handleRightClose () {
                if (this.trigger === 'custom') return false;
                if (this.trigger !== 'contextMenu') {
                    return false;
                }
                this.currentVisible = false;
            },
            hasParent () {
//                const $parent = this.$parent.$parent.$parent;
                const $parent = findComponentUpward(this, 'Dropdown');
                if ($parent) {
                    return $parent;
                } else {
                    return false;
                }
            }
        },
        mounted () {
            this.$on('on-click', (key) => {
                const $parent = this.hasParent();
                if ($parent) $parent.$emit('on-click', key);
            });
            this.$on('on-hover-click', () => {
                const $parent = this.hasParent();
                if ($parent) {
                    this.$nextTick(() => {
                        if (this.trigger === 'custom') return false;
                        this.currentVisible = false;
                    });
                    $parent.$emit('on-hover-click');
                } else {
                    this.$nextTick(() => {
                        if (this.trigger === 'custom') return false;
                        this.currentVisible = false;
                    });
                }
            });
            this.$on('on-haschild-click', () => {
                this.$nextTick(() => {
                    if (this.trigger === 'custom') return false;
                    this.currentVisible = true;
                });
                const $parent = this.hasParent();
                if ($parent) $parent.$emit('on-haschild-click');
            });
        }
    };
</script>
