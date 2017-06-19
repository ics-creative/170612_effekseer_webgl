var isSp = getDevice()=="sp";
var effects = {};
var main = function () {
var counter = 0;
var _app = document.getElementById("app");
var canvas = document.getElementById("canvas");
var width  = canvas.width;
var height = canvas.height;

var scene = new THREE.Scene();

var fov    = 30;
var aspect = width / height;
var near   = 1;
var far    = 1000;
var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
var target = new THREE.Vector3(0, 0, 0);
camera.position.set( 0, 2, 40 );
camera.lookAt(target);

controls = new THREE.OrbitControls(camera);
controls.autoRotate = false;

var renderer = new THREE.WebGLRenderer({canvas: canvas, preserveDrawingBuffer: true});
renderer.setSize( width, height );
//document.body.appendChild( renderer.domElement );

effekseer.init(renderer.context);
effects["sword"] = effekseer.loadEffect("Resource/002_sword_effect/sword.efk");
effects["Laser02"] = effekseer.loadEffect("Resource_/Laser01.efk");
effects["TitleEffect"] = effekseer.loadEffect("Resource/004_logo_effect/TitleEffect.efk");
effects["distortion"] = effekseer.loadEffect("Resource/005_distortion_effect/distortion.efk");
effects["block"] = effekseer.loadEffect("Resource_/block.efk");

var grid = new THREE.GridHelper(20, 10, 0xffffff, 0xffffff);
//scene.add(grid);

//var directionalLight = new THREE.DirectionalLight( 0xffffff );
//directionalLight.position.set( 0, 0.7, 0.7 );
//scene.add( directionalLight );

( function renderLoop () {
  // SP時は30FPSにする
  if (isSp && ++counter%2==0){
    if (!paused) {
  	  effekseer.update();
    }
    requestAnimationFrame( renderLoop );
  	return;
  }
  requestAnimationFrame( renderLoop );
  
  if (!paused) {
  	effekseer.update();
  }          
  controls.update();
  
  renderer.render( scene, camera );
  effekseer.setProjectionMatrix(camera.projectionMatrix.elements);
  effekseer.setCameraMatrix(camera.matrixWorldInverse.elements);
  effekseer.draw();

} )();
};
window.addEventListener( 'DOMContentLoaded', main, false );
var paused = false;
function playEffect(effect) {
	if (!effekseer || !effects[effect])
	{
		return
	}
	stopAll();
	effekseer.play(effects[effect], 0, 0, 0);
}
function stopAll() {
	paused = false;
	if (!effekseer)
	{
		return;
	}
	effekseer.stopAll();
}
function togglePause () {
	paused = !paused;
	document.getElementById("buttonPause").innerHTML = paused? "再生":"ポーズ";
}
function toggleRotate () {
	if (!controls) return;
	controls.autoRotate = !controls.autoRotate;
	document.getElementById("buttonRotate").innerHTML = controls.autoRotate? "回転ON":"回転OFF";
}
function capture () {
	var canvas = window.document.getElementById("canvas");
	var dataUrl = canvas.toDataURL();
	window.open(dataUrl);
}
  
var canvas = document.getElementById('canvas');
var container = document.getElementById('app');
sizing();
function sizing() {
	canvas.height = container.offsetHeight;
	canvas.width = container.offsetWidth;
}