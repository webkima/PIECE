<?php
    header('Cache-Control: no-cache, must-revalidate');
    header('Content-type: application/json');

    echo json_encode(array('reading', 'running', 'eating', 'sleeping', 'swimming', 'writing', 'watching', 'working', 'helping', 'listening', 'waiting', 'walking', 'whisper'));