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


            getData: function () {
                return new Promise(function (resolve) {
                    ref.once('value', function (snap) {

                        var data = snap.val();

                        resolve(
                            $.map(data, function (value, index) {
                                return angular.extend(value, {'_id': index});
                            })
                        )

                    })
                });
            },

          search: function(prop, val){
            return new Promise(function(resolve, reject) {
              ref
                .orderByChild(prop)
                .equalTo(val)
                .limitToFirst(1)
                .once('value', function(record) {
                  if (record.val() != null) {
                    resolve({ status: 'found', id: Object.keys(record.val())[0], data: record.val() });
                  } else {
                    resolve({ status: 'not found' });
                  }
                });
            });
          },

            delete: function (id) {
                return new Promise(function (resolve) {
                    if (ref.child(id).remove()) {
                        resolve({status: 'deleted'});
                    } else {
                        resolve({status: 'error'});
                    }
                });
            }
        };
    }]);
