(function () {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        let captions = document.querySelectorAll('.EmpireHeadLeft'),
            planets = [],
            output = {
                "type":"planets",
                "planets":[]
            };

        for (let i = 0, j = captions.length; i < j; i++) {
            let matches = captions[i].innerHTML.match(/(\d+):(\d+):(\d+) - (.*)$/);
            planets.push({
                "name":matches[4],
                "galaxy":matches[1],
                "system":matches[2],
                "position":matches[3]
            });
        }

        let levelKeys = Object.keys(planets);

        levelKeys.sort();

        for (let k = 0, l = levelKeys.length; k < l; k++) {
            output.planets[levelKeys[k]] = planets[levelKeys[k]];
        }

        sendResponse(output);
    });
})();
