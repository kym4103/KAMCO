var Observable = require('FuseJS/Observable');
var Storage = require('FuseJS/Storage');
var Backend = require("Backend.js");

var items = Observable();
var detailText = Observable("1");

this.Parameter.onValueChanged(function(x) {
	fetch("http://openapi.onbid.co.kr/openapi/services/KamcoPblsalThingInquireSvc/getKamcoSaleDetail?ServiceKey=LEVQhgclvGUKoC%2BJrvokKajzK6OsTFRinprds4qBzZj1PJMDZUQ8SRTm0lmzbj1jzC9IaZLqEm1G%2FhAdHV5R5A%3D%3D&PLNM_NO="+x.PLNM_NO+"&PBCT_NO="+x.PBCT_NO ,{
		method: 'POST'
	}).then(function(response) {
//		items.value = Backend.parsingXMLData(response._bodyInit);
		detailText.value = JSON.stringify(Backend.parsingXMLData(response._bodyInit));
	});
});

function save() {
	Storage.write("save.xml", detailText.value)
		.then(function(succeeded) {
			if(succeeded) {
				console.log("Successfully wrote to file.");
			} else {
				console.log("Couldn't write to file.");
			}
		})
}

module.exports = {
	items,
	detailText,
	save,
	goBack: function() {
		router.goBack();
	}
};