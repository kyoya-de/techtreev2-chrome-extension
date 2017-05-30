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
        this.storage = chrome.storage.local;

        document.querySelector('#save').addEventListener('click', function () {
            that.save()
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
            template.querySelector('.name').innerHTML = planets[i].name;
            template.querySelector('.galaxy').innerHTML = planets[i].galaxy;
            template.querySelector('.system').innerHTML = planets[i].system;
            template.querySelector('.position').innerHTML = planets[i].position;

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
            valuesToSave.pass = await this.createHash(newPass);
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

        this.statusMsg.innerHTML = statusText;
    };

    TTSettings.prototype.createHash = async function (str) {
        const buffer = new TextEncoder("utf-8").encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHexArray = hashArray.map(b => ('00' + b.toString(16)).slice(-2));

        return hashHexArray.join('');
    };

    return TTSettings;
})();

let sett = new TTSettings();
window.onload = () => {
    sett.init();
    let title = chrome.i18n.getMessage('AppName') + ' - ' + chrome.i18n.getMessage('TitleOptions');

    document.querySelector('title').innerHTML = title;
    document.querySelector('#tt_title').innerHTML = title;
    document.querySelector('#tt_url_label').innerHTML = chrome.i18n.getMessage('LabelURL') + ':';
    document.querySelector('#tt_user_label').innerHTML = chrome.i18n.getMessage('LabelUsername') + ':';
    document.querySelector('#tt_pass_label').innerHTML = chrome.i18n.getMessage('LabelPassword') + ':';
    document.querySelector('#save').innerHTML = chrome.i18n.getMessage('LabelSave');
};