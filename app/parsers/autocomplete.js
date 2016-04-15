module.exports.default = {

	parse: function (string)
	{
		return string.split('\r\n').filter(Boolean);
	}
}