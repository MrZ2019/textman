

exports.removeRepeat = function(list) {


	var list2 = [];

	for(var i = list.length-1; i>=0;i--) {
		var item = list[i];

		if(list2.indexOf(item) != -1) {
			list.splice(i, 1);
		}
		else {
			list2.push(item);
		}
	}

	return list;
}

exports.formatDate = function(date) {
	var d = new Date(date);

	return d.getFullYear() + '/' + (d.getMonth()+1) + '/' + (d.getDate())
}

