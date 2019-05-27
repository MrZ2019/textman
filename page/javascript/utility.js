/**
 * @author shadow
 * @filename
 */

/*
 **
 */

function fnProcessLetter(chrLetter) {
    var data= fileMap[chrLetter], files, strPath = "", filename;
    if(data instanceof Array) {
        files = data;
    }
    else if(!data) {
        return;
    }
    else {
        files = data.files;
        strPath = data.path;
    }
    lastChr = chrLetter;
    filename = files[rand_int(files.length - 1)];
    $("#filename").html(filename.split("#")[0]);
    fnOpenFile(filename, appConfig.defaultDir + strPath);
}
function fnOpenFile(textFile, folderName) {

    if(window.renderHandle) {
        clearInterval(window.renderHandle);
        window.renderHandle = null;
    }

    folderName = folderName || "";
    notes = new Array();

    var files = textFile.split("#");
    var fileIndex = 0;
    for(var index = 0; index < files.length; index++) {
        var curFile = folderName + files[index] + ".txt";

        $.get(curFile, null, function(result, status) {

            if(status == "success") {
                notes = notes.concat(result.split("\n"))
                noteCounter = 0;
            }
            if(++fileIndex == files.length){
                renderText(appConfig.renderInterval, appConfig.renderMode);
            }
        });
    }
}
/**
 * the function render text
 */

function renderText(interval, mode) {

    var totalLength = notes.length;

    mode = mode || "black";

    fnSetText();
    renderHandle = setInterval(fnSetText, interval*1000);

    function fnSetText() {

        var noteIndex, textColor, selectMap, selectText;

        if(++noteCounter == appConfig.maxNote) {
            noteCounter = 0;
            //fnOpenFile(appConfig.defaultFile);
        }
        noteIndex = Math.round(Math.random() * (totalLength -1));

        selectText = notes[noteIndex].trim();
        if(selectText == "") {
            return fnSetText();
        }

        txtBox.html(selectText);

        switch(mode) {

            case "139":
            {
                selectMap = colorMap["colors139"];
            }
                break;

            case "16":
            {
                selectMap = colorMap["colors16"];
            }
                break;

            default:
            {
                textColor = mode;
            }
        }

        if(selectMap) {
            textColor = selectMap[rand_int(selectMap.length - 1)];
        }
        // colorNameBox.text(textColor)

        // .css("color", textColor);
        // txtBox.css("color", textColor);
    }
};


function rand_int(maxInteger, minInteger) {

    if(maxInteger == null) {
        maxInteger = 100
    }
    minInteger = minInteger || 0;

    // get integer use Math.random() and Math.round()

    return Math.round(Math.random() * (maxInteger - minInteger) + minInteger);
}
