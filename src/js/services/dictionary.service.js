angular.module('mt')

	.factory('Dictionary', ['$http', 'url',
			function ($http, url)
			{
				return {
					fetch: function (query, languages)
					{
						return $http.get(url.translate(query, languages))
							.then(
								function (response) 
								{
									return response.data;
								},
								function (error)
								{
									console.log(error)
									return error;
								}
							);
					}
				};
			}
		]
	);
