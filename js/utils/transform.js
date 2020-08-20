
angular.module('gfxApp')

	// .filter('customCurrency', function() {
	// 	return function ( input ) {
	// 		// if currency value is not null.
	// 		var out = input + '$';
	// 		return out;
	// 	};
	// })

	.directive('transform', function(){
		return {
			require: 'ngModel',
			restrict : 'A',
			scope : {
				pattern : '@transform'
			},

			link: function(scope, element, attrs, modelCtrl) {



				function format(string, ...args) {
					return string.replace(/{(\d+)}/g, function(match, number) {
						return typeof args[number] != 'undefined' ? args[number] : match;
					});
				}
				function escapeRegExp(string) {
					return string.replace(/[.*+?^$(){}|[\]\\]/g, '\\$&'); // $& means the whole matched string
				}
				function unformat(string, pattern){
					let r = new RegExp(escapeRegExp(pattern).replace(/\\{(\d+)\\}/g, "(.*)"));
					let match = string.match(r);
					if(match && match.length > 1){
						return match[1];
					}
				}



				modelCtrl.$parsers.unshift(function (viewValue) {
					// return viewValue + 'px';
					return format(scope.pattern, viewValue);
					// return scope.pattern.replace('$0', viewValue);
				});
				modelCtrl.$formatters.unshift(function (modelValue) {
					return unformat(modelValue, scope.pattern);
					// return parseInt((modelValue && modelValue.slice(0,-2)) || element[0].value );
				});
			}
		};
	})
;
