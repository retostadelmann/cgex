var camera, scene, renderer;
var geometry, material, mesh;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 40);
    camera.position.z = 20;

    scene = new THREE.Scene();

    var CapsuleControls = function() {
        this.radiusTop = 1.1;
        this.radiusBottom = 1.1;
        this.height = 6.2;
        this.radialSegments = 16;
        this.heightSegments = 16;
        this.capsTopSegments = 5;
        this.capsBottomSegments = 5;
        this.thetaStart = 0;
        this.thetaLength = 2*Math.PI;
    };

    var capsuleControls = new CapsuleControls();

    geometry = new THREE.CapsuleBufferGeometry(
        capsuleControls.radiusTop,
        capsuleControls.radiusBottom,
        capsuleControls.height,
        capsuleControls.radialSegments,
        capsuleControls.heightSegments,
        capsuleControls.capsTopSegments,
        capsuleControls.capsBottomSegments,
        capsuleControls.thetaStart,
        capsuleControls.thetaLength
    );

    //geometry = new THREE.BoxGeometry( 10, 10, 10);
    let loader = new THREE.TextureLoader();

    material = new THREE.MeshBasicMaterial({
        map: loader.load('PickleRick.jpg'),
    });

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

}

function animate() {

    requestAnimationFrame( animate );

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render( scene, camera );

}