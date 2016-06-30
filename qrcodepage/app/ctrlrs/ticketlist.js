//引导页列表页面控制器
(function () {
  angular.module('app').controller('ticketlist', ['$rootScope', '$scope', fn]);

  function fn($rootScope, $scope) {
    $rootScope['ticketlist'] = $scope;

    //载入外部依赖
    $.addLib('swal');
    $.addLib('toastr');

    //函数与数据
    $scope.ctrlrName = 'ticketlist';

    //页面列表
    $scope.gettickets = function () {
      $scope.tickets = {};
      _wdapp.child('tickets').on("value", function (snapshot, err) {
        $scope.tickets = snapshot.val();
        $.applyScope($scope);
      });
    };
    $scope.gettickets();

    //添加一个优惠券
    $scope.addticket = function () {
      swal({
        title: "",
        text: '优惠券地址url',
        type: 'input',
        showCancelButton: true,
      }, function (ipt) {
        var tickets = _wdapp.child("tickets");
        var ticket = tickets.push({
          url: ipt,
        });

        //ticket.key
        var tkey = ticket.key();
        _wdapp.child('tickets/' + tkey).update({
          key: tkey,
        });
        $.applyScope($scope);
      });
    };


    //删除一个ticket
    $scope.removeticket = function (tkey) {
      _wdapp.child('tickets/' + tkey).remove(function (err, dat) {
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
