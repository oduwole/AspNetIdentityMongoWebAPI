app.factory('csvServie', ['$http','$q', function ($http,$q) {
    var Url = "src/utils/some.csv";
    var csvServiceFactory = {};
    var Items = $http.get(Url).then(function (response) {
        return csvParser(response.data);
    });

    var Item = function (Uri) {
        var deferred = $q.defer();
        $http.get(Uri).success(function (response) {
            deferred.resolve(csvParser(response.data));
        }).error(function (err, status) {
            deferred.reject(err);
        });

        return deferred.promise;
    }
    //return Items;
    csvServiceFactory.items = Items;
    csvServiceFactory.item = Item;
    return csvServiceFactory;
}]);