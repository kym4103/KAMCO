var Observable = require('FuseJS/Observable');
var Storage = require('FuseJS/Storage');

var items = Observable();

Storage.read("save.xml")
	.then(function(contents) {
		items.value = JSON.parse(contents);
	}, function(error) {
		console.log(error);
	})

module.exports = {
	items,

	goBack: function() {
		router.goBack();
	}
};