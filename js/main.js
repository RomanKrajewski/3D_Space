var camera, scene, orientationControls, orbitControls, renderer;
var texture_placeholder;
var accelerationX = accelerationY = accelerationZ = 0;
var fingercontrols;

init();
animate();


function init() {

    var  mesh, hemisphereLight;


    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );

    scene = new THREE.Scene();

    texture_placeholder = document.createElement( 'canvas' );
    texture_placeholder.width = 128;
    texture_placeholder.height = 128;

    var context = texture_placeholder.getContext( '2d' );
    context.fillStyle = 'rgb( 0, 200, 200 )';
    context.fillRect( 0, 0, texture_placeholder.width, texture_placeholder.height );

    var loader = new THREE.CubeTextureLoader();
    loader.setPath( './tex/cube/skybox/' );

    var materials = [

        loadTexture( './tex/cube/skybox/px.jpg' ), // right
        loadTexture( './tex/cube/skybox/nx.jpg' ), // left
        loadTexture( './tex/cube/skybox/py.jpg' ), // top
        loadTexture( './tex/cube/skybox/ny.jpg' ), // bottom
        loadTexture( './tex/cube/skybox/pz.jpg' ), // back
        loadTexture( './tex/cube/skybox/nz.jpg' )  // front

    ];

    mesh = new THREE.Mesh( new THREE.CubeGeometry(1000, 1000, 1000 ), materials);

    mesh.scale.x = - 1;
    var standardMaterial = new THREE.MeshStandardMaterial( {color:0xFFFFFF, roughness:1, metalness:0.6} );
    // platform = new THREE.Mesh(new THREE.CubeGeometry(20, 1, 20), standardMaterial);
    // platform.position.y = -5;
    var platform = new THREE.Mesh(new THREE.ExtrudeGeometry(generatePentagon(40), {amount:0.5}), standardMaterial);
    var podest = new THREE.Mesh(new THREE.ExtrudeGeometry(generatePentagon(20), {amount:0.5}), standardMaterial);
    var podest2 = new THREE.Mesh(new THREE.ExtrudeGeometry(generatePentagon(8), {steps: 1, amount:13, bevelEnabled:false}), standardMaterial);
    podest.rotation.z = toRadians(180);
    podest.rotation.x = toRadians(90);
    podest.position.y = -20;
    podest.position.z = 45;
    podest.position.x = -15;
    // podest2.rotation.z = toRadians(180);
    podest2.rotation.x = toRadians(90);
    podest2.position.y = -2;
    podest2.position.z = 45;
    podest2.position.x = -15;
    podest2.castShadow = true;
    podest.receiveShadow = true;
    platform.rotation.x = toRadians(90);
    platform.position.y = -20;
    scene.add( mesh );
    scene.add(platform);
    scene.add(podest);
    scene.add(podest2);
    // scene.background = mesh;
    // light = new THREE.HemisphereLight(0xfefdc4, 0x7f848a,  1);
    hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF,  1);
    spotLight = new THREE.SpotLight(0xfefdc4,1,20, toRadians(90), 0,0);
    spotLight.position.z = 5;
    spotLight.position.y = 10;
    spotLight.position.x = 20;
    spotLight.castShadow = true;
    spotLight.shadowCameraVisible = true;
    var d = 200;

    spotLight.shadowCameraLeft = -d;
    spotLight.shadowCameraRight = d;
    spotLight.shadowCameraTop = d;
    spotLight.shadowCameraBottom = -d;

    spotLight.shadowCameraFar = 1000;
    spotLight.shadowDarkness = 0.2;

    scene.add(hemisphereLight);
    scene.add(spotLight);
    spotLight.target = platform;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    orientationControls = new THREE.DeviceOrientationControls(camera);
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    document.getElementById("canvas_wrapper").appendChild( renderer.domElement );
    camera.position.y = 0.1 ;

    fingercontrols = document.getElementById("fingercontrolswitch");
}


function loadTexture( path ) {
    var texture = new THREE.Texture( );
    var material = new THREE.MeshBasicMaterial( { map: texture} );
    var image = new Image();
    image.onload = function () {
        texture.image = this;
        texture.needsUpdate = true;
    };
    image.src = path;
    return material;
}

function toRadians(deg){
    return deg*(Math.PI/180)
}

function generatePentagon(radius){
    var shape = new THREE.Shape();
    shape.autoClose = true;
    shape.moveTo(radius, 0);
    var angle = 0;
    for(var i = 0; i<4; i++){
        angle += toRadians(72);
        shape.lineTo(radius*Math.cos(angle), radius*Math.sin(angle));
    }
    shape.lineTo(radius,0);
    return shape
}

function animate() {
    requestAnimationFrame( animate );
    update();
}


function update() {
    renderer.render( scene, camera );
    if(fingercontrols.checked){
        orbitControls.enabled = true;
        // orientationControls.enabled = true;
    }
    else {
        orbitControls.enabled = false;
        orientationControls.update();
    }
}