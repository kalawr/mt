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
	)

	.factory('languageMap', function ()
		{
			return {
				en: 'English',
				de: 'German',
				fr: 'French',
				es: 'Spanish',
				it: 'Italian',
				ru: 'Russian'
			};
		}
	)