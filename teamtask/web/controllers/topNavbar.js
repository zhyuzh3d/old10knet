//顶部导航控制器
(function () {
    angular.module('app').controller('topNavbar', ['$rootScope', '$scope', fn]);

    function fn($rootScope, $scope) {
        $rootScope['topNavbar'] = $scope;

        //需要载入的内容，仅限延迟使用，即时使用的需要加入index.html
        _fns.addLib('swal');
        _fns.addLib('toastr');

        //切换页面函数，args为希望传入的对象
        $scope.changePage = function (pname, args) {
            //传递参数
            if (args) {
                if (!$rootScope.xdat[pname]) $rootScope.xdat[pname] = {};
                for (var attr in args) {
                    $rootScope.xdat[pname][attr] = args[attr];
                };
            };

            $scope.curPage = pname;
            $scope.curPageUrl = _fns.getCtrlr(pname);


        };
        $scope.changePage(_cfg.startPage);
    };
})();
