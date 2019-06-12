/**
 * Created by sha on 8/27/14.
 */

var formItem;
_flow.startListener = function() {

	var inpTitle, inpPersons, inpSongs, inpPlaces, inpKeywords;
	formItem = document.forms["add_item"];

	inpTitle = formItem["song_title"];
	inpPersons = formItem["persons"];
	inpSongs = formItem["other_songs"];
	inpPlaces = formItem["places"];
	inpKeywords = formItem["keywords"];

	var dlgAddItem = $("#dlg-add-item");
	var editSongId;

	dlgAddItem.on("hidden.bs.modal", function(e) {

		// 去除编辑状态
		$(this).removeClass("mode-edit");
	});

	$("#btn-open-dlg").on("click", function(e) {

		dlgAddItem.find("input").val("");
	});

	$("#btn-add-item").on("click", function(e) {

		var formData = new FormData();

		formData.append("song_id", editSongId);
		formData.append("song_title", inpTitle.value);
		formData.append("persons", inpPersons.value);
		formData.append("other_songs", inpSongs.value);
		formData.append("places", inpPlaces.value);
		formData.append("keywords", inpKeywords.value);

		var isEdit = dlgAddItem.hasClass("mode-edit");

		if(isEdit) {

			$.ajax({
				url: "/api/editsong",
				method: "POST",
				data: formData,
				contentType: false,
				processData: false,
				success: function(res) {
					alert("修改成功");
					location.reload();
				},
				error: function(xhr, err) {

				}
			})		
		}
		else {
			$.ajax({
				url: "/api/addsong",
				method: "POST",
				data: formData,
				contentType: false,
				processData: false,
				success: function(res) {
					alert("添加成功");
					location.reload();
				},
				error: function(xhr, err) {

				}
			})
		}
	});


	$("table").on("click", ".btn-delete", function(e) {

		if(confirm("确认要删除这条记录吗")){

			var btn = $(this);
			var td = btn.parent();
			var songId = td.attr("songId");
			var formData = new FormData();
			formData.append("id", songId);

			$.ajax({
				url: "api/delsong",
				method: "post",
				data: formData,
				contentType: false,
				processData: false,
				success: function(txt) {
					td.parent().remove();
					alert("删除成功");
				},
				error: function(xhr, err) {
					debugger;
				}
			})
		}
	});

	$("table").on("click", ".btn-edit", function(e) {

		var btn = $(this);
		var td = btn.parent();
		var row = td.parent();

		var dataJSON = row.data("json");
		inpTitle.value = dataJSON.song_title;
		inpPersons.value = dataJSON.persons;
		inpSongs.value = dataJSON.other_songs;
		inpPlaces.value = dataJSON.places;
		inpKeywords.value = dataJSON.keywords;

		dlgAddItem.addClass("mode-edit");

		editSongId = td.attr("songId");
	});
}