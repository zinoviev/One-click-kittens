if (!window.KT) {
    window.KT = {};
}

window.KT.ImageUploaderPlugin = {
    server : 'localhost:3000',

    contextMenuHandler : function(info) {
        var srcUrl = info.srcUrl;
        if (srcUrl) { //this is image

            var req = new XMLHttpRequest();
            req.open('POST', 'http://localhost:3000/', true);
            req.onreadystatechange = function (aEvt) {
              if (req.readyState == 4) {
                 if(req.status == 200)
                  console.log(req.responseText);
                 else
                  console.log("Error loading page\n");
              }
            };
            
            req.send(null);


        }
        else {
            //this is not image
        }
    }
}

