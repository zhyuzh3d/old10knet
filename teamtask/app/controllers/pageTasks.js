/*我的任务页面控制器
 */

(function () {
    var ctrlrname = 'pageTasks';
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

        //添加一个任务
        $scope.addTask = function () {
            swal({
                title: "",
                text: '输入任务名称',
                type: 'input',
                showCancelButton: true,
            }, function (ipt) {
                if (ipt) {
                    var newobj = _wdapp.child('tasks').push({
                        title: ipt,
                        time: Number(new Date()),
                        authorId: xdat.authData.uid,
                    });

                    //写入key属性
                    var key = newobj.key();
                    _wdapp.child('tasks/' + key).update({
                        key: key
                    });

                    //写入到author.myTaskkeys
                    var dt = {};
                    dt[key] = key;
                    _wdapp.child('users/' + xdat.authData.uid + '/authorTaskKeys').update(dt);
                };
            });
        };


        //读取任务列表 author 或 member
        $scope.getTasks = function (type) {
            var uid = _xdat.authData.uid;
            var tasksdb = 'users/' + uid + '/' + type + 'TaskKeys';
            _wdapp.child(tasksdb).on("value", function (shot, err) {
                var taskKeys = shot.val();
                $scope.tasks = {};
                for (var key in taskKeys) {
                    //读取task信息
                    _wdapp.child('tasks/' + key).on('value', function (shot, err) {
                        var task = shot.val();
                        if (!task) return;

                        $scope.tasks[key] = task;
                        task.time = new Date(task.time);
                        task.endTime = new Date(task.endTime);
                        task.key = key;

                        //读取每个作者信息
                        _wdapp.child('users/' + task.authorId).on("value", function (shot, err) {
                            task.author = shot.val();
                            _fns.applyScope($scope);
                        });

                        //读取每个成员的信息
                        task.members = {};
                        for (var subkey in task.memberIds) {
                            _wdapp.child('users/' + subkey).on("value", function (shot, err) {
                                var usr = shot.val();
                                task.members[usr.uid] = usr;
                                _fns.applyScope($scope);
                            });
                        };

                        _fns.applyScope($scope);
                    });
                };
                _fns.applyScope($scope);
            }, function (errorObject) {
                toastr.info('载入任务列表失败:' + errorObject);
            });
        };

        //初始化载入
        if (xdat.authData) {
            $scope.getTasks('author');
        };


        //删除团队
        $rootScope.delTask = function (tsk) {
            //从author.authorTaskKeys中删除
            _wdapp.child('users/' + tsk.authorId + '/authorTaskKeys/' + tsk.key).remove($scope.dbCallback);

            //从member.memberTaskKeys中删除
            for (var uid in tsk.memberIds) {
                _wdapp.child('users/' + uid + '/memberTaskKeys/' + tsk.key).remove($scope.dbCallback);
            };

            //删除team
            _wdapp.child('tasks/' + tsk.key).remove($scope.dbCallback);
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
        $scope.addMember = function (tsk) {
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
                            //把成员id写入task.memberIds
                            var uid = dat.val();
                            if (!uid) {
                                toastr.error('此用户不存在');
                            };
                            var dt = {};
                            dt[uid] = uid;
                            _wdapp.child('tasks/' + tsk.key + '/memberIds').update(dt, function (err, dat) {
                                if (err) {
                                    swal('数据操作失败:' + err);
                                } else {
                                    _fns.applyScope($scope);
                                };
                            });

                            //把teamkey写入到user.teamKeys
                            _wdapp.child('users/' + uid + '/memberTaskKeys').push({
                                key: tsk.key
                            }, $scope.dbCallbackED);
                        }
                    });
                };
            });
        };

        //删除成员
        $scope.delMember = function (tsk, mbr) {
            //从task.memberIds中移除
            _wdapp.child('tasks/' + tsk.key + '/memberIds/' + mbr.uid).remove($scope.dbCallback);

            //从member.memberTaskKeys中移除
            _wdapp.child('users/' + mbr.uid + '/memberTaskKeys/' + tsk.key).remove($scope.dbCallback);
        };



        //---end--
    };
})();
