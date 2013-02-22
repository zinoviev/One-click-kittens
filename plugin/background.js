// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Returns a handler which will open a new window when activated.
 */
function getClickHandler() {
  return function(info, tab) {

    // The srcUrl property is only available for image elements.
    if (info.srcUrl) {
        var req = new XMLHttpRequest();
        req.open('POST', 'http://127.0.0.1:3000/', true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.onreadystatechange = function (aEvt) {
          if (req.readyState == 4) {
             if(req.status == 200)
              console.log(req.responseText);
             else
              console.log("Error loading page\n");
          }
        };

        req.send('uploadMethod=download&url='+info.srcUrl);
    }
  };
};

/**
 * Create a context menu which will only show up for images.
 */
chrome.contextMenus.create({
  "title" : "Скопировать картинку",
  "type" : "normal",
  "contexts" : ["image"],
  "onclick" : getClickHandler()
});
