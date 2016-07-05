/*登录页面控制器
args:{redirCtrlr:'...'}
*/

(function () {
    var ctrlrname = 'pageLogin';
    angular.module('app').controller(ctrlrname, ['$rootScope', '$scope', '$element', fn]);

    function fn($rootScope, $scope, $element) {
        $rootScope[ctrlrname] = $scope;
        $scope.ctrlrName = ctrlrname;
        _fns.getCtrlrAgs($scope, $element);

        //需要载入的内容，仅限延迟使用，即时使用的需要加入index.html
        _fns.addLib('swal');
        _fns.addLib('toastr');
        _fns.addLib('md5');

        //检查登录信息，登陆成功自动跳转
        $scope.getAuth = function () {
            var authData = _wdapp.getAuth();
            if (authData) {
                $rootScope.xdat.authData = authData;
                _fns.applyScope($rootScope.topNavbar);
            };
        };

        //发送登陆信息
        $scope.login = function () {
            if (!$scope.email || !$scope.pw) {
                swal('格式错误');
            } else {
                // 使用email/password认证方式。
                _wdapp.authWithPassword({
                    email: $scope.email,
                    password: $scope.pw,
                }, function (error, authData) {
                    if (error) {
                        swal('登陆失败', error, 'error');
                    } else {
                        $rootScope.xdat.authData = authData;
                        $rootScope.topNavbar.changePage($scope.args.redirCtrlr);
                        $scope.getUser(authData.uid);
                        _fns.applyScope($rootScope.topNavbar);
                    };
                });
            }
        };

        //注册一个邮箱用户，创建users/uid
        $scope.register = function () {
            if (!$scope.email || !$scope.pw) {
                swal('格式错误');
            } else {
                _wdapp.createUser({
                    email: $scope.email,
                    password: $scope.pw,
                }, function (err, data) {
                    if (err != null) {
                        swal('注册失败:' + err);
                    } else {
                        //创建users
                        var dt = {};
                        var uid = data.uid;
                        dt[uid] = {
                            email: $scope.email,
                            nick: $scope.email.replace(/@.*$/g, ''),
                            uid: uid,
                        };
                        _wdapp.child('users').update(dt);

                        //创建邮箱md5到uid的索引
                        var dt2 = {};
                        dt2[md5($scope.email)] = uid;
                        _wdapp.child('umail2uid').update(dt2);

                        //自动登陆
                        $scope.login();
                    };
                })
            };
        };

        //获取用户信息
        $scope.getUser = function (uid) {
            _wdapp.child('users/' + uid).on('value', function (shot, err) {
                $rootScope.xdat.authData.user = shot.val();
                _fns.applyScope($rootScope.topNavbar);
            });
        };

    };
})();
