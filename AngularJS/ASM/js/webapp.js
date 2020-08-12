var app = angular.module('myapp', ['ngRoute']);
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'homeCtrl'
        })
        .when('/about', {
            templateUrl: 'pages/about.html'
        })
        .when('/faq', {
            templateUrl: 'pages/faq.html'
        })
        .when('/contact', {
            templateUrl: 'pages/contact.html',
            controller: 'homeCtrl'
        })
        .when('/feedback', {
            templateUrl: 'pages/feedback.html',
            controller: 'homeCtrl'
        })
        .when('/exam', {
            templateUrl: 'pages/exam.html',
            controller: 'homeCtrl'
        })
        .when('/exam/:id', {
            templateUrl: 'pages/exam.html',
            controller: 'homeCtrl'
        })
        .when('/profile', {
            templateUrl: 'pages/profile.html',
            controller: 'homeCtrl'
        })
        .when('/changepassword', {
            templateUrl: 'pages/changepassword.html',
            controller: 'homeCtrl'
        })
        .when('/forgetpassword', {
            templateUrl: 'pages/forgetpassword.html',
            controller: 'homeCtrl'
        })
        .when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'homeCtrl'
        })
        .when('/register', {
            templateUrl: 'pages/register.html',
            controller: 'homeCtrl'
        })
        .otherwise({
            redirectTo: '/'
        })
});

app.controller("homeCtrl", function($scope, $rootScope, $http, $routeParams, $timeout) {
    // Get Students
    $scope.listUser = listStudent;
    // Get Subjects
    $scope.Subjects = Subjects;
    // Check Login
    var fullname = sessionStorage.getItem("fullname");
    var email = sessionStorage.getItem("email");
    if (fullname != "") $rootScope.fullname = fullname;
    if (email != "") $rootScope.email = email;
    $rootScope.logout = function() {
        sessionStorage.clear();
        document.location = "index.html#!/login";
    }

    // Đồng hồ
    $scope.m = 05;
    $scope.s = 00;
    $scope.countDown = function() {
        if ($scope.s == -1) {
            $scope.m -= 1;
            $scope.s = 59;
        }
        if ($scope.m == -1) {
            alert('Hết giờ');
            $scope.m = 0;
            $scope.submitExam();
            return false;
        }
        $timeout(function() {
            $scope.s -= 1;
            $scope.countDown();
        }, 1000);
    }

    // Exam
    var idExam = $routeParams.id;
    if (idExam) {
        $scope.countDown();
        // Biến
        $scope.showExam = true;
        $scope.getExam = {};
        $scope.quizs = [];
        $scope.total = 0;
        $scope.pageSize = 1;
        $scope.start = 0;
        $scope.point = 0;
        $scope.idAnswer = 0;
        $scope.answer = 1;
        $scope.oldAnswer = 0;
        // -----------------------------

        // Lấy dữ liệu về
        var url = "db/Quizs/" + idExam + ".js";
        $http.get(url).then(
            function(r) {
                $scope.quizs = r.data;
                for (var i = 0; i < $scope.quizs.length; i++) {
                    $scope.total += 1;
                }
            },
            function(d) {
                alert('lỗi :' + d.statusText);
            }
        );

        // Get info Exam
        for (var i = 0; i < $scope.Subjects.length; i++) {
            exam = $scope.Subjects[i];
            if (idExam == exam.Id) {
                $scope.getExam = exam;
            }
        }

        // Lấy đáp án
        $scope.checkAnswer = function(e) {
            // Đáp án được chọn
            $scope.idAnswer = e.target.attributes['id-answer'].value;
            // Đáp án đúng 
            $scope.answer = e.target.attributes['answer'].value;
            // console.log("Đáp án được chọn:" + $scope.idAnswer + "- Đáp án đúng:" + $scope.answer);
        };

        // Tính điểm
        $scope.next = function() {

            if ($scope.start < $scope.quizs.length - $scope.pageSize) {
                $scope.start += $scope.pageSize;
            }

            // Nếu đúng và khác câu trả lời cũ thì điểm sẽ cộng.
            if ($scope.idAnswer == $scope.answer && $scope.answer != $scope.oldAnswer) {
                $scope.oldAnswer = $scope.answer;
                $scope.point += 1;
            }
        };

        $scope.submitExam = function() {
            confirm("Thời gian làm bài: 0" + (4 - $scope.m) + ":" + (60 - $scope.s) + " giây. \nĐiểm của bạn là: " + $scope.point + "/" + $scope.total);
            //prompt("Nhận xét của bạn về bài quizs này như thế nào?", "OKe?");
            document.location = "index.html#!/exam";
        };
    } else {
        $scope.showExam = false;
    }

    // Login
    $scope.checkUser = function() {
        var email = $scope.email;
        var password = $scope.password;
        var check = false;
        for (var i = 0; i < $scope.listUser.length; i++) {
            user = $scope.listUser[i];
            if (email == user.email && password == user.password) {
                check = true;
                sessionStorage.setItem("email", user.email);
                sessionStorage.setItem("fullname", user.fullname);
                document.location = "index.html";
            }
        }

        if (check == false) {
            $scope.error = "Sai tên đăng nhập hoặc mật khẩu!";
        }
    }

    // Reset Password
    $scope.resetPassword = function() {
        var email = $scope.Email;
        var check = false;
        for (var i = 0; i < $scope.listUser.length; i++) {
            user = $scope.listUser[i];
            if (email == user.email) {
                check = true;
                $scope.resetPass = user.password;
                break;
            }
        }
        if (check == false) {
            $scope.emailError = "Địa chỉ Email chưa được sử dụng";
        }
    }

    // Get info User
    for (var i = 0; i < $scope.listUser.length; i++) {
        user = $scope.listUser[i];
        if (email == user.email) {
            $scope.key = i;
            break;
        }
    }
    $scope.getStudent = angular.copy($scope.listUser[$scope.key]);

    // Register
    $scope.registerUser = function() {
        var fullName = $scope.fullName;
        var email = $scope.email;
        var password = $scope.Password;

        check = true;

        for (var i = 0; i < $scope.listUser.length; i++) {
            user = $scope.listUser[i];
            if (email == user.email) {
                $scope.registerError = "Địa chỉ Email đã được sử dụng.";
                check = false;
                break;
            }
        }

        if (check == true) {
            $scope.listUser.push({
                "password": password,
                "fullname": fullName,
                "email": email,
                "gender": "true",
                "birthday": "2000-05-05",
                "schoolfee": "0",
                "marks": "8"
            });
            document.location = "index.html#!/login";
        }
    }

    // changePassword
    $scope.changePassword = function() {
        var oldPassword = $scope.oldPassword;
        var newPassword = $scope.newPassword;
        if ($scope.getStudent.password == oldPassword) {
            $scope.listUser[$scope.key].password = newPassword;
            $scope.changePasssuc = "Đổi mật khẩu thành công."
        } else {
            $scope.changePassErr = "Mật khẩu cũ không đúng."
        }
    }
});

app.directive('equalsTo', [function() {
    return {
        restrict: 'A',
        scope: true,
        require: 'ngModel',
        link: function(scope, elem, attrs, control) {
            var check = function() {
                var p1 = scope.$eval(attrs.ngModel);
                var p2 = scope.$eval(attrs.equalsTo).$viewValue;
                return p1 == p2;
            };
            scope.$watch(check, function(isValid) {
                control.$setValidity("equalsTo", isValid);
            });
        }
    };
}]);