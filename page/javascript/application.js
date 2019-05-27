/**
 * @author shadow
 * @filename
 */


$(document).ready(function() {

   // open text file that include famous saying

    txtBox = $("#cooltext");
    colorNameBox = $("#color-name");
    noteCounter = 0;

/*    fnOpenFile(appConfig.defaultFile);
    $("#filename").html(appConfig.defaultFile);*/

    fnProcessLetter(window.initLetter)
    $(window).on("keydown", function(event) {
        if(event.keyCode == 32) {
            if(window.renderHandle) {
                clearInterval(window.renderHandle);
                window.renderHandle = null;
                $('body').addClass('pause');
            } 
            else {
                renderText(appConfig.renderInterval, appConfig.renderMode);
                $('body').removeClass('pause');
            }
        }
        else {
            fnProcessLetter(event.keyCode - 48)
        }
    });
      
    
});