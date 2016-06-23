'use strict';

angular.module('mt')

	.controller('SubController', ['$scope', '$rootScope', '$routeParams', 'dict',
			function ($scope, $rootScope, $routeParams, dict)
			{
				$scope.master.query = $routeParams.query;
				if ($routeParams.languages) $scope.master.persistence.languages = $routeParams.languages;

				angular.isArray(dict) ? $scope.master.dict = dict : $scope.master.httpError = dict;

				$rootScope.$broadcast(
					'viewChange'
				);
			}
		]
	)