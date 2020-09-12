!function(e){var n={};function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var i in e)t.d(o,i,function(n){return e[n]}.bind(null,i));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(e,n,t){"use strict";t.r(n);var o={localToGlobal:function(e){let n=window.innerWidth/2,t=window.innerHeight/2,o=e.position.clone();return o.project(camera),o.x=o.x*n+n,o.y=-o.y*t+t,o},onClickCode:function(){window.open("https://github.com/mmarie4/spacerace","_blank").focus()},onClickPause:function(e){e.pause=!e.pause,e.pause?document.getElementById("pause-img").setAttribute("src","res/play-icon.png"):document.getElementById("pause-img").setAttribute("src","res/pause-icon.png")},loadModel:function(e,n,t,o){new THREE.GLTFLoader(e).load(o,(function(e){n.models[t]=e.scene}),(function(e){}),(function(e){console.log(e)}))},loadTexture:function(e,n,t,o){new THREE.TextureLoader(e).load(o,(function(e){console.log("loaded:",e),n.textures[t]=e}),(function(e){}),(function(e){console.log(e)}))},onClickLeaderboard:function(e){if(e)document.getElementById("leaderboard-section").setAttribute("style","display: none"),e=!1;else{let n=new XMLHttpRequest;n.open("GET","/leaderboard",!0),n.onreadystatechange=function(){if(this.readyState===XMLHttpRequest.DONE&&200===this.status){let t=JSON.parse(n.responseText);for(let e=0;e<t.length;e++)document.getElementById("player"+parseInt(e+1)).innerHTML=t[e].name,document.getElementById("score"+parseInt(e+1)).innerHTML=t[e].score;document.getElementById("leaderboard-section").setAttribute("style","display: inline-block"),e=!0}},n.send()}},onClickCross:function(){document.getElementById("leaderboard-section").setAttribute("style","display: none"),leaderboardDisplayed=!1}};var i={SHIPIDLIST:["1","2","3"],SERVER_ADDRESS:"51.38.68.118:8080",UPDATE_FREQ:20,ENEMIES_SPEED_Z:15,ENEMIES_KPX:.2,ENEMIES_KPY:.1,BORDER_ENEMIES:30,SPACESHIP_SPEEDX:10,SPACESHIP_SPEEDY:8,BOOST:20,DECAY_BOOST:2,BOOST_COOLDOWN_MS:3e3,SPAWN_SPEED:50,SPAWN_Z:-500,SPAWN_LIMIT_FAR:2e3,SPAWN_LIMIT_NEAR:400,SPAWN_PADDING:10,SPAWN_FREQ:.03,MAX_NB_SPAWNS:350,NEWSPAWN_FREQ_FAR:4,NEWSPAWN_FREQ_NEAR:6,AIM_ENEMY_Y:5,LIMIT_AIM:0,ANTICIPATE:30};console.log(o),console.log("sr_utils:",o);let r=new Date;const s=document.getElementsByClassName("selector");let a=new THREE.LoadingManager;document.getElementById("loading");a.onProgress=function(e,n,t){console.log("Loading",e,":",n/t*100+"%")},a.onLoad=function(){console.log("Loading complete !"),document.getElementById("loading").style.display="none",d(),u(c[0],l[0])};const l=[],c=[];for(let e=0;e<3;e++)l[e]=new THREE.WebGLRenderer,c[e]=new THREE.Scene,c[e].pause=!0,c[e].models={},o.loadModel(a,c[e],"ship","res/joined-spaceship"+parseInt(e+1)+".glb"),l[e].setSize(300,300),s[e].appendChild(l[e].domElement);const d=function(){for(let e=0;e<3;e++){console.log("Initializing scene",e);let n=c[e].models.ship.clone();n.position.y=-3,n.position.z=-15,n.rotation.z=Math.PI/-32,n.move=function(){console.log("Moving ship",e),n.rotation.y+=Math.PI/180},c[e].add(n),c[e].ship=n;const t=new THREE.PerspectiveCamera(75,1,.1,1e3);c[e].add(t),c[e].camera=t;const o=new THREE.PointLight(16773828,2,0,2);o.position.set(10,10,-10),c[e].add(o);const i=new THREE.PointLight(16773828,1,0,2);i.position.set(2,-5,-5),c[e].add(i),document.getElementsByTagName("canvas")[e].addEventListener("mouseover",()=>c[e].pause=!1),document.getElementsByTagName("canvas")[e].addEventListener("mouseleave",()=>c[e].pause=!0)}},u=function(){Math.abs(new Date-r)>i.UPDATE_FREQ&&(c[0].pause||(console.log(c[0]),c[0].ship.move()),r=new Date),l[0].render(c[0],c[0].camera),requestAnimationFrame(u)}}]);