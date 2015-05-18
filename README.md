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
<hr />
#### Settings
| Setting  | Destcription |
| ------------- | ------------- |
| caseSensitive  | Type: Boolean <br /> Default: false <br /> Values: true,false <br /><br /> Set the completer as case sensetive or not  |
| completeBoxPosition  | Type: String <br /> Default: 'at-word-begin' <br /> Values: at-word-begin, at-cursor <br /><br /> Is the Value "at-word-begin" set than is the complete box position at the word beginning after a seperator. Is the "at-cursor" set than is the complet box at the position of the cursor.   |
| data  | Type: Array, String, Function <br /> Default: [] <br /><br /> **Array**: A List of Words that the completer using <br /><br /> **String**: A Url of a Server where the completer become a list of word that the completer use. The completer expected as return value a Array as jsonstrin. <br /><br /> **Function**: A own Callback to select the displayed Values in the complet box. [see Data Callback](#data-callback) |
| fastComplete  | Type: Boolean <br /> Default: true <br /> Values: true, false <br /><br /> If this property true than use the piece complete a fast completion and select all time if the complet box visibile the first element to inserting whit a Enter.  |
| fastSelection  | Type: String <br /> Default: 'piece-fast-selection' <br /><br /> The class of the complet box where displays whitch word is selected for fast insert into the input field  |
| hasPieceComplete  | Type: String <br /> Default: 'has-piece-complete' <br /><br /> The class of the Field that have a piece complete  |
| list  | Content Cell  |
| min  | Type: Integer <br /> Default: 1 <br /> Values: Number >= 0 <br /><br /> The minimum characters after the completer start run after a seperator.   |
| pieces  | Type: Array <br /> Default: [] <br /><br /> A list where the completer seperate the words in the input field. Is the Field a Textarea than is a new line a additional seperator |
| selection  | Type: String <br /> Default: 'piece-selection' <br /><br /> The class of the selected element in the complete box  |

<hr />
####Data Callback
|   | Type |Destcription |
| ------------- | ------------- | ------------- |
| handlingData | Object | The Handling object with informations fo the word at the current and the word of the word before the piece seperator.
| hide | Function(void)| Hide the complete box. |
| show | Function(void) | Show the complete box | 
| update | Function(Array) | Update the complet box whit the givingData |
| wait | Function(void) | Show the complet box with a waiting icon |
| isWait | Boolean | is this value true than is the complet box dispaly with a waiting icon, but only if the returning a empty Array|
| return | value | the returning a arary. Has the array values than is the complet box display. |

#### using Data Callback
```Javascript
PIECE.initialise('piece-complete3', {
        pieces:[' '],
        data:function(_handlingData) {
            if(_handlingData.current.value.match('^a')) {
                return ['apple']
            } else if(_handlingData.current.value.match('^b'))) {
                return ['banana']
            }
            
            return [];
        }
```
