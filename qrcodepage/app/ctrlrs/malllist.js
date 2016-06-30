//用户扫码打开的页面控制器
(function () {
  angular.module('app').controller('malllist', ['$rootScope', '$scope', fn]);

  function fn($rootScope, $scope) {
    $rootScope['malllist'] = $scope;

    //载入外部依赖
    $.addLib('swal');
    $.addLib('toastr');

    //函数与数据
    $scope.ctrlrName = 'malllist';

    //添加商场
    $scope.addmall = function () {
      swal({
        title: "",
        text: '商场名称',
        type: 'input',
        showCancelButton: true,
      }, function (ipt) {
        var malls = _wdapp.child("malls");
        var newmall = malls.push({
          name: ipt,
        });
        //更新mall.key
        var mkey = newmall.key();
        _wdapp.child('malls/' + mkey).update({
          key: mkey,
        });
        $.applyScope($scope);
      });
    };

    //商场列表
    $scope.getmalls = function () {
      $scope.malls = {};
      _wdapp.child('malls').on("value", function (snapshot, err) {
        $scope.malls = snapshot.val();
        $.applyScope($scope);
      });
    };
    $scope.getmalls();


    //删除一个商场
    $scope.removemall = function (mkey) {
      _wdapp.child('malls/' + mkey).remove(function (err, dat) {
        if (err) {
          swal('删除失败：' + err);
        } else {
          $.applyScope($scope);
        }
      })
    };

    //添加一个优惠券
    $scope.addticket = function (mkey) {
      swal({
        title: "",
        text: '优惠券key',
        type: 'input',
        showCancelButton: true,
      }, function (ipt) {
        if(!ipt) return;
        var tickets = _wdapp.child('malls/' + mkey + '/tickets');
        var dt={};
        dt[ipt]={key:ipt};
        var newticket = tickets.update(dt);
        $.applyScope($scope);
      });
    };

    //删除一个优惠券
    $scope.removeticket = function (mkey, tkey) {
      _wdapp.child('malls/' + mkey + '/tickets/' + tkey).remove(function (err, dat) {
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
