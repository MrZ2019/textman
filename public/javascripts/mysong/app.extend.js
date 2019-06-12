/**
 * Created by sha on 9/29/14.
 */

$.fn.random = function() {
    var nodelist = $(this);
    var numIndex = Math.round(Math.random() * (nodelist.length - 1));

    return $(nodelist[numIndex]);
}