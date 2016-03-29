"use strict";
angular.module('ngGridApp')
  .factory('propertyModel', function () {

    function Property(name, dataType, isRequired, calculateFrom, calculate) {
      this.name = name;
      this.dataType = dataType;
      this.isRequired = isRequired;
      this.calculateFrom = calculateFrom;
      this.calculate = calculate;

    }

    var props = [];
    var dataTypes = ['string', 'number', 'object'];
    var validatedProps = [];
    var isSchemaValid;

    return {
      init: function (data) {
        props = data.map(function (el) {
          return new Property(el.Name, el.DataType, el.IsRequired);
        });
        //console.log(props);
      },
      validateSchema: function () {
        validatedProps = props.map(function (el) {
          if (!'Name' in el) return false;
          if (!('DataType' in el && dataTypes.indexOf(el.DataType) > -1)) return false;
          if (!'CalculateFrom' || !Array.isArray(el.CalculateFrom)) return false;
          if (!'IsRequired' in el || typeof el.IsRequired !== 'boolean') return false;
          return true;
        });

        if (validatedProps.some(function (el) {
            return el === false;
          })) {
          isSchemaValid = false;
        } else {
          isSchemaValid = true;
        }

      },
      validate: function (data) {
        props.forEach(function(prop) {
          var name = prop.name;
          var type = prop.dataType;
          var isRequired = prop.isRequired;
          var isNotPresent = false;

          var filtered = data.filter(function(el) {
            return name in el && el[name];
          });

          isNotPresent = !filtered.length && isRequired;

          if (isNotPresent) {
            throw new Error("data provided doesn't match with the model definition");
          }
        });
      }
    };
  });
