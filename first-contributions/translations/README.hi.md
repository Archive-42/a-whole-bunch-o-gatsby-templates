# प्रथम योगदान

<img align="right" width="300" src="../assets/fork.png" alt="fork this repository" />

अन्य भाषाओं में इस पढ़ें: [अंग्रेजी](../README.md), [स्पेन](README.es.md), [डच](README.nl.md), [हिंदी](README.hi.md) [जापानी](README.ja.md) [रूसी](README.ru.md)

पहली बार कुछ करना कठिन होता है| ख़ास तौर पर जब आप मिलकर काम कर रहे हों तब गलतियां करना एक अच्छी बात नहीं है| मगर आपस में मिलना और एक जुट होकर काम करना ही तो है ओपन सोर्स| हम आपका ये पहला ओपन सोर्स कॉन्ट्रिब्यूशन आसान बनाने में आपकी मदद करेंगे|

आर्टिकल्स पढ़ना और ऑनलाइन ट्यूटोरियलज़ देखना मदद कर सकते हैं मगर बिना कुछ गलत करे खुद वो काम करने से अच्छा क्या हो सकता है? यह प्रोजेक्ट आपको आपके पहले कॉन्ट्रिब्यूशन के लिए दिशा निर्देशन में मदद करेगा| याद रखिये - जितने तनाव मुक्त होकर आप सीखेंगे उतना ही बेहतर सीख पाएंगे| अगर आप अपनी पहली कॉन्ट्रिब्यूशन करना चाहते हैं तो आगे दिए गए स्टेप्स को फॉलो करें|

अगर आपके मशीन पर Git नहीं है तो, [इसे स्थापित करें](https://help.github.com/articles/set-up-git/)

## रिपॉज़िटरी को फॉर्क करना

कांटा बटन पर क्लिक करके इस रिपॉज़िटरी को फॉर्क कर सकते हैं| 

## रिपोजिटरी क्लोन

<img align="right" width="300" src="../assets/clone.png" alt="clone this repository" />

अब आप यह रेपो अपने मशीन में क्लोन करें| क्लोन बटन पर क्लिक करें और फिर कॉपी टू क्लिपबोर्ड आइकॉन पर क्लिक करें|

एक टर्मिनल खोलें और निम्न git आदेश चलाएँ:

```
git clone "यूआरएल का नकल "
```

कहाँ "यूआरएल का नकल" (उद्धरण चिह्नों के बिना) इस भंडार के लिए यूआरएल  है। यूआरएल प्राप्त करने के लिए पिछले चरण देखें।

उदाहरण के लिए:

```
git clone https://github.com/यह तुम हो/first-contributions.git
```

<img align="right" width="300" src="../assets/copy-to-clipboard.png" alt="copy URL to clipboard" />

' यह तुम हो 'आपके GitHub अकाउंट का नाम है। यहाँ आप अपने कंप्यूटर में GitHub से फर्स्ट-कंट्रिब्यूशंज़ रेपो को क्लोन कर रहे हैं|

## एक ब्राँच बनाएं

अपने कंप्यूटर में रेपो डायरेक्टरी चेंज करें अगर अभी तक नहीं की है तो -- 

```
cd first-contributions
```

अब एक शाखा बनाएं `git checkout command` उपयोग करके|

```
git checkout -b <अपना नाम जोड़>
```

उदाहरण के लिए:

```
git checkout -b add-alonzo-church
```

## आवश्यक परिवर्तन करें और उन परिवर्तनों को कमिट करें-

अब `Contributors.md` फ़ाइल को एक टेक्स्ट एडिटर में खोलकर इसमें अपना नाम लिखें, और फ़ाइल को सेव करें| आप अगर `git status` निर्देश चलाएंगे , तो आप परिवर्तन देखेंगे। उन परिवर्तनों को नीचे `git add` कमान्ड का उपयोग कर जोड़ें।

```
git add Contributors.md
```

अब अपने किये गए बदलावों को कमिट करें `git commit` आदेश का उपयोग करके|

```
git commit -m "Add <आपका-नाम> to Contributors list"
```

<आपका-नाम> की जगह अपना नाम डालें|

## अपने बदलावों को github में पुश करें|

`git push` का उपयोग कर अपने परिवर्तन को पुश करें|

```
git push origin <अपना नाम जोड़>
```

`<अपना नाम जोड़>` की जगह अपना नाम डालें|

## अपने बदलावों को रिव्यु के लिए सबमिट करें|

अगर आप अपने github प्रोफाइल पर अपनी रेपो में जायेंगे तो आपको Compare & pull request का ऑप्शन दिखेगा| उसे दबाएं|
<img style="float: right;" src="../assets/compare-and-pull.png" alt="create a pull request" />

अब अपनी pull request सबमिट करें|

<img style="float: right;" src="../assets/submit-pull.png" alt="submit pull request" />
जल्द ही मैं आपके बदलावों को इस प्रोजेक्ट की मास्टर ब्राँच में मर्ज क्र दूंगा| आपको एक मेल आजायेगी जब आपके बदलाव मर्ज होंगे|

## यहाँ से कहाँ जाएं ?

Github पे अपने पहले योगदान की खुश में जश्न मनाएं और अपने दोस्तों के साथ शेयर करें [वेब एप्प](https://roshanjossey.github.io/first-contributions/#social-share) पे जाके| <br/>
आप हमारी स्लैक टीम को ज्वाइन कर सकते हैं अगर आपको कोई मदद चाहिए या आपके कोई परेशानी हों| [स्लैक पे ज्वाइन करें](https://firstcontributions.herokuapp.com) <br/>
अब आप और प्रोजेक्ट्स में कंट्रीब्यूट करना शुरू कर सकते हैं| हमने आपके लिए एक लिस्ट बनायीं है जो कि बहुत आसान मुद्दे हैं| [प्रोजेक्ट्स कि लिस्ट](https://roshanjossey.github.io/first-contributions/#project-list)<br/>

## अन्य टूल का उपयोग करके ट्यूटोरियल

|<a href="github-desktop-tutorial.md"><img alt="GitHub Desktop" src="https://desktop.github.com/images/desktop-icon.svg" width="100"></a>|<a href="github-windows-vs2017-tutorial.md"><img alt="Visual Studio 2017" src="https://www.microsoft.com/net/images/vslogo.png" width="100"></a>|<a href="gitkraken-tutorial.md"><img alt="GitKraken" src="/assets/gk-icon.png" width="100"></a>|
|---|---|---|
|[GitHub Desktop](../github-desktop-tutorial.md)|[Visual Studio 2017](../github-windows-vs2017-tutorial.md)|[GitKraken](../gitkraken-tutorial.md)|
