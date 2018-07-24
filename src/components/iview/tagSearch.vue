<template>
    <div class="tagSearch" :status="status">
        <div class="tagSearch-inputKeyword" v-if="isKeyword">
            <Input v-model="keyword" placeholder="关键字搜索" @on-enter="onEnterInput()">
            </Input>
            <Button class="tagSearch-inputKeyword-icon" type="text" icon="ios-search" @click="onEnterInput()">
            </Button>
        </div>

        <div class="tagSearch-resultList">
            <Row>
                <Col span="20">
                <span class="tagSearch-resultList-title">已选筛选条件:</span>
                <template v-for="item,index in resultList">
                    <span class="tagSearch-resultList-arrow">></span>
                    <Tag :key="index" :name="index" type="border" class="advisorq-tag"
                         :closable="!item.required" @on-close="onCloseResult(index)">
                        <span style="color: #7d8796">{{item.name}}:</span>
                        <template v-for="data,idx in item.data">
                            <span style="color: #4b96e1">{{idx == 0 ? data.name : ("、" + data.name)}}</span>
                        </template>
                    </Tag>
                </template>
                </Col>
                <Col span="4" style="text-align: right">
                <Button v-if="resultList.length" class="tagSearch-resultList-removeAllBtn advisorq-btn"
                        @click="onCloseResult('all')"
                        type="ghost" size="small">清空筛选
                </Button>
                <Button class="tagSearch-resultList-extendBtn advisorq-btn"
                        @click="isExtend = !isExtend"
                        type="text" size="small">{{isExtend ? "收起" : '展开'}}
                    <Icon v-if="isExtend" type="chevron-up"></Icon>
                    <Icon v-else type="chevron-down"></Icon>
                </Button>
                </Col>
            </Row>
        </div>

        <slot name="valueBefore"></slot>

        <div :style="extendContext">
            <template v-for="item,index in value">
                <div :class="valueList[index].className">
                    <Row :key="index">
                        <Col span="2">
                        <span class="tagSearch-searchList-title">
                        {{item.title}}
                        </span>
                        </Col>
                        <Col span="19">
                        <div class="tagSearch-searchList-content" ref="searchListContent">
                            <template v-if="item.render">
                                <vueExpand :key="index" :list="item.data" :render="item.render"></vueExpand>
                            </template>
                            <template v-else>
                                <span v-for="data,idx in item.data" class="tagSearch-searchList-item"
                                      @click="onClickItem(item,index,idx)">
                                    <i :class="data.checked?'ivu-icon ivu-icon-checkmark-round':''"></i>
                                    {{data.name}}
                                </span>
                            </template>
                        </div>
                        </Col>
                        <Col span="3" style="text-align: right">
                        <Button v-if="valueList[index].isMore" class="advisorq-btn"
                                @click="valueList[index].className['tagSearch-searchList-more'] = !valueList[index].className['tagSearch-searchList-more'];status = !status"
                                type="text" size="small"
                        >
                            更多
                        </Button>
                        <Button v-if="valueList[index].type == 'list' && item.data.length > 1"
                                class="tagSearch-searchList-btn advisorq-btn" type="ghost" size="small"
                                @click="onClickMultiSelect(item,index,!valueList[index].className['tagSearch-searchList-multiSelect'])"
                        >
                            多选+
                        </Button>
                        </Col>
                    </Row>
                    <div class="tagSearch-searchList-bottom">
                        <Button type="primary" class="advisorq-btn" size="small"
                                @click="onClickMultiSelectOk(item,index)">确定
                        </Button>
                        <Button type="ghost" class="advisorq-btn" size="small"
                                @click="onClickMultiSelect(item,index,false)">
                            取消
                        </Button>
                    </div>
                </div>
            </template>

            <slot name="valueAfter"></slot>
            <slot name="dateBefore"></slot>

            <div class="tagSearch-searchList" v-if="isDate">
                <Row>
                    <Col span="2">
                    <span class="tagSearch-searchList-title">
                        创建时间：
                    </span>
                    </Col>
                    <Col span="19">
                    <DatePicker :value="dateList.value" type="daterange" placeholder="请选择时间"
                                @on-change="onChangeDate"
                                style="width: 200px;margin-right: 20px" class="advisorq-datePicker"></DatePicker>
                    <ButtonGroup class="advisorq-buttonGroup">
                        <Button v-for="item,index in dateList.data" :key="index" type="ghost"
                                :class="item.checked?'tagSearch-searchList-butGroup-itemSelected':''"
                                @click="onClickBtnGroup(item)">
                            {{item.title}}
                        </Button>
                    </ButtonGroup>
                    </Col>
                </Row>
            </div>

            <slot name="dateAfter"></slot>

        </div>

    </div>
</template>
<script>
  import {vueExpand, util} from 'yak-web-util'
  import './tagSearch.less'

  /**
   * value = [{
   *    title:'',
   *    code:'',
   *    type:'list',
   *    required:false,
   *    render:null,
   *    data:[{name:'',value''}]
   * }]
   */
  export default {
    mixins: [],
    components: {vueExpand},
    props: {
      value: {
        type: Array,
        required: true,
      },
      isKeyword: {
        type: Boolean,
        "default": true
      },
      isDate: {
        type: Boolean,
        "default": true
      }
    },
    watch: {
      resultList: {
        handler() {
          let self = this;
          self.$emit('onChangeResult', self.getResult())
        },
        deep: true
      },
      'dateList.value': {
        handler() {
          let self = this;
          self.$emit('onChangeResult', self.getResult())
        },
        deep: true
      }
    },
    data() {
      return {
        status: true,
        keyword: '',
        isExtend: true,
        valueList: [],
        resultList: [],
        dateList: {
          value: [],
          data: [
            {title: '今天', code: 'DAY', checked: false},
            {title: '近一周', code: 'L1W', checked: false},
            {title: '近两周', code: 'L2W', checked: false},
            {title: '近一个月', code: 'L1M', checked: false},
            {title: '近两个月', code: 'L2M', checked: false},
            {title: '全部', code: 'ALL', checked: false},
          ]
        }
      }
    },
    created() {
      let self = this;
      self.initResultValue();
    },
    computed: {
      extendContext() {
        return {display: this.isExtend ? 'block' : 'none'};
      },
    },
    mounted() {
      let self = this;
      window.addEventListener('resize', function () {
        self.updateMoreBtn();
      });
    },
    updated() {
      let self = this;
    },
    methods: {
      initResultValue() {
        let self = this,
          resultList = [],
          valueList = [];
        self.value.forEach(item => {
          valueList.push({
            type: item.type ? item.type : 'list',
            isMore: !!item.isMore,
            required: !!item.required,
            render: item.render ? item.render : null,
            className: {
              'tagSearch-searchList': true,
              'tagSearch-searchList-more': false,
              'tagSearch-searchList-multiSelect': false,
            }
          });
          if (item.required) {
            resultList.push({
              name: item.title,
              code: item.code,
              required: item.required,
              data: [Object.assign({}, item.data[0])]
            });
          }
        });
        self.valueList = valueList;
        self.resultList = resultList;
      },
      onEnterInput() {
        //确认输入关键字
        let self = this, isNum = self.getResultListIndex('keyword');
        if (self.keyword) {
          let data = {name: self.keyword, value: self.keyword};
          if (isNum === null) {
            self.resultList.push({name: '关键字', code: 'keyword', data: [data]})
          } else {
            self.resultList[isNum].data = [data];
          }
        } else {
          if (isNum !== null) {
            self.resultList.splice(isNum, 1);
          }
        }
      },
      onCloseResult(index) {
        //关闭结果选项
        let self = this;
        if (index === 'all') {
          let ary = [];
          self.resultList.forEach(item => {
            if (item.required) {
              ary.push(item)
            }
          });
          self.resultList = ary;
        } else {
          self.resultList.splice(index, 1);
        }
      },
      onClickItem(data, dataIndex, idx) {
        //点击选项
        let self = this;
        data.data[idx].checked = !data.data[idx].checked;
        if (!self.valueList[dataIndex].className['tagSearch-searchList-multiSelect']) {
          self.onClickMultiSelectOk(data, dataIndex);
        }
        self.status = !self.status;
      },
      onClickMultiSelect(data, dataIndex, isShow) {
        //点击多选
        let self = this;
        if (Array.isArray(data.data)) {
          data.data.forEach(item => {
            item.checked = false;
          });
        } else {
          for (let i in data.data) {
            data.data[i].forEach(item => {
              item.checked = false;
            });
          }
        }
        self.valueList[dataIndex].className['tagSearch-searchList-more'] = !!isShow;
        self.valueList[dataIndex].className['tagSearch-searchList-multiSelect'] = !!isShow;
        self.status = !self.status;
      },
      onClickMultiSelectOk(data, dataIndex) {
        //更多的时候确定输入
        let self = this, isNum = self.getResultListIndex(data.code), ary = [];
        data.data.forEach(item => {
          item.checked && ary.push(Object.assign({}, item));
        });

        if (isNum === null) {
          self.resultList.push({name: data.title, code: data.code, required: !!data.required, data: ary});
        } else {
          if (ary.length) {
            self.resultList[isNum].data = ary;
          } else {
            self.resultList.splice(isNum, 1);
          }
        }
        self.onClickMultiSelect(data, dataIndex, false);
      },
      onChangeDate(data) {
        //日期修改
        let self = this;
        self.dateList.value = data;
        self.onClickBtnGroup();
      },
      onClickBtnGroup(data) {
        //时间按钮组选中
        let self = this;
        self.dateList.data.forEach(item => {
          item.checked = (data && item.code === data.code);
        });
        if (data) {
          self.dateList.value = util.getTimePeriodRange(data.code)
        }
      },
      getResultListIndex(code) {
        //得到结果数据对应code的index值
        let self = this, idx = null;
        self.resultList.forEach((item, index) => {
          if (item.code === code) {
            idx = index;
          }
        });
        return idx;
      },
      updateMoreBtn() {
        //判断是否需要出现更多按钮
        let self = this, searchListContentRefs = self.$refs['searchListContent'];
        if (searchListContentRefs) {
          searchListContentRefs.forEach((item, index) => {
            self.valueList[index].isMore = (item.scrollHeight > 36)
          });
          self.status = !self.status;
        }
      },
      getResult() {
        //得到选择结果
        let self = this, json = {};
        self.resultList.forEach(item => {
          let r = [];
          item.data.forEach(d => {
            r.push(d.value);
          });
          if (r.length === 1) {
            json[item.code] = r[0];
          } else {
            json[item.code] = r;
          }
        });
        if (self.isDate) {
          json['start_time'] = self.dateList.value[0];
          json['end_time'] = self.dateList.value[1];
        }
        return json;
      },
    }
  }
</script>