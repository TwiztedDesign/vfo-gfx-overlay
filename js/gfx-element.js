angular.module('gfxApp')
    .directive('gfxElement',function(){
        return{
            restrict:'E',
            template:`<div class="gfx-element" ng-class="{draggable:edit, edit:edit, selected:data.selected}" ng-click="select($event)" ng-style="{left:data.x+'%',top:data.y+'%',width:data.width+'%',height:data.height+'%', 'z-index':data.index}" ng-keydown="key($event)">
                <div id="gfx-element-content" class="gfx-element-content" ng-class="{hide:!data.show || !data.visibility, show:data.show && data.visibility}" ng-style="{color:data.color, 'font-size':data.fontSize+'vw', 'min-width':data.minWidth+'vw', 'text-align':data.textAlign,
                    'font-weight':data.textBold?'bold':'normal','font-style':data.textItalic?'italic':'normal', width:data.bgHorizontalFill?'100%':'auto', opacity:data.opacity, 'align-items':data.bgVerticalFill?'stretch':'flex-start'}">
                    <div class="content-box" ng-style="{'background-image':'url('+data.imgSrc+')', 'background-position':data.imgPosX+'% '+data.imgPosY+'%', 'background-size':data.imgFill, 'background-color': data.bgColor, 'align-items':data.textVerticalAlign, padding:data.paddingY+'vw 0'}">
                        <span class="content-text" ng-style="{padding:'0 '+data.paddingX+'vw'}">{{data.text}}</span>
                    </div>
                </div>
                <div class="gfx-element-editor" ng-if="edit">
                    <div class="editor-menu" ng-class="{bottom:data.y<5}">
                        <div class="menu-item" ng-click="bringForward()"><i class="fa fa-chevron-up" aria-hidden="true"></i></div>
                        <div class="menu-item" ng-click="sendBack()"><i class="fa fa-chevron-down" aria-hidden="true"></i></div>
                        <div class="menu-item" ng-click="show()" ng-if="!data.visibility"><i class="fa fa-eye-slash" aria-hidden="true"></i></div>
                        <div class="menu-item" ng-click="hide()" ng-if="data.visibility"><i class="fa fa-eye" aria-hidden="true"></i></div>
                        <div class="menu-item" ng-click="delete()"><i class="fa fa-trash" aria-hidden="true"></i></div>
                    </div>
                </div>
            </div>`,
            replace:true,
            scope:{
                data:'=',
                edit:'=',
                onDelete:'&',
                onSelect:'&',
                onChange:'&'
            },
            link : function(scope, element, attrs){
                scope.delete = function(){
                    var r = confirm("Deleting element! Are you sure?");
                    if (r == true) {
                        scope.onDelete();
                    } else {}
                }

                scope.select = function(event){
                    scope.onSelect();
                    event.stopPropagation();
                }

                scope.bringForward = function(){
                    scope.data.index++;
                }

                scope.sendBack = function(){
                    scope.data.index--;
                }

                scope.hide = function(){
                    scope.data.visibility= false;
                }

                scope.show = function(){
                    scope.data.visibility= true;
                }
                
                scope.$watch('edit', () => {
                    if(scope.edit){
                        initInteract();
                    }else{
                        interact(element[0]).unset();
                    }
                });
                
                function initInteract(){
                    interact(element[0])
                    .resizable({
                        edges: { left: true, right: true, bottom: true, top: true },
                        margin:5,
                        listeners: {
                            move (event) {
                                scope.data.width=(event.rect.width/window.innerWidth)*133.33;
                                scope.data.height=(event.rect.height/window.innerHeight)*133.33;
            
                                scope.data.x+=(event.deltaRect.left/window.innerWidth)*133.33;
                                scope.data.y+=(event.deltaRect.top/window.innerHeight)*133.33;
            
                                scope.$apply();
                            }
                        },
                        modifiers: [
                            interact.modifiers.restrictEdges({
                                outer: 'parent'
                            }),
                            interact.modifiers.restrictSize({
                                min: { width: 20, height: 20 }
                            })
                        ],
                        inertia: false
                    })
                    .draggable({
                        listeners: {
                            move(event){
                                scope.data.x+=(event.dx/window.innerWidth)*133.33;
                                scope.data.y+=(event.dy/window.innerHeight)*133.33;

                                scope.$apply();
                                }
                        },
                        inertia: false,
                        modifiers: [
                            interact.modifiers.restrictRect({
                                restriction: 'parent',
                                endOnly: false
                            })
                        ]
                    });
                }

                if(scope.edit){
                    initInteract();
                }
            }
        }
    });