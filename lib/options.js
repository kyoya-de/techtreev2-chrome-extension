let TTSettings = (function() {
    function TTSettings() {
    }

    TTSettings.prototype.userInput = null;
    TTSettings.prototype.passInput = null;
    TTSettings.prototype.urlInput = null;
    TTSettings.prototype.statusMsg = null;
    TTSettings.prototype.storage = null;

    TTSettings.prototype.init = function () {
        let that = this;

        this.userInput = document.querySelector('#tt_user');
        this.passInput = document.querySelector('#tt_pass');
        this.urlInput = document.querySelector('#tt_url');
        this.statusMsg = document.querySelector('#status');
        this.storage = browserCompat.storage.local;

        document.querySelector('#save').addEventListener('click', function () {
            that.save().then(function () {}).catch(e => console.log(e));
        });
        this.load();
    };

    TTSettings.prototype.load = function () {
        let that = this;

        this.storage.get({"url": "http://techtree.vm/api/", "user": "", "pass":""}, function (items) {
            "use strict";
            that.userInput.value = items.user;
            that.urlInput.value = items.url;

            let header,
                xhr = new XMLHttpRequest();

            header = wsseHeader(items.user, items.pass);

            xhr.open('GET', items.url.replace(/\/*$/, '') + '/user/planet');
            xhr.setRequestHeader("X-WSSE", header);
            xhr.addEventListener('load', () => {
                sett.renderPlanets(JSON.parse(xhr.responseText));
            });

            xhr.send(this.content);
        });
    };

    TTSettings.prototype.renderPlanets = function (planets) {
        "use strict";
        let template = document.querySelector('#planet-template').content,
            target = document.querySelector('#planets');

        while (0 < target.childNodes.length) {
            let cn = target.firstChild;
            target.removeChild(cn);
        }

        for (let i = 0, j = planets.length; i < j; i++) {
            template.querySelector('.name').appendChild(document.createTextNode(planets[i].name));
            template.querySelector('.galaxy').appendChild(document.createTextNode(planets[i].galaxy));
            template.querySelector('.system').appendChild(document.createTextNode(planets[i].system));
            template.querySelector('.position').appendChild(document.createTextNode(planets[i].position));

            let cloned = document.importNode(template, true);
            target.appendChild(cloned);
        }
    };

    TTSettings.prototype.save = async function () {
        let that = this,
            valuesToSave = {
                "url":this.urlInput.value,
                "user":this.userInput.value
            },
            newPass = this.passInput.value;

        if (0 < newPass.length) {
            valuesToSave.pass = newPass;
        }

        this.storage.set(valuesToSave, function () {
            that.load();
            that.status("Settings saved.", ['success'])
        });
    };

    TTSettings.prototype.status = function (statusText, classes) {
        if (classes === (void 0)) {
            classes = [];
        }

        this.statusMsg.classList.remove();

        for (let i = 0, j = classes.length; i < j; i++) {
            this.statusMsg.classList.add(classes[i]);
        }

        while (0 < this.statusMsg.childNodes.length) {
            this.statusMsg.removeChild(this.statusMsg.firstChild);
        }
        this.statusMsg.appendChild(document.createTextNode(statusText));
    };

    return TTSettings;
})();

let sett = new TTSettings();
window.onload = () => {
    sett.init();
    let title = chrome.i18n.getMessage('AppName') + ' - ' + chrome.i18n.getMessage('TitleOptions');

    document.querySelector('title').appendChild(document.createTextNode(title));
    document.querySelector('#tt_title').appendChild(document.createTextNode(title));
    document.querySelector('#tt_url_label').appendChild(document.createTextNode(chrome.i18n.getMessage('LabelURL') + ':'));
    document.querySelector('#tt_user_label').appendChild(document.createTextNode(chrome.i18n.getMessage('LabelUsername') + ':'));
    document.querySelector('#tt_pass_label').appendChild(document.createTextNode(chrome.i18n.getMessage('LabelPassword') + ':'));
    document.querySelector('#save').appendChild(document.createTextNode(chrome.i18n.getMessage('LabelSave')));
};
