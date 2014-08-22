//from @cabbibo

function ObjectControls(eye) {

  this.intersected;
  this.selected;


  this.eye = eye;

  this.position = new THREE.Vector3();


  this.mouse = new THREE.Vector3();
  this.unprojectedMouse = new THREE.Vector3();

  this.objects = [];

  this.domElement = document; 


  this.raycaster = new THREE.Raycaster();
  this.projector = new THREE.Projector();


  this.raycaster.near = this.eye.near;
  this.raycaster.far = this.eye.far;

  var addListener = this.domElement.addEventListener;

  this.domElement.addEventListener('mousedown', this.mouseDown.bind(this));
  this.domElement.addEventListener('mouseup', this.mouseUp.bind(this));
  this.domElement.addEventListener('mousemove', this.mouseMove.bind(this));

}

/*

     EVENTS

  */



// You can think of _up and _down as mouseup and mouse down

ObjectControls.prototype._down = function() {

  this.down();

  if (this.intersected) {

    //console.log( this.intersected );
    this._select(this.intersected);

  }

}

ObjectControls.prototype.down = function() {}



ObjectControls.prototype._up = function() {

  this.up();


  if (this.selected) {

    this._deselect(this.selected);

  }

}

ObjectControls.prototype.up = function() {}



ObjectControls.prototype._hoverOut = function(object) {

  this.hoverOut();

  this.objectHovered = false;


  if (object.hoverOut) {
    object.hoverOut(this);
  }

};

ObjectControls.prototype.hoverOut = function() {};



ObjectControls.prototype._hoverOver = function(object) {

  this.hoverOver();

  this.objectHovered = true;


  if (object.hoverOver) {
    object.hoverOver(this);
  }

};

ObjectControls.prototype.hoverOver = function() {}



ObjectControls.prototype._select = function(object) {

  this.select();


  var intersectionPoint = this.getIntersectionPoint(this.intersected);

  this.selected = object;
  var selectedClone = this.selected.position.clone().add(intersectionPoint);

  this.intersectionPoint = intersectionPoint;

  if (object.select) {
    object.select(this);
  }

};

ObjectControls.prototype.select = function() {}



ObjectControls.prototype._deselect = function(object) {

  //console.log('DESELECT');

  this.selected = undefined;
  this.intersectionPoint = undefined;
  this.rotating = false;

  if (object.deselect) {
    object.deselect(this);
  }

  this.deselect();

};

ObjectControls.prototype.deselect = function() {}



/*
  
    Changing what objects we are controlling 

  */

ObjectControls.prototype.add = function(object) {

  this.objects.push(object);

};

ObjectControls.prototype.remove = function(object) {

  for (var i = 0; i < this.objects.length; i++) {

    if (this.objects[i] == object) {

      this.objects.splice(i, 1);

    }

  }

};


/*

     Update Loop

  */

ObjectControls.prototype.update = function() {

  if (!this.selected) {

    this.checkForIntersections(this.unprojectedMouse);

  } else {

    this._updateSelected(this.unprojectedMouse);

  }

};

ObjectControls.prototype._updateSelected = function() {




  if (this.selected.update) {

    this.selected.update(this);

  }

}

ObjectControls.prototype.updateSelected = function() {};

/*
   
    Checks 

  */

ObjectControls.prototype.checkForIntersections = function(position) {

  var origin = position;
  var direction = origin.clone()

  direction.sub(this.eye.position);
  direction.normalize();



  this.raycaster.set(this.eye.position, direction);


  var intersected = this.raycaster.intersectObjects(this.objects);

  if (intersected.length > 0) {

    this._objectIntersected(intersected);

  } else {

    this._noObjectIntersected();

  }

};



ObjectControls.prototype.getIntersectionPoint = function(i) {

  var intersected = this.raycaster.intersectObjects(this.objects);

  return intersected[0].point.sub(i.position);

}


/*
   
     Raycast Events

  */

ObjectControls.prototype._objectIntersected = function(intersected) {

  // Assigning out first intersected object
  // so we don't get changes everytime we hit 
  // a new face
  var firstIntersection = intersected[0].object;

  if (!this.intersected) {

    this.intersected = firstIntersection;

    this._hoverOver(this.intersected);


  } else {

    if (this.intersected != firstIntersection) {

      this._hoverOut(this.intersected);

      this.intersected = firstIntersection;

      this._hoverOver(this.intersected);

    }

  }

  this.objectIntersected();

};

ObjectControls.prototype.objectIntersected = function() {}

ObjectControls.prototype._noObjectIntersected = function() {

  if (this.intersected) {

    this._hoverOut(this.intersected);
    this.intersected = undefined;

  }

  this.noObjectIntersected();

};

ObjectControls.prototype.noObjectIntersected = function() {}


ObjectControls.prototype.mouseMove = function(event) {

  this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  this.mouse.z = 1;

  this.unprojectMouse();

}

ObjectControls.prototype.unprojectMouse = function() {

  this.unprojectedMouse.copy(this.mouse);
  this.projector.unprojectVector(this.unprojectedMouse, this.eye);

}

ObjectControls.prototype.mouseDown = function() {
  this._down();
}

ObjectControls.prototype.mouseUp = function() {
  this._up();
}