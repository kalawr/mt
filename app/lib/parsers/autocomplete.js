module.exports = {

	parse: function (string)
	{
		return string.split('\r\n').filter(Boolean);
	}
}