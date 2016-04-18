var cheerio = require('cheerio');

module.exports.parse = function (html)
{
	var $ = cheerio.load(html);

	var result = [];

	$('script + table > tr *').each(function (i, el) 
	{
		var $el = $(el);

		// Variant?
		if ($el.is('script + table tr > td[bgcolor="#DBDBDB"] > a[href*="m.exe"]'))
		{
			result.push({variant: $el.text()});
		}
		else
		// Part of Speech?
		if ($el.is('script + table tr > td[bgcolor="#DBDBDB"] > em'))
		{
			result[result.length-1].partOfSpeech = $el.text();
		}
		else
		// Domain Name?
		if ($el.is('script + table tr > td:not([bgcolor="#DBDBDB"]) > a[title]'))
		{
			if (!result[result.length-1].domains)
			{
				result[result.length-1].domains = [];
			}

			result[result.length-1].domains.push({ domain: $el.attr('title') });
		}
		else
		// Translation?
		if ($el.is('script + table tr > td:not([bgcolor="#DBDBDB"]) a[href*="m.exe"]:not([href*="UserName"])'))
		{
			var lastResult = result[result.length-1];
			var lastDomain = lastResult.domains[lastResult.domains.length-1];

			if (!lastDomain.translations)
			{
				lastDomain.translations = [];
			}

			lastDomain.translations.push($el.text());
		}
	})

	return result;
};