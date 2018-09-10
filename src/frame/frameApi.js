/**
 * frame 的处理api
 */
export default {
  /**
   * 作用于 child
   * 发送消息给父节点
   * @param data
   */
  sendMessagesToParent: function (data) {
    if (typeof data !== 'string') {
      data = JSON.stringify(data);
    }
    let parentHost = '';
    if (location.ancestorOrigins && location.ancestorOrigins.length) {
      parentHost = location.ancestorOrigins[0];
    }
    if (parentHost) {
      window.parent.postMessage(data, parentHost);
    }
  },
  /**
   * 作用于 child
   * window.open 弹窗
   * @param url
   */
  windowOpen: function (url) {
    let host = process.env.HOST_HTTP;
    host = host ? host : '';
    url && window.open(host + url);
  },
  /**
   * 作用于 child
   * history
   * @param url
   * @param state
   */
  history: function (url, state) {
    if (url) {
      this.sendMessagesToParent({
        type: 'history',
        data: {
          state: state ? state : null,
          title: document.title,
          url: url
        }
      })
    }
  },
  /**
   * 作用于 child
   * href
   * @param url
   */
  href: function (url) {
    if (url) {
      this.sendMessagesToParent({
        type: 'href',
        data: url
      })
    }
  },
};

