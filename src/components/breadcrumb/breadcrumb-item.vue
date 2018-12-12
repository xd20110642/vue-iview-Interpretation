<template>
    <!-- 这个是单个的列表 -->
    <span>
        <!-- 如果传入了链接 那么就渲染链接 没有的话 那么就渲染路由 -->
        <a
            v-if="to"
            :href="linkUrl"
            :target="target"
            :class="linkClasses"
            @click.exact="handleCheckClick($event, false)"
            @click.ctrl="handleCheckClick($event, true)"
            @click.meta="handleCheckClick($event, true)">
            <!-- 插槽 -->
            <slot></slot>
        </a>
        <span v-else :class="linkClasses">
            <slot></slot>
        </span>
        <!-- 自定义分割符号 separator 如果传入了separator 那么就不显示默认的-->
        <span :class="separatorClasses" v-html="separator" v-if="!showSeparator"></span>
        <span :class="separatorClasses" v-else>
            <!-- 使用具名插槽 -->
            <slot name="separator"></slot>
        </span>
    </span>
</template>
<script>
    import mixinsLink from '../../mixins/link';
    const prefixCls = 'ivu-breadcrumb-item';

    export default {
        name: 'BreadcrumbItem',
        // 使用混合 然后使用跳转模式
        mixins: [ mixinsLink ],
        props: {

        },
        data () {
            return {
                separator: '',
                showSeparator: false
            };
        },
        computed: {
            linkClasses () {
                return `${prefixCls}-link`;
            },
            separatorClasses () {
                return `${prefixCls}-separator`;
            }
        },
        mounted () {
            this.showSeparator = this.$slots.separator !== undefined;
        }
    };
</script>
