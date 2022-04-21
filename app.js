            import * as THREE from 'https://unpkg.com/three/build/three.module.js';
			import { ARButton } from 'https://unpkg.com/three/examples/jsm/webxr/ARButton.js';
			import {VTKLoader} from './loaders/VTKLoader.js';

			var container;
			var camera, scene, renderer;
			var controller;

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );

				var light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
				light.position.set( 0.5, 1, 0.25 );
				scene.add( light );

				// renderer

				renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.xr.enabled = true;
				container.appendChild( renderer.domElement );

				//

				document.body.appendChild( ARButton.createButton( renderer ) );

				//

				// test with vtk brain mesh
				const loader = new VTKLoader();
				loader.load("./resources/rh.vtk", function (geometry) {
					geometry.center();
					geometry.computeVertexNormals();
					console.log(geometry)
					const material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
					const mesh = new THREE.Mesh(geometry, material);
					mesh.position.set( 0, 0, -2 ).applyMatrix4( controller.matrixWorld ); // position the mesh
					mesh.quaternion.setFromRotationMatrix( controller.matrixWorld );
					mesh.scale.multiplyScalar(0.002);
					//Rotating mesh by 90 degree in X axis.
					mesh.rotateX( -Math.PI / 2 );
					scene.add( mesh );
				});

				// // if brain mesh is stl file
				// // STL
				// const loader1 = new THREE.STLLoader();
				// loader1.load(window.filePath, function ( geometry ) {
				// 	geometry.center()
				// 	const material = new THREE.MeshLambertMaterial({color: 0x55B663});
				// 	stlMesh = new THREE.Mesh(geometry, material);
				// 	camera.position.z = geometry.boundingBox.size().z+300
				// 	//stlMesh.translateY()
				// 	scene.add(stlMesh);
				// });

				// var geometry = new THREE.CylinderBufferGeometry( 0, 0.05, 0.2, 32 ).rotateX( Math.PI / 2 );

				// function onSelect() {
				//
				// 	var material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
				// 	var mesh = new THREE.Mesh( geometry, material );
				// 	mesh.position.set( 0, 0, - 0.3 ).applyMatrix4( controller.matrixWorld );
				// 	mesh.quaternion.setFromRotationMatrix( controller.matrixWorld );
				// 	scene.add( mesh );
				//
				// }

				controller = renderer.xr.getController( 0 );
				// controller.addEventListener( 'select', onSelect );
				scene.add( controller );
				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function animate() {

				renderer.setAnimationLoop( render );

			}

			function render() {

				renderer.render( scene, camera );

			}
