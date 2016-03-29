'use strict';

/**
 * @ngdoc function
 * @name angularGridApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularGridApp
 */
angular.module('ngGridApp')
  .controller('MainCtrl', ['$scope', 'propertyModel', '$firebaseObject', '$window', 'factoryCRUD', '$firebaseArray', function ($scope, propertyModel, $firebaseObject, $window, factoryCRUD, $firebaseArray) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var ref = new $window.Firebase("https://scorching-heat-8748.firebaseio.com");

    $scope.fetchData = function () {
      ref.once('value', function (snap) {
        if (snap.val() != null) {
          $scope.myObj = snap.val();

          $scope.$apply(
            function () {
              $scope.userDatas = $.map($scope.myObj, function (value, index) {
                return angular.extend(value, {'_id': index});
              });
            }
          );


        } else {
          console.log('No data');
        }
      });

    };
    $scope.fetchData();


    $scope.addNew = function () {

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

            (Date.now() - birthDate) / (1000 * 60 * 60 * 24 * 365)

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
      }
      console.log($scope.birthDay);
      $scope.registrationDate = new Date();
      factoryCRUD.save($scope.login, $scope.password, $scope.birthDay, $scope.registrationDate);
      $scope.fetchData();

    };

    $scope.delete = function (item) {
      $scope.id = item.currentTarget.getAttribute("data-id");
      factoryCRUD.delete($scope.id).then(function (status) {
        console.log(status);
        angular.element(item.currentTarget).parent().hide();
      });

    }


  }]);
