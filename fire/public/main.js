phina.globalize();

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
        // 手札領域
        var hand_field = phina.display.RectangleShape();
        hand_field.addChildTo(this);
        hand_field.setPosition(320,860);
        hand_field.setScale(10,3);
        hand_field.fill = "pink";
        // データベースからカード生成
        var group = DisplayElement().addChildTo(this);
//        firebase.database().ref("/pos/").on("child_added", function(snapshot) { 
//            var shape = phina.display.RectangleShape();
//            shape.addChildTo(group);
//            card = Card(shape, snapshot);
//        });
        
        var pos1 = firebase.database().ref("/pos/c1/");
        var shape1 = phina.display.RectangleShape();
        shape1.addChildTo(group);
        //shape1.setScale(2,2);
        shape1.setInteractive(true);
        shape1.on('pointmove', function(e) {
        shape1.x += e.pointer.dx;
            shape1.y += e.pointer.dy;
            pos1.set({x:this.x, y:this.y});
        });
        //データベース書き換えた時
        pos1.on("value", function(snapshot) { 
            shape1.setPosition(snapshot.val().x,snapshot.val().y);
        });
        
        var pos2 = firebase.database().ref("/pos/c2/");
        var shape2 = phina.display.RectangleShape();
        shape2.addChildTo(group);
        //shape2.setScale(2,2);
        shape2.setInteractive(true);
        shape2.on('pointmove', function(e) {
            shape2.x += e.pointer.dx;
            shape2.y += e.pointer.dy;
            pos2.set({x:this.x, y:this.y});
        });
        //データベース書き換えた時
        pos2.on("value", function(snapshot) { 
            shape2.setPosition(snapshot.val().x,snapshot.val().y);
        });
        
        this.group = group;
        this.update = function() {
           this.setRectInteraction();
        };
        
        console.log(this.children);
        //ウィンドウ消した時
        window.onbeforeunload = function(){
            user.remove();
        }
    },
    setRectInteraction: function() {
        // 全体を一旦タッチ可能にする
        this.group.children.each(function(rect) {
            rect.setInteractive(true);
        }); 
        var self = this;
        // グループ総当たりで重なり具合に応じてタッチ可否を設定する
        this.group.children.each(function(rect, i) {
            self.group.children.each(function(target, j) {
                // 重なっていて表示順が下のターゲットはタッチ不可にする
                rec = phina.geom.Rect(rect.x, rect.y, rect.width, rect.height);
                tar = phina.geom.Rect(target.x, target.y, target.width, target.height);
                if (Collision.testRectRect(rec, tar) && j < i) {
                    target.setInteractive(false);
                }
            });
        });
    }
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
    });
    app.run();
});