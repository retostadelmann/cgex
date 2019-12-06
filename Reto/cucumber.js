var camera, scene, renderer;
var geometry, material, mesh;
var step = 0;

init();
animate();

function init() {
    renderer = new THREE.WebGLRenderer( { antialias: true } );

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

    let loader = new THREE.TextureLoader();

    // Rick Texture
    material = new THREE.MeshPhongMaterial({
        map: loader.load('PickleRick.jpg'),
        bumpMap: loader.load('bumpmap.jpg'),
        bumpScale: 0.05,
        wireframe: true
    });

    // Add object to scene
    mesh = new THREE.Mesh( geometry, material );
    mesh.position.y = -7;
    mesh.rotation.y = 1.8;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );

    // Add Floor
    var floor = new THREE.Mesh(
        new THREE.PlaneGeometry(10,10,10,10),
        new THREE.MeshPhongMaterial({color: 'white'} )
    );
    floor.position.y = -12;
    floor.position.x = -5;
    floor.rotation.x -= Math.PI / 2;
    floor.receiveShadow = true;
    //scene.add(floor);

    // BG Texture
    const bgTexture = loader.load('bg.png');
    scene.background = bgTexture;

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    {
        const color = 0xFFFFFF;
        const intensity = 1.2;
        const light = new THREE.DirectionalLight(color, intensity);
        light.castShadow = true;
        light.position.set(-10, 20, 4);
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 80;
        scene.add(light);
    }

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.rotateSpeed = .5;
    controls.enableDamping = true;
    controls.dampingFactor = .05;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
}

function animate() {

    requestAnimationFrame( animate );
    controls.update();

    mesh.rotation.y += -0.01;

    mesh.position.y += Math.sin(step) / 10;
    mesh.position.x += -0.01;
    mesh.position.z += -0.00075;

    renderer.render( scene, camera );
    step = step + 0.1;
}