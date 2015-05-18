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
| caseSensitive  | Type:Boolean <br /> Default:false <br /> Values:true,false <br /> Set the completer as case sensetive or not  |
| completeBoxPosition  | Type: String <br /> Default:'at-word-begin' <br /> Values:at-word-begin, at-cursor <br /> Is the Value "at-word-begin" set than is the complete box position at the word beginning after a seperator. Is the "at-cursor" set than is the complet box at the position of the cursor.   |
| data  | Content Cell  |
| fastComplete  | Type: Boolean <br /> Default:true <br /> Values:true, false <br /> If this property true than use the piece complete a fast completion and select all time if the complet box visibile the first element to inserting whit a Enter.  |
| fastSelection  | Type: String <br /> Default: 'piece-fast-selection' <br /> The class of the complet box where displays whitch word is selected for fast insert into the input field  |
| hasPieceComplete  | Type: String <br /> Default: 'has-piece-complete' <br /> The class of the Field that have a piece complete  |
| list  | Content Cell  |
| min  | Type: Integer <br /> Default: 1 <br /> Values: Number >= 0 <br />The minimum characters after the completer start run after a seperator.   |
| pieces  | Type: Array <br /> Default: [] <br /> A list where the completer seperate the words in the input field. Is the Field a Textarea than is a new line a additional seperator |
| selection  | Type: String <br /> Default: 'piece-selection' <br /> The class of the selected element in the complete box  |

