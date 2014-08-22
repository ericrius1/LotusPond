
STREAMS = [];

var ULTIMATE_STREAM, ULTIMATE_SOURCE , ULTIMATE_GAIN , ULTIMATE_CONTROLLER ;

function Stream( file , controller, looping ){

  this.file = file;
  this.controller = controller;
  this.ctx = this.controller.ctx;

  if( !ULTIMATE_STREAM ){

    ULTIMATE_STREAM = new Audio();


   
    var ctx = controller.ctx;

    ULTIMATE_SOURCE = ctx.createMediaElementSource( ULTIMATE_STREAM );
    ULTIMATE_GAIN = ctx.createGain();
    
    ULTIMATE_SOURCE.connect( ULTIMATE_GAIN );

    
    ULTIMATE_GAIN.connect( controller.gain );
    //ULTIMATE_SOURCE.connect( controller.gain );

    ULTIMATE_CONTROLLER = controller;

  }

  this.looping = looping;

  this.controller.notes.push( this );

  STREAMS.push( this );
 
}


Stream.prototype.play = function(){

  this.playing = true;

  ULTIMATE_STREAM.src = this.file;
  ULTIMATE_STREAM.play();
  //ULTIMATE_GAIN.gain.value = 0.5;
  var t = ULTIMATE_CONTROLLER.ctx.currentTime;
  ULTIMATE_GAIN.gain.linearRampToValueAtTime( 1 , ULTIMATE_CONTROLLER.ctx.currentTime + .1 );

}

Stream.prototype.stop = function(){

  this.playing = false;

  var t = ULTIMATE_CONTROLLER.ctx.currentTime;

  console.log( t );
  ULTIMATE_GAIN.gain.linearRampToValueAtTime( ULTIMATE_GAIN.gain.value , t );

  ULTIMATE_GAIN.gain.linearRampToValueAtTime( 0.0 , t + 4);


}


Stream.prototype.update = function(){

}
