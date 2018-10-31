<?php
    $url=$_POST["data"];
    $data = file_get_contents($url);
    $filename='./image/rock.jpg';
    file_put_contents($filename,$data);
    echo "good?";
?>