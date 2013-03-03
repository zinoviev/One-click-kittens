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
                KT.ImageUploaderNotifier['on'+message].call(this,request.data,sendResponse);
            }
        }
    },

    initWindow : function(message, link) {
        $('body').append(
            $( KT.ImageUploaderNotifier.popupTpl( {message : message, link : link} ) )
        );

        $('.uploader-popup > .closeBtn').click(function(e) {
            $(e.target).parent().hide();
        })
    },

    onGetName : function(data, sendResponse) {
        sendResponse({
            title : document.title
        });
    },

    onUpload : function(data) {
        if (data.success) {
           KT.ImageUploaderNotifier.initWindow('Мы загрузили картинку ',data.url)
        }
    },

    onUnauthorized : function(data) {
        KT.ImageUploaderNotifier.initWindow('Мы не знаем кто вы такой. Пожалуйста, залогинтесь в нашем чудесном сервисе',
            data.serverUrl);
    },
    onServerError : function(data) {

    },

    popupTpl : _.template(
                '<div class="uploader-popup">' +
                    '<div id="infoPopupCloseBtn" class="closeBtn">' +
                        'X' +
                    '</div>' +
                    '<a href=" <%= link %>" target="_blank"><%= message %></a>  ' +
                '</div>')

}

chrome.extension.onMessage.addListener( KT.ImageUploaderNotifier.onMessage);