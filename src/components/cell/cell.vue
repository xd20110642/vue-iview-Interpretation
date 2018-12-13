<template>
    <div :class="classes">
        <!-- a链接 -->
        <a
            v-if="to"
            :href="linkUrl"
            :target="target"
            class="ivu-cell-link"
            @click.exact="handleClickItem($event, false)"
            @click.ctrl="handleClickItem($event, true)"
            @click.meta="handleClickItem($event, true)">
            <!-- 渲染 单个内容 -->
            <CellItem :title="title" :label="label" :extra="extra">
                <!-- 渲染具名插槽 如果没有使用插槽 那么就渲染 组件只带的 -->
                <slot name="icon" slot="icon"></slot>
                <slot slot="default"></slot>
                <slot name="extra" slot="extra"></slot>
                <slot name="label" slot="label"></slot>
            </CellItem>
        </a>
        <!-- 渲染为路由链接 -->
        <div class="ivu-cell-link" v-else @click="handleClickItem">
            <CellItem :title="title" :label="label" :extra="extra">
                <slot name="icon" slot="icon"></slot>
                <slot slot="default"></slot>
                <slot name="extra" slot="extra"></slot>
                <slot name="label" slot="label"></slot>
            </CellItem>
        </div>
        <div class="ivu-cell-arrow" v-if="to">
            <slot name="arrow">
                <Icon type="ios-arrow-forward"></Icon>
            </slot>
        </div>
    </div>
</template>
<script>
    import CellItem from './cell-item.vue';
    import Icon from '../icon/icon.vue';
    import mixinsLink from '../../mixins/link';

    const prefixCls = 'ivu-cell';

    export default {
        name: 'Cell',
        // 接受来自 父组件的方法
        inject: ['cellGroup'],
        mixins: [ mixinsLink ],
        components: { CellItem, Icon },
        props: {
            name: {
                type: [String, Number]
            },
            title: {
                type: String,
                default: ''
            },
            label: {
                type: String,
                default: ''
            },
            extra: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            },
            selected: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                prefixCls: prefixCls
            };
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-disabled`]: this.disabled,
                        [`${prefixCls}-selected`]: this.selected,
                        [`${prefixCls}-with-link`]: this.to
                    }
                ];
            },
        },
        methods: {
            handleClickItem (event, new_window) {
                this.cellGroup.handleClick(this.name);

                this.handleCheckClick(event, new_window);
            }
        }
    };
</script>