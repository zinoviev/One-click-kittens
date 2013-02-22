if (!window.KT) {
    window.KT = {}
}

window.KT.ImageUploaderNotifier = {

    init : function() {

    },

    onMessage : function(request, sender, sendResponse) {
        var message = request.message;
        if (message) {
            if (KT.ImageUploaderNotifier.hasOwnProperty('on'+message)) {
                KT.ImageUploaderNotifier['on'+message].call(this,request.data);
            }
        }
    },

    initWindow : function(text) {
        $('body').append(
            $( KT.ImageUploaderNotifier.popupTpl( {text : text} ) )
        );

        $('.uploader-popup > .closeBtn').click(function(e) {
            $(e.target).parent().hide();
        })
    },

    onUpload : function(data) {
        if (data.success) {
           KT.ImageUploaderNotifier.initWindow(data.url)
        }
    },

    onServerError : function(data) {

    },

    popupTpl : _.template(
                '<div class="uploader-popup">' +
                    '<div id="infoPopupCloseBtn" class="closeBtn">' +
                        'X' +
                    '</div>' +
                    '<a href=" <%= text %>" target="_blank"><%= text %></a>  ' +
                '</div>')

}

chrome.extension.onMessage.addListener( KT.ImageUploaderNotifier.onMessage);