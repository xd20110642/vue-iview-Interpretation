<template>
    <!-- 相当于ul  -->
    <div class="ivu-cell-group">
        <!-- 具名插槽 -->
        <slot></slot>
    </div>
</template>
<script>
    export default {
        name: 'CellGroup',
        // 这个是依赖注入    指定我们想要提供给后代组件的数据/方法
        provide () {
            return {
                cellGroup: this
            };
        },
        methods: {
            handleClick (name) {
                this.$emit('on-click', name);
            }
        }
    };
</script>