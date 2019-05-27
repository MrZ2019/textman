/**
 * @author shadow
 * @filename
 */

var SCREEN_WIDTH = window.screen.width;
var SCREEN_HEIGHT = window.screen.height;

var winPosList =
    {
        "a":
        {
            "left": 8,
            "top": SCREEN_HEIGHT - 45,
            "width": 350,
            "height": 39
        },
        "b":
        {
            "left": (SCREEN_WIDTH - 550)/2,
            "top": SCREEN_HEIGHT - 45,
            "width": 550,
            "height": 55
        },
        "c":
        {
            "left": SCREEN_WIDTH - 360,
            "top": SCREEN_HEIGHT - 45,
            "width": 350,
            "height": 39
        }
    }
var winPosList =
    {
        "a":
        {
            "left": 8,
            "top": 25,
            "width": 350,
            "height": 50
        },
        "b":
        {
            "left": (SCREEN_WIDTH - 550)/2,
            "top": 25,
            "width": 550,
            "height": 50
        },
        "c":
        {
            "left": SCREEN_WIDTH - 360,
            "top": 25,
            "width": 350,
            "height": 50
        }
    }

// create application window use html page.

chrome.app.runtime.onLaunched.addListener(
    function() {

        // create a window 1

        // chrome.app.window.create("page/window.html",
        //     {
        //         "frame": "none",
        //         "bounds": winPosList["a"]
        //     }, function(win) {
        //         win.contentWindow.initLetter = 1;
        //     });

        // create a window 3

        chrome.app.window.create("page/window.html",
            {
                "frame": "none",
                "bounds": winPosList["b"]
            }, function(win) {
                win.contentWindow.initLetter = 2;
            });

        // create a window 2

        // chrome.app.window.create("page/window.html",
        //     {
        //         "frame": "none",
        //         "bounds":winPosList["c"]
        //     }, function(win) {
        //         win.contentWindow.initLetter = 3;
        //     });
    });