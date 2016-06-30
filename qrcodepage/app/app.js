//每个页面都引入这个文件，提供所有的全局设置和文件引入

var _app = {}; //最高全局变量，angular
var _cfg = {}; //最高全局变量，功用设置
var _wdapp = new Wilddog("https://qcodepage.wilddogio.com"); //野狗app数据库

(function _main() {
    'use strict';

    _cfg.host = window.location.host;
    _cfg.homePath = '/qrcodepage';

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
        },
        qcode: {
            js: '//cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js'
        }
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


    //初始化angular app
    _app.run(function angularRun($rootScope) {
        //所有跨控制器共享数据
        $rootScope.xdat = {};

        //根据地址栏参数加载控制器
        var ctrlrname = $.getUrlParam('ctrlr') ? $.getUrlParam('ctrlr') + '.html' : 'qcodelist.html';
        $rootScope.ctrlr = $.getAbsUrl(ctrlrname);

        $rootScope.setCtrlr = function(nm) {
            $rootScope.ctrlr = $.getAbsUrl(nm);
        };
    });


    //-------------扩展jQuery-----

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

    /*获取地址栏参数
     */
    $.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    /*获取相对于当前页面的绝对地址
     */
    $.getAbsUrl = function(fname) {
        var res = _cfg.homePath + '/app/ctrlrs/' + fname;

        //获取当前页面地址，转换为根目录地址
        var n = window.location.pathname.split('/').length;
        for (var i = 0; i < n - 2; i++) {
            res = '../' + res;
        };
        return res;
    };

    /*获取路由页面，用于换页
     */
    $.getCtrlr = function(ctrlrname) {
        var path = _cfg.homePath + '/app/ctrlrs/' + ctrlrname + '.html';
        var res = $.getAbsUrl(path);
        return res;
    };

    /*自动载入控制器对应的js*/
    $.addCtrlrJs = function(ctrlrname) {
        var all_js = document.getElementsByTagName("script");
        var cur_js = $(all_js[all_js.length - 1]);
        cur_js.prev().append('<script src="' + $.getAbsUrl(ctrlrname + '.js') + '"><\/script>');
    };

    /*向head添加需要初始化的库，参照_cfg.libs
     */
    $.addLib = function(libstr) {
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


    /*重新应用scope
     */
    $.applyScope = function(scp) {
        if (scp && scp.$root && scp.$root.$$phase != '$apply' && scp.$root.$$phase != '$digest') {
            scp.$apply();
        };
    };


    //--end--
})();
