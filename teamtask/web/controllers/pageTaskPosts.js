/*我的任务页面控制器
args:{taskKey:'...'}
 */

(function() {
    var ctrlrname = 'pageTaskPosts';
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
            return;
        };

        //必须指定taskKey
        if (!$scope.args.taskKey) {
            swal('获取任务跟帖失败：找不到任务', function() {
                $rootScope.topNavbar.changePage('pageTasks');
            });
            return;
        };

        //获取任务基本信息
        $scope.getTask = function() {
            _wdapp.child('tasks/' + $scope.args.taskKey).on('value', function(shot) {
                $scope.task = shot.val();
            }, function(err) {
                swal('获取任务跟帖失败,请重新尝试');
            });
        };
        $scope.getTask();


        //任务相关操作的his
        var hisOpTypes = $scope.hisOpTypes = _cfg.hisOpTypes.task;

        //把操作历史记录到taskHiss,并同步到个人纪录uis3hiss
        $scope.addTaskHis = function(uid, taskkey, operate, args) {
            var dt = {
                uid: uid,
                targetType: 'task',
                targetKey: taskkey,
                operate: operate,
                args: args || 0,
                time: Number(new Date()),
            };
            var newobj = _wdapp.child('taskHiss').push(dt, $scope.dbCallbackED);
            var key = newobj.key();
            var dt = {};
            dt[uid] = key;
            _wdapp.child('uis3hiss').update(dt, $scope.dbCallbackED);
        };


        //添加一个任务
        $scope.addPost = function() {
            swal({
                title: "",
                text: '输入您的文字内容',
                type: 'input',
                showCancelButton: true,
            }, function(ipt) {
                if (ipt) {
                    var newobj = _wdapp.child('posts').push({
                        content: ipt,
                        time: Number(new Date()),
                        authorId: xdat.authData.uid,
                    });

                    var postkey = newobj.key();
                    //写入uid3posts属性
                    _wdapp.child('posts/' + postkey).update({
                        key: postkey
                    });

                    //写入uid3posts属性
                    var dt = {};
                    dt[postkey] = postkey;
                    _wdapp.child('uid3posts/' + xdat.authData.uid).update(dt);

                    //写入到task3posts
                    _wdapp.child('task3posts/' + $scope.task.key).update(dt);

                    //增加任务的回帖计数
                    _wdapp.child('tasks/' + $scope.task.key + '/postCount').transaction(function(currank) {
                        return currank + 1;
                    });

                    //记录历史
                    $scope.addTaskHis(xdat.authData.uid, $scope.task.key, hisOpTypes.addPost.value, postkey);
                };
            });
        };

        //获取任务的跟帖列表
        $scope.getPosts = function() {
            _wdapp.child('task3posts/' + $scope.args.taskKey).on('value', function(shot) {
                $scope.postKeys = shot.val();

                $scope.posts = [];
                //逐个读取跟帖内容
                for (var pkey in $scope.postKeys) {
                    _wdapp.child('posts/' + pkey).on('value', function(shot) {
                        var post = shot.val();
                        post.time = new Date(post.time);
                        $scope.posts.push(post);

                        //读取post作者信息
                        _wdapp.child('users/' + post.authorId).on('value', function(shot) {
                            post.author = shot.val();
                            _fns.applyScope($scope);
                        }, function(err) {
                            toastr.error('获取跟帖作者失败,请重新尝试');
                        });
                    }, function(err) {
                        toastr.error('获取任务跟帖列表失败,请重新尝试');
                    });
                };
            }, function(err) {
                swal('获取任务跟帖列表失败,请重新尝试');
            });
        };
        $scope.getPosts();


        //按时间排序函数
        $scope.sortByTime=function(obj){
            return obj['content'];
        };


        //---end--
    };
})();
