// ページの読み込みが完了したらコールバック関数が呼ばれる
// ※コールバック: 第2引数の無名関数(=関数名が省略された関数)
window.addEventListener('load', () => {

    const canvas = document.querySelector('#draw-area');
    // contextを使ってcanvasに絵を書いていく
    const context = canvas.getContext('2d');
    context.fillStyle = 'rgb(255,255,255)';
    //背景
    context.fillRect(0,0,236,300);
    //枠線
    context.strokeRect(0,0,236,300);
    // 直前のマウスのcanvas上のx座標とy座標を記録する
    const lastPosition = { x: null, y: null };

    // マウスがドラッグされているか(クリックされたままか)判断するためのフラグ
    let isDrag = false;

    // 絵を書く
    function draw(x, y) {
        // マウスがドラッグされていなかったら処理を中断する。
        // ドラッグしながらしか絵を書くことが出来ない。
        if(!isDrag) {
            return;
        }

    // 「context.beginPath()」と「context.closePath()」を都度draw関数内で実行するよりも、
    // 線の描き始め(dragStart関数)と線の描き終わり(dragEnd)で1回ずつ読んだほうがより綺麗に線画書ける

    // 線の状態を定義する
    // MDN CanvasRenderingContext2D: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin
        
        //context.fillStyle = "#FFFFFF";//Canvas背景色白
        context.lineCap = 'round'; // 丸みを帯びた線にする
        context.lineJoin = 'round'; // 丸みを帯びた線にする
        context.lineWidth = 5; // 線の太さ
        context.strokeStyle = 'black'; // 線の色

    // 書き始めは lastPosition.x, lastPosition.y の値はnullとなっているため、
    // クリックしたところを開始点としている。
    // この関数(draw関数内)の最後の2行で lastPosition.xとlastPosition.yに
    // 現在のx, y座標を記録することで、次にマウスを動かした時に、
    // 前回の位置から現在のマウスの位置まで線を引くようになる。
        if (lastPosition.x === null || lastPosition.y === null) {
            // ドラッグ開始時の線の開始位置
            context.moveTo(x, y);
        } else {
            // ドラッグ中の線の開始位置
            context.moveTo(lastPosition.x, lastPosition.y);
        }
    // context.moveToで設定した位置から、context.lineToで設定した位置までの線を引く。
    // - 開始時はmoveToとlineToの値が同じであるためただの点となる。
    // - ドラッグ中はlastPosition変数で前回のマウス位置を記録しているため、
    //   前回の位置から現在の位置までの線(点のつながり)となる
        context.lineTo(x, y);

    // context.moveTo, context.lineToの値を元に実際に線を引く
        context.stroke();

    // 現在のマウス位置を記録して、次回線を書くときの開始点に使う
        lastPosition.x = x;
        lastPosition.y = y;
    }
    
    
    //スマホ用
	var finger=new Array;
	for(var i=0;i<10;i++){
		finger[i]={
			x:0,y:0,x1:0,y1:0,
			color:"rgb("
			+Math.floor(Math.random()*16)*15+","
			+Math.floor(Math.random()*16)*15+","
			+Math.floor(Math.random()*16)*15
			+")"
		};
	}

	//タッチした瞬間座標を取得
	canvas.addEventListener("touchstart",function(e){
		e.preventDefault();
		var rect = e.target.getBoundingClientRect();
		context.lineWidth = document.getElementById("lineWidth").value;
		context.globalAlpha = document.getElementById("alpha").value/100;
		undoImage = context.getImageData(0, 0,canvas.width,canvas.height);
		for(var i=0;i<finger.length;i++){
			finger[i].x1 = e.touches[i].clientX-rect.left;
			finger[i].y1 = e.touches[i].clientY-rect.top;



		}
	});

	//タッチして動き出したら描画
	canvas.addEventListener("touchmove",function(e){
		e.preventDefault();
		var rect = e.target.getBoundingClientRect();
		for(var i=0;i<finger.length;i++){
			finger[i].x = e.touches[i].clientX-rect.left;
			finger[i].y = e.touches[i].clientY-rect.top;
			context.beginPath();
			context.moveTo(finger[i].x1,finger[i].y1);
			context.lineTo(finger[i].x,finger[i].y);
			context.lineCap="round";
			context.stroke();
			finger[i].x1=finger[i].x;
			finger[i].y1=finger[i].y;

		}
	});
    
    /*
	//線の太さの値を変える
    lineWidth.addEventListener("touchmove",function(){
        var lineNum = document.getElementById("lineWidth").value;
        document.getElementById("lineNum").innerHTML = lineNum;
    });

    //透明度の値を変える
    alpha.addEventListener("touchmove",function(){
        var alphaNum = document.getElementById("alpha").value;
        document.getElementById("alphaNum").innerHTML = alphaNum;
    });
    */
    //メニューに戻る
    function r_menu(){
        window.location.href = '../index.html';
    }
    // canvas上に書いた絵を全部消す
    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    // canvas上に書いた絵を保存する
    function make(){
        //canvasを画像へ
        var base64 = canvas.toDataURL();
        document.getElementById("img").src = base64;
    }
    //画像のダウンロード
    function save(){
        //後で名前をタイプして指定できるようにしたい
        var fileName = window.prompt("カードに名前をつけよう！","Card");
        //サイズ縮小
        var base64 = CanvasResize(canvas,66,84);
        //base64データをblobに変換
        var blob = Base64toBlob(base64);
        //画像の保存
        //saveBlob(blob, fileName+'.png');
        //firebaseへのアップロード
        upload2fire(blob, fileName);
    }
    //canvasサイズ変換
    CanvasResize = function(canvas,width,height){
        var img = new Image();
        img.onload = function(){
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img,0,0,width,height);
        }
        return canvas.toDataURL();
    }
    //Base64データをBlobに変換
    function Base64toBlob(base64){   
	   var tmp = base64.split(',');
	   var data = atob(tmp[1]);
	   var mime = tmp[0].split(':')[1].split(';')[0];
	   var buf = new Uint8Array(data.length);
	   for (var i = 0; i < data.length; i++) {
		  buf[i] = data.charCodeAt(i);
	   }
	   var blob = new Blob([buf], { type: mime });
	   return blob;
    }
    //
    function saveBlob(blob, fileName){
        var url = (window.URL || window.webkitURL);
        // ダウンロード用のURL作成
        var dataUrl = url.createObjectURL(blob);
        // イベント作成
        var event = document.createEvent("MouseEvents");
        event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        // a要素を作成
        var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
        // ダウンロード用のURLセット
        a.href = dataUrl;
        // ファイル名セット
        a.download = fileName;
        // イベントの発火
        a.dispatchEvent(event);
    }

    //firebaseへのアップロード
    function upload2fire(blob,fileName){
        // rootパスを作成
        var storageRef = otherStorage.ref();
        var databaseRef = otherDatabase.ref("/image");
        var cardRef = storageRef.child(fileName+'.png');
        cardRef.put(blob);
        databaseRef.push({name: fileName+'.png'});
    }
    
  // マウスのドラッグを開始したらisDragのフラグをtrueにしてdraw関数内で
  // お絵かき処理が途中で止まらないようにする
    function dragStart(event) {
    // これから新しい線を書き始めることを宣言する
    // 一連の線を書く処理が終了したらdragEnd関数内のclosePathで終了を宣言する
        context.beginPath();

        isDrag = true;
    }
  // マウスのドラッグが終了したら、もしくはマウスがcanvas外に移動したら
  // isDragのフラグをfalseにしてdraw関数内でお絵かき処理が中断されるようにする
    function dragEnd(event) {
        // 線を書く処理の終了を宣言する
        context.closePath();
        isDrag = false;

        // 描画中に記録していた値をリセットする
        lastPosition.x = null;
        lastPosition.y = null;
    }

    // マウス操作やボタンクリック時のイベント処理を定義する
    function initEventHandler() {
        //メニューに戻る
        const returnButton = document.querySelector('#return');
        returnButton.addEventListener('click', r_menu);
        //消す
        const clearButton = document.querySelector('#clear');
        clearButton.addEventListener('click', clear);
        //作る
        const makeButton = document.querySelector('#make');
        makeButton.addEventListener('click', make);
        //保存
        const saveButton = document.querySelector('#save');
        saveButton.addEventListener('click', save);

        canvas.addEventListener('mousedown', dragStart);
        canvas.addEventListener('mouseup', dragEnd);
        canvas.addEventListener('mouseout', dragEnd);
        canvas.addEventListener('mousemove', (event) => {
      // eventの中の値を見たい場合は以下のようにconsole.log(event)で、
      // デベロッパーツールのコンソールに出力させると良い
      // console.log(event);

            draw(event.layerX, event.layerY);
        });
    }

    // イベント処理を初期化する
    initEventHandler();
});
