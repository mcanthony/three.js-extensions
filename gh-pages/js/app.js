var app = new _3( {

  //  override any option here
  //  width: 640,
  //  height: 480
  //  fullscreen: false
  stats: false

} );

app.setup = function () {

  // By default here you have:
  // - this.camera
  // - this.scene
  // - this.renderer
  // - this.defaultMaterial

  var geometry = new THREE.BoxGeometry( 150, 150, 150 );
  this.mesh = new THREE.Mesh( geometry, this.defaultMaterial );
  this.scene.add( this.mesh );

};

app.draw = function ( time, frame ) {

  this.mesh.rotation.x += 0.01;
  this.mesh.rotation.y += 0.02;

};

app.play();