"use strict";

// helpers.js
function log(x)
{
	console.log(x);
}
// ---







// url.js
var Url = {};

Url.autocomplete = function (query, languages)
{
	return '/autocomplete' +
		'/' +
		String(query) +
		'/' +
		String(languages);
};

Url.translate = function (query, languages)
{
	return '/translate' +
		'/' +
		String(query) +
		'/' +
		String(languages);
};
// ----








// autocomplete.js
var Autocomplete = {};
var h = virtualDom.h;

Autocomplete.initial = [];

Autocomplete.makeMany = function (array)
{
	var _this = this;

	return h(
		'ul.autocomplete',
		array.map(
			function (element) 
			{
				return _this.makeOne(element);
			}
		)
	);
};

Autocomplete.makeOne = function (text)
{
	return h(
		'li',
		String(text)
	);
};

Autocomplete.render = function (targetTree)
{
	var patches = virtualDom.diff(this.previousTree, targetTree);
	this.node = virtualDom.patch(this.node, patches);
	this.previousTree = targetTree;
};

Autocomplete.init = function ()
{
	var tree = Autocomplete.makeMany(Autocomplete.initial);
	var node = virtualDom.create(tree);
	document.querySelector('.container').appendChild(node);
	this.node = node;
	this.previousTree = tree;
	return node;
};

// ---










// result.js

var Result = {};

Result.initial = [];

Result.make = function (list)
{
	var _this = this;

	return h(
		'dl#result.result',
		list.map(
			function (entry)
			{
				return _this.makeDefinitionGroup(entry);
			}
		)
	);
};

Result.makeDefinitionGroup = function (group)
{
	var _this = this;

	return h(
		'.definition',
		[
			h(
				'dt',
				[
					group.variant,
					_this.partOfSpeech(group)
				]
			),
			group.domains.map(
				function (domain)
				{
					return _this.makeDomainGroup(domain);
				}
			)
		]
	);
};

Result.partOfSpeech = function (group)
{
	if (group.partOfSpeech)
	{
		return h(
			'span.part-of-speech',
			', ' + group.partOfSpeech
		);
	}
	else
	{
		return null;
	}
};

Result.makeDomainGroup = function (group)
{
	var _this = this;

	return h(
		'.domain',
		[
			h(
				'.domain-name',
				String(group.domain)
			),

			group.translations.map(
				function (translation)
				{
					return _this.makeTranslation(translation);
				}
			)
		]
	);
};

Result.makeTranslation = function (value)
{
	return h(
		'dd',
		String(value)
	);
};

Result.render = function (targetTree)
{
	var patches = virtualDom.diff(this.previousTree, targetTree);
	this.node = virtualDom.patch(this.node, patches);
	this.previousTree = targetTree;
};

Result.init = function ()
{
	var tree = Result.make(Result.initial);
	var node = virtualDom.create(tree);
	document.querySelector('.container').appendChild(node);
	this.node = node;
	this.previousTree = tree;
	return node;
};

// ---

var form = jQuery('#search')
 ,	query = document.getElementById('query')
 ,	$query = jQuery('#query')
 ,	langs = document.getElementById('langs');

Autocomplete.init();
Result.init();


$query.on('input', function (event)
{

	jQuery
		.getJSON( Url.autocomplete(query.value, langs.value))
		.then(
			function (list)
			{
				if (list)
				{
					Autocomplete.render(Autocomplete.makeMany(list));
					window.autocompleteselection = new AutocompleteSelectionModel(list.length, query.value)
				}

			},
			function (error)
			{
				console.log(error);
				Autocomplete.render(Autocomplete.makeMany(Autocomplete.initial));
				window.autocompleteselection = new AutocompleteSelectionModel(0, '');
			}
		)
		;

	log('input');
});

form.on('submit', function (event)
{
	event.preventDefault();

	if (true)
	{
		jQuery
			.getJSON( Url.translate(query.value, langs.value))
			.then(function (list)
			{
				if (list)
					Result.render(Result.make(list));
			})
			;
	}

	log('submit');
});




// arrows.js
var autocompleteselection;

var upCode   = 38;
var downCode = 40;
var escCode  = 27;

jQuery(document).keydown(interceptUp);
jQuery(document).keydown(interceptDown);
jQuery(document).keydown(interceptEsc);

function interceptEsc(event)
{
	if (event.keyCode == escCode)
	{
		event.preventDefault();

		if (autocompleteselection) autocompleteselection.initial();
	}
}

function interceptUp(event)
{
	if (event.keyCode == upCode)
	{
		event.preventDefault();

		if (autocompleteselection) autocompleteselection.prev();
	}
}

function interceptDown(event)
{
	if (event.keyCode == downCode)
	{
		event.preventDefault();

		if (autocompleteselection) autocompleteselection.next();
	}
}

function AutocompleteSelectionModel(size, initialValue)
{
	this.size = size;
	this.initialValue = initialValue;
	this.current = 'initial';
	this.previousValue = null;

	if (document.querySelector('.autocomplete li.active'))
		renderInactive(document.querySelector('.autocomplete li.active'));
}

AutocompleteSelectionModel.prototype.next = function ()
{
	if (this.current === this.size-1 || this.current === 'initial')
	{
		this.first();
	}
	else
	{
		this.previousValue = this.current;
		this.current++;


		renderAutocompleteSelectionModelInTheList(this);
		renderAutocompleteSelectionModelInTheInput(this);
	}
};

AutocompleteSelectionModel.prototype.prev = function ()
{
	if (this.current === 0 || this.current === 'initial')
	{
		this.last();
	}
	else
	{
		this.previousValue = this.current;
		this.current--;

		renderAutocompleteSelectionModelInTheList(this);
		renderAutocompleteSelectionModelInTheInput(this);
	}
};

AutocompleteSelectionModel.prototype.initial = function ()
{
	this.previousValue = this.current;
	this.current = 'initial';

	renderAutocompleteSelectionModelInTheList(this);
	renderAutocompleteSelectionModelInTheInput(this);
};

AutocompleteSelectionModel.prototype.last = function ()
{
	this.previousValue = this.current;
	this.current = this.size-1;

	renderAutocompleteSelectionModelInTheList(this);
	renderAutocompleteSelectionModelInTheInput(this);
};

AutocompleteSelectionModel.prototype.first = function ()
{
	this.previousValue = this.current;
	this.current = 0;

	renderAutocompleteSelectionModelInTheList(this);
	renderAutocompleteSelectionModelInTheInput(this);
};

AutocompleteSelectionModel.prototype.at = function (index)
{
	this.previousValue = this.current;
	this.current = index;

	renderAutocompleteSelectionModelInTheList(this);
	renderAutocompleteSelectionModelInTheInput(this);
};


function renderAutocompleteSelectionModelInTheList(model)
{
	if (model.previousValue !== null && model.previousValue !== 'initial')
		renderInactive(document.querySelectorAll('.autocomplete li')[model.previousValue]);

	if (typeof model.current === 'number')
	{
		renderActive(document.querySelectorAll('.autocomplete li')[model.current]);
	}
}

function renderAutocompleteSelectionModelInTheInput(model)
{
	if (model.current === 'initial')
	{
		query.value = model.initialValue;
	}
	else
	{
		query.value = document.querySelectorAll('.autocomplete li')[model.current].textContent;
	}
}

function renderActive(li)
{
	li.classList.add('active');
}

function renderInactive(li)
{
	li.classList.remove('active')
}

jQuery('.autocomplete').on('click', 'li', function (event)
{
	autocompleteselection.at( $('.autocomplete li').index(event.currentTarget) );
});

// ---