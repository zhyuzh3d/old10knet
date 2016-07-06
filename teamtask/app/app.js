//每个页面都引入这个文件，提供所有的全局设置和文件引入

var _app = {}; //最高全局变量，angular
var _cfg = {}; //最高全局变量，功用设置
var _wdapp = new Wilddog("https://teamtask.wilddogio.com"); //野狗app数据库

var _fns = {}; //最高全局变量，公用函数
var _xdat = {}; //共享变量

(function _main() {
    'use strict';

    _cfg.host = window.location.host;
    _cfg.homePath = 'teamtask';

    _cfg.startPage = 'pageTasks';

    //历史相关设置
    _cfg.hisOpTypes = {
        task: {
            add: {
                value: 'add',
                txt: '添加一个任务'
            },
            delete: {
                value: 'delete',
                txt: '删除一个任务'
            },
            addMember: {
                value: 'addMember',
                txt: '添加一个成员'
            },
            deleteMember: {
                value: 'deleteMember',
                txt: '删除一个成员'
            },
            setEndTime: {
                value: 'setTaskEndTime',
                txt: '设定截止日期'
            },
            setState: {
                value: 'setState',
                txt: '修改任务状态'
            },
            editContent: {
                value: 'editContent',
                txt: '修改任务内容'
            },
            editTitle: {
                value: 'editTitle',
                txt: '修改标题内容'
            },
            addPost: {
                value: 'addPost',
                txt: '添加一个跟帖'
            },
        }
    }


    //任务的状态
    _cfg.taskStates = [{
        value: 'undefined',
        icon: 'fa fa-ban fa-lg',
        txt: '未开始'
    }, {
        value: 'doing',
        icon: 'fa fa-play-circle fa-lg',
        txt: '正在做'
    }, {
        value: 'done',
        icon: 'fa fa-check-circle fa-lg',
        txt: '已完成'
    }, {
        value: 'drop',
        icon: 'fa fa-minus-circle fa-lg',
        txt: '已放弃'
    }];

    //自动载入库文件
    _cfg.libs = {
        jquery: {
            js: '//cdn.bootcss.com/jquery/2.2.4/jquery.min.js',
        },
        bootstrap: {
            js: '//cdn.bootcss.com/bootstrap/3.3.6/js/bootstrap.min.js',
            css: '//cdn.bootcss.com/bootstrap/3.3.6/js/bootstrap.min.js'
        },
        fontawesome: {
            css: '//cdn.bootcss.com/font-awesome/4.6.3/css/font-awesome.min.css'
        },
        wilddog: {
            js: '//cdn.wilddog.com/js/client/current/wilddog.js'
        },
        angular: {
            js: '//cdn.bootcss.com/angular.js/1.3.20/angular.min.js',
            js2: '//cdn.bootcss.com/angular.js/1.3.20/angular-resource.min.js'
        },
        swal: {
            js: '//cdn.bootcss.com/sweetalert/1.1.3/sweetalert.min.js',
            css: '//cdn.bootcss.com/sweetalert/1.1.3/sweetalert.min.css'
        },
        toastr: {
            js: '//cdn.bootcss.com/toastr.js/latest/js/toastr.min.js',
            css: '//cdn.bootcss.com/toastr.js/latest/css/toastr.min.css'
        },
        md5: {
            js: '//cdn.bootcss.com/blueimp-md5/2.3.0/js/md5.min.js'
        },
        qcode: {
            js: '//cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js'
        },
        moment: {
            js: '//cdn.bootcss.com/moment.js/2.13.0/moment.min.js'
        },
        module: {
            js: '//' + _cfg.host + '/lib/simditor/latest/scripts/module.js',
        },
        simditor: {
            lib: 'module',
            css: '//' + _cfg.host + '/lib/simditor/latest/styles/simditor.css',
            js1: '//' + _cfg.host + '/lib/simditor/latest/scripts/hotkeys.js',
            js2: '//' + _cfg.host + '/lib/simditor/latest/scripts/uploader.js',
            js3: '//' + _cfg.host + '/lib/simditor/latest/scripts/simditor.js',
        },
    };

    /*angular初始设置,提供全局功能函数
     */
    _app = angular.module('app', [
        'app.factories',
        'app.services',
        'app.filters',
        'app.directives',
        'app.controllers',
        'ui.bootstrap'
    ]).config(
        function angularConfig($locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
            $locationProvider.html5Mode(true);
            _app.controller = $controllerProvider.register;
            _app.service = $provide.service;
            _app.factory = $provide.factory;
            _app.directive = $compileProvider.directive;
            _app.filter = $filterProvider.register;
        }
    );

    angular.module('app.factories', []);
    angular.module('app.services', []);
    angular.module('app.filters', []);
    angular.module('app.directives', []);
    angular.module('app.controllers', []);

    _app.run(function angularRun($rootScope) {
        //所有跨控制器共享数据
        _xdat = $rootScope.xdat = {};

        //加载控制器
        $rootScope.startCtrlr = _fns.getCtrlr('topNavBar');
    });

    //自定义filter过滤器

    //显示为html样式
    _app.filter('toTrustHtml', ['$sce',
        function($sce) {
            return function(text) {
                return $sce.trustAsHtml(text);
            }
        }
    ]);





    /*获取地址栏参数
     */
    _fns.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    /*获取根目录相对于当前页面的相对地址
     */
    _fns.getRelUrl = function(fname) {
        var res = _cfg.homePath + fname;

        //获取当前页面地址，转换为根目录地址
        var n = window.location.pathname.split('/').length;
        for (var i = 0; i < n - 2; i++) {
            res = '../' + res;
        };
        return res;
    };


    /*获取路由页面，用于换页
     */
    _fns.getCtrlr = function(ctrlrname) {
        var path = '/app/controllers/' + ctrlrname + '.html';
        var res = _fns.getRelUrl(path);
        return res;
    };

    /*自动载入控制器对应的js*/
    _fns.addCtrlrJs = function(ctrlrname) {
        var all_js = document.getElementsByTagName("script");
        var cur_js = $(all_js[all_js.length - 1]);
        cur_js.prev().append('<script src="' + _fns.getRelUrl('/app/controllers/' + ctrlrname + '.js') + '"><\/script>');
    };

    /*向head添加需要初始化的库，参照_cfg.libs
     */
    _fns.addLib = function(libstr) {
        var lib = _cfg.libs[libstr];
        if (libstr && lib && !lib.loaded) {
            for (var attr in lib) {
                var htmlstr = '';

                //匹配文件类型,如果是lib则关联载入
                if (attr.substr(0, 2) == 'js') {
                    htmlstr = '<script src="' + lib[attr] + '"><\/script>';
                } else if (attr.substr(0, 3) == 'css') {
                    htmlstr = '<link href="' + lib[attr] + '" rel="stylesheet">';
                } else if (attr == 'lib') {
                    _fns.addLib(lib[attr]);
                };

                //载入文件到头部
                if (htmlstr) {
                    $('head').append(htmlstr);
                    lib.loaded = true;
                };
            };
        } else {
            if (lib.loaded) {
                console.log('_app.load:' + libstr + ' already exist.')
            } else {
                console.log('_app.load:' + libstr + ' format err.')
            };
        };
    };


    /*重新应用scope
     */
    _fns.applyScope = function(scp) {
        if (scp && scp.$root && scp.$root.$$phase != '$apply' && scp.$root.$$phase != '$digest') {
            scp.$apply();
        };
    };

    /*创建唯一的id
     */
    _fns.uuid = function uniqueId(prefix) {
        var ts = Number(new Date()).toString(36)
        var rd = Number(String(Math.random()).replace('.', '')).toString(36);
        var res = ts + '-' + rd;
        if (prefix) res = prefix + '-' + res;
        return res;
    };

    /*ctrlr获取上层传来的参数，优先使用xdat[ctrlr],其次使用dom的属性
    需要具有scope.ctrlrName属性
    写入到$scope.args
     */
    _fns.getCtrlrAgs = function(scope, element) {
        var res;
        if (scope) {
            if (!scope.args) scope.args = {};

            //提取dom传来的属性参数放到scope.args
            if (element) {
                var hargs = element.getParentAttr();
                for (var attr in hargs) {
                    scope.args[attr] = hargs[attr];
                };
            };

            //提取xdat的参数放到scope.args
            var xargs = _xdat[scope.ctrlrName] || {};
            for (var attr in xargs) {
                scope.args[attr] = xargs[attr];
            };

            res = scope.args;
        };
        return res;
    };

    /*扩展$,获取父层的参数
    控制器用来获取由页面传来的参数，这些值都设定在模版父层<div ng-include='aa' name='jack'>，得到{ng-include:'aa',name:'jack'}
    */
    $.fn.getParentAttr = $getParentAttr;

    function $getParentAttr() {
        var res = {};
        var jo = this;
        if (jo && jo[0] && jo.parent()[0]) {
            var attrs = jo.parent()[0].attributes;
            for (var i = 0; i < attrs.length; i++) {
                var attr = attrs[i];
                res[attr.name] = attr.value;
            };
        };
        return res;
    };



})();
