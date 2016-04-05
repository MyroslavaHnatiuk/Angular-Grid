'use strict';

/**
 * @ngdoc function
 * @name angularGridApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularGridApp
 */
angular.module('ngGridApp')
  .controller('MainCtrl', ['$scope', 'propertyModel', '$firebaseObject', '$window', 'factoryCRUD', function ($scope, propertyModel, $firebaseObject, $window, factoryCRUD) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var ref = new $window.Firebase("https://scorching-heat-8748.firebaseio.com");

    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };

    $scope.popup1 = {
      opened: false
    };


    $scope.reg = "^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$";
    $scope.fetchData = function () {
      ref.once('value', function (snap) {
        if (snap.val() !== null) {
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
      $scope.fetchData();

    };

    $scope.delete = function (item) {
      $scope.id = item.currentTarget.getAttribute("data-id");
      factoryCRUD.delete($scope.id).then(function (status) {
        console.log(status);
        angular.element(item.currentTarget).parent().hide();
      });

    };


  }]);
