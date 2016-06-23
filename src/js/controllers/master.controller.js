'use strict';

angular.module('mt')

	.controller('MasterController', ['$scope', '$localStorage',
			function ($scope, $localStorage)
			{
				$scope.master = {};
				$scope.master.query = '';

				$scope.master.dict = [];
				$scope.master.httpError = null;

				$scope.master.persistence = $localStorage.$default(
					{
						languages: 'en-ru'
					}
				);
			}
		]
	);
