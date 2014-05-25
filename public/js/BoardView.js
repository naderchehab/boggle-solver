/**
 * @jsx React.DOM
 */
var BoardView = React.createClass({
    getInitialState: function() {
       return {message: "", foundWords: []}
    },
    render: function () {
        return (<div>
            <BoggleBoard boardWidth={4}
                wordFile={"/data/wordsEn.txt"}
                dice={"AAEEGN,EHRTVW,DELRVY,EEGHNW,ELRTTY,CIMOTU,ACHOPS,AFFKPS,AOOTTW,DISTTY,HIMNQU,HLNNRZ,ABBJOO,EIOSST,EEINSU,DELIRX"}
                onBeforeSolve={this.handleBeforeSolve}
                onAfterSolve={this.handleAfterSolve}
            />
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
    wordSet: {},
    getInitialState: function() {
        var letterMatrix = BoggleUtils.shuffleDice(this.props.boardWidth, this.props.dice);
        return {
            letterMatrix: letterMatrix
        };
    },
    componentWillMount: function() {
        var self = this;
        BoggleUtils.loadWordSet(this.props.wordFile, this.props.boardWidth, function(wordSet) {
            self.wordSet = wordSet;
        });
    },
    render: function () {
        var cells = [];

        for (var i = 0; i < this.props.boardWidth; i++) {
            for (var j = 0; j < this.props.boardWidth; j++) {
                var cellNum = (this.props.boardWidth * i) + j;
                cells.push(<div id={"cell" + cellNum} className="cell">
                    <div className="content">{this.state.letterMatrix[i][j]}</div>
                </div>);
            }
        }

        return (<div>
                    {cells}
                    <br /><br />
                    <button onClick={this.solve}>Solve</button>
                    <button onClick={this.shuffleAgain}>Shuffle again</button>
                </div>
            );
    },
    solve: function () {
        var self = this, foundWords = [];
        self.props.onBeforeSolve();

        setTimeout(function() {
            var markedCells = _.range(self.props.boardWidth).map(function () {
                return _.range(self.props.boardWidth).map(function () {
                    return false;
                });
            });

            for (var i = 0; i < self.props.boardWidth; i++) {
                for (var j = 0; j < self.props.boardWidth; j++) {
                    BoggleUtils.findWord(self.state.letterMatrix, "", foundWords, markedCells, i, j, self.props.boardWidth, self.wordSet);
                }
            }

            self.props.onAfterSolve(foundWords);

        }, 0);
    },
    shuffleAgain: function() {
        this.setState({letterMatrix: BoggleUtils.shuffleDice(this.props.boardWidth, this.props.dice)});
    }
});

React.renderComponent(
    <BoardView />,
    document.getElementById("board")
);