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
        _fns.addLib('moment');
        _fns.addLib('simditor');
        _fns.addLib('jform');
        _fns.addLib('plupload');
        _fns.addLib('qiniu');

        $scope.files = [];
        $scope.activebtn = function() {
            var fns = {
                //创建初始文字
                'FilesAdded': function(up, files) {
                    plupload.each(files, function(file) {
                        // 文件添加进队列后，处理相关的事情
                        file.faicon = _fns.getFileIcon(file.type, 'fa-2x');
                        file.percent = 65;
                        $scope.files.push(file);
                        _fns.applyScope($scope);
                    });
                },
                'UploadProgress': function(up, file) {
                    //上传过程中同步
                    console.log('-----up', up)
                    console.log('file', file);
                },
            }
            var upldr = _fns.setUploaderBtn('', 'pickfiles', fns, 'container', '');
        };


        $scope.remove = function(f) {
            var n = $scope.files.indexOf(f);
            $scope.files.splice(n, 1);
            _fns.applyScope($scope);
        }





        $scope.uploadfile = _fns.uploadFile;



        //---




        $scope.showeditor = function(evt) {

            var tajo = $(evt.target).siblings('#ta');

            $.get('http://www.10knet.com/api/getUploadToken', function(res) {
                var editor = new Simditor({
                    textarea: tajo,
                    upload: {
                        bucketDomain: 'http://pubfiles.10knet.com',
                        token: res.uptoken,
                        url: 'http://up.qiniu.com',
                        connectionCount: 3,
                        leaveConfirm: 'Uploading is in progress, are you sure to leave this page?'
                    },
                    pasteImage: true,
                });
            });
        };



        $scope.sendqn = function() {
            $.get('http://www.10knet.com/api/getUploadToken', function(res) {
                var f = $("#qnfile")[0].files[0]
                var xhr = new XMLHttpRequest();
                xhr.open('POST', "http://up.qiniu.com", true);
                var formData, startDate;
                formData = new FormData();
                formData.append('token', res.uptoken);
                formData.append('file', f);
                console.log('good formdata file', f);
                xhr.send(formData);
            });
        };



    };
})();
