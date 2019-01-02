<template>
    <!-- 栅格系统 -->
    <div :class="classes" :style="styles">
        <!-- 使用插槽 -->
        <slot></slot>
    </div>
</template>
<script>
    import { oneOf, findComponentDownward, findBrothersComponents } from '../../utils/assist';

    const prefixCls = 'ivu-row';

    export default {
        name: 'Row',
        props: {
            // 定义是什么排布
            type: {
                validator (value) {
                    return oneOf(value, ['flex']);
                }
            },
            // flex 布局下的垂直对齐方式
            align: {
                validator (value) {
                    return oneOf(value, ['top', 'middle', 'bottom']);
                }
            },
            //对齐方式
            justify: {
                validator (value) {
                    return oneOf(value, ['start', 'end', 'center', 'space-around', 'space-between']);
                }
            },
            // 栅格间距
            gutter: {
                type: Number,
                default: 0
            },
            // 自定义属性
            className: String
        },
        computed: {
            classes () {
                return [
                    {
                        [`${prefixCls}`]: !this.type,
                        [`${prefixCls}-${this.type}`]: !!this.type,
                        [`${prefixCls}-${this.type}-${this.align}`]: !!this.align,
                        [`${prefixCls}-${this.type}-${this.justify}`]: !!this.justify,
                        [`${this.className}`]: !!this.className
                    }
                ];
            },
            styles () {
                let style = {};
                if (this.gutter !== 0) {
                    style = {
                        marginLeft: this.gutter / -2 + 'px',
                        marginRight: this.gutter / -2 + 'px'
                    };
                }

                return style;
            }
        },
        methods: {
            updateGutter (val) {
                // 这里会嵌套寻找，把 Col 里的 Row 里的 Col 也找到，所以用 兄弟找
//                const Cols = findComponentsDownward(this, 'iCol');
                const Col = findComponentDownward(this, 'iCol');
                const Cols = findBrothersComponents(Col, 'iCol', false);
                if (Cols.length) {
                    Cols.forEach((child) => {
                        if (val !== 0) {
                            child.gutter = val;
                        }
                    });
                }
            }
        },
        watch: {
            gutter (val) {
                this.updateGutter(val);
            }
        }
    };
</script>
