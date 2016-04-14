angular.module('mt')

	.factory('focus', ['$window', function ($window)
			{
				return function (query)
				{
					$window.document.querySelector(query).focus();
				};
			}
		]
	)

	.factory('url', function ()
		{
			return function (type)
			{
				return function (query, languages)
				{
					return '/' +
						String(type) +
						'/' +
						String(query) +
						'/' +
						String(languages);
				};
			}
		}
	)