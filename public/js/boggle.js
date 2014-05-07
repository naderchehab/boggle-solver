/**
 * @jsx React.DOM
 */
var BoggleBoard = React.createClass({
    letterMatrix: [[]],
    wordList: [],
    foundWords: [],
    render: function() {
        this.loadWordList();
        this.shuffleLetters();

        var cells = [];

        for (var i = 0; i < this.props.boardWidth; i++) {
            for (var j = 0; j < this.props.boardWidth; j++) {
                var cellNum = (this.props.boardWidth * i) + j;
                cells.push(<div id={"cell" + cellNum} className="cell"><div className="content">{this.letterMatrix[i][j]}</div></div>);
            }
        }

        return (<div>
                    {cells}
                    <br /><br />
                    <button onClick={this.solve}>Solve</button>
                    <br /><br />
                    <div className={this.props.hideMessage ? "hidden" : ""}>Solving...</div>
                </div>
            );
    },
    loadWordList: function() {
        var self = this;
        $.get("/data/wordsEn.txt", function(data) {
            self.wordList = data.split(/\r\n/);
            self.wordList = _.filter(self.wordList, function(word) { return word.length > 2 && word.length < 18; });
        });
    },
    shuffleLetters: function() {
        var letters = _.shuffle("EEEEEEEEEEEAAAAAAIIIIIIOOOOOOOLLLLNNNNNNSSSSSSTTTTTTTTTDDDRRRRRUUUBBCCGGHHHHHMMPPYYYFFKVVWWWJQXZ".split(""));

        var rowNum = -1;

        for (var i = 0; i < Math.pow(this.props.boardWidth, 2); i++) {
            var letter = letters[i];

            if (i % this.props.boardWidth == 0) {
                this.letterMatrix.push([]);
                rowNum++;
            }

            this.letterMatrix[rowNum].push(letter);
        }
    },
    solve: function() {
        this.props.hideMessage = false;
        var self = this;
        var markedCells = _.range(this.props.boardWidth).map(function () {
            return _.range(self.props.boardWidth).map(function () {
                return false;
            });
        });

        for (var i = 0; i < this.props.boardWidth; i++) {
            for (var j = 0; j < this.props.boardWidth; j++) {
                this.findWord(this.letterMatrix, "", this.foundWords, markedCells, i, j);
            }
        }

        console.log(this.foundWords);
    },
    findWord: function(letterMatrix, wordSoFar, foundWords, markedCells, i, j) {
        var self = this;
        wordSoFar += letterMatrix[i][j];
        markedCells[i][j] = true;

        if (wordSoFar.length > 2 && _.contains(self.wordList, wordSoFar.trim().toLowerCase())) {
            foundWords.push(wordSoFar);
        }

        if (i + 1 < this.props.boardWidth && markedCells[i+1][j] == false) {
            this.findWord(letterMatrix, wordSoFar, foundWords, markedCells, i + 1, j);
        }

        if (i - 1 > 0 && markedCells[i-1][j] == false) {
            this.findWord(letterMatrix, wordSoFar, foundWords, markedCells, i - 1, j);
        }

        if (j + 1 < this.props.boardWidth && markedCells[i][j+1] == false) {
            this.findWord(letterMatrix, wordSoFar, foundWords, markedCells, i, j + 1);
        }

        if (j - 1 > 0 && markedCells[i][j-1] == false) {
            this.findWord(letterMatrix, wordSoFar, foundWords, markedCells, i, j - 1);
        }

        if (i + 1 < this.props.boardWidth && j + 1 < this.props.boardWidth && markedCells[i+1][j+1] == false) {
            this.findWord(letterMatrix, wordSoFar, foundWords, markedCells, i + 1, j + 1);
        }

        if (i - 1 > 0 && j - 1 > 0 && markedCells[i-1][j-1] == false) {
            this.findWord(letterMatrix, wordSoFar, foundWords, markedCells, i - 1, j - 1);
        }

        if (i + 1 < this.props.boardWidth && j - 1 > 0 && markedCells[i+1][j-1] == false) {
            this.findWord(letterMatrix, wordSoFar, foundWords, markedCells, i + 1, j - 1);
        }

        if (i - 1 > 0 && j + 1 > this.props.boardWidth && markedCells[i-1][j+1] == false) {
            this.findWord(letterMatrix, wordSoFar, foundWords, markedCells, i - 1, j + 1);
        }

        markedCells[i][j] = false;
    }
});

React.renderComponent(
    <BoggleBoard boardWidth={4} hideMessage={true} />,
    document.getElementById("board")
);