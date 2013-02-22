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

        ImageUploaderPlugin.queryTitle(function(response) {
            req.send('name=' + response.title +'&uploadMethod=download&url=' + imageUrl);
        });
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

        ImageUploaderPlugin.queryTitle(function(response) {
            req.send('name=' + response.title +'&uploadMethod=base64&data=' + data+'&extension='+extension);
        });

    },

    serverSuccess : function(req) {
        document.write(req.responseText);
        ImageUploaderPlugin.postMessage({
            message : 'Upload',
            data : JSON.parse(req.responseText)
        });
    },

    serverFailure : function(req) {
        if (req.status == 500) {
            ImageUploaderPlugin.postMessage({
                message : 'ServerError',
                data : JSON.parse(req.responseText)
            });
        }
        else {
            //Really wrong
            ImageUploaderPlugin.postMessage({
                message : 'UnknownError'
            });
        }
    },

    queryTitle : function(callback) {
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendMessage(tab.id, { message : 'GetName'}, function(response) {
                callback(response);
            });
        });
    },

    postMessage : function(message) {
        chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, message, function(response) {
            //Here is response
        });
});
    }
}

/**
 * Create a context menu which will only show up for images.
 */
chrome.contextMenus.create({
  "title" : "Скопировать картинку",
  "type" : "normal",
  "contexts" : ["image"],
  "onclick" : ImageUploaderPlugin.contextMenuHandler
});
