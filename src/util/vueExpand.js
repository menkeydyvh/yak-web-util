/**
 * 用来处理vue插件自定义内容的部分
 */
export default {
  name: 'TemplateExpand',
  functional: true,
  props: {
    list: Array,
    render: Function,
  },
  render: function (h, ctx) {
    return ctx.props.render(h, ctx.props.list);
  }
};