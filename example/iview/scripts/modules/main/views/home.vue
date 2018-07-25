<template>
    <div>
        <div style="padding: 20px;background: #ffffff">
            <TagSearch :value="tagValue" @onChangeResult="onChangeResult">
            </TagSearch>
        </div>
    </div>
</template>
<script>
  import {TagSearch} from '../../../../../../iviewComponents'

  export default {
    mixins: [],
    components: {TagSearch},
    data() {
      let self = this;
      return {
        tagValue: []
      }
    },
    created() {
      let self = this;
      self.tagValue = [
        {
          title: '金融资产', code: 'assets', type: 'one', required: true,
          data: [
            {name: '基金', value: 'FUND'}
          ]
        },
        {
          title: '区域市场', code: 'region',
          data: [
            {name: '区域市场1', value: 's1'},
            {name: '区域市场2', value: 's2'},
            {name: '区域市场3', value: 's3'},
          ]
        },
      ];
    },
    mounted() {
      let self = this;
    },
    methods: {
      onChangeResult(result) {
        console.log(result)
      }
    }
  }
</script>
