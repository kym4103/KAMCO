var Observable = require('FuseJS/Observable');
var Storage = require('FuseJS/Storage');

var item = Observable();
var options = ["기본정보", "기관정보", "공고정보", "경매정보", "공고문", "입찰정보"];
var selected = Observable("기본정보");
var panel = {
		basic: {Opacity: Observable("1"), ZOffset: Observable("0")},
		onbid: {Opacity: Observable("0"), ZOffset: Observable("0")},
		notice: {Opacity: Observable("0"), ZOffset: Observable("0")},
		auction: {Opacity: Observable("0"), ZOffset: Observable("0")},
		noticeText: {Opacity: Observable("0"), ZOffset: Observable("0")},
		date: {Opacity: Observable("0"), ZOffset: Observable("0")}
	};

Storage.read("save.xml")
	.then(function(contents) {
		item.value = JSON.parse(contents);
	}, function(error) {
		console.log(error);
	})

module.exports = {
	item, options, selected, panel,

	goBack: function() {
		router.goBack();
	}
};