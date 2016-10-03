var Observable = require('FuseJS/Observable');

var key = "LEVQhgclvGUKoC%2BJrvokKajzK6OsTFRinprds4qBzZj1PJMDZUQ8SRTm0lmzbj1jzC9IaZLqEm1G%2FhAdHV5R5A%3D%3D";

function parsingXMLData(xmlData) {

	var jsonString = "{}";
	var findLocation = 0;
	var insertLocation = 1;
	var deepCount = 1;

	var forDeleteText = findString(xmlData, findLocation);
	xmlData = xmlData.replace('<'+forDeleteText+'>', "").replace(/\t/g, "").replace(/\r/g, "\\r").replace(/\n/g, "\\n");
	var attribute = Observable();

	for (var i = 0 ; i < xmlData.match(/</g).length ; i++) {
		var first;

		forDeleteText = findString(xmlData, findLocation+1);
		first = xmlData.indexOf('/'+forDeleteText, findLocation+1);
		
		if (forDeleteText == findString(xmlData, first+1)) {
			if (attribute.indexOf(forDeleteText) == -1) {
				attribute.add(forDeleteText);
			}
		}
		findLocation = xmlData.indexOf("<", findLocation+1);
	}

	findLocation = 0;

	for (var i = 0 ; i < xmlData.match(/</g).length ; i++) {
		//문자열을 반환하는 함수 findString()
		forDeleteText = findString(xmlData, findLocation+1);

		if (forDeleteText.indexOf("/") == -1) {
			var forInsertText = findDataString(xmlData, forDeleteText, findLocation);
			
			var findInsertLocation = "";
			for (var j = 0 ; j < deepCount ; j++) {
				findInsertLocation = findInsertLocation + "}";
			}

			for (var j = 0 ; j < jsonString.length ; ) {
				j = jsonString.indexOf(findInsertLocation, j+1);
				if (jsonString.indexOf(findInsertLocation, j+1) < 0) {
					insertLocation = j;
					break;
				}
			}

			if (forInsertText.indexOf("<") < 0) {
				jsonString =
					jsonString.substring(0, insertLocation)
					+'"'+forDeleteText+'":"'+forInsertText+'", '
					+jsonString.substring(insertLocation, jsonString.length);

				insertLocation = insertLocation+forDeleteText.length+forInsertText.length+5;
			} else {
				jsonString =
					jsonString.substring(0, insertLocation)
					+'"'+forDeleteText+'":{}'
					+jsonString.substring(insertLocation, jsonString.length);
			}
			deepCount++;
		} else if(forDeleteText.indexOf("/") > 1) {
			jsonString =
				jsonString.substring(0, insertLocation)
				+'"'+forDeleteText+'":"", '
				+jsonString.substring(insertLocation, jsonString.length);
		} else {
			deepCount--;
		}

		findLocation = xmlData.indexOf("<", findLocation+1);
		//console.log(jsonString);
	}
//	console.log(JSON.stringify(attribute));
//	console.log(JSON.stringify(attribute.getAt(0)));

	jsonString = jsonString
		.replace(/, }/g, "}")
		.replace(/}"/g, '}, "');
//		.replace('"items":{', '"items":[{')
//		.replace(/, "item"/g, '}, {"item"')
//		.replace('}}, "pageNo"', '}}], "pageNo"')
//		.replace('"bidDateInfos":{', '"bidDateInfos":[{')
//		.replace(/, "bidDateInfoItem"/g, '}, {"bidDateInfoItem"')
//		.replace('}}, "files"', '}}], "files"');

	findLocation = 0;

	for (var i = 0 ; i < attribute.length ; i++) {
		var frontAttribute, backAttribute, findText, modifyText;
		findText = attribute.getAt(i);
		for (var j = 0 ; j<xmlData.match(/</g).length ; j++) {
			frontAttribute = findString(xmlData, findLocation+1);
			findLocation = xmlData.indexOf("<", findLocation+1);

			if(findString(xmlData, findLocation+1) == findText) {
				break;
			}
		}
		findLocation = 0;

		findLocation = xmlData.indexOf('/'+frontAttribute, 0);
		backAttribute = findString(xmlData, findLocation+1);

//		console.log(frontAttribute + '/' + backAttribute);
		modifyText = '}, {"' + findText + '"';
		findText = new RegExp(', "'+findText+'"', 'g');

//		console.log(jsonString.match(findText).length);

		jsonString = jsonString
			.replace('"'+frontAttribute+'":{', '"'+frontAttribute+'":[{')
			.replace('}}, "'+backAttribute, '}}], "'+backAttribute)
			.replace(findText, modifyText);
	}

//	console.log(jsonString);

	return JSON.parse(jsonString);
}

// < 와 > 사이의 문자열을 반환
function findString(data, location) {
	var start, end;
	start = data.indexOf('<', location);
	end = data.indexOf('>', start);
	
	return data.substring(start+1, end);
}

// 데이터 값을 반환
function findDataString(data1, data2, findLocation) {
	var start, end;
	start = data1.indexOf(data2, findLocation);
	end = data1.indexOf('</'+data2, start);
	
	return data1.substring(start+1+data2.length, end);
}

// 중복된 속성 찾는 함수
function findAttribute(data, location) {
	var i, j, k;
	i = findString(data, 0);
	j = findDataString(data, i, data.indexOf(i)+2);
	k = findDataString(data, i, data.indexOf(j)+2);
}

module.exports = {
	parsingXMLData: parsingXMLData
};