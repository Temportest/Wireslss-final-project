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
  let zhText = '請問您要';
  var audio = document.getElementById('audio');
  //audio.src = `https://translate.google.com/translate_tts?ie=UTF-8&total=${zhText.length}&idx=0&textlen=32&client=tw-ob&q=${zhText}&tl=zh-TW`;
  audio.src = "audio/siri_begin.mp3";
  setTimeout(function () {
    console.log('resta')
    voiceEndCallback();
  }, 1000);
  // document.write(``);
  // const playPromise = audio.play();
  // if (playPromise !== null) {
  //   playPromise.catch(() => { console.log('replay'); audio.play(); })
  // }
}

// 取得目前經緯度和地址
function getLocation() {
  return new Promise(function (resolve, reject) {
    let longitude, latitude; // 經緯度
    // JS 取得經緯度
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (res) {
        longitude = res.coords.longitude
        latitude = res.coords.latitude;
        //console.log(longitude + " " + latitude);
        // Google GeoCode API 經緯度取得地址
        $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC8UY5L0pC6c3PaOZRcVr8u0R5cuxFC8qU`, function (data) {
          //console.log(JSON.stringify(data, null, 2));
          //return JSON.stringify(data, null, 2);
          resolve(JSON.stringify(data, null, 2));
        });
      }, function (error) {
        console.log(error);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  })
}



// 取得縣市經緯度
function parseCity(city) {
  if (city.indexOf('台北') !== -1) {
    getCityWeatherData(121.5598, 25.09108);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('新北') !== -1) {
    getCityWeatherData(121.6739, 24.91571);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('宜蘭') !== -1) {
    getCityWeatherData(121.7195, 24.69295);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('花蓮') !== -1) {
    getCityWeatherData(121.3542, 23.7569);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('金門') !== -1) {
    getCityWeatherData(118.3186, 24.43679);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('南投') !== -1) {
    getCityWeatherData(120.9876, 23.83876);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('屏東') !== -1) {
    getCityWeatherData(120.62, 22.54951);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('苗栗') !== -1) {
    getCityWeatherData(120.9417, 24.48927);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('桃園') !== -1) {
    getCityWeatherData(121.2168, 24.93759);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('高雄') !== -1) {
    getCityWeatherData(120.666, 23.01087);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('基隆') !== -1) {
    getCityWeatherData(121.7081, 25.10898);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('連江') !== -1) {
    getCityWeatherData(119.5397, 26.19737);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('雲林') !== -1) {
    getCityWeatherData(120.3897, 23.75585);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('嘉義') !== -1) {
    getCityWeatherData(120.574, 23.45889);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('新竹') !== -1) {
    getCityWeatherData(121.1252, 24.70328);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('彰化') !== -1) {
    getCityWeatherData(120.4818, 23.99297);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('臺中') !== -1) {
    getCityWeatherData(120.9417, 24.23321);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('台東') !== -1) {
    getCityWeatherData(120.9876, 22.98461);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('台南') !== -1) {
    getCityWeatherData(120.2513, 23.1417);
    window._recognition.status = false;
    window._recognition.stop();
  }
  else if (city.indexOf('澎湖') !== -1) {
    getCityWeatherData(119.6151, 23.56548);
    window._recognition.status = false;
    window._recognition.stop();
  } else if (city.indexOf('目前') !== -1) {
    getNowGEOWeatherData();
    window._recognition.status = false;
    window._recognition.stop();
  }
}

// 縣市名稱取得天氣資料
function getCityWeatherData(longitude, latitude) {
  console.log(longitude + " " + latitude);
  async.waterfall([
    function (callback) {
      const zhText = '搜尋中請稍候';
      const audio = document.getElementById('audio');
      console.log(audio);
      audio.src = `https://translate.google.com/translate_tts?ie=UTF-8&total=${zhText.length}&idx=0&textlen=32&client=tw-ob&q=${zhText}&tl=zh-TW`;
      callback(null);
    },
    function (callback) {
      // 直接縣市經緯度搜尋天氣
      callback(null, 'done city weather');
    }
  ], function (err, result) {
    // result now equals 'done'
    console.log(result);
    onStart();
  });

}

// 目前位置的天氣資料
function getNowGEOWeatherData() {
  async.waterfall([
    function (callback) {
      const zhText = '搜尋中請稍候';
      const audio = document.getElementById('audio');
      console.log(audio);
      audio.src = `https://translate.google.com/translate_tts?ie=UTF-8&total=${zhText.length}&idx=0&textlen=32&client=tw-ob&q=${zhText}&tl=zh-TW`;
      callback(null);
    },
    function (callback) {
      // arg1 now equals 'one' and arg2 now equals 'two'
      getLocation().then((data) => {
        // Google API取得目前地址
        callback(null, data);
      });
      
    },
    function (arg1, callback) {
      // arg1 now equals 'three'
      console.log(arg1);
      callback(null, 'done now location weather');
    }
  ], function (err, result) {
    // result now equals 'done'
    console.log(result);
    onStart();
  });

}
