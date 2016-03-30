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

// result.js

var Result = {};

Result.make = function (list)
{
	var div = document.createElement('div');

	list.result.forEach(
		function (entry)
		{
			div.appendChild(this.makeVariantGroup(entry));
		}, 
		this
	);

	return div;
};

Result.makeVariantGroup = function (group)
{
	var div = document.createElement('div');
	var heading = document.createElement('h1');
	var subheading = document.createElement('h2');

	heading.textContent = group.variant;
	subheading.textContent = group.partOfSpeech;

	div.appendChild(heading);
	div.appendChild(subheading);

	group.domains.forEach(
		function (entry)
		{
			div.appendChild(this.makeDomainGroup(entry));
		}, 
		this
	);

	return div;
};

Result.makeDomainGroup = function (group)
{
	var div = document.createElement('div');
	var domain = document.createElement('div');

	domain.className = 'domain';
	domain.textContent = group.domain;
	div.appendChild(domain);

	var ul = document.createElement('ul');

	group.translations.forEach(
		function (translation)
		{
			var li = document.createElement('li');
			li.textContent = translation;

			ul.appendChild(li);
		}
	); 

	div.appendChild(ul);
	return div;
};

Result.paste = function (container, content)
{
	// Remove container's only child if necessary.
	if (container.children.length > 0)
		container.removeChild(container.children[0]);

	container.appendChild(content);
};

// ---

var form = jQuery('#search')
 ,	query = jQuery('#query')
 ,	langs = jQuery('#langs')
 ,	hint = jQuery('#hint')[0]
 ,	result = jQuery('#result')[0];


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
		.always(function (list)
		{
			if (list.length > 0)
				Result.paste(result, Result.make(list));
		})
		;
});