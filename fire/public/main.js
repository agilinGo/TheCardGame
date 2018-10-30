phina.globalize();

var ASSETS = {
    image: {
      'rock':'../../janken/rock.jpg',
      'paper':'../../janken/paper.jpg',
      'scissors':'../../janken/scissors.jpg',
    },
  };

phina.define('GameScene', {
    superClass: 'phina.display.DisplayScene',
    init: function(param) {
        this.superInit(param);
        this.backgroundColor = 'lightblue';
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
        var hand = phina.geom.Rect(0, hand_field.y - hand_field.height / 2, hand_field.width*10, hand_field.height*10);
       
        // データベースからカード生成
        //親
        var group = DisplayElement().addChildTo(this);

        var poss = []; //場所の参照をまとめておく。
//クラスを使おうとしてるけどうまくいかないかも
        param.room.child("/cards/").ref.on("child_added", function(snapshot) { 
            //カード1の生成
            var pos1 = snapshot.ref;
            poss.push(pos1);
            var img = snapshot.val().img;
            var shape1 = phina.display.Sprite(img);
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
                        pos1.update({belong:ID, x:shape1.x, y:shape1.y});
                    }else{
                        pos1.update({belong:0, x:shape1.x, y:shape1.y});
                    }
                }
            });
            shape1.on('pointstart', function(e) {
                self.setRectInteraction();
            });   
            shape1.on('pointend', function(e) {
                self.setRectInteraction();
            });
            //データベース書き換えた時
            pos1.on("value", function(snapshot) {
                id1 = snapshot.val().belong;
                shape1.setPosition(snapshot.val().x,snapshot.val().y);
                if (id1 == 0 || id1 ==ID) {
                    shape1.show();
                    shape1.setInteractive(true);
                }else{
                    shape1.hide();
                    shape1.setInteractive(false);
                }
            }); 
        });
        
        this.group = group;

        //ウィンドウ消した時
        window.onbeforeunload = function(){
            user.remove();
            for (let p of poss) {
                p.once('value').then(function(snapshot) {
                    if (snapshot.val().belong == ID) {
                        p.update({belong:0});
                    }
                });
            }
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

phina.define('TitleScene', {
    superClass: 'phina.display.DisplayScene',
    init: function() { 
        this.superInit();
        this.backgroundColor = 'lightblue';
        self = this;
        Button({
            text: "enter",
            fontSize:60,
          }
        ).addChildTo(this).setPosition(this.gridX.center(),this.gridY.span(10)).onpush = function(){
        self.exit('Room'); 
        };
        Button({
            text: "make",
            fontSize:60,
          }
        ).addChildTo(this).setPosition(this.gridX.center(),this.gridY.span(12)).onpush = function(){
        self.exit('Game'); 
        };
    }
});

phina.define('RoomScene', {
    superClass: 'phina.display.DisplayScene',
    init: function() { 
        this.superInit();
        this.backgroundColor = 'lightblue';
        self = this;
        var i = 1;
        firebase.database().ref("/room").on("child_added", function(snapshot) {
            var name = snapshot.val().name;
            Button({
                text: name,
                fontSize:30,
              }
            ).addChildTo(self).setPosition(self.gridX.center(),self.gridY.span(i)).onpush = function(){
            self.exit('Game', {room: snapshot}); 
            };
            i = i + 2;
        });
        
    }
});

phina.main(function() {
    var app = GameApp({
        startLabel: 'Title',
        scenes: [
            {
                className:'GameScene',
                label: 'Game',
            },
            {
                className:'TitleScene',
                label: 'Title',
            },
            {
                className:'RoomScene',
                label: 'Room',
            },
        ],
        assets: ASSETS,
    });
    app.run();
});
