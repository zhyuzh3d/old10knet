//用户扫码打开的页面控制器
(function () {
  angular.module('app').controller('qcodelist', ['$rootScope', '$scope', fn]);

  function fn($rootScope, $scope) {
    $rootScope['qcodelist'] = $scope;

    //载入外部依赖
    $.addLib('swal');
    $.addLib('toastr');
    $.addLib('qcode');

    //函数与数据
    $scope.ctrlrName = 'qcodelist';

    //二维码列表
    $scope.getqcodes = function () {
      $scope.malls = {};
      _wdapp.child('qcodes').on("value", function (snapshot, err) {
        $scope.qcodes = snapshot.val();
        $.applyScope($scope);
      });
    };
    $scope.getqcodes();

    //添加一个二维码
    $scope.addqcode = function () {
      swal({
        title: "",
        text: '二维码名称',
        type: 'input',
        showCancelButton: true,
      }, function (ipt) {
        var qcodes = _wdapp.child("qcodes");
        var qcode = qcodes.push({
          name: ipt,
        });
        //更新qcode.key
        var qkey = qcode.key();
        _wdapp.child('qcodes/' + qkey).update({
          key: qkey,
        });
        $.applyScope($scope);
      });
    };


    //删除一个二维码
    $scope.removeqcode = function (qkey) {
      _wdapp.child('qcodes/' + qkey).remove(function (err, dat) {
        if (err) {
          swal('删除失败：' + err);
        } else {
          $.applyScope($scope);
        }
      })
    };

    //设置一个二维码对应的页面pkey
    $scope.setpkey = function (qkey) {
      swal({
        title: "",
        text: '页面key',
        type: 'input',
        showCancelButton: true,
      }, function (ipt) {
        var qcode = _wdapp.child("qcodes/" + qkey);
        qcode.update({
          pkey: ipt,
        });
        $.applyScope($scope);
      });
    };

    //显示二维码
    $scope.showqcode = function (qkey) {
      $scope.curqkey = qkey;
      $('#curqcodediv').empty();
      var url = 'http://' + _cfg.host + '/index2.html?ctrlr=welcome&qkey=' + qkey;
      $('#curqcodediv').qrcode(url);
      $('#curqcodediv').append('<div><a href="' + url + '">'+url+'</a></div>');
    };



    //---end--
  };
})();
