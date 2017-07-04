﻿define(['durandal/app',
  'knockout',
  'plugins/router',
  'httpService',
  'components/headerCpt', 'components/cellMainCpt'], function (app, ko, router,httpService) {
    var self;
    return {
      model: {
        title: '我的审批',
        subTitle: '历史记录',
        data: ko.observableArray(),
        vacationCategory: [],
        selectedCategory: '',
        inputVal: ko.observable(''),
        pageIndex: 0,
                noMore: false
      },
      activate: function (e) {
        self = this;
        self.init();

        //配置所有类型
        var allVacationCategory = ['全部'];
        allVacationCategory = allVacationCategory.concat(appConfig.app.vacationCategory)
        self.model.vacationCategory = ko.observable(allVacationCategory);
        self.model.selectedCategory = ko.observable(allVacationCategory[0])


        self.getData(0);
      },
      attached: function () {

      },
      deactivate: function () {
        self = undefined;
      },
      init:function(){
                self.model.noMore = false;
                self.model.pageIndex = 0;
                self.model.data([]);
            },
      //获取数据
      getData: function (type) {
        var keyStr = '';
        // if (self.data.selectDataIndex < self.data.selectDataArr.length) {
        keyStr = self.model.selectedCategory();
        keyStr = keyStr == '全部' ? '' : "C3_533398158705 ='" + keyStr + "'"
        // }

        var param = {
          'subresid': '',
          'cmswhere': keyStr,
          'key': self.model.inputVal() ? self.model.inputVal() : ''
        }



        param.pageSize = 10;
        if (!type) {//刷新
          param.pageIndex = 0;

        } else {//加载
          param.pageIndex = self.model.pageIndex;
        }



        httpService.getPendedHistoryData(param, function (data) {

          if (data && data.data) {
            var dataArr = data.data;
            dataArr.forEach(function (val) {
              val.selected = true
            })
            self.model.data(dataArr);

            if (dataArr.length < param.pageSize) self.model.noMore = true;
                        else self.model.noMore = false;

          } else {
            // self.setData({ data: [] });
            // self.setData({ noMore: true });
          }
        }, function () {

        });
      },

      //类型筛选
      categoryFilterClick: function (index) {
        self.model.selectedCategory(self.model.vacationCategory()[index()]);
        self.getData(0);
      },
      goToApplyDetailPage: function (index) {
        var tmpData = self.model.data()[index()];
        var tmpJsonData = JSON.stringify(tmpData);
        router.navigate("#applyDetail?data=" + tmpJsonData);
      },
      kvoInput: function (data,event) {
        self.getData(0);
      },
      pageUp: function () {
                if (self.model.pageIndex <= 0) self.model.pageIndex = 0
                else self.model.pageIndex--;
                self.getData(1);
            },
            pageDown: function () {
                if (self.model.noMore) return;
                self.model.pageIndex++;
                self.getData(1);
            }

    };
  }); 