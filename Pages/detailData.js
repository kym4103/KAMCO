var Observable = require('FuseJS/Observable');
var Storage = require('FuseJS/Storage');
var Backend = require("Backend.js");

// var basicItem = this.Parameter;
// var detailItem = Observable();
var item = {basicItem: this.Parameter, detailItem: Observable()};
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

this.Parameter.onValueChanged(function(x) {
	var url = "http://openapi.onbid.co.kr/openapi/services/KamcoPblsalThingInquireSvc/getKamcoSaleDetail?ServiceKey=LEVQhgclvGUKoC%2BJrvokKajzK6OsTFRinprds4qBzZj1PJMDZUQ8SRTm0lmzbj1jzC9IaZLqEm1G%2FhAdHV5R5A%3D%3D&PLNM_NO="+item.basicItem.value.PLNM_NO+"&PBCT_NO="+item.basicItem.value.PBCT_NO;
	fetch(url ,{
		method: 'POST'
	}).then(function(response) {
		//console.log(JSON.stringify(response));
		item.detailItem.value = Backend.parsingXMLData(response._bodyInit);
		//console.log(JSON.stringify(item.detailItem.value.response.body.items[0].item.bidDetailInfo.PLNM_DOC));
	}).catch(function(error){
		console.log(JSON.stringify(error));
	});
});

function clearPanel() {
	panel.basic.Opacity.value = "0";
	panel.onbid.Opacity.value = "0";
	panel.notice.Opacity.value = "0";
	panel.auction.Opacity.value = "0";
	panel.noticeText.Opacity.value = "0";
	panel.date.Opacity.value = "0";

	panel.basic.ZOffset.value = "0";
	panel.onbid.ZOffset.value = "0";
	panel.notice.ZOffset.value = "0";
	panel.auction.ZOffset.value = "0";
	panel.noticeText.ZOffset.value = "0";
	panel.date.ZOffset.value = "0";
}
function selectData(arg) {
	switch (selected.value) {
		case '기본정보':
			clearPanel();
			panel.basic.Opacity.value = "1";
			panel.basic.ZOffset.value = "1";
			break;
		case '기관정보':
			clearPanel();
			panel.onbid.Opacity.value = "1";
			panel.onbid.ZOffset.value = "1";
			break;
		case '공고정보':
			clearPanel();
			panel.notice.Opacity.value = "1";
			panel.notice.ZOffset.value = "1";
			break;
		case '경매정보':
			clearPanel();
			panel.auction.Opacity.value = "1";
			panel.auction.ZOffset.value = "1";
			break;
		case '공고문':
			clearPanel();
			panel.noticeText.Opacity.value = "1";
			panel.noticeText.ZOffset.value = "1";
			break;
		case '입찰정보':
			clearPanel();
			panel.date.Opacity.value = "1";
			panel.date.ZOffset.value = "1";
			break;
	}
//	panel.basic.Opacity.value = "1"
//	console.log(JSON.stringify(arg.data.data));
//	data.value = JSON.parse(JSON.stringify(arg.data.data).replace(/":"/gi, ",").replace("{", "[").replace("}", "]"));
}

function save() {
	Storage.write("save.xml", JSON.stringify(item))
		.then(function(succeeded) {
			if(succeeded) {
				console.log("Successfully wrote to file.");
			} else {
				console.log("Couldn't write to file.");
			}
		})
}

module.exports = {
//	basicItem,
//	detailItem,
	item,
	options,
	selected,
	panel,
	selectData,
	save,
	goBack: function() {
		router.goBack();
	}
};