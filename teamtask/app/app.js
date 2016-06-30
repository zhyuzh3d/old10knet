//每个页面都引入这个文件，提供所有的全局设置和文件引入

var _app = {}; //最高全局变量，angular
var _cfg = {}; //最高全局变量，功用设置
var _fns = {}; //最高全局变量，公用函数

(function _main() {
    'use strict';

    //自动载入库文件
    _cfg.libs = {
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
        }
    };

    _cfg.load = function(libstr) {
        var lib = _cfg.libs[libstr];
        if (libstr && lib && !lib.loaded) {
            for (var attr in lib) {
                var htmlstr = '';
                //匹配文件类型
                switch (attr) {
                    case 'js':
                        htmlstr = '<script src="' + lib[attr] + '"><\/script>';
                        break;
                    case 'css':
                        htmlstr = '<link href="' + lib[attr] + '" rel="stylesheet">';
                        break;
                    default:
                        break;
                };
                //载入文件
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


    /*angular初始设置,提供全局功能函数
     */
    _app = angular.module('app', [
        'app.factories',
        'app.services',
        'app.filters',
        'app.directives',
        'app.controllers'
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
        $rootScope.xdat = {};

        //所有链接地址
        $rootScope.url = {};
        $rootScope.url.topNavbar = '/teamtask/app/controllers/topNavbar.html';
        $rootScope.url.pageLogin = '/teamtask/app/controllers/pageLogin.html';
        $rootScope.url.pageTask = '/teamtask/app/controllers/pageTask.html';
        $rootScope.url.pageReport = '/teamtask/app/controllers/pageReport.html';
        $rootScope.url.pageSet = '/teamtask/app/controllers/pageSet.html';

    });


    /*重新应用scope
     */
    _fns.applyScope = function(scp) {
        if (scp && scp.$root && scp.$root.$$phase != '$apply' && scp.$root.$$phase != '$digest') {
            scp.$apply();
        };
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

    /*创建唯一的id
     */
    $.uuid = function uniqueId(prefix) {
        var ts = Number(new Date()).toString(36)
        var rd = Number(String(Math.random()).replace('.', '')).toString(36);
        var res = ts + '-' + rd;
        if (prefix) res = prefix + '-' + res;
        return res;
    };


})();
