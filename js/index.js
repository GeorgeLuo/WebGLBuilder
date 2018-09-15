let scene,
    renderer,
    container,
    width,
    height;

let camera,
    fov, aspect, near, far;

var spikes

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

function render() {

  rotateSpikes();
  flashShape(1);

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


function init() {

  width = window.innerWidth;
  height = window.innerHeight;
  
  fov = 50;
  aspect = width / height;
  near = 1;
  far = 2000;
  
  scene = new THREE.Scene();
  for (i = 0; i < spikes.length; i++) { 
    scene.add(spikes[i]);
  }
  
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.x = 300;
  camera.position.z = 300;
  camera.position.y = 200;
  camera.lookAt(new THREE.Vector3(0,0,0));
    
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;

  container = document.getElementById('scene');
  container.appendChild(renderer.domElement);

  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
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

spikes = [createShape(0, 0, 0), createShape(200, 0, -200), createShape(-200, 0, 200)];

init();
lighting();
createFloor();

animate();