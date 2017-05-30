function TTUpload() {
    "use strict";
}

TTUpload.prototype.upload = function (content) {
    "use strict";
    browser.storage.local.get({"url":"", "user": "", "pass": ""}, function (items) {
        "use strict";
        let header,
            xhr = new XMLHttpRequest();

        header = wsseHeader(items.user, items.pass);

        let planetSelect = document.querySelector('#planetSelect'),
            path = "";

        if ('science' === content.type) {
            path = '/user/science';
        } else if ('building' === content.type) {
            path = '/user/building/' + planetSelect.value;
        } else if ('planets' === content.type) {
            path = '/user/planet'
        }

        xhr.open('POST', items.url.replace(/\/*$/, '') + path + '?XDEBUG_SESSION_START=PHPSTORM');
        xhr.setRequestHeader("X-WSSE", header);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.addEventListener('load', () => {
            "use strict";
            console.log(JSON.parse(xhr.responseText));
        });

        xhr.send(JSON.stringify(content));
    });
};

TTUpload.prototype.loadPlanets = function () {
    "use strict";
    browser.storage.local.get({"url": "http://techtree.vm/api/", "user": "", "pass": ""}, function (items) {
        "use strict";
        let header,
            xhr = new XMLHttpRequest();

        header = wsseHeader(items.user, items.pass);

        xhr.open('GET', items.url.replace(/\/*$/, '') + '/user/planet');
        xhr.setRequestHeader("X-WSSE", header);
        xhr.addEventListener('load', () => {
            "use strict";
            ttUploader.renderPlanets(JSON.parse(xhr.responseText));
        });

        xhr.send();
    });
};

TTUpload.prototype.renderPlanets = function (planets) {
    "use strict";
    let planetSelect = document.querySelector('#planetSelect');

    for (let i = 0, j = planets.length; i < j; i++) {
        let planetOption = document.createElement('option');
        planetOption.value = planets[i].id;
        planetOption.innerHTML = planets[i].galaxy + ":" + planets[i].system + ":" + planets[i].position + " - " + planets[i].name;

        planetSelect.appendChild(planetOption);
    }
};

let ttUploader = new TTUpload();
if (!window.browser && window.chrome) {
    window.browser = window.chrome;
}
document.addEventListener('DOMContentLoaded', function () {
    "use strict";
        ttUploader.loadPlanets();

    document.querySelector('#upload').addEventListener('click', function() {
        "use strict";
        browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
            "use strict";
            browser.tabs.sendMessage(tabs[0].id, {}, function(response) {
                "use strict";
                ttUploader.upload(response);
            });
        });
    });

    document.querySelector('#refresh').addEventListener('click', ttUploader.loadPlanets);
});
