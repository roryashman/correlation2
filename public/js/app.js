angular.module("correlationApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    contacts: function(Correlation) {
                        return Correlation.getCorrelations();
                    }
                }
            })
            .when("/new/correlation", {
                controller: "NewCorrelationController",
                templateUrl: "correlation-form.html"
            })
            .when("/correlation/:clientId", {
                controller: "EditCorrelationController",
                templateUrl: "correlation.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Correlation", function($http) {
        this.getCorrelations = function() {
            return $http.get("/correlation").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding correlations.");
                });
        }
        this.createCorrelation = function(Correlation) {
            return $http.post("/correlation", contact).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating Correlation");
                });
        }
        this.getCorrelation = function(ClientId) {
            var url = "/correlation/" + ClientId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this correlation.");
                });
        }
        
                })
    .controller("ListController", function(correlation, $scope) {
        $scope.correlation = correlation.data;
    })
    .controller("NewCorrelationController", function($scope, $location, Correlation) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveCorrelation = function(correlation) {
            Correlation.createCorrelation(correlation).then(function(doc) {
                var correlationUrl = "/correlation/" + doc.data._id;
                $location.path(correlationUrl);
            }, function(response) {
                alert(response);
            });
        }
    })
    .controller("EditCorrelationController", function($scope, $routeParams, Correlation) {
        Correlation.getCorrelation($routeParams.ClientId).then(function(doc) {
            $scope.correlation = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.correlationFormUrl = "correlation-form.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.correlationFormUrl = "";
        }

        $scope.saveCorrelation = function(correlation) {
            Correlations.editCorrelation(correlation);
            $scope.editMode = false;
            $scope.correlationFormUrl = "";
        }
    });