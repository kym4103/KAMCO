var Observable = require('FuseJS/Observable');
var Storage = require('FuseJS/Storage');
var Backend = require("Module/Backend.js");

var condition = {
    sellType: Observable("전체"),
    date: Observable("7일 이내"),
    assetType: [
        {name: "캠코\n압류", selected: Observable(false)},
        {name: "캠코\n국유", selected: Observable(false)},
        {name: "캠코\n수탁", selected: Observable(false)},
        {name: "캠코\n유입", selected: Observable(false)},
        {name: "이용\n기관", selected: Observable(false)}
    ],
    sido: Observable("시도"),
    sgk: Observable("시군구"),
    emd: Observable("읍면동"),
    usageTop: Observable("용도1"),
    usageMiddle: Observable("용도2"),
    usageBottom: Observable("용도3")
};


var conditions = Observable();

// 날짜를 온비드 형식에 맞추어 반환
function callDate(year, month, date) {
	month += 1;

	if (month < 10) {
		month = "0" + month;
	}
	if (date < 10) {
		date = "0" + date;
	}

	return "" + year + month + date;
}

function addCondition(i, sellType, date, assetType, sido, sgk, emd, usageTop, usageMiddle, usageBottom){
	this.number = i;
	this.sellType = sellType;
	var date = new Date();
	if (date == "7일 이내") {
		this.bgDate = callDate(date.getFullYear(), date.getMonth(), date.getDate());

		date.setDate(date.getDate()+7);
		this.clsDate = callDate(date.getFullYear(), date.getMonth(), date.getDate());
	} else if (date == "30일 이내") {
		this.bgDate = callDate(date.getFullYear(), date.getMonth(), date.getDate());

		date.setDate(date.getDate()+30);
		this.clsDate = callDate(date.getFullYear(), date.getMonth(), date.getDate());
	}
	this.assetType = "";
	assetType.forEach(function(data) {
		if(data.selected.value == true) {
			this.assetType += data.name;
		}
	});
	this.sido = sido;
	this.sgk = sgk;
	this.emd = emd;
	this.usageTop = usageTop;
	this.usageMiddle = usageMiddle;
	this.usageBottom = usageBottom;
}

// 검색조건을 저장하는 함수
function saveCondition() {
	var i = conditions.length;
	conditions.add(new addCondition(i+1, condition.sellType.value, condition.date.value, condition.assetType, condition.sido.value, condition.sgk.value, condition.emd.value, condition.usageTop.value, condition.usageMiddle.value, condition.usageBottom.value));
/*	conditions.condition1.sellType = condition.sellType.value;
	var date = new Date();
	if (condition.date.value == "7일 이내") {
		conditions.condition1.bgDate = callDate(date.getFullYear(), date.getMonth(), date.getDate());

		date.setDate(date.getDate()+7);
		conditions.condition1.clsDate = callDate(date.getFullYear(), date.getMonth(), date.getDate());
	} else if (condition.date.value == "30일 이내") {
		conditions.condition1.bgDate = callDate(date.getFullYear(), date.getMonth(), date.getDate());

		date.setDate(date.getDate()+30);
		conditions.condition1.clsDate = callDate(date.getFullYear(), date.getMonth(), date.getDate());
	}
	options.assetType.forEach(function(data) {
		if(data.selected.value == true) {
			conditions.condition1.assetType += data.name;
		}
	});
	conditions.condition1.sido = condition.sido.value;
	conditions.condition1.sgk = condition.sgk.value;
	conditions.condition1.emd = condition.emd.value;
	conditions.condition1.usageTop = condition.usageTop.value;
	conditions.condition1.usageMiddle = condition.usageMiddle.value;
	conditions.condition1.usageBottom = condition.usageBottom.value;
*/
	console.log(JSON.stringify(conditions));
// condition 저장.
/*	Storage.write("conditions.txt", JSON.stringify(conditions))
		.then(function(succeeded) {
	        if(succeeded) {
				console.log("Successfully wrote condition to file.");
			} else {
				console.log("Couldn't write condition to file.");
			}
		});*/
}

module.exports = {
	condition, conditions,

	saveCondition
};