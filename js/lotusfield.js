var LotusField = function() {
  var color = new THREE.Vector3(1.0, 0.2, 1.0);
  var numLotuses = 10;
  var xoff = 0,
    yoff = 0;
  var petals = [];
  var numPetals = 11;
  var vertexCount = 0;
  var radius = 700
  var petalHeight = 50
  var lotuses = [];
  var mainLotusOffset = 100
  var lotusRiseTime = 156000

  var petalShape = new THREE.Shape(); // From http://blog.burlock.org/html5/130-paths
  //262, 16
  var x = 262;
  petalShape.moveTo(xoff, yoff);
  //aCP1x, aCP1y,aCP2x, aCP2y,aX, aY 
  petalShape.bezierCurveTo(x - 254 + xoff, 3 + yoff, x - 258 + xoff, 49 + yoff, x - 256 + xoff, 34 + yoff);
  petalShape.bezierCurveTo(x - 254 + xoff, 19 + yoff, x - 240 + xoff, 94 + yoff, x - 240 + xoff, 114 + yoff);
  petalShape.bezierCurveTo(x - 240 + xoff, 135 + yoff, x - 228 + xoff, 175 + yoff, x - 281 + xoff, 172 + yoff);
  petalShape.bezierCurveTo(x - 296 + xoff, 171 + yoff, x - 310 + xoff, 125 + yoff, x - 302 + xoff, 106 + yoff);
  petalShape.bezierCurveTo(x - 296 + xoff, 92 + yoff, x - 283 + xoff, 48 + yoff, x - 273 + xoff, 36 + yoff);
  petalShape.bezierCurveTo(x - 263 + xoff, 24 + yoff, x - 275 + xoff, 9 + yoff, x - 266 + xoff, 21 + yoff);

  //bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5, curveSegments: 12
  var extrudeSettings = {
    amount: 1,
    bevelEnabled: false
  }

  var geo = new THREE.ExtrudeGeometry(petalShape, extrudeSettings);
  // geo.applyMatrix( new THREE.Matrix4().makeTranslation( new THREE.Vector3(0, 0, 0) ) );

  function createShaderMaterial(color) {

    var uniforms = {
      timer: timer,
      normalScale: lightParams.normalScale,
      texScale: lightParams.texScale,
      t_normal: {
        type: 't',
        value: TEXTURES.flower
      },
      cameraPos: {
        type: 'v3',
        value: camera.position
      },
      color: {
        type: 'v3',
        value: color
      },
      t_audio: {
        type: 't',
        value: audioController.texture
      },
      hovered: {
        type: 'f',
        value: 0
      }
    };
    return new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shaders.vs.ball,
      fragmentShader: shaders.fs.ball
    });
  }


  var specialLotus = createLotus(new THREE.Vector3(0, petalHeight, 0), new THREE.Vector3(0.8, 0.1, 1.0), true);
  setTimeout(function(){
    specialLotus.rise = true;
  }, lotusRiseTime)
  for (var i = 0; i < numLotuses; i++) {
    var x = radius * Math.cos(i / numLotuses * (Math.PI * 2))
    var z = radius * Math.sin(i / numLotuses * (Math.PI * 2))
    var lotus = createLotus(new THREE.Vector3(x, -200, z))
    lotus.growStartTime = map(z, -radius, radius, bloomTime * 0.35, bloomTime * 0.7)
    createGrowTween(lotus)
  }

  function createGrowTween(lotus){
    var curY = {
      y: lotus.position.y,
    }
    var finalY = {
      y: petalHeight + _.random(-20, 20)
    }
    var growTween = new TWEEN.Tween(curY).
      to(finalY, 60000).
      easing(TWEEN.Easing.Cubic.Out).
      onUpdate(function(){
        lotus.position.y = curY.y
      }).
      delay(lotus.growStartTime).
      start();
    growTween.onComplete(function(){
      setTimeout(function(){
        console.log(lotus)
        lotus.flow = true
      }, _.random(24000, 29000));
    })
  }



  var csd = {
    rotX: petal.rotation.x

  }
  var fsd = {
    rotX: petal.rotation.x += 1.1
  }
  var bloomTween = new TWEEN.Tween(csd).
  to(fsd, bloomTime).
  easing(TWEEN.Easing.Cubic.In).
  onUpdate(function() {
    _.each(petals, function(petal) {
      petal.rotation.x = csd.rotX;
    });
  }).start();
  bloomTween.onComplete(function(){
    controls.enabled = true;
  })

  function createLotus(position, color, specialOffset) {
    var lotus = new THREE.Object3D()
    lotuses.push(lotus)
    scene.add(lotus)
    lotus.position.copy(position)
    var color = color || new THREE.Vector3(Math.random(), Math.random(), Math.random());
    lightParams.textures.value.push(audioController.texture);
    if(specialOffset){
      lightParams.positions.value.push(new THREE.Vector3(lotus.position.x, lotus.position.y + mainLotusOffset, lotus.position.x)); 
    }
    else{
      lightParams.positions.value.push(lotus.position);
    }
    lightParams.colors.value.push(color);
    var mat = createShaderMaterial(color);
    for (var i = 0; i < numPetals; i++) {
      petal = new THREE.Mesh(geo, mat);
      petal.rotation.order = "YXZ";
      petal.rotation.y = (i / numPetals * (Math.PI * 2));
      petals.push(petal);
      lotus.add(petal);
      vertexCount += petal.geometry.vertices.length
    }
    //for some reason need to set intial rotation in another loop?? WHY?
    for (var i = 0; i < numPetals; i++) {
      petals[i].rotation.x -= 0.2
    }

    console.log("num vertices", vertexCount)
    vertexCount = 0;
    return lotus
  }

  this.update = function(){
    _.each(lotuses, function(lotus){
      if(lotus.flow){
        lotus.position.z -= 0.75
        if(lotus.position.x < 0){
          lotus.position.x -= 1
        }
        else{
          lotus.position.x += 0.6
        }
      }
      if(specialLotus.rise){
        specialLotus.position.y += .05
      }
    })
  }

}