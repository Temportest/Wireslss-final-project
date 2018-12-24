[![Build Status](https://travis-ci.org/Temporatry/Wireslss-final-project.svg?branch=master)](https://travis-ci.org/Temporatry/Wireslss-final-project)
[![GitHub license][license-image]][license-url]

## 互動式氣象小幫手
情境：糕點麵包師傅做麵團因為天氣與環境因素會導致發酵出來的麵團不是最好的，因此利用我們的環境查詢裝置可以立即得知目前室內溫濕度狀況以及外面的天氣狀況。

使用方法：使用者可以利用超音波感測器來觸發語音辨識詢問目前該地區的即時天氣，此外我們裝置含有溫濕度感測器，可以偵測使用者該環境下的溫濕度狀況。

設備：
- Arduino Fly(1) 
- WiFi模組(1) 
- 超音波感測器(1) 
- 溫濕度感測器(1) 
- 終端裝置(手機、電腦)
- 行動電源(1)
- 行動分享(AP)

## 實作
#### 硬體
- 超音波

超音波分別為類比8、9腳位分別偵超音波訊號來回的訊號距離
- 溫濕度感測器

溫濕度感測器接上13腳位並與地線連接
- WiFi

WiFi 模組首先與手機AP分享器配對並確定連線

#### 網頁
網頁分為前後端，前端網頁部署在 GitHub Page 上，後端資料接收與處理是放在學校實驗室的主機上。

- 前端

前端頁面利用 JavaScript 去與硬體裝置做資料接收與存取，並且使用WiFi做傳輸，最後將撈到的溫濕度以及超音波數值顯示在前端網頁上。

- 後端

若超音波數值差距100公分就會觸發我們的語音辨識，並將偵測後的數值在前端判斷並將判斷結果傳送給後端端做資料處理，最後將結果傳回前端並利用TTS文字轉語音的方式將天氣資訊播報出來。

#### 所使用的 API
1. Google Geocoding API
取得目前使用者所在的經緯度後利用此 API 來查詢目前使用者所在地的地址與縣市名稱......等

2. Dark Sky Weather API
此 API 可以利用縣市名稱或經緯度去查詢該地區的目前所有天氣。包含目前天氣描述、當日高低溫、體感溫度、日出與日落以及天氣預報。


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

- [Google tran API blog](https://note.pcwu.net/2017/02/08/tts-api/)


- [天氣查詢](https://temporatry.github.io/Wireslss-final-project/local-weather-app/index.html)


- [Demo Web](https://wireless-project.nutn-oase-lab.tk/demo)

- [local-weather-app](https://wireless-project.nutn-oase-lab.tk/local-weather-app)



[license-image]: https://img.shields.io/npm/l/express.svg?registry_uri=https%3A%2F%2Fregistry.npmjs.com
[license-url]: https://github.com/Temporatry/Wireslss-final-project/blob/master/LICENSE
