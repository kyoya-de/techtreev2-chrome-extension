(function (chromeRuntime, chromeI18n) {
    const sendTechs = function (techs) {
        chromeRuntime.sendMessage(techs).then(r => console.log(r)).catch(e => console.log(e));
    };
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
            document.createTextNode(chromeI18n.getMessage('LabelUploadToTree'))
        )
    );
    uploadButton.addEventListener('click', function () {

        let select = document.querySelector('select.Stat_SelectBox'),
            tableRows = targetTable.querySelectorAll('tr:not(.tt-button)'),
            selection = select.value.split(':'),
            techs = {
                "type": categories[selection[0]],
                "identifier":document.querySelectorAll('select.Stat_SelectBox')[1].selectedOptions[0].innerHTML,
                "level":selection[2],
                "requirements": {}
            };

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

        sendTechs(techs);
    });

    targetCell.appendChild(uploadButton);
    targetRow.appendChild(targetCell);
    target.appendChild(targetRow);
})(chrome.runtime, chrome.i18n);
