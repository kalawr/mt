"use strict";

// helpers.js
function log(x)
{
	console.log(x);
}
// ---


























var form = jQuery('#search')
 ,	query = document.getElementById('query')
 ,	$query = jQuery('#query')
 ,	langs = document.getElementById('langs');







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

var myApp = angular.module('mt', ['ngRoute'])
	
	myApp.config(['$routeProvider', '$locationProvider',
		function ($routeProvider, $locationProvider)
		{
			$locationProvider.html5Mode(
				{
					enabled: true,
					requireBase: false
				}
			);

			$routeProvider
				.when('/:query', {
					templateUrl: '/partials/entry.html',
					controller: 'EntryController'
				})
				.when('/', {
					templateUrl: '/partials/search.html',
					controller: 'SearchController'
				})
				.otherwise({
					redirectTo: '/'
				});
		}
	]);

	myApp.controller('SearchController', ['$scope', '$http', '$location',
			function ($scope, $http, $location)
			{
				$scope.search = {};
				$scope.search.languages = 'en-ru';
				$scope.search.query = '';


				$scope.autocompleteItems = [];

				$scope.url = function (type)
				{
					return '/autocomplete' +
						'/' +
						String($scope.search.query) +
						'/' +
						String($scope.search.languages);
				};

				$scope.load = function (url)
				{
					$http.get(url)
						.then(
							function (response) 
							{
								$scope.autocompleteItems = response.data;
							},
							function (error)
							{
								$scope.autocompleteItems = [];
							}
						);
				};

				$scope.submit = function ()
				{
					$location.url('/'+this.search.query);
				};
			}
		]
	);

	myApp.controller('EntryController', ['$scope', '$http', '$routeParams',
			function ($scope, $http, $routeParams)
			{
				function url(query, languages)
				{
					return '/translate' +
						'/' +
						String(query) +
						'/' +
						String(languages);
				};

				$http.get(url($routeParams.query, 'en-ru'))
					.then(
						function (response) 
						{
							$scope.dict = response.data;
						},
						function (error)
						{
							$scope.dict = [];
						}
					);
			}
		]
	);
