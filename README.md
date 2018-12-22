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



- [Geocoding API ](https://maps.googleapis.com/maps/api/geocode/json?latlng=22.9926949,120.2155742&key=AIzaSyC8UY5L0pC6c3PaOZRcVr8u0R5cuxFC8qU)

- [Geocoding API DOC](https://developers.google.com/maps/documentation/geocoding/start)

- [baidu API](http://api.map.baidu.com/geocoder?output=json&location=22.9926949,120.2155742&ak=esNPFDwwsXWtsQfw4NMNmur1
)
