<template>
    <!-- 插槽 -->
    <div :class="wrapClasses"><slot></slot></div>
</template>
<script>
    const prefixCls = 'ivu-layout';
    export default {
        name: 'Header',
        computed: {
            wrapClasses () {
                return `${prefixCls}-header`;
            }
        }
    };
</script>