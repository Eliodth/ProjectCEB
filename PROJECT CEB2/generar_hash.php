<?php

$contrasena = '1234';

$hash = password_hash($contrasena, PASSWORD_DEFAULT);

echo $hash;

?>