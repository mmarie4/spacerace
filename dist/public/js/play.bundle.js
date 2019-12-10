!function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(e,n,t){"use strict";t.r(n);var o={localToGlobal:function(e){let n=window.innerWidth/2,t=window.innerHeight/2,o=e.position.clone();return o.project(camera),o.x=o.x*n+n,o.y=-o.y*t+t,o},onClickCode:function(){window.open("https://github.com/mmarie4/spacerace","_blank").focus()},onClickPause:function(){scene.pause=!scene.pause,scene.pause?document.getElementById("pause-img").setAttribute("src","res/play-icon.png"):document.getElementById("pause-img").setAttribute("src","res/pause-icon.png")},loadModel:function(e,n,t,o){new THREE.GLTFLoader(e).load(o,(function(e){n.models[t]=e.scene}),(function(e){}),(function(e){console.log(e)}))},loadTexture:function(e,n,t,o){new THREE.TextureLoader(e).load(o,(function(e){console.log("loaded:",e),n.textures[t]=e}),(function(e){}),(function(e){console.log(e)}))},onClickLeaderboard:function(){if(leaderboardDisplayed)document.getElementById("leaderboard-section").setAttribute("style","display: none"),leaderboardDisplayed=!1;else{let e=new XMLHttpRequest;e.open("GET","/leaderboard",!0),e.onreadystatechange=function(){if(this.readyState===XMLHttpRequest.DONE&&200===this.status){let n=JSON.parse(e.responseText);for(let e=0;e<n.length;e++)document.getElementById("player"+parseInt(e+1)).innerHTML=n[e].name,document.getElementById("score"+parseInt(e+1)).innerHTML=n[e].score;document.getElementById("leaderboard-section").setAttribute("style","display: inline-block"),leaderboardDisplayed=!0}},score={name:document.getElementById("player-text").getAttribute("value"),score:document.getElementById("time").innerHTML},e.send()}},onClickCross:function(){document.getElementById("leaderboard-section").setAttribute("style","display: none"),leaderboardDisplayed=!1}};console.log(o),console.log("sr_utils:",o);let r=new Date;const a=document.getElementsByClassName("selector");let s=new THREE.LoadingManager;document.getElementById("loading");s.onProgress=function(e,n,t){console.log("Loading",e,":",n/t*100+"%")},s.onLoad=function(){console.log("Loading complete !"),document.getElementById("loading").style.display="none",c(),d(l[0],i[0])};const i=[],l=[];for(let e=0;e<3;e++)i[e]=new THREE.WebGLRenderer,l[e]=new THREE.Scene,l[e].pause=!0,l[e].models={},o.loadModel(s,l[e],"ship","res/joined-spaceship.glb"),i[e].setSize(300,300),a[e].appendChild(i[e].domElement);const c=function(){for(let e=0;e<3;e++){console.log("Initializing scene",e);let n=l[e].models.ship.clone();n.position.y=-3,n.position.z=-15,n.rotation.z=Math.PI/-32,n.move=function(){console.log("Moving ship",e),n.rotation.y+=Math.PI/180},l[e].add(n),l[e].ship=n;const t=new THREE.PerspectiveCamera(75,1,.1,1e3);l[e].add(t),l[e].camera=t;const o=new THREE.PointLight(16773828,2,0,2);o.position.set(10,10,-10),l[e].add(o);const r=new THREE.PointLight(16773828,1,0,2);r.position.set(2,-5,-5),l[e].add(r),document.getElementsByTagName("canvas")[e].addEventListener("mouseover",()=>l[e].pause=!1),document.getElementsByTagName("canvas")[e].addEventListener("mouseleave",()=>l[e].pause=!0)}},d=function(){Math.abs(new Date-r)>sr_constants.UPDATE_FREQ&&(l[0].pause||(console.log(l[0]),l[0].ship.move()),r=new Date),i[0].render(l[0],l[0].camera),requestAnimationFrame(d)}}]);