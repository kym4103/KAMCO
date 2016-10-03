var Observable = require('FuseJS/Observable');
var Storage = require('FuseJS/Storage');
var Backend = require("Backend.js");
//캠코 서비스 키 값
//LEVQhgclvGUKoC%2BJrvokKajzK6OsTFRinprds4qBzZj1PJMDZUQ8SRTm0lmzbj1jzC9IaZLqEm1G%2FhAdHV5R5A%3D%3D

var items = Observable();
var showItems = Observable();

var options = {type:["전체", "매각", "임대"], date: ["7일 이내", "30일 이내"]};
var selected = {type: Observable("전체") , date: Observable("7일 이내")};
var address = {
		sido: Observable("시도"),
		sgk: Observable("시군구"),
		emd: Observable("읍면동"),
		data1: Observable(),
		data2: Observable(),
		data3: Observable()
	};
var showPanel = {base: Observable(false), data1: Observable("0"), data2: Observable("0"), data3: Observable("0")};

var data;

var resultText = Observable("This place show you data.");

Storage.read("search.xml")
	.then(function(contents) {
		items.value = Backend.parsingXMLData(contents);
		console.log("Reading is OK");
		for (var i = 0 ; i < items.value.response.body.items.length-1 ; i++) {
			if (items.value.response.body.items[i].item.PLNM_NO != items.value.response.body.items[i+1].item.PLNM_NO) {
				showItems.add(items.value.response.body.items[i].item);
			}
			if (i == items.value.response.body.items.length-2) {
				showItems.add(items.value.response.body.items[i+1]);
			}
		}
		//console.log(JSON.stringify(showItems.value));
	}, function(error) {
		console.log(error);
	});

// 날짜를 온비드 형식에 맞추어 반환
function callDate(year, month, date) {
	if (month < 10) {
		month = "0" + month;
	}
	if (date < 10) {
		date = "0" + date;
	}

	return year + month + date;
}

function getData() {
// 검색 url
	var url = "http://openapi.onbid.co.kr/openapi/services/KamcoPblsalThingInquireSvc/getKamcoSaleList?ServiceKey=LEVQhgclvGUKoC%2BJrvokKajzK6OsTFRinprds4qBzZj1PJMDZUQ8SRTm0lmzbj1jzC9IaZLqEm1G%2FhAdHV5R5A%3D%3D";

// 타입 선택에 따른 url 추가
	if (selected.type == "전체") {
		url = url + "&DPSL_MTD_CD=ALL";
	} else if (selected.type == "매각") {
		url = url + "&DPSL_MTD_CD=0001";
	} else if (selected.type == "임대") {
		url = url + "&DPSL_MTD_CD=0002";
	}

// 시간 설정을 위한 Date 변수 추가
	var date = new Date();
// 기간 선택에 따른 url 추가
	if (selected.date == "7일 이내") {
		url = url + "&PBCT_BEGN_DTM=" + callDate(date.getFullYear(), date.getMonth(), date.getDate());

		date.setDate(date.getDate()+7);
		url = url + "&PBCT_CLS_DTM=" + callDate(date.getFullYear(), date.getMonth(), date.getDate());
	} else if (selected.date == "30일 이내") {
		url = url + "&PBCT_BEGN_DTM=" + callDate(date.getFullYear(), date.getMonth(), date.getDate());

		date.setDate(date.getDate()+30);
		url = url + "&PBCT_CLS_DTM=" + callDate(date.getFullYear(), date.getMonth(), date.getDate());
	}
// 주소 선택에 따른 url 추가
	if (address.emd.value != "읍면동") {
		url = url + "&EMD=" + address.emd.value;
	}
	if (address.sgk.value != "시군구") {
		url = url + "&SGK=" + address.sgk.value;
	}
	if (address.emd.value != "시도") {
		url = url + "&SIDO=" + address.sido.value;
	}
	
	fetch(url, {
		method: 'POST'
	}).then(function(response) {
		items.value = Backend.parsingXMLData(response._bodyInit);

//		items.value.items.forEach(function(item) {
//			console.log(item.item.PLNM_NO + "/" + item.item.PBCT_NO);
//		})

		for (var i = 0 ; i < items.value.response.body.items.length-1 ; i++) {
			if (items.value.response.body.items[i].item.PLNM_NO != items.value.response.body.items[i+1].item.PLNM_NO) {
				showItems.add(items.value.response.body.items[i].item);
			}
			if (i == items.value.response.body.items.length-2) {
				showItems.add(items.value.response.body.items[i+1]);
			}
		}

		resultText.value = response.statusText+". We got the data.";
		if (items.value.totalCount != 0) {
			Storage.write("search.xml", response._bodyInit)
				.then(function(succeeded) {
			        if(succeeded) {
						console.log("Successfully wrote to file.");
					} else {
						console.log("Couldn't write to file.");
					}
				});
		}
	}).catch(function(error) {
		console.log(JSON.stringify(error));
	});
}

function showData(arg) {
	resultText.value = JSON.stringify(arg.data.item)
		.replace(/{/gi, "")
		.replace(/}/gi, "")
		.replace(/"/gi, "")
		.replace(/,/gi, "\n");
	PLNM_NO = arg.data.item.PLNM_NO;
	PBCT_NO = arg.data.item.PBCT_NO;
}

//시도 구역 선택
function selectSido(arg) {
	if (address.sido.value != arg.data) {
		address.sgk.replaceAll(["시군구"]);
		address.emd.replaceAll(["읍면동"]);
	}

	address.sido.value = arg.data;
	address.data1.clear();
	showPanel.base.value = !showPanel.base.value;
	showPanel.data1.value = "0";
}
//시도 구역 받아오기
function getSido() {
	var code = Observable();
	var url = 'http://openapi.onbid.co.kr/openapi/services/OnbidCodeInfoInquireSvc/getOnbidAddr1Info?ServiceKey=LEVQhgclvGUKoC%2BJrvokKajzK6OsTFRinprds4qBzZj1PJMDZUQ8SRTm0lmzbj1jzC9IaZLqEm1G%2FhAdHV5R5A%3D%3D';

	showPanel.base.value = !showPanel.base.value;
	showPanel.data1.value = "0.9";
	if (address.data1.length == 0) {
		fetch(url, {
			method: 'POST'
		}).then(function(response) {
			code.value = Backend.parsingXMLData(response._bodyInit);
			code.value.response.body.items.forEach(function(item) {
				address.data1.add(item.item.ADDR1);
			})
			if (code.value.response.body.totalCount > 10) {
				url = url + '&pageNo=';
				for (var i = 2 ; (i-1)*10 <= code.value.response.body.totalCount ; i++) {
					fetch(url+i, {
						method: 'POST'
					}).then(function(response) {
						code.value = Backend.parsingXMLData(response._bodyInit);
						code.value.response.body.items.forEach(function(item) {
							address.data1.add(item.item.ADDR1);
						})
					});
				}
			}
			address.data1.removeRange(0, 1);
		}).catch(function(error) {
			console.log(JSON.stringify(error));
		});
	}
}
//시군구 구역 선택
function selectSgk(arg) {
	if (address.sgk.value != arg.data) {
		address.emd.replaceAll(["읍면동"]);
	}

	address.sgk.value = arg.data;
	address.data2.clear();
	showPanel.base.value = !showPanel.base.value;
	showPanel.data2.value = "0";
}
//시군구 구역 받아오기
function getSgk() {
	if (address.sido.value != "시도") {
		var code = Observable();
		var url = 'http://openapi.onbid.co.kr/openapi/services/OnbidCodeInfoInquireSvc/getOnbidAddr2Info?ServiceKey=LEVQhgclvGUKoC%2BJrvokKajzK6OsTFRinprds4qBzZj1PJMDZUQ8SRTm0lmzbj1jzC9IaZLqEm1G%2FhAdHV5R5A%3D%3D&ADDR1='+address.sido.value;

		showPanel.base.value = !showPanel.base.value;
		showPanel.data2.value = "0.9";
		if (address.data2.length == 0) {
			fetch(url, {
				method: 'POST'
			}).then(function(response) {
				code.value = Backend.parsingXMLData(response._bodyInit);
				code.value.response.body.items.forEach(function(item) {
					address.data2.add(item.item.ADDR2);
				})
				if (code.value.response.body.totalCount > 10) {
					url = url + '&pageNo=';
					for (var i = 2 ; (i-1)*10 <= code.value.response.body.totalCount ; i++) {
						fetch(url+i, {
							method: 'POST'
						}).then(function(response) {
							code.value = Backend.parsingXMLData(response._bodyInit);
							code.value.response.body.items.forEach(function(item) {
								address.data2.add(item.item.ADDR2);
							})
						});
					}
				}
			}).catch(function(error) {
				console.log(JSON.stringify(error));
			});
		}
	}
}
//읍면동 구역 선택
function selectEmd(arg) {
	address.emd.value = arg.data;
	address.data3.clear();
	showPanel.base.value = !showPanel.base.value;
	showPanel.data3.value = "0";
}
//읍면동 구역 받아오기
function getEmd() {
	if (address.sgk.value != "시군구") {
		var code = Observable();
		var url = 'http://openapi.onbid.co.kr/openapi/services/OnbidCodeInfoInquireSvc/getOnbidAddr3Info?ServiceKey=LEVQhgclvGUKoC%2BJrvokKajzK6OsTFRinprds4qBzZj1PJMDZUQ8SRTm0lmzbj1jzC9IaZLqEm1G%2FhAdHV5R5A%3D%3D&ADDR2='+address.sgk.value;

		showPanel.base.value = !showPanel.base.value;
		showPanel.data3.value = "0.9";
		if (address.data3.length == 0) {
			fetch(url, {
				method: 'POST'
			}).then(function(response) {
				code.value = Backend.parsingXMLData(response._bodyInit);
				code.value.response.body.items.forEach(function(item) {
					address.data3.add(item.item.ADDR3);
				})
				if (code.value.response.body.totalCount > 10) {
					url = url + '&pageNo=';
					for (var i = 2 ; (i-1)*10 <= code.value.response.body.totalCount ; i++) {
						fetch(url+i, {
							method: 'POST'
						}).then(function(response) {
							code.value = Backend.parsingXMLData(response._bodyInit);
							code.value.response.body.items.forEach(function(item) {
								address.data3.add(item.item.ADDR3);
							})
						});
					}
				}
			}).catch(function(error) {
				console.log(JSON.stringify(error));
			});
		}
	}
}

function closePanel() {
	showPanel.base.value = !showPanel.base.value;
	showPanel.data1.value = "0";
	showPanel.data2.value = "0";
	showPanel.data3.value = "0";
	address.data1.clear();
	address.data2.clear();
	address.data3.clear();
}

module.exports = {
	getData,

	items, showItems,

	showData, resultText,

	options,
	selected,
	address,
	selectSido,
	selectSgk,
	selectEmd,
	getSido,
	getSgk,
	getEmd,
	showPanel,

	closePanel,

	goDetail: function(arg) {
		data = arg.data.item;
		router.push("detailData", data);
	},
	goBack: function() {
		router.goBack();
	}
};