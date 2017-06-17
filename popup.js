function TTUpload() {
    "use strict";
}

TTUpload.prototype.upload = function (content) {
    "use strict";
    browserCompat.storage.local.get({"url":"", "user": "", "pass": ""}, function (items) {
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

        xhr.open('POST', items.url.replace(/\/*$/, '') + path);
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
    browserCompat.storage.local.get({"url": "http://techtree.vm/api/", "user": "", "pass": ""}, function (items) {
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
    let planetSelect = document.querySelector('#planetSelect'),
        options = planetSelect.querySelectorAll('option:not([value="-"])');

    for (let i = 0, j = options.length; i < j; i++) {
        planetSelect.removeChild(options[i]);
    }

    for (let i = 0, j = planets.length; i < j; i++) {
        let planetOption = document.createElement('option');
        planetOption.value = planets[i].id;
        planetOption.appendChild(
            document.createTextNode(
                planets[i].galaxy + ":" + planets[i].system + ":" + planets[i].position + " - " + planets[i].name
            )
        );

        planetSelect.appendChild(planetOption);
    }
};

let ttUploader = new TTUpload();

document.addEventListener('DOMContentLoaded', function () {
    "use strict";
        ttUploader.loadPlanets();

    browserCompat.tabs.query({active: true, currentWindow: true}, function(tabs) {
        "use strict";
        let tabUrl = new URL(tabs[0].url),
            searchParams = new URLSearchParams(tabUrl.search.slice(1)),
            cmd = searchParams.get('cmd'),
            planetSelect = [
                document.querySelector('.planet-select'),
                document.querySelector('#refresh')
            ],
            toggleMethod = 'remove';

        if ('start' === cmd) {
            toggleMethod = 'add';
        }

        for (let i = 0, planetSel; planetSel = planetSelect[i]; i++) {
            planetSel.classList[toggleMethod]('hidden');
        }
    });

    document.querySelector('#upload').addEventListener('click', function() {
        "use strict";
        browserCompat.tabs.query({active: true, currentWindow: true}, function(tabs) {
            "use strict";
            browserCompat.tabs.sendMessage(tabs[0].id, {}, function(response) {
                "use strict";
                ttUploader.upload(response);
            });
        });
    });

    document.querySelector('#refresh').addEventListener('click', ttUploader.loadPlanets);
});
