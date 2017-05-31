var camera, scene, orientationControls, orbitControls, renderer;
var texture_placeholder;
var accelerationX = accelerationY = accelerationZ = 0;
var fingercontrols;

init();
animate();


function init() {

    var  mesh, light;


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
    var standardMaterial = new THREE.MeshStandardMaterial( {color:0xE80C7A, roughness:0.3, metalness:0.7} );
    // platform = new THREE.Mesh(new THREE.CubeGeometry(20, 1, 20), standardMaterial);
    // platform.position.y = -5;
    var platform = new THREE.Mesh(new THREE.ExtrudeGeometry(generatePentagon(10), {amount:1}), standardMaterial);
    platform.position.z = -50;
    scene.add( mesh );
    scene.add(platform);
    // scene.background = mesh;
    // light = new THREE.HemisphereLight(0xfefdc4, 0x7f848a,  1);
    light = new THREE.HemisphereLight(0xfefdc4, 0xfefdc4,  1);
    scene.add(light);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    orientationControls = new THREE.DeviceOrientationControls(camera);
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    document.getElementById("canvas_wrapper").appendChild( renderer.domElement );
    camera.position.y = 1 ;

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

function generatePentagon(radius){
    var shape = new THREE.Shape();
    shape.autoClose = true;
    shape.moveTo(radius, 0);
    var angle = 0;
    for(var i = 0; i<4; i++){
        angle += (72*(Math.PI/180));
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

// window.ondeviceorientation = function (event) {
//     accelerationX = event.beta* (Math.PI / 180);
//     accelerationY = event.gamma* (Math.PI / 180);
//     accelerationZ = event.alpha* (Math.PI / 180);
// }