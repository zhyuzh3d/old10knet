/*上传文件指令，带有上传的进度条
需要jquery和bootstrap
输入对象xhrs；属性包含多个xhr；每个xhr.file存储上传文件的信息
输出jo，整个指令的模板，可以从这里获取各个dom元素
上传每个文件完毕的回调cb(f,res)
*/
(function() {

    angular.module('app').directive('fileUploader', function() {
        return {
            restrict: 'ACEM',
            replace: true,
            transclude: false,
            templateUrl: _fns.getDrctvTmp('fileUploader'),
            scope: {
                xhrs: '=',
                jo: '=',
                cb: '='
            },
            controller: function($scope, $element) {
                if ($scope.jo) $scope.jo = $element;


                //上传按钮
                $scope.uploadFile = function(evt) {
                    var btnjo = $(evt.target);
                    var btnlable = btnjo.html();
                    $scope.uploadId = _fns.uploadFile(btnjo,
                        function(f, res) {
                            //before
                            $scope.$apply($scope.updateXhrs);
                        }, function(f, proevt) {
                            //progress
                            $scope.$apply($scope.updateXhrs);
                        }, function(f, res) {
                            //sucess
                            if ($scope.cb) $scope.cb(f, res); //运行外部传来的回调
                            f.url = res.url;
                            $scope.$apply($scope.updateXhrs);
                        }, function() {
                            //abort
                            $scope.$apply();
                        });
                };

                //同步req和xhrs
                $scope.updateXhrs = function() {
                    $scope.reqs = _cfg.xhrs[$scope.uploadId];
                    if ($scope.xhrs) $scope.xhrs = $scope.reqs;
                }


                //移除按钮
                $scope.removeFile = _fns.abortUpload;

                //设置蒙版宽度
                $scope.setwidth = function(xhr) {
                    var res = {
                        'width': xhr.file.percent + '%'
                    }
                    return res;
                };

            },
        };
    });

    //--end--
})();
