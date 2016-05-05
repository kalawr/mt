var cheerio = require('cheerio');


var identifiesAs = {};

identifiesAs.variant = function (element)
{
	return element.is('script + table tr > td[bgcolor="#DBDBDB"] > a[href*="m.exe"]');
};

identifiesAs.partOfSpeech = function (element)
{
	return element.is('script + table tr > td[bgcolor="#DBDBDB"] em');
};

identifiesAs.domainName = function (element)
{
	return element.is('script + table tr > td:not([bgcolor="#DBDBDB"]) > a[href*="sc="]');
};

identifiesAs.translation = function (element)
{
	return element.is('script + table tr > td:not([bgcolor="#DBDBDB"]) a[href*="m.exe"]:not([href*="UserName"])');
};


module.exports.parse = function (html)
{
	var $ = cheerio.load(html);

	var result = [];

	$('script + table > tr *').each(function (i, el) 
	{
		var $el = $(el);

		if (identifiesAs.variant($el))
		{
			result.push({variant: $el.text()});
		}
		else
		if (identifiesAs.partOfSpeech($el))
		{
			result[result.length-1].partOfSpeech = $el.text();
		}
		else
		if (identifiesAs.domainName($el))
		{
			if (!result[result.length-1].domains)
			{
				result[result.length-1].domains = [];
			}

			if ($el.attr('title'))
			{
				result[result.length-1].domains.push({ domain: $el.attr('title') });
			}
		}
		else
		if (identifiesAs.translation($el))
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