import util from '../util';

export default (callback) => {
  if (process.env.NODE_ENV === 'production') {
    window.addEventListener("message", (event) => {
      if (event.origin === process.env.HOST_HTTP) {
        let json = event.data;
        if (typeof event.data === 'string') {
          json = JSON.parse(event.data);
        }
        switch (json.type) {
          case 'localStorage': {
            for (let key in json.data) {
              util.lockr(key, json.data[key]);
            }
            break;
          }
          case 'historyListen': {
            if (json.data === 'forward') {
              //前进
              window.bus.$router.go(1);
            } else if (json.data === 'back') {
              //后退
              window.bus.$router.go(-1);
            }
            break;
          }
          default: {
            break;
          }
        }
        callback && callback();
      } else {
        console.error('来源不可信');
      }
    }, false);
  } else {
    callback && callback();
  }
};