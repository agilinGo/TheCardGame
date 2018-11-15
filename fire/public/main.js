phina.globalize();

let ASSETS = {
    image: {
        'title' : '../../Tramp/スクリーンショット 2018-11-01 15.10.56.png',
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
        //部屋名の表示
        param.room.ref.once('value').then(function (snapshot) {
            var label = phina.display.Label({ text:  snapshot.val().name});
            label.addChildTo(self);
            label.setPosition(320, 80);
        });

        // データベースからカード生成
        //親
        var group = DisplayElement().addChildTo(this);
        var poss = []; //場所の参照をまとめておく。

        param.room.child("/cards/").ref.on("child_added", function (snapshot) {
            var pos = snapshot.ref;
            poss.push(pos);
            var img = snapshot.val().img;
            var shape = phina.display.Sprite(img);
            var id1;
            shape.addChildTo(group);
            shape.setInteractive(true);
            //ドラック時処理
            shape.on('pointmove', function (e) {
                if (id1 == 0 || id1 == ID) {
                    if(self.serect == this){                 
                        shape.x += e.pointer.dx;
                        shape.y += e.pointer.dy;
                        if (Collision.testRectRect(shape, hand)) {
                            pos.update({ belong: ID, x: shape.x, y: shape.y });
                        } else {
                            pos.update({ belong: 0, x: shape.x, y: shape.y });
                        }
                    }
                }
            });
            shape.on('pointstart', function (e) {
                //self.setRectInteraction();
                self.serect = this;
                this.remove();
                shape.addChildTo(group);
            });
            shape.on('pointend', function (e) {
                //self.setRectInteraction();
                self.serect = null;
            });
            //データベース書き換えた時の処理
            pos.on("value", function (snapshot) {
                id1 = snapshot.val().belong;
                shape.setPosition(snapshot.val().x, snapshot.val().y);
                if (id1 == 0 || id1 == ID) {
                    shape.show();
                    shape.setInteractive(true);
                } else {
                    shape.hide();
                    shape.setInteractive(false);
                }
            });
            shape.update = function()
            {
                if(self.serect == null || self.serect == this)
                {             
                    shape.setInteractive(true);
                } else {
                    shape.setInteractive(false);
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
        this.backgroundColor = "rgb(39,86,3)";
        const self = this;

        var shape = phina.display.Sprite("title");
        shape.setPosition(this.gridX.center(), this.gridY.span(10));
        shape.addChildTo(this);
    
        var bool = false;

        Button({
            text: "enter",
            fontSize: 60,
        }
        ).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(10)).onpush = function () {
            self.exit('Room');
        };
        console.log("make");
        var make = Button({
            text: "make",
            fontSize: 60,
            fill: "gray",
        });
        make.addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(12)).onpush = function () {
            console.log(bool);
            if (bool) {
                self.exit('Make');
            }
        };
        firebase.database().ref("/image").once('value').then(async function (snapshot) {
            const snapval = snapshot.val();
            const ret =  Promise.all(                      
                Object.keys(snapval).map(async (x) => {
                    const path    = snapval[x].name;
                    const storage = firebase.storage().ref(path);
                    const url     = await storage.getDownloadURL();   
                    return [path, url];
            }));   
            return ret;
        }).then((xs) => {                                                
            xs.forEach((x) => {
                const path = x[0];
                const url  = x[1];
                ASSETS["image"][path] = url;
                console.log(url);
            });
            console.log(xs); 
            var loader = phina.asset.AssetLoader();
            loader.load(ASSETS);
            loader.on('load', function() {
                console.log("load");
                bool = true;
                make.fill = "MediumTurquoise"
            });                     
        });
    }
});

//ルーム作成
phina.define('MakeScene', {
    superClass: 'phina.display.DisplayScene',
    init: function () {
        this.superInit();
        this.backgroundColor = 'lightblue';
        self = this;
        var rnd = Math.round(Math.random() * 100000);

        var cards = [];
        var x = 1.5;
        var y = 1.5;
        for ( a in ASSETS.image) {
            if (a == "title" || a == "bk0") {
                continue;

            }
            var card = phina.display.Sprite(a);
            card.addChildTo(self).setInteractive(true).setPosition(self.gridX.span(x), self.gridY.span(y));
            x += 1.5;
            if (x >= 16){
                x = 1.5;
                y += 1.5;
            }
            card.on('pointend', function (e) {
                //self.setRectInteraction();
                console.log(this._image.src);
                const result = Object.keys(ASSETS.image).filter( (key) => {
                    return ASSETS.image[key] === this._image.src;
                });
                cards.push(result);
            });
        }

        Button({
            text: "make",
            fontSize: 30,
        }
        ).addChildTo(self).setPosition(self.gridX.center(), self.gridY.span(15)).onpush = function () {
            var myroom = firebase.database().ref("/room/").push({
                name: "room"+rnd
            });
            var param = { room: myroom };
            for (i in cards) {
                myroom.child("/cards/").ref.push({
                    belong: 0,
                    id: i,
                    img: cards[i][0],
                    x: 100,
                    y: 100
                });
            }
            console.log("go");
            self.exit('Game', param);
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
                    snapshot.child("/cards/").ref.once('value').then(async function (snapshot2) {
                        const snapval = snapshot2.val();                                       
                        const ret =  Promise.all(                      
                            Object.keys(snapval).map(async (x) => {
                                const path    = snapval[x].img;
                                const storage = firebase.storage().ref(path);
                                const url     = await storage.getDownloadURL();                                                           
                                return [path, url];
                        }));   
                        return ret;
                    }).then((xs) => {                                                
                        xs.forEach((x) => {
                            const path = x[0];
                            const url  = x[1];
                            ASSETS["image"][path] = url;
                            console.log(url);
                        });    
                        console.log(xs); 
                        var loader = phina.asset.AssetLoader();
                        loader.load(ASSETS);
                        loader.on('load', function() {
                            console.log("load");
                            self.exit('Game', param);
                        });                     
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
