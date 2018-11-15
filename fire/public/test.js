var vars = [], max = 0, hash = "", array = "";
var url = window.location.search;

//?を取り除くため、1から始める。複数のクエリ文字列に対応するため、&で区切る
hash = url.slice(1).split('&'); 
max = hash.length;
for (var i = 0; i < max; i++) {
array = hash[i].split('='); //keyと値に分割。
vars.push(array[0]); //末尾にクエリ文字列のkeyを挿入。
vars[array[0]] = decodeURIComponent(array[1]); //先ほど確保したkeyに、値を代入。
}

var val = vars["kenta"]; //遷移元の「name」と同じ名前
console.log(val);
document.write(val);