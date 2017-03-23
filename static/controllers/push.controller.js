angular.module('controllers').controller('getAllMsgCtr', ['$http', '$scope', 'PushService', 'GetAllMsg',
    function ($http, $scope, PushService, GetAllMsg) {
        'use strict';

        $scope.msgs = GetAllMsg.content;
        $scope.size = GetAllMsg.size;
        $scope.maxSize = 5;
        $scope.currentPage = GetAllMsg.number;
        $scope.totalItems = GetAllMsg.totalElements;

        $scope.pageChanged = function () {
            PushService.getAllMsg($scope.currentPage).then(function (datas) {
                $scope.msgs = datas.content;
                $scope.currentPage = datas.number;
                $scope.totalItems = datas.totalElements;
                $scope.size = GetAllMsg.size;
                $scope.maxSize = 5;
            });
        };
    }
]);


angular.module('controllers').controller('getMsgCtr', ['$http', '$scope', '$stateParams', 'PushService',
    function ($http, $scope, $stateParams, PushService) {
        'use strict';
        $scope.msg = PushService.getMsg($stateParams.id);
    }
]);

angular.module('controllers').controller('getFeedCtr', ['$http', '$scope', '$stateParams', 'PushService',
    function ($http, $scope, $stateParams, PushService) {
        'use strict';
        $scope.msg = PushService.getFeed($stateParams.id);
    }
]);


angular.module('controllers').controller('pushMsgCtr', ['$http', '$state', '$scope', 'GetAllMsg',
    function ($http, $state, $scope, GetAllMsg) {
        'use strict';

        $scope.msgs = GetAllMsg;

        $scope.push = function () {

            var para = $scope.msg;
            para.pushdate = new Date().getTime();
            para.uid = getCookie("cmsuserid");
            para.name = getCookie("cmsusername");

            $.ajax({
                type: "POST",
                url: "push/" + para.platform,
                data: JSON.stringify(para),
                dataType: 'json',
                contentType: "application/json",
                success: function () {
                    $state.go("home.pushall");
                },
                error: function () {
                    $state.go("home.pushall");
                }
            });
        };

        $scope.pushper = function () {

            var para = $scope.msg;
            para.uid = getCookie("cmsuserid");
            para.name = getCookie("cmsusername");
            var ser = "uid=" + para.uid;
            ser += "&name=" + para.name;
            ser += "&title=" + para.title;
            ser += "&content=" + para.content;
            ser += "&mobile=" + para.mobile;
            $.ajax({
                type: "GET",
                url: "push/pushper?" + ser,
                success: function () {
                    $state.go("home.pushall");
                },
                error: function () {
                    $state.go("home.pushall");
                }
            });
        }
    }
]);

angular.module('controllers').controller('pushFeedBackCtr', ['$http', '$state', '$scope', 'GetAllFeed',
    'PushService',
    function ($http, $state, $scope, GetAllFeed, PushService) {
        'use strict';
        $scope.msgs = GetAllFeed.content;
        $scope.size = GetAllFeed.size;
        $scope.maxSize = 5;
        $scope.currentPage = GetAllFeed.number; //��ǰҳ
        $scope.totalItems = GetAllFeed.totalElements;

        $scope.pageChanged = function () {
            PushService.getAllFeed($scope.currentPage).then(function (datas) {
                $scope.msgs = datas.content;
                $scope.currentPage = datas.number;
                $scope.totalItems = datas.totalElements;
                $scope.size = GetAllFeed.size;
                $scope.maxSize = 5;
            });
        };


        $scope.feedback = function () {
            var dt = {};
            dt.uid = 1;
            dt.content = "001";
            dt.platform = "ios";
            dt.feeddate = new Date().getTime();

            $.ajax({
                type: "POST",
                url: "push/feedback",
                data: JSON.stringify(dt),
                dataType: 'json',
                contentType: "application/json",
                success: function () {
                    //$state.go("home.pushall");
                },
                error: function () {
                    //$state.go("home.pushall");
                }
            });
        }

    }
]);