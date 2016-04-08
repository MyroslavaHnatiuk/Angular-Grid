'use strict';

/**
 * @ngdoc function
 * @name angularGridApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularGridApp
 */
angular.module('ngGridApp')
  .controller('MainCtrl', ['$scope', 'propertyModel', '$firebaseObject', '$window', 'factoryCRUD', 'NgTableParams', function ($scope, propertyModel, $firebaseObject, $window, factoryCRUD, NgTableParams) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var ref = new $window.Firebase("https://scorching-heat-8748.firebaseio.com");

    $scope.open1 = function () {
      $scope.popup1.opened = true;
    };

    $scope.popup1 = {
      opened: false
    };
    $scope.userDatas = {};

    $scope.tableParamsUsers = new NgTableParams({
      page: 1,
      count: 200,
      sorting: {id: "asc"}
    }, {

      counts: [],
      getData: function () {

        return factoryCRUD.getData().then(function (data) {
          return data;
        });
      }

    });


    $scope.getUserData = function () {
      return $scope.userDatas;
    };

    $scope.setUserData = function (data) {
      $scope.userDatas = data;
    };


    $scope.addNew = function () {

      factoryCRUD.search('login', $scope.login)
        .then(function (res) {
          if (res.status === 'found') {
            throw new Error("Login already exist")
          }
          return Promise.resolve(res);
        })
        .then(function(){
          propertyModel.init([

            {

              Name: "Login",

              DataType: String,

              IsRequired: true

            },
            {
              Name: "BirthDate",

              DataType: Date,

              IsRequired: false

            },

            {

              Name: "Age",

              DataType: Number,

              IsRequired: false,

              CalculateFrom: ["BirthDate"],

              Calculate: function (birthDate) {

                (Date.now() - birthDate) / (1000 * 60 * 60 * 24 * 365);

              }

            }

          ]);
          propertyModel.validateSchema();
          try {
            propertyModel.validate([

              {

                Login: $scope.login,


              },
              {
                BirthDate: $scope.birthDay

              }

            ]);
          } catch (e) {
            console.log(e);
            alert("Enter all fields");
          }
          $scope.registrationDate = new Date();
          factoryCRUD.save($scope.login, $scope.password, $scope.birthDay, $scope.registrationDate);
          $scope.tableParamsUsers.reload();

        })
        .catch(function(error){
          alert('Already taken')
        });




    };

    $scope.delete = function (itemId) {

      var confirm = $window.confirm('Do you really want to delete user?');

      if (confirm == true) {
        factoryCRUD.delete(itemId).then(function () {
          $scope.tableParamsUsers.reload();
        });
      }
    };


  }]);
