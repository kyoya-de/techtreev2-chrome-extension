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
    sendResponse(message);
});
