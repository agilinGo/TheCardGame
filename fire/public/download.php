<?php
    $url=$_POST["data"];
    $data = file_get_contents($url);
    file_put_contents('./image/rock.jpg',$data);
    print "endooooooooooooo";
?>