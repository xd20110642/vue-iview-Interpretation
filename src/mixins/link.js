import { oneOf } from '../utils/assist';
// 导出 导航的link
export default {
    // 定义pros
    props: {
        to: {
            type: [Object, String]
        },
        replace: {
            type: Boolean,
            default: false
        },
        // 目标
        target: {
            type: String,
            // 进行校验 
            validator (value) {
                return oneOf(value, ['_blank', '_self', '_parent', '_top']);
            },
            // 默认值
            default: '_self'
        }
    },
    // 计算属性
    computed: {
        linkUrl () {
            // type等于 to的类型值
            const type = typeof this.to;
            // linkurl等于 string 那么 就返回to的类型  否则返回null
            return type === 'string' ? this.to : null;
        }
    },
    // 方法
    methods: {
        // 设置默认参数的值 如果new_window是false  处理单击
        handleClick (new_window = false) {
            // 判断参数的值 如果正确 那么打开新窗口
            if (new_window){
                window.open(this.to);
            } else {
                // 获取到路由参数
                const isRoute = this.$router;
                // 如果存在 那么就使用路由方式
                if (isRoute) {
                    // 判断使用那么导航方式  replace不会留下历史记录  push会留下历史记录
                    this.replace ? this.$router.replace(this.to) : this.$router.push(this.to);
                } else {
                    // 否则使用网页导航
                    window.location.href = this.to;
                }
            }
        },
        // 处理检查单击
        handleCheckClick (event, new_window = false) {
            if (this.to) {
                if (this.target === '_blank') {
                    return false;
                } else {
                    // 注释默认事件  就相当于 点击a链接 就不会跳转
                    event.preventDefault();
                    // 然后执行上面的方法
                    this.handleClick(new_window);
                }
            }
        }
    }
};
