/*我的团队页面控制器
 */

(function () {
    var ctrlrname = 'pageTeams';
    angular.module('app').controller(ctrlrname, ['$rootScope', '$scope', '$element', fn]);

    function fn($rootScope, $scope, $element) {
        $rootScope[ctrlrname] = $scope;
        $scope.ctrlrName = ctrlrname;
        _fns.getCtrlrAgs($scope, $element);

        //载入外部依赖
        _fns.addLib('swal');
        _fns.addLib('toastr');

        //如果未登录自动跳到登陆
        var xdat = $rootScope.xdat;
        if (!xdat.authData) {
            $rootScope.topNavbar.changePage('pageLogin', {
                redirCtrlr: ctrlrname
            });
        };

        //添加一个团队
        $scope.addTeam = function () {
            swal({
                title: "",
                text: '输入团队名称',
                type: 'input',
                showCancelButton: true,
            }, function (ipt) {
                if (ipt) {
                    var newobj = _wdapp.child('teams').push({
                        name: ipt,
                        time: Number(new Date()),
                        authorId: xdat.authData.uid,
                    });

                    //写入key属性
                    var key = newobj.key();
                    _wdapp.child('teams/' + key).update({
                        key: key
                    });

                    //写入到author.myTeamkeys
                    _wdapp.child('users/' + xdat.authData.uid + '/authorTeamKeys').push({
                        key: key
                    })
                };
            });
        };


        //读取任务列表
        $scope.getTeams = function () {
            _wdapp.child('teams').on("value", function (shot, err) {
                $scope.teams = shot.val();
                for (var key in $scope.teams) {
                    var obj = $scope.teams[key];
                    //修改时间格式
                    obj.time = new Date(obj.time);
                    obj.key = key;

                    //读取每个作者信息
                    _wdapp.child('users/' + obj.authorId).on("value", function (shot, err) {
                        obj.author = shot.val();
                        _fns.applyScope($scope);
                    });

                    //读取每个成员的信息
                    obj.members = {};
                    if (obj.memberIds) {
                        for (var subkey in obj.memberIds) {
                            _wdapp.child('users/' + subkey).on("value", function (shot, err) {
                                obj.members[subkey] = shot.val();
                                _fns.applyScope($scope);
                            });
                        };
                    };
                };
                _fns.applyScope($scope);
            }, function (errorObject) {
                toastr.info('载入团队列表失败:' + errorObject);
            });
        };
        $scope.getTeams();


        //删除团队
        $rootScope.delTeam = function (team) {
            //从author.authorTeamKeys中删除
            _wdapp.child('users/' + team.authorId + '/authorTeamKeys/' + team.key).remove($scope.dbCallback);

            //从member.memberTeamKeys中删除
            for (var uid in team.memberIds) {
                _wdapp.child('users/' + uid + '/memberTeamKeys/' + team.key).remove($scope.dbCallback);
            };

            //删除team
            _wdapp.child('teams/' + team.key).remove($scope.dbCallback);
        };

        //通用数据读写后的回调(err,dat)
        $scope.dbCallbackED = function dbCallback(err, dat) {
            if (err) {
                swal('数据操作失败:' + err);
            } else {
                _fns.applyScope($scope);
            }
        };

        //通用数据读写后的回调(dat,err)
        $scope.dbCallbackDE = function dbCallback(dat, err) {
            if (err) {
                swal('数据操作失败:' + err);
            } else {
                _fns.applyScope($scope);
            }
        };

        //根据邮箱获取用户uid
        $scope.addMember = function (team) {
            swal({
                title: "",
                text: '输入他的邮箱',
                type: 'input',
                showCancelButton: true,
            }, function (ipt) {
                if (ipt) {
                    _wdapp.child('umail2uid/' + md5(ipt)).once('value', function (dat, err) {
                        if (err) {
                            swal('获取用户ID失败:' + err);
                        } else {
                            //把成员id写入到team
                            var uid = dat.val();
                            var dt = {};
                            dt[uid] = uid;
                            //_wdapp.child('teams/' + team.key + '/memberIds').update(dt, $scope.dbCallbackED);
                            _wdapp.child('teams/' + team.key + '/memberIds').update(dt, function (err, dat) {
                                if (err) {
                                    swal('数据操作失败:' + err);
                                } else {
                                    console.log('>>>team members', uid, team.memberIds);
                                    _fns.applyScope($scope);
                                };
                            });

                            //把teamkey写入到user.teamKeys
                            _wdapp.child('users/' + uid + '/memberTeamKeys').push({
                                key: team.key
                            }, $scope.dbCallbackED);
                        }
                    });
                };
            });
        };

        //删除成员
        $scope.delMember = function (team, mbr) {
            //从team.memberIds中移除
            _wdapp.child('teams/' + team.key + '/memberIds/' + mbr.uid).remove($scope.dbCallback);

            //从member.memberTeamKeys中移除
            _wdapp.child('users/' + mbr.uid + '/memberTeamKeys/' + team.key).remove($scope.dbCallback);
        };



        //---end--
    };
})();
