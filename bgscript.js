// window size / mobile / pixel ratio stuff
var probablyMobile = window.innerWidth < 768 ? true : false;

var dpr = (window.devicePixelRatio === undefined) ? 1 : window.devicePixelRatio;

var lastWindowWidth = window.innerWidth;
var lastWindowHeight = window.innerWidth;

// make global variables
var camera, scene, renderer, composer;
var mesh,big,Crystal;
var light;

// fun stuff
var number = 28; // number of objects
var usecolors = false;
var usewireframe = false;

var color = [];
color[0] = 0xD5819E ; //0xD5819E
color[1] = 0x5F15FF ; //0x5F15FF

// go!
init();
animate();

// initialize three.js 
function init() {

	// do the thing

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight , 0.1, 1000 );
	
	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	renderer.setPixelRatio(dpr);
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	light = new THREE.HemisphereLight(color[0],color[1], 1); 
	light.position.set(-20,20,30);
	scene.add(light);

	//scene.fog = new THREE.Fog(0x4C297A, 1, 500);
	scene.fog = new THREE.Fog(0x000000, 1, 900);

	function Crystal(parentObj) { // thanks christian

		if (usecolors) {
			var material = new THREE.MeshPhongMaterial({shading:THREE.FlatShading,wireframe:usewireframe});
		} else {
			var material = new THREE.MeshNormalMaterial({shading:THREE.FlatShading,wireframe:usewireframe});
		}

		var geometry = new THREE.TetrahedronGeometry(1,THREE.Math.randInt(1, 2)); // randomize complexity between 1 and 2
		var mesh = new THREE.Mesh(geometry, material);

		mesh.position.set(THREE.Math.randFloat(-0.5,0.5), THREE.Math.randFloat(-0.5,0.5), THREE.Math.randFloat(-0.5,0.5)).normalize();
		mesh.position.multiplyScalar(Math.random() * 400);
		mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.01;
		mesh.rotation.x = Math.random() * 360;

		parentObj.add(mesh);

		if(probablyMobile) {
			// On mobile just show the mesh immediately
			mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
		} else {

			// Animate in mesh
			var enterTween = new TWEEN.Tween({scale: 0})
				.to({scale: THREE.Math.randInt(14, 40)}, 1000)
				.easing(TWEEN.Easing.Elastic.Out)
				.onUpdate(function(time) {
					mesh.scale.set(this.scale, this.scale, this.scale);
				})
				.delay(THREE.Math.randInt(200, 8800))
				.start();

		}

	}

	camera.position.set(0,0,400); // x y z

	// the whole thing
	big = new THREE.Object3D();
	scene.add(big);
	for(var i = 0; i < number; i++) {
		new Crystal(big);
	}
}
  
// make it move
function animate(time) {
	requestAnimationFrame(animate);

    //console.log(time);
    
	TWEEN.update(time);

	big.rotation.x += 0.00035;
	big.rotation.y += 0.0005;
	big.rotation.z += 0.0005;

	render();
}
	
function render() {
	
	renderer.render(scene, camera);
	
}

// handle window resize
window.addEventListener('resize', function(e) {

	// Abort if the window size change on mobile was not very large. This keeps
	// us from adjusting things when subtle changes like hiding and showing
	// browser chrome occurs, particularly on mobile devices
	if(probablyMobile) {
		var widthDelta = Math.abs(lastWindowWidth - window.innerWidth);
		var heightDelta = Math.abs(lastWindowHeight - window.innerHeight);

		lastWindowWidth = window.innerWidth;
		lastWindowHeight = window.innerHeight;

		if(widthDelta < 100 && heightDelta < 100) {
			return;
		}
	}

	// Adjust the camera as normal
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
	
	renderer.setSize(window.innerWidth, window.innerHeight);

}, false);

// yay