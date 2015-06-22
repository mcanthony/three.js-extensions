var _3 = function ( options ) {

  if ( typeof THREE === 'undefined' ) {

    console.log( 'Three.js is not available. Download the latest release https://github.com/mrdoob/three.js/ and add it to your page.' );

  } else {

    this.initialize( options );

  }

};

_3.prototype = {};
_3.prototype.initialize = function ( options ) {

  // Get options
  this.options = this.utils.extend( this.defaults, options, this );


  // Get a unique id for the app and for the container
  this.uniqueId = this.options.id || 'app-' + THREE.Math.generateUUID();


  // Init app container
  this.initContainer();


  // Check WebGL support (invalid the app immediately if not supported)
  this.initSupport();


  // Kill the app if webgl is not supported
  if ( !this.invalid ) {

    this.updateSizes();
    initMandatory.call( this );
    initOptional.call( this );
    console.log( this.options );

  }

};


function initMandatory() {

  this.scene = this.initScene();
  this.camera = this.initCamera();
  this.renderer = this.initRenderer();

}


function initOptional() {

  // Basic material
  if ( this.options.defaultMaterial ) {

    this.defaultMaterial = this.initDefaultMaterial();

  }

  // Basic lighting (ambient + directional)
  if ( this.options.lights ) {

    this.initLights();

  }

  // Orbit Controls
  if ( this.options.orbitControls ) {

    this.initOrbitControls();

  }

  // Events
  this.initEvents();

  // Stats
  if ( this.options.stats ) {

    this.initStats();

  }


}
_3.prototype.play = function () {

  // Fail immediately if the application has been invalidated in the constructor (because THREE is not available)
  if ( this.invalid ) return;


  // Run setup only once
  if ( this.setup && !this.notFirstimeSetup ) {

    this.notFirstimeSetup = true;
    this.setup();

  }

  // Run draw at every frame
  if ( this.draw ) {

    if ( !this.notFirstimeDraw ) {

      this.clock = new THREE.Clock();
      this.clock.start();
      this.time = this.clock.getElapsedTime();
      this.frame = 0;
      this.notFirstimeDraw = true;

    }

    this.paused = false;
    this.animate();

  }

};

_3.prototype.pause = function () {

  this.paused = true;
  this.clock.stop();

};
_3.prototype.animate = function () {

  if ( !this.paused ) {
    requestAnimationFrame( this.animate.bind( this ) );

    // Update time and frames
    this.time = this.clock.getElapsedTime();
    this.frame += 1;

    // Call the user draw function
    this.draw( this.time, this.frame );

    // Render
    this.renderer.render( this.scene, this.camera );

    // Update stats
    if ( this.stats ) {
      this.stats.update();
    }

  }

};
_3.prototype.defaults = {

  // Container options
  container: null, // dom element to contain the canvas (if null, a new div will be created and added to the body)
  backgroundColor: '#ffffff', // Dom container background-color
  className: 'container',

  // Renderer options
  canvas: null, // Dom canvas element for the renderer
  fullscreen: true,
  width: null,
  height: null,
  defaultWidth: 640,
  defaultHeight: 480,
  alpha: true,
  antialias: true,
  gammaInput: true,
  gammaOutput: true,
  clearColor: '#cccccc',
  clearColorAlpha: 1.0,

  // Camera options ( this.camera )
  fov: 45, // Camera frustum vertical field of view.
  near: 1, // Camera frustum near plane.
  far: 10000, // Camera frustum far plane.
  cameraX: 0,
  cameraY: 0,
  cameraZ: 2000,

  // Scene options ( this.scene )
  sceneFog: null, // THREE.Fog or THREE.FogExp2 object

  // Debug helpers
  stats: true, // Requires Stats from https://github.com/mrdoob/stats.js/

  // Camera controls
  orbitControls: true, // Requires OrbitControl.js

  // Gui
  gui: true, // Requires dat.gui.js

  // Mouse events
  mouseEvents: true,

  // Touch events
  touchEvents: true,

  // Resize event
  resizeEvents: true,

  // Support
  checkWebglSupport: true, // if true, check webgl support
  webglSupportError: 'Your browser or graphics card does not seem to support WebGL.',

  // Override THREE.js mandatory init functions
  initCamera: null, // Override camera initialization: must return a THREE.PerspectiveCamera
  initScene: null, // Override scene initialization: must return a THREE.Scene
  initRenderer: null, // Override renderer initialization: must return a THREE.WebGLRenderer

  // Override THREE.js optional init functions
  defaultMaterial: true, // Run initMaterial(). Returns a single THREE material ( this.defaultMaterial )
  initDefaultMaterial: null, // Override basic material initialization: must return a single THREE material object
  lights: true, // Run initLights(). Adds basic lighting (ambient + directional) to the scene
  initLights: null, // Override lights initialization (lights must be added to the scene manually)

  // Basic material
  materialType: 'Lambert', // can be Basic, Lambert, Phong
  materialColor: '#ffffff', // geometry color in hexadecimal. Default is 0xffffff.
  textureMap: null, // Sets the texture map. Default is null
  lightMap: null, // Set light map. Default is null.
  specularMap: null, // Set specular map. Default is null.
  alphaMap: null, // Set alpha map. Default is null.
  envMap: null, // Set env map. Default is null.
  materialFog: true, // Define whether the material color is affected by global fog settings. Default is true.
  shading: THREE.SmoothShading, // Define shading type. Default is THREE.SmoothShading.
  wireframe: false, // render geometry as wireframe. Default is false.
  wireframeLinewidth: 1, // Line thickness. Default is 1.
  wireframeLinecap: 'round', // Define appearance of line ends. Default is 'round'.
  wireframeLinejoin: 'round', // Define appearance of line joints. Default is 'round'.
  vertexColors: THREE.NoColors, // Define how the vertices gets colored. Default is THREE.NoColors.
  skinning: false, // Define whether the material uses skinning. Default is false.
  morphTargets: false, // Define whether the material uses morphTargets. Default is false.

  materialSide: THREE.FrontSide,

  // Only Phong material
  shininess: 30,
  specular: null,
  emissive: null
};
_3.prototype.utils = {

  isFunction: function(variable) {
    var getType = {};
    return variable && getType.toString.call(variable) === '[object Function]';
  },

  /**
   * Merge defaults with user options and changes scope of functions
   * @param defaults {Object} Default settings
   * @param options {Object} User options
   * @param scope {Object} The object that all the functions should be bound to.
   * @returns {Object} Merged values of defaults and options
   */
  extend: function (defaults, options, scope) {
    var extended = {};
    var prop;
    for (prop in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
        if (scope && this.isFunction(defaults[prop])) {
          extended[prop] = defaults[prop].bind(scope);
        } else {
          extended[prop] = defaults[prop];
        }
      }
    }
    for (prop in options) {
      if (Object.prototype.hasOwnProperty.call(options, prop)) {
        if (scope && this.isFunction(options[prop])) {
          extended[prop] = options[prop].bind(scope);
        } else {
          extended[prop] = options[prop];
        }
      }
    }
    return extended;
  }
};
_3.prototype.initMouseEvents = function () {
  document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
};

_3.prototype.onDocumentMouseMove = function (event) {
  this.mouseX = event.clientX - this.windowHalfX;
  this.mouseY = event.clientY - this.windowHalfY;
};
_3.prototype.initTouchEvents = function() {
  document.addEventListener('touchstart', this.onDocumentTouchStart.bind(this), false);
  document.addEventListener('touchmove', this.onDocumentTouchMove.bind(this), false);
};

_3.prototype.onDocumentTouchStart = function (event) {
  if (event.touches.length === 1) {
    event.preventDefault();
    this.mouseX = event.touches[ 0 ].pageX - this.windowHalfX;
    this.mouseY = event.touches[ 0 ].pageY - this.windowHalfY;
  }
};

_3.prototype.onDocumentTouchMove = function (event) {
  if (event.touches.length === 1) {
    event.preventDefault();
    this.mouseX = event.touches[ 0 ].pageX - this.windowHalfX;
    this.mouseY = event.touches[ 0 ].pageY - this.windowHalfY;
  }
};
_3.prototype.initResizeEvents = function () {

  window.addEventListener( 'resize', this.onResize.bind( this ), false );

};


_3.prototype.updateSizes = function () {

  if ( this.options.width && this.options.height ) {

    this.options.fullscreen = false;
    this.width = this.options.width;
    this.height = this.options.height;

  } else if ( this.options.fullscreen ) {

    this.width = window.innerWidth;
    this.height = window.innerHeight;

  } else {

    this.width = this.options.defaultWidth;
    this.height = this.options.defaultHeight;

  }

  this.centerX = this.width / 2;
  this.centerY = this.height / 2;

};


_3.prototype.onResize = function () {

  this.updateSizes();

  // Update container
  this.container.style.width = this.width + 'px';
  this.container.style.height = this.height + 'px';

  // Update camera
  this.camera.aspect = this.width / this.height;
  this.camera.updateProjectionMatrix();

  // Update canvas/renderer
  this.renderer.setSize( this.width, this.height );

};


_3.prototype.fullscreen = function () {

  this.options.fullscreen = true;

  this.options.width = null;
  this.options.height = null;
  this.width = null;
  this.height = null;

  this.onResize();

  document.body.style.overflow = 'hidden';

};


_3.prototype.resize = function ( w, h ) {

  this.options.fullscreen = false;

  this.options.width = w;
  this.options.height = h;
  this.width = w;
  this.height = h;

  this.onResize();

  document.body.style.overflow = '';

};
_3.prototype.initSupport = function () {

  if ( this.invalid ) return;

  if ( this.options.checkWebglSupport ) {

    checkWebglSupport();

  }

};


function checkWebglSupport() {

  /**
   * Credits:
   * @author alteredq / http://alteredqualia.com/
   * @author mr.doob / http://mrdoob.com/
   */

  var canvas = !!window.CanvasRenderingContext2D;
  var webglSupport = (function () {
    try {
      var canvas = document.createElement( 'canvas' );
      return !!( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );
    } catch ( e ) {
      return false;
    }
  })();

  if ( !webglSupport ) {

    this.invalid = true;
    this.appendSupportMessage( this.options.webglSupportError );
    THREE.error( this.options.webglSupportError );

  }

}


_3.prototype.appendSupportMessage = function ( message ) {

  var element = document.createElement( 'div' );
  element.className = 'support-message';
  element.style.textAlign = 'center';
  element.style.background = '#FFF';
  element.style.color = '#000';
  element.style.padding = '20px';
  element.innerHTML = message;

  this.container.appendChild( element );

};
_3.prototype.initContainer = function () {

  if ( this.invalid ) return;

  if ( this.options.container ) {

    this.container = this.options.container;

  } else {

    this.container = document.createElement( 'div' );
    this.container.id = this.uniqueId;
    this.container.className = this.options.className;

    // Resize container if width and height are defined
    if ( this.options.width && this.options.height ) {

      this.container.style.width = this.options.width + 'px';
      this.container.style.height = this.options.height + 'px';

    }

    document.body.appendChild( this.container );

  }

  // Container background color
  if ( this.options.backgroundColor ) {

    this.container.style.backgroundColor = this.options.backgroundColor;

  }

};

_3.prototype.initCamera = function () {

  if ( this.invalid ) return;

  // Override
  if ( this.options.initCamera ) {

    if ( this.utils.isFunction( this.options.initCamera ) ) {

      return this.options.initCamera();

    } else {

      THREE.error( 'The initCamera option is not a function.' );
      this.invalid = true;
      return;

    }

  }

  // Init camera
  var fov = this.options.fov;
  var aspect = this.width / this.height;
  var near = this.options.near;
  var far = this.options.far;

  var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
  camera.position.x = this.options.cameraX;
  camera.position.y = this.options.cameraY;
  camera.position.z = this.options.cameraZ;

  return camera;

};
_3.prototype.initOrbitControls = function () {

  if ( this.invalid ) return;

  if ( typeof THREE.OrbitControls !== 'undefined' ) {

    if ( this.options.orbitControls ) {

      this.controls = new THREE.OrbitControls( this.camera, this.container );

    }
  } else {

    THREE.error('THREE.OrbitControls is not available. Set orbitControls to false in the options or add it with \<script\> tag before running your script.');

  }

};
_3.prototype.initEvents = function() {

  if ( this.invalid ) return;

  if (this.options.mouseEvents) {
    this.initMouseEvents();
  }

  if (this.options.touchEvents) {
    this.initTouchEvents();
  }

  if (this.options.resizeEvents) {
    this.initResizeEvents();
  }

};
_3.prototype.initLights = function () {

  if ( this.invalid ) return;

  // Override
  if ( this.options.initLights ) {

    if ( this.utils.isFunction( this.options.initLights ) ) {

      return this.options.initLights();

    } else {

      THREE.error( 'The initLights option is not a function.' );
      this.invalid = true;
      return;

    }

  }

  // Init basic lights
  var ambient = new THREE.AmbientLight( 0x999999 );
  var directionalLight = new THREE.DirectionalLight( 0x666666 );
  directionalLight.position.set( 1, 1, 1 );

  this.scene.add( ambient );
  this.scene.add( directionalLight );

};


_3.prototype.initDefaultMaterial = function () {

  if ( this.invalid ) return;

  var materialType = this.options.materialType;
  var options = {
    color: this.options.materialColor, // geometry color in hexadecimal. Default is 0xffffff.
    map: this.options.textureMap, // Sets the texture map. Default is null
    lightMap: this.options.lightMap, // Set light map. Default is null.
    specularMap: this.options.specularMap, // Set specular map. Default is null.
    alphaMap: this.options.alphaMap, // Set alpha map. Default is null.
    envMap: this.options.envMap, // Set env map. Default is null.
    fog: this.options.materialFog, // Define whether the material color is affected by global fog settings. Default is true.
    shading: this.options.shading, // Define shading type. Default is THREE.SmoothShading.
    wireframe: this.options.wireframe, // render geometry as wireframe. Default is false.
    wireframeLinewidth: this.options.wireframeLinewidth, // Line thickness. Default is 1.
    wireframeLinecap: this.options.wireframeLinecap, // Define appearance of line ends. Default is 'round'.
    wireframeLinejoin: this.options.wireframeLinejoin, // Define appearance of line joints. Default is 'round'.
    vertexColors: this.options.vertexColors, // Define how the vertices gets colored. Default is THREE.NoColors.
    skinning: this.options.skinning, // Define whether the material uses skinning. Default is false.
    morphTargets: this.options.morphTargets, // Define whether the material uses morphTargets. Default is false.

    side: this.options.materialSide,

    // Only Phong
    shininess: this.options.shininess,
    specular: this.options.specular,
    emissive: this.options.emissive
  };
  var material;

  if ( materialType === 'Lambert' ) {

    material = new THREE.MeshLambertMaterial( options );

  } else if ( materialType === 'Phong' ) {


    material = new THREE.MeshPhongMaterial( options );

  } else {

    material = new THREE.MeshBasicMaterial( options );

  }

  return material;

};
_3.prototype.initRenderer = function () {

  if ( this.invalid ) return;

  // Override
  if ( this.options.initRenderer ) {

    if ( this.utils.isFunction( this.options.initRenderer ) ) {
      return this.options.initRenderer();
    } else {
      this.invalid = true;
      return;
    }

  }

  // Remove scrollbars if fullscreen
  if ( this.options.fullscreen ) {
    document.body.style.overflow = 'hidden';
  }

  // Create WebGL renderer
  var renderer = new THREE.WebGLRenderer( {
    domElement: this.options.canvas,
    antialias: this.options.antialias,
    alpha: this.options.alpha
  } );

  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( this.width, this.height );
  renderer.setClearColor( this.options.clearColor, this.options.clearColorAlpha ); // hex color, alpha
  renderer.gammaInput = this.options.gammaInput;
  renderer.gammaOutput = this.options.gammaOutput;

  if ( !this.options.canvas ) {

    this.container.appendChild( renderer.domElement );

  }

  return renderer;

};
_3.prototype.initScene = function () {

  if ( this.invalid ) return;

  // Override
  if ( this.options.initScene ) {

    if ( this.utils.isFunction( this.options.initScene ) ) {
      return this.options.initScene();
    } else {
      this.invalid = true;
      return;
    }

  }

  // Init scene
  var scene = new THREE.Scene();

  if ( this.options.sceneFog )
    scene.fog = this.options.fog;

  return scene;

};
_3.prototype.initStats = function () {

  if ( this.invalid ) return;

  if (typeof Stats !== 'undefined') {

    if (this.options.stats) {

      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '0px';
      this.container.appendChild(this.stats.domElement);

    }

  } else {

    THREE.error('Stats is not available. Set stats to false in the options or download it https://github.com/mrdoob/stats.js/ and load it with \<script\> tag before running your script.');

  }

};
_3.prototype.initGui = function () {

  if ( this.invalid ) return;



};