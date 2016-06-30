//用户扫码打开的页面控制器
(function () {
  angular.module('app').controller('welcome', ['$rootScope', '$scope', fn]);

  function fn($rootScope, $scope) {
    $rootScope['welcome'] = $scope;

    //载入外部依赖
    $.addLib('swal');
    $.addLib('toastr');

    //函数与数据
    $scope.ctrlrName = 'welcome' + Math.random();

    //获取页面信息
    $scope.getpage = function () {
      //从地址栏拿到qkey
      var qkey = $.getUrlParam('qkey');
      //根据qkey拿到pkey
      _wdapp.child('qcodes/' + qkey + '/pkey').on('value', function (snapshot, err) {
        var pkey = snapshot.val();
        //根据qkey拿到tickets
        _wdapp.child('pages/' + pkey + '/tickets').on('value', function (snapshot2, err) {
          $scope.tickets = snapshot2.val();
          //读取每个优惠券
          var tkarr = [];
          for (var tk in $scope.tickets) {
            tkarr.push(tk);
          };

          for (var i = 0; i < tkarr.length; i++) {
            var ky = tkarr[i];
            _wdapp.child('tickets/' + ky).on('value', function (ss3, err) {
              var ticket=ss3.val();
              $scope.tickets[ticket.key] = ticket;
              $.applyScope($scope);
            })
          }
        })
      });
    };
    $scope.getpage();

    //---end--
  };
})();
