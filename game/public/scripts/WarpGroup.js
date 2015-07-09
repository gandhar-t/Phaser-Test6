WarpGroup = function (game) {
	Phaser.Group.call(this, game, null); //pass second parameter as null if you need the group not be added to the game automatically
	this.thegame = game;
	this.threads = [];
	this.liftedThreads = [];
	
	//Add the weft threads on screen
	for(var i= 0; i<9; i++){
		this.threads[i] = this.create((i*30)+game.world.centerX-127, 1010, 'thread');
	}
	var sWidth = 672;
	var sHeight = 144;
	//Add the shuttle 1 on screen (THE LOWER one)
	this.shuttle1 = this.create(game.world.width, 1300, 'shuttle_vector');
	this.shuttle1.width = sWidth;
	this.shuttle1.height = sHeight;
	this.shuttle1.isRight = true;
	//Add the shuttle 2 on screen (THE UPPER one)
	this.shuttle2 = this.create(-this.shuttle1.width,1250, 'shuttle_vector');
	this.shuttle2.width = sWidth;
	this.shuttle2.height = sHeight;
	this.shuttle2.isRight = false;
	this.shuttle2.tint = Math.random() * 0xffffff;

	//Temporal Keyboard triggers
	this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
	this.key1.onDown.add(function(){
		this.glowThread(0, true);
		this.liftedThreads.push(1);
	}, this);
	this.key1.onUp.add(function(){
		this.glowThread(0,false);
		this.removeLiftedThread(1);
	}, this);
	this.key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
	this.key2.onDown.add(function(){
		this.glowThread(1, true);
		this.liftedThreads.push(2);
	}, this);
	this.key2.onUp.add(function(){
		this.glowThread(1,false);
		this.removeLiftedThread(2);
	}, this);
	this.key3 = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
	this.key3.onDown.add(function(){
		this.glowThread(2, true);
		this.liftedThreads.push(3);
	}, this);
	this.key3.onUp.add(function(){
		this.glowThread(2,false);
		this.removeLiftedThread(3);
	}, this);
	this.key4 = this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
	this.key4.onDown.add(function(){
		this.glowThread(3, true);
		this.liftedThreads.push(4);
	}, this);
	this.key4.onUp.add(function(){
		this.glowThread(3,false);
		this.removeLiftedThread(4);
	}, this);
	this.key5 = this.game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
	this.key5.onDown.add(function(){
		this.glowThread(4, true);
		this.liftedThreads.push(5);
	}, this);
	this.key5.onUp.add(function(){
		this.glowThread(4,false);
		this.removeLiftedThread(5);
	}, this);
	this.key6 = this.game.input.keyboard.addKey(Phaser.Keyboard.SIX);
	this.key6.onDown.add(function(){
		this.glowThread(5, true);
		this.liftedThreads.push(6);
	}, this);
	this.key6.onUp.add(function(){
		this.glowThread(5,false);
		this.removeLiftedThread(6);
	}, this);
	this.key7 = this.game.input.keyboard.addKey(Phaser.Keyboard.SEVEN);
	this.key7.onDown.add(function(){
		this.glowThread(6, true);
		this.liftedThreads.push(7);
	}, this);
	this.key7.onUp.add(function(){
		this.glowThread(6,false);
		this.removeLiftedThread(7);
	}, this);
	this.key8 = this.game.input.keyboard.addKey(Phaser.Keyboard.EIGHT);
	this.key8.onDown.add(function(){
		this.glowThread(7, true);
		this.liftedThreads.push(8);
	}, this);
	this.key8.onUp.add(function(){
		this.glowThread(7,false);
		this.removeLiftedThread(8);
	}, this);
	this.key9 = this.game.input.keyboard.addKey(Phaser.Keyboard.NINE);
	this.key9.onDown.add(function(){
		this.glowThread(8, true);
		this.liftedThreads.push(9);
	}, this);
	this.key9.onUp.add(function(){
		this.glowThread(8,false);
		this.removeLiftedThread(9);
	}, this);
	
};

WarpGroup.prototype = Object.create(Phaser.Group.prototype);
WarpGroup.prototype.constructor = WarpGroup;

WarpGroup.prototype.glowThread = function(threadnum, status){
	// console.log(this.liftedThreads);
	if(threadnum >= 0 && threadnum <= this.threads.length){
		if(status == true){
			this.threads[threadnum].blendMode = PIXI.blendModes.ADD;}
		else{
			this.threads[threadnum].blendMode = PIXI.blendModes.NORMAL;	
		}
	}
}
WarpGroup.prototype.sendShuttles = function(liftedThreads, colors){
	if(this.shuttle1.isRight == true){ //With this, we prevent the user from overlaping thread animations
		var lockedLiftedThreads = this.liftedThreads; //Lets lock the threads that are liften when the shuttle was pressed
		//Draw the Thread #1
		var thread = new ThreadGroup(this.thegame, lockedLiftedThreads, colors[0]);
		thread.y = this.shuttle1.y + this.shuttle1.height/2; 
		this.addChild(thread);
		thread.revealToLeft();

		//Bring Shuttle to front
		var ind = this.getChildIndex(thread);
		this.setChildIndex(this.shuttle1,ind);


		this.shuttle1.isRight = false;
		//Animate shuttle 1 to the left
		tween1 = this.thegame.add.tween(this.shuttle1).to( { x: this.shuttle2.x }, 2000, Phaser.Easing.Quadratic.InOut, true);
		tween1.onComplete.addOnce(function(){
			//Draw the Thread #2
			var thread = new ThreadGroup(this.thegame, lockedLiftedThreads, colors[1], true);
			thread.y = this.shuttle2.y + this.shuttle1.height/2; 
			this.addChild(thread);
			thread.revealToLeft();
			//Animate shuttle 2 to the right
			tween2 = this.thegame.add.tween(this.shuttle2).to( { x: this.thegame.world.width }, 2000, Phaser.Easing.Quadratic.InOut, true);
			tween2.onComplete.addOnce(function(){
				this.shuttle1.x = this.thegame.world.width;
				this.shuttle2.x = -this.shuttle2.width;

				this.shuttle1.isRight = true;
				this.shuttle2.isRight = false;
			}, this);
		},this);
		
	}
}
WarpGroup.prototype.addThread = function(liftedThreads, color){


}

WarpGroup.prototype.removeLiftedThread = function(num){
	// var index = this.liftedThreads.indexOf(num);
	// if(index > -1){
	// 	this.liftedThreads = this.liftedThreads.splice(index,1);
	// }
	this.removeLiftedThread2(num);
}

WarpGroup.prototype.removeLiftedThread2 = function(num){
	this.liftedThreads = this.removeFromArr(this.liftedThreads,num);
	//console.log(this.liftedThreads);
}

WarpGroup.prototype.removeFromArr = function(arr,elem){
    var i, len = arr.length, new_arr = [],
    sort_fn = function (a, b) { return a - b; };
    for (i = 0; i < len; i += 1) {
        if (typeof elem === 'object' && typeof arr[i] === 'object') {
            if (arr[i].toString() === elem.toString()) {
                continue;
            } else {                    
                if (arr[i].sort(sort_fn).toString() === elem.sort(sort_fn).toString()) {
                    continue;
                }
            }
        }
        if (arr[i] !== elem) {
            new_arr.push(arr[i]);
        }
    }
    return new_arr;
}




















