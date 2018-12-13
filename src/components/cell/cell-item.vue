<template>
    <!-- 展示详细的li -->
    <div class="ivu-cell-item">
        <div class="ivu-cell-icon">
            <!-- 具名插槽 展示图标 -->
            <slot name="icon"></slot>
        </div>
        <div class="ivu-cell-main">
            <div class="ivu-cell-title">
                <!-- 左侧标题 插槽没有使用  那么就默认显示title  -->
                <slot>{{ title }}</slot>
            </div>
            <div class="ivu-cell-label">
                <!-- 标题下方的描述信息	-->
                <slot name="label">
                    {{ label }}
                </slot>
            </div>
        </div>
        <div class="ivu-cell-footer">
            <span class="ivu-cell-extra">
                <!-- 右侧额外内容 -->
                <slot name="extra">{{ extra }}</slot>
            </span>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
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
        }
    };
</script>