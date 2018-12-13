<template>
    <!-- 插槽 类似ul -->
    <div :class="classes">
        <slot></slot>
    </div>
</template>
<script>
    const prefixCls = 'ivu-collapse';

    export default {
        name: 'Collapse',
        props: {
            // 是否开启手风琴模式，开启后每次至多展开一个面板
            accordion: {
                type: Boolean,
                default: false
            },
            // 当前激活的面板的 name，可以使用 v-model 双向绑定  也就是默认展示的
            value: {
                type: [Array, String]
            },
            // 是否开启简洁模式	
            simple: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                currentValue: this.value
            };
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-simple`]: this.simple
                    }
                ];
            }
        },
        mounted () {
            this.setActive();
        },
        methods: {
            setActive () {
                const activeKey = this.getActiveKey();
                // 遍历子组件
                this.$children.forEach((child, index) => {
                    const name = child.name || index.toString();

                    child.isActive = activeKey.indexOf(name) > -1;
                    child.index = index;
                });
            },
            getActiveKey () {
                // 获取到当前的值
                let activeKey = this.currentValue || [];
                // 是否设置手风琴模式
                const accordion = this.accordion;
                // 判断 activeKey是否是 数组  取反  如果不是数组 就转换为数组
                if (!Array.isArray(activeKey)) {
                    activeKey = [activeKey];
                }

                if (accordion && activeKey.length > 1) {
                    activeKey = [activeKey[0]];
                }

                for (let i = 0; i < activeKey.length; i++) {
                    activeKey[i] = activeKey[i].toString();
                }

                return activeKey;
            },
            toggle (data) {
                const name = data.name.toString();
                let newActiveKey = [];

                if (this.accordion) {
                    if (!data.isActive) {
                        newActiveKey.push(name);
                    }
                } else {
                    let activeKey = this.getActiveKey();
                    const nameIndex = activeKey.indexOf(name);

                    if (data.isActive) {
                        if (nameIndex > -1) {
                            activeKey.splice(nameIndex, 1);
                        }
                    } else {
                        if (nameIndex < 0) {
                            activeKey.push(name);
                        }
                    }

                    newActiveKey = activeKey;
                }

                this.currentValue = newActiveKey;
                this.$emit('input', newActiveKey);
                this.$emit('on-change', newActiveKey);
            }
        },
        watch: {
            value (val) {
                this.currentValue = val;
            },
            currentValue () {
                this.setActive();
            }
        }
    };
</script>
