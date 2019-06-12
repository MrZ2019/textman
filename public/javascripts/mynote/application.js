/**
 *  spider@application
 *  @desc a chrome application, just a simple browser
 *  @date 2004 Feb
 */

// start my app

_flow.initApp = function() {
	_flow.initData();
	
	$(document).ready(function(e) {
	    
		_flow.initDOM();       
	    
	    _flow.setupSettings();
	    _flow.setupTable();

	    _flow.startListener();

	});	
}

_flow.initApp();
