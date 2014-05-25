/**
 * @jsx React.DOM
 */
var Boggle = React.createClass({
    getInitialState: function() {
       return {message: "", foundWords: []}
    },
    render: function () {
        return (<div>
            <BoggleBoard boardWidth={4} onBeforeSolve={this.handleBeforeSolve} onAfterSolve={this.handleAfterSolve}  />
            <br />
            <div>{this.state.message}</div>
            <div>{this.state.foundWords.join(" ")}</div>
        </div>)
    },
    handleBeforeSolve: function() {
        this.setState({message: "Solving..."});
    },
    handleAfterSolve: function(foundWords) {
        this.setState({message: "Done! Found " + foundWords.length + " words:"});
        this.setState({foundWords: foundWords});
    }
});

var BoggleBoard = React.createClass({
    letterMatrix: [[]],
    wordList: [],
    wordSet: {},
    foundWords: [],
    componentWillMount: function() {
        this.loadWordList();
        this.shuffleLetters();
    },
    render: function () {
        var cells = [];

        for (var i = 0; i < this.props.boardWidth; i++) {
            for (var j = 0; j < this.props.boardWidth; j++) {
                var cellNum = (this.props.boardWidth * i) + j;
                cells.push(<div id={"cell" + cellNum} className="cell">
                    <div className="content">{this.letterMatrix[i][j]}</div>
                </div>);
            }
        }

        return (<div>
                    {cells}
                    <br /><br />
                    <button onClick={this.solve}>Solve</button>
                </div>
            );
    },
    loadWordList: function () {
        var self = this;

        $.get("/data/wordsEn.txt", function (data) {
            self.wordList = data.split(/\r\n/);
            self.wordList = _.filter(self.wordList, function (word) {
                return word.length > 2 && word.length < Math.pow(self.props.boardWidth, 2);
            });

            for (var i = 0; i < self.wordList.length; i++) {
                self.wordSet[self.wordList[i]] = true;
            }

        });
    },
    shuffleLetters: function () {
        var dice = "AAEEGN,EHRTVW,DELRVY,EEGHNW,ELRTTY,CIMOTU,ACHOPS,AFFKPS,AOOTTW,DISTTY,HIMNQU,HLNNRZ,ABBJOO,EIOSST,EEINSU,DELIRX".split(",");

        var rowNum = -1;

        for (var i = 0; i < dice.length; i++) {
            var letterIndex = _.random(0, dice[i].length - 1);
            var letter = dice[i][letterIndex];

            if (i % this.props.boardWidth == 0) {
                this.letterMatrix.push([]);
                rowNum++;
            }

            this.letterMatrix[rowNum].push(letter);
        }
    },
    solve: function () {
        var self = this;
        self.props.onBeforeSolve();

        setTimeout(function() {
            var markedCells = _.range(self.props.boardWidth).map(function () {
                return _.range(self.props.boardWidth).map(function () {
                    return false;
                });
            });

            for (var i = 0; i < self.props.boardWidth; i++) {
                for (var j = 0; j < self.props.boardWidth; j++) {
                    self.findWord(self.letterMatrix, "", self.foundWords, markedCells, i, j);
                }
            }

            self.props.onAfterSolve(self.foundWords);

        }, 0);
    },
    findWord: function (letterMatrix, wordSoFar, foundWords, markedCells, i, j) {
        var self = this;
        wordSoFar += letterMatrix[i][j];
        markedCells[i][j] = true;

        if (wordSoFar.length > 2 && Object.prototype.hasOwnProperty.call(self.wordSet, wordSoFar.trim().toLowerCase())) {
        //if (wordSoFar.length > 2 && _.contains(self.wordList, wordSoFar.trim().toLowerCase())) {
            foundWords.push(wordSoFar);
        }

        if (i + 1 < this.props.boardWidth && markedCells[i + 1][j] == false) {
            this.findWord(letterMatrix, wordSoFar, foundWords, markedCells, i + 1, j);
        }

        if (i - 1 > 0 && markedCells[i - 1][j] == false) {
            this.findWord(letterMatrix, wordSoFar, foundWords, markedCells, i - 1, j);
        }

        if (j + 1 < this.props.boardWidth && markedCells[i][j + 1] == false) {
            this.findWord(letterMatrix, wordSoFar, foundWords, markedCells, i, j + 1);
        }

        if (j - 1 > 0 && markedCells[i][j - 1] == false) {
            this.findWord(letterMatrix, wordSoFar, foundWords, markedCells, i, j - 1);
        }

        if (i + 1 < this.props.boardWidth && j + 1 < this.props.boardWidth && markedCells[i + 1][j + 1] == false) {
            this.findWord(letterMatrix, wordSoFar, foundWords, markedCells, i + 1, j + 1);
        }

        if (i - 1 > 0 && j - 1 > 0 && markedCells[i - 1][j - 1] == false) {
            this.findWord(letterMatrix, wordSoFar, foundWords, markedCells, i - 1, j - 1);
        }

        if (i + 1 < this.props.boardWidth && j - 1 > 0 && markedCells[i + 1][j - 1] == false) {
            this.findWord(letterMatrix, wordSoFar, foundWords, markedCells, i + 1, j - 1);
        }

        if (i - 1 > 0 && j + 1 > this.props.boardWidth && markedCells[i - 1][j + 1] == false) {
            this.findWord(letterMatrix, wordSoFar, foundWords, markedCells, i - 1, j + 1);
        }

        markedCells[i][j] = false;
    }
});

React.renderComponent(
    <Boggle />,
    document.getElementById("board")
);