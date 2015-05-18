# PIECE
#### Input
```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <link rel="stylesheet" href="pieceComplete.css" type="text/css">
    <script type="text/javascript" language="JavaScript" src="pieceComplete.js"></script>
</head>
<body>
  <input id="piece-complete" />
  <script>
   PIECE.initialise('piece-complete', {
        pieces:[' '],
        data:['reading', 'running', 'eating', 'sleeping', 'swimming', 'writing', 'watching', 'working', 'helping'],
    });
  </script
</body
</html
```
#### Textarea
```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <link rel="stylesheet" href="pieceComplete.css" type="text/css">
    <script type="text/javascript" language="JavaScript" src="pieceComplete.js"></script>
</head>
<body>
  <input id="piece-complete" />
  <script>
   PIECE.initialise('piece-complete', {
        pieces:[' '],
        data:['reading', 'running', 'eating', 'sleeping', 'swimming', 'writing', 'watching', 'working', 'helping'],
    });
  </script
</body
</html
```
#### Settings
| Setting  | Destcription |
| ------------- | ------------- |
| caseSensitive  | Type:Boolean 
Default:false VALUES:true|false Set the completer as case sensetive or not  |
| completeBoxPosition  | Type: String Default:'at-word-begin' Values:at-word-begin|at-cursor Is the Value "at-word-begin" set than is the complete box position at the word beginning after a seperator. Is the "at-cursor" set than is the complet box at the position of the cursor.   |
| data  | Content Cell  |
| fastComplete  | Type: Boolean Default:true Values:true|false If this property true than use the piece complete a fast completion and select all time if the complet box visibile the first element to inserting whit a Enter.  |
| fastSelection  | Type: String Default: 'piece-fast-selection' The class of the complet box where displays whitch word is selected for fast insert into the input field  |
| hasPieceComplete  | Type: String Default: 'has-piece-complete' The class of the Field that have a piece complete  |
| list  | Content Cell  |
| min  | Type: Integer The minimum characters after the completer start run after a seperator.   |
| pieces  | Type: Array \n A list where the completer seperate the words in the input field. Is the Field a Textarea than is a new line a additional seperator |
| selection  | Type: String Default: 'piece-selection' The class of the selected element in the complete box  |

