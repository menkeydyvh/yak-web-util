import util from './index'
import axios from 'axios'
import Qs from 'qs'

const apiMethods = {
  methods: {
    //普通请求
    apiRequest(url, data = {}, method = 'POST') {
      let self = this;
      return self.newPromise(url, data, method);
    },
    //gql请求
    gqlApiRequest(url, query, variables = {}) {
      let self = this;
      return self.newPromise(url, {
        query: query,
        variables: variables
      }, 'POST');
    },
    newPromise(url, data = {}, method = 'POST') {
      let self = this;
      return new Promise((resolve, reject) => {
        let uid = util.lockr('uid');
        if (method !== 'POST') {
          if (url.indexOf('?') > -1) {
            url = url + '&' + Qs.stringify(data)
          } else {
            url = url + '?' + Qs.stringify(data)
          }
        }
        axios({
          method: method,
          url: url,
          data: data,
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': 'Bearer ' + (uid ? uid : '')
          }
        }).then((response) => {
          if (response.data.errors) {
            if (self.handleErrorCode(response.data.errors[0].code, response.data.errors[0].message)) {
              self.handleErrorJson(response.data)
            }
            resolve(response.data);
          } else {
            resolve(response.data);
          }
        }).catch((response) => {
          if (self.handleErrorCode(response.response.status)) {
            let j = self.handleErrorJson(response.response.data);
            if (!j) {
              bus.$Message.error('请求超时，请检查网络')
            }
          }
        });
      });
    },
    handleErrorJson(json) {
      //处理异常json
      if (typeof json === 'string') {
        try {
          json = JSON.parse(json)
        } catch (e) {
          return null
        }
      }
      if (json.message) {
        bus.$Message.error(json.message);
      }
      for (let i in json.errors) {
        bus.$Message.error(json.errors[i].message);
      }
      return json;
    },
    handleErrorCode(code, msg) {
      // 异常code处理
      let isTrue = true;
      switch (code) {
        case 401:
          isTrue = false;
          util.lockr('uid', null);
          location.href = '/login';
          break;
        case 403:
          if (msg === '需要登陆') {
            util.lockr('uid', null);
            location.href = '/login';
          }
          if (msg) {
            bus.$Message.error(msg);
          } else {
            bus.$Message.error('当前用户没有权限');
          }
          isTrue = false;
          break;
        default :
          break;
      }
      return isTrue;
    },
  }
}


export default apiMethods
