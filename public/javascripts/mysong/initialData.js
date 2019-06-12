/**
 * @author shadow
 * @filename
 */

var AppData = new Object();
var AppVar = new Object();
/**
 * load my data!
 * @param path
 */
_flow.loadData = function(path, bRender) {
    path = path || AppConfig.dataPath;
    $.get(path, function(data) {
        data = data.split("\n");
        AppData._data = data;
        if(bRender == true) {
            _flow.render(data);
        }
    });
}
