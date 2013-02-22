window.ImageUploaderPlugin = {
    server : 'http://127.0.0.1:3000',

    //TODO add check not download same image same time
    imagesInProgress : {

    },

    contextMenuHandler : function(info) {
        var srcUrl = info.srcUrl;
        if (info.srcUrl) {
            ImageUploaderPlugin.checkDataUrl(info.srcUrl);
        }
        else {
            //this is not image
        }
    },

    checkDataUrl : function(url) {
        var isBase64 = url.search(/^data:image\/(png|jpeg|jpg|jpe|gif);base64,/);
        if (isBase64 >= 0) {
            var start = url.indexOf('data:image/'),
                stop = url.indexOf(';base64'),
                data = url.substring(stop+8),
                ext = url.substring(start + 'data:image/'.length,stop);

            ImageUploaderPlugin.sendUploadBase64Request(ext,data)
        }
        else {
            ImageUploaderPlugin.sendDownloadRequest(url);
        }
    },

    sendDownloadRequest : function(imageUrl) {
        var req = new XMLHttpRequest();
        req.open('POST', ImageUploaderPlugin.server, true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.onreadystatechange = function (aEvt) {
            if (req.readyState == 4) {
                if (req.status == 200 || req.status == 201)
                    ImageUploaderPlugin.serverSuccess(req);
                else
                    ImageUploaderPlugin.serverFailure(req);
            }
        };

        req.send('uploadMethod=download&url=' + imageUrl);
    },

    sendUploadBase64Request : function(extension, data) {
        var req = new XMLHttpRequest();
        req.open('POST', ImageUploaderPlugin.server, true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.onreadystatechange = function (aEvt) {
            if (req.readyState == 4) {
                if (req.status == 200 || req.status == 201)
                    ImageUploaderPlugin.serverSuccess(req);
                else
                    ImageUploaderPlugin.serverFailure(req);
            }
        };
        req.send('uploadMethod=base64&data=' + data+'&extension='+extension);
    },

    serverSuccess : function(req) {
        console.log(req.responseText);
    },

    serverFailure : function(req) {
        if (req.status == 500) {
            console.log(req.responseText);
        }
        else {
            console.log('Error');
        }
    }

}

