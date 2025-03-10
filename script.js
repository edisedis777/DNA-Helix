// configurable:
var dotSize = 56,
  blurLevels = 5,
  bgBlurLevels = 9,
  speed = 1,
  particleScale = 0.33;

// globals:
var c = createjs,
  stage,
  t = 0,
  count = 0,
  w,
  h,
  max,
  min;
var spriteSheet,
  bgSpriteSheet,
  helixes = [],
  bgParticles = [];
var isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
var touchOffset = 0; // For touch panning

// Nucleobase colors
var nucleobases = [
  { name: "adenine", color: "#ff5722" },
  { name: "cytosine", color: "#4caf50" },
  { name: "guanine", color: "#2196f3" },
  { name: "thymine", color: "#9c27b0" },
  { name: "uracil", color: "#ffeb3b" },
];

function HelixParticle(spriteSheet) {
  this.Sprite_constructor(spriteSheet);
  this.t = 0;
  this.speed = 1;
  this.size = 1;
  this.altAmp = 1;
  this.altPer = 1;
  this.nucleobaseType = 0;
  this.isFirstStrand = true;
}
c.extend(HelixParticle, c.Sprite);
c.promote(HelixParticle, "Sprite");

function Helix(particleCount) {
  this.Container_constructor();
  this.particleCount = isMobile
    ? Math.floor(particleCount * 0.7)
    : particleCount || 1000; // Reduce particles on mobile
  this.set({});
  this.particles = [];
  this.createParticles();
  if (!this.isBackground) {
    this.pairLines = new c.Shape();
    this.addChild(this.pairLines);
  }
}
var p = c.extend(Helix, c.Container);
p.set = function (o) {
  this.overscan = o.overscan == null ? 0.2 : o.overscan;
  this.particleScale = o.particleScale || 1;
  this.speed = o.speed || 1;
  this.amplitude = o.amplitude == null ? 0.5 : o.amplitude;
  this.altAmplitude = o.altAmplitude == null ? 0.5 : o.altAmplitude;
  this.startRotation = o.startRotation || 0;
  this.rotations = o.rotations == null ? 2 : o.rotations;
  this.isDNA = o.isDNA == null ? true : o.isDNA;
  this.isPaired = o.isPaired == null ? true : o.isPaired;
  this.isBackground = o.isBackground || false;
};
p.createParticles = function () {
  var dots = this.particles,
    l = this.particleCount;
  while (l-- > 0) {
    var seed = rnd(1);
    var dotSpriteSheet = this.isBackground ? bgSpriteSheet : spriteSheet;
    if (!dotSpriteSheet) {
      console.error("SpriteSheet is not defined");
      return;
    }

    var dot = new HelixParticle(dotSpriteSheet);
    dot.t = rnd(Math.PI);
    dot.speed = Math.pow(seed * 0.5 + 0.5, 3);
    dot.size = 1 - dot.speed;
    dot.altAmp = rnd(0.1, 0.6) * rnd(0, dot.speed) * (rnd(1) < 0.5 ? -1 : 1);
    dot.altPer = rnd(0.3, 2);
    dot.altStart = rnd(Math.PI * 2);

    if (!this.isBackground) {
      dot.isFirstStrand = dots.length % 2 === 0;
      dot.nucleobaseType = Math.floor(rnd(blurLevels));
      if (this.isPaired && dots.length > 0 && dots.length % 2 === 0) {
        var prevDot = dots[dots.length - 1];
        if (prevDot && typeof prevDot.nucleobaseType !== "undefined") {
          if (prevDot.nucleobaseType === 0) dot.nucleobaseType = 3;
          else if (prevDot.nucleobaseType === 1) dot.nucleobaseType = 2;
          else if (prevDot.nucleobaseType === 2) dot.nucleobaseType = 1;
          else if (prevDot.nucleobaseType === 3) dot.nucleobaseType = 0;
          else if (prevDot.nucleobaseType === 4) dot.nucleobaseType = 0;
        }
      }
      var frameIndex = Math.min(dot.nucleobaseType, blurLevels - 1);
      dot.gotoAndStop(frameIndex);
    } else {
      dot.gotoAndStop((seed * bgBlurLevels) | 0);
    }

    dots.push(dot);
    this.addChild(dot);
  }
};
p.tick = function (delta) {
  var dots = this.particles,
    a0 = this.amplitude * 0.5,
    a1 = this.altAmplitude * 0.5,
    pScale = this.particleScale * particleScale;
  var rotations = this.rotations * Math.PI * 2,
    startRotation = this.startRotation * Math.PI * 2;
  var adjW = w * (1 + this.overscan * 2);

  if (!this.isBackground) {
    this.pairLines.graphics.clear();
  }

  for (var i = 0, l = dots.length; i < l; i++) {
    var dot = dots[i];
    if (!dot) continue;

    var altPer = dot.altPer * Math.PI * 2;
    var t = (dot.t += delta * 0.0001 * this.speed * speed) % 1;
    if (t < 0) t = 1 + t;

    var x = t * adjW - adjW / 2 + touchOffset; // Apply touch panning
    t = x / adjW;
    var angle = t * rotations + startRotation;
    var helixRadius = this.isBackground
      ? min * (isMobile ? 0.2 : 0.3)
      : min * (isMobile ? 0.1 : 0.15);

    if (!this.isBackground) {
      var phaseShift = dot.isFirstStrand ? 0 : Math.PI;
      var yPos = helixRadius * Math.sin(angle + phaseShift);
      var xOffset = helixRadius * Math.cos(angle + phaseShift) * 0.2;

      yPos += Math.sin(t * altPer + dot.altStart) * min * dot.altAmp * a1 * 0.2;
      xOffset +=
        Math.cos(t * altPer + dot.altStart) * min * dot.altAmp * a1 * 0.1;

      dot.x = x + xOffset;
      dot.y = yPos;
      dot.scaleX = dot.scaleY = (1 + dot.size) * pScale * (isMobile ? 0.8 : 1); // Slightly smaller on mobile
      dot.alpha = Math.max(0.2, 1 - Math.abs(x) / (adjW / 2));

      if (this.isPaired && i % 2 === 1 && i > 0) {
        var prevDot = dots[i - 1];
        if (prevDot && Math.abs(dot.t - prevDot.t) < 0.01) {
          this.pairLines.graphics
            .s("rgba(255,255,255,0.2)")
            .mt(prevDot.x, prevDot.y)
            .lt(dot.x, dot.y);
        }
      }
    } else {
      var y = Math.sin(angle) * min * a0;
      var z = Math.cos(angle) * min * a0;

      y += Math.sin(t * altPer + dot.altStart) * min * dot.altAmp * a1;
      z += Math.cos(t * altPer + dot.altStart) * min * dot.altAmp * a1;

      dot.x = x;
      dot.y = y;
      dot.scaleX = dot.scaleY =
        Math.pow(1 + dot.size, 2) * pScale * (isMobile ? 0.7 : 1);
      dot.alpha = Math.max(0.1, 0.3 - Math.abs(z) / min);
    }
  }
};
p.clone = function (particleCount) {
  var o = new Helix(particleCount || this.particleCount);
  this._cloneProps(o);
  o.set(this);
  return o;
};
c.promote(Helix, "Container");

function generateSpriteSheet() {
  var holder = new c.Container();
  var shape = new c.Shape();
  holder.addChild(shape);

  var size = dotSize * 2;
  var rect = new c.Rectangle(-size / 2, -size / 2, size, size);

  var data = {
    images: [],
    frames: [],
    animations: {},
  };

  var canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size * blurLevels;
  var ctx = canvas.getContext("2d");

  for (var i = 0; i < blurLevels; i++) {
    ctx.save();
    ctx.translate(size / 2, size / 2 + i * size);
    ctx.fillStyle = nucleobases[i].color;

    switch (i) {
      case 0:
        drawPolygonToCanvas(ctx, 5, dotSize / 2);
        break;
      case 1:
        drawPolygonToCanvas(ctx, 4, dotSize / 2);
        break;
      case 2:
        drawPolygonToCanvas(ctx, 6, dotSize / 2);
        break;
      case 3:
        drawPolygonToCanvas(ctx, 3, dotSize / 2);
        break;
      case 4:
        ctx.beginPath();
        ctx.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
    ctx.restore();
    data.frames.push([0, i * size, size, size, 0, size / 2, size / 2]);
  }

  data.images = [canvas];
  for (var j = 0; j < blurLevels; j++) {
    data.animations[j] = j;
  }

  return new c.SpriteSheet(data);
}

function generateBgSpriteSheet() {
  var holder = new c.Container(),
    shape = holder.addChild(new c.Shape()),
    g = shape.graphics;
  var pow = Math.ceil(Math.log(dotSize * 2.2) / Math.log(2)),
    size2 = Math.pow(2, pow);
  var rect = new c.Rectangle(-size2 / 2, -size2 / 2, size2, size2);
  var builder = new c.SpriteSheetBuilder();
  builder.padding = 0;
  builder.maxWidth = Math.ceil(Math.sqrt(bgBlurLevels)) * size2;

  for (var i = 0; i < bgBlurLevels; i++) {
    builder.addFrame(holder, rect, 1, prepBgFrame, i);
  }
  return builder.build();
}

function prepBgFrame(holder, i) {
  var shape = holder.getChildAt(0);
  var g = shape.graphics,
    m = i / bgBlurLevels,
    r = (dotSize / 2) * Math.pow(2 - m, 1.2);
  var hue = 240 + m * 60;
  g.c()
    .rf(
      [`hsla(${hue},50%,75%,0.5)`, `hsla(${hue},50%,85%,0)`],
      [m * 0.8 + 0.1, 1],
      0,
      0,
      0,
      0,
      0,
      r
    )
    .dc(0, 0, r);
  shape.alpha = 0.3 + 0.7 * m;
}

function drawPolygonToCanvas(ctx, sides, radius) {
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  for (var i = 1; i <= sides; i++) {
    var angle = (Math.PI * 2 * i) / sides;
    var x = radius * Math.cos(angle);
    var y = radius * Math.sin(angle);
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

function tick(evt) {
  var d = evt.delta;
  for (var i = 0, l = bgParticles.length; i < l; i++) {
    if (bgParticles[i]) bgParticles[i].tick(d);
  }
  for (var i = 0, l = helixes.length; i < l; i++) {
    if (helixes[i]) helixes[i].tick(d);
  }
  stage.update();
}

function rnd(min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.random() * (max - min) + min;
}

function onResize() {
  w = window.innerWidth;
  h = window.innerHeight;
  max = Math.max(w, h);
  min = Math.min(w, h);

  var canvas = document.getElementById("target");
  canvas.width = w;
  canvas.height = h;

  if (stage) {
    stage.updateViewport(w, h);
    for (var i = 0; i < helixes.length; i++) {
      helixes[i].x = w * 0.5;
      helixes[i].y = h * 0.5;
    }
    for (var i = 0; i < bgParticles.length; i++) {
      bgParticles[i].x = w * 0.5;
      bgParticles[i].y = h * 0.5;
    }
    particleScale = (min / 1000) * (isMobile ? 0.2 : 0.3); // Smaller scale on mobile
    stage.update();
  }
}

function handleTouchStart(evt) {
  evt.preventDefault();
  var touch = evt.touches[0];
  touchOffsetStart = touchOffset;
  touchStartX = touch.clientX;
}

function handleTouchMove(evt) {
  evt.preventDefault();
  var touch = evt.touches[0];
  touchOffset = touchOffsetStart + (touch.clientX - touchStartX) * 0.5; // Slower panning
}

function handleTouchEnd(evt) {
  evt.preventDefault();
}

var touchOffsetStart, touchStartX;

function setup() {
  stage = new c.StageGL("target");
  stage.tickChildren = false;
  stage.setClearColor("#201624");

  window.addEventListener("resize", onResize);
  if (isMobile) {
    var canvas = document.getElementById("target");
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);
  }
  onResize();

  spriteSheet = generateSpriteSheet();
  bgSpriteSheet = generateBgSpriteSheet();

  var bg1 = new Helix(150);
  bg1.isBackground = true;
  bg1.x = w / 2;
  bg1.y = h / 2;
  bg1.speed = 0.1;
  bg1.alpha = 0.1;
  bg1.particleScale = 2;
  bg1.altAmplitude = 1.8;
  bg1.amplitude = 0.7;
  bg1.rotations = 3;
  stage.addChildAt(bg1, 0);
  bgParticles.push(bg1);

  var bg2 = bg1.clone(200);
  bg2.particleScale = 1.5;
  bg2.rotation = -30;
  bg2.speed = -0.4;
  bg2.amplitude = 0.5;
  bg2.altAmplitude = 2;
  bg2.alpha = 0.15;
  stage.addChildAt(bg2, 1);
  bgParticles.push(bg2);

  var bg3 = new Helix(300);
  bg3.isBackground = true;
  bg3.x = w / 2;
  bg3.y = h / 2;
  bg3.amplitude = 0.4;
  bg3.particleScale = 0.8;
  bg3.rotation = 45;
  bg3.rotations = 2;
  bg3.speed = 0.8;
  bg3.startRotation = 0.5;
  bg3.alpha = 0.12;
  stage.addChildAt(bg3, 2);
  bgParticles.push(bg3);

  var bg4 = bg3.clone(100);
  bg4.particleScale = 1;
  bg4.speed = -1;
  bg4.rotations = 2.5;
  bg4.startRotation = 0.25;
  bg4.alpha = 0.18;
  stage.addChildAt(bg4, 3);
  bgParticles.push(bg4);

  var dnaHelix = new Helix(200);
  dnaHelix.x = w * 0.5;
  dnaHelix.y = h * 0.5;
  dnaHelix.speed = 0.3;
  dnaHelix.particleScale = 1.5;
  dnaHelix.amplitude = 0.4;
  dnaHelix.altAmplitude = 0.1;
  dnaHelix.rotations = 3;
  dnaHelix.isPaired = true;
  dnaHelix.rotation = 0;
  stage.addChild(dnaHelix);
  helixes = [dnaHelix];

  c.Ticker.timingMode = c.Ticker.RAF;
  c.Ticker.framerate = isMobile ? 30 : 60; // Lower framerate on mobile
  c.Ticker.on("tick", tick);
}

document.addEventListener("DOMContentLoaded", setup);
