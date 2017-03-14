
/**
@ngdoc filter
@name angularCmsApp.filter:gravatar
@function
 
@description
 This is the Gravatar filter that takes a users email and create the proper MD5 hash.
 */
'use strict';
//angular.module('angularCmsApp').filter('gravatar', function() {
app.filter('gravatar', function () {
  return function(input) {
    if (!input) {
      input = 'test@gmail.com';
    }
    return 'http://www.gravatar.com/avatar/' + MD5(input);
  };
});

app.filter('imagefilter', function () {
    console.log(1);
    return function (dude) {
        if (dude === 'Education') {
            return "img/education.jpg";
        } else if (dude == 'Telecommunications') {
            return "img/telecommunications.jpg"
        } else if (dude == 'Solid Minerals') {
            return "img/solid minerals.jpg"
        } else if (dude == 'Climate') {
            return "img/climate.jpg"
        } else {
            return "img/others.jpg"
        }
        //other mappings
    }
});


