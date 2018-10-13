phina.define('MainScene', {
    superClass: 'phina.display.DisplayScene',
    
    init: function() {
        this.superInit();
        
        var ID = Math.round(Math.random()*1000000);
        firebase.database().ref("/users").push({id:ID});
        
        var label = phina.display.Label({text:"カードをドラッグで動かせます"});
        label.addChildTo(this);
        label.setPosition(320, 160);
        
        let pos1 = firebase.database().ref("/pos/c1/");
        var shape1 = phina.display.RectangleShape();
        shape1.addChildTo(this);
        var card1 = Card(shape1, pos1);
        
        let pos2 = firebase.database().ref("/pos/c2/");
        var shape2 = phina.display.RectangleShape();
        shape2.addChildTo(this);
        var card2 = Card(shape2, pos2);
        
    },
});

phina.define('Card', {
    // 初期化
    init: function(obj,ref) {
        // クラスメンバ
        var card = obj;
        var pos = ref;
        var id;
        card.setPosition(100,100);
        card.setScale(2,3);
        card.setInteractive(true);
        card.on('pointmove', function(e) {
            card.x += e.pointer.dx;
            card.y += e.pointer.dy;
            pos.set({x:this.x, y:this.y});
        });
        pos.on("value", function(snapshot) { 
            card.setPosition(snapshot.val().x,snapshot.val().y);
        });
    },
});

phina.main(function() {
    var app = phina.game.GameApp({
        startLabel: 'main',
    });
    app.run();
});