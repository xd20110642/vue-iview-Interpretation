import { t } from '../locale';

export default {
    methods: {
        // 解构
        t(...args) {
            return t.apply(this, args);
        }
    }
};
