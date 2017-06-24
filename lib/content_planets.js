(function () {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        let planetDivs = document.querySelectorAll('.EmpireRowActive, .EmpireRowInactive');

        let planets = [],
            output = {
                "type":"planets",
                "planets":[]
            };

        for (let i = 0, j = planetDivs.length; i < j; i++) {
            let planetDiv = planetDivs[i],
                caption = planetDiv.querySelector('.EmpireHeadLeft'),
                matches = caption.innerHTML.match(/(\d+):(\d+):(\d+) - (.*)$/),
                planetImage = planetDiv.querySelector('.EmpirePlanet img').src,
                planetImageInfo = planetImage.match(/\/([^/]+)\/pl_m_(\d+).png$/);

            planets.push({
                "name":matches[4],
                "type":planetImageInfo[1].toLowerCase(),
                "imageNo":parseInt(planetImageInfo[2]),
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
