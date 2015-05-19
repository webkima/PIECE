var PIECE = (function () {
    return new function () {
        var that = this;
        var alreadyInitialised = [];
        var objects = {};
        var settings = {
            pieces: null,
            data: [],
            list: {
                name: 'piece-list',
                container: 'piece-complete'
            },
            caseSensitive: false,
            fastComplete: true,
            hasPieceComplete: 'has-piece-complete',
            selection: 'piece-selection',
            fastSelection: 'piece-fast-selection',
            min: 1,
            dataFunc: loadDataCaseInSensitive,
            completeBoxPosition:'at-word-begin'
        };

        /**
         * check is the giving id already initialised as piece complete
         * @param _id
         * @returns {boolean}
         */
        function isAlreadyInitialised(_id) {
            return alreadyInitialised.indexOf(_id) != -1;
        }

        this.setSettings = function (_settings) {
            if ('pieces' in _settings && _settings.pieces instanceof Array) {
                settings.pieces = _settings.pieces;
            }

            if ('caseSensitive' in _settings && typeof(_settings.caseSensitive) == 'boolean') {
                settings.caseSensitive = _settings.caseSensitive; //bool
                settings.dataFunc = _settings.caseSensitive ? loadData : loadDataCaseInSensitive;
            }

            //TODO external dataloading implementing
            if ('data' in _settings) { //string|array|function
                if (typeof(_settings.data) === "string") {
                    settings.data = _settings.data;
                    settings.dataFunc = settings.dataFunc;
                } else if (typeof(_settings.data) === "function") {
                    settings.dataFunc = _settings.data;
                } else if (_settings.data instanceof Array) {
                    settings.dataFunc = settings.dataFunc;
                    settings.data = _settings.data;
                }
            }

            if ('fastComplete' in _settings && typeof(_settings.fastComplete) == 'boolean') settings.fastComplete = _settings.fastComplete; //bool

            if ('min' in _settings) { // int
                if (_settings.min < 0) settings.min = 0;
                else settings.min = _settings.min;
            }

            if ('hasPieceComplete' in _settings && typeof(_settings.hasPieceComplete) == 'string') settings.hasPieceComplete = _settings.hasPieceComplete; //string
            if ('selection' in _settings && typeof(_settings.selection) == 'string') settings.selection = _settings.selection; // string
            if ('fastSelection' in _settings && typeof(_settings.fastSelection) == 'string') settings.fastSelection = _settings.fastSelection; //string

            if ('list' in _settings) {
                if ('name' in _settings.list && typeof(settings.list.name) == 'string')  settings.list.name = _settings.list.name; //string
                if ('container' in _settings.list && typeof(settings.list.container) == 'string') settings.list.container = _settings.list.container; //string
            }

            if('completeBoxPosition' in _settings && (_settings.completeBoxPosition == 'at-word-begin' || _settings.completeBoxPosition == 'at-cursor')) {
                settings.completeBoxPosition = _settings.completeBoxPosition;
            }
        };

        /**
         * get the piece complete context from id
         * @param _id
         * @returns {*}
         */
        this.getObjects = function (_id) {
            if (_id in objects) {
                return objects[_id];
            }

            return null;
        };

        /**
         * Initialise a new Piece Complete
         *
         * @param _id {string}
         * @param _settings {object}
         */
        this.initialise = function (_id, _settings) {
            if (!isAlreadyInitialised(_id)) {
                alreadyInitialised.push(_id);
                objects[_id] = createPieceComplete(document.getElementById(_id), _settings);
            } else {
                console.log(_id + ': already initialised.');
            }
        };

        /**
         * create a new piece complete and set default and customer settings.
         *
         * @param _dom
         * @param _settings
         * @returns {{dom: *, settings: *, pieceData: {self: *}}}
         */
        function createPieceComplete(_dom, _settings) {
            _dom.onkeyup = function (_event) {
                var cursor = doGetCaretPosition(this);
                var searchString = this.value.substr(0, cursor);

                var context = that.getObjects(_dom.getAttribute('id'));
                switch (_event.keyCode) {
                    case 27: // ESC
                        if (context.complete.isShown()) {
                            context.complete.hide();
                            context.complete.clear();
                        }
                        break;
                    case 38: //Arrow up
                        if (context.complete.isShown()) {
                            context.complete.prev();
                        }
                        break;
                    case 40: //Arrow down
                        if (context.complete.isShown()) {
                            context.complete.next();
                        }
                        break;
                    default:
                        var handlingObject = getHandlingObject(searchString, cursor, this.pieces);

                        context.pieceData.show = null;
                        context.pieceData.wait = false;
                        context.complete.__handlingObject = handlingObject;

                        if (context) {
                            var data = context.pieceData(handlingObject);

                            context.pieceData.update(data);
                        }
                }
            };

            _dom.onclick = function() {
                var context = that.getObjects(_dom.getAttribute('id'));
                context.complete.hide();
            };

            _dom.onkeydown = function (_event) {
                var context = that.getObjects(_dom.getAttribute('id'));
                if (context.complete.isShown() && (_event.keyCode == 40 || _event.keyCode == 38)) {
                    return false;
                } else if (_event.keyCode == 13) {
                    if (context.complete.isShown()) {
                        context.complete.onclick();
                        return false;
                    }
                }
            };

            //check separator
            if (!('pieces' in _settings && _settings.pieces instanceof Array)) {
                _settings.pieces = settings.pieces;
            }

            if (_dom.tagName == 'TEXTAREA') {
                if (!(_settings.pieces || _settings.pieces instanceof Array)) {
                    _settings.pieces = [];
                }

                _settings.pieces.push('\n');
            }

            if (!('caseSensitive' in _settings)) _settings.caseSensitive = settings.caseSensitive;
            if (!('fastComplete' in _settings) || !_settings.fastComplete) _settings.fastComplete = settings.fastComplete;


            //check data source
            var context = {};
            var dataFunc = null;
            var data = null;
            if ('data' in _settings) {
                if (typeof(_settings.data) === "string") {
                    var xhr = request(_settings.data, 'POST');
                    xhr.context = context;
                    xhr.send();
                    data = settings.data;
                    dataFunc = _settings.caseSensitive ? loadData : loadDataCaseInSensitive;
                } else if (typeof(_settings.data) === "function") {
                    dataFunc = _settings.data;
                } else if (_settings.data instanceof Array) {
                    dataFunc = _settings.caseSensitive ? loadData : loadDataCaseInSensitive;
                    data = _settings.data;
                } else {
                    _settings.data = settings.data;
                    dataFunc = _settings.caseSensitive ? loadData : loadDataCaseInSensitive;
                    data = _settings.data.sort();
                }
            } else {
                if (typeof(settings.data) === "function") {
                    dataFunc = settings.data;
                } else {
                    _settings.data = settings.data;
                    dataFunc = _settings.dataFunc;
                }
            }

            if ('list' in _settings) {
                if (!('name' in _settings.list))  _settings.list.name = settings.list.name;
                if (!('container' in _settings.list)) _settings.list.container = settings.list.container;
            } else {
                _settings.list = settings.list
            }

            if ('min' in _settings) {
                if (_settings.min < 0) _settings.min = 0;
            } else {
                _settings.min = 1;
            }

            if(!('completeBoxPosition' in _settings && (_settings.completeBoxPosition == 'at-word-begin' || _settings.completeBoxPosition == 'at-cursor'))) {
                _settings.completeBoxPosition = settings.completeBoxPosition;
            }

            if (!('hasPieceComplete' in _settings)) _settings.hasPieceComplete = settings.hasPieceComplete;
            if (!('selection' in _settings)) _settings.selection = settings.selection;
            if (!('fastSelection' in _settings)) _settings.fastSelection = settings.fastSelection;

            _dom.pieces = _settings.pieces;
            _dom.setCursorTo = setCursorTo;
            _dom.classList.add(_settings.hasPieceComplete);
            _dom.__completeBoxPosition = _settings.completeBoxPosition;
            context.input = _dom;
            context.settings = _settings;
            context.complete = createPieceCompleteBox(_settings);
            context.pieceData = function (_handlingObject) {
                return this.pieceData.__callback(_handlingObject);
            };

            context.pieceData.__complete = context.complete;
            context.pieceData.__callback = dataFunc;
            context.pieceData.show = context.complete.show;
            context.pieceData.wait = context.complete.wait;
            context.pieceData.hide = context.complete.hide;
            context.pieceData.isWait = false;
            context.pieceData.isShow = null;
            context.pieceData.min = _settings.min;
            context.pieceData.update = pieceCompleteBoxUpdate;
            context.pieceData.caseSensitive = _settings.caseSensitive;

            if (data) context.pieceData.data = data;

            context.complete.hide();

            if (context.input.nextElementSibling) {
                context.input.parentNode.insertBefore(context.complete, context.input.nextElementSibling);
            } else {
                context.input.parentNode.appendChild(context.complete);
            }

            context.complete.onclick = inputPieceAdvice;
            context.complete.__input = context.input;

            //set pieceCompleteBox position
            if (context.input.tagName == 'INPUT') {
                var documentBody = document.getElementsByTagName('body')[0];
                var inputPosition = context.input.getBoundingClientRect();
                context.complete.style.left = (inputPosition.left + documentBody.scrollLeft) + 'px';
                context.complete.style.top = (inputPosition.top + inputPosition.height + documentBody.scrollTop) + 'px';
                context.complete.style.width = inputPosition.width + 'px';
                context.complete.style.minWidth = inputPosition.width + 'px';
            } else {
                var style = window.getComputedStyle(context.input, null);
                context.complete.pieceCompleteBoxMove = pieceCompleteBoxMove;
                var span = document.createElement('span');
                span.style.fontFamily = style.fontFamily;
                span.style.fontSize = style.fontSize;
                span.textContent = 'ghwi';
                span.style.position = 'absolute';
                span.style.left = '-2500000px';

                document.getElementsByTagName('body')[0].appendChild(span);
                var cstyle = window.getComputedStyle(span, null);
                context.input.__rowHeight = toFloat(cstyle.height);
                context.input.__offsetTop = toInt(style.paddingTop) + toInt(style.borderTop);
                context.input.__offsetLeft = toInt(style.paddingLeft) + toInt(style.borderLeft);
                context.input.__fontFamily = style.fontFamily;
                context.input.__fontSize = style.fontSize;
                span.parentNode.removeChild(span);
            }

            return context;
        }

        function setCursorTo(_position) {
            this.setSelectionRange(_position, _position);
        }

        /**
         * Update the list of Complete item and show or hide it.
         * if set the wait property then displays a waiting for data image.
         *
         * @param _data
         */
        function pieceCompleteBoxUpdate(_data) {
            var list = this.__complete.getElementsByClassName(this.__complete.__listName)[0];
            var newList = list.cloneNode(false);

            if (_data) {
                for (var dataIndex in _data) {
                    if (dataIndex in _data) {
                        var li = document.createElement('li');
                        li.textContent = _data[dataIndex];
                        newList.appendChild(li);
                    }
                }
            }

            this.__complete.replaceChild(newList, list);

            if (this.isShow == null && _data.length > 0) {
                if (this.__complete.pieceCompleteBoxMove) this.__complete.pieceCompleteBoxMove(this.__complete);
                this.__complete.show();
            } else if (this.isShow) {
                if (this.__complete.pieceCompleteBoxMove) this.__complete.pieceCompleteBoxMove(this.__complete);
                this.__complete.show();
            } else if (this.isWait) {
                if (this.__complete.pieceCompleteBoxMove) this.__complete.pieceCompleteBoxMove(this.__complete);
                this.__complete.wait();
            } else {
                this.__complete.hide();
            }
        }

        /**
         * move the piece complete box to the word begin at of the cursor
         */
        function pieceCompleteBoxMove() {
            var documentBody = document.getElementsByTagName('body')[0];
            var inputPosition = this.__input.getBoundingClientRect();
            var size = getTextPosition(this.__input, this.__handlingObject, this.__handlingObject.row);
            this.style.left = ((inputPosition.left + documentBody.scrollLeft + size.width) - this.__input.scrollLeft) + 'px';
            this.style.top = ((inputPosition.top + documentBody.scrollTop + size.height) - this.__input.scrollTop) + 'px';
        }

        /**
         * parse a css size/position value in int
         * @param _value
         * @returns {Number}
         */
        function toInt(_value) {
            return parseInt(_value.replace('px', ''));
        }

        /**
         * parse a css size/position value in float
         * @param _value
         * @returns {Number}
         */
        function toFloat(_value) {
            return parseFloat(_value.replace('px', ''));
        }

        /**
         * calculate the position of the current cursor in px
         *
         * @param _dom
         * @param _handlingObject
         * @param _row
         * @returns {{width: *, height: *}}
         */
        function getTextPosition(_dom, _handlingObject, _row) {
            var canvas = getTextPosition.canvas || (getTextPosition.canvas = document.createElement("canvas"));
            var context = canvas.getContext("2d");
            var textLength = _dom.__completeBoxPosition == 'at-cursor' ? _handlingObject.cursor : _handlingObject.current.range.min;
            context.font = [_dom.__fontSize, _dom.__fontFamily].join(' ');
            var metrics = context.measureText(_dom.value.split('\n')[_row - 1].substr(0, textLength));
            return {
                width: metrics.width + _dom.__offsetLeft,
                height: (_row * (_dom.__rowHeight)) + _dom.__offsetTop
            };
        }

        /**
         * Input the selected contend from piece complete box into a focused textarea/input field at the current cursor position
         * @param _e
         */
        function inputPieceAdvice(_e) {
            if (_e) this.__current = _e.target;
            else if (this.__fastComplete && this.__fastCurrent) this.__current = this.__fastCurrent;

            if (this.__current && this.__current.tagName == 'LI') {
                var value = this.__input.value;
                var lengthBeforeLine = getLengthToLine(value, this.__handlingObject.current.range.row);
                var newCursorPos = this.__handlingObject.current.range.min + this.__current.textContent.length + lengthBeforeLine;
                this.__input.setSelectionRange(0, 0);
                this.__input.value = value.substr(0, this.__handlingObject.current.range.min + lengthBeforeLine) + this.__current.textContent + value.substr(this.__handlingObject.current.range.max + lengthBeforeLine);
                this.__input.focus();
                this.__input.setCursorTo(newCursorPos);
                this.hide();
                this.clear();
            }
        }

        /**
         * Get the string length befor given row number
         * @param _string
         * @param _row
         */
        function getLengthToLine(_string, _row) {
            var subStr = _string;
            var index = 0;
            var sumIndex = 0;

            for (var ii = 1; ii < _row; ii++) {
                index = subStr.indexOf('\n');
                if (index == -1) return 0;
                sumIndex += index + 1;
                subStr = subStr.substr(index + 1);
            }

            return sumIndex;
        }

        /**
         * Match handlingObject.current width data and return the match result.
         *
         * @param _handlingObject
         * @returns {data|*|string|CanvasPixelArray|Object[]|Object}
         */
        function loadData(_handlingObject) {
            var filteredData = [];

            if (_handlingObject.current.value.length >= this.min) {
                for (var dataIndex in this.data) {
                    if (dataIndex in this.data) {
                        if (this.data[dataIndex].length > _handlingObject.current.value.length && this.data[dataIndex].match('^' + _handlingObject.current.value)) {
                            filteredData.push(this.data[dataIndex]);
                        }
                    }
                }
            }

            return filteredData;
        }

        /**
         * Match handlingObject.current width data as caseSensitive and return the match result.
         *
         * @param _handlingObject
         * @returns {data|*|string|CanvasPixelArray|Object[]|Object}
         */
        function loadDataCaseInSensitive(_handlingObject) {
            var filteredData = [];

            if (_handlingObject.current.value.length >= this.min) {
                for (var dataIndex in this.data) {
                    if (dataIndex in this.data) {
                        if (this.data[dataIndex].length > _handlingObject.current.value.length && this.data[dataIndex].toLowerCase().match('^' + _handlingObject.current.value.toLowerCase())) {
                            filteredData.push(this.data[dataIndex]);
                        }
                    }
                }
            }

            return filteredData;
        }

        /**
         * Search the current string in that the cursor is and the string
         * before the current string which separate with a piece.
         *
         * @param _string
         * @param _cursorPos
         * @param _pieces
         * @returns {*}
         */
        function getHandlingObject(_string, _cursorPos, _pieces) {
            //if no _pieces using print the use the full input text
            if (_pieces == null) {
                return {
                    raw: _string,
                    before: null,
                    pieceBefore: null,
                    current: {
                        value: _string,
                        range: {
                            min: 0,
                            max: 0 + _string.length,
                            row: 1
                        },
                        after: null,
                        pieceAfter: null,
                        cursor: _cursorPos,
                        row: 1
                    }
                }
            }

            //and is pieces given then filter the text and find the current text on the cursor.
            var reversString = _string.reverse();

            //find line of current word
            var indexOfLastNewLine = _string.lastIndexOf('\n');
            indexOfLastNewLine = indexOfLastNewLine == -1 ? 0 : indexOfLastNewLine + 1;

            var piecePositionBeforeCurrentElement = findNearestPiecePositionInString(_string, _pieces);

            var before = null;
            if (!piecePositionBeforeCurrentElement) {
                piecePositionBeforeCurrentElement = {
                    pos: _cursorPos,
                    piece: null
                };
            } else {
                var reversStringBefore = reversString.substr(piecePositionBeforeCurrentElement.pos + piecePositionBeforeCurrentElement.piece.length);
                var piecePositionOfBeforeElement = findNearestPiecePositionInString(reversStringBefore, _pieces);

                if (!piecePositionOfBeforeElement) piecePositionOfBeforeElement = {pos: reversStringBefore.length};

                var valueBefore = reversStringBefore.substr(0, piecePositionOfBeforeElement.pos).reverse();
                var indexOfLastNewLineBefore = reversStringBefore.reverse().lastIndexOf('\n');

                indexOfLastNewLineBefore = indexOfLastNewLineBefore == -1 ? 0 : indexOfLastNewLineBefore + 1;

                var valueBeforeMinPos = (_cursorPos - (piecePositionBeforeCurrentElement.pos + piecePositionBeforeCurrentElement.piece.length + piecePositionOfBeforeElement.pos)) - indexOfLastNewLineBefore;
                before = {
                    value: valueBefore,
                    range: {
                        min: valueBeforeMinPos,
                        max: valueBeforeMinPos + valueBefore.length,
                        row: reversStringBefore.split('\n').length
                    }
                };
            }

            var valueCurrent = reversString.substr(0, piecePositionBeforeCurrentElement.pos).reverse();
            var valueCurrentMinPos = (_cursorPos - piecePositionBeforeCurrentElement.pos) - indexOfLastNewLine;
            var current = {
                value: valueCurrent,
                range: {
                    min: valueCurrentMinPos,
                    max: valueCurrentMinPos + valueCurrent.length,
                    row: reversString.split('\n').length
                }
            };

            if (piecePositionBeforeCurrentElement) {
                return {
                    raw: _string,
                    before: before,
                    pieceBefore: piecePositionBeforeCurrentElement.piece,
                    current: current,
                    after: null,
                    pieceAfter: null,
                    cursor: _cursorPos,
                    row: _string.split('\n').length
                }
            }

            return null;
        }

        /**
         * find the nearest piece of the word
         * @param _string
         * @param _pieces
         * @returns {*}
         */
        function findNearestPiecePositionInString(_string, _pieces) {
            var current = null;
            for (var piece in _pieces) {
                if (piece in _pieces) {

                    var next = findPiece(_string, _pieces[piece]);

                    if (next && (current == null || current.pos > next.pos)) {
                        current = next;
                    }
                }
            }

            return current;
        }

        function findPiece(_string, _piece) {
            var match = _string.reverse().match(_piece);
            if (match) {
                return {
                    pos: match.index,
                    piece: match[0]
                }
            }

            return null;
        }

        /**
         * create a new piece complete box from giving setting and default settings
         * @param _settings
         * @returns {HTMLElement}
         */
        function createPieceCompleteBox(_settings) {
            var ul = document.createElement('ul');
            ul.setAttribute('class', _settings.list.name);

            var img = document.createElement('img');
            img.setAttribute('class', 'piece-wait');

            var container = document.createElement('div');
            container.setAttribute('class', _settings.list.container);
            container.appendChild(ul);
            container.appendChild(img);

            container.__listName = _settings.list.name;
            container.__selection = _settings.selection;
            container.__current = null;
            container.__fastCurrent = null;
            container.__handlingObject = null;
            container.__fastComplete = _settings.fastComplete;
            container.__fastSelection = _settings.fastSelection;

            //Define Functions
            container.show = function () {
                this.getElementsByClassName(this.__listName)[0].style.display = 'block';
                this.getElementsByClassName('piece-wait')[0].style.display = 'none';
                this.__fastCurrent = this.getElementsByClassName(this.__listName)[0].children[0];
                this.__fastCurrent.classList.add(this.__fastSelection);
                this.style.display = 'inline-block';
            };
            container.hide = function () {
                this.style.display = 'none';
            };
            container.wait = function () {
                this.getElementsByClassName(this.__listName)[0].style.display = 'none';
                this.getElementsByClassName('piece-wait')[0].style.display = 'block';
                this.style.display = 'inline-block';
            };
            container.isShown = function () {
                return this.style.display == 'inline-block';
            };
            container.next = function () {
                if (this.__current) {
                    this.__current.classList.remove(this.__selection);
                    this.__current = this.__current.nextElementSibling;

                    if (this.__current)  this.__current.classList.add(this.__selection);
                    else this.first();
                } else {
                    this.first();
                }
            };
            container.first = function () {
                this.__current = this.getElementsByClassName(this.__listName)[0].children[0];
                this.__current.classList.add(this.__selection);
                if (this.__fastCurrent) {
                    this.__fastCurrent.classList.remove(this.__fastSelection);
                    this.__fastCurrent = null;
                }
            };
            container.last = function () {
                var children = this.getElementsByClassName(this.__listName)[0].children;
                this.__current = children[children.length - 1];
                this.__current.classList.add(this.__selection);
                if (this.__fastCurrent) {
                    this.__fastCurrent.classList.remove(this.__fastSelection);
                    this.__fastCurrent = null;
                }
            };
            container.prev = function () {
                if (this.__current) {
                    this.__current.classList.remove(this.__selection);
                    this.__current = this.__current.previousElementSibling;

                    if (this.__current) this.__current.classList.add(this.__selection);
                    else this.last();
                } else {
                    this.last();
                }
            };
            container.clear = function () {
                if (this.__current) {
                    this.__current.classList.remove(this.__selection);
                    this.__current = null;
                }
                if (this.__fastCurrent) {
                    this.__fastCurrent.classList.remove(this.__fastSelection);
                    this.__fastCurrent = null;
                }
            };

            return container;
        }

        function request(_url, _type) {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status == 200) {
                        xhr.context.pieceData.data = JSON.parse(xhr.responseText).sort();
                    } else if (xhr.status == 400) {
                        console.log('There was an error 400');
                        console.log(xhr.responseText);
                    } else {
                        console.log('something else other than 200 was returned');
                    }
                }
            };
            xhr.open(_type, _url, true);

            return xhr;
        }

        /*
         ** Returns the caret (cursor) position of the specified text field.
         ** Return value range is 0-oField.value.length.
         */
        function doGetCaretPosition(oField) {

            // Initialize
            var iCaretPos = 0;

            // IE Support
            if (document.selection) {

                // Set focus on the element
                oField.focus();

                // To get cursor position, get empty selection range
                var oSel = document.selection.createRange();

                // Move selection start to 0 position
                oSel.moveStart('character', -oField.value.length);

                // The caret position is selection length
                iCaretPos = oSel.text.length;
            }

            // Firefox support
            else if (oField.selectionStart || oField.selectionStart == '0')
                iCaretPos = oField.selectionStart;

            // Return results
            return (iCaretPos);
        }

        /**
         * String DESC sorting
         *
         * @returns {string}
         */
        String.prototype.reverse = function () {
            return this.split('').reverse().join('');
        };

        /**
         * Set new String function not iterable
         */
        Object.defineProperty(String.prototype, 'reverse', {
            enumerable: false,
            name: 'reverse'
        });
    };
})();
