//引导页列表页面控制器
(function () {
  angular.module('app').controller('pagelist', ['$rootScope', '$scope', fn]);

  function fn($rootScope, $scope) {
    $rootScope['pagelist'] = $scope;

    //载入外部依赖
    $.addLib('swal');
    $.addLib('toastr');

    //函数与数据
    $scope.ctrlrName = 'pagelist';

    //页面列表
    $scope.getpages = function () {
      $scope.malls = {};
      _wdapp.child('pages').on("value", function (snapshot, err) {
        $scope.pages = snapshot.val();
        $.applyScope($scope);
      });
    };
    $scope.getpages();

    //添加一个页面
    $scope.addpage = function () {
      swal({
        title: "",
        text: '页面名称',
        type: 'input',
        showCancelButton: true,
      }, function (ipt) {
        var pages = _wdapp.child("pages");
        var page = pages.push({
          name: ipt,
        });

        //写入page.key
        var pkey = page.key();
        _wdapp.child('pages/' + pkey).update({
          key: pkey,
        });
        $.applyScope($scope);
      });
    };


    //删除一个页面
    $scope.removepage = function (pkey) {
      _wdapp.child('pages/' + pkey).remove(function (err, dat) {
        if (err) {
          swal('删除失败：' + err);
        } else {
          $.applyScope($scope);
        }
      })
    };

    //添加一个优惠券
    $scope.addticket = function (pkey) {
      swal({
        title: "",
        text: '优惠券值key',
        type: 'input',
        showCancelButton: true,
      }, function (ipt) {
        var tickets = _wdapp.child('pages/' + pkey + '/tickets');
        var dt = {};
        dt[ipt] = {
          key: ipt
        };
        var newticket = tickets.update(dt);
        $.applyScope($scope);
      });
    };

    //删除一个优惠券
    $scope.removeticket = function (pkey, tkey) {
      _wdapp.child('pages/' + pkey + '/tickets/' + tkey).remove(function (err, dat) {
        if (err) {
          swal('删除失败：' + err);
        } else {
          $.applyScope($scope);
        }
      })
    };


    //---end--
  };
})();
