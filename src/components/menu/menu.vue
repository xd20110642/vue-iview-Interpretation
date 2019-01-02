<template>
    <!-- 最顶层目录 -->
    <ul :class="classes" :style="styles">
        <!-- 插槽 -->
        <slot></slot>
    </ul>
</template>
<script>
    import { oneOf, findComponentsDownward, findComponentsUpward } from '../../utils/assist';
    import Emitter from '../../mixins/emitter';

    const prefixCls = 'ivu-menu';

    export default {
        name: 'Menu',
        mixins: [ Emitter ],
        props: {
            // 菜单类型
            mode: {
                validator (value) {
                    return oneOf(value, ['horizontal', 'vertical']);
                },
                default: 'vertical'
            },
            // 主题颜色 
            theme: {
                validator (value) {
                    return oneOf(value, ['light', 'dark', 'primary']);
                },
                default: 'light'
            },
            // 激活菜单的 name 值
            activeName: {
                type: [String, Number]
            },
            // 展开的 Submenu 的 name 集合  展开子菜单的合集
            openNames: {
                type: Array,
                default () {
                    return [];
                }
            },
            // 是否开启手风琴模式，开启后每次至多展开一个子菜单
            accordion: {
                type: Boolean,
                default: false
            },
            // 导航菜单的宽度，只在 mode="vertical" 时有效，如果使用 Col 等布局，建议设置为 auto
            width: {
                type: String,
                default: '240px'
            }
        },
        data () {
            return {
                // 当前活动名称
                currentActiveName: this.activeName,
                // 打开的活动name
                openedNames: []
            };
        },
        computed: {
            // 修改样式主题
            classes () {
                let theme = this.theme;
                if (this.mode === 'vertical' && this.theme === 'primary') theme = 'light';

                return [
                    `${prefixCls}`,
                    `${prefixCls}-${theme}`,
                    {
                        [`${prefixCls}-${this.mode}`]: this.mode
                    }
                ];
            },
            // 修改宽度
            styles () {
                let style = {};

                if (this.mode === 'vertical') style.width = this.width;

                return style;
            }
        },
        methods: {
            // 修改活动名称
            updateActiveName () {
                if (this.currentActiveName === undefined) {
                    this.currentActiveName = -1;
                }
                // 使用混合的广播   将其加入数组内
                this.broadcast('Submenu', 'on-update-active-name', false);
                this.broadcast('MenuItem', 'on-update-active-name', this.currentActiveName);
            },
            // 更新
            updateOpenKeys (name) {
                // 解构数组
                let names = [...this.openedNames];
                // 判断是否包含名字
                const index = names.indexOf(name);
                // 如果是手风琴模式 那么就不展示
                if (this.accordion) findComponentsDownward(this, 'Submenu').forEach(item => {
                    item.opened = false;
                });
                // 如果名字存在那么就进入
                if (index >= 0) {
                    let currentSubmenu = null;
                    // 向上查找组件
                    findComponentsDownward(this, 'Submenu').forEach(item => {
                        if (item.name === name) {
                            currentSubmenu = item;
                            item.opened = false;
                        }
                    });
                    findComponentsUpward(currentSubmenu, 'Submenu').forEach(item => {
                        item.opened = true;
                    });
                    findComponentsDownward(currentSubmenu, 'Submenu').forEach(item => {
                        item.opened = false;
                    });
                } else {
                    if (this.accordion) {
                        let currentSubmenu = null;
                        findComponentsDownward(this, 'Submenu').forEach(item => {
                            if (item.name === name) {
                                currentSubmenu = item;
                                item.opened = true;
                            }
                        });
                        findComponentsUpward(currentSubmenu, 'Submenu').forEach(item => {
                            item.opened = true;
                        });
                    } else {
                        findComponentsDownward(this, 'Submenu').forEach(item => {
                            if (item.name === name) item.opened = true;
                        });
                    }
                }
                let openedNames = findComponentsDownward(this, 'Submenu').filter(item => item.opened).map(item => item.name);
                this.openedNames = [...openedNames];
                this.$emit('on-open-change', openedNames);
            },
            updateOpened () {
                const items = findComponentsDownward(this, 'Submenu');

                if (items.length) {
                    items.forEach(item => {
                        if (this.openedNames.indexOf(item.name) > -1) item.opened = true;
                        else item.opened = false;
                    });
                }
            },
            handleEmitSelectEvent (name) {
                this.$emit('on-select', name);
            }
        },
        mounted () {
            this.updateActiveName();
            this.openedNames = [...this.openNames];
            this.updateOpened();
            this.$on('on-menu-item-select', (name) => {
                this.currentActiveName = name;
                this.$emit('on-select', name);
            });
        },
        watch: {
            openNames (names) {
                this.openedNames = names;
            },
            activeName (val) {
                this.currentActiveName = val;
            },
            currentActiveName () {
                this.updateActiveName();
            }
        }
    };
</script>
