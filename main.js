// phina.js をグローバル領域に展開
phina.globalize();

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'CanvasScene',
  init: function() {
    this.superInit();
    this.backgroundColor = '#999';
    var player = Player("player1");
    var rect = RectangleShape().addChildTo(this);
    var Card1 = Card(rect);
    //Card1.card.addChildTo(this);
    player.my_Card.push = Card1;    
  },
});

phina.define('Player', {
  init: function(name) {
      this.my_Card = [];
      this.have_card = 0;
      this.Name = name;
  },
});

phina.define('Card', {
  // 初期化
  init: function(obj) {
      // クラスメンバ
      var card = obj;
      card.x = 320;
      card.y = 720;
      card.scaleX = 2;
      card.scaleY = 3;
      card.setInteractive(true);
      card.on('pointmove', function(e) {
      card.x += e.pointer.dx;
      card.y += e.pointer.dy;
  });
  },
});

phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    startLabel: 'main', // メインシーンから開始する
  });
  // アプリケーション実行
  app.run();
});
