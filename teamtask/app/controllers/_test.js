//测试控制器
(function() {
    angular.module('app').controller('_test', ['$rootScope', '$scope', '$element', fn]);

    function fn($rootScope, $scope, $element) {
        $rootScope['topNavbar'] = $scope;
        var ctrlrname = '_test';

        $rootScope[ctrlrname] = $scope;
        $scope.ctrlrName = ctrlrname;
        _fns.getCtrlrAgs($scope, $element);

        //需要载入的内容，仅限延迟使用，即时使用的需要加入index.html
        _fns.addLib('swal');
        _fns.addLib('toastr');
        _fns.addLib('md5');


        $scope.od='time';

        $scope.ps = {
            a: {
                time: 400,
                name: '400'
            },
            b: {
                time: 200,
                name: '200'
            },
            c: {
                time: 300,
                name: '300'
            }
        }
    };
})();
