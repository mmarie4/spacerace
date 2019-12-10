!function(e){var t={};function s(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,s),i.l=!0,i.exports}s.m=e,s.c=t,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)s.d(n,i,function(t){return e[t]}.bind(null,i));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=0)}([function(e,t,s){"use strict";s.r(t);var n={SHIPIDLIST:["1","2","3"],SERVER_ADDRESS:"51.38.68.118:8080",UPDATE_FREQ:20,ENEMIES_SPEED_Z:15,ENEMIES_KPX:.2,ENEMIES_KPY:.1,BORDER_ENEMIES:30,SPACESHIP_SPEEDX:10,SPACESHIP_SPEEDY:8,BOOST:20,DECAY_BOOST:2,BOOST_COOLDOWN_MS:3e3,SPAWN_SPEED:50,SPAWN_Z:-500,SPAWN_LIMIT_FAR:2e3,SPAWN_LIMIT_NEAR:400,SPAWN_PADDING:10,SPAWN_FREQ:.03,MAX_NB_SPAWNS:350,NEWSPAWN_FREQ_FAR:4,NEWSPAWN_FREQ_NEAR:6,AIM_ENEMY_Y:5,LIMIT_AIM:0,ANTICIPATE:30};var i={create:function(e,t,s,i,o){new THREE.BoxGeometry(5,5,5),new THREE.MeshStandardMaterial({color:new THREE.Color(16719104)});const a=o.models.enemy.clone();return a.position.set(e,t,s),a.zSpeed=i,a.Kpy=n.ENEMIES_KPY*Math.random(),a.Kpx=n.ENEMIES_KPX*Math.random(),a.hitbox=new THREE.Box3(new THREE.Vector3,new THREE.Vector3),a.anticipate=n.ANTICIPATE*Math.random(),a.move=function(e){this.position.z+=this.zSpeed;let t=0;t=e.upPressed?t+this.anticipate:t,t=e.downPressed?t+-1*this.anticipate:t;let s=(e.position.y+n.AIM_ENEMY_Y+t-this.position.y)*this.Kpy,i=0;i=e.rightPressed?i+this.anticipate:i,i=e.leftPressed?i+-1*this.anticipate:i;let o=(e.position.x+i-this.position.x)*this.Kpx;e.position.x,this.position.x,this.Kpx;this.position.y+=s,this.position.x+=o,this.hitbox.setFromObject(this)},a}};var o={create:function(e,t,s,o){return{scene:e,speed:n.SPAWN_SPEED*Math.random()-.5,enemies:[],position:{x:t,y:s,z:o},pop:function(){let t=i.create(this.position.x,this.position.y,this.position.z,n.ENEMIES_SPEED_Z,e);this.enemies.push(t),this.scene.add(t)},update:function(e,t){this.position.x+=this.speed,this.position.y+=this.speed,this.position.z=e.ship.position.z+n.SPAWN_Z,this.enemies.forEach(t=>{t.position.z>n.BORDER_ENEMIES?e.remove(t):t.move(e.ship)})},clear:function(e,t){this.enemies.forEach(e=>t.push(e))}}}};var a={init:function(e,t,s,i,o){const a=e.models.ship.clone();a.position.y=t,a.position.z=s,a.rotation.y=Math.PI/2,a.xSpeed=i,a.ySpeed=o,a.zSpeed=0,a.accel=0,a.lastBoost=new Date,a.hitbox=new THREE.Box3(new THREE.Vector3,new THREE.Vector3),a.move=function(){this.hitbox.set(this.position,this.position),this.upPressed&&(this.position.y+=this.ySpeed+this.accel,this.light.position.y+=this.ySpeed+this.accel),this.downPressed&&(this.position.y-=this.ySpeed+this.accel,this.light.position.y-=this.ySpeed+this.accel),this.rightPressed&&(this.position.x+=this.xSpeed+this.accel,this.light.position.x+=this.xSpeed+this.accel),this.leftPressed&&(this.position.x-=this.xSpeed+this.accel,this.light.position.x-=this.xSpeed+this.accel),this.position.z-=this.accel,this.accel>0?this.accel-=n.DECAY_BOOST:this.accel=0,0==this.accel&&(this.reactor1.scale.set(5,5,5),this.reactor2.scale.set(5,5,5),this.reactor3.scale.set(5,5,5)),a.reactor1.position.set(a.position.x-.1,a.position.y+3.78,a.position.z+10),a.reactor2.position.set(a.position.x-.65,a.position.y+3.35,a.position.z+10),a.reactor3.position.set(a.position.x+.45,a.position.y+3.35,a.position.z+10),this.hitbox.setFromObject(this)},a.checkCollisions=function(e,t){e.forEach(e=>{e.hitbox.intersectsBox(this.hitbox)&&t.end()})},a.boost=function(){Math.abs(new Date-this.lastBoost)>n.BOOST_COOLDOWN_MS&&(this.lastBoost=new Date,this.accel=n.BOOST,document.getElementById("boost-text").setAttribute("style","opacity: 0.2"),this.reactor1.scale.set(8,8,8),this.reactor2.scale.set(8,8,8),this.reactor3.scale.set(8,8,8))},a.checkBoost=function(){Math.abs(new Date-this.lastBoost)>n.BOOST_COOLDOWN_MS&&document.getElementById("boost-text").setAttribute("style","opacity: 1.0")},a.kill=function(e){e.remove(this),e.remove(this.reactor1),e.remove(this.reactor2),e.remove(this.reactor3),e.remove(this.light)},a.light=new THREE.PointLight(16777215,.5,0,2),a.light.position.set=(a.position.x,a.position.y,a.position.z),(new THREE.TextureLoader).load("res/reactor.png",(function(t){let s=new THREE.SpriteMaterial({map:t,color:16777215});a.reactor1=new THREE.Sprite(s),a.reactor2=new THREE.Sprite(s),a.reactor3=new THREE.Sprite(s),a.reactor1.scale.set(5,5,5),a.reactor2.scale.set(5,5,5),a.reactor3.scale.set(5,5,5),e.add(a.reactor1),e.add(a.reactor2),e.add(a.reactor3)})),e.add(a.light),e.ship=a,e.add(e.ship)}};var r={onDocumentKeyDown:function(e,t){const s=e.which;38==s?t.scene.ship.upPressed=!0:40==s?t.scene.ship.downPressed=!0:39==s?t.scene.ship.rightPressed=!0:37==s?t.scene.ship.leftPressed=!0:32==s&&t.scene.ship.boost()},onDocumentKeyUp:function(e,t){e.preventDefault();const s=e.which;38==s?(e.preventDefault(),t.scene.ship.upPressed=!1):40==s?(e.preventDefault(),t.scene.ship.downPressed=!1):39==s?(e.preventDefault(),t.scene.ship.rightPressed=!1):37==s&&(e.preventDefault(),t.scene.ship.leftPressed=!1)}};var c={setScene:function(e){this.scene=e},setRenderer:function(e){this.renderer=e},animate:function(){if(Math.abs(new Date-this.scene.lastUpdate)>n.UPDATE_FREQ){if(!this.scene.gameOver&&!this.scene.pause){for(let e=0;e<this.scene.spawns.length;e++)Math.abs(this.scene.spawns[e].position.x-this.scene.ship.position.x)>n.SPAWN_LIMIT_FAR||Math.abs(this.scene.spawns[e].position.y-this.scene.ship.position.y)>n.SPAWN_LIMIT_FAR?(this.scene.spawns[e].clear(this.scene,this.scene.orphans),this.scene.spawns.splice(e,1)):(Math.random()<n.SPAWN_FREQ&&this.scene.spawns[e].pop()&&this.scene.spawns[e].update(this.scene,this.scene.camera),this.scene.spawns[e].update(this.scene,this.scene.camera));let e=Math.random();e<n.NEWSPAWN_FREQ_NEAR&&this.scene.spawns.length<n.MAX_NB_SPAWNS&&(e<n.NEWSPAWN_FREQ_FAR?this.scene.spawns.push(o.create(this.scene,this.scene.ship.position.x+n.SPAWN_LIMIT_FAR*(Math.random()-.5),this.scene.ship.position.y+n.SPAWN_LIMIT_FAR*(Math.random()-.5),n.SPAWN_Z)):this.scene.spawns.push(o.create(this.scene,this.scene.ship.position.x+n.SPAWN_LIMIT_NEAR*(Math.random()-.5),this.scene.ship.position.y+n.SPAWN_LIMIT_NEAR*(Math.random()-.5),n.SPAWN_Z)));for(let e=0;e<this.scene.orphans.length;e++)this.scene.orphans[e].position.z>=this.scene.camera.position.z?(this.scene.remove(this.scene.orphans[e]),this.scene.orphans.splice(e,1)):this.scene.orphans[e].move(this.scene.ship);this.scene.ship.move(),this.scene.camera.update(this.scene.ship),this.scene.spawns.forEach(e=>this.scene.ship.checkCollisions(e.enemies,this.scene)),this.scene.ship.checkBoost(),document.getElementById("time").innerHTML=Math.abs(new Date-this.scene.timestart)/1e3+" s"}this.scene.lastUpdate=new Date}this.renderer.render(this.scene,this.scene.camera),requestAnimationFrame(this.animate.bind(this))},play:function(){document.getElementById("start-text").setAttribute("style","display: none"),document.getElementById("play-text").setAttribute("style","display: none"),document.getElementById("render").style.visibility="",this.scene.pause=!1,this.scene.timestart=new Date},restart:function(){this.scene.ship.position.set(0,-20,10),document.getElementById("gameover-text").setAttribute("style","display: none"),document.getElementById("restart-text").setAttribute("style","display: none"),this.scene.gameOver=!1,this.scene.pause=!1,this.scene.timestart=new Date,this.scene.add(this.scene.ship)},init:function(){this.scene.background=new THREE.Color(1835),this.scene.gameOver=!1,this.scene.pause=!0;const e=new THREE.PointLight(16773828,2,0,2);e.position.set(1e3,3500,0),this.scene.add(e);const t=new THREE.PointLight(12898047,1.5,0,0);t.position.set(-5e3,-1e3,-900),this.scene.add(t);const s=new THREE.PointLight(16048895,2,0,0);s.position.set(-10,-10,0),this.scene.add(s),this.renderer.setSize(window.innerWidth,window.innerHeight-100),a.init(this.scene,-20,10,n.SPACESHIP_SPEEDX,n.SPACESHIP_SPEEDY),this.scene.camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3),this.scene.camera.position.z=25,this.scene.camera.rotation.x=-.2,this.scene.camera.update=function(e){this.position.x=e.position.x,this.position.y=e.position.y+5,this.position.z=e.position.z+15},this.scene.end=function(){this.gameOver=!0,this.remove(this.ship.reactor1),this.remove(this.ship.reactor2),this.remove(this.ship.reactor3),this.remove(this.ship),this.spawns.forEach(e=>e.clear(this,this.orphans)),this.orphans.forEach(e=>{this.remove(e)}),this.orphans=[],this.spawns=[],a.init(this,-20,10,n.SPACESHIP_SPEEDX,n.SPACESHIP_SPEEDY,this.manager),this.ship.kill(this),document.getElementById("gameover-text").setAttribute("style","visibility: visible"),document.getElementById("restart-text").setAttribute("style","display: inline");let e=new XMLHttpRequest;if(e.open("POST","/new-score",!0),e.setRequestHeader("Content-Type","application/json"),e.onreadystatechange=function(){this.readyState===XMLHttpRequest.DONE&&this.status},!document.getElementById("player-text").value.includes("<")&&!document.getElementById("player-text").value.includes(">")){const t={name:document.getElementById("player-text").value,score:document.getElementById("time").innerHTML};e.send(JSON.stringify(t))}},document.getElementById("render").appendChild(this.renderer.domElement),/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)?alert("No mobile version yet."):(document.addEventListener("keydown",e=>{r.onDocumentKeyDown(e,this)}),document.addEventListener("keyup",e=>{r.onDocumentKeyUp(e,this)}))}};var h={localToGlobal:function(e){let t=window.innerWidth/2,s=window.innerHeight/2,n=e.position.clone();return n.project(camera),n.x=n.x*t+t,n.y=-n.y*s+s,n},onClickCode:function(){window.open("https://github.com/mmarie4/spacerace","_blank").focus()},onClickPause:function(e){e.pause=!e.pause,e.pause?document.getElementById("pause-img").setAttribute("src","res/play-icon.png"):document.getElementById("pause-img").setAttribute("src","res/pause-icon.png")},loadModel:function(e,t,s,n){new THREE.GLTFLoader(e).load(n,(function(e){t.models[s]=e.scene}),(function(e){}),(function(e){console.log(e)}))},loadTexture:function(e,t,s,n){new THREE.TextureLoader(e).load(n,(function(e){console.log("loaded:",e),t.textures[s]=e}),(function(e){}),(function(e){console.log(e)}))},onClickLeaderboard:function(e){if(e)document.getElementById("leaderboard-section").setAttribute("style","display: none"),e=!1;else{let t=new XMLHttpRequest;t.open("GET","/leaderboard",!0),t.onreadystatechange=function(){if(this.readyState===XMLHttpRequest.DONE&&200===this.status){let s=JSON.parse(t.responseText);for(let e=0;e<s.length;e++)document.getElementById("player"+parseInt(e+1)).innerHTML=s[e].name,document.getElementById("score"+parseInt(e+1)).innerHTML=s[e].score;document.getElementById("leaderboard-section").setAttribute("style","display: inline-block"),e=!0}},t.send()}},onClickCross:function(){document.getElementById("leaderboard-section").setAttribute("style","display: none"),leaderboardDisplayed=!1}};const d=new THREE.Scene;d.spawns=[],d.orphans=[],d.lastUpdate=new Date,d.models={},d.textures={};const p=new URLSearchParams(window.location.search);d.leaderboardDisplayed=!1,c.setScene(d),c.setRenderer(new THREE.WebGLRenderer);var l="Player"+parseInt(1e4*Math.random());document.getElementById("player-text").setAttribute("value",l),document.getElementById("player-text").addEventListener("keyup",(function(e){13==e.which&&""!=this.value&&this.blur()}));const u=n.SHIPIDLIST.includes(p.get("ship"))?p.get("ship"):"1";d.manager=new THREE.LoadingManager;document.getElementById("loading");d.manager.onProgress=function(e,t,s){console.log("Loading",e,":",t/s*100+"%")},d.manager.onLoad=function(){console.log("Loading complete !"),document.getElementById("floating-items").style.display="",document.getElementById("loading").style.display="none",c.init(),c.animate()},h.loadModel(d.manager,d,"enemy","res/joined-enemy.glb"),h.loadModel(d.manager,d,"ship","res/joined-spaceship"+u+".glb"),h.loadModel(d.manager,d,"floor","res/floor.glb"),h.loadTexture(d.manager,d,"metal","res/metal1.png"),document.getElementById("play-text").addEventListener("click",e=>c.play()),document.getElementById("restart-text").addEventListener("click",e=>c.restart()),document.getElementById("code-icon").addEventListener("click",e=>h.onClickCode()),document.getElementById("leaderboard-img").addEventListener("click",e=>h.onClickLeaderboard(c.scene.leaderboardDisplayed)),document.getElementById("pause-img").addEventListener("click",e=>h.onClickPause(c.scene)),document.getElementById("cross").addEventListener("click",e=>h.onClickCross())}]);