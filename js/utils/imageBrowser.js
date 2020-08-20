
angular.module('gfxApp')

    .directive('imageBrowser', function(UploadService) {
        return {
            restrict        :'E',

            replace         : true,
            template        : `<vff-image-browser></vff-image-browser>`,
            scope           : {
                value       : '='
            },
            link            : function(scope, element){

                scope.$watch('value', (val, oldVal)=>{
                    element[0].value = val;
                });
                element[0].addEventListener('vff:change', function(event){
                    if(event.target.selectedFiles.length){
                        let file = event.detail.data[0];
                        vff.upload(file, (e)=>{
                            console.log("upload file");
                            UploadService.uploadFile(file, e.urls.uploadUrl, {
                                onSuccess : ()=> {
                                    scope.value = e.urls.cdnUrl;
                                    // event.target.value = e.urls.cdnUrl;
                                    scope.$apply();
                                    event.detail.data = undefined;
                                }
                            })
                        },)
                    } else {
                        scope.value = '';
                    }

                });
                element[0].addEventListener('vff:update', ()=>{
                    console.log("Image browser vff:update");
                });

            }
        };
    })
;