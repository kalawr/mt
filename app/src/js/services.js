angular.module('mtServices', [])
	.factory('focus', ['$window', function ($window)
			{
				return function (query)
				{
					$window.document.querySelector(query).focus();
				};
			}
		]
	);