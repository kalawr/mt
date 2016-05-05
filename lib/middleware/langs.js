var langs = require('../langs');

module.exports = function (req, res, next)
{
	req.mt = req.mt || {};

	req.mt.langs = langs.convert(
		req.params.langs.split('-')
	);

	next();
};