phina.globalize();

var ASSETS = {
    image: {
      'Tramp': '../../Tramp/bk0.png',
    },
  };

phina.define('MainScene', {
    superClass: 'phina.display.DisplayScene',
    
    init: function() {
        this.superInit();
        //IDの生成
        var ID = Math.round(Math.random()*1000000);
        var user = firebase.database().ref("/users").push({id:ID});
        //説明文の表示
        var label = phina.display.Label({text:"カードをドラッグで動かせます"});
        label.addChildTo(this);
        label.setPosition(320, 160);
        // データベースからカード生成
        var group = DisplayElement().addChildTo(this);
        firebase.database().ref("/pos/").on("child_added", function(snapshot) { 
            var shape = phina.display.Sprite('Tramp');
            shape.addChildTo(group);
            card = Card(shape, snapshot);
        });
        console.log(this.children);
        //ウィンドウ消した時
        window.onbeforeunload = function(){
            user.remove();
        }
    },
});

phina.define('Card', {
    init: function(obj,snapshot) {
        this.obj = obj;
        var pos = snapshot.ref;
        var id = snapshot.val().id;
        obj.setPosition(100,100);
        //obj.setScale(2,3);
        obj.setInteractive(true);
        //ドラッグした時
        obj.on('pointmove', function(e) {
            obj.x += e.pointer.dx;
            obj.y += e.pointer.dy;
            console.log(id);
            pos.set({x:this.x, y:this.y});
        });
        //データベース書き換えた時
        pos.on("value", function(snapshot) { 
            obj.setPosition(snapshot.val().x,snapshot.val().y);
        });
    },
});

phina.main(function() {
    var app = phina.game.GameApp({
        startLabel: 'main',
        assets: ASSETS,
    });
    app.run();
});