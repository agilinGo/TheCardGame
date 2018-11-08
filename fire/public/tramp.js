// phina.js をグローバル領域に展開
phina.globalize();

var ASSETS = {
  image: {
    'c01': '../../Tramp/c01.png',
    'c02': '../../Tramp/c02.png',
    'c03': '../../Tramp/c03.png',
    'c04': '../../Tramp/c04.png',
    'c05': '../../Tramp/c05.png',
    'c06': '../../Tramp/c06.png',
    'c07': '../../Tramp/c07.png',
    'c08': '../../Tramp/c08.png',
    'c09': '../../Tramp/c09.png',
    'c10': '../../Tramp/c10.png',
    'c11': '../../Tramp/c11.png',
    'c12': '../../Tramp/c12.png',
    'c13': '../../Tramp/c13.png',
    's01': '../../Tramp/s01.png',
    's02': '../../Tramp/s02.png',
    's03': '../../Tramp/s03.png',
    's04': '../../Tramp/s04.png',
    's05': '../../Tramp/s05.png',
    's06': '../../Tramp/s06.png',
    's07': '../../Tramp/s07.png',
    's08': '../../Tramp/s08.png',
    's09': '../../Tramp/s09.png',
    's10': '../../Tramp/s10.png',
    's11': '../../Tramp/s11.png',
    's12': '../../Tramp/s12.png',
    's13': '../../Tramp/s13.png',
    'd01': '../../Tramp/d01.png',
    'd02': '../../Tramp/d02.png',
    'd03': '../../Tramp/d03.png',
    'd04': '../../Tramp/d04.png',
    'd05': '../../Tramp/d05.png',
    'd06': '../../Tramp/d06.png',
    'd07': '../../Tramp/d07.png',
    'd08': '../../Tramp/d08.png',
    'd09': '../../Tramp/d09.png',
    'd10': '../../Tramp/d10.png',
    'd11': '../../Tramp/d11.png',
    'd12': '../../Tramp/d12.png',
    'd13': '../../Tramp/d13.png',
    'h01': '../../Tramp/h01.png',
    'h02': '../../Tramp/h02.png',
    'h03': '../../Tramp/h03.png',
    'h04': '../../Tramp/h04.png',
    'h05': '../../Tramp/h05.png',
    'h06': '../../Tramp/h06.png',
    'h07': '../../Tramp/h07.png',
    'h08': '../../Tramp/h08.png',
    'h09': '../../Tramp/h09.png',
    'h10': '../../Tramp/h10.png',
    'h11': '../../Tramp/h11.png',
    'h12': '../../Tramp/h12.png',
    'h13': '../../Tramp/h13.png',
    'bk0': '../../Tramp/bk0.png',
  },
};

// MainScene クラスを定義
phina.define('Sinsui', {
  superClass: 'CanvasScene',
  init: function() {     
    this.superInit();
    var group = DisplayElement().addChildTo(this);
    var member;
    try {
      member = snapshot.val().member;
    } catch(e) {
      member = firebase.database().ref('/nakahara').set({member:1});
    }   
    var cards = [];
    var Cards = [];
    var marks = ['c','s','d','h'];
    var number = ['01','02','03','04','05','06','07','08','09','10','11','12','13'];
    var self = this;
    var serect = null;
    var fire_card;
    var card_name = []
    for(var i = 0; i < marks.length;i++)
    {
      for(var j = 0; j < number.length;j++)
      {
        cards.push(phina.display.Sprite(marks[i] + number[j]));
        card_name.push(marks[i] + number[j])           
      }
    }
    for(var i = cards.length - 1; i > 0; i--){
      var r = Math.floor(Math.random() * (i + 1));
      var tmp = cards[i];
      cards[i] = cards[r];
      cards[r] = tmp;
    }
    for(var k = 0; k < cards.length;k++)
    {      
        Cards.push(Card(cards[k],group));
        fire_card = firebase.database().ref('/nakahara/' + card_name[k]).set({            
            x : 250,
            y : 300,
        });
    }
    var hand_field = phina.display.RectangleShape();
    hand_field.addChildTo(group);
    hand_field.setPosition(320,860);
    hand_field.setScale(10,3);
    hand_field.fill = "pink";   
  },
});
phina.define('Card', {
  // 初期化
  init: function(obj,c) {
      // クラスメンバ      
      var move = false; 
      var card = obj;
      var start_X;
      var start_Y;
      var dir_X;
      var dir_Y;
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
        if(self.serect == this) 
        {
          card.x += e.pointer.dx;
          card.y += e.pointer.dy;
          back.x += e.pointer.dx;
          back.y += e.pointer.dy; 
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
      var back = phina.display.Sprite('bk0');
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
        if(dir_X == 0)/*(dir_X > -0.01) && (dir_X < 0.01)*/
        {
          if(dir_Y == 0)/*(dir_X > -0.01) && (dir_X < 0.01)*/
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
});

phina.define('Player', {
  // 初期化
  init: function() {
      
  },
});

// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    startLabel: 'sinsui', // メインシーンから開始する
    assets: ASSETS,
    scenes: [
      {
        className: 'Sinsui',
        label: 'sinsui',
      },
    ]
  });
  // アプリケーション実行
  app.run();
});
