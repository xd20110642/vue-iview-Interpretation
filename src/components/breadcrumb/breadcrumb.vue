<template>
    <div :class="classes">
        <!-- 使用插槽 -->
        <slot></slot>
    </div>
</template>
<script>
    const prefixCls = 'ivu-breadcrumb';

    export default {
        name: 'Breadcrumb',
        props: {
            separator: {
                type: String,
                default: '/'
            }
        },
        computed: {
            classes () {
                return `${prefixCls}`;
            }
        },
        mounted () {
            this.updateChildren();
        },
        updated () {
            this.$nextTick(() => {
                this.updateChildren();
            });
        },
        methods: {
            updateChildren () {
                // 遍历
                this.$children.forEach((child) => {
                    child.separator = this.separator;
                });
            }
        },
        watch: {
            separator () {
                this.updateChildren();
            }
        }
    };
</script>
