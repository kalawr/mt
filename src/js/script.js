// helpers.js
function log(x)
{
	console.log(x);
}
// ---

// url.js
var Url = {};

Url.range = function (query, languages)
{
	return '/tr?' +
		'type=' +
		'range' +
		'&langs=' +
		languages +
		'&query=' +
		query;
};

Url.single = function (query, languages)
{
	return '/tr?' +
		'type=' +
		'singe' +
		'&langs=' +
		languages +
		'&query=' +
		query;
};
// ----



var form  = jQuery('#search');
var query = jQuery('#query');
var langs = jQuery('#langs');


form.on('input', function (event)
{
	// in case of an input event
	jQuery
		.getJSON( Url.range(query.val(), langs.val()) )
		// .then(log)
		.always(log)
		;
});

form.on('submit', function (event)
{
	event.preventDefault();
	// in case of a submit event
	jQuery
		.getJSON( Url.single(query.val(), langs.val()) )
		// .then(log)
		.always(log)
		;
});