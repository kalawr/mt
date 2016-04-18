// Expect languages converted from 'en', 'fr', 'de'
// to 1, 4, 3.

function convert(type)
{
	return function (query, lang1, lang2)
	{
		return `/c/${type}.exe?l1=${lang1}&l2=${lang2}&s=${query}`;
	};
};

module.exports = {

	autocomplete: convert('ms'),
	translate:    convert('m')
};