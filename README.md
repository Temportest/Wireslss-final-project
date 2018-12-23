## 語音辨識
```js
function myclick(){
  speak('請問要查詢哪裡的天氣');
}

function speak(str) {
  var msg = new SpeechSynthesisUtterance();
  var voices = window.speechSynthesis.getVoices();
  // msg.voice = voices[10]; // Note: some voices don't support altering params
  // msg.voiceURI = 'native';
  msg.volume = 1; // 0 to 1
  msg.rate = 1; // 0.1 to 10
  msg.pitch = 1; //0 to 2
  msg.text = str;
  msg.lang = 'zh';

  console.log('dsfds');
  speechSynthesis.speak(msg);
}

```

## 百度TTS
```js
let zhText='請問您要查詢哪裡的天氣';
  document.write("<audio autoplay=\"autoplay\">");
  document.write("<source src=\"http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=2&text=" + zhText + "\" type=\"audio/mpeg\">");
  document.write("<embed height=\"0\" width=\"0\" src=\"http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=2&text=" + zhText + "\">");
  document.write("</audio>");
```



- [Geocoding API ](https://maps.googleapis.com/maps/api/geocode/json?latlng=22.9926949,120.2155742&key=AIzaSyC8UY5L0pC6c3PaOZRcVr8u0R5cuxFC8qU)

- [Geocoding API DOC](https://developers.google.com/maps/documentation/geocoding/start)

- [baidu API](http://api.map.baidu.com/geocoder?output=json&location=22.9926949,120.2155742&ak=esNPFDwwsXWtsQfw4NMNmur1
)

-[Google tran API blog](https://note.pcwu.net/2017/02/08/tts-api/)


- [天氣查詢](https://temporatry.github.io/Wireslss-final-project/local-weather-app/index.html)
