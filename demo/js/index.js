//Variables for working with Location, Temprature and Times
var latitude;
var longitude;
var tempInF;
var tempInC;
var timeFormatted;

//Quotes depending on the weather
var weatherQuotes = {
	rain: "\"The best thing one can do when it's raining is to let it rain.\" -Henry Wadsworth Longfellow",
	clearDay: "\"Wherever you go, no matter what the weather, always bring your own sunshine.\" -Anthony J. D'Angelo",
	clearNight: "\"The sky grew darker, painted blue on blue, one stroke at a time, into deeper and deeper shades of night.\" -Haruki Murakami",
	snow: "\"So comes snow after fire, and even dragons have their ending!\" -J. R. R. Tolkien",
	sleet: "\"Then come the wild weather, come sleet or come snow, we will stand by each other, however it blow.\" -Simon Dach",
	wind: "\"Kites rise highest against the wind - not with it.\" -Winston Churchill",
	fog: "\"It is not the clear-sighted who rule the world. Great achievements are accomplished in a blessed, warm fog.\" -Joseph Conrad",
	cloudy: "\"Happiness is like a cloud, if you stare at it long enough, it evaporates.\" -Sarah McLachlan",
	partlyCloudy: "\"Try to be a rainbow in someone's cloud.\" -Maya Angelou",
	default: "\"The storm starts, when the drops start dropping When the drops stop dropping then the storm starts stopping.\"― Dr. Seuss "
};

function locateYou() {
	return new Promise(function (resolve, reject) {
		// 經緯度取得縣市地區資訊
		//Try to get location from users browser (device).
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
				console.log(latitude + " " + longitude + "geo");
				resolve();
			});
			
		}
	}, function (error) {
		console.log(error);
	});
};

//After collecting the Latiture and Longitute, Getting their formatted address from Google Maps.
// function yourAddress() {
// 	var googleApiCall = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC8UY5L0pC6c3PaOZRcVr8u0R5cuxFC8qU&language=zh-TW`;
// 	$.getJSON(googleApiCall, function (locationName) {
// 		console.log(locationName.results);
// 		$(".locName").html(locationName.results[4].formatted_address);
// 		// console.log(locationName.results[2].formatted_address); (For checking the precision)
// 	});
// }

function getWeather() {
	return new Promise(function (resolve, reject) {
		//Looking up the weather from Darkskies using users latitude and longitude.
		//Please don't use this API key. Get your own from DarkSkies.
		var weatherApiKey = "a3219d4e2772db6e34c6491e62144b27";
		var weatherApiCall = "https://api.darksky.net/forecast/" + weatherApiKey + "/" + latitude + "," + longitude + "?units=si&lang=zh-tw";
		$.ajax({
			url: weatherApiCall,
			type: "GET",
			dataType: "jsonp",
			success: function (weatherData) {
				//Fetching all the infor from the JSON file and plugging it into UI
				$(".currentTemp").html((weatherData.currently.temperature).toFixed(1));
				$(".weatherCondition").html(weatherData.currently.summary);
				$(".feelsLike").html((weatherData.currently.apparentTemperature).toFixed(1) + " °C");
				$(".humidity").html((weatherData.currently.humidity * 100).toFixed(0));
				$(".windSpeed").html((weatherData.currently.windSpeed / 0.6213).toFixed(1));

				$(".todaySummary").html(weatherData.hourly.summary);
				$(".tempMin").html((weatherData.daily.data[0].temperatureMin).toFixed(1) + " °C");
				$(".tempMax").html((weatherData.daily.data[0].temperatureMax).toFixed(1) + " °C");

				$(".cloudCover").text((weatherData.currently.cloudCover * 100).toFixed(1) + " %");
				$(".dewPoint").text(weatherData.currently.dewPoint + " °F");

				//Converting UNIX time
				unixToTime(weatherData.daily.data[0].sunriseTime);
				var sunriseTimeFormatted = timeFormatted + " AM";
				$(".sunriseTime").text(sunriseTimeFormatted);

				unixToTime(weatherData.daily.data[0].sunsetTime);
				var sunsetTimeFormatted = timeFormatted + " PM";
				$(".sunsetTime").text(sunsetTimeFormatted);

				//Loading weekly Data in UI
				$(".weekDaysSummary").text(weatherData.daily.summary);
				var skycons = new Skycons({ "color": "white" });

				for (i = 1; i < 7; i++) {
					$(".weekDayTempMax" + i).text(weatherData.daily.data[i].temperatureMax);
					$(".weekDayTempMin" + i).text(weatherData.daily.data[i].temperatureMin);
					$(".weekDaySunrise" + i).text(unixToTime(weatherData.daily.data[i].sunriseTime));
					$(".weekDaySunset" + i).text(unixToTime(weatherData.daily.data[i].sunsetTime));
					$(".weekDayName" + i).text(unixToWeekday(weatherData.daily.data[i].time));
					$(".weekDaySummary" + i).text(weatherData.daily.data[i].summary);
					$(".weekDayWind" + i).text((weatherData.daily.data[i].windSpeed / 0.6213).toFixed(2));
					$(".weekDayHumid" + i).text((weatherData.daily.data[i].humidity * 100).toFixed(0));
					$(".weekDayCloud" + i).text((weatherData.daily.data[i].cloudCover * 100).toFixed(0));
					skycons.set("weatherIcon" + i, weatherData.daily.data[i].icon);
				}

				//Skycon Icons
				skycons.set("weatherIcon", weatherData.currently.icon);
				skycons.set("expectIcon", weatherData.hourly.icon);
				skycons.play();

				//Coverting data between Celcius and Farenheight
				tempInF = ((weatherData.currently.temperature * 9 / 5) + 32).toFixed(1);
				tempInC = (weatherData.currently.temperature).toFixed(1);
				feelsLikeInC = (weatherData.currently.apparentTemperature).toFixed(1);
				feelsLikeInF = ((weatherData.currently.apparentTemperature * 9 / 5) + 32).toFixed(1);

				//Load Quotes
				var selectQuote = weatherData.currently.icon;
				var loadQuote = $(".quote");
				switch (weatherData.currently.icon) {
					case "clear-day":
						$(".quote").text(weatherQuotes.clearDay);
						break;
					case "clear-night":
						$(".quote").text(weatherQuotes.clearNight);
						break;
					case "rain":
						$(".quote").text(weatherQuotes.rain);
						break;
					case "snow":
						$(".quote").text(weatherQuotes.snow);
						break;
					case "sleet":
						$(".quote").text(weatherQuotes.sleet);
						break;
					case "clear-night":
						$(".quote").text(weatherQuotes.clearNight);
						break;
					case "wind":
						$(".quote").text(weatherQuotes.wind);
						break;
					case "fog":
						$(".quote").text(weatherQuotes.fog);
						break;
					case "cloudy":
						$(".quote").text(weatherQuotes.cloudy);
						break;
					case "partlyCloudy":
						$(".quote").text(weatherQuotes.partlyCloudy);
						break;
					default:
						$(".quote").text(weatherQuotes.default);
				}
				resolve(Object.assign(weatherData));
			}
		});
	})
}

//Calling the function to locate user and fetch the data
//locateYou();

//Function for converting UNIX time to Local Time
function unixToTime(unix) {
	unix *= 1000;
	var toTime = new Date(unix);
	var hour = ((toTime.getHours() % 12 || 12) < 10 ? '0' : '') + (toTime.getHours() % 12 || 12);
	var minute = (toTime.getMinutes() < 10 ? '0' : '') + toTime.getMinutes();
	timeFormatted = hour + ":" + minute;
	return timeFormatted;
}

function unixToWeekday(unix) {
	unix *= 1000;
	var toWeekday = new Date(unix);
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var weekday = days[toWeekday.getDay()];
	return weekday;
}

//UI Tweaks
$(".convertToggle").on("click", function () {
	$(".toggleIcon").toggleClass("ion-toggle-filled");
	var tmpNow = $(".currentTemp");
	var unit = $(".unit");
	var feelsLike = $(".feelsLike");

	if (tmpNow.text() == tempInC) {
		tmpNow.text(tempInF);
		unit.text("°F");
		feelsLike.text(feelsLikeInF + " °F")
	} else {
		tmpNow.text(tempInC);
		unit.text("°C");
		feelsLike.text(feelsLikeInC + " °C")
	}
});


//Smooth Scrool to Weekly Forecast section
$(".goToWeek").on("click", function () {
	$('html, body').animate({
		scrollTop: $("#weeklyForecast").offset().top
	}, 1000);
});


/** 以下為硬體裝置端程式 */
let nowDistance; // 目前距離
let beforDistance = 0; // 前一次距離
let restart = true; // 初始化
let dht; // 溫濕度
boardReady({ device: 'nWxRb' }, function (board) {
	board.systemReset();
	board.samplingInterval = 500;
	ultrasonic = getUltrasonic(board, 8, 9); // 超音波腳位8 9
	dht = getDht(board, 13);
	onStartDHT(); // 持續偵測溫濕度
	onStart(); // 開始偵測超音波
});

// 超音波初始化
function onStart() {
	ultrasonic.ping(function (cm) {
		nowDistance = ultrasonic.distance;
		document.getElementById("status").innerHTML = '連接成功';
		if (restart) {
			console.log('超音波初始化中...');
			beforDistance = nowDistance;
			restart = false;
		}
		else {
			let absDistance = Math.abs(nowDistance - beforDistance);
			console.log("目前距離：" + nowDistance + " 前一次距離：" + beforDistance + " 差距：" + absDistance);
			document.getElementById("demo-area-01-show").innerHTML = nowDistance;
			if (absDistance >= 100) {
				document.getElementById("status").innerHTML = '連接成功[機器人觸發]';
				document.getElementById("demo-area-01-show").style.color = '#ff0000';
				restart = true;
				ultrasonic.stopPing(); // 停止超音波偵測
				startRecognize();
			} else {
				document.getElementById("demo-area-01-show").style.color = '#000000';
			}
			beforDistance = nowDistance;
		}
	}, 500);
}

// 溫濕度初始化
function onStartDHT() {
	document.getElementById("demo-area-02-show").style.fontSize = 20 + "px";
	document.getElementById("demo-area-02-show").style.lineHeight = 20 + "px";
	dht.read(function (evt) {
		document.getElementById("demo-area-02-show").innerHTML = (['溫度：', dht.temperature, '度<br/>濕度：', dht.humidity, '%'].join(''));
	}, 1000);
}

// 語音辨識初始化
if (!("webkitSpeechRecognition" in window)) {
	alert("本瀏覽器不支援語音辨識，請更換瀏覽器！(Chrome 25 版以上才支援語音辨識)");
} else {
	window._recognition = new webkitSpeechRecognition();
	window._recognition.continuous = true;
	window._recognition.interimResults = true;
	window._recognition.lang = "cmn-Hant-TW";
	// 開始語音辨識
	window._recognition.onstart = function () {
		window._recognition.status = true;
		console.log("Start recognize...");
	};
	// 結束語音辨識
	window._recognition.onend = function () {
		console.log("Stop recognize");
		if (window._recognition.status) {
			window._recognition.start();
		}
	};
}

function voiceEndCallback() {
	document.getElementById("status").innerHTML = '連接成功[語音辨識]';
	// 開始語音辨識
	window._recognition.onresult = function (event, result) {
		result = {};
		result.resultLength = event.results.length - 1;
		city = event.results[result.resultLength][0].transcript;
		if (event.results[result.resultLength].isFinal === true) {
			console.log(city);
			parseCity(city);
			console.log("final");
		} else if (event.results[result.resultLength].isFinal === false) {
			// 語音辨識持續偵測
		}
	};
	window._recognition.start();
}

// 觸發語音監聽事件
function startRecognize() {
	var audio = document.getElementById('audio');
	audio.src = "https://temporatry.github.io/Wireslss-final-project/audio/siri_begin.mp3";
	setTimeout(function () {
		voiceEndCallback();
	}, 1000);
}

// 取得目前經緯度和地址
function getLocation() {
	return new Promise(function (resolve, reject) {
		// 經緯度取得縣市地區資訊
		$.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC8UY5L0pC6c3PaOZRcVr8u0R5cuxFC8qU`, function (data) {
			console.log(JSON.stringify(data, null, 2));
			//return JSON.stringify(data, null, 2);
			resolve(Object.assign(data, null, 2));
		});
	}, function (error) {
		console.log(error);
	});
}



// 取得縣市經緯度
function parseCity(city) {
	if (city.indexOf('台北') !== -1) {
		getCityWeatherData(121.5598, 25.09108, '台北');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('新北') !== -1) {
		getCityWeatherData(121.6739, 24.91571, '新北');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('宜蘭') !== -1) {
		getCityWeatherData(121.7195, 24.69295, '宜蘭');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('花蓮') !== -1) {
		getCityWeatherData(121.3542, 23.7569, '花蓮');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('金門') !== -1) {
		getCityWeatherData(118.320213, 24.433040,  '金門');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('南投') !== -1) {
		getCityWeatherData(120.9876, 23.83876, '南投');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('屏東') !== -1) {
		getCityWeatherData(120.62, 22.54951, '屏東');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('苗栗') !== -1) {
		getCityWeatherData(120.9417, 24.48927, '苗栗');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('桃園') !== -1) {
		getCityWeatherData(121.2168, 24.93759, '桃園');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('高雄') !== -1) {
		getCityWeatherData(120.666, 23.01087, '高雄');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('基隆') !== -1) {
		getCityWeatherData(121.7081, 25.10898, '基隆');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('連江') !== -1) {
		getCityWeatherData(119.5397, 26.19737, '連江');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('雲林') !== -1) {
		getCityWeatherData(120.3897, 23.75585, '雲林');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('嘉義') !== -1) {
		getCityWeatherData(120.574, 23.45889, '嘉義');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('新竹') !== -1) {
		getCityWeatherData(121.1252, 24.70328, '新竹');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('彰化') !== -1) {
		getCityWeatherData(120.4818, 23.99297, '彰化');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('臺中') !== -1) {
		getCityWeatherData(120.9417, 24.23321, '臺中');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('台東') !== -1) {
		getCityWeatherData(120.9876, 22.98461, '台東');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('台南') !== -1) {
		getCityWeatherData(120.2513, 23.1417, '台南');
		window._recognition.status = false;
		window._recognition.stop();
	}
	else if (city.indexOf('澎湖') !== -1) {
		getCityWeatherData(119.6151, 23.56548, '澎湖');
		window._recognition.status = false;
		window._recognition.stop();
	} else if (city.indexOf('目前') !== -1) {
		getNowGEOWeatherData();
		window._recognition.status = false;
		window._recognition.stop();
	}
}

// 縣市名稱取得天氣資料
function getCityWeatherData(lng, lat, city) {
	async.waterfall([
		function (callback) {
			speakTTS('搜尋中請稍候');
			setTimeout(() => {
				// 為了解決延遲與同步故語音播報後等待三秒再進入下一階段
				callback(null);
			}, 3000);
		},
		function (callback) {
			// 將經緯度更新為該縣市
			latitude = lat;
			longitude = lng;
			console.log(lat + " "+lng);
			// Google API取得目前地址
			getLocation().then((data) => {
				// 取得縣市名稱
				const addressComponents = data.results[2].address_components.length;
				const city = data.results[2].address_components[addressComponents - 3].long_name;
				// 前端渲染地址
				$(".locName").html(`台灣 ${city}`);
				callback(null, data);
			});
		},
		function (addressData, callback) {
			// 取得地址
			getWeather().then(function (weatherData) {
				callback(null, addressData, weatherData);
			});
		}
	], function (err, addressData, weatherData) {
		// 取得地址和天氣資訊
		showCondition();
		const addressComponents = addressData.results[2].address_components.length;
		const city = addressData.results[2].address_components[addressComponents - 3].long_name;
			speakTTS(`您查詢的縣市為 ${city}. 最高溫 ${Math.round(weatherData.daily.data[0].temperatureMax)}度 最低溫 ${Math.round(weatherData.daily.data[0].temperatureMin)}度`);
		onStart();
	});

}

function speakTTS(text) {
	console.log('TTS');
	var resAudio = document.createElement('audio');
	resAudio.id = 'resAudio';
	resAudio.src = `http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&per=1&text=${text}`;
	resAudio.autoplay = 'true';
	document.body.appendChild(resAudio);
}
// 目前位置的天氣資料
function getNowGEOWeatherData() {
	async.waterfall([
		function (callback) {
			speakTTS('搜尋中請稍候');
			setTimeout(() => {
				// 為了解決延遲與同步故語音播報後等待三秒再進入下一階段
				callback(null);
			}, 3000);
		},
		function (callback) {
			// 取得使用者經緯度
			locateYou().then(function(){
				callback(null);
			});
		},
		function (callback) {
			// Google API取得目前地址
			getLocation().then((data) => {
				// 前端渲染地址
				$(".locName").html(data.results[4].formatted_address);
				callback(null, data);
			});

		},
		function (addressData, callback) {
			// 取得地址
			getWeather().then(function (weatherData) {
				callback(null, addressData, weatherData);
			});
		}
	], function (err, addressData, weatherData) {
		// 取得地址和天氣資訊
		showCondition();
		const addressComponents = addressData.results[4].address_components.length;
		const city = addressData.results[4].address_components[addressComponents - 3].long_name;
		const direct = addressData.results[4].address_components[addressComponents - 4].long_name;
		speakTTS(`目前位置為 ${city}${direct}. ${weatherData.currently.summary} 最高溫 ${Math.round(weatherData.daily.data[0].temperatureMax)}度 最低溫 ${Math.round(weatherData.daily.data[0].temperatureMin)}度`);
		onStart();
	});

}


function showCondition() {
	//Initiate wow.js
	new WOW().init();
	const weatherSection = document.getElementById('weather-section');
	const statusSection = document.getElementById('status-section');
	weatherSection.style.display = "block";
	statusSection.style.display = "none";
}
