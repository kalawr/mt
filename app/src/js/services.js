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
						encodeURIComponent(String(query)) +
						'/' +
						String(languages);
				};
			}
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