var app = angular.module("myapp", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: "pages_2/home.html"
        })
        .when("/about", {
            templateUrl: "pages_2/about.html"
        })
        .when("/contact", {
            templateUrl: "pages_2/contact.html"
        })
        .when("/account/login", {
            templateUrl: "pages_2/account/login.html"
        })
        .when("/account/register", {
            templateUrl: "pages_2/account/register.html"
        })
        .when("/account/forgot", {
            templateUrl: "pages_2/account/forgot.html"
        })
        .when("/account/logoff", {
            redirectTo: "/home"
        })
        .when("/account/change", {
            templateUrl: "pages_2/account/change.html"
        })
        .when("/account/profile", {
            templateUrl: "pages_2/account/profile.html"
        })
        .when("/account/orders", {
            templateUrl: "pages_2/account/orders.html"
        })
        .when("/account/products", {
            templateUrl: "pages_2/account/products.html"
        })
        .when("/category/:id", {
            templateUrl: "pages_2/ProductList.html",
            controller: "categoryCtrl"
        })
        .when("/supplier/:id", {
            templateUrl: "pages_2/ProductList.html",
            controller: "supplierCtrl"
        })
        .when("/special/:id", {
            templateUrl: "pages_2/ProductList.html",
            controller: "specialCtrl"
        })
        .otherwise({
            redirectTo: "/home"
        });
});
app.run(function($rootScope) {
    $rootScope.$on('$routeChangeStart', function() {
        $rootScope.loading = true;
        console.log("Loading");
    });
    $rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.loading = false;
        console.log("Loaded");
    });
    $rootScope.$on('$routeChangeError', function() {
        $rootScope.loading = false;
        alert("Error");
    });
});