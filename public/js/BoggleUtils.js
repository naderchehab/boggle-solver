/**
 * Created by Nader on 5/25/14.
 */

var BoggleUtils = function() {
    var findWord = function (letterMatrix, wordSoFar, foundWords, markedCells, i, j, boardWidth, wordSet) {
        wordSoFar += letterMatrix[i][j];
        markedCells[i][j] = true;

        if (wordSoFar.length > 2 && Object.prototype.hasOwnProperty.call(wordSet, wordSoFar.trim().toLowerCase())) {
            foundWords.push(wordSoFar);
        }

        if (i + 1 < boardWidth && markedCells[i + 1][j] == false) {
            findWord(letterMatrix, wordSoFar, foundWords, markedCells, i + 1, j, boardWidth, wordSet);
        }

        if (i - 1 > 0 && markedCells[i - 1][j] == false) {
            findWord(letterMatrix, wordSoFar, foundWords, markedCells, i - 1, j, boardWidth, wordSet);
        }

        if (j + 1 < boardWidth && markedCells[i][j + 1] == false) {
            findWord(letterMatrix, wordSoFar, foundWords, markedCells, i, j + 1, boardWidth, wordSet);
        }

        if (j - 1 > 0 && markedCells[i][j - 1] == false) {
            findWord(letterMatrix, wordSoFar, foundWords, markedCells, i, j - 1, boardWidth, wordSet);
        }

        if (i + 1 < boardWidth && j + 1 < boardWidth && markedCells[i + 1][j + 1] == false) {
            findWord(letterMatrix, wordSoFar, foundWords, markedCells, i + 1, j + 1, boardWidth, wordSet);
        }

        if (i - 1 > 0 && j - 1 > 0 && markedCells[i - 1][j - 1] == false) {
            findWord(letterMatrix, wordSoFar, foundWords, markedCells, i - 1, j - 1, boardWidth, wordSet);
        }

        if (i + 1 < boardWidth && j - 1 > 0 && markedCells[i + 1][j - 1] == false) {
            findWord(letterMatrix, wordSoFar, foundWords, markedCells, i + 1, j - 1, boardWidth, wordSet);
        }

        if (i - 1 > 0 && j + 1 > boardWidth && markedCells[i - 1][j + 1] == false) {
            findWord(letterMatrix, wordSoFar, foundWords, markedCells, i - 1, j + 1, boardWidth, wordSet);
        }

        markedCells[i][j] = false;
    }

    var loadWordSet = function (wordFile, boardWidth, callback) {
        var wordSet = {}

        $.get(wordFile, function (data) {
            var wordList = data.split(/\r\n/);

            wordList = _.filter(wordList, function (word) {
                return word.length > 2 && word.length < Math.pow(boardWidth, 2);
            });

            for (var i = 0; i < wordList.length; i++) {
                wordSet[wordList[i]] = true;
            }

            callback(wordSet);
        });
    }

    var shuffleDice = function (boardWidth, diceStr) {
        var letterMatrix = [[]];
        var dice = diceStr.split(",");
        var rowNum = -1;

        for (var i = 0; i < dice.length; i++) {
            var letterIndex = _.random(0, dice[i].length - 1);
            var letter = dice[i][letterIndex];

            if (i % boardWidth == 0) {
                letterMatrix.push([]);
                rowNum++;
            }

            letterMatrix[rowNum].push(letter);
        }

        return letterMatrix;
    }
    return {
        findWord: findWord,
        loadWordSet: loadWordSet,
        shuffleDice: shuffleDice
    }
}();