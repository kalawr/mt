"use strict";

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

// hint.js
var Hint = {};

// Takes an array of strings.
Hint.makeMany = function (list)
{
	var ul = document.createElement('ul');

	list.forEach(
		function (element)
		{	ul.appendChild(this.makeOne(element));
		}, 
		this
	);

	return ul;
};

// Takes a string.
Hint.makeOne = function (element)
{
	var li = document.createElement('li');
	li.textContent = element;
	return li;
};

Hint.paste = function (container, content)
{
	// Remove container's only child if necessary.
	if (container.children.length > 0)
		container.removeChild(container.children[0]);

	container.appendChild(content);
};
// ---


var form = jQuery('#search')
 , query = jQuery('#query')
 , langs = jQuery('#langs')
 , hint = jQuery('#hint')[0];


form.on('input', function (event)
{
	// in case of an input event
	jQuery
		.getJSON( Url.range(query.val(), langs.val()) )
		// .then(log)
		.always(function (list)
		{
			if (list.length > 0)
				Hint.paste(hint, Hint.makeMany(list));
		})
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