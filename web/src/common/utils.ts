import zh from '../i18n/zh';
import en from '../i18n/en';

export const handleI18nMessages = (lang: string) => {
    let res = {};
    switch (lang) {
        case 'zh-CN':
            res = zh;
            break;
        case 'zh-cn':
            res = zh;
            break;
        default:
            res = en;
            break;
    }
    return res;
};