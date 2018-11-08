phina.globalize();

let ASSETS = {
    image: {
        'rock' : './image/rock.jpg',
    },
};
let ASSETS2 = {
    image: {
        'scissors' : './image/scissors.jpg',
    },
};

phina.define('GameScene', {
    superClass: 'phina.display.DisplayScene',
    init: function (param) {
        this.superInit(param);
        this.backgroundColor = 'lightblue';
        const self = this;
        var Cards = [];
        //IDの生成
        var ID = Math.round(Math.random() * 1000000);
        var user = firebase.database().ref("/users").push({ id: ID });
        //説明文の表示
        var label = phina.display.Label({ text: "カードをドラッグで動かせます" });
        label.addChildTo(this);
        label.setPosition(320, 160);
        // 手札領域の追加
        var hand_field = phina.display.RectangleShape();
        hand_field.addChildTo(this);
        hand_field.setPosition(320, 860);
        hand_field.setScale(10, 3);
        hand_field.fill = "pink";
        var hand = phina.geom.Rect(0, hand_field.y - hand_field.height / 2, hand_field.width * 10, hand_field.height * 10);
        var i = 1;
        var serect = null;
        // データベースからカード生成
        //親
        var group = DisplayElement().addChildTo(this);

        var poss = []; //場所の参照をまとめておく。
        //データベースからカードの生成
        
        param.room.child("/cards/").ref.on("child_added", function (snapshot) {
            
            var pos1 = snapshot.ref;
            poss.push(pos1);
            var img = snapshot.val().img;
            var shape1 = phina.display.Sprite(img);/*
            Cards.push(Card(shape1,i,group));
            i++;*/
            
            var id1;
            shape1.addChildTo(group);
            shape1.setInteractive(true);
            //ドラック時処理
            shape1.on('pointmove', function (e) {
                if (id1 == 0 || id1 == ID) {
                    if(self.serect == this){                 
                        shape1.x += e.pointer.dx;
                        shape1.y += e.pointer.dy;
                        if (Collision.testRectRect(shape1, hand)) {
                            pos1.update({ belong: ID, x: shape1.x, y: shape1.y });
                        } else {
                            pos1.update({ belong: 0, x: shape1.x, y: shape1.y });
                        }
                    }
                }
            });
            shape1.on('pointstart', function (e) {
                //self.setRectInteraction();
                self.serect = this;
                this.remove();
                shape1.addChildTo(group);
            });
            shape1.on('pointend', function (e) {
                //self.setRectInteraction();
                self.serect = null;
            });
            //データベース書き換えた時の処理
            pos1.on("value", function (snapshot) {
                id1 = snapshot.val().belong;
                shape1.setPosition(snapshot.val().x, snapshot.val().y);
                if (id1 == 0 || id1 == ID) {
                    shape1.show();
                    shape1.setInteractive(true);
                } else {
                    shape1.hide();
                    shape1.setInteractive(false);
                }
            });
            shape1.update = function()
            {
                if(self.serect == null || self.serect == this)
                {             
                    shape1.setInteractive(true);
                } else {
                    shape1.setInteractive(false);
                }
            }
        });
        
        this.group = group;

        //ウィンドウ消した時の処理
        window.onbeforeunload = function () {
            //ユーザを消して手札を解放する
            user.remove();
            for (let p of poss) {
                p.once('value').then(function (snapshot) {
                    if (snapshot.val().belong == ID) {
                        p.update({ belong: 0 });
                    }
                });
            }
        }
        //document.write('<img src="./image/rock.jpg" width="104" height="91" />');
    },

    update: function () {
    },
    /*
    //重なりの処理
    setRectInteraction: function () {
        // 全体を一旦タッチ可能にする
        this.group.children.each(function (rect) {
            rect.setInteractive(true);
        });
        var self = this;
        // グループ総当たりで重なり具合に応じてタッチ可否を設定する
        this.group.children.each(function (rect, i) {
            self.group.children.each(function (target, j) {
                // 重なっていて表示順が下のターゲットはタッチ不可にする
                if (Collision.testRectRect(rect, target) && j < i) {
                    target.setInteractive(false);
                }
            });
        });
    }*/
});/*
phina.define('Card', {
    // 初期化
    init: function(obj,b,c) {
        // クラスメンバ 
        let belong = 0;
        let id = b;
        let card = obj;
        let start_X;
        let start_Y;
        let dir_X;
        let dir_Y;
        card.scaleX = 0.6;
        card.scaleY = 0.6;
        card.x = 250;
        card.y = 300;      
        card.setInteractive(true);
        card.onpointstart = function(e) {
          self.serect = this;
          self.tauch = true;
          this.remove();
          card.addChildTo(c);        
          start_X = e.pointer.x;
          start_Y = e.pointer.y;                          
        };
        card.onpointend = function(e) {
          dir_X = e.pointer.x - start_X;
          dir_Y = e.pointer.y - start_Y;
          if((dir_X > -0.01) && (dir_X < 0.01))
          {
            if((dir_X > -0.01) && (dir_X < 0.01))
            {            
              back.addChildTo(c);
              this.remove();
            }
          }
          self.serect = null;
        };
        card.on('pointmove', function(e) {
            if (belong == 0 || belong == ID) {
                if(self.serect == this) 
                {
                    card.x += e.pointer.dx;
                    card.y += e.pointer.dy;
                    back.x += e.pointer.dx;
                    back.y += e.pointer.dy;
                    if (Collision.testRectRect(obj, hand)) {
                        pos1.update({ belong: id, x: card.x, y: card.y });
                    } else {
                        pos1.update({ belong: 0, x: card.x, y: card.y });
                    } 
                }        
            }       
          
        });
        card.update = function() 
        {
          if(self.serect == null || self.serect == this)
          {
            card.setInteractive(true);
          } else {
            card.setInteractive(false);
          }
        }
        let back = obj;
        back.scaleX = 0.6;
        back.scaleY = 0.6;
        back.x = 250;
        back.y = 300;
        back.addChildTo(c);
        back.setInteractive(true); 
        back.onpointstart = function(e) {
          self.serect = this;
          this.remove();
          back.addChildTo(c);
          start_X = e.pointer.x;
          start_Y = e.pointer.y; 
        };
        back.onpointend = function(e) {
          dir_X = e.pointer.x - start_X;
          dir_Y = e.pointer.y - start_Y;
          if(dir_X == 0)
          {
            if(dir_Y == 0)
            {
              card.addChildTo(c);
              this.remove();
            }
          }
          self.serect = null;
        };
        back.on('pointmove', function(e) {
          if(self.serect == this) 
          {
            card.x += e.pointer.dx;
            card.y += e.pointer.dy;
            back.x += e.pointer.dx;
            back.y += e.pointer.dy; 
          }               
        });
        back.update = function()
        {
          if(self.serect == null || self.serect == this)
          {          
            back.setInteractive(true);
          } else {
            back.setInteractive(false);
          }
        }
    },
});*/

//タイトルメニュー
phina.define('TitleScene', {
    superClass: 'phina.display.DisplayScene',
    init: function () {
        this.superInit();
        this.backgroundColor = 'lightblue';
        const self = this;
        Button({
            text: "enter",
            fontSize: 60,
        }
        ).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(10)).onpush = function () {
            self.exit('Room');
        };
        Button({
            text: "make",
            fontSize: 60,
        }
        ).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(12)).onpush = function () {
            self.exit('Make');
        };
    }
});

phina.define('MakeScene', {
    superClass: 'phina.display.DisplayScene',
    init: function () {
        this.superInit();
        this.backgroundColor = 'lightblue';
        self = this; 
        var myroom = firebase.database().ref("/room/").push({
            name: "myroom",
            cards: {
                c1: {
                    belong: 0,
                    id: 1,
                    img: "/rock.jpg",
                    x: 100,
                    y: 100
                },
                c2: {
                    belong: 0,
                    id: 2,
                    img: "/paper.jpg",
                    x: 200,
                    y: 100
                }
            }
        });
        
        myroom.child("/cards/").ref.once('value').then(function (snapshot) {
            const snapval = snapshot.val();
            let pathes = {};
            param["card"] = []; // 空の配列            
            for(let x in snapval){
                const path = snapval[x].img;  
                const storage = firebase.storage().ref(path);
                storage.getDownloadURL().then(function (url) {
                    param["card"].push({name: path, url: url});
                });
            }
        });

        Button({
            text: "name",
            fontSize: 30,
        }
        ).addChildTo(self).setPosition(self.gridX.center(), self.gridY.span(2)).onpush = function () {
            self.exit('Load', param);
        };


    }
});

//ルーム選択
phina.define('RoomScene', {
    superClass: 'phina.display.DisplayScene',
    init: function () {
        this.superInit();
        this.backgroundColor = 'lightblue';
        const self = this;
        var i = 2;
        var counter1 = 0;
        var counter2 = 0;
        var sel = false;
        var param;
        firebase.database().ref("/room").on("child_added", function (snapshot) {
            var name = snapshot.val().name;
            Button({
                text: name,
                fontSize: 30,
            }
            ).addChildTo(self).setPosition(self.gridX.center(), self.gridY.span(i)).onpush = function () {
                if (!sel) {
                    this.fill = "pink";
                    sel = true;
                    param = { room: snapshot };
                    snapshot.child("/cards/").ref.once('value').then(function (snapshot2) {
                        const snapval = snapshot2.val();
                        for(let x in snapval){
                            const path = snapval[x].img;
                            counter1++;
                            const storage = firebase.storage().ref(path);
                            storage.getDownloadURL().then(function (url) {
                                console.log(url);
                                ASSETS["image"][path] = url;
                                counter2++;
                            });
                        }
                    });
                }
            };
            Button({
                text: "ok",
                fontSize: 30,
            }
            ).addChildTo(self).setPosition(self.gridX.span(13), self.gridY.span(14)).onpush = function () {
                this.text = "loading";
                if (counter2 == counter1 & sel) {
                    var loader = phina.asset.AssetLoader();
                    loader.load(ASSETS);
                    loader.on('load', function() {
                        console.log("load");
                        self.exit('Game', param);
                    });
                }
            };
            i = i + 2;
        });

    }
});

//メイン処理
phina.main(function () {
    var app = GameApp({
        startLabel: 'Title',
        scenes: [
            {
                className: 'GameScene',
                label: 'Game',
            },
            {
                className: 'TitleScene',
                label: 'Title',
            },
            {
                className: 'RoomScene',
                label: 'Room',
            },
            {
                className: 'MakeScene',
                label: 'Make',
            },
            {
                className: 'MyLoadingScene',
                label: 'Load',
            },
        ],
        assets: ASSETS,
    });
    app.run();
});
