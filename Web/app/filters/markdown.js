/**
 @ngdoc filter
 @name angularCmsApp.filter:markdown
 @function

 @description
 This is a Markdown to HTML filter.
 */
'use strict';
//angular.module('angularCmsApp').filter('markdown', function () {
app.filter('markdown', function () {
	return function (input) {
		if(input){
			return markdown.toHTML(input);
		}
	};
});
