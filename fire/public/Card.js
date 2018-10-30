phina.define('Card', {
    init: function(obj,snapshot) {
        this.obj = obj;
        var pos = snapshot.ref;
        var id = snapshot.val().id;
        obj.setPosition(100,100);
        //obj.setScale(2,3);
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