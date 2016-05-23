'use strict';

angular.module('mt')

	.controller('ApplicationController', ['$scope', '$location', '$localStorage',
			function ($scope, $location, $localStorage) 
			{
				$scope.$storage = $localStorage.$default(
					{
						languages: ['en', 'ru']
					}
				);

				$scope.global = {};
				$scope.global.query = '';
				$scope.global.languages = $scope.$storage.languages;

				$scope.global.getLanguages = function ()
				{
					return $scope.global.languages.join('-');
				};

				$scope.global.submit = function (value)
				{
					$location.url('/entry/'+ encodeURIComponent(value || $scope.global.query) +'/'+$scope.global.getLanguages());
				};

				$scope.$watchCollection('global.languages', function (value) 
				{
					$scope.$storage.languages = value;
				});

				$scope.$on('view', function (event, view)
				{
					if (view === 'entry')
					{
						$scope.root = false;
					}
					else
					if (view === 'empty')
					{
						$scope.root = true;
						$scope.global.query = '';
					}
				});
			}
		]
	);