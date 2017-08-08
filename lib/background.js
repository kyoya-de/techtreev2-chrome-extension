chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url && changeInfo.status) {
        let urlMatch = tab.url.match(/^https?:\/\/(www\.)?horiversum.org\/game\/main\/main.php\?.*cmd=(building|research|start).*/);

        if (changeInfo.status === 'complete' && urlMatch) {
            chrome.pageAction.show(tabId);
        } else {
            chrome.pageAction.hide(tabId);
        }
    }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    "use strict";

    if ('send-requirements' === message.command) {
        browserCompat.storage.local.get({"url": "http://techtree.vm/api/", "user": "", "pass": ""}, function (items) {
            "use strict";

            let header,
                xhr = new XMLHttpRequest();

            header = wsseHeader(items.user, items.pass);

            xhr.open('POST', items.url.replace(/\/*$/, '') + '/requirements');
            xhr.setRequestHeader("X-WSSE", header);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.addEventListener('load', () => {
                "use strict";
                sendResponse(JSON.parse(xhr.responseText));
            });

            xhr.send(JSON.stringify(message.techs));
        });
    }

    return true;
});
