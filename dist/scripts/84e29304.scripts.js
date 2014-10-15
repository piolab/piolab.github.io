"use strict";angular.module("pioDictApp",["ngSanitize","ngRoute","LocalStorageModule","adaptive.speech"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/practice",{templateUrl:"views/practice.html",controller:"PracticeCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("pioDictApp").factory("utilsFactory",function(){return{randomInteger:function(a){return Math.floor(Math.random()*a)},inArray:function(a,b){for(var c=0;c<a.length;c++)if(a[c]===b)return!0;return!1},getRandomsArray:function(a,b,c){for(var d=this,e=[],f=0;b>f;f++)for(;;){var g=d.randomInteger(a);if(!d.inArray(e,g)&&g!=c){e.push(g);break}}return console.log(e),e}}}),angular.module("pioDictApp").controller("MainCtrl",["$scope","dictFactory","localStorageService","wordRemember","$speechSynthetis","config",function(a,b,c,d,e,f){a.wordRemember=d,a.prefixUrl=f.prefixUrl,a.wordHistory=a.wordRemember.get("word-history"),a.dictSearch=function(){b.googleAutomaticTranslate(a.query,function(b){a.googleTranslateResult=b,console.log(b)}),b.googleDictionarySearch(a.query,function(b){a.googleDictionaryResult=b,a.queryText=b?a.googleDictionaryResult.dictionary.word:a.query,console.log(b)})},a.isRemembered=function(a){return d.inWordList(a)},a.addWord=function(){if(-1!=a.isRemembered(a.queryText))return console.log("remembered"),!1;var b={word:a.queryText,meaning:a.googleTranslateResult,box:0};d.add(b)},a.speak=function(a){e.speak(a,"en-US")}}]),angular.module("pioDictApp").factory("dictFactory",["config","$http",function(a,b){return{googleAutomaticTranslate:function(c,d){var e={key:a.googleKey,source:a.langSource,target:a.langTarget,q:c};b.get(a.googleTranslateUrl,{params:e}).success(function(a){d(a.data.translations[0].translatedText)})},googleDictionarySearch:function(c,d){var e={key:a.googleDictionaryKey,dataset:"dictionary",dictionaryLanguage:"en",query:c};b.get(a.googleDictionaryUrl,{params:e}).success(function(a){d(a.data?a.data[0]:!1)})},duolingoSeach:function(a,c){var d="https://d.duolingo.com/words/hints/en/vi",e={sentence:a,callback:"JSON_CALLBACK",format:"new"};b.jsonp(d,{params:e}).success(function(a){c(a)})},tracauSearch:function(a,c){var d="http://api.tracau.vn/WBBcwnwQpV89/"+a+"/en/JSON_CALLBACK";b.get(d).success(function(a){c(a),console.log(a)})}}}]),angular.module("pioDictApp").value("config",{langSource:"en",langTarget:"vi",googleTranslateUrl:"https://www.googleapis.com/language/translate/v2",googleDictionaryUrl:"https://www.googleapis.com/scribe/v1/research",googleDictionaryKey:"AIzaSyDqVYORLCUXxSv7zneerIgC2UYMnxvPeqQ",prefixUrl:"/dict",googleKey:"AIzaSyAjLkDRFwGpQgUMRKDyQAHXSXcTt2kCBy4"}),angular.module("pioDictApp").directive("ngEnter",function(){return function(a,b,c){b.bind("keydown keypress",function(b){13===b.which&&(a.$apply(function(){a.$eval(c.ngEnter)}),b.preventDefault())})}}),angular.module("pioDictApp").factory("wordRemember",["localStorageService",function(a){var b;return{get:function(c){return this.key=c,b=a.get(c),b||(a.set(c,[]),b=a.get(c)),b},set:function(b,c){return this.key=b,a.set(b,c),a.get(b)},inWordList:function(c){b||(a.set(key,[]),b=a.get(key));for(var d=0,e=b.length;e>d;d++){var f=b[d];if(angular.equals(angular.lowercase(f.word),angular.lowercase(c)))return d}return-1},add:function(a){b.push(a),this.set(this.key,b)},deleteWordByIndex:function(a){-1!=a&&(b.splice(a,1),this.set(this.key,b))},deleteWord:function(a){var b=this.inWordList(a);this.deleteWordByIndex(b)}}}]),angular.module("pioDictApp").directive("cardTest",["utilsFactory","$timeout",function(a,b){return{templateUrl:"/views/templates/card-test.html",restrict:"A",scope:{cardData:"=",cardId:"@",testType:"@",numQuiz:"@",onFinishTest:"&"},link:function(c){console.log("link"),c.createQuiz=function(){c.cardIdChoice=void 0;var b=a.getRandomsArray(c.cardData.length,c.numQuiz,parseInt(c.cardId)),d=a.randomInteger(b.length+1);b.splice(d,0,parseInt(c.cardId)),c.quizIndexs=b},c.wrongAnswer=function(a){return void 0!=c.cardIdChoice&&c.cardIdChoice==a&&c.cardIdChoice!=c.cardId},c.trueAnswer=function(a){return void 0!=c.cardIdChoice&&a==c.cardId},c.normalButton=function(a){return void 0==c.cardIdChoice||c.cardIdChoice!=a&&a!=c.cardId},c.answerChoice=function(a){void 0==c.cardIdChoice&&(c.cardIdChoice=a,b(function(){c.onFinishTest({isTrue:c.cardIdChoice==c.cardId})},1e3))},c.keyPress=function(a){console.log(a.which)},c.createQuiz()}}}]),angular.module("pioDictApp").controller("PracticeCtrl",["$scope","wordRemember","utilsFactory","Cards","config",function(a,b,c,d,e){a.prefixUrl=e.prefixUrl,a.score=0,a.reviewing=!0,a.wordList=b.get("word-history"),a.cards=[],a.practiceOption=5,a.practiceStatus="prepare",a.cardId=1,a.cards=a.wordList.slice(0,a.practiceOption),d=[{word:"hello",box:0,meaning:"xin chao"},{word:"test",box:0,meaning:"kiem tra"},{word:"number",box:0,meaning:"so"},{word:"activity",box:0,meaning:"hoat dong"}],a.preparePractice=function(){a.practiceStatus="practicing",a.reviewing=!1},a.isCompleted=function(){for(var b=0;b<a.cards.length;b++)if(a.cards[b].box<4)return!1;return!0},a.nextActivity=function(){if(a.isCompleted())a.practiceStatus="completed";else{var b,d=a.cards.length;do b=c.randomInteger(d);while(a.cards[b].box>3);a.cardId=b,console.log("random number "+b),a.reviewing=0===a.cards[b].box?!0:!1}},a.selectPractice=function(){a.preparePractice(),a.nextActivity()},a.onFinishReview=function(){0===a.cards[a.cardId].box&&a.cards[a.cardId].box++,a.nextActivity()},a.onFinishTest=function(b){console.log("is correct "+b),b?(a.score+=10,a.cards[a.cardId].box++,a.isCompleted()?a.practiceStatus="completed":(console.log("next activity"),a.nextActivity())):(a.score-=5,a.reviewing=!0)},a.nextTest=function(){do var b=c.randomInteger(4);while(a.cardsData.data[b].box>3);a.cardId=b,a.reviewing=0===a.cardsData.data[b].box?!0:!1}}]),angular.module("pioDictApp").directive("cardView",function(){return{templateUrl:"/views/templates/cardView.html",restrict:"A",scope:{cardData:"=",cardId:"@",onFinishReview:"&"}}}),angular.module("pioDictApp").directive("inputTextTest",["$timeout",function(a){return{templateUrl:"/views/templates/input-text-test.html",restrict:"A",scope:{cardData:"=",cardId:"@",testType:"@",onFinishTest:"&"},link:function(b){b.createQuiz=function(){b.answerText="",b.answered=!1},b.answer=function(){b.isTrue=!1,b.answered=!0,angular.equals(angular.lowercase(b.answerText),angular.lowercase(b.cardData[b.cardId].word))&&(b.isTrue=!0),a(function(){b.onFinishTest({isTrue:b.isTrue}),b.createQuiz()},1e3)}}}}]),angular.module("pioDictApp").factory("Cards",function(){return{}});