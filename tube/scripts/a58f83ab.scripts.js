"use strict";var app=angular.module("jukeboxApp",["ui.bootstrap","LocalStorageModule"]);app.run(function(){var a=document.createElement("script");a.src="http://www.youtube.com/iframe_api";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}),app.config(["$httpProvider",function(){}]),angular.module("jukeboxApp").controller("MainCtrl",["$scope","$log","Youtubeservice","$http",function(a,b,c,d){a.upcoming=c.upcoming,a.history=c.history,a.playing=c.playing,a.tab=0,a.searchBoxFocus=function(){a.tab=0},a.relateTabClick=function(){a.tab=1},a.historyTabClick=function(){a.tab=2},a.search=function(b){a.searchYoutube(b)},a.searchYoutube=function(d){c.search(d).success(function(c){a.youtubeResult=c.data.items,b.info(a.youtubeResult)})},a.relateYoutube=function(d){c.relate(d).success(function(c){a.youtubeRelate=c.data.items,b.log(c)})},a.suggestQueries=function(a){var b="http://suggestqueries.google.com/complete/search",c={hl:"vn",ds:"yt",client:"youtube",hjson:"t",q:a,callback:"JSON_CALLBACK"};return d.jsonp(b,{params:c}).then(function(a){var b=[];return angular.forEach(a.data[1],function(a){b.push(a[0])}),b})},a.queue=function(a,b){c.queueVideo(a,b)},a.play=function(a){c.launchPlayer(a)},a.deleteUpcoming=function(a){c.deleteUpcomingVideo(a)},a.$watch("upcoming[0].id",function(b){a.relateYoutube(b)})}]),angular.module("jukeboxApp").service("Youtubeservice",["$http","$rootScope","$window","$log","localStorageService",function(a,b,c,d,e){function f(){d.info("YouTube Player is ready"),i.videoId&&i.player.loadVideoById(i.videoId)}function g(a){a.data==YT.PlayerState.PLAYING?i.state="playing":a.data==YT.PlayerState.PAUSED?i.state="paused":a.data==YT.PlayerState.ENDED&&(i.state="ended",d.info(h.upcoming),h.launchPlayer(1)),b.$apply()}var h=this,i={ready:!1,player:null,playerId:null,videoId:null,videoTitle:null,playerHeight:"360",playerWidth:"600",state:"stopped"};this.upcoming=e.get("upcoming"),this.history=e.get("history"),this.upcoming?this.upcoming.length>0&&(i.videoId=this.upcoming[0].id,i.videoTitle=this.upcoming[0].title):(this.upcoming=[],e.add("upcoming",this.upcoming)),this.history||(this.history=[],e.add("history",this.history)),c.onYouTubeIframeAPIReady=function(){d.info("Youtube API is ready"),i.ready=!0,h.bindPlayer("placeholder"),h.loadPlayer(),b.$apply()},this.bindPlayer=function(a){d.info("Binding to "+a),i.playerId=a},this.createPlayer=function(){return d.info("Creating a new Youtube player for DOM id "+i.playerId+" and video "+i.videoId),new YT.Player(i.playerId,{height:i.playerHeight,width:i.playerWidth,playerVars:{rel:0,showinfo:1},events:{onReady:f,onStateChange:g}})},this.loadPlayer=function(){i.ready&&i.playerId&&(i.player&&i.player.destroy(),i.player=h.createPlayer())},this.launchPlayer=function(a){var b=this.upcoming[a];return i.player.loadVideoById(b.id),i.videoId=b.id,i.videoTitle=b.title,h.archiveVideo(this.upcoming[0]),h.upcoming[0]=h.upcoming[a],a>0&&h.deleteUpcomingVideo(a),i},this.search=function(b){return a.get("http://gdata.youtube.com/feeds/api/videos",{params:{type:"video",v:"2",alt:"jsonc","max-results":"8",q:b}})},this.relate=function(b){var c="http://gdata.youtube.com/feeds/api/videos/"+b+"/related",d={v:2,alt:"jsonc","max-results":8};return a.get(c,{params:d})},this.suggest=function(b){var c="http://suggestqueries.google.com/complete/search",d={ds:"yt",client:"youtube",hjson:"t",q:b,callback:"JSON_CALLBACK"};return a.jsonp(c,{params:d})},this.getUpcoming=function(){return e.get("upcoming")},this.getHistory=function(){return e.get("history")},this.queueVideo=function(a){return this.upcoming.push(a),e.add("upcoming",this.upcoming),1===this.upcoming.length&&"playing"!==i.state&&this.launchPlayer(0),this.upcoming},this.archiveVideo=function(a){return this.history.unshift(a),e.add("history",this.history),this.history};var j=function(a,b){return function(c){b.splice(c,1),e.add(a,b)}};this.deleteUpcomingVideo=j("upcoming",this.upcoming),this.deleteHistoryVideo=j("history",this.history),this.indexOf=function(a,b){for(var c=a.length-1;c>=0;c--)if(a[c].id===b.id)return c;return-1}}]),angular.module("jukeboxApp").filter("time",function(){return function(a){var b="";b=a%60,a=Math.round(a/60);do b=a%60+":"+b,a=Math.round(a/60);while(a>0);return b}});