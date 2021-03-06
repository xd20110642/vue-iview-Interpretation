<template>
    <div :class="classes">
        <!-- 显示左边的箭头图标 上一张-->
        <button type="button" :class="arrowClasses" class="left" @click="arrowEvent(-1)">
            <!-- 使用图标组件 -->
            <Icon type="ios-arrow-back"></Icon>
        </button>
        <!-- 内容显示区域 -->
        <div :class="[prefixCls + '-list']">
            <!-- 起始内容 -->
            <div :class="[prefixCls + '-track', showCopyTrack ? '' : 'higher']" :style="trackStyles" ref="originTrack">
                <!-- 插槽 这个地方就是存放 carousel-item的地方-->
                <slot></slot>
            </div>
            <!-- 判断是否循环播放 这个是复制的内容-->
            <div :class="[prefixCls + '-track', showCopyTrack ? 'higher' : '']" :style="copyTrackStyles" ref="copyTrack" v-if="loop">
            </div>
        </div>
        <!-- 右边的按钮 也就是下一张 -->
        <button type="button" :class="arrowClasses" class="right" @click="arrowEvent(1)">
            <Icon type="ios-arrow-forward"></Icon>
        </button>
        <!-- 下面的小图标的位置 -->
        <ul :class="dotsClasses">
            <!-- 个数为 幻灯片的长度 -->
            <template v-for="(n,a) in slides.length" >
                <li :class="[n - 1 === currentIndex ? prefixCls + '-active' : '']"
                    @click="dotsEvent('click', n - 1)"
                    @mouseover="dotsEvent('hover', n - 1)"
                    :key="a"
                    >
                    <button type="button" :class="[radiusDot ? 'radius' : '']"></button>
                </li>
            </template>
        </ul>
    </div>
</template>
<script>
    import Icon from '../icon/icon.vue';
    import { getStyle, oneOf } from '../../utils/assist';
    // 引入监听事件 取消监听事件
    import { on, off } from '../../utils/dom';

    const prefixCls = 'ivu-carousel';

    export default {
        name: 'Carousel',
        components: { Icon },
        props: {
            // 选择触发箭头显示的方式
            arrow: {
                type: String,
                default: 'hover',
                validator (value) {
                    return oneOf(value, ['hover', 'always', 'never']);
                }
            },
            // 是否自动轮播
            autoplay: {
                type: Boolean,
                default: false
            },
            // 轮播时间
            autoplaySpeed: {
                type: Number,
                default: 2000
            },
            // 是否循环
            loop: {
                type: Boolean,
                default: false
            },
            // 选择动画效果
            easing: {
                type: String,
                default: 'ease'
            },
            // 选择指示器的位置
            dots: {
                type: String,
                default: 'inside',
                validator (value) {
                    return oneOf(value, ['inside', 'outside', 'none']);
                }
            },
            // 是否显示圆形指示器
            radiusDot: {
                type: Boolean,
                default: false
            },
            // 现在指示器的触发方式
            trigger: {
                type: String,
                default: 'click',
                validator (value) {
                    return oneOf(value, ['click', 'hover']);
                }
            },
            // 幻灯片的索引值
            value: {
                type: Number,
                default: 0
            },
            // 图片的高度
            height: {
                type: [String, Number],
                default: 'auto',
                validator (value) {
                    return value === 'auto' || Object.prototype.toString.call(value) === '[object Number]';
                }
            }
        },
        data () {
            return {
                prefixCls: prefixCls,
                listWidth: 0,
                trackWidth: 0,
                trackOffset: 0,
                trackCopyOffset: 0,
                showCopyTrack: false,
                slides: [],
                slideInstances: [],
                timer: null,
                ready: false,
                currentIndex: this.value,//幻灯片的索引值
                trackIndex: this.value,//
                copyTrackIndex: this.value,
                hideTrackPos: -1, // 默认左滑
            };
        },
        computed: {
            classes () {
                return [
                    `${prefixCls}`
                ];
            },
            // 显示原本内容 
            trackStyles () {
                return {
                    width: `${this.trackWidth}px`,
                    // div移动 x轴移动
                    transform: `translate3d(${-this.trackOffset}px, 0px, 0px)`,
                    // 添加过度动画
                    transition: `transform 500ms ${this.easing}`
                };
            },
            copyTrackStyles () {
                return {
                    width: `${this.trackWidth}px`,
                    transform: `translate3d(${-this.trackCopyOffset}px, 0px, 0px)`,
                    transition: `transform 500ms ${this.easing}`,
                    position: 'absolute',
                    top: 0
                };
            },
            arrowClasses () {
                return [
                    `${prefixCls}-arrow`,
                    `${prefixCls}-arrow-${this.arrow}`
                ];
            },
            dotsClasses () {
                return [
                    `${prefixCls}-dots`,
                    `${prefixCls}-dots-${this.dots}`
                ];
            }
        },
        methods: {
            // find option component  cd为回调函数
            findChild (cb) {
                const find = function (child) {
                    const name = child.$options.componentName;

                    if (name) {
                        cb(child);
                    } else if (child.$children.length) {
                        child.$children.forEach((innerChild) => {
                            find(innerChild, cb);
                        });
                    }
                };

                if (this.slideInstances.length || !this.$children) {
                    this.slideInstances.forEach((child) => {
                        find(child);
                    });
                } else {
                    this.$children.forEach((child) => {
                        find(child);
                    });
                }
            },
            // copy trackDom
            initCopyTrackDom () {
                this.$nextTick(() => {
                    // 复制原本的内容
                    this.$refs.copyTrack.innerHTML = this.$refs.originTrack.innerHTML;
                });
            },
            updateSlides (init) {
                let slides = [];
                let index = 1;

                this.findChild((child) => {
                    slides.push({
                        $el: child.$el
                    });
                    child.index = index++;

                    if (init) {
                        this.slideInstances.push(child);
                    }
                });

                this.slides = slides;
                this.updatePos();
            },
            updatePos () {
                this.findChild((child) => {
                    child.width = this.listWidth;
                    child.height = typeof this.height === 'number' ? `${this.height}px` : this.height;
                });

                this.trackWidth = (this.slides.length || 0) * this.listWidth;
            },
            // use when slot changed
            slotChange () {
                this.$nextTick(() => {
                    this.slides = [];
                    this.slideInstances = [];

                    this.updateSlides(true, true);
                    this.updatePos();
                    this.updateOffset();
                });
            },
            handleResize () {
                this.listWidth = parseInt(getStyle(this.$el, 'width'));
                this.updatePos();
                this.updateOffset();
            },
            updateTrackPos (index) {
                if (this.showCopyTrack) {
                    this.trackIndex = index;
                } else {
                    this.copyTrackIndex = index;
                }
            },
            updateTrackIndex (index) {
                if (this.showCopyTrack) {
                    this.copyTrackIndex = index;
                } else {
                    this.trackIndex = index;
                }
                this.currentIndex = index;
            },
            add (offset) {
                // 获取单个轨道的图片数
                let slidesLen = this.slides.length;
                // 如果是无缝滚动，需要初始化双轨道位置
                if (this.loop) {
                    if (offset > 0) {
                        // 初始化左滑轨道位置
                        this.hideTrackPos = -1;
                    } else {
                        // 初始化右滑轨道位置
                        this.hideTrackPos = slidesLen;
                    }
                    this.updateTrackPos(this.hideTrackPos);
                }
                // 获取当前展示图片的索引值
                const oldIndex = this.showCopyTrack ? this.copyTrackIndex : this.trackIndex;
                let index = oldIndex + offset;
                while (index < 0) index += slidesLen;
                if (((offset > 0 && index === slidesLen) || (offset < 0 && index === slidesLen - 1)) && this.loop) {
                    // 极限值（左滑：当前索引为总图片张数， 右滑：当前索引为总图片张数 - 1）切换轨道
                    this.showCopyTrack = !this.showCopyTrack;
                    this.trackIndex += offset;
                    this.copyTrackIndex += offset;
                } else {
                    if (!this.loop) index = index % this.slides.length;
                    this.updateTrackIndex(index);
                }
                this.currentIndex = index === this.slides.length ? 0 : index;
                this.$emit('on-change', oldIndex, this.currentIndex);
                this.$emit('input', this.currentIndex);
            },
            arrowEvent (offset) {
                this.setAutoplay();
                this.add(offset);
            },
            dotsEvent (event, n) {
                let curIndex = this.showCopyTrack ? this.copyTrackIndex : this.trackIndex;
                if (event === this.trigger && curIndex !== n) {
                    this.updateTrackIndex(n);
                    this.$emit('input', n);
                    // Reset autoplay timer when trigger be activated
                    this.setAutoplay();
                }
            },
            // 设置自动播放
            setAutoplay () {
                // 先清除全局定时器
                window.clearInterval(this.timer);
                if (this.autoplay) {
                    // 新建定时器
                    this.timer = window.setInterval(() => {
                        this.add(1);
                    }, this.autoplaySpeed);
                }
            },
            updateOffset () {
                this.$nextTick(() => {
                    /* hack: revise copyTrack offset (1px) */
                    let ofs = this.copyTrackIndex > 0 ? -1 : 1;
                    this.trackOffset = this.trackIndex * this.listWidth;
                    this.trackCopyOffset = this.copyTrackIndex * this.listWidth + ofs;
                });
            }
        },
        watch: {
            autoplay () {
                this.setAutoplay();
            },
            autoplaySpeed () {
                this.setAutoplay();
            },
            trackIndex () {
                this.updateOffset();
            },
            copyTrackIndex () {
                this.updateOffset();
            },
            height () {
                this.updatePos();
            },
            value (val) {
//                this.currentIndex = val;
//                this.trackIndex = val;
                this.updateTrackIndex(val);
                this.setAutoplay();
            }
        },
        mounted () {
            this.updateSlides(true);
            this.handleResize();
            this.setAutoplay();
//            window.addEventListener('resize', this.handleResize, false);
            on(window, 'resize', this.handleResize);
        },
        beforeDestroy () {
//            window.removeEventListener('resize', this.handleResize, false);
            off(window, 'resize', this.handleResize);
        }
    };
</script>
