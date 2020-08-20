
angular.module('gfxApp')

    .directive('imageBrowser', function(UploadService) {
        return {
            restrict        :'A',
            replace         : true,
            scope           : {
                value       : '='
            },
            link            : function(scope, element){

                const allowedFileTypes = [
                    "image/apng",
                    "image/bmp",
                    "image/gif",
                    "image/jpeg",
                    'image/jpg',
                    "image/png",
                    "image/svg",
                    "image/svg+xml",
                    "image/tiff",
                    "image/webp",
                    "image/x-icon"
                ];


                let inputElement = document.createElement('input');
                // let imageElement = document.createElement('img');
                let errorElement = document.createElement('div');
                // let previewOn = false;
                let error = false;
                if(scope.value){
                    //imageElement.src = scope.value;
                    // element.after(imageElement);
                    // previewOn = true;
                }

                scope.$watch('value', () => {
                    //imageElement.src = scope.value;
                });


                // function readFileAsync(file) {
                //     return new Promise((resolve, reject) => {
                //         let reader = new FileReader();
                //         reader.onload = () => {
                //             resolve(reader.result);
                //         };
                //         reader.onerror = reject;
                //         reader.readAsDataURL(file);
                //     })
                // }


                function handleFiles() {
                    let file = this.files[0];
                    if(!allowedFileTypes.includes(file.type)){
                        errorElement.innerText = "File type not allowed"
                        if(!error) element.after(errorElement);
                        return;
                    }
                    error = false;
                    try{
                        errorElement.parentNode.removeChild(errorElement);
                    } catch (e) {

                    }

                    element.addClass('loading');


                    vff.upload(file, (e)=>{
                        console.log("upload file", e);
                        // readFileAsync(file).then(base64 => {
                        //     imageElement.src = base64;
                        //     if(!previewOn){
                        //         element.after(imageElement);
                        //     }
                        // });
                        UploadService.uploadFile(file, e.urls.uploadUrl, {
                            onSuccess : ()=> {
                                scope.value = e.urls.cdnUrl;
                                element.removeClass('loading');
                                // vff.send();
                                // imageElement.src = e.urls.cdnUrl;
                                scope.$apply();
                                vff.send();
                            }
                        })
                    },)
                }

                inputElement.setAttribute('type', 'file');
                inputElement.style.display = 'none';

                element.on('click', () => {
                    inputElement.click();
                });
                inputElement.addEventListener("change", handleFiles, false);

            }
        };
    })
;