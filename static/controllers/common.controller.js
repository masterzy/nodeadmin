angular.module('controllers').controller('HeadController', ['$http', '$rootScope', '$location', 'AdminService', 'Admin',
    function ($http, $rootScope, $location, AdminService, Admin) {
        'use strict';
        $rootScope.admin = Admin;

        $rootScope.keyname = "";

        $rootScope.win_h = $(window).height() - 328;
        $rootScope.exit = function () {
            $.cookie('cms', 'false', {expires: 1, path: '/'});
            layer.msg("注销登录");
            window.location.href = '/cms/';
        };

        var _url = $location.absUrl().split('#/');
        $rootScope.addHtmlDialog = function ($event) {
            var title = false, w = "70%", h = '';
            if ($event.target.getAttribute('t')) title = $event.target.getAttribute('t');
            if ($event.target.getAttribute('w')) w = $event.target.getAttribute('w');
            if ($event.target.getAttribute('h')) h = $event.target.getAttribute('h');
            var area = [w, h];
            var url = $event.target.getAttribute('data-url');
            console.log(_url[0] + '#/' + url);
            layer.open({
                type: 2,
                title: title,
                area: area,
                content: _url[0] + '#/' + url
            });
        }
    }
]);

angular.module('controllers').controller('SearchController', ['$http', '$scope', 'SearchService',
    function ($http, $scope, SearchService) {
        'use strict';
        $scope.name = "";
        $scope.tel = "";

        $scope.users = {};
        $scope.size = {};
        $scope.currentPage = 0;
        $scope.totalItems = {};
        $scope.maxSize = 5;

        $scope.pageChanged = function () {
            var pa = {
                name: $scope.name,
                tel: $scope.tel,
                cur: $scope.currentPage
            };
            console.log(pa);
            SearchService.dosearch(pa).then(function (tmp) {
                if ($.isEmptyObject(tmp)) {
                } else {
                    $scope.users = tmp.data;
                    $scope.size = tmp.persize;
                    $scope.currentPage = tmp.cur;
                    $scope.totalItems = tmp.total;
                    $scope.maxSize = 5;
                }
            });
        };

        $scope.dosearch = function () {
            var pa = {
                name: $scope.name,
                tel: $scope.tel,
                cur: $scope.currentPage
            };
            SearchService.dosearch(pa).then(function (tmp) {
                if ($.isEmptyObject(tmp)) {
                } else {
                    $scope.users = tmp.data;
                    $scope.size = tmp.persize;
                    $scope.currentPage = tmp.cur;
                    $scope.totalItems = tmp.total;
                    $scope.maxSize = 5;
                }
            }, function () {
            });
        }
    }
]);

angular.module('controllers').controller('NavController', ['$http', '$scope', 'NavService', 'Nav', 'WxService',
    function ($http, $scope, NavService, Nav, Wxservice) {
        'use strict';
        $scope.nav = Nav;
        $scope.testWX = function () {
            //var para = {
            //    signature : 1,
            //    timestamp : 1489731160,
            //    nonce : 7
            //}
            //Wxservice.checksignature(para).then(function(data){
            //    console.log(data);
            //})
        }
    }
]);

angular.module('controllers').controller('AdminChangeController', ['$http', '$rootScope', '$scope', 'AdminService',
    function ($http, $rootScope, $scope, AdminService) {
        'use strict';

        $scope.changepwd = function () {
            if (typeof($scope.newpwd) == "undefined" || $scope.newpwd.trim() == "") {
                layer.msg("密码不能为空");
                return;
            }

            var para = {
                name: $rootScope.admin.name,
                password: $.md5($scope.newpwd)
            };
            AdminService.changepwd(para).then(function (data) {
                $rootScope.admin = data;
                $.cookie('cmsuser', data.name, {expires: 1, path: '/'});
                $.cookie('cmsupwd', data.password, {expires: 1, path: '/'});
                $.cookie('cms', 'true', {expires: 1, path: '/'});
                layer.msg("修改密码成功");
                window.location.href = '/cms/main';
            })
        };
    }
]);

angular.module('controllers').controller('UserListController', ['$http', '$scope', 'UserService', 'Users',
    function ($http, $scope, UserService, Users) {
        'use strict';
        $scope.users = Users.data;
        $scope.size = Users.persize;
        $scope.currentPage = Users.cur;
        $scope.totalItems = Users.total;
        $scope.maxSize = 5;

        $scope.pageChanged = function () {
            UserService.getAllUser($scope.currentPage).then(function (tmp) {
                $scope.users = tmp.data;
                $scope.size = tmp.persize;
                $scope.currentPage = tmp.cur;
                $scope.totalItems = tmp.total;
                $scope.maxSize = 5;
            });
        };
    }
]);

angular.module('controllers').controller('UserDetailController', ['$http', '$scope', '$stateParams', 'UserService',
    function ($http, $scope, $stateParams, UserService) {
        'use strict';
        UserService.getUserById($stateParams.id).then(function (data) {
            $scope.user = data;
        });
        UserService.getMt4strategyById($stateParams.id).then(function (data) {
            $scope.mt4strategy = data;
        });
    }
]);


angular.module('controllers').controller('UserEditController', ['$http', '$scope', '$stateParams', 'UserService',
    function ($http, $scope, $stateParams, UserService) {
        'use strict';
        UserService.getUserById($stateParams.id).then(function (data) {
            $scope.user = data;
        });
    }
]);


angular.module('controllers').controller('LiveCourseController', ['$http', '$scope', 'CourseService', 'Lives',
    function ($http, $scope, CourseService, Lives) {
        'use strict';
        $scope.lives = Lives.data;
        $scope.size = Lives.persize;
        $scope.currentPage = Lives.cur;
        $scope.totalItems = Lives.total;
        $scope.maxSize = 5;

        $scope.pageChanged = function () {
            CourseService.getAllLive($scope.currentPage).then(function (tmp) {
                $scope.lives = tmp.data;
                $scope.size = tmp.persize;
                $scope.currentPage = tmp.cur;
                $scope.totalItems = tmp.total;
                $scope.maxSize = 5;
            });
        };
    }
]);


angular.module('controllers').controller('HisCourseController', ['$http', '$scope', 'CourseService', 'Hiss',
    function ($http, $scope, CourseService, Hiss) {
        'use strict';
        $scope.hiss = Hiss.data;
        $scope.size = Hiss.persize;
        $scope.currentPage = Hiss.cur;
        $scope.totalItems = Hiss.total;
        $scope.maxSize = 5;

        $scope.pageChanged = function () {
            CourseService.getAllHis($scope.currentPage).then(function (tmp) {
                $scope.hiss = tmp.data;
                $scope.size = tmp.persize;
                $scope.currentPage = tmp.cur;
                $scope.totalItems = tmp.total;
                $scope.maxSize = 5;
            });
        };
    }
]);

angular.module('controllers').controller('MT4recommendController', ['$http', '$scope', 'UserService', 'MT4', 'MT4RECOMMEND',
    function ($http, $scope, UserService, MT4, MT4RECOMMEND) {
        'use strict';

        if (!$.isEmptyObject(MT4)) {
            $scope.mt4 = MT4.data;
            $scope.size = MT4.persize;
            $scope.currentPage = MT4.cur;
            $scope.totalItems = MT4.total;
            $scope.maxSize = 5;

            $scope.pageChanged = function () {
                UserService.getMt4strategyAll($scope.currentPage).then(function (tmp) {
                    $scope.mt4 = tmp.data;
                    $scope.size = tmp.persize;
                    $scope.currentPage = tmp.cur;
                    $scope.totalItems = tmp.total;
                    $scope.maxSize = 5;
                });
            };

            $scope.doadd = function (obj) {
                UserService.saveMt4recommend(obj).then(function () {
                    window.location.reload(true);
                })
            };
        }

        if (!$.isEmptyObject(MT4RECOMMEND)) {
            $scope.remt4 = MT4RECOMMEND.data;
            $scope.resize = MT4RECOMMEND.persize;
            $scope.recurrentPage = MT4RECOMMEND.cur;
            $scope.retotalItems = MT4RECOMMEND.total;
            $scope.remaxSize = 5;

            $scope.repageChanged = function () {
                UserService.getMt4Recommend($scope.recurrentPage).then(function (tmp) {
                    $scope.remt4 = tmp.data;
                    $scope.resize = tmp.persize;
                    $scope.recurrentPage = tmp.cur;
                    $scope.retotalItems = tmp.total;
                    $scope.remaxSize = 5;
                });
            };
        }

    }
]);

angular.module('controllers').controller('UserAddController', ['$http', '$scope', '$filter', '$stateParams', 'UserService',
    function ($http, $scope, $filter, $stateParams, UserService) {
        'use strict';
        $scope.formData = {
            'qiaomoney': 0,
            'createtime': $filter('date')(new Date(), "yyyy-MM-dd hh:mm:ss"),
            'updatetime': $filter('date')(new Date(), "yyyy-MM-dd hh:mm:ss")
    };
        console.log($scope.formData);
        $scope.addUser = function () {
            var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
            $scope.formData.password = $.md5($scope.password);
            UserService.AddUser($scope.formData).then(function (data) {
                if (data === 'false') {
                    layer.msg('添加用户失败', {
                        icon: 2
                    });
                } else {
                    parent.layer.msg('添加成功', {
                        icon: 1
                    });
                    parent.layer.close(index);
                }
            });
        }
    }
]);
