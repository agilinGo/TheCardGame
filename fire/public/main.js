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
        
        var group = phina.display.DisplayElement().addChildTo(this);
    
        var mycard = firebase.database().ref("/pos/").push({id:ID,x:100, y:100});
        //カード１の生成
        //let pos1 = firebase.database().ref("/pos/c1/");
        //var shape1 = phina.display.RectangleShape();
        //shape1.addChildTo(group);
        //var card1 = Card(shape1, pos1);
        //カード２の生成
        //let pos2 = firebase.database().ref("/pos/c2/");
        //var shape2 = phina.display.RectangleShape();
        //shape2.addChildTo(group);
        //var card2 = Card(shape2, pos2);
        
        firebase.database().ref("/pos/").on("child_added", function(snapshot) { 
            var shape = phina.display.RectangleShape();
            shape.addChildTo(group);
            Card(shape, snapshot);
        });
        
        console.log(group);
        //ウィンドウ消した時
        window.onbeforeunload = function(){
            mycard.remove();
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
        obj.setScale(2,3);
        obj.setInteractive(true);
        //ドラッグした時
        obj.on('pointmove', function(e) {
            obj.x += e.pointer.dx;
            obj.y += e.pointer.dy;
            console.log(id);
            pos.set({id:id, x:this.x, y:this.y});
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
    });
    app.run();
});