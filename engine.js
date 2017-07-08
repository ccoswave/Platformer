
var canvas = document.getElementById('surf');
var ctx = canvas.getContext('2d');
var W = canvas.width;
var H = canvas.height;

var sin = Math.sin;
var cos = Math.cos;
var angle = Math.atan2;
var sqrt = Math.sqrt
var pow = Math.pow;
var rand = Math.random;
var pi = Math.PI;
var tau = Math.PI*2;
var floor = Math.floor;
var abs = Math.abs;

function pointDir (x0,y0,x1,y1) {
  return angle(x1-x0,y0-y1);}

function pointDist (x0,y0,x1,y1) {
  return sqrt((x0-x1)*(x0-x1)+(y0-y1)*(y0-y1));}

function dist (obj1,obj2) {
  return pointDist(obj1.x,obj1.y,obj2.x,obj2.y);}


var k_up = false
var k_down = false
var k_left = false
var k_right = false
var k_ctrl = false
var k_A = false
var k_B = false
var k_C = false

var k_ctrl_down = false
var k_A_down = false

function resetKeys () {
  k_ctrl_down = false
  k_A_down = false
}

function keydown(evt) {
  console.log('key: ',evt.key)
  if (evt.key == 'ArrowUp'&&!k_up) {k_up = true}
  if (evt.key == 'ArrowDown'&&!k_down) {k_down = true}
  if (evt.key == 'ArrowLeft'&&!k_left) {k_left = true}
  if (evt.key == 'ArrowRight'&&!k_right) {k_right = true}
  if (evt.key == 'Shift'&&!k_A) {
    k_A = true
    k_A_down = true}
  if (evt.key == 'z'&&!k_B) {k_B = true}
  if (evt.key == 'x'&&!k_C) {k_C = true}
  if (evt.key == 'Control'&&!k_ctrl) {
    k_ctrl = true
    k_ctrl_down = true}}
window.addEventListener('keydown',keydown,false)


function keyup(evt) {
  if (evt.key == 'ArrowUp') {k_up = false}
  if (evt.key == 'ArrowDown') {k_down = false}
  if (evt.key == 'ArrowLeft') {k_left = false}
  if (evt.key == 'ArrowRight') {k_right = false}
  if (evt.key == 'Shift') {k_A = false}
  if (evt.key == 'z') {k_B = false}
  if (evt.key == 'x') {k_C = false}
  if (evt.key == 'Control') {k_ctrl = false}}
window.addEventListener('keyup',keyup,false)

// sounds
var audio = new Audio('wntic.wav');

function rr() {
  return Math.floor(Math.random()*2)}

function Map (w,h) {
  this.tsize = 32
  this.w = w; this.h = h
  this.mtx = []
  for (n=0;n<this.w*this.h;n++) {
    this.mtx.push(rr())}}
Map.prototype.check = function (x,y) {
  if (x<=this.w*this.tsize&&y<=this.h*this.tsize&&x>=0&&y>=0) {
    if (this.mtx[Math.floor(x/this.tsize)+Math.floor(y/this.tsize)*this.w]) {return true} else {return false}}
  else {
    return false}}
Map.prototype.render = function () {
  tsize = this.tsize
  for (n=0;n<this.w*this.h;n++) {
    ctx.fillStyle = '#222288'
    ctx.strokeStyle = '#000000'
    if (this.mtx[n]) {ctx.fillRect((n%this.w)*tsize-marble.x+W/2,
      -Math.floor(n/this.w)*tsize+marble.y+H/2,tsize,tsize)}
    ctx.strokeRect((n%this.w)*tsize-marble.x+W/2,
      -Math.floor(n/this.w)*tsize+marble.y+H/2,tsize,tsize)}}


function Controller() {
  this.move = [0,0]
  this.jump = 0
  this._A = 0}
Controller.prototype.update = function () {
  this.move = [0,0]
  this.jump = 0
  this._A = 0
  if (k_up) {this.move[1]=-1}
  if (k_down) {this.move[1]=1}
  if (k_left) {this.move[0]=-1}
  if (k_right) {this.move[0]=1}
  if (k_ctrl) {this.jump = 1}
  if (k_A_down) {this._A = 1}
  }


function Marble(inputs) {
  this.type = 'Marble'
  this.ctrl = inputs
  this.x = 16
  this.y = 16
  this.xsp = 0
  this.ysp = 0
  this.strike = 0
  this.health = 100}
Marble.prototype.update = function () {
  this.ctrl.update()
  this.xsp += this.ctrl.move[0]
  this.ysp += this.ctrl.move[1]
  this.x += this.xsp
  this.y += this.ysp
  this.xsp = this.xsp/1.1
  this.ysp = this.ysp/1.1
  if (this.strike>0) {this.strike--}
  //if (this.strike==0) {
  if (this.ctrl._A) {
    audio.play();
    this.strike = 16}
  chk = map.check(this.x,this.y)
  if (this.y==0&&chk) {
    if (this.ctrl.jump) {this.ysp = 10}}
  else if (this.y>0||!chk) {this.ysp--} 
  this.y += this.ysp
  if (this.y<0||chk) {
    this.ysp=0
    this.y=0}
  for (oc=0;oc<objects.length;oc++) {
    tgt = objects[oc]
    if (tgt!=this&&tgt.strike==16&&dist(this,tgt)<=32) {this.health-=10}}
  
  for (oc=0;oc<objects.length;oc++) {
    if (objects[oc]!=this) {
      if (objects[oc].type=='drone') {
        if (abs(objects[oc].x-this.x)<16
          &&abs(objects[oc].y-this.y)<16) {}}}}
  if (this.health<=0) {this.x=0;this.y=0;reset()}}
Marble.prototype.render = function () {
  ctx.fillStyle = '#000000'
  if (map.check(this.x,this.y)) {ctx.fillStyle = '#8888ff'}
  ctx.beginPath();
  ctx.arc(H/2,W/2,16,0,2*Math.PI);
  ctx.fill()
  ctx.strokeStyle = '#000000'
  ctx.beginPath();
  ctx.arc(H/2,W/2,16+this.strike,0,2*Math.PI);
  ctx.stroke()
}

function Camera() {
  this.x = 0}



function reset() {
  console.log('reset')
  map = new Map(8,8)
  objects = []  
  marble = new Marble(new Controller())  
  objects.push(marble)
  }

reset()
var t=0

var map = new Map(8,8)
var camera = new Camera()
var marble = new Marble(new Controller())
var objects = []
objects.push(marble)

function execute () {
  function loop () {
    ctx.lineCap = 'round';
    ctx.lineWidth = 2
    ctx.strokeStyle = '#332722'
    ctx.fillStyle = '#332722'
    ctx.clearRect(0,0,W,H)
    ctx.strokeRect(0,0,W,H)
    ctx.lineWidth = 2

    ctx.strokeStyle = '#665544'
    map.render()

    ctx.font = "12pt courier";
    for (o=0;o<objects.length;o++) {
      objects[o].update()}
    for (o=0;o<objects.length;o++) {
      objects[o].render()}
    
    resetKeys()
    t++
    setTimeout(loop,30)}
  loop()
}
execute()
        