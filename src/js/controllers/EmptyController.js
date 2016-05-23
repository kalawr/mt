'use strict';

angular.module('mt')

	.controller('EmptyController', ['$rootScope',
			function ($rootScope)
			{
				$rootScope.$broadcast('view', 'empty');
			}
		]
	);