'use strict';

angular.module('mt')

	.controller('EntryController', ['$scope', '$routeParams', 'dict', '$rootScope',
			function ($scope, $routeParams, dict, $rootScope)
			{
				$scope.global.query     = $routeParams.query;
				$scope.global.languages = $routeParams.languages.split('-');

				if (!dict.length)
				{
					$scope.error = {
						status: dict.status,
						statusText: dict.statusText
					};
				}
				else
				{	
					$scope.dict = dict;
				}


				$rootScope.$broadcast('view', 'entry');
			}
		]
	);