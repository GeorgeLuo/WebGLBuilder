let scene,
    renderer,
    container,
    width,
    height;

let camera,
    fov, aspect, near, far;

var spikes, planeImage, circleImage, circles

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


var targetRotationH = 0;
var targetRotationOnMouseDownH = 0;
var mouseX = 0;
var mouseXOnMouseDown = 0;

var targetRotationV = 0;
var targetRotationOnMouseDownV = 0;
var mouseY = 0;
var mouseYOnMouseDown = 0;

function rotateCircles() {
  // circles.rotation.x += 0.01;
  circles.rotation.z += 0.01;
}

function rotateSpikes() {
  for (i = 0; i < spikes.length; i++) { 
    spikes[i].rotation.x += 0.01;
    spikes[i].rotation.y += 0.01;
  }
}

var colors = [0xD81B66, 0x787FFF, 0x66CDAA, 0x8E1BD8, 0x00ff99];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function flashShape(index) {
  for (j = 0; j < spikes[index].children.length; j++) {
    spikes[index].children[j].material.color.setHex(colors[getRandomInt(5)]);
  }
}

var resized = false;
function resizeShape(index) {
  if(!resized) {
    spikes[index].scale.set(1.02,1.02,1.02);
    resized = true;
  } else {
    spikes[index].scale.set(0.98,0.98,0.98);
    resizeIndex = getRandomInt(3);
    resized = false;
  }
}

function render() {

  if(isPlaying) {
    rotateSpikes();
    flashShape(flashIndex);
    resizeShape(resizeIndex);
    rotateCircles();
  }

  // shape.rotation.x += 0.01;
  // shape.rotation.y += 0.01;        // camera.lookAt( cameraTarget );

  renderer.clear();
  renderer.render( scene, camera );
}

function onDocumentMouseDown( event ) {
  event.preventDefault();
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mouseup', onDocumentMouseUp, false );
  document.addEventListener( 'mouseout', onDocumentMouseOut, false );
  mouseXOnMouseDown = event.clientX - windowHalfX;
  targetRotationOnMouseDownH = targetRotationH;

  mouseYOnMouseDown = event.clientY - windowHalfY;
  targetRotationOnMouseDownV = targetRotationV;
}

function onDocumentMouseMove( event ) {
  mouseX = event.clientX - windowHalfX;
  targetRotationH = targetRotationOnMouseDownH + ( mouseX - mouseXOnMouseDown ) * 0.02;

  mouseY = event.clientY - windowHalfY;
  targetRotationV = targetRotationOnMouseDownV + ( mouseY - mouseYOnMouseDown ) * 0.02;
}
function onDocumentMouseUp( event ) {
  document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}
function onDocumentMouseOut( event ) {
  document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

let flashIndex = 0;
let resizeIndex = 0;
let isPlaying = false;

["click"].forEach((eventName)=>{
  window.addEventListener(eventName, ()=>{
    flashIndex = getRandomInt(3);
    if(!isPlaying){
      
        playMp3()
        isPlaying = true;
      
    }
  }); 
});

urls = ['sounds/x-8.wav', 'sounds/x-7.wav']

function playMp3() {
  soundManager.onready(function() {
    soundManager.createSound({
        id: 'mySound',
        onfinish: function() {
           urls.shift();
           clearScene();
           renderNextScene();
         },
        url: urls[0]
    });

    // ...and play it
    try{
      soundManager.play('mySound');
    } catch (e) {
      isPlaying = false;
    }
  });
}

function init() {

  setSceneConstants();

  scene = new THREE.Scene();

  // for (i = 0; i < spikes.length; i++) { 
  //   scene.add(spikes[i]);
  // }

  // createPlaneImage()
  // scene.add(planeImage);
  
  initCamera();
    
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;

  container = document.getElementById('scene');
  container.appendChild(renderer.domElement);

  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
}

function setSceneConstants() {

  width = window.innerWidth;
  height = window.innerHeight;

  fov = 50;
  aspect = width / height;
  near = 1;
  far = 2000;
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.x = 0;
  camera.position.z = 500;
  camera.position.y = 0;
  camera.lookAt(new THREE.Vector3(0,0,0));
}



function createShape(x, y, z) {
  shape = new THREE.Group();

  shape.position.x = x;
  shape.position.z = z;
  shape.position.y = y;

  shape.add(createBox(50, 50, 150));
  shape.add(createBox(50, 150, 50));
  shape.add(createBox(150, 50, 50));

  return shape;
}

function createBox(x, y, z) {
  let geometry = new THREE.BoxGeometry( x, y, z );
  let material = new THREE.MeshPhongMaterial( { color: 0xd97d34 } );
  cube = new THREE.Mesh( geometry, material );  
  cube.castShadow = true;
  return cube;
}

function createFloor() {
  var planeGeometry = new THREE.PlaneBufferGeometry( 400, 400, 10, 10 );
  var planeMaterial = new THREE.MeshStandardMaterial( { color: 0x45545a } )
  let plane = new THREE.Mesh( planeGeometry, planeMaterial );
  plane.position.set(0, -100, 0);

  plane.receiveShadow = true;
  plane.rotation.x = -90 * Math.PI / 180;
  // scene.add( plane );
}

function createCircleGeometry(image_path) {

  console.log("creating circle geometry");

  var texture = new THREE.TextureLoader().load( image_path );
  var material = new THREE.MeshBasicMaterial( { map: texture } );
// thetaStart: 0,
//       thetaLength: twoPi
  var geometry = new THREE.CircleGeometry( 200, 64, 0, Math.PI * 2 );
  circleImage = geometry;
  circle = new THREE.Mesh( geometry, material );

  return circle;
}

function loadText(text_string) {

  var loader = new THREE.FontLoader();
  var mesh;

  var text = new THREE.Group();

  loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {



    geometry = new THREE.TextGeometry( text_string, {
      font: font,
      size: 20,
      height: 4,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 5,
      bevelSize: 3,
      bevelSegments: 5
    } );

    geometry.computeBoundingBox();
    var centerOffset = -0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
    var textMaterial = new THREE.MeshPhongMaterial( { color: colors[getRandomInt(5)], specular: colors[getRandomInt(5)] } );

    mesh = new THREE.Mesh( geometry, textMaterial );

    mesh.position.x = 350;
    mesh.position.y = 75;
    mesh.position.z = 0;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.geometry.center();
    //mesh.lookAt(camera.position);
    text.add(mesh);
  } );

  text.position.set(0, 0, 0);
  return text;
}

function createPlaneImage(plane_img) {
  var planeGeometry = new THREE.PlaneGeometry(425, 425, 1, 1);
  var texture = new THREE.TextureLoader().load( plane_img );
  var planeMaterial = new THREE.MeshLambertMaterial( { map: texture, transparent: true } );
  //var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  // rotate and position the plane
  // plane.rotation.x = -0.5 * Math.PI;
  // plane.rotation.z = -1.0 * Math.PI;
  plane.position.set(0,0,-1);
  // add the plane to the scene
  planeImage = plane;
  return planeImage;
}

function lighting() {
  const light = new THREE.DirectionalLight( 0xffffff, 1);
  light.position.set( -100, 500, 400 );
  light.castShadow = true;
  
  const d = 200;
  light.shadowCameraLeft = -d;
  light.shadowCameraRight = d;
  light.shadowCameraTop = d;
  light.shadowCameraBottom = -d;
  
  light.shadowCameraFar = 1000;
  
  scene.add( light );
  scene.add( new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.6 ) );
  scene.add( new THREE.AmbientLight(0xa59f75, 0.6) );
}

function animate() {
  requestAnimationFrame( animate );


  render();
}

function clearScene() {
  while(scene.children.length > 0){ 
    scene.remove(scene.children[0]); 
  }
}

// scene is array of objects to load to scene
// ex. scene_objects = 
//  [createShape(0, 0, 0), createShape(200, 0, -200), createShape(-200, 0, 200)];
// use strategy: call once to load environment, call again to load objects.
function loadObjects(scene_objects) {
  for (i = 0; i < scene_objects.length; i++) { 
    scene.add(scene_objects[i]);
  }
}

function createPlatesScene() {
  // planeImage = [createPlaneImage("images/plate_trans.png")];
  // loadObjects(planeImage);

  circles = new THREE.Group();
  circles.add(createCircleGeometry("images/plate_trans.png"));

  loadObjects([circles]);

  loadObjects([createPlaneImage('images/plate_bg.jpg')]);

  loadObjects([loadText('SITE\n UNDER\n CONSTRUCTION')]);

  const light = new THREE.DirectionalLight( 0xffffff, 1);
  light.position.set( -100, 500, 400 );
  light.castShadow = true;
  
  const d = 200;
  light.shadowCameraLeft = -d;
  light.shadowCameraRight = d;
  light.shadowCameraTop = d;
  light.shadowCameraBottom = -d;
  
  light.shadowCameraFar = 1000;


  loadObjects([light, new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.6 ), new THREE.AmbientLight(0xa59f75, 0.6)]);
}

function createSpikesScene() {
  spikes = [createShape(0, 0, 0), createShape(200, 0, -200), createShape(-200, 0, 200)]
  loadObjects(spikes);

  const light = new THREE.DirectionalLight( 0xffffff, 1);
  light.position.set( -100, 500, 400 );
  light.castShadow = true;
  
  const d = 200;
  light.shadowCameraLeft = -d;
  light.shadowCameraRight = d;
  light.shadowCameraTop = d;
  light.shadowCameraBottom = -d;
  
  light.shadowCameraFar = 1000;

  loadObjects([light, new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.6 ), new THREE.AmbientLight(0xa59f75, 0.6)]);
}

spikes = [createShape(0, 0, 0), createShape(200, 0, -200), createShape(-200, 0, 200)];

init();
lighting();
createFloor();

clearScene();
createSpikesScene();

clearScene();
createPlatesScene();

animate();