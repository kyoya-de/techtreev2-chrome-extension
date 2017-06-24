function TTUpload() {
    "use strict";
}

let contentMessages = {
    start: {
        command: "get-planets"
    },
    building: {
        command: "get-techs"
    },
    research: {
        command: "get-techs"
    }
};

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
            let classAdd = "success",
                classRemove = "error",
                statusMessage = "Upload erfolgreich",
                statusBox = document.querySelector('.popup-result'),
                statusTextBox = statusBox.firstChild,
                classList = statusBox.classList;

            if (xhr.status !== 200) {
                classAdd = "error";
                classRemove = "success";
                statusMessage = "Upload fehlgeschlagen"
            } else {
                window.setTimeout(() => window.close(), 1500);
            }

            classList.add(classAdd);
            classList.remove(classRemove);
            if (!statusTextBox) {
                statusTextBox = document.createTextNode(statusMessage);
                statusBox.appendChild(statusTextBox);
            } else {
                statusTextBox.nodeValue = statusMessage;
            }
        });

        xhr.send(JSON.stringify(content));
    });
};

TTUpload.prototype.loadPlanets = function () {
    "use strict";
    browserCompat.storage.local.get({"url": "http://techtree.vm/api/", "user": "", "pass": ""}, function (items) {
        "use strict";
        browserCompat.tabs.query({active: true, currentWindow: true}, function (tabs) {
            "use strict";
            browserCompat.tabs.sendMessage(tabs[0].id, {command: "get-selected-planet"}, function (planetName) {
                "use strict";
                let header,
                    xhr = new XMLHttpRequest();

                header = wsseHeader(items.user, items.pass);

                xhr.open('GET', items.url.replace(/\/*$/, '') + '/user/planet');
                xhr.setRequestHeader("X-WSSE", header);
                xhr.addEventListener('load', () => {
                    "use strict";
                    ttUploader.renderPlanets(JSON.parse(xhr.responseText), planetName);
                });

                xhr.send();
            });
        });
    });
};

TTUpload.prototype.renderPlanets = function (planets, selectedPlanetName) {
    "use strict";
    let planetSelect = document.querySelector('#planetSelect'),
        options = planetSelect.querySelectorAll('option:not([value="-"])');

    for (let i = 0, j = options.length; i < j; i++) {
        planetSelect.removeChild(options[i]);
    }

    for (let i = 0, j = planets.length; i < j; i++) {
        let planetOption = document.createElement('option'),
        planet = planets[i];
        planetOption.classList.add('left');
        planetOption.dataset.icon = 'http://horiversum.org/game/pix/skins/default/planets/' + planet.type.toUpperCase() + '/pl_btn_' + planet.image + '.png';
        planetOption.value = planet.id;
        if (planet.name === selectedPlanetName) {
            planetOption.setAttribute('selected', 'selected');
            planetOption.selected = true;
        }
        planetOption.appendChild(
            document.createTextNode(
                planet.galaxy + ":" + planet.system + ":" + planet.position + " - " + planet.name
            )
        );

        planetSelect.appendChild(planetOption);
        $(planetSelect).material_select();
    }
};

let ttUploader = new TTUpload();

document.addEventListener('DOMContentLoaded', function () {
    "use strict";
    ttUploader.loadPlanets();

    browserCompat.tabs.query({active: true, currentWindow: true}, function (tabs) {
        "use strict";
        let tabUrl = new URL(tabs[0].url),
            searchParams = new URLSearchParams(tabUrl.search.slice(1)),
            cmd = searchParams.get('cmd'),
            planetSelect = document.querySelector('.popup-planet'),
            toggleMethod = 'remove';

        if ('start' === cmd || 'research' === cmd) {
            toggleMethod = 'add';
        }

        planetSelect.classList[toggleMethod]('hidden');
    });

    document.querySelector('#upload').addEventListener('click', function() {
        "use strict";
        browserCompat.tabs.query({active: true, currentWindow: true}, function(tabs) {
            "use strict";
            let tabUrl = new URL(tabs[0].url),
                searchParams = new URLSearchParams(tabUrl.search.slice(1)),
                cmd = searchParams.get('cmd'),
                message = contentMessages[cmd];

            browserCompat.tabs.sendMessage(tabs[0].id, message, function(response) {
                "use strict";
                ttUploader.upload(response);
            });
        });
    });

    document.querySelector('#refresh').addEventListener('click', ttUploader.loadPlanets);
});
