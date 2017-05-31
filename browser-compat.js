let TabsWrapper = (function() {
    "use strict";
    function TabsWrapper(tabs)
    {
        "use strict";
        this.tabs = tabs;
    }

    TabsWrapper.prototype.query = function(queryInfo, callback) {
        "use strict";
        this.tabs.query(queryInfo).then(callback);
    };

    TabsWrapper.prototype.sendMessage = function(tabId, message, options, responseCallback) {
        "use strict";
        this.tabs.sendMessage(tabId, message, options).then(responseCallback);
    };

    return TabsWrapper;
})();

let StorageWrapper = (function () {
    "use strict";
    function StorageWrapper(storage)
    {
        "use strict";
        this.storage = storage;
    }

    StorageWrapper.prototype.get = function(keys, callback) {
        "use strict";
        this.storage.get(keys).then(callback);
    };

    StorageWrapper.prototype.set = function(items, callback) {
        "use strict";
        this.storage.set(items).then(callback);
    };

    return StorageWrapper;
})();
let BrowserCompat = (function() {
    "use strict";
    const MODE_CHROME = 'chrome';
    const MODE_FIREFOX = 'firefox';

    function BrowserCompat(window)
    {
        "use strict";
        this.compatMode = (!!window.navigator.userAgent.match(/Chrome\/\d/)) ? MODE_CHROME : MODE_FIREFOX;
        this.browser = window.chrome;
        this.tabs = this.browser.tabs;
        this.storage = this.browser.storage;

        if (MODE_FIREFOX === this.compatMode) {
            this.browser = window.browser;
            this.tabs = new TabsWrapper(this.browser.tabs);
            this.storage = {
                "local": new StorageWrapper(this.browser.storage.local),
                "managed": new StorageWrapper(this.browser.storage.managed),
                "sync": new StorageWrapper(this.browser.storage.sync)
            };
        }
    }

    BrowserCompat.prototype.getMode = function () {
        "use strict";
        return this.compatMode;
    };

    return BrowserCompat;
})();

let browserCompat = new BrowserCompat(window);
