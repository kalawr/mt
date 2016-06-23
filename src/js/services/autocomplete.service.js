angular.module('mt')

	.factory('Autocomplete', ['$http', 'url',
			function ($http, url)
			{
				return {
					fetch: function (query, languages)
					{
						return $http.get(url.autocomplete(query, languages));
					}
				}
			}
		]
	);
