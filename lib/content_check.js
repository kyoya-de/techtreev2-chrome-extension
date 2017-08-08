(function () {
    const sendTechs = function (techs) {
        browserCompat.runtime.sendMessage({"command":"send-requirements", techs}, function (response) {
            "use strict";

            console.log(response);
            uploadStatus.classList.remove('working');
            uploadStatus.classList.add('ready');
        });
    }, parseTechs = function() {
        "use strict";

        let select = document.querySelector('select.Stat_SelectBox'),
            tableRows = targetTable.querySelectorAll('tr:not(.tt-button)'),
            selection = select.value.split(':'),
            rawId = document.querySelectorAll('select.Stat_SelectBox')[1].selectedOptions[0].innerHTML,
            techs = {
                "type": categories[selection[0]],
                "identifier":rawId,
                "level":selection[2],
                "requirements": {}
            };

            if ('ships' === techs.type || 'defense' === techs.type) {
                techs.identifier = rawId.match(/\((\w+)\)/)[1].toLowerCase();
            }

        for (let i = 1, j = tableRows.length; i < j; i++) {
            let tableCells = tableRows[i].querySelectorAll('td'),
                name1 = tableCells[0].innerText.toLowerCase().trim(),
                require1 = tableCells[1].innerText.trim(),
                name2 = tableCells[3].innerText.toLowerCase().trim(),
                require2 = tableCells[4].innerText.trim();

            if ('' !== name1) {
                techs.requirements[name1] = parseInt(require1.match(/(\d+)\/\d+/)[1]);
            }

            if ('' !== name2) {
                techs.requirements[name2] = parseInt(require2.match(/(\d+)\/\d+/)[1]);
            }
        }

        return techs;
    };

    let uploadStatus = document.createElement('div');

    uploadStatus.classList.add('tt-upload-status');
    uploadStatus.classList.add('working');

    document.querySelector('body').appendChild(uploadStatus);

    const categories = {
        1: "building",
        2: "science",
        3: "defense",
        4: "ships"
    };

    let targetTable = document.querySelector('.Stat_Check_Table tbody'),
        target = targetTable.parentNode,
        targetRow = document.createElement('tr'),
        targetCell = document.createElement('td'),
        uploadButton = document.createElement('div');

    targetCell.setAttribute('colspan', '5');
    targetRow.classList.add('.tt-button');

    uploadButton.classList.add('tt-upload-button');
    uploadButton.appendChild(
        document.createElement('span').appendChild(
            document.createTextNode(chrome.i18n.getMessage('LabelUploadToTree'))
        )
    );

    uploadButton.addEventListener('click', function () {
        uploadStatus.classList.remove('ready');
        uploadStatus.classList.add('working');

        sendTechs(parseTechs());
    });

    window.setTimeout(function () {
        "use strict";

        sendTechs(parseTechs());
    }, 500);

    targetCell.appendChild(uploadButton);
    targetRow.appendChild(targetCell);
    target.appendChild(targetRow);
})();
