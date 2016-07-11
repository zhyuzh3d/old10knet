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
    _cfg.startPage = '_test';

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
            }
        }
    }



    /*重新封装console的函数*/
    var cnslPreStr = '>';
    console.xerr = function() {
        var args = arguments;
        console.info(cnslPreStr, 'ERR:');
        console.error.apply(this, args);
    };
    console.xlog = function() {
        var args = arguments;
        console.info(cnslPreStr, 'LOG:');
        console.log.apply(this, args);
    };
    console.xinfo = function() {
        var args = arguments;
        console.info(cnslPreStr, 'INFO:');
        console.info.apply(this, args);
    };
    console.xwarn = function() {
        var args = arguments;
        console.info(cnslPreStr, 'WARN:');
        console.xwarn.apply(this, args);
    };


    /*专用err处理函数,适合co().then()使用*/
    __errhdlr = __errhdlr;

    function __errhdlr(err) {
        console.xerr(err.stack);
    };

    /*专用空函数，只输出不做额外处理,适合co().then()使用*/
    __nullhdlr = __nullhdlr;

    function __nullhdlr(res) {};

    /*专用空函数，只输出不做额外处理,适合co().then()使用*/
    __infohdlr = __infohdlr;

    function __infohdlr(res) {
        console.xinfo(res);
    };

    /*专用空函数，只纪录日志不做额外处理,适合co().then()使用*/
    __loghdlr = __loghdlr;

    function __loghdlr(res) {
        console.xlog(res);
    };



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
            js2: '//' + _cfg.host + '/lib/simditor/latest/scripts/uploader_qn.js',
            js3: '//' + _cfg.host + '/lib/simditor/latest/scripts/simditor.js',
        },
        plupload: {
            js: '//cdn.bootcss.com/plupload/2.1.9/moxie.min.js',
            js2: '//cdn.bootcss.com/plupload/2.1.9/plupload.dev.js',
            js2: '//cdn.bootcss.com/plupload/2.1.9/plupload.full.min.js',
        },
        qiniu: {
            js: '//cdn.bootcss.com/qiniu-js/1.0.15-beta/qiniu.min.js',
        },
        jform: {
            js: '//cdn.bootcss.com/jquery.form/3.51/jquery.form.min.js',
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
        $rootScope.startCtrlr = _fns.getCtrlr('topNavbar');
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
        var path = '/web/controllers/' + ctrlrname + '.html';
        var res = _fns.getRelUrl(path);
        return res;
    };

    /*获取指令页面，用于元素使用
     */
    _fns.getDrctv = function(drctvname) {
        var path = '/web/directives/' + drctvname + '.js';
        var res = _fns.getRelUrl(path);
        return res;
    };

    /*获取指令页面，用于元素使用
     */
    _fns.getDrctvTmp = function(drctvname) {
        var path = '/web/directives/' + drctvname + '.html';
        var res = _fns.getRelUrl(path);
        return res;
    };


    /*自动载入控制器对应的js*/
    _fns.addCtrlrJs = function(ctrlrname) {
        var all_js = document.getElementsByTagName("script");
        var cur_js = $(all_js[all_js.length - 1]);
        cur_js.prev().append('<script src="' + _fns.getRelUrl('/web/controllers/' + ctrlrname + '.js') + '"><\/script>');
    };

    /*自动载入指令对应的js*/
    _fns.addDrctvJs = function(drctvname) {
        var all_js = document.getElementsByTagName("script");
        var cur_js = $(all_js[all_js.length - 1]);
        cur_js.prev().append('<script src="' + _fns.getRelUrl('/web/directives/' + drctvname + '.js') + '"><\/script>');
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


    /*七牛上传函数
     */
    _fns.setUploaderBtn = function(types, btnId, handlerFns, containerId, dropId) {

        var opt = {
            runtimes: 'html5,html4',
            browse_button: btnId,
            uptoken_url: 'http://www.10knet.com/api/getUploadToken',
            get_new_uptoken: false,
            unique_names: true,
            domain: 'http://pubfiles.10knet.com/',
            max_file_size: '100mb',
            max_retries: 3,
            chunk_size: '4mb',
            auto_start: true,
            x_vars: {
                'time': function(up, file) {
                    return file.name;
                },
            },
            init: {
                'FilesAdded': function(up, files) {
                    plupload.each(files, function(file) {
                        // 文件添加进队列后，处理相关的事情
                    });
                },
                'BeforeUpload': function(up, file) {
                    // 每个文件上传前，处理相关的事情
                },
                'UploadProgress': function(up, file) {
                    // 每个文件上传时，处理相关的事情
                },
                'FileUploaded': function(up, file, info) {
                    // 每个文件上传成功后，处理相关的事情
                    // 其中info是文件上传成功后，服务端返回的json，形式如：
                    // {
                    //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                    //    "key": "gogopher.jpg"
                    //  }
                    // 查看简单反馈
                    // var domain = up.getOption('domain');
                    // var res = parseJSON(info);
                    // var sourceLink = domain + res.key; 获取上传成功后的文件的Url
                },
                'Error': function(up, err, errTip) {
                    //上传出错时，处理相关的事情
                },
                'UploadComplete': function() {
                    //队列文件处理完毕后，处理相关的事情
                },
                'Key': function(up, file) {
                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在unique_names: false，save_key: false时才生效

                    var key = "";
                    // do something with key here
                    return key;
                }
            }
        };

        if (containerId && containerId != '') {
            opt.container = containerId;
        }

        if (dropId && dropId != '') {
            opt.dragdrop = true;
            opt.drop_element = dropId;
        };

        if (types && types != '') {
            opt.filters = [{
                extensions: types, //'png,jpg,gif'
            }];
        };

        if (handlerFns) {
            for (var attr in handlerFns) {
                opt.init[attr] = handlerFns[attr];
            };
        };

        return Qiniu.uploader(opt);
    };


    /*简单的随机uniqueid，随机加时间戳
     */
    _fns.uuid = function(strong) {
        var str1 = (new Date()).getTime().toString(32);
        if (!strong) strong = 1;
        var str2 = '';
        for (var i = 0; i < strong; i++) {
            str2 += (Math.random()).toString(32).substr(2);
        };
        return (str2 + str1).toUpperCase();
    };


    /*最基本的上传按钮
    progress(evt),//添加evt.percent
    successfn(res),//增加res.url
    返回一个uniqID，最终的xhr存储在_cfg.xhrs[uploadid][xhrid]，用于取消上传
    */
    _cfg.xhrs = {};

    /**
     * [[上传一个或多个文件]]
     * @param   {[[jquery对象]]} btnjo      [[*按钮]]
     * @param   {[[function]]} beforefn [[在发起上传之前执行的函数,fn(f,xhr)]]
     * @param   {[[function]]} progressfn [[上传过程中的函数，fn(f,evt),上传百分比进度evt.percent]]
     * @param   {[[function]]} successfn  [[上传成功后执行的函数，fn(f,res)，上传的文件地址res.url]]
     * @param   {[[function]]} abortfn    [[取消上传后执行的函数]]
     * @param   {[[function]]} errorfn    [[出错执行的函数,fn(f,err)，标准xhr参数]]
     * @param   {[[function]]} completefn [[上传完成执行的函数,fn(f,xhr,status),标准xhr参数]]
     * @param   {[[string]]} domain     [[上传到指定的bucket，默认http://pubfiles.10knet.com/]]
     * @param   {[[boolean]]} multi     [[同时上传多个文件]]
     * @returns {[[int]]} [[uploadId整数，指向一个数组包含所有文件的xhr，数组存放在_cfg.xhrs[uploadId]]]
     */
    _fns.uploadFile = function(btnjo, beforefn, progressfn, successfn, abortfn, errorfn, completefn, domain, multi) {
        if (!btnjo) {
            __errhdlr(new Error('_fns.uploadFile:button undefined.'));
            return;
        };

        //如果按钮已经有uploadid，那么直接使用，否则就重新创建
        var uploadId = btnjo.attr('uploadId') || _fns.uuid();
        btnjo.attr('uploadId', uploadId);
        if (!_cfg.xhrs[uploadId]) _cfg.xhrs[uploadId] = {};

        //创建file数据,隐身input放在btn之后
        var filejo = btnjo.siblings('#uploadFileInput');
        filejo.remove();
        filejo = $('<input id="uploadFileInput" type="file" style="display:none"></input>').appendTo(btnjo);
        if (multi) filejo.attr('multiple', "multiple");
        btnjo.after(filejo);


        //给file input添加监听
        filejo.bind('change', function() {
            var fileobjs = filejo.get(0).files;
            if (!domain) domain = 'http://pubfiles.10knet.com/';

            $.get('http://www.10knet.com/api/getUploadToken',
                function(res) {
                    for (var i = 0; i < fileobjs.length; i++) {
                        var f = fileobjs[i];

                        //执行上传之前的动作,预先放置一个空的xhr，带有file信息
                        var xhrid = _fns.uuid();
                        var xhr = {};
                        xhr.id = xhrid;
                        xhr.file = f;
                        _cfg.xhrs[uploadId][xhrid] = xhr;
                        if (beforefn) beforefn(f, xhr);


                        //开始上传
                        xhr = _fns.uploadFileQn(res.uptoken, f,
                            function(evt) {
                                //添加evt.percent,为了避免abort之后progress会多运行一次，所以使用f.abort做判断
                                if (progressfn && !f.abort) {
                                    if (evt.lengthComputable) {
                                        evt.percent = (100 * evt.loaded / evt.total).toFixed(0);
                                        f.percent = evt.percent;
                                    };
                                    progressfn(f, evt);
                                };
                            },
                            function(res) {
                                //把七牛的返回结果转为标准格式
                                res['success'] = true;
                                f.url = res.url = res['file_path'] = domain + res.key;
                                res['msg'] = 'upload ok.';
                                if (successfn) successfn(f, res);
                            },
                            function(err) {
                                if (errorfn) errorfn(f, err);
                            },
                            function(xhr, status) {
                                filejo.remove();
                                if (completefn) completefn(f, xhr, status);
                            }, domain);

                        if (xhr && abortfn) xhr['abortfn'] = abortfn;
                        xhr.id = xhrid;
                        if (xhr) _cfg.xhrs[uploadId][xhrid] = xhr;
                    }
                });

        });

        //激活按钮点击事件
        filejo.click();

        return uploadId;
    };


    /**
     * [[上传多个文件，与uploadFile单个文件相同]]
     */
    _fns.uploadFiles = function(btnjo, beforefn, progressfn, successfn, abortfn, errorfn, completefn, domain) {
        return _fns.uploadFile(btnjo, beforefn, progressfn, successfn, abortfn, errorfn, completefn, domain, true);
    };


    /**
     * [[取消上传]]
     * @param {[[int]]} xhrid [[最终xhr将存放在_cfg.xhrs[xhrid]]]
     */
    _fns.abortUpload = function(xhrid) {
        swal({
            title:'',
            text: "删除后将无法恢复，确认删除吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "是的，删除",
            cancelButtonText: "取消",
            closeOnConfirm: true,
            html: false
        }, function() {
            for (var upid in _cfg.xhrs) {
                var ups = _cfg.xhrs[upid];
                for (var xid in ups) {
                    var xhr = ups[xid];
                    xhr.file.abort = true;
                    xhr.abort();
                    delete ups[xid];
                    if (xhr.abortfn) xhr.abortfn();
                }
            };
        })
    };



    /**
     * [[上传到七牛存储的函数]]
     * @param   {[[string]]} token    [[上传的密匙]]
     * @param   {[[fileobj]]} file     [[文件对象inputjo.get(0).files[n]]]
     * @param   {[[function]]} progress [[上传过程中的函数，fn(evt),上传百分比进度evt.percent]]
     * @param   {[[function]]} success  [[上传成功后执行的函数，fn(res)，上传的文件地址res.url]]
     * @param   {[[function]]} abort    [[取消上传后执行的函数]]
     * @param   {[[function]]} error    [[出错执行的函数,fn(err)，标准xhr参数]]
     * @param   {[[function]]} complete [[上传完成执行的函数,fn(xhr,status),标准xhr参数]]
     * @param   {[[string]]} domain     [[上传到指定的bucket，默认http://pubfiles.10knet.com/]]
     * @returns {[[xhr]]} [[xmlhttprequest对象]]
     */
    _fns.uploadFileQn = function(token, file, progress, success, error, complete, domain) {
        var useargs = (token.constructor != String);

        if (useargs) token = arguments.token;
        if (!token) {
            __errhdlr(new Error('_fns.uploadFileQn:token undefined.'))
            return;
        };

        if (useargs) file = arguments.file;
        if (!file) {
            __errhdlr(new Error('_fns.uploadFileQn:file undefined.'))
            return;
        };

        if (useargs) domain = arguments.domain || 'http://pubfiles.10knet.com/';


        //准备fromdata
        var formdata = new FormData();
        formdata.append('token', token);
        formdata.append('file', file);

        //发起上传
        var set = {
            url: "http://up.qiniu.com",
            data: formdata,
            type: 'POST',
            processData: false, //屏蔽掉ajax自动header处理
            contentType: false, //屏蔽掉ajax自动header处理
        };

        //监听事件
        if (useargs) progress = arguments.progress;
        if (progress) {
            set.xhr = function() {
                //为ajax添加progress事件监听
                var xhr = $.ajaxSettings.xhr();
                if (!xhr.file) xhr.file = file;
                xhr.upload.addEventListener("progress", progress, false);
                return xhr;
            };
        };

        if (useargs) success = arguments.success;
        if (success) set.success = success;
        if (useargs) error = arguments.error;
        if (error) set.error = error;
        if (useargs) complete = arguments.complete;
        if (complete) set.complete = complete;

        var xhr = $.ajax(set);
        xhr.file = file;
        xhr.domain = domain;

        return xhr;
    };



    //所有文件类型及对应的fa图标
    _cfg.fileIcons = {
        'image/jpeg': 'fa fa-file-image-o',
        'video/mp4': 'fa fa-file-movie-o',
        'text/plain': 'fa fa-file-text-o',
        'application/x-zip-compressed': 'fa fa-file-archive-o',
        'application/msword': 'fa fa-file-word-o',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'fa fa-file-word-o',
        'application/vnd.ms-excel': 'fa fa-file-excel-o',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'fa fa-file-excel-o',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'fa fa-file-excel-o',
    };
    _fns.getFileIcon = function(typestr, size) {
        var res = _cfg.fileIcons[typestr] || 'fa fa-file-o';
        res = 'fa ' + res;
        if (size) res += ' ' + size;
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
