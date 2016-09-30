var Observable = require('FuseJS/Observable');

var key = "LEVQhgclvGUKoC%2BJrvokKajzK6OsTFRinprds4qBzZj1PJMDZUQ8SRTm0lmzbj1jzC9IaZLqEm1G%2FhAdHV5R5A%3D%3D";

function parsingXMLData(xmlData) {
	var tempText = xmlData;
	var responseData = Observable();

// xml 헤더 삭제
	var forDeleteText = findString(tempText);
	tempText = tempText.replace('<'+forDeleteText+'>', "").replace(/-/gi, "");

// 반환된 문자열을 이용하여 </문자열> 을 "}"로 변환, <문자열> 을 "문자열":{" 로 변환
	for (var i = 0 ; tempText.indexOf('<') != -1 ; i++) {
		//문자열을 반환하는 함수 findString(data)
		//console.log(findString(tempText));
		forDeleteText = findString(tempText);
		if (forDeleteText.indexOf("/") > 1) {
			forDeleteText = forDeleteText.replace("/", "");
			tempText = tempText.replace("<"+forDeleteText+"/>", forDeleteText+ '":"","')
		} else {
		tempText = tempText.replace("</"+forDeleteText+">", '"},"')
			.replace('<'+forDeleteText+'>', forDeleteText+'":{"');
		}
	}

	tempText = tempText
		.replace(/\r/gi, "")
		.replace(/\n/gi, "")
		.replace(/	/gi, "")
		.replace(/\s\s+/gi, "")
//		.replace(/\\\\/gi, "")
		.replace(/,""/gi, "");

// header의 응답내용을 responseData로 저장
// responseData.add(JSON.parse(deleteString('{"'+tempText.slice(0, -2)+"}")).response.header);

// header의 내용을 삭제하고 나머지 내용을 items에 저장
	tempText = deleteString(tempText.slice(tempText.indexOf("items")-2, -4))
		.replace('"items":{', '"items":[{')
		.replace(/,"item"/gi, '},{"item"')
		.replace('},"pageNo"', '}],"pageNo"') + "}";
	responseData.add(JSON.parse(tempText));

	return responseData.value;
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
	return data;
}

module.exports = {
	parsingXMLData: parsingXMLData
};