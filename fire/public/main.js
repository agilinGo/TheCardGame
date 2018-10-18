phina.globalize();

var ASSETS = {
    image: {
      'c01': './c01.png',
      'c02': './c02.png',
      'c03': './c03.png',
      'c04': './c01.png',
      'c05': './c02.png',
      'c06': './c03.png',
    },
  };

phina.define('MainScene', {
    superClass: 'phina.display.DisplayScene',
    init: function() {
        this.superInit();
        var self = this;
        //IDの生成
        var ID = Math.round(Math.random()*1000000);
        var user = firebase.database().ref("/users").push({id:ID});
        //説明文の表示
        var label = phina.display.Label({text:"カードをドラッグで動かせます"});
        label.addChildTo(this);
        label.setPosition(320, 160);
        // 手札領域の追加
        var hand_field = phina.display.RectangleShape();
        hand_field.addChildTo(this);
        hand_field.setPosition(320,860);
        hand_field.setScale(10,3);
        hand_field.fill = "pink";
        var hand = phina.geom.Rect(0, hand_field.y - hand_field.height / 2, hand_field.width*10, hand_field.height*3);
        // データベースからカード生成
        var group = DisplayElement().addChildTo(this);
//クラスを使おうとしてるけどうまくいかないかも
//        firebase.database().ref("/pos/").on("child_added", function(snapshot) { 
//            var shape = phina.display.RectangleShape();
//            shape.addChildTo(group);
//            card = Card(shape, snapshot);
//        });
        //カード1の生成
        var pos1 = firebase.database().ref("/pos/c1/");
        var shape1 = phina.display.Sprite("c01");
        var id1;
        shape1.addChildTo(group);
        //shape1.setScale(2,2);
        shape1.setInteractive(true);
        //ドラック時
        shape1.on('pointmove', function(e) {
            if(id1 == 0 || id1 ==ID){
                shape1.x += e.pointer.dx;
                shape1.y += e.pointer.dy;
                if ( Collision.testRectRect(shape1, hand) ) {
                    pos1.set({belong:ID, x:this.x, y:this.y});
                }else{
                    pos1.set({belong:0, x:this.x, y:this.y});
                }
            }
        });
        /*
        shape1.on('pointend', function(e) {
            self.setRectInteraction();
        });
        */
        shape1.on('pointend',(e) => {
            this.setRectInteraction();
        });
        //データベース書き換えた時
        pos1.on("value", function(snapshot) {
            self.setRectInteraction();
            id1 = snapshot.val().belong;
            shape1.setPosition(snapshot.val().x,snapshot.val().y);
            if (id1 == 0 || id1 ==ID) {
                shape1.show();
            }else{
                shape1.x += 1000;
            }
        });
//カード２の生成=========
        var pos2 = firebase.database().ref("/pos/c2/");
        var shape2 = phina.display.Sprite("c02");
        var id2;
        shape2.addChildTo(group);
        //shape2.setScale(2,2);
        shape2.setInteractive(true);
        //ドラッグ時
        shape2.on('pointmove', function(e) {
            if(id2 == 0 || id2 ==ID){
                shape2.x += e.pointer.dx;
                shape2.y += e.pointer.dy;
                if ( Collision.testRectRect(shape2, hand) ) {
                    pos2.set({belong:ID, x:this.x, y:this.y});
                }else{
                    pos2.set({belong:0, x:this.x, y:this.y});
                }
            }
        });
        shape2.on('pointend', function(e) {
            self.setRectInteraction();
        });
        //データベース書き換えた時
        pos2.on("value", function(snapshot) {
            self.setRectInteraction();
            id2 = snapshot.val().belong;
            shape2.setPosition(snapshot.val().x,snapshot.val().y);
            if (id2 == 0 || id2 ==ID) {
                shape2.show();
            }else{
                shape2.x += 1000;
            }
        });
//カード３の生成=========
        var pos3 = firebase.database().ref("/pos/c3/");
        var shape3 = phina.display.Sprite("c03");
        var id3;
        shape3.addChildTo(group);
        //shape3.setScale(3,3);
        shape3.setInteractive(true);
        //ドラッグ時
        shape3.on('pointmove', function(e) {
            if(id3 == 0 || id3 ==ID){
                shape3.x += e.pointer.dx;
                shape3.y += e.pointer.dy;
                if ( Collision.testRectRect(shape3, hand) ) {
                    pos3.set({belong:ID, x:this.x, y:this.y});
                }else{
                    pos3.set({belong:0, x:this.x, y:this.y});
                }
            }
        });
        shape3.on('pointend', function(e) {
            self.setRectInteraction();
        });
        //データベース書き換えた時
        pos3.on("value", function(snapshot) {
            self.setRectInteraction();
            id3 = snapshot.val().belong;
            shape3.setPosition(snapshot.val().x,snapshot.val().y);
            if (id3 == 0 || id3 ==ID) {
                shape3.show();
            }else{
                shape3.x += 1000;
            }
        });
//カード４の生成=========
        var pos4 = firebase.database().ref("/pos/c4/");
        var shape4 = phina.display.Sprite("c04");
        var id4;
        shape4.addChildTo(group);
        //shape4.setScale(4,4);
        shape4.setInteractive(true);
        //ドラッグ時
        shape4.on('pointmove', function(e) {
            if(id4 == 0 || id4 ==ID){
                shape4.x += e.pointer.dx;
                shape4.y += e.pointer.dy;
                if ( Collision.testRectRect(shape4, hand) ) {
                    pos4.set({belong:ID, x:this.x, y:this.y});
                }else{
                    pos4.set({belong:0, x:this.x, y:this.y});
                }
            }
        });
        shape4.on('pointend', function(e) {
            self.setRectInteraction();
        });
        //データベース書き換えた時
        pos4.on("value", function(snapshot) {
            self.setRectInteraction();
            id4 = snapshot.val().belong;
            shape4.setPosition(snapshot.val().x,snapshot.val().y);
            if (id4 == 0 || id4 ==ID) {
                shape4.show();
            }else{
                shape4.x += 1000;
            }
        });
//カード５の生成=========
        var pos5 = firebase.database().ref("/pos/c5/");
        var shape5 = phina.display.Sprite("c05");
        var id5;
        shape5.addChildTo(group);
        //shape5.setScale(5,5);
        shape5.setInteractive(true);
        //ドラッグ時
        shape5.on('pointmove', function(e) {
            if(id5 == 0 || id5 ==ID){
                shape5.x += e.pointer.dx;
                shape5.y += e.pointer.dy;
                if ( Collision.testRectRect(shape5, hand) ) {
                    pos5.set({belong:ID, x:this.x, y:this.y});
                }else{
                    pos5.set({belong:0, x:this.x, y:this.y});
                }
            }
        });
        shape5.on('pointend', function(e) {
            self.setRectInteraction();
        });
        //データベース書き換えた時
        pos5.on("value", function(snapshot) {
            self.setRectInteraction();
            id5 = snapshot.val().belong;
            shape5.setPosition(snapshot.val().x,snapshot.val().y);
            if (id5 == 0 || id5 ==ID) {
                shape5.show();
            }else{
                shape5.x += 1000;
            }
        });
//カード６の生成=========
        var pos6 = firebase.database().ref("/pos/c6/");
        var shape6 = phina.display.Sprite("c06");
        var id6;
        shape6.addChildTo(group);
        //shape6.setScale(6,6);
        shape6.setInteractive(true);
        //ドラッグ時
        shape6.on('pointmove', function(e) {
            if(id6 == 0 || id6 ==ID){
                shape6.x += e.pointer.dx;
                shape6.y += e.pointer.dy;
                if ( Collision.testRectRect(shape6, hand) ) {
                    pos6.set({belong:ID, x:this.x, y:this.y});
                }else{
                    pos6.set({belong:0, x:this.x, y:this.y});
                }
            }
        });
        shape6.on('pointend', function(e) {
            self.setRectInteraction();
        });
        //データベース書き換えた時
        pos6.on("value", function(snapshot) {
            self.setRectInteraction();
            id6 = snapshot.val().belong;
            shape6.setPosition(snapshot.val().x,snapshot.val().y);
            if (id6 == 0 || id6 ==ID) {
                shape6.show();
            }else{
                shape6.x += 1000;
            }
        });    
        
        
        
        this.group = group;
        
        //ウィンドウ消した時
        window.onbeforeunload = function(){
            user.remove();
            pos1.once('value').then(function(snapshot) {
                if (snapshot.val().belong == ID) {
                    pos1.set({belong:0, x:snapshot.val().x, y:snapshot.val().y});
                }
            });
            pos2.once('value').then(function(snapshot) {
                if (snapshot.val().belong == ID) {
                    pos2.set({belong:0, x:snapshot.val().x, y:snapshot.val().y});
                }
            });
            pos3.once('value').then(function(snapshot) {
                if (snapshot.val().belong == ID) {
                    pos3.set({belong:0, x:snapshot.val().x, y:snapshot.val().y});
                }
            });
            pos4.once('value').then(function(snapshot) {
                if (snapshot.val().belong == ID) {
                    pos4.set({belong:0, x:snapshot.val().x, y:snapshot.val().y});
                }
            });
            pos5.once('value').then(function(snapshot) {
                if (snapshot.val().belong == ID) {
                    pos5.set({belong:0, x:snapshot.val().x, y:snapshot.val().y});
                }
            });
            pos6.once('value').then(function(snapshot) {
                if (snapshot.val().belong == ID) {
                    pos6.set({belong:0, x:snapshot.val().x, y:snapshot.val().y});
                }
            });
        }
    },
    
    update : function() {
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
                if (Collision.testRectRect(rect, target) && j < i) {
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
        assets: ASSETS,
    });
    app.run();
});