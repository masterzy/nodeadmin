/**
 * admin service func
 *
 * getAdminInfo
 *
 * */
angular.module('services').factory('AdminService', ['$q', '$http',
    function ($q, $http) {
        return {
            getAdminInfo: function () {
                var para = {
                    'username': $.cookie('cmsuser'),
                    'userpwd': $.cookie('cmsupwd')
                };
                var deferred = $q.defer();
                $http.post('/cms/admin', JSON.stringify(para))
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                            window.location.href = "/cms/"
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                    });

                return deferred.promise;
            },
            changepwd: function (pa) {
                var deferred = $q.defer();
                $http.post('/cms/adminchange', JSON.stringify(pa))
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                    });

                return deferred.promise;
            }
        };
    }
]);


/**
 * search service func
 *
 * getSearchInfo
 *
 * */
angular.module('services').factory('SearchService', ['$q', '$http',
    function ($q, $http) {
        return {
            dosearch: function (para) {

                var deferred = $q.defer();
                $http.post('/cms/search', JSON.stringify(para))
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                    });

                return deferred.promise;
            }
        };
    }
]);


/**
 * nav service func
 *
 * getNavInfo
 *
 * */
angular.module('services').factory('NavService', ['$q', '$http',
    function ($q, $http) {
        return {
            getNavInfo: function () {
                var deferred = $q.defer();
                $http.get('/cms/navinfo')
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            window.location.href = "/cms/"
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });

                return deferred.promise;
            }
        };
    }
]);


/**
 * Wx service func
 *
 * 微信测试
 *
 * */
angular.module('services').factory('WxService', ['$q', '$http',
    function ($q, $http) {
        return {
            checksignature: function (pa) {
                var deferred = $q.defer();
                $http.post('/cms/test', JSON.stringify(pa))
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                    });

                return deferred.promise;
            }
        };
    }
]);
/**
 * nav service func
 *
 * getNavInfo
 *
 * */
angular.module('services').factory('DataProcessService', [
    function () {
        return {
            getData: function (ret) {
                var data = {
                    users : ret.data,
                    size : ret.persize,
                    currentPage : ret.cur == '0' ? '1' : ret.cur,
                    totalItems : ret.total,
                    numPages : ret.page,
                    maxSize : 5
                };
                return data;
            }
        };
    }
]);
/**
 *
 * user service func
 * */
angular.module('services').factory('UserService', ['$q', '$http',
    function ($q, $http) {
        var AllUsers = {};
        return {
            getUserRemote: function (id) {
                var deferred = $q.defer();
                $http.get('/cms/user/get/' + id)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            window.location.href = "/cms/";
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });
                return deferred.promise;
            },
            getAllUser: function (datapage) {
                if (!datapage) {
                    datapage = 0;
                }
                var deferred = $q.defer();
                $http.get('/cms/user/all/' + datapage, {cache: true})
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            window.location.href = "/cms/"
                        } else {
                            AllUsers = res.data;
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });

                return deferred.promise;
            },
            getUserById: function (ids) {
                var deferred = $q.defer();

                if ($.isEmptyObject(AllUsers)) {
                    this.getUserRemote(ids).then(function (retdata) {
                        deferred.resolve(retdata);
                    });
                } else {
                    var ret = null;
                    $.each(AllUsers.data, function (idx, tmp) {
                        if (ids == tmp.id) {
                            ret = tmp;
                        }
                    });
                    deferred.resolve(ret);
                }
                return deferred.promise;
            },
            getMt4strategyById: function(id) {
                var deferred = $q.defer();
                $http.get('/cms/mt4strategy/get/' + id)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            window.location.href = "/cms/";
                        } else {
                            deferred.resolve(res.data.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });
                return deferred.promise;
            },
            getMt4strategyAll: function (datapage) {
                if (!datapage) {
                    datapage = 0;
                }
                var deferred = $q.defer();
                $http.get('/cms/mt4strategy/all/' + datapage)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });

                return deferred.promise;
            },
            saveMt4recommend: function (obj) {
                var para = {
                    'uid': obj.uid,
                    'uname': obj.name,
                    'mt4id': obj.mt4id
                };

                var deferred = $q.defer();
                $http.post('/cms/mt4strategy/save', JSON.stringify(para))
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                            window.location.href = "/cms/"
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                    });

                return deferred.promise;
            },
            getMt4Recommend: function (datapage) {
                if (!datapage) {
                    datapage = 0;
                }
                var deferred = $q.defer();
                $http.get('/cms/mt4recommend/all/' + datapage)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });

                return deferred.promise;
            },
            AddUser: function(pa){
                var deferred = $q.defer();
                $http.post('/cms/user/add',pa)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                    });

                return deferred.promise;
            }
        };
    }
]);


/**
 *
 * course service func
 * */
angular.module('services').factory('CourseService', ['$q', '$http',
    function ($q, $http) {
        return {
            Lives: {},
            His: {},
            getLiveRemote: function (id) {
                var deferred = $q.defer();
                $http.get('/cms/live/get/' + id)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });
                return deferred.promise;
            },
            getAllHis: function (datapage) {
                if (!datapage) {
                    datapage = 0;
                }
                var deferred = $q.defer();
                $http.get('/cms/his/all/' + datapage)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            His = res.data;
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });

                return deferred.promise;
            },
            getAllLive: function (datapage) {
                if (!datapage) {
                    datapage = 0;
                }
                var deferred = $q.defer();
                $http.get('/cms/live/all/' + datapage)
                    .then(function (res) {
                        if ($.isEmptyObject(res)) {
                            deferred.reject();
                        } else {
                            Lives = res.data;
                            deferred.resolve(res.data);
                        }
                    }, function () {
                        deferred.reject();
                        window.location.href = "/cms/"
                    });

                return deferred.promise;
            },
            getLiveById: function (ids) {
                var deferred = $q.defer();

                if ($.isEmptyObject(Lives)) {
                    this.getLiveRemote(ids).then(function (retdata) {
                        deferred.resolve(retdata);
                    });
                } else {
                    var ret = null;
                    $.each(Lives.data, function (idx, tmp) {
                        if (ids == tmp.id) {
                            ret = tmp;
                        }
                    });
                    deferred.resolve(ret);
                }

                return deferred.promise;
            }
        };
    }
]);
