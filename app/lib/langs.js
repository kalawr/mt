var langs = {
	en: 1,
	ru: 2,
	de: 3,
	fr: 4,
	es: 5,
	it: 23
};

function get(index)
{
	return langs[index];
}

function convert(ar)
{
	return ar.map(get);
}

module.exports = {
	get: get,
	convert: convert
};