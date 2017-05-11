var camera, scene, controls,controls2, renderer;
var texture_placeholder;
var accelerationX = accelerationY = accelerationZ = 0;

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
    loader.setPath( 'tex/cube/skybox/' );

    var textureCube = loader.load( [
        'nx.jpg', 'px.jpg',
        'ny.jpg', 'py.jpg',
        'pz.jpg', 'nz.jpg'
    ] );

    var materials = [

        loadTexture( 'textures/cube/skybox/px.jpg' ), // right
        loadTexture( 'textures/cube/skybox/nx.jpg' ), // left
        loadTexture( 'textures/cube/skybox/py.jpg' ), // top
        loadTexture( 'textures/cube/skybox/ny.jpg' ), // bottom
        loadTexture( 'textures/cube/skybox/pz.jpg' ), // back
        loadTexture( 'textures/cube/skybox/nz.jpg' )  // front

    ];

    mesh = new THREE.Mesh( new THREE.BoxGeometry(1000, 1000, 1000 ,1,1,1), materials[1]);
    mesh.scale.x = - 1;
    scene.add( mesh );
    // scene.background = mesh;
    light = new THREE.AmbientLight(0xFFFFFF, 0.5);
    scene.add(light);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    controls = new THREE.DeviceOrientationControls(camera);
    controls2 = new THREE.OrbitControls(camera, renderer.domElement);
    document.body.appendChild( renderer.domElement );
    camera.position.x = 0.00000001;


}


function loadTexture( path ) {

    var texture = new THREE.Texture( texture_placeholder );
    var material = new THREE.MeshBasicMaterial( { map: texture} );

    var image = new Image();
    image.onload = function () {

        texture.image = this;
        texture.needsUpdate = true;

    };
    image.src = path;

    return material;

}

function animate() {

    requestAnimationFrame( animate );
    update();

}


function update() {

    renderer.render( scene, camera );
    controls.update();
    controls2.update();
}

window.ondeviceorientation = function (event) {
    accelerationX = event.beta* (Math.PI / 180);
    accelerationY = event.gamma* (Math.PI / 180);
    accelerationZ = event.alpha* (Math.PI / 180);
}