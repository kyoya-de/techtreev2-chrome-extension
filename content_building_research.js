(function () {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        const typeMap = {
            "building":"building",
            "research":"science"
        };

        let captions = document.querySelectorAll('.BldClsRow'),
            params = new URLSearchParams(document.location.search.substring(1)),
            levels = {},
            output = {
                "type":typeMap[params.get('cmd')],
                "levels":{}
            };

        for (let i = 0, j = captions.length; i < j; i++) {
            let matches = captions[i].innerHTML.match(/\((\w+) - (?:Forschungsstufe|Ausbaustufe) (\d+)\)/);
            if (matches) {
                levels[matches[1]] = parseInt(matches[2]);
            }
        }

        let levelKeys = Object.keys(levels);

        levelKeys.sort();

        for (let k = 0, l = levelKeys.length; k < l; k++) {
            output.levels[levelKeys[k]] = levels[levelKeys[k]];
        }

        sendResponse(output);
    });
})();
