import lockr from 'lockr'
import Cookies from 'js-cookie'

export default {

  /**
   * html title 的设置
   * @param title
   */
  title: function (title) {
    title = title ? title + ' - Home' : 'Home';
    window.document.title = title;
  },


  /**
   * 获取 地址栏上的所有参数数据
   * @returns {{}}
   */
  getLocationBarData: function () {
    let url = location.search, theRequest = {};
    if (url.indexOf("?") !== -1) {
      let str = url.substr(1);
      let strs = str.split("&");
      for (let i = 0; i < strs.length; i++) {
        let item = strs[i].split("=");
        theRequest[item[0]] = item[1] ? decodeURIComponent(item[1]) : null;
      }
    }
    return theRequest;
  },

  /**
   * 生成随机字符串
   * @param len  几位
   * @returns {string}
   */
  randomId: function (len) {
    let rdmString = '';
    for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2)) ;
    return rdmString.substr(0, len)
  },

  /**
   * data格式化
   * @param date
   * @param fmt
   * @returns {*}
   */
  dateFormatting: function (date, fmt) {
    if (!fmt) {
      fmt = 'yyyy-MM-dd hh:mm:ss'
    }
    let o = {
      'M+': date.getMonth() + 1,                 //月份
      'd+': date.getDate(),                    //日
      'h+': date.getHours(),                   //小时
      'm+': date.getMinutes(),                 //分
      's+': date.getSeconds(),                 //秒
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      'S': date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, ( date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (let k in o)
      if (new RegExp('(' + k + ')').test(fmt))
        fmt = fmt.replace(RegExp.$1, ( RegExp.$1.length === 1) ? (o[k]) : (( '00' + o[k]).substr(('' + o[k]).length)));
    return fmt
  },

  /**
   * 手机号验证
   * @param value
   * @returns {boolean}
   */
  phoneValidation: function (value) {
    let zz = /^((13[0-9])|147|(15[0-35-9])|(17[0-9])|180|183|182|(18[5-9]))[0-9]{8}$/;
    value = util.trim(value);
    return zz.test(value);
  },

  /**
   * 邮箱验证
   * @param value
   * @returns {boolean}
   */
  emailValidation: function (value) {
    let zz = /^[a-zA-Z0-9][a-zA-Z0-9._-]*\@[a-zA-Z0-9]+\.[a-zA-Z0-9\.]+$/;
    value = util.trim(value);
    return zz.test(value);
  },

  /**
   * 本地存储处理
   * @param name
   * @param value
   */
  lockr: function (name, value) {
    if (window.localStorage) {
      if (!(value === null || value === undefined) && name) {
        lockr.set(name, value);
      } else if (name) {
        return lockr.get(name);
      }
    } else {
      if (!(value === null || value === undefined) && name) {
        Cookies.set(name, value);
      } else if (name) {
        return Cookies.get(name);
      }
    }
  },

  /**
   * 删除本地存储
   * @param name
   * @returns {boolean}
   */
  deleteLockr: function (name) {
    if (window.localStorage) {
      if (name) {
        lockr.rm(name);
        return true;
      }
    } else {
      if (name) {
        Cookies.remove(name);
        return true;
      }
    }
  },

  /**
   * 去除前后空格
   * @param str
   * @returns {*}
   */
  trim: function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },

  /**
   * 横竖屏判断
   * false 为竖屏幕  true 为横屏幕
   * @param callback
   */
  switchWidthHeight: function (callback) {
    //dom生成了
    window.addEventListener("orientationchange", function () {
      if ((window.orientation === 0) || (window.orientation === 180)) {
        callback(false);
      } else {
        callback(true)
      }
    }, false);

    if ((window.orientation === 0) || (window.orientation === 180)) {
      callback(false);
    } else {
      callback(true)
    }
  },

  /**
   * 日期一个范围的计算
   * 根据要的数据类型和最大值 获取近期的时间[min,max]
   * @param period  规定值
   * @param maxDate
   * @returns {[string,string]}
   */
  getTimePeriodRange: function (period, maxDate) {
    if (!maxDate) {
      maxDate = new Date();
    } else if (typeof maxDate === 'string') {
      maxDate = new Date(maxDate);
    }
    let value = ['', ''],
      curYear = maxDate.getFullYear(),
      curMonth = maxDate.getMonth() + 1,
      curDay = maxDate.getDate();

    value[1] += curYear;
    value[1] += '-' + ((curMonth < 10) ? ('0' + curMonth) : curMonth);
    value[1] += '-' + ((curDay < 10) ? ('0' + curDay) : curDay);

    if (period === 'DAY') {
      value[0] = value[1];
    } else if (period === 'MAX') {
      value[0] = '1970-01-01';
    } else if (period === 'ALL') {
      value[0] = '1970-01-01';
    } else if (period === 'L1W') {
      value[0] = util.dateFormatting(new Date(maxDate.getTime() - (7 * 86400 * 1000)), 'yyyy-MM-dd')
    } else if (period === 'L2W') {
      value[0] = util.dateFormatting(new Date(maxDate.getTime() - (14 * 86400 * 1000)), 'yyyy-MM-dd')
    } else {
      if (period === 'L1M') {
        curMonth = curMonth - 1;
      } else if (period === 'L2M') {
        curMonth = curMonth - 2;
      } else if (period === 'L3M') {
        curMonth = curMonth - 3;
      } else if (period === 'L6M') {
        curMonth = curMonth - 6;
      } else if (period === 'L1Y') {
        curYear = curYear - 1;
      } else if (period === 'L2Y') {
        curYear = curYear - 2;
      } else if (period === 'L3Y') {
        curYear = curYear - 3;
      } else if (period === 'L5Y') {
        curYear = curYear - 5;
      }
      if (curMonth <= 0) {
        curMonth = 12 + curMonth;
        curYear--;
      }
      value[0] += curYear;
      value[0] += '-' + ((curMonth < 10) ? ('0' + curMonth) : curMonth);
      value[0] += '-' + ((curDay < 10) ? ('0' + curDay) : curDay);
    }
    return value;
  },


  /**
   * 内容base64编码和解码
   * @param content
   * @param isDecoding 是否解码
   * @returns {string}
   */
  base64: function (content, isDecoding) {
    if (isDecoding) {
      return window.atob && window.atob(content);
    } else {
      return window.btoa && window.btoa(content);
    }
  },

  /**
   * 解析Gql下来的ID
   * @param gqlId
   */
  getGqlId: function (gqlId) {
    if (gqlId) {
      return (util.base64(gqlId, true).split(':')[1]).replace(/"/g, '');
    }
    return null;
  },

  /**
   * es6 数组值去重
   * @param ary
   * @returns {Array}
   */
  arrayDistinct: function (ary) {
    return Array.from(new Set(ary));
  },

  /**
   * 像素处理
   * @param num
   * @returns {Array}
   */
  pixel: function (num) {
    return num * window.devicePixelRatio;
  }
}