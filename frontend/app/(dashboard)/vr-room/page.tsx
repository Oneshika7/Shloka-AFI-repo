"use client";

import dynamic from "next/dynamic";

function VRRoomPage() {
  return (
    <div className="w-full h-screen">
      <iframe
        className="w-full h-full border-0"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        srcDoc={`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>VR Pathshala</title>
<script src="https://aframe.io/releases/1.5.0/aframe.min.js"><\/script>
<script>
window.THREE = window.THREE || (window.AFRAME && window.AFRAME.THREE);

AFRAME.registerComponent('fly-in', {
  init: function () {
    var self = this;
    self.flying = false;
    self.startTime = null;
    self.duration = 6000;
    self.waypoints = [
      {t:0,    x:0, y:16,  z:62,  rx:-14},
      {t:0.25, x:0, y:10,  z:44,  rx:-8},
      {t:0.50, x:0, y:4.5, z:26,  rx:-3},
      {t:0.72, x:0, y:2.5, z:15,  rx:-1},
      {t:0.88, x:0, y:1.9, z:10,  rx:-0.3},
      {t:1,    x:0, y:1.65,z:7,   rx:0}
    ];
    self.el.sceneEl.addEventListener('loaded', function () {
      self.el.setAttribute('position', {x:0, y:16, z:62});
      self.flying = true;
      self.startTime = null;
    });
  },
  tick: function (time) {
    if (!this.flying) return;
    if (!this.startTime) this.startTime = time;
    var progress = Math.min((time - this.startTime) / this.duration, 1);
    var ep = this.ease(progress);
    var wps = this.waypoints;
    var w0 = wps[0], w1 = wps[wps.length-1];
    for (var i = 0; i < wps.length-1; i++) {
      if (ep >= wps[i].t && ep <= wps[i+1].t) { w0 = wps[i]; w1 = wps[i+1]; break; }
    }
    var seg = w1.t === w0.t ? 1 : (ep - w0.t) / (w1.t - w0.t);
    this.el.setAttribute('position', {
      x: this.lerp(w0.x, w1.x, seg),
      y: this.lerp(w0.y, w1.y, seg),
      z: this.lerp(w0.z, w1.z, seg)
    });
    var cam = this.el.querySelector('[camera]');
    if (cam) cam.setAttribute('rotation', {x: this.lerp(w0.rx, w1.rx, seg), y:0, z:0});
    if (progress >= 1) {
      this.finish();
    }
  },
  finish: function() {
    this.flying = false;
    this.el.setAttribute('position', {x:0, y:1.65, z:7});
    var cam = this.el.querySelector('[camera]');
    if (cam) cam.setAttribute('rotation', {x:0, y:0, z:0});
    var ch = document.getElementById('crosshair'); if(ch) ch.classList.add('show');
    var hud = document.getElementById('hud'); if(hud) hud.classList.add('show');
    var vig = document.getElementById('vignette'); if(vig) vig.classList.add('clear');
    var qn = document.getElementById('quick-nav'); if(qn) qn.classList.add('show');
    var btn = document.getElementById('btn-skip'); if(btn) btn.style.display = 'none';
    window._introPlaying = false;
  },
  lerp: function(a,b,t){return a+(b-a)*t;},
  ease: function(t){return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
});
<\/script>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:100%;height:100%;overflow:hidden;background:#0d0500;font-family:Georgia,serif;}

#btn-skip {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(25, 12, 2, 0.85);
  border: 1px solid #d4af37;
  color: #FFD700;
  padding: 8px 18px;
  border-radius: 20px;
  font-family: inherit;
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  z-index: 10000;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.6);
}
#btn-skip:hover {
  background: #d4af37;
  color: #1a0800;
  box-shadow: 0 0 20px rgba(212,175,55,0.6);
}

#quick-nav {
  position: fixed;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(18, 8, 1, 0.92);
  border: 1px solid rgba(212, 175, 55, 0.45);
  padding: 6px 14px;
  border-radius: 26px;
  z-index: 450;
  backdrop-filter: blur(10px);
  max-width: 96vw;
  overflow-x: auto;
  box-shadow: 0 8px 32px rgba(0,0,0,0.8);
  opacity: 0;
  transition: opacity 1s;
}
#quick-nav.show {
  opacity: 1;
}
.qn-lbl {
  color: #c8860a;
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  white-space: nowrap;
  margin-right: 4px;
}
.qn-btn {
  background: rgba(45, 20, 2, 0.85);
  border: 1px solid rgba(212, 175, 55, 0.35);
  color: #FFD700;
  padding: 5px 12px;
  border-radius: 14px;
  font-family: inherit;
  font-size: 11px;
  letter-spacing: 0.5px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.qn-btn:hover {
  background: #d4af37;
  color: #1a0800;
  border-color: #FFD700;
  transform: translateY(-1px);
}

#near-hint{position:fixed;top:50%;left:50%;transform:translate(-50%,60px);background:rgba(212,175,55,.2);border:1px solid #d4af37;color:#FFD700;font-size:13px;letter-spacing:2px;padding:10px 24px;border-radius:30px;z-index:300;display:none;text-align:center;cursor:pointer;pointer-events:auto;box-shadow:0 0 20px rgba(212,175,55,0.4);transition:all .2s;}
#near-hint:hover{background:#d4af37;color:#1a0800;}
#near-hint.show{display:block;}

#loading{position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse at center,#1a0800,#000);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:99999;transition:opacity 1.2s;}
#loading.out{opacity:0;pointer-events:none;}
.l-om{font-size:72px;color:#FFD700;animation:lp 1.6s infinite;margin-bottom:16px;}
.l-title{color:#FFD700;font-size:24px;letter-spacing:6px;text-transform:uppercase;margin-bottom:8px;}
.l-sub{color:#c8860a;font-size:13px;letter-spacing:3px;margin-bottom:28px;}
.l-bar{width:200px;height:3px;background:#2a1500;border-radius:2px;overflow:hidden;}
.l-fill{height:100%;background:linear-gradient(90deg,#FFD700,#ff8c00);animation:lf 2.8s ease forwards;}
@keyframes lp{0%,100%{opacity:.5;transform:scale(1);}50%{opacity:1;transform:scale(1.1);}}
@keyframes lf{0%{width:0}100%{width:100%}}

#cin-overlay{position:fixed;top:0;left:0;width:100%;height:100%;z-index:600;pointer-events:none;}
#cin-top{position:absolute;top:0;left:0;width:100%;background:#000;height:70px;transition:height 1.8s cubic-bezier(.77,0,.18,1);}
#cin-bot{position:absolute;bottom:0;left:0;width:100%;background:#000;height:70px;transition:height 1.8s cubic-bezier(.77,0,.18,1);}
#cin-overlay.bars-open #cin-top,#cin-overlay.bars-open #cin-bot{height:0;}
#cin-title{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#FFD700;font-size:22px;letter-spacing:10px;text-transform:uppercase;text-align:center;text-shadow:0 0 40px rgba(255,215,0,1);opacity:0;transition:opacity 0.8s;white-space:nowrap;}
#cin-title.show{opacity:1;}
#cin-sub{position:absolute;top:calc(50% + 36px);left:50%;transform:translateX(-50%);color:#c8860a;font-size:12px;letter-spacing:4px;text-transform:uppercase;opacity:0;transition:opacity 0.8s 0.3s;white-space:nowrap;}
#cin-sub.show{opacity:1;}

#fade{position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:550;opacity:1;pointer-events:none;transition:opacity 2s;}
#fade.clear{opacity:0;}

#vignette{position:fixed;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,0.9) 100%);z-index:490;pointer-events:none;opacity:1;transition:opacity 3s 1s;}
#vignette.clear{opacity:0.25;}

#book-panel{display:flex;opacity:0;visibility:hidden;transform:scale(.7);transition:opacity .5s ease,transform .5s ease;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(4,1,0,0.96);backdrop-filter:blur(14px);z-index:8000;overflow:hidden;flex-direction:column;align-items:center;justify-content:center;}
#book-panel.show{opacity:1;visibility:visible;transform:scale(1);}
.book-wrap{position:relative;width:700px;max-width:96vw;height:88vh;display:flex;flex-direction:column;animation:holyBookOpen .8s ease;transform-origin:center;}
@keyframes holyBookOpen{0%{opacity:0;transform:rotateY(-90deg) scale(.6);}100%{opacity:1;transform:rotateY(0deg) scale(1);}}
.book-header{text-align:center;padding:16px 20px 10px;flex-shrink:0;}
.bp-om{font-size:28px;color:#FFD700;display:block;margin-bottom:6px;}
.bp-title{color:#FFD700;font-size:16px;letter-spacing:5px;text-transform:uppercase;margin-bottom:4px;}
.bp-src{color:#c8860a;font-size:10px;letter-spacing:2px;margin-bottom:0;}
.book-divider{height:1px;background:linear-gradient(90deg,transparent,#d4af37,transparent);margin:10px 24px;}

.page-stage{flex:1;position:relative;overflow:hidden;perspective:1200px;min-height:0;}
.page-card{position:absolute;inset:0;background:linear-gradient(160deg,#1e0c00,#2d1400,#1a0800);border:1px solid #5a3800;border-radius:16px;margin:8px 16px;padding:24px 32px;display:none;flex-direction:column;align-items:center;justify-content:flex-start;text-align:center;transform-origin:left center;overflow-y:auto;}
.page-card.active{display:flex;animation:flipIn 0.55s cubic-bezier(.25,.46,.45,.94) forwards;}
.page-card.exit{display:flex;animation:flipOut 0.45s cubic-bezier(.55,0,.1,1) forwards;}
@keyframes flipIn{0%{transform:perspective(1200px) rotateY(-90deg);opacity:0;}100%{transform:perspective(1200px) rotateY(0deg);opacity:1;}}
@keyframes flipOut{0%{transform:perspective(1200px) rotateY(0deg);opacity:1;}100%{transform:perspective(1200px) rotateY(90deg);opacity:0;}}
.pc-deco{color:#d4af37;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px;opacity:0.7;flex-shrink:0;}
.pc-skt{font-size:18px;color:#FFD700;line-height:1.8;margin-bottom:16px;text-shadow:0 0 24px rgba(255,215,0,.5);flex-shrink:0;}
.pc-divider{height:1px;width:60%;background:linear-gradient(90deg,transparent,#d4af37,transparent);margin:0 auto 14px;flex-shrink:0;}
.pc-lbl{color:#c8860a;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px;flex-shrink:0;}
.pc-meaning{color:#f5e6c8;font-size:15px;line-height:1.8;font-style:italic;max-width:520px;flex-shrink:0;}

.book-nav{display:flex;align-items:center;justify-content:space-between;padding:14px 24px 18px;flex-shrink:0;}
.nav-btn{background:none;border:1px solid #5a3800;color:#d4af37;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:10px 24px;border-radius:30px;cursor:pointer;transition:all .2s;}
.nav-btn:hover{background:#d4af37;color:#1a0800;}
.nav-btn:disabled{opacity:0.25;cursor:default;}
.page-counter{color:#c8860a;font-size:11px;letter-spacing:2px;}

#hud{position:fixed;bottom:64px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.85);border:1px solid #5a3800;color:#c8860a;font-size:11px;letter-spacing:1.5px;padding:6px 18px;border-radius:24px;z-index:300;pointer-events:none;white-space:nowrap;opacity:0;transition:opacity 1.5s;}
#hud.show{opacity:1;}
#crosshair{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:18px;height:18px;pointer-events:none;z-index:400;opacity:0;transition:opacity 1s;}
#crosshair.show{opacity:0.7;}
#crosshair span{position:absolute;background:#FFD700;}
#crosshair span:nth-child(1){top:8px;left:0;width:18px;height:2px;}
#crosshair span:nth-child(2){top:0;left:8px;width:2px;height:18px;}
</style>
</head>
<body>

<button id="btn-skip" onclick="skipIntro()">Skip Intro ⏭</button>

<div id="loading">
  <div class="l-om">ॐ</div>
  <div class="l-title">VR Pathshala</div>
  <div class="l-sub">Entering the Sacred Temple...</div>
  <div class="l-bar"><div class="l-fill"></div></div>
</div>

<div id="fade"></div>
<div id="vignette"></div>

<div id="cin-overlay">
  <div id="cin-top"></div>
  <div id="cin-bot"></div>
  <div id="cin-title">ॐ &nbsp; VR Pathshala &nbsp; ॐ</div>
  <div id="cin-sub">Enter the Sacred Temple of Knowledge</div>
</div>

<div id="crosshair"><span></span><span></span></div>
<div id="near-hint" onclick="openFacingBook()">✦ Click or Double-click to Open Scripture ✦</div>
<div id="hud">🖱 Drag to look · WASD to walk · Walk near a scripture or click below to read · Arrow Keys to turn pages</div>

<div id="quick-nav">
  <span class="qn-lbl">📜 Fast Scripture Access:</span>
  <button class="qn-btn" onclick="openBook(0)">Takrāriṣṭa</button>
  <button class="qn-btn" onclick="openBook(1)">Durālabhāriṣṭa</button>
  <button class="qn-btn" onclick="openBook(2)">Rohitakāsava</button>
  <button class="qn-btn" onclick="openBook(3)">Patrāṅgāsava</button>
  <button class="qn-btn" onclick="openBook(4)">Viḍaṅgāsava</button>
  <button class="qn-btn" onclick="openBook(5)">Piṇḍāsava</button>
  <button class="qn-btn" onclick="openBook(6)">Nālikerāsava</button>
  <button class="qn-btn" onclick="openBook(7)">Yogarājāsava</button>
</div>

<div id="book-panel">
  <div class="book-wrap">
    <div class="book-header">
      <span class="bp-om">ॐ</span>
      <div class="bp-title" id="bp-title">Scripture</div>
      <div class="bp-src" id="bp-src">Ancient Wisdom</div>
    </div>
    <div class="book-divider"></div>
    <div class="page-stage" id="page-stage"></div>
    <div class="book-nav">
      <button class="nav-btn" id="btn-prev" onclick="prevPage()">← Prev</button>
      <span class="page-counter" id="page-counter">1 / 1</span>
      <button class="nav-btn" id="btn-next" onclick="nextPage()">Next →</button>
    </div>
    <div style="text-align:center;padding-bottom:18px;">
      <button class="nav-btn" onclick="closeBook()">↩ Return to Temple</button>
    </div>
  </div>
</div>

<a-scene
  fog="type:exponential;color:#0d0500;density:0.018"
  renderer="antialias:true;colorManagement:true;"
  vr-mode-ui="enabled:false"
  loading-screen="enabled:false">

  <a-sky color="#060200"></a-sky>
  <a-light type="ambient" color="#3a1800" intensity="2"></a-light>
  <a-light type="point" color="#FFD700" intensity="5" position="0 9 0" distance="28" decay="1.5"></a-light>
  <a-light type="point" color="#ff8c00" intensity="3" position="0 4 0" distance="18" decay="2"></a-light>
  <a-light type="point" color="#FFD27A" intensity="2" position="-16 4 0" distance="12" decay="2"></a-light>
  <a-light type="point" color="#FFD27A" intensity="2" position="16 4 0" distance="12" decay="2"></a-light>
  <a-light type="point" color="#FFD27A" intensity="2" position="0 4 -16" distance="12" decay="2"></a-light>
  <a-light type="point" color="#FFD27A" intensity="2" position="0 4 16" distance="12" decay="2"></a-light>
  <a-light type="point" color="#ff7700" intensity="1.5" position="12 4 12" distance="10" decay="2"></a-light>
  <a-light type="point" color="#ff7700" intensity="1.5" position="-12 4 12" distance="10" decay="2"></a-light>
  <a-light type="point" color="#ff7700" intensity="1.5" position="12 4 -12" distance="10" decay="2"></a-light>
  <a-light type="point" color="#ff7700" intensity="1.5" position="-12 4 -12" distance="10" decay="2"></a-light>
  <a-light type="point" color="#FFD700" intensity="8" position="0 3.5 0" distance="7" decay="1"></a-light>

  <!-- FLOOR -->
  <a-cylinder position="0 0 0" radius="22" height="0.2" color="#7a5530" roughness="0.95"></a-cylinder>
  <a-cylinder position="0 0.01 0" radius="7" height="0.08" color="#b8904a" roughness="0.8"></a-cylinder>
  <a-cylinder position="0 0.02 0" radius="3.2" height="0.06" color="#d4af37" roughness="0.5" metalness="0.3"></a-cylinder>
  <a-torus position="0 0.04 0" radius="5" radius-tubular="0.05" rotation="90 0 0" color="#d4af37" metalness="0.5"></a-torus>
  <a-torus position="0 0.04 0" radius="9" radius-tubular="0.05" rotation="90 0 0" color="#b8904a" metalness="0.3"></a-torus>
  <a-torus position="0 0.04 0" radius="15" radius-tubular="0.04" rotation="90 0 0" color="#9a7040" metalness="0.2"></a-torus>

  <!-- WALL -->
  <a-cylinder position="0 5 0" radius="19.8" height="10.5" color="#4a2e14" roughness="0.95" open-ended="true" side="back"></a-cylinder>
  <a-torus position="0 10.2 0" radius="19.8" radius-tubular="0.35" color="#c8a46a"></a-torus>
  <a-torus position="0 0.2 0" radius="19.8" radius-tubular="0.35" color="#c8a46a"></a-torus>
  <a-torus position="0 5 0" radius="19.8" radius-tubular="0.18" color="#a07040"></a-torus>

  <!-- DOME -->
  <a-sphere position="0 10 0" radius="20" phi-start="0" phi-length="90" color="#2e1a08" roughness="0.95" side="back"></a-sphere>
  <a-sphere position="0 19.5 0" radius="2.8" color="#d4af37" roughness="0.3" metalness="0.7"></a-sphere>
  <a-torus position="0 10 0" radius="11" radius-tubular="0.28" rotation="90 0 0" color="#d4af37" metalness="0.5"></a-torus>
  <a-cylinder position="5 13 0" radius="0.035" height="7" color="#d4af37" metalness="0.9"></a-cylinder>
  <a-sphere position="5 9.5 0" radius="0.22" color="#FFD700" shader="flat"></a-sphere>
  <a-cylinder position="-5 13 0" radius="0.035" height="7" color="#d4af37" metalness="0.9"></a-cylinder>
  <a-sphere position="-5 9.5 0" radius="0.22" color="#FFD700" shader="flat"></a-sphere>
  <a-cylinder position="0 13 5" radius="0.035" height="7" color="#d4af37" metalness="0.9"></a-cylinder>
  <a-sphere position="0 9.5 5" radius="0.22" color="#FFD700" shader="flat"></a-sphere>
  <a-cylinder position="0 13 -5" radius="0.035" height="7" color="#d4af37" metalness="0.9"></a-cylinder>
  <a-sphere position="0 9.5 -5" radius="0.22" color="#FFD700" shader="flat"></a-sphere>

  <!-- PILLARS -->
  <a-cylinder position="5.36 4.5 -12.93" radius="0.62" height="9.5" color="#c8a46a" roughness="0.85"></a-cylinder>
  <a-cylinder position="5.36 0.4 -12.93" radius="0.9" height="0.9" color="#9a7040"></a-cylinder>
  <a-cylinder position="5.36 9.2 -12.93" radius="0.86" height="0.6" color="#d4af37" metalness="0.4"></a-cylinder>
  <a-cylinder position="12.93 4.5 -5.36" radius="0.62" height="9.5" color="#c8a46a" roughness="0.85"></a-cylinder>
  <a-cylinder position="12.93 0.4 -5.36" radius="0.9" height="0.9" color="#9a7040"></a-cylinder>
  <a-cylinder position="12.93 9.2 -5.36" radius="0.86" height="0.6" color="#d4af37" metalness="0.4"></a-cylinder>
  <a-cylinder position="12.93 4.5 5.36" radius="0.62" height="9.5" color="#c8a46a" roughness="0.85"></a-cylinder>
  <a-cylinder position="12.93 0.4 5.36" radius="0.9" height="0.9" color="#9a7040"></a-cylinder>
  <a-cylinder position="12.93 9.2 5.36" radius="0.86" height="0.6" color="#d4af37" metalness="0.4"></a-cylinder>
  <a-cylinder position="5.36 4.5 12.93" radius="0.62" height="9.5" color="#c8a46a" roughness="0.85"></a-cylinder>
  <a-cylinder position="5.36 0.4 12.93" radius="0.9" height="0.9" color="#9a7040"></a-cylinder>
  <a-cylinder position="5.36 9.2 12.93" radius="0.86" height="0.6" color="#d4af37" metalness="0.4"></a-cylinder>
  <a-cylinder position="-5.36 4.5 12.93" radius="0.62" height="9.5" color="#c8a46a" roughness="0.85"></a-cylinder>
  <a-cylinder position="-5.36 0.4 12.93" radius="0.9" height="0.9" color="#9a7040"></a-cylinder>
  <a-cylinder position="-5.36 9.2 12.93" radius="0.86" height="0.6" color="#d4af37" metalness="0.4"></a-cylinder>
  <a-cylinder position="-12.93 4.5 5.36" radius="0.62" height="9.5" color="#c8a46a" roughness="0.85"></a-cylinder>
  <a-cylinder position="-12.93 0.4 5.36" radius="0.9" height="0.9" color="#9a7040"></a-cylinder>
  <a-cylinder position="-12.93 9.2 5.36" radius="0.86" height="0.6" color="#d4af37" metalness="0.4"></a-cylinder>
  <a-cylinder position="-12.93 4.5 -5.36" radius="0.62" height="9.5" color="#c8a46a" roughness="0.85"></a-cylinder>
  <a-cylinder position="-12.93 0.4 -5.36" radius="0.9" height="0.9" color="#9a7040"></a-cylinder>
  <a-cylinder position="-12.93 9.2 -5.36" radius="0.86" height="0.6" color="#d4af37" metalness="0.4"></a-cylinder>
  <a-cylinder position="-5.36 4.5 -12.93" radius="0.62" height="9.5" color="#c8a46a" roughness="0.85"></a-cylinder>
  <a-cylinder position="-5.36 0.4 -12.93" radius="0.9" height="0.9" color="#9a7040"></a-cylinder>
  <a-cylinder position="-5.36 9.2 -12.93" radius="0.86" height="0.6" color="#d4af37" metalness="0.4"></a-cylinder>

  <!-- TREE -->
  <a-cylinder position="0 0.15 0" radius="2.4" height="0.28" color="#d4af37" roughness="0.3" metalness="0.7"></a-cylinder>
  <a-cylinder position="0 0.3 0" radius="1.9" height="0.15" color="#FFD700" roughness="0.2" metalness="0.8"></a-cylinder>
  <a-cylinder position="0 2.5 0" radius="0.5" height="5.2" color="#4a2800" roughness="0.95"></a-cylinder>
  <a-torus position="0 1.2 0" radius="0.53" radius-tubular="0.07" rotation="90 0 0" color="#d4af37" metalness="0.7"></a-torus>
  <a-torus position="0 3 0" radius="0.53" radius-tubular="0.07" rotation="90 0 0" color="#d4af37" metalness="0.7"></a-torus>
  <a-cylinder position="1.1 4.8 0" radius="0.16" height="2.6" rotation="0 0 -52" color="#5a3200"></a-cylinder>
  <a-cylinder position="-1.1 4.8 0" radius="0.16" height="2.6" rotation="0 0 52" color="#5a3200"></a-cylinder>
  <a-cylinder position="0 4.8 1.1" radius="0.16" height="2.6" rotation="-52 0 0" color="#5a3200"></a-cylinder>
  <a-cylinder position="0 4.8 -1.1" radius="0.16" height="2.6" rotation="52 0 0" color="#5a3200"></a-cylinder>
  <a-sphere position="2 6.2 0" radius="1.25" color="#1a4a00"></a-sphere>
  <a-sphere position="-2 6.2 0" radius="1.25" color="#1a4a00"></a-sphere>
  <a-sphere position="0 6.2 2" radius="1.25" color="#1a4a00"></a-sphere>
  <a-sphere position="0 6.2 -2" radius="1.25" color="#1a4a00"></a-sphere>
  <a-sphere position="1.4 6.8 1.4" radius="1.05" color="#1d5200"></a-sphere>
  <a-sphere position="-1.4 6.8 1.4" radius="1.05" color="#1d5200"></a-sphere>
  <a-sphere position="1.4 6.8 -1.4" radius="1.05" color="#1d5200"></a-sphere>
  <a-sphere position="-1.4 6.8 -1.4" radius="1.05" color="#1d5200"></a-sphere>
  <a-sphere position="0 7.8 0" radius="1.5" color="#205800"></a-sphere>
  <a-text value="ॐ" position="0 5.2 0.62" color="#FFD700" align="center" scale="3.5 3.5 3.5" shader="flat"></a-text>
  <a-text value="ॐ" position="0 5.2 -0.62" rotation="0 180 0" color="#FFD700" align="center" scale="3.5 3.5 3.5" shader="flat"></a-text>
  <a-sphere position="0 9 0" radius="0.4" color="#FFD700" shader="flat" opacity="0.7" animation="property:opacity;to:0.95;dur:1600;dir:alternate;loop:true"></a-sphere>

  <!-- TABLETS -->
  <a-box data-idx="0" class="tablet" position="0 3.8 -17.6" width="7" height="5.5" depth="0.3" color="#d4af37" metalness="0.6" opacity="0.01"></a-box>
  <a-box position="0 3.8 -17.6" width="7" height="5.5" depth="0.22" color="#d4af37" metalness="0.6"></a-box>
  <a-box position="0 3.8 -17.45" width="6.5" height="5.0" depth="0.1" color="#f5e6c8"></a-box>
  <a-text value="Takrarista" position="0 2.6 -17.25" color="#8B4513" align="center" scale="4.0 4.0 1" shader="flat"></a-text>

  <a-box data-idx="1" class="tablet" position="12.5 3.8 -12.5" rotation="0 -45 0" width="7" height="5.5" depth="0.3" color="#d4af37" opacity="0.01"></a-box>
  <a-box position="12.5 3.8 -12.5" rotation="0 -45 0" width="7" height="5.5" depth="0.22" color="#d4af37" metalness="0.6"></a-box>
  <a-box position="12.33 3.8 -12.33" rotation="0 -45 0" width="6.5" height="5.0" depth="0.1" color="#f5e6c8"></a-box>
  <a-text value="Duralabharista" position="12.18 2.8 -12.18" rotation="0 -45 0" color="#8B4513" align="center" scale="4.0 4.0 1" shader="flat"></a-text>

  <a-box data-idx="2" class="tablet" position="17.6 3.8 0" rotation="0 -90 0" width="7" height="5.5" depth="0.3" color="#d4af37" opacity="0.01"></a-box>
  <a-box position="17.6 3.8 0" rotation="0 -90 0" width="7" height="5.5" depth="0.22" color="#d4af37" metalness="0.6"></a-box>
  <a-box position="17.45 3.8 0" rotation="0 -90 0" width="6.5" height="5.0" depth="0.1" color="#f5e6c8"></a-box>
  <a-text value="Rohitakasava" position="17.25 2.8 0" rotation="0 -90 0" color="#8B4513" align="center" scale="4.0 4.0 1" shader="flat"></a-text>

  <a-box data-idx="3" class="tablet" position="12.5 3.8 12.5" rotation="0 -135 0" width="7" height="5.5" depth="0.3" color="#d4af37" opacity="0.01"></a-box>
  <a-box position="12.5 3.8 12.5" rotation="0 -135 0" width="7" height="5.5" depth="0.22" color="#d4af37" metalness="0.6"></a-box>
  <a-box position="12.33 3.8 12.33" rotation="0 -135 0" width="6.5" height="5.0" depth="0.1" color="#f5e6c8"></a-box>
  <a-text value="Patrangasava" position="12.18 2.8 12.18" rotation="0 -135 0" color="#8B4513" align="center" scale="4.0 4.0 1" shader="flat"></a-text>

  <a-box data-idx="4" class="tablet" position="0 3.8 17.6" rotation="0 180 0" width="7" height="5.5" depth="0.3" color="#d4af37" opacity="0.01"></a-box>
  <a-box position="0 3.8 17.6" rotation="0 180 0" width="7" height="5.5" depth="0.22" color="#d4af37" metalness="0.6"></a-box>
  <a-box position="0 3.8 17.45" rotation="0 180 0" width="6.5" height="5.0" depth="0.1" color="#f5e6c8"></a-box>
  <a-text value="Vidangasava" position="0 2.8 17.25" rotation="0 180 0" color="#8B4513" align="center" scale="4.0 4.0 1" shader="flat"></a-text>

  <a-box data-idx="5" class="tablet" position="-12.5 3.8 12.5" rotation="0 135 0" width="7" height="5.5" depth="0.3" color="#d4af37" opacity="0.01"></a-box>
  <a-box position="-12.5 3.8 12.5" rotation="0 135 0" width="7" height="5.5" depth="0.22" color="#d4af37" metalness="0.6"></a-box>
  <a-box position="-12.33 3.8 12.33" rotation="0 135 0" width="6.5" height="5.0" depth="0.1" color="#f5e6c8"></a-box>
  <a-text value="Pindasava" position="-12.18 2.8 12.18" rotation="0 135 0" color="#8B4513" align="center" scale="4.0 4.0 1" shader="flat"></a-text>

  <a-box data-idx="6" class="tablet" position="-17.6 3.8 0" rotation="0 90 0" width="7" height="5.5" depth="0.3" color="#d4af37" opacity="0.01"></a-box>
  <a-box position="-17.6 3.8 0" rotation="0 90 0" width="7" height="5.5" depth="0.22" color="#d4af37" metalness="0.6"></a-box>
  <a-box position="-17.45 3.8 0" rotation="0 90 0" width="6.5" height="5.0" depth="0.1" color="#f5e6c8"></a-box>
  <a-text value="Nalikerasava" position="-17.25 2.8 0" rotation="0 90 0" color="#8B4513" align="center" scale="4.0 4.0 1" shader="flat"></a-text>

  <a-box data-idx="7" class="tablet" position="-12.5 3.8 -12.5" rotation="0 45 0" width="7" height="5.5" depth="0.3" color="#d4af37" opacity="0.01"></a-box>
  <a-box position="-12.5 3.8 -12.5" rotation="0 45 0" width="7" height="5.5" depth="0.22" color="#d4af37" metalness="0.6"></a-box>
  <a-box position="-12.33 3.8 -12.33" rotation="0 45 0" width="6.5" height="5.0" depth="0.1" color="#f5e6c8"></a-box>
  <a-text value="Yogarajasava" position="-12.18 2.8 -12.18" rotation="0 45 0" color="#8B4513" align="center" scale="4.0 4.0 1" shader="flat"></a-text>
  <!-- FLOATING OMs -->
  <a-text value="ॐ" position="5 9.5 -5" color="#FFD700" align="center" scale="2 2 2" shader="flat" opacity="0.65" animation="property:position;to:5 11 -5;dur:3200;dir:alternate;loop:true;easing:easeInOutSine"></a-text>
  <a-text value="ॐ" position="-7 8 4" color="#ff8c00" align="center" scale="1.7 1.7 1.7" shader="flat" opacity="0.55" animation="property:position;to:-7 9.5 4;dur:4100;dir:alternate;loop:true;easing:easeInOutSine"></a-text>
  <a-text value="ॐ" position="3 11 6" color="#FFD700" align="center" scale="1.4 1.4 1.4" shader="flat" opacity="0.5" animation="property:position;to:3 12.5 6;dur:3600;dir:alternate;loop:true;easing:easeInOutSine"></a-text>
  <a-text value="ॐ" position="-4 10 -7" color="#ff8c00" align="center" scale="1.8 1.8 1.8" shader="flat" opacity="0.6" animation="property:position;to:-4 11.5 -7;dur:2900;dir:alternate;loop:true;easing:easeInOutSine"></a-text>

  <!-- PARTICLES -->
  <a-sphere position="3.5 5 3" radius="0.07" color="#FFD700" shader="flat" animation="property:position;to:3.5 7.5 3;dur:4800;dir:alternate;loop:true;easing:easeInOutSine"></a-sphere>
  <a-sphere position="-4 4.5 2" radius="0.055" color="#ff8c00" shader="flat" animation="property:position;to:-4 7 2;dur:4200;dir:alternate;loop:true;easing:easeInOutSine"></a-sphere>
  <a-sphere position="2 6 -4.5" radius="0.07" color="#FFD700" shader="flat" animation="property:position;to:2 8.5 -4.5;dur:3700;dir:alternate;loop:true;easing:easeInOutSine"></a-sphere>
  <a-sphere position="-3 5.5 -3" radius="0.055" color="#ffcc44" shader="flat" animation="property:position;to:-3 8 -3;dur:5000;dir:alternate;loop:true;easing:easeInOutSine"></a-sphere>
  <a-sphere position="6 4 0.5" radius="0.065" color="#ff8c00" shader="flat" animation="property:position;to:6 6.5 0.5;dur:3300;dir:alternate;loop:true;easing:easeInOutSine"></a-sphere>

  <a-entity id="rig" position="0 16 62" fly-in>
    <a-camera id="cam"
      wasd-controls="acceleration:28;fly:false"
      look-controls="pointerLockEnabled:false;magicWindowTrackingEnabled:false"
      near="0.1" far="300">
    </a-camera>
  </a-entity>

</a-scene>

<script>
function skipIntro() {
  window._introPlaying = false;
  var rig = document.getElementById('rig');
  if (rig && rig.components && rig.components['fly-in']) {
    rig.components['fly-in'].finish();
  } else if (rig) {
    rig.setAttribute('position', {x:0, y:1.65, z:7});
  }
  var l = document.getElementById('loading'); if (l) { l.classList.add('out'); l.style.display='none'; }
  var fade = document.getElementById('fade'); if (fade) fade.classList.add('clear');
  var cin = document.getElementById('cin-overlay'); if (cin) cin.classList.add('bars-open');
  var vig = document.getElementById('vignette'); if (vig) vig.classList.add('clear');
  var ch = document.getElementById('crosshair'); if (ch) ch.classList.add('show');
  var hud = document.getElementById('hud'); if (hud) hud.classList.add('show');
  var qn = document.getElementById('quick-nav'); if (qn) qn.classList.add('show');
  var btn = document.getElementById('btn-skip'); if (btn) btn.style.display = 'none';
}

var books = [
  {title:"Takrāriṣṭa",wallTitle:"Takrarista",src:"Bhaiṣajyaratnāvalī · Grahaṇīroga Cikitsā · Śloka 609–610 / Charaka 14.72–74",shlokas:[
    {num:"609",skt:"यमान्यामलकं पथ्या मरिचं त्रिपलांशिकम्। लवणानि पलांशानि पञ्च चैकत्र चूर्णयेत्॥",meaning:"Take Yavānī (Ajwain), Āmalakī (Amla), Pathyā (Harītakī), Marica (Black Pepper), and the five salts in prescribed quantities. Grind them together into a fine medicinal powder.",ing:"Yavānī (Ajwain), Āmalakī (Amla), Pathyā (Harītakī), Marica (Black Pepper), and the Five Salts (Saindhava, Sancal, Viḍa, Sāmudra, and Romaka)",audio:"/audio/Takrarista_609.wav"},
    {num:"610",skt:"तक्रकंसासुतंजातं तक्ररिष्टं पिबेन्नरः। दीपनं शोथगुल्मार्शः कृमिमेहोदरापहम्॥",meaning:"Takrāriṣṭa prepared in buttermilk stimulates digestion and helps relieve swelling, abdominal masses, piles, worm infestation, urinary disorders, and abdominal diseases.",ing:"Buttermilk (Takra) as the fermentation base",audio:"/audio/Takrarista_610.wav",audio:"/audio/Takrarista_610.wav"},
    {num:"72",skt:"हपुषां कुञ्चिकां धान्यमजाजीं कारवीं शटीम्। पिप्पलीं पिप्पलीमूलं चित्रकं हस्तिपिप्पलीम्॥",meaning:"Take Hapushā (Juniper), Kuñcikā (Black cumin), Dhānya (Coriander), Ajājī (Cumin), Kāravī, Śaṭī, Pippalī, Pippalīmūla, Citraka, and Hastipippalī in prescribed amounts.",ing:"Hapushā, Kuñcikā, Dhānya, Ajājī, Kāravī, Śaṭī, Pippalī, Pippalīmūla, Citraka, Hastipippalī",audio:"/audio/Takrarista_72.wav"},
    {num:"73",skt:"यवानीं चाजमोदां च चूर्णितं तक्रसंयुतम्। मन्दाम्लकटुकं विद्वान् स्थापयेद्धृतभाजने॥",meaning:"Combine the herbs with Yavānī and Ajamodā, grind them into a powder, mix with buttermilk, and store in a ghee-smeared container.",ing:"Yavānī, Ajamodā, Buttermilk (Takra), Ghee (for coating the vessel)",audio:"/audio/Takrarista_73.wav"},
    {num:"74",skt:"व्यक्ताम्लकटुकं जातं तक्रारिष्टं मुखप्रियम्। प्रपिबेन्मात्रया कालेष्वन्नस्य तृषितस्त्रिषु॥",meaning:"Once the fermentation produces a distinct sour and pungent taste, the palatable Takrāriṣṭa is ready. Drink in proper doses during or after meals.",ing:"Fermented Takrāriṣṭa formulation base"}
  ]},
  {title:"Durālabhāriṣṭa",wallTitle:"Duralabharista",src:"Gadanigraha · Prayogakhaṇḍa · Āsavādhikāra · Śloka 67–71",shlokas:[
    {num:"67",skt:"दुरालभाया द्विप्रस्थं प्रस्थमामलकस्य च। मुष्टी चित्रकदन्त्योर्द्वे प्रत्यग्रं चाभयाशतम्॥",meaning:"Take two prasthas of Durālabhā, one prastha of Āmalakī, two handfuls each of Citraka and Dantī, along with one hundred fresh Harītakī fruits.",ing:"Durālabhā, Āmalakī, Citraka, Dantī, fresh Harītakī (Abhayā)",audio:"/audio/Duralabharista_67.wav"},
    {num:"68",skt:"चतुर्द्रोणेऽम्भसः क्वाथ्यं शीतं द्रोणावशेषितम्। गुडस्य द्विशतं पूतं मधुनः कुडवान्वितम्॥",meaning:"Boil the herbs in water and after cooling add purified jaggery and honey.",ing:"Water (for decoction), Jaggery (Guḍa), Honey (Madhu)",audio:"/audio/Duralabharista_68.wav"},
    {num:"69",skt:"तद्वत्प्रियङ्गोः पिप्पल्या विडङ्गानां च चूर्णकम्। कुडवं घृतकुम्भस्थं पक्षादूर्ध्वं पिबेन्नरः॥",meaning:"Add powdered Priyaṅgu, Pippalī and Viḍaṅga and ferment in a ghee-smeared vessel.",ing:"Priyaṅgu, Pippalī, Viḍaṅga powders, and Ghee (for lining the vessel)",audio:"/audio/Duralabharista_69.wav"},
    {num:"70",skt:"ग्रहणीपाण्डुरोगार्शःकुष्ठवीसर्पमेहनुत्। स्वरवर्णकरश्चैव रक्तपित्तकफापहः॥",meaning:"Useful in Grahaṇī, Pāṇdu, Arśa, Kuṣṭha, Meha and disorders of blood and Kapha.",ing:"None (Formulation complete; this verse describes health benefits)",audio:"/audio/Duralabharista_70.wav"},
    {num:"71",skt:"भोजनस्य ततो मध्ये पिबेन्मात्रां विचार्य च। दुरालभाह्वयोऽरिष्टः कफवातहरः परः॥",meaning:"Take the prescribed quantity of the medicine during or after meals. This Durālabhāriṣṭa is excellent for balancing Kapha and Vāta.",ing:"Fermented Durālabhāriṣṭa formulation base",audio:"/audio/Duralabharista_71.wav"}
  ]},
  {title:"Rohitakāsava",wallTitle:"Rohitakasava",src:"Gadanigraha · Āsavādhikāra · Śloka 337–341",shlokas:[
    {num:"337",skt:"रोहीतकात्तुलामेकां चतुर्द्रोणेऽम्भसः पचेत्॥",meaning:"Take one tulā of Rohitaka and boil in water to prepare the decoction.",ing:"Rohitaka Bark, Water (for preparing decoction)",audio:"/audio/Rohitakasava_337.wav"},
    {num:"338",skt:"रोहीतकक्वाथः सिद्धः सुसंस्कृतो हितकारकः॥",meaning:"The prepared Rohitaka decoction becomes the base of the formulation.",ing:"Rohitaka Decoction base",audio:"/audio/Rohitakasava_338.wav"},
    {num:"339",skt:"गुडसंयुक्तमेतच्च धातकीपुष्पसंयुतम्॥",meaning:"Mix with jaggery and Dhātakī flowers for fermentation.",ing:"Jaggery (Guḍa), Dhātakī Flowers",audio:"/audio/Rohitakasava_339.wav"},
    {num:"340",skt:"संरक्षितं विधानेन परिपक्वं हितावहम्॥",meaning:"Allow the preparation to mature according to classical methods.",ing:"None (Classical fermentation process)",audio:"/audio/Rohitakasava_340.wav"},
    {num:"341",skt:"नाशयेच्छर्धतीसारं ज्वरं जीर्णं तथैव च॥",meaning:"Useful in vomiting, diarrhea and chronic fever.",ing:"None (Formulation complete; this verse describes health benefits)",audio:"/audio/Rohitakasava_341.wav"}
  ]},
  {title:"Patrāṅgāsava",wallTitle:"Patrangasava",src:"Bhaiṣajyaratnāvalī · Pradararoga Cikitsā · Śloka 122–126",shlokas:[
    {num:"122",skt:"पत्राङ्गं खदिरं वासा शाल्मली कुसुमं बला। भल्लातकं शारिवे द्वे जपाकुसुममस्फुटम्॥",meaning:"Take Patrāṅga, Khadira, Vāsā, Śālmalī flowers, Balā and other herbs.",ing:"Patrāṅga, Khadira, Vāsā, Śālmalī Flowers, Balā, Bhallātaka, Anantamūla, Kṛṣṇasārivā, Japā Flowers",audio:"/audio/Patrangasava_122.wav"},
    {num:"123",skt:"आम्रास्थि दार्वी भूनिम्ब आफूकफलजीरकम्। लौहं रसाञ्जनं बिल्वं केशराजस्त्वचं तथा॥",meaning:"Add mango seed, Dārvī, Bhūnimba, Jīraka and related ingredients.",ing:"Mango Seed, Dārvī (Barberry), Bhūnimba, Āphūka (Poppy seed fruit), Jīraka, Lauha Bhasma, Rasāñjana, Bilva, Keśarāja, Tvak (Cinnamon)",audio:"/audio/Patrangasava_123.wav"},
    {num:"124",skt:"कुङ्कुमं देवकुसुमं प्रत्येकं पलसम्मितम्। सर्वं सुचूर्णितं कृत्वा द्राक्षायाः पलविंशतिम्॥",meaning:"Add saffron, cloves and grapes after powdering the ingredients.",ing:"Saffron (Kuṅkuma), Cloves (Devakusuma), Grapes (Drākṣā)",audio:"/audio/Patrangasava_124.wav"},
    {num:"125",skt:"धातकीं षोडशपलां जलद्रोणद्वये क्षिपेत्। शर्करायास्तुलां दत्त्वा क्षौद्रस्यार्द्धतुलां तथा॥",meaning:"Add Dhātakī flowers, sugar and honey for fermentation.",ing:"Dhātakī Flowers, Sugar, Honey, Water",audio:"/audio/Patrangasava_125.wav"},
    {num:"126",skt:"एकीकृत्य क्षिपेद्भाण्डे निदध्यान्मासमात्रकम्। हन्त्युग्रं प्रदरं सर्वं श्वेतारुणं सवेदनम्॥",meaning:"After maturation it helps manage various forms of Pradara.",ing:"None (Formulation complete; this verse describes health benefits)",audio:"/audio/Patrangasava_126.wav"}
  ]},
  {title:"Viḍaṅgāsava",wallTitle:"Vidangasava",src:"Gadanigraha · Āsavādhikāra · Śloka 37–41",shlokas:[
    {num:"37",skt:"विडङ्गं पिप्पलीमूलं पाठाधात्र्येलवालुकम्॥",meaning:"Take Viḍaṅga, Pippalī root, Pāṭhā, Āmalakī and Elā.",ing:"Viḍaṅga, Pippalī Root, Pāṭhā, Āmalakī (Amla), Elā (Cardamom)",audio:"/audio/Vidangasava_37.wav"},
    {num:"38",skt:"सम्यग्योगेन संयोज्य गुडेन सह कल्पयेत्॥",meaning:"Combine the ingredients with jaggery according to classical methods.",ing:"Jaggery (Guḍa)",audio:"/audio/Vidangasava_38.wav"},
    {num:"39",skt:"धातकीपुष्पसंयुक्तं भाण्डे स्थाप्यं विचक्षणैः॥",meaning:"Add Dhātakī flowers and ferment in a vessel.",ing:"Dhātakī Flowers",audio:"/audio/Vidangasava_39.wav"},
    {num:"40",skt:"मासमेकं परित्यज्य सिद्धिमेति न संशयः॥",meaning:"After one month the formulation becomes fully matured.",ing:"None (Fermentation period)",audio:"/audio/Vidangasava_40.wav"},
    {num:"41",skt:"आढ्यवातं हनुस्तम्भं विडङ्गाख्यो महासवः॥",meaning:"Helpful in Vāta disorders and jaw stiffness.",ing:"None (Formulation complete; this verse describes health benefits)",audio:"/audio/Vidangasava_41.wav"}
  ]},
  {title:"Piṇḍāsava",wallTitle:"Pindasava",src:"Gadanigraha · Āsavādhikāra · Śloka 160–164",shlokas:[
    {num:"160",skt:"प्रास्थिकं पिप्पलीं पिष्ट्वा गुडं मध्यं बिभीतकात्॥",meaning:"Prepare with Pippalī, jaggery and Bibhītaka.",ing:"Pippalī, Jaggery (Guḍa), Bibhītaka",audio:"/audio/Pindasava_160.wav"},
    {num:"161",skt:"रोगानीकविनाशनः॥",meaning:"Known for alleviating many diseases.",ing:"None (Describes therapeutic effects)",audio:"/audio/Pindasava_161.wav"},
    {num:"162",skt:"सर्वदोषहरः प्रोक्तः पिण्डासवो विशेषतः॥",meaning:"Traditionally described as balancing all three doṣas.",ing:"None (Formulation complete; this verse describes health benefits)",audio:"/audio/Pindasava_162.wav"},
    {num:"163",skt:"पिबेदमुं यथाकालं सलिलप्रसृतप्लुतम्। अग्निदीप्तिकरं वह्नेर्बलवीर्यविवर्धनम्॥",meaning:"Drink this formulation at the proper time mixed with water to stimulate digestion, strength, and vigor.",ing:"Water, Piṇḍāsava base",audio:"/audio/Pindasava_163.wav"},
    {num:"164",skt:"ग्रहणीदोषहृत् श्रेष्ठं शूलघ्नं परमोच्यते। पिण्डासव इति ख्यातो रसायनगुणोत्तरः॥",meaning:"It is excellent for curing digestive disorders, relieving abdominal pain, and acts as a rejuvenator.",ing:"Piṇḍāsava base",audio:"/audio/Pindasava_164.wav"}
  ]},
  {title:"Nālikerāsava",wallTitle:"Nalikerasava",src:"Gadanigraha · Āsavādhikāra · Śloka 286–290",shlokas:[
    {num:"286",skt:"नालिकेरोदकं चैव द्रोणमात्रं प्रदापयेत्। द्रोणार्धं रसमिक्षोश्च रसप्रस्थं तु शाल्मलेः॥",meaning:"Use coconut water, sugarcane juice and Śālmalī juice as the liquid base.",ing:"Coconut Water, Sugarcane Juice, Śālmalī Juice",audio:"/audio/Nalikerasava_286.wav"},
    {num:"287",skt:"दशमूलरससंयुक्तं चतुर्जातकसंयुतम्॥",meaning:"Enrich with Daśamūla and Caturjātaka herbs.",ing:"Daśamūla Decoction, Caturjātaka Herbs (Tvak, Elā, Patra, Nāgakeśara)",audio:"/audio/Nalikerasava_287.wav"},
    {num:"288",skt:"धातकीकुसुमैर्युक्तं सुगन्धद्रव्यसंयुतम्॥",meaning:"Add Dhātakī flowers and aromatic herbs.",ing:"Dhātakī Flowers, Aromatic Herbs",audio:"/audio/Nalikerasava_288.wav"},
    {num:"289",skt:"संस्कृतं विधिवद्युक्तं पानयोग्यं प्रशस्यते॥",meaning:"After proper preparation it becomes fit for consumption.",ing:"None (Refinement process)",audio:"/audio/Nalikerasava_289.wav"},
    {num:"290",skt:"वृद्धोऽपि तरुणीं गच्छेत् षण्ढोऽपि पुरुषायते। वलीपलितसन्त्यक्तः शतायुश्च भवेन्नरः॥",meaning:"Traditionally described as rejuvenating and promoting longevity.",ing:"None (Formulation complete; this verse describes health benefits)",audio:"/audio/Nalikerasava_290.wav"}
  ]},
  {title:"Yogarājāsava",wallTitle:"Yogarajasava",src:"Gadanigraha · Āsavādhikāra · Śloka 357–367",shlokas:[
    {num:"357",skt:"द्राक्षायाः शर्करायाश्च गुडस्य च पृथक् पृथक्॥",meaning:"Grapes, sugar and jaggery form the base.",ing:"Grapes (Drākṣā), Sugar, Jaggery (Guḍa)",audio:"/audio/Yogarajasava_357.wav"},
    {num:"358",skt:"योगराजस्य निर्माणे द्रव्याणि संप्रयोजयेत्॥",meaning:"Medicinal ingredients are combined carefully.",ing:"Medicinal herbs mixture (Yogarāja formulation base)",audio:"/audio/Yogarajasava_358.wav"},
    {num:"359",skt:"दीपनं पाचनं चैव दोषसाम्यकरं परम्॥",meaning:"Stimulates digestion and balances doṣas.",ing:"None (Describes therapeutic action)",audio:"/audio/Yogarajasava_359.wav"},
    {num:"360",skt:"वातरोगेषु विशेषेण प्रशस्तमिति कथ्यते॥",meaning:"Especially beneficial in Vāta disorders.",ing:"None (Describes therapeutic action)",audio:"/audio/Yogarajasava_360.wav"},
    {num:"361",skt:"सन्धिशूलहरं श्रेष्ठं गात्रस्तम्भविनाशनम्॥",meaning:"Reduces joint pain and stiffness.",ing:"None (Describes therapeutic action)",audio:"/audio/Yogarajasava_361.wav"},
    {num:"362",skt:"बलवर्णकरं नित्यं पुष्टिदं च विशेषतः॥",meaning:"Promotes strength and nourishment.",ing:"None (Describes therapeutic action)",audio:"/audio/Yogarajasava_362.wav"},
    {num:"363",skt:"अग्निमान्द्यहरं चैव रुचिकारकमुत्तमम्॥",meaning:"Improves digestion and appetite.",ing:"None (Describes therapeutic action)",audio:"/audio/Yogarajasava_363.wav"},
    {num:"364",skt:"गुल्मशूलविनाशाय प्रसिद्धमिदमौषधम्॥",meaning:"Traditionally used for abdominal discomfort.",ing:"None (Describes therapeutic action)",audio:"/audio/Yogarajasava_364.wav"},
    {num:"365",skt:"दोषत्रयहरं प्रोक्तं योगवाहि रसायनम्॥",meaning:"Balances all three doṣas and acts as a Rasāyana.",ing:"None (Describes therapeutic action)",audio:"/audio/Yogarajasava_365.wav"},
    {num:"366",skt:"सर्वाङ्गबलदं नॄणां स्वास्थ्यवृद्धिकरं परम्॥",meaning:"Promotes strength and wellness.",ing:"None (Describes therapeutic action)",audio:"/audio/Yogarajasava_366.wav"},
    {num:"367",skt:"योगराज इति ख्यात आसवोऽयं गुणोत्तरः॥",meaning:"This formulation is renowned as Yogarājāsava.",ing:"",audio:'/audio/Yogarajasava_367.wav'}
  ]}
];

window._introPlaying = true;
var currentBook = null;
var currentPage = 0;
var isAnimating = false;

var _cachedVoices = [];
function loadVoices() { _cachedVoices = speechSynthesis.getVoices(); }
loadVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = loadVoices;
}
function pickFemaleVoice() {
  var voices = _cachedVoices.length ? _cachedVoices : speechSynthesis.getVoices();
  if (!voices.length) return null;

  var maleNames = /ravi|rishi|madhur|dilip|anil|karan|prabhat|hemant|rehaan|arnav|ajit|ashok/i;

  var prioritizedKeywords = [
    'google हिन्दी', 'google hindi',
    'neerja online (natural)', 'neerja online', 'neerja',
    'isha', 'ananya', 'aarohi',
    'swara', 'heera', 'veena', 'lekha',
    'priya', 'geeta', 'kalpana', 'raveena', 'shreya',
    'hindi female', 'india female', 'indian female'
  ];

  for (var i = 0; i < prioritizedKeywords.length; i++) {
    var keyword = prioritizedKeywords[i];
    var match = voices.find(function(v) {
      var nameLower = v.name.toLowerCase();
      return nameLower.indexOf(keyword) !== -1 && !maleNames.test(nameLower);
    });
    if (match) return match;
  }

  var indianLangVoices = voices.filter(function(v) {
    var lang = v.lang.toLowerCase().replace('_', '-');
    return (lang === 'en-in' || lang === 'hi-in') && !maleNames.test(v.name);
  });
  if (indianLangVoices.length) {
    var bestIndian = indianLangVoices.find(function(v) {
      return /female|natural|online|neural/i.test(v.name) || /female|natural|online|neural/i.test(v.voiceURI || '');
    });
    return bestIndian || indianLangVoices[0];
  }

  var broaderIndian = voices.find(function(v) {
    var lang = v.lang.toLowerCase();
    return lang.indexOf('-in') !== -1 && !maleNames.test(v.name);
  });
  if (broaderIndian) return broaderIndian;

  var fallbackFemales = ['zira', 'jenny', 'aria', 'samantha', 'victoria', 'karen', 'moira', 'tessa', 'susan', 'female'];
  for (var j = 0; j < fallbackFemales.length; j++) {
    var fKeyword = fallbackFemales[j];
    var fallbackMatch = voices.find(function(v) {
      return v.name.toLowerCase().indexOf(fKeyword) !== -1;
    });
    if (fallbackMatch) return fallbackMatch;
  }

  var anyEngFemale = voices.find(function(v) {
    return /en/i.test(v.lang) && !maleNames.test(v.name);
  });
  return anyEngFemale || voices[0];
}

var _currentSktAudio = null;

function speakMeaning() {
  if (!currentBook) return;
  var s = currentBook.shlokas[currentPage];
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  try {
    var utter = new SpeechSynthesisUtterance(s.meaning);
    utter.rate = 0.92;
    utter.pitch = 1.05;
    utter.volume = 1;
    var voice = pickFemaleVoice();
    if (voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
  } catch(e) {}
}

function speakShloka() {
  if (!currentBook) return;
  var s = currentBook.shlokas[currentPage];
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  if (_currentSktAudio) {
    try { _currentSktAudio.pause(); } catch(e){}
    _currentSktAudio.src = '';
    _currentSktAudio = null;
  }
  if (s && s.audio) {
    try {
      var audio = new Audio(s.audio);
      _currentSktAudio = audio;
      audio.addEventListener('ended', function() {
        _currentSktAudio = null;
        speakMeaning();
      });
      audio.addEventListener('error', function() {
        _currentSktAudio = null;
        speakMeaning();
      });
      var p = audio.play();
      if (p && p.catch) {
        p.catch(function() {
          _currentSktAudio = null;
          speakMeaning();
        });
      }
    } catch(e) {
      _currentSktAudio = null;
      speakMeaning();
    }
  } else {
    speakMeaning();
  }
}

function getCameraPositionAndDirection() {
  var T = window.THREE || (window.AFRAME && window.AFRAME.THREE);
  if (!T) return null;
  var camEl = document.getElementById('cam');
  if (!camEl || !camEl.getObject3D) return null;
  var camera = camEl.getObject3D('camera');
  if (!camera) return null;
  var origin = new T.Vector3();
  var direction = new T.Vector3();
  camera.getWorldPosition(origin);
  camera.getWorldDirection(direction);
  return { origin: origin, direction: direction };
}

function getFacingTabletIndex(minDot) {
  var T = window.THREE || (window.AFRAME && window.AFRAME.THREE);
  if (!T) return -1;
  var cd = getCameraPositionAndDirection();
  if (!cd) return -1;
  var best = -1, bestDot = minDot;
  tabletPositions.forEach(function(t, i) {
    var toTablet = new T.Vector3(t.x - cd.origin.x, 3.8 - cd.origin.y, t.z - cd.origin.z);
    var dist = toTablet.length();
    if (dist > 32) return;
    toTablet.normalize();
    var dot = cd.direction.dot(toTablet);
    if (dot > bestDot) { bestDot = dot; best = i; }
  });
  return best;
}

function openFacingBook() {
  if (nearIdx >= 0) {
    openBook(nearIdx);
  } else {
    var idx = getFacingTabletIndex(0.60);
    if (idx >= 0) openBook(idx);
    else openBook(0);
  }
}

function openBook(idx) {
  if (idx < 0 || idx >= books.length) return;
  currentBook = books[idx];
  currentPage = 0;
  document.getElementById('bp-title').innerText = currentBook.title;
  document.getElementById('bp-src').innerText = currentBook.src;
  renderPage(0, 'in');
  document.getElementById('book-panel').classList.add('show');
  speakShloka();
}

function renderPage(idx, dir) {
  var stage = document.getElementById('page-stage');
  var s = currentBook.shlokas[idx];
  var total = currentBook.shlokas.length;
  document.getElementById('page-counter').innerText = (idx+1) + ' / ' + total;
  document.getElementById('btn-prev').disabled = idx === 0;
  document.getElementById('btn-next').disabled = idx === total - 1;
  var old = stage.querySelector('.page-card');
  if (old) {
    old.classList.remove('active');
    old.classList.add('exit');
    setTimeout(function(){ if(old.parentNode) old.parentNode.removeChild(old); }, 450);
  }
  var card = document.createElement('div');
  card.className = 'page-card';
  card.innerHTML =
    '<div class="pc-deco">✦ &nbsp; Verse ' + s.num + ' &nbsp; · &nbsp; ' + currentBook.title + ' &nbsp; ✦</div>' +
    '<div style="height:1px;width:50%;background:linear-gradient(90deg,transparent,#d4af37,transparent);margin:0 auto 18px;"></div>' +
    '<div class="pc-skt">' + s.skt + '</div>' +
    '<div class="pc-divider"></div>' +
    '<div class="pc-lbl">✦ &nbsp; Meaning &nbsp; ✦</div>' +
    '<div class="pc-meaning">' + s.meaning + '</div>' +
    '<div style="height:1px;width:50%;background:linear-gradient(90deg,transparent,#d4af37,transparent);margin:18px auto 0;"></div>';
  stage.appendChild(card);
  void card.offsetWidth;
  card.classList.add('active');
}

function prevPage() {
  if (isAnimating || currentPage <= 0) return;
  isAnimating = true;
  currentPage--;
  renderPage(currentPage, 'in');
  setTimeout(speakShloka, 500);
  setTimeout(function(){ isAnimating = false; }, 600);
}

function nextPage() {
  if (isAnimating || currentPage >= currentBook.shlokas.length - 1) return;
  isAnimating = true;
  currentPage++;
  renderPage(currentPage, 'in');
  setTimeout(speakShloka, 500);
  setTimeout(function(){ isAnimating = false; }, 600);
}

function closeBook() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  if (_currentSktAudio) {
    try { _currentSktAudio.pause(); } catch(e){}
    _currentSktAudio.src = '';
    _currentSktAudio = null;
  }
  document.getElementById('book-panel').classList.remove('show');
  currentBook = null;
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeBook(); return; }
  if (e.key === 'ArrowRight') nextPage();
  if (e.key === 'ArrowLeft') prevPage();
});

var nearIdx = -1;
var tabletPositions = [
  {x:0,z:-17.6},{x:12.5,z:-12.5},{x:17.6,z:0},{x:12.5,z:12.5},
  {x:0,z:17.6},{x:-12.5,z:12.5},{x:-17.6,z:0},{x:-12.5,z:-12.5}
];

setInterval(function() {
  if (window._introPlaying) return;
  var bookOpen = document.getElementById('book-panel').classList.contains('show');
  var idx = getFacingTabletIndex(0.75);
  nearIdx = idx;
  var nh = document.getElementById('near-hint');
  if (nh) {
    if (idx >= 0 && !bookOpen) nh.classList.add('show');
    else nh.classList.remove('show');
  }
}, 200);

window.addEventListener('load', function() {
  setTimeout(function() {
    var l = document.getElementById('loading');
    if (l) {
      l.classList.add('out');
      setTimeout(function(){ l.style.display='none'; }, 1200);
    }
    setTimeout(function(){ var f = document.getElementById('fade'); if(f) f.classList.add('clear'); }, 400);
    setTimeout(function() {
      var ct = document.getElementById('cin-title'); if(ct) ct.classList.add('show');
      var cs = document.getElementById('cin-sub'); if(cs) cs.classList.add('show');
    }, 800);
    setTimeout(function() {
      var ct = document.getElementById('cin-title'); if(ct) ct.classList.remove('show');
      var cs = document.getElementById('cin-sub'); if(cs) cs.classList.remove('show');
      setTimeout(function() {
        var co = document.getElementById('cin-overlay'); if(co) co.classList.add('bars-open');
        var vg = document.getElementById('vignette'); if(vg) vg.classList.add('clear');
        var qn = document.getElementById('quick-nav'); if(qn) qn.classList.add('show');
      }, 600);
    }, 2400);
  }, 1200);

  // Safety fallback: ensure controls unlock
  setTimeout(function() {
    if (window._introPlaying) {
      skipIntro();
    }
  }, 6500);

  // Global double-click handler
  window.addEventListener('dblclick', function (e) {
    if (window._introPlaying) return;
    if (e.target && (e.target.closest('#book-panel') || e.target.closest('#quick-nav') || e.target.tagName === 'BUTTON')) return;
    var bookOpen = document.getElementById('book-panel').classList.contains('show');
    if (bookOpen) return;
    var idx = getFacingTabletIndex(0.70);
    if (idx >= 0) openBook(idx);
  });
});
<\/script>
</body>
</html>`}
      />
    </div>
  );
}

export default dynamic(() => Promise.resolve(VRRoomPage), { ssr: false });