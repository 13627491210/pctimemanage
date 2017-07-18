

// 发起get请求
var path = {
  baseUrl: 'http://kingofdinner.realsun.me:9091/',
  loginBaseUrl:'http://kingofdinner.realsun.me:9091/',
  getData: 'api/100/table/Retrieve',
  getSubData: 'api/100/table/RetrieveRelTableByHostRecord',
  saveData: 'api/100/table/Save',
  login: 'api/Account/Login'
}

define([
  'until'
], function (until) {

  function fixDataWithMethod(data, method) {
    if (method == 0) {//登录
      data.loginMethod = "badgeno";//工号
      data.enterprisecode = enterprisecode;
      return data;
    };

    data.uiver = 200;
    data.dynlogin = 1;

    //获取主表数据
    if (method == 1) {

      //增 改 数据
    } else if (method == 2 || method == 4) {
      data.data._id = 1;

      if (method == 2) {
        data.data._state = "added";
        data.data.REC_ID = 0;
      } else {
        data.data._state = "modified";
      }

      data.data = JSON.stringify([data.data]);

      //获取附表数据
    } else if (method == 3) {

      //修改多条数据
    } else if (method == 5) {
      data.data = JSON.stringify(data.data);
    }
    return data;
  }

  //打印url
  function printUrl(url, data) {
    var str = path.baseUrl + url + '?';
    for (var key in data) {
      str = str + '&' + key + '=' + data[key];
    }
    console.log(str);
  }

  function getHeader(str) {
    if (str != path.baseUrl + path.login) {
      var headers = {
        "userCode": appConfig.app.userInfo.UserCode,
        "accessToken": appConfig.app.userInfo.AccessToken,
        "loginmethod": "badgeno",
        "badgeno": globBadgeno,
        "enterprisecode": enterprisecode,
        "unionid": "11"
      }
      return headers

    } else return {}
  }

  //ajax请求
  function baseRequest(type, url, data, method, doSuccess, doFail) {
    data = fixDataWithMethod(data, method);
    printUrl(url, data);
    var headers = getHeader(url);


    $.ajax({
      url: url,
      data: data,
      dataType: "json",
      type: type,
      headers: headers,
      success: function (res) {
        if (res.statusCode == 401) {

        } else if (res.statusCode == 404) {
          cmAlert('请求出错');
        } else {

          if (typeof doSuccess == "function") {

            if (res != '' && 'error' in res) {

              if (res.error == 0) {
                doSuccess(res);
              } else {

                if (res.message) cmAlert(res.message);
                else cmAlert("操作失败");
                doFail();
              }

            } else {
              doSuccess(res);
            }
          }
        }
      },
      error: function (e) {
        if (typeof doFail == "function") {
          doFail();
        }
      }
    });
  }

  //账户登录
  function accountLogin(params, doSuccess, doFail) {
    var url = path.loginBaseUrl + path.login;
    baseRequest("POST", url, params, 0, doSuccess, doFail);
  }

  //获取申请中数据
  function getApplyingData(params, doSuccess, doFail) {
    var url = path.baseUrl + path.getData;
    params.resid = 541502768110
    baseRequest("GET", url, params, 1, doSuccess, doFail);
  }

  //获取审批中数据
  function getPendingData(params, doSuccess, doFail) {
    var url = path.baseUrl + path.getData;
    params.resid = 541518842754
    baseRequest("GET", url, params, 1, doSuccess, doFail);
  }

  //获取假期类型
  function getVacationHttpCategory(doSuccess, doFail) {
    var url = path.baseUrl + path.getData;
    var params = {
      'resid': 542128856156,
      'subresid': '',
      'cmswhere': '',
      'key': ''
    }
    baseRequest("GET", url, params, 1, doSuccess, doFail);
  }

  // 获取审批人
  function getTeamHttpApprove(doSuccess, doFail) {
    var url = path.baseUrl + path.getData;
    var params = {
      'resid': 542225544503,
      'subresid': '',
      'cmswhere': '',
      'key': ''
    }
    baseRequest("GET", url, params, 1, doSuccess, doFail);
  }

  // 获取退回类型
  function getRefuseHttpData(params, doSuccess, doFail) {
    var url = path.baseUrl + path.getData;
    baseRequest("GET", url, params, 1, doSuccess, doFail);
  }

  // 添加请假数据
  function addApply(params, doSuccess, doFail) {
    var url = path.baseUrl + path.saveData;
    params.resid = 541502768110;
    baseRequest("POST", url, params, 2, doSuccess, doFail);
  }

  // 保存请假数据
  function saveApply(params, doSuccess, doFail) {
    var url = path.baseUrl + path.saveData;
    params.resid = 541502768110;
    baseRequest("POST", url, params, 4, doSuccess, doFail);
  }

  //计算时长
  function hourCalculate(params, doSuccess, doFail) {
    var url = path.baseUrl + path.saveData;
    baseRequest("POST", url, params, 2, doSuccess, doFail);
  }

  // 上传图片
  function uploadImg(param, doSuccess, doFail) {
    var xhr = new XMLHttpRequest();
    var uploadFileUrl = 'http://kingofdinner.realsun.me:8081/rispweb/rispservice/SvcUploadFile2.aspx'
    httppath = "http://kingofdinner.realsun.me:8081/rispweb/upfiles"
    var upUrlStr = uploadFileUrl + '?savepath=c:\\web\\web\\rispweb\\upfiles&httppath=' + httppath;//cmAlert(upUrlStr);
    xhr.open('POST', upUrlStr);
    xhr.onload = function () {
      var data = JSON.parse(xhr.response);
      if (xhr.status === 200) {
        cmAlert("上传成功");
        var imgUrl = data.httpfilename;
        console.log(imgUrl);
        if (doSuccess) doSuccess(imgUrl);
      } else {
        if (doFail) doFail();
        // 处理错误
        cmAlert('error==' + data);
      }
    };


    var fd = new FormData();
    fd.append("file", param, 'hello.png');//新建formdata提交，png格式
    xhr.send(fd);
  }

  //获取审批流
  function getPendingPepleData(paramREC_ID, doSuccess, doFail) {
    var params = {
      'resid': 541502768110,
      'subresid': 541521075674,
      // 'cmswhere': "",
      'hostrecid': paramREC_ID,
      // 'cmsorder': ""
    }
    var url = path.baseUrl + path.getSubData;
    baseRequest("GET", url, params, 3, doSuccess, doFail);
  }


  //撤销
  function cancelApply(data, doSuccess, doFail) {
    var params = {
      'resid': 541502768110,
      'data': data
    }
    var url = path.baseUrl + path.saveData;
    customLoading();
    baseRequest("POST", url, params, 4, doSuccess, doFail);
  }

  // 获取已审核数据
  function getAppledData(params, doSuccess, doFail) {
    var url = path.baseUrl + path.getData;
    params.resid = 541518522808
    baseRequest("GET", url, params, 1, doSuccess, doFail);
  }

  //获取退回修改数据 
  function getFixSubmitData(params, doSuccess, doFail) {
    var url = path.baseUrl + path.getData;
    params.resid = 543000345781
    baseRequest("GET", url, params, 1, doSuccess, doFail);
  }


  // 获取我的申请历史记录
  function getApplyHistoryData(params, doSuccess, doFail) {
    var url = path.baseUrl + path.getData;
    params.resid = 541518678060
    baseRequest("GET", url, params, 1, doSuccess, doFail);
  }

  //审批
  function approveDataArr(param, doSuccess, doFail) {
    var params = {
      'resid': 541518842754,
      'data': param
    }
    var url = path.baseUrl + path.saveData;
    baseRequest("POST", url, params, 5, doSuccess, doFail);
  }

  //已审批数据
  function getPendedData(params, doSuccess, doFail) {
    params.resid = 541518986783
    var url = path.baseUrl + path.getData;
    baseRequest("GET", url, params, 1, doSuccess, doFail);
  }

  //获取审批退回数据
  function getPendedRefuseData(params, doSuccess, doFail) {
    params.resid = 541519417864
    var url = path.baseUrl + path.getData;
    baseRequest("GET", url, params, 1, doSuccess, doFail);
  }

  //审批历史记录数据
  function getPendedHistoryData(params, doSuccess, doFail) {
    params.resid = 541520707421
    var url = path.baseUrl + path.getData;
    baseRequest("GET", url, params, 1, doSuccess, doFail);
  }
  var httpService = {
    accountLogin: accountLogin,
    getApplyingData: getApplyingData,
    getPendingData: getPendingData,
    getVacationHttpCategory: getVacationHttpCategory,
    getTeamHttpApprove: getTeamHttpApprove,
    getRefuseHttpData: getRefuseHttpData,
    addApply: addApply,
    saveApply: saveApply,
    hourCalculate: hourCalculate,
    uploadImg: uploadImg,
    getPendingPepleData: getPendingPepleData,
    cancelApply: cancelApply,
    getAppledData: getAppledData,
    getFixSubmitData: getFixSubmitData,
    getApplyHistoryData: getApplyHistoryData,
    approveDataArr: approveDataArr,
    getPendedData: getPendedData,
    getPendedRefuseData: getPendedRefuseData,
    getPendedHistoryData: getPendedHistoryData
  }
  return httpService
});