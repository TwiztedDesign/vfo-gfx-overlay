
angular.module('gfxApp')

    .directive('colorPicker', function() {
        return {
            restrict        :'AE',
            template        : '<div></div>',
            replace         : true,
            scope           : {
                value       : '=',
                default     : '@'
            },
            link            : function(scope, element){

                // initialize 3d party color picker component
                Pickr.create({
                    el: element[0],
                    theme: 'nano',
                    // container: element.parent(),
                    default: scope.value || scope.default || '#00ff00',
                    comparison: false,
                    components: {
                        // Main components
                        preview: true,
                        opacity: true,
                        hue: true,
                        // Input / output Options
                        interaction: {
                            input: true
                        }
                    }
                })
                .on('init', instance => {
                    scope.$apply();
                })
                .on('change', (color) => {
                    scope.value = color.toHEXA().toString();
                    scope.$apply();
                });
            }
        };
    })
;