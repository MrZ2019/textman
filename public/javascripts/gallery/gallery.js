$(function() {

	var className;
	var agent = navigator.userAgent;

	if(/firefox/i.test(agent))
		className = 'ff';
	else if(/msie/i.test(agent))
		className = 'ie'
	else
		className = 'webkit';
	$('body').addClass(className);
	
})