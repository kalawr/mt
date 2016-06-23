angular.module('mt')

	.factory('url', function ()
		{
			function make(type)
			{
				return function (query, languages)
				{
					return '/' +
						String(type) +
						'/' +
						encodeURIComponent(String(query)) +
						'/' +
						String(languages);
				};
			}

			return {
				autocomplete: make('autocomplete'),
				translate: make('translate')
			};
		}
	);
