var Observable = require('FuseJS/Observable');

var key = "LEVQhgclvGUKoC%2BJrvokKajzK6OsTFRinprds4qBzZj1PJMDZUQ8SRTm0lmzbj1jzC9IaZLqEm1G%2FhAdHV5R5A%3D%3D";

function parsingXMLData(xmlData) {
	var tempText = xmlData;

// xml 헤더 삭제
	var forDeleteText = findString(xmlData);
	xmlData = xmlData.replace('<'+forDeleteText+'>', "").replace(/-/gi, "");

// 반환된 문자열을 이용하여 </문자열> 을 "}"로 변환, <문자열> 을 "문자열":{" 로 변환
	for (var i = 0 ; xmlData.indexOf('<') != -1 ; i++) {
		//문자열을 반환하는 함수 findString(data)
		//console.log(findString(xmlData));
		forDeleteText = findString(xmlData);
		if (forDeleteText.indexOf("/") > 1) {
			forDeleteText = forDeleteText.replace("/", "");
			xmlData = xmlData.replace("<"+forDeleteText+"/>", '"'+forDeleteText+ '":"",')
		} else {
		xmlData = xmlData.replace("</"+forDeleteText+">", '"},')
			.replace('<'+forDeleteText+'>', '"'+forDeleteText+'":{"');
		}
	}
	//console.log(xmlData);
	xmlData = xmlData.replace(/,""/gi, "");
	//console.log(xmlData);
	xmlData = '{' + deleteString(xmlData)
		.replace(/"},/gi, '},')
		.replace(/	+"/gi, '"')
		.replace(/	+}/gi, '}')
		.replace('"items":{"', '"items":[{')
		.replace(/"item"/gi, '},{"item"')
		.replace('},{"item"', '"item"')
		.replace('"pageNo"', ']},"pageNo"');

	//xmlData = deleteString(xmlData).replace(/	,{/, "{");

	console.log(xmlData);

	return JSON.parse(xmlData);
}

// < 와 > 사이의 문자열을 반환
function findString(data) {
	var start, end;
	start = data.indexOf('<');
	end = data.indexOf('>', start);
	
	return data.substring(start+1, end);
}

// 자료값의 좌우 중괄호 제거 함수
function deleteString(data) {
	var i=0;
	var j, k, result;
	var result = data.match(/{/gi).length;
	for (var z = 0; z <= result+1 ; z++) {
		i = data.indexOf('{', i+1);
		j = data.indexOf('{', i+1);
		k = data.indexOf('}', i+1);
		if (j > k) {
			data = data.replace("{"+data.substring(i+1, k)+"}", data.substring(i+1, k));
		}
		if (j == -1) {
			data = data.replace("{"+data.substring(i+1, k)+"}", data.substring(i+1, k));
		}
	}

	i = 0;
	result = data.match(/",/gi).length;
	for (var z = 0; z <= result ; z++) {
		i = data.indexOf('",', i+1);
		j = data.indexOf('}', i+1);
		k = data.indexOf('",', i+1);
		if (j<k) {
			data = data.substring(0, i+1) + data.substring(i+3, data.length);
		}
	}

//	console.log(data);
	return data;
}

module.exports = {
	parsingXMLData: parsingXMLData
};