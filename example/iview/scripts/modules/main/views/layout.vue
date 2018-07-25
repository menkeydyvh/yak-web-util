<template>
    <Layout :data-status="status" class="ivu-layout-has-sider">
        <Content :style="contentStyle" class="layout-content">
            <router-view></router-view>
        </Content>
    </Layout>
</template>
<script>

  export default {
    components: {},
    mixins: [],
    replace: false,
    data() {
      return {
        status: true,
        contentStyle: {
          height: '600px'
        },
      }
    },
    created() {
      let self = this;
    },
    mounted() {
      let self = this;
      self.contentStyle.height = (window.innerHeight ) + 'px';
      window.addEventListener('resize', function () {
        self.contentStyle.height = (window.innerHeight ) + 'px';
      });

    },
    updated() {
    },
    methods: {}
  }
</script>