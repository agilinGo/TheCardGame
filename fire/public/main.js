phina.globalize();

let ASSETS = {
    image: {
        'title' : '../../Tramp/スクリーンショット 2018-11-01 15.10.56.png',
    },
};

//ゲームシーン=========================================================================================================
phina.define('GameScene', {
    superClass: 'phina.display.DisplayScene',
    init: function (param) {
        this.superInit(param);
        this.backgroundColor = 'lightblue';
        const self = this;
        var hands = [];
    //IDの生成
        var ID = Math.round(Math.random() * 1000000);
        var user = firebase.database().ref("/users").push({ id: ID });
    //説明文の表示
        var label = phina.display.Label({ text: "カードをドラッグで動かせます。\nピンクのところは手札" });
        label.addChildTo(this);
        label.setPosition(320, 160);
    // 手札領域の追加
        var hand_field = phina.display.RectangleShape();
        hand_field.addChildTo(this);
        hand_field.setPosition(320, 860);
        hand_field.setScale(10, 3);
        hand_field.fill = "pink";
        var i = 1;
        var serect = null;
    //部屋名の表示
        param.room.ref.once('value').then(function (snapshot) {
            var label = phina.display.Label({ text:  snapshot.val().name});
            label.addChildTo(self);
            label.setPosition(320, 80);
        });

    // データベースからカード生成
        var group = DisplayElement().addChildTo(this);
        var poss = []; //場所の参照をまとめておく。

        param.room.child("/cards/").ref.on("child_added", function (snapshot) {
            var pos = snapshot.ref;
            poss.push(pos);
            var img = snapshot.val().img;
            var shape = phina.display.Sprite(img);
            for ( a in ASSETS.image) {
                if (a == "bk0.png") {
                    var back_image = a;
                    break;
                }                
            }
            var back = phina.display.Sprite(back_image);
            var id1;
            if(snapshot.val().reverse == 0)
            {
                shape.addChildTo(group);
                shape.setInteractive(true);
                var show_back = false;
            } else {
                back.addChildTo(group);
                back.setInteractive(true);
                var show_back = true;
            }            
            var start_X;
            var start_Y;
            var dir_X;
            var dir_Y;
           
        //ドラック時処理
        //データベースの位置を書き換える
            shape.on('pointmove', function (e) {
                if (id1 == 0 || id1 == ID) {
                    if(self.serect == this){                 
                        shape.x += e.pointer.dx;
                        // 画面の制限 x
                        if (shape.left < 0) {
                            shape.x -= shape.left;
                        } else if (self.width < shape.right) {
                            shape.x += self.width - shape.right;
                        }
                        shape.y += e.pointer.dy;
                        // 画面の制限 y
                        if (shape.top < 0) {
                            shape.y -= shape.top;
                        } else if (self.height < shape.bottom) {
                            shape.y += self.height - shape.bottom;
                        }
                        // 手札の判定
                        if (shape.bottom > 760) {
                            hands.push(shape);
                            //console.log(hands);
                            //console.log(hands.length);
                            //console.log(hands.indexOf(shape));
                            
                            pos.update({ belong: ID, x: shape.x, y: shape.y });
                        } else {
                            pos.update({ belong: 0, x: shape.x, y: shape.y });
                        }
                    }
                }
            });
        //おそらく押された中の１つだけを動くようにして一番上に持ってきてる
            shape.on('pointstart', function (e) {
                //self.setRectInteraction();
                self.serect = this;
                this.remove();
                shape.addChildTo(group);
                start_X = e.pointer.x;
                start_Y = e.pointer.y;
            });
        //わからないから誰か書き換えて
            shape.on('pointend', function (e) {
                //self.setRectInteraction();
                self.serect = null;
                dir_X = e.pointer.x - start_X;
                dir_Y = e.pointer.y - start_Y;
                if((dir_X > -3) && (dir_X < 3))
                {
                  if((dir_Y > -3) && (dir_Y < 3))
                  {            
                    back.addChildTo(group);
                    this.remove();
                    show_back = true;
                    pos.update({ reverse: 1});
                  }
                }
            });
        //データベースが書き換わった時の処理
        //位置をデータベースから反映する
        //表の処理
            pos.on("value", function (snapshot) {
                if(!show_back){
                    if(snapshot.val().x == shape.x || snapshot.val().y == shape.y)
                    {
                        shape.addChildTo(group)
                    }
                    if(snapshot.val().reverse == 1)
                    {
                        back.addChildTo(group);
                        shape.remove();
                    }
                }                
                shape.setPosition(snapshot.val().x, snapshot.val().y);
                id1 = snapshot.val().belong;                
                if (id1 == 0) {
                    shape.setPosition(snapshot.val().x, snapshot.val().y);
                } else if (id1 == ID) {
                    shape.setPosition(snapshot.val().x, snapshot.val().y);
                } else {
                    shape.setPosition(snapshot.val().x, snapshot.val().y + 1000);
                }
            });
        //わからないから誰か書き換えて
        //一番上じゃなかったら触れなくする
            shape.update = function() {
                if (self.serect == null || self.serect == this) {             
                    shape.setInteractive(true);
                } else {
                    shape.setInteractive(false);
                }
            }
        //ドラック時処理
        //データベースの位置を書き換える
            back.on('pointmove', function (e) {
                if (id1 == 0 || id1 == ID) {
                    if(self.serect == this){                 
                        back.x += e.pointer.dx;
                        // 画面の制限 x
                        if (back.left < 0) {
                            back.x -= back.left;
                        } else if (self.width < back.right) {
                            back.x += self.width - back.right;
                        }
                        back.y += e.pointer.dy;
                        // 画面の制限 y
                        if (shape.top < 0) {
                            back.y -= back.top;
                        } else if (self.height < back.bottom) {
                            back.y += self.height - back.bottom;
                        }
                        // 手札の判定
                        if (shape.bottom > 760) {
                            pos.update({ belong: ID, x: back.x, y: back.y });
                        } else {
                            pos.update({ belong: 0, x: back.x, y: back.y });
                        }
                    }
                }
            });
        //わからないから誰か書き換えて
        //クリックしたカードを一番上に持ってくて、serectに代入
            back.on('pointstart', function (e) {
                //self.setRectInteraction();
                self.serect = this;
                this.remove();               
                back.addChildTo(group);
                start_X = e.pointer.x;
                start_Y = e.pointer.y;
            });
        //離したらserectを空に
            back.on('pointend', function (e) {
                //self.setRectInteraction();
                self.serect = null;
                dir_X = e.pointer.x - start_X;
                dir_Y = e.pointer.y - start_Y;
                if((dir_X > -3) && (dir_X < 3))
                {
                    if((dir_Y > -3) && (dir_Y < 3))
                    {            
                        this.remove();
                        shape.addChildTo(group);
                        show_back = false;
                        pos.update({ reverse: 0});                   
                    }
                }    
            });
        //データベースが書き換わった時の処理
        //位置をデータベースから反映する
        //裏の処理
            pos.on("value", function (snapshot) {
                id1 = snapshot.val().belong;
                if(show_back){
                    if(snapshot.val().x == back.x || snapshot.val().y == back.y)
                    {
                        back.addChildTo(group)
                    }
                    if(snapshot.val().reverse == 0)
                    {
                        shape.addChildTo(group);
                        back.remove();
                    }
                }
                if (id1 == 0 || id1 == ID) {
                    back.setPosition(snapshot.val().x, snapshot.val().y);
                } else {
                    back.setPosition(snapshot.val().x, snapshot.val().y + 1000);
                }
            });
        //わからないから誰か書き換えて
        //選択しているカードをタッチ可能にする
            back.update = function() {
                if (self.serect == null || self.serect == this) {             
                    back.setInteractive(true);
                } else {
                    back.setInteractive(false);
                }
            }
        });
        
        this.group = group;

    //表にするボタン作成
    Button({
        width: 105,
        height: 25,
        text: "表にする",
        fontSize: 14,
    }
    ).addChildTo(this).setPosition(this.gridX.span(14.55), this.gridY.span(13)).onpush = function () {
        for (let p of poss) {
            p.update({ reverse: 0 }); 
        }
    };    

    //裏にするボタン作成
    Button({
        width: 105,
        height: 25,
        text: "裏にする",
        fontSize: 14,
    }
    ).addChildTo(this).setPosition(this.gridX.span(14.55), this.gridY.span(13.52)).onpush = function () {
        for (let p of poss) {
            p.update({ reverse: 1 }); 
        }
    };    

    //シャッフルするボタン作成
    Button({
        width: 105,
        height: 25,
        text: "シャッフルする",
        fontSize: 14,
    }
    ).addChildTo(this).setPosition(this.gridX.span(14.55), this.gridY.span(14.04)).onpush = function () {
        /*
        for (var i = poss.length-1; i>0; i--) {
            var r = Math.floor(Math.random() * (poss.length-1));
            var tmp = poss[i];
            poss[i] = poss[r];
            poss[r] = tmp;
        }
        */
        var r = Math.floor(Math.random() * (poss.length-1));
        self.group.children.swap(poss.length-1,r);
        for (var i=0; i<100; i++) {
            var r1 = Math.floor(Math.random() * (poss.length-1));
            var r2 = Math.floor(Math.random() * (poss.length-1));
            var tmp = poss[r1];
            poss[r1] = poss[r2];
            poss[r2] = tmp;
        }
        for (let p of poss) {
            p.update({ belong: 0, x: 100, y: 100 });     
        } 
    };    

    //カードを集めるボタン作成
    Button({
        width: 105,
        height: 25,
        text: "カードを集める",
        fontSize: 14,
    }
    ).addChildTo(this).setPosition(this.gridX.span(14.55), this.gridY.span(14.56)).onpush = function () {
        for (let p of poss) {
            p.update({ belong: 0, x: 100, y: 100 });     
        }
    };    

    //カードを並べるボタン作成
    Button({
        width: 105,
        height: 25,
        text: "カードを並べる",
        fontSize: 14,
    }
    ).addChildTo(this).setPosition(this.gridX.span(14.55), this.gridY.span(15.08)).onpush = function () {
        var i = 60;
        var j = 90;
        for (let p of poss) {
            if(i >= 610) {
                i = 60;
                j += 95;
            }
            p.update({ belong: 0, x: i, y: j });   
            i += 75
        } 
    };

    //戻るボタン作成
        Button({
            width: 105,
            height: 25,
            text: "戻る",
            fontSize: 14,
        }
        ).addChildTo(this).setPosition(this.gridX.span(14.55), this.gridY.span(15.6)).onpush = function () {
            for (let p of poss) {
                p.once('value').then(function (snapshot) {
                    if (snapshot.val().belong == ID) {
                        p.update({ belong: 0 });
                    }
                });
            }
            self.exit('Title');
        };

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
});

//タイトルシーン=========================================================================================================
phina.define('TitleScene', {
    superClass: 'phina.display.DisplayScene',
    init: function () {
        this.superInit();
        const self = this;
    //タイトルを素敵にデコる
        this.backgroundColor = "rgb(39,86,3)";
        var shape = phina.display.Sprite("title");
        shape.setPosition(this.gridX.center(), this.gridY.span(10));
        shape.addChildTo(this);
    
        var bool = false;   //画像のロードが終わったか確認用。つまりゴミ
    //部屋に入る
        var room = Button({
            text: "ロード中",
            fontSize: 30,
            fill: "gray",
        });
        room.addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(10)).onpush = function () {
            if (bool) {
                self.exit('Room');
            }
        };
    //部屋を作る
        var make = Button({
            text: "ロード中",
            fontSize: 30,
            fill: "gray",
        });
        make.addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(12)).onpush = function () {
            //console.log(bool);
            if (bool) {
                self.exit('Make');
            }
        };
    //カードを作る
        var card = Button({
            text: "カードを作る",
            fontSize: 30,
            fill: "DeepSkyBlue",
        });
        card.addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(14)).onpush = function () {
            window.location.href = 'card_make/index.html';
        };
    //タイトル画面で全ての画像をダウンロードします。解決策求む
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
                //console.log(url);
            });
            //console.log(xs); 
            var loader = phina.asset.AssetLoader();
            loader.load(ASSETS);
            loader.on('load', function() {
                //console.log("load");
                bool = true;
                room.fill = "DeepSkyBlue",
                room.text = "部屋に入る" 
                make.fill = "DeepSkyBlue"
                make.text = "部屋を作る" 
            });                     
        });
    }
});

//ルーム作成シーン=========================================================================================================
phina.define('MakeScene', {
    superClass: 'phina.display.DisplayScene',
    init: function () {
        this.superInit();
        this.backgroundColor = 'lightblue';
        var self = this;
        var nonDrag = true;
        var group = DisplayElement().addChildTo(this); //ボタンをグループ化
    //選ぶためにカードを全部表示していく。
    //選ばれたカードは自分の画像を表示用の配列に入れます。
        var cards = [];           
        var x = 1.25;
        var y = 1.5;
        for ( a in ASSETS.image) {
            if (a == "title" || a == "bk0.png") {
                continue;
            }
            var card = phina.display.Sprite(a);
            card.addChildTo(group).setInteractive(true).setPosition(self.gridX.span(x), self.gridY.span(y));
            x += 1.5;
            if (x >= 16){
                x = 1.25;
                y += 1.5;
            }
            let num = 0;
            card.on('pointend', function (e) {
                if (nonDrag) {
                    num = num + 1;
                    var label = phina.display.Label({ 
                        text: num, 
                        fontSize: 30, 
                        fill: 'white',
                        stroke: 'black',
                        strokeWidth: 10,
                    });
                    label.addChildTo(this);
                    //console.log(this._image.src);
                    const result = Object.keys(ASSETS.image).filter( (key)  => {
                    return ASSETS.image[key] === this._image.src;
                    });
                    cards.push(result);
                }
                nonDrag = true;
            });
            card.on('pointmove', function (e) {
                nonDrag = false;
                group.y += e.pointer.dy;
            });
        }
    //backボタン作成
        Button({
            text: "戻る",
            fontSize: 30,
        }
        ).addChildTo(this).setPosition(this.gridX.span(4.5), this.gridY.span(15)).onpush = function () {
            self.exit('Title');
        };
    //押されたらデータベースに部屋情報を書き込む
        Button({
            text: "部屋を作る",
            fontSize: 30,
        }).addChildTo(self).setPosition(self.gridX.span(11), self.gridY.span(15)).onpush = function () {
        //部屋名入力
            var name = window.prompt("ルーム名","");
            var myroom = firebase.database().ref("/room/").push({
                name: name
            });
        //カードの情報書き込み
            for (i in cards) {
                myroom.child("/cards/").ref.push({
                    belong: 0,
                    id: i,
                    img: cards[i][0],
                    x: 100,
                    y: 100,
                    reverse: 1
                });
            }
            var param = { room: myroom };
            self.exit('Game', param);
        };
    }
});

//ルーム選択シーン=========================================================================================================
phina.define('RoomScene', {
    superClass: 'phina.display.DisplayScene',
    init: function () {
        this.superInit();
        this.backgroundColor = 'lightblue';
        const self = this;
        var group = DisplayElement().addChildTo(this); //ボタンをグループ化
        var i = 3;
        var j = 3;
        var sel = false;    //１度しかボタンを押させないため。
        var nonDrag = true;
    //部屋ごとにボタンを作る。
        firebase.database().ref("/room").on("child_added", function (snapshot) {
            var name = snapshot.val().name;
            var roombtn = Button({
                width: 150,
                height: 60,
                text: name,
                fontSize: 20,
            });
            roombtn.addChildTo(group).setPosition(self.gridX.span(i), self.gridY.span(j));
            i += 5
            if(i >= 15) {
                i = 3;
                j += 1.5;
            }
            roombtn.on('pointend', function (e) {
                if (!sel && nonDrag) {
                    this.fill = "pink";
                    sel = true;
                    var param = { room: snapshot };
                //ルームのカードをダウンロードして終わったらゲームシーンに移動する
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
                            //console.log(url);
                        });    
                        //console.log(xs); 
                        var loader = phina.asset.AssetLoader();
                        loader.load(ASSETS);
                        loader.on('load', function() {
                            //console.log("load");
                            self.exit('Game', param);
                        });                     
                    });
                };
                nonDrag = true;
            });
        //roomのボタンをドラッグ可能にする
            roombtn.on('pointmove', function (e) {
                //console.log("a");
                nonDrag = false;
                group.y += e.pointer.dy;
            });
        });

        //ボタン
        //backボタン作成
        Button({
            width: 150,
            height: 60,
            text: "戻る",
            fontSize: 20,
            fill:  "pink",
        }
        ).addChildTo(this).setPosition(this.gridX.span(3), this.gridY.span(1.5)).onpush = function () {
            self.exit('Title');
        };

    }
});

//メイン処理=========================================================================================================
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
        ],
        assets: ASSETS,
    });
    app.run();
});
