'use strict';

angular.module('mt')

	.controller('EntryController', ['$scope', '$routeParams', 'dict',
			function ($scope, $routeParams, dict)
			{
				$scope.global.query     = $routeParams.query;
				$scope.global.languages = $routeParams.languages.split('-');

				$scope.dict = dict;
			}
		]
	);