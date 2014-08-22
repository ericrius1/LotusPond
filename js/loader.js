// author: @cabbibo
function Loader(params){
  this.params = _.defaults(params || {}, {
    numberToLoad: 0
  });

  this.numberLoaded = 0;
  this.numberToLoad = this.params.numberToLoad;

  this.curtain = document.createElement('div');
  this.curtain.id = 'curtain';
  this.curtain.innerText = 'M83'
  document.body.appendChild(this.curtain);
  $('#curtain').append('<div id = "songInfo">M83 - Splendor</div')
}

Loader.prototype = {
  addToLoadBar: function(){
    this.numberToLoad++;
  },
  loadBarAdd: function(){
    this.numberLoaded++;
    if(this.numberLoaded == this.numberToLoad){
      this.onFinishedLoading();
    }
  },
  onFinishedLoading: function(){
    this.liftCurtain();
  },
  liftCurtain: function(){
    var self = this;
    this._onStart();
    $(this.curtain).fadeOut(800, function(){
      self.onCurtainLifted();
    })
  },

  _onStart: function(){
    this.onStart()
  },

  onStart: function(){},
  onCurtainLifted: function(){},

  beginLoading: function(){this.addToLoadBar();},
  endLoading: function(){this.loadBarAdd();}
}