
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
frame_rate = 1000
function keydown(evt) {
  console.log('key: ',evt.key)
  if (evt.key == 'ArrowUp'&&!k_up) {k_up = true}
  if (evt.key == 'ArrowDown'&&!k_down) {k_down = true}
  if (evt.key == 'ArrowLeft'&&!k_left) {k_left = true}
  if (evt.key == 'ArrowRight'&&!k_right) {k_right = true}
  if (evt.key == 'Shift'&&!k_A) {
    k_A = true
    k_A_down = true}
  if (evt.key == 'z'&&!k_B) {
    if (frame_rate==1000) {frame_rate=30} else {frame_rate=1000}k_B = true}
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

// images
var bricktile = new Image();
bricktile.src = "bricktile.png";
var droplet = new Image();
droplet.src = "droplet.png";

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
  tsize = 34
  for (n=0;n<this.w*this.h;n++) {
    if (this.mtx[n]) {
      ctx.drawImage(
        bricktile,
        36,0,    //x,y on tiles
        36,36,  //w,h on tiles
                     (n%this.w)*32-marble.x+W/2-2,
          -Math.floor(n/this.w)*32+marble.y+H/2-2-32,
        //W/2-9,H/2-14-this.z,    //x,y on canvas
        36,36)}}
  for (n=0;n<this.w*this.h;n++) {
    if (this.mtx[n]) {
      ctx.drawImage(
        bricktile,
        0,0,    //x,y on tiles
        36,36,  //w,h on tiles
                     (n%this.w)*32-marble.x+W/2-2,
          -Math.floor(n/this.w)*32+marble.y+H/2-2-32,
        //W/2-9,H/2-14-this.z,    //x,y on canvas
        36,36)}}}


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
  this.y = map.h*32+64
  this.xsp = 0
  this.ysp = 0
  this.cooldown = 0}
Marble.prototype.update = function () {
  this.ctrl.update()
  this.xsp += this.ctrl.move[0]

  this.xc=0; this.yc=0//collision correction
  if (map.check(this.x+this.xsp,this.y)) {
    this.xc=this.xsp
    while (map.check(this.x+this.xc,this.y)) {
      if (this.xsp>0) {this.xc--} else if (this.xsp<0) {this.xc++}}
    this.xsp=0}
  if (map.check(this.x,this.y+this.ysp)) {
    this.yc+=this.ysp
    while (map.check(this.x,this.y+this.yc)) {
      if (this.ysp>0) {this.yc--} else if (this.ysp<0) {this.yc++}}
    this.ysp=0}
  this.x+=this.xc
  this.y+=this.yc


  this.x += this.xsp
  this.xsp = this.xsp/1.1

  if (map.check(this.x,this.y-1)&&!map.check(this.x,this.y+1)) {
    if (this.ctrl.jump) {this.ysp = 20}} // jump
  else { // fall
    this.ysp--} 
  this.y += this.ysp
  if (this.y<=32) {reset()}}
Marble.prototype.render = function () {
  ctx.fillStyle = '#000000'
  if (map.check(this.x,this.y)) {ctx.fillStyle = '#8888ff'}
  ctx.drawImage(
    droplet,
    0,0,    //x,y on tiles
    34,34,  //w,h on tiles
    W/2-17,H/2-33, //x,y on canvas
    34,34)
  ctx.beginPath()
    ctx.moveTo(W/2,H/2-2)
    ctx.lineTo(W/2+this.xsp,H/2-this.ysp-2)
    ctx.stroke()
  //ctx.beginPath();
  //ctx.arc(H/2,W/2,16,0,2*Math.PI);
  //ctx.fill()
  //ctx.strokeStyle = '#000000'
  //ctx.beginPath();
  //ctx.arc(H/2,W/2,16+this.cooldown,0,2*Math.PI);
  //ctx.stroke()
}






function Camera() {
  this.x = 0}

function reset() {
  console.log('reset')
  map = new Map(16,32)
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
    ctx.fillStyle = '#eef2ec'
    ctx.clearRect(0,0,W,H)
    ctx.fillRect(0,0,W,H)
    ctx.strokeRect(0,0,W,H)
    ctx.lineWidth = 2

    ctx.strokeStyle = '#665544'
    
    ctx.font = "12pt courier";
    for (o=0;o<objects.length;o++) {
      objects[o].update()}
    for (o=0;o<objects.length;o++) {
      objects[o].render()}
    map.render()

    resetKeys()
    t++
    setTimeout(loop,frame_rate)}
  loop()
}
execute()
        