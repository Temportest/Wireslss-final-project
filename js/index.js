let nowDistance; // 目前距離
let beforDistance = 0; // 前一次距離
let restart=true; // 初始化
let dht; // 溫濕度
boardReady({ device: 'nWxRb' }, function (board) {
  board.systemReset();
  board.samplingInterval = 500;
  ultrasonic = getUltrasonic(board, 8, 9); // 超音波腳位8 9
  dht = getDht(board, 13);
  onStartDHT();
  onStart(); // 開始偵測
});

function onStart(){
  ultrasonic.ping(function (cm) {
    nowDistance = ultrasonic.distance;
    document.getElementById("status").innerHTML = '連接成功';
    if (restart) {
      console.log('超音波初始化中...');
      beforDistance = nowDistance;
      restart = false;
    }
    else{
      let absDistance = Math.abs(nowDistance-beforDistance);
      console.log("目前距離：" + nowDistance + " 前一次距離：" + beforDistance + " 差距：" + absDistance);
      document.getElementById("demo-area-01-show").innerHTML = nowDistance;
      if (absDistance >= 100) {
        document.getElementById("status").innerHTML = '連接成功[機器人觸發]';
        document.getElementById("demo-area-01-show").style.color = '#ff0000';
        restart = true;
        ultrasonic.stopPing();
        call();
      } else {
        document.getElementById("demo-area-01-show").style.color = '#000000';
      }
      beforDistance = nowDistance;
    }
    
  }, 500);
}
function onStartDHT(){
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
    result.resultTranscript = event.results[result.resultLength][0].transcript;
    if (event.results[result.resultLength].isFinal === true) {
      console.log(result.resultTranscript);
      if (result.resultTranscript.indexOf("目前") !== -1) {
        speak('搜尋中請稍候', ["zh-TW", 1, 1, 1], function () {
          window._recognition.status = false;
          window._recognition.stop();
          //搜尋延遲等待
          setTimeout(function () {
            getLocation();
            speak('目前天氣晴', ["zh-TW", 1, 1, 1], function () {
              onStart(); // 開始偵測光敏
            }, 0);
          }, 3000);
        }, 0);
        console.log(event.results[result.resultLength]);
      }
      console.log("final");
    } else if (event.results[result.resultLength].isFinal === false) {
    }
  };
  window._recognition.start();
}

function call() {
  //responsiveVoice.speak("請問您要查詢哪裡的天氣", "Chinese Taiwan Male", { onend: voiceEndCallback });
  
  let zhText = '請問您要';
  var audio = document.getElementById('audio');
  //audio.src = `https://translate.google.com/translate_tts?ie=UTF-8&total=${zhText.length}&idx=0&textlen=32&client=tw-ob&q=${zhText}&tl=zh-TW`;
  audio.src ="/audio/siri_begin.mp3";
  setTimeout(function () {
    console.log('resta')
    voiceEndCallback();
    onStart();
  }, 1000);
  // document.write(``);
  // const playPromise = audio.play();
  // if (playPromise !== null) {
  //   playPromise.catch(() => { console.log('replay'); audio.play(); })
  // }
  
}
document.write(`<audio controls autoplay src=""></audio>`);

function getLocation(){
  // let longitude, latitude; // 經緯度
  // // JS 取得經緯度
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(function (res) {
  //     longitude = res.coords.longitude
  //     latitude = res.coords.latitude;
  //   }, function (error) {
  //     console.log(error);
  //   });
  // } else {
  //   console.log("Geolocation is not supported by this browser.");
  // }
  // // Google GeoCode API 經緯度取得地址
  // $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC8UY5L0pC6c3PaOZRcVr8u0R5cuxFC8qU`, function (data) {
  //   console.log(JSON.stringify(data, null, 2));
  // });
  // var val = document.getElementById("val").value;
  // var zhText = val;
  // zhText = encodeURI(zhText);
  
}




