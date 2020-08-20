
angular.module('gfxApp')

    .service('UploadService', function() {

        let uploads = {};

        function uuid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
        }

        function _upload(file, url, options){

            let uid = uuid();
            options = options || {};
            let req = new XMLHttpRequest();
            uploads[uid] = req;
            req.open("PUT", url, true);
            req.setRequestHeader('Content-type', file.type);
            req.upload.onprogress = function() {
                if(options.onProgress){
                    options.onProgress(event.loaded / event.total);
                }
                // console.log(JSON.stringify({uuid, type: 'progress', progress : event.loaded / event.total, loaded : event.loaded, total : event.total}));
            };
            req.onreadystatechange = function () {
                if (req.readyState !== 4) return;
                if (req.status >= 200 && req.status < 300) {
                    if(options.onSuccess){
                        options.onSuccess();
                    }
                    // console.log(JSON.stringify({uuid, type: 'success', filename : file.name}));
                    delete uploads[uuid];
                } else {
                    // console.log(JSON.stringify({uuid, type: 'error', data: {
                    //         status: req.status,
                    //         statusText: req.statusText
                    //     }}));
                    if(options.onError){
                        options.onError({
                            status: req.status,
                            statusText: req.statusText
                        });
                    }
                    delete uploads[uuid];
                }
            };
            req.send(file);
        }

        this.uploadFile = _upload;

        return this;

    })
;