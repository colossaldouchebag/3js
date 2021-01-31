// Importing necessary modules
 import * as THREE from '/build/three.module.js';
 import {OrbitControls} from '/jsm/controls/OrbitControls.js';

//Creating a scene
var scene = new THREE.Scene();

//Initialising a camera and setting it up
 var camera = new THREE.PerspectiveCamera (75, window.innerWidth/window.innerHeight, 0.1, 10000);
 scene.add(camera);
 camera.position.set(-500,900,-1700);

//Initialising a renderer and setting it up
 var renderer = new THREE.WebGLRenderer ();
 renderer.setSize (window.innerWidth, window.innerHeight);
 document.body.appendChild(renderer.domElement);

//EventListener for resizing
window.addEventListener('resize', ()=>{window.location.reload()});

//Axis helper
//const axis = new THREE.AxesHelper( 1000 );
//scene.add( axis );

//Adding controls for user interaction
var controls = new OrbitControls(camera, renderer.domElement);

//Creating all the objects and setting their position in scene
 var geometry_s = new THREE.SphereGeometry(5000, 64,64);
 var material_s = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('galaxy_starfield.png'), side: THREE.DoubleSide});
 var starfield = new THREE.Mesh (geometry_s, material_s);
 scene.add(starfield);

var sun_geom = new THREE.SphereGeometry (150, 32, 32);
var sun_mat = new THREE.MeshBasicMaterial ({map : new THREE.TextureLoader().load('sun_detailed.jpg'), side: THREE.DoubleSide});
var sun = new THREE.Mesh (sun_geom, sun_mat);
sun.position.set(0,0,0);
scene.add(sun);

 var earth_geom = new THREE.SphereGeometry (50, 32, 32);
 var earth_mat = new THREE.MeshPhongMaterial ({map : new THREE.TextureLoader().load('earth_terrain_4k.jpg'), side: THREE.DoubleSide, color: 0xaaaaaa,
 shininess: 25});
 var earth = new THREE.Mesh (earth_geom, earth_mat);
 earth.position.set(800,0,0);
 scene.add(earth);

var geometry_m = new THREE.SphereGeometry (20 , 32 , 32);
var material_m = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('moon_4k.jpg'), side: THREE.FrontSide, color: 0xaaaaaa, shininess:25});
var moon = new THREE.Mesh(geometry_m, material_m);
moon.position.set(800,0,0);
earth.add(moon);

//Setting up lighting
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

const light_p = new THREE.PointLight( 0xffffff, 6, 4000 );
light_p.position.set( 0, 0, 0 );
scene.add( light_p );

//Function for building orbits for planets
var orbits = function(name, radius, delta){
    var theta =0;
    var diff = 2 * Math.PI / delta;
    var material_o = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
    var geometry_o = new THREE.RingGeometry(800, radius+6,32);
    // for (theta; theta<= 2 * Math.PI; theta+=diff){
    //     geometry_o.vertices.push(new THREE.Vector3(radius * Math.cos(theta)*1.8, 0, radius * Math.sin(theta)));
    // }
    var orbit = new THREE.Mesh(geometry_o, material_o);
    orbit.rotation.x = Math.PI/2;
    scene.add(orbit);
}
orbits(earth, 800, 3000);

//Making the planet revolve around the sun in their respective orbit
var theta_earth = 0;
var revolution_earth = function(radius, delta, name){
    var diff = 2 * Math.PI/delta;
    name.position.x = radius * Math.cos(theta_earth) ;
    name.position.z = radius * Math.sin(theta_earth);
    
    theta_earth+=diff;

}

var theta_m = 0;

var revolution_moon = function(radius, delta, name){
    var mtheta = 2 * Math.PI/delta;
    name.position.x = radius * Math.cos(theta_earth) * 1.2;
    name.position.z = radius * Math.sin(theta_earth);
    
    theta_m+=mtheta;

}

//Using Raycaster to select objects in scene with mouse
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove(event){
    
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
}

// window.addEventListener('click', onMouseMove, false);

//Declaring a function to follow planets
var FollowPlanet = function(name){
    camera.position.x = name.position.x + 100;
    camera.position.y = name.position.y + 100;
    camera.position.z = name.position.z + 100;
    
    camera.lookAt(name.position);
}

//Event listener to come out of following the planet
var earth_flag = 0;

document.addEventListener("keydown", function(event) {
    if(event.keyCode === 27){
       //Esc key was pressed
        console.log('esc working');
        earth_flag=0;
        
        document.getElementById('earth_text').style.display = 'none';
                
   }
});


function animate(){
    //Rotating the earth about itself and revolution
    earth.rotation.y += 0.01;
    revolution_earth(800, 3000, earth);
    revolution_moon(90, 1000, moon);

    //Using raycasting to select the object
    raycaster.setFromCamera (mouse, camera);
    const intersects = raycaster.intersectObjects ([earth]);
    //console.log(intersects);
    if (intersects[0]){
        console.log(intersects[0].object.geometry.id);
        switch(intersects[0].object.geometry.id){
            case 15:{
                console.log('earth flag');
                earth_flag=1;
                
                break;
            }
            
            default:{
                
                earth_flag=0;
                
                
            }


        }

    }

    if (earth_flag==1){
        FollowPlanet(earth);
        document.getElementById('earth_text').style.display = 'block'
        
    } else {
        controls.update();
    }

    //Updating the renderer
     renderer.render(scene,camera);
     requestAnimationFrame(animate);
}
animate();
