/**
 * Created by sha on 8/25/14.
 */
_flow.initialDOM = function(e) {
    $(document).ready(function(e) {
        _flow.initApp();
       // _flow.loadData(null, true);
        _flow.startListener();
    });
}