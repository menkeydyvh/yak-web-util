import Layout from '../modules/main/views/layout.vue'

import HomeIndex from '../modules/main/views/home.vue'

/**
 * 路由是根据url的请求地址来加载需要的控件
 * 路由配置参考
 * http://router.vuejs.org/zh-cn/
 * 注意：如果要加载在PHP项目 可以只进行 package.json 里面的  init  把打包文件打包进去php可以直接访问静态文件的位置即可  （其他不变）
 * @type {*[]}
 */

export default [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        meta: {identity: false, title: '首页页'},
        component: HomeIndex
      }
    ],
  },
]
