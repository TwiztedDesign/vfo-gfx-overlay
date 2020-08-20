
angular.module('gfxApp')

    .directive('sortable', function() {
        return {
            restrict        :'A',
            scope           : {
                sortable    : '=?',
                onUpdate    : '='
            },
            link            : function(scope, element) {

                // scope.items = scope.sortable || []

                function addItem(item, index){
                    index = index !== undefined? index : scope.sortable.length;
                    scope.sortable.splice(index, 0, item);
                }
                function removeItem(index){
                    index = index !== undefined? index : scope.sortable.length - 1
                    return scope.sortable.splice(index, 1)[0];
                }

                Sortable.create(element[0],{
                    animation: 150,
                    handle: '.sort-handle',
                    onUpdate: function (e) {
                        let item = removeItem(e.oldIndex);
                        addItem(item, e.newIndex);
                        scope.$apply();
                    }
                });
            }
        };
    })
;