﻿define(['durandal/app',
  'knockout',
  'plugins/router',
  'httpService',
  'components/headerCpt', 'components/cellMainCpt',
  'photoswipe/photoswipe-ui-default.min', 'photoswipe/photoswipe.min', 'baseVM'],
  function (app, ko, router, httpService, hCpt, cellMainCpt, PhotoSwipeUI_Default, PhotoSwipe, baseVM) {

    var selfVM = new baseVM();

    selfVM.getData = function (type) {
      var self = selfVM;
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



      httpService.getPendedData(param, function (data) {

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
    }


    return selfVM;




  });