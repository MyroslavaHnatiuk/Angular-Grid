"use strict";
angular.module('ngGridApp')
  .factory('factoryCRUD', ['$firebaseObject', '$window', '$firebaseArray', function ($firebaseObject, $window, $firebaseArray) {
    var ref = new $window.Firebase("https://scorching-heat-8748.firebaseio.com");

    return {
      getReference: function () {
        return ref;
      },

      save: function (login, password, date, registrationDate) {
        var birthDay = {
          date: date.getTime()
        };
        console.log(birthDay);

        var registrationDate = {
          date: Firebase.ServerValue.TIMESTAMP
        };
        var calculate = function (Birthdate) {
          var currentdate = new Date();
          return (currentdate - Birthdate) / (1000 * 60 * 60 * 24 * 365);
        };
        var age = Math.floor(calculate(date));
        $firebaseArray(ref).$add({
          login: login, password: password, birthDay: birthDay, registrationDate: registrationDate,
          calculate: age
        });
        console.log(age);
        console.log(date);
      },

      delete: function(id) {
        return new Promise(function(resolve) {
          if(ref.child(id).remove()){
            resolve({status: 'deleted'});
          }else {
            resolve({status: 'error'});
          }
        });
      }
    };
  }]);
