/**
 * Created by Administrator on 2016-10-25.
 */

angular.module('controllers', []);
angular.module('services', []);
angular.module('routeApp', [
    'ui.router',
    'ui.bootstrap',
    'controllers',
    'services'
]).config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url:'/',
            views: {
                'head': {
                    templateUrl: '/static/views/head.html',
                    controller: 'HeadController'
                },
                'ltnav': {
                    templateUrl: '/static/views/ltnav.html',
                    controller: 'NavController'
                },
                'rtcontent': {
                    templateUrl: '/static/views/rtcontent.html',
                    controller: 'NavController'
                }
            },
            resolve: {
                Admin: ['AdminService', function (resolve) { return resolve.getAdminInfo();}],
                Nav: ['NavService', function (resolve) { return resolve.getNavInfo();}]
            }
        })

        .state('home.search', {
            url:'search',
            views: {
                'rtcontent@': {
                    templateUrl: '/static/views/search.html',
                    controller: 'SearchController'
                }
            }
        })

        .state('home.admininfo', {
            url:'admin/info',
            views: {
                'rtcontent@': {
                    templateUrl: '/static/views/admininfo.html'
                }
            }
        })

        .state('home.adminedit', {
            url:'admin/edit',
            views: {
                'rtcontent@': {
                    templateUrl: '/static/views/adminedit.html',
                    controller: 'AdminChangeController'
                }
            }
        })


        .state('home.userlist', {
            url:'user/list',
            views: {
                'rtcontent@': {
                    templateUrl: '/static/views/userlist.html',
                    controller: 'UserListController'
                }
            },
            resolve: {
                Users: ['UserService', function (resolve) { return resolve.getAllUser();}]
            }
        })

        .state('home.userdetail', {
            url:'user/detail/:id',
            views: {
                'rtcontent@': {
                    templateUrl: '/static/views/userdetail.html',
                    controller: 'UserDetailController'
                }
            }
        })

        .state('home.useredit', {
            url:'user/edit/:id',
            views: {
                'rtcontent@': {
                    templateUrl: '/static/views/useredit.html',
                    controller: 'UserEditController'
                }
            }
        })

        .state('home.livecourse', {
            url:'course/live',
            views: {
                'rtcontent@': {
                    templateUrl: '/static/views/livecourse.html',
                    controller: 'LiveCourseController'
                }
            },
            resolve: {
                Lives: ['CourseService', function (resolve) { return resolve.getAllLive();}]
            }
        })

        .state('home.hiscourse', {
            url:'course/his',
            views: {
                'rtcontent@': {
                    templateUrl: '/static/views/hiscourse.html',
                    controller: 'HisCourseController'
                }
            },
            resolve: {
                Hiss: ['CourseService', function (resolve) { return resolve.getAllHis();}]
            }
        })

        .state('home.mt4list', {
            url:'mt4/list',
            views: {
                'rtcontent@': {
                    templateUrl: '/static/views/mt4list.html'
                }
            }
        })

        .state('home.mt4han', {
            url:'mt4/han',
            views: {
                'rtcontent@': {
                    templateUrl: '/static/views/mt4han.html'
                }
            }
        })

        .state('home.mt4gen', {
            url:'mt4/gen',
            views: {
                'rtcontent@': {
                    templateUrl: '/static/views/mt4gen.html'
                }
            }
        })

        .state('home.mt4recommend', {
            url:'mt4/recommend',
            views: {
                'rtcontent@': {
                    templateUrl: '/static/views/mt4recommend.html',
                    controller: 'MT4recommendController'
                }
            },
            resolve: {
                MT4: ['UserService', function (resolve) { return resolve.getMt4strategyAll();}],
                MT4RECOMMEND: ['UserService', function (resolve) { return resolve.getMt4Recommend();}]
            }
        })
        .state('addUser', {
            url:'/user/add',
            views: {
                'rtcontent@': {
                    templateUrl: '/static/templates/adduser.html',
                    controller: 'UserAddController'
                }
            }
        })
}]);
