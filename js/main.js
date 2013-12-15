(function() {

var stage;
var tikis; // save all canvas objects of tikis

var canvasWidth = 0, canvasHeight = 0;
var tikiWidth = 0, tikiHeight = 0;
var tikiColor = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728',
    '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22'];

var selectedTikiIdx;
var hasSelected; // Boolean
var selectMark;

var upCardRemain, killCardRemain;

$(document).ready(function() {
    startCanvas();
    initParams();

    createTikis();
    createCards();
    setupAnimVar();

    $('#replay').click(resetGame);
});

function initParams() {
    selectedTikiIdx = null;
    hasSelected = false;
    upCardRemain = 2;
    killCardRemain = 2;
}

function startCanvas() {

    // Scale canvas with its actually width and height
    var gameCanvas = $('#game-canvas');
    canvasWidth = gameCanvas.width();
    canvasHeight = gameCanvas.height();
    gameCanvas.attr('width', canvasWidth)
            .attr('height', canvasHeight)

    // Initial stage by referencing canvas
    stage = new createjs.Stage(gameCanvas[0]);
    stage.enableMouseOver(20);
}

function createTikis() {
    var tikiOrder = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    state.tikiOrder = tikiOrder;

    tikis = new Array();
    tikiHeight = canvasHeight / tikiColor.length - 10;
    tikiWidth = tikiHeight * 2 / 3;
    var tikiX = canvasWidth / 2 - tikiWidth / 2;
    var tikiY = 10;

    var circleMark = new createjs.Graphics();
        circleMark.setStrokeStyle(1).beginFill('#FFFFFF').drawCircle(0, 0, 3);
    selectMark = new createjs.Shape(circleMark);

    for (var i = 0, o = tikiOrder[i]; i < tikiOrder.length; ++i, o = tikiOrder[i]) {
        var tiki = new createjs.Shape();
        tiki.graphics.beginFill(tikiColor[o])
            .drawRoundRect(0, 0, tikiWidth, tikiHeight, 5);
        var id = new createjs.Text('' + o, 'bold 2em Arial', '#FFFFFF');
        //tiki.x = tikiX;
        //tiki.y = tikiY;
        id.x = 10;
        id.y = 10;

        var container = new createjs.Container();
        container.x = tikiX;
        container.y = tikiY;
        container.addChild(tiki, id);

        tikiY += tikiHeight + 5;

        container.addEventListener('mouseover', function(evt) {
            //evt.target.alpha = 0.6;
            //console.log(!hasSelected);
            if (!hasSelected) {
                selectMark.x = evt.target.x + 10;
                selectMark.y = evt.target.y + 10;
                stage.addChild(selectMark);
                stage.update();
            }
        });
        container.addEventListener('mouseout', function(evt) {
            //evt.target.alpha = 1;
            if (!hasSelected) {
                stage.removeChild(selectMark);
                stage.update();
            }
        });
        container.addEventListener('click', function(evt) {
            if (!hasSelected) {
                selectedTikiIdx = tikis.indexOf(evt.target);
                hasSelected = true;
            }
            else {
                stage.removeChild(selectMark);
                if (evt.target === tikis[selectedTikiIdx]) {
                    selectedTikiIdx = null;
                    hasSelected = false;
                }
                else {
                    selectedTikiIdx = tikis.indexOf(evt.target);
                    selectMark.x = evt.target.x + 10;
                    selectMark.y = evt.target.y + 10;
                    stage.addChild(selectMark);
                }
            }
            stage.update();
        });

        tikis.push(container);
        /*stage.addChild(tiki);
        stage.addChild(id);*/
        stage.addChild(container);
    }

    stage.update();
}

function createCards() {
    $('#card-wrapper li').append('<div class="cards"></div>');

    var cards = $('#card-wrapper .cards');

    cards.eq(0).text('Up 1').on('click', function() {
        if (!hasSelected) return;
        if (0 >= selectedTikiIdx) {
            alert('Cannot move the first Tiki!');
            return;
        }

        humanAnim = true;
        tikis = moveUp(selectedTikiIdx, 1);
        updateState(0, selectedTikiIdx, 1);

        upCardRemain--;
        if (0 === upCardRemain) {
            $(this).css('opacity', '0.6').unbind('click');
        }

        stage.removeChild(selectMark);
        stage.update();
        hasSelected = false;
        selectedTikiIdx = null;

        setTimeout(function() {
            comAIMove();
        }, 1000);
    });
    cards.eq(1).text('Up 2').on('click', function() {
        if (!hasSelected) return;
        if (1 >= selectedTikiIdx) {
            alert('Cannot move Tiki!');
            return;
        }

        updateState(1, selectedTikiIdx, 1);
        tikis = moveUp(selectedTikiIdx, 2);

        $(this).css('opacity', '0.6').unbind('click');

        stage.removeChild(selectMark);
        stage.update();
        hasSelected = false;
        selectedTikiIdx = null;

        setTimeout(function() {
            comAIMove();
        }, 1000);
    });
    cards.eq(2).text('Up 3').on('click', function() {
        if (!hasSelected) return;
        if (2 >= selectedTikiIdx) {
            alert('Cannot move Tiki!');
            return;
        }

        updateState(2, selectedTikiIdx, 1);
        tikis = moveUp(selectedTikiIdx, 3);

        $(this).css('opacity', '0.6').unbind('click');

        stage.removeChild(selectMark);
        stage.update();
        hasSelected = false;
        selectedTikiIdx = null;

        setTimeout(function() {
            comAIMove();
        }, 1000);
    })
    cards.eq(3).text('Push!').on('click', function() {
        if (!hasSelected) return;
        if (-1 === selectedTikiIdx) {
            alert('Please select again');
            return;
        }
        updateState(3, selectedTikiIdx, 1);
        moveToBottom(selectedTikiIdx);
        
        $(this).css('opacity', '0.6').unbind('click');
        stage.removeChild(selectMark);
        stage.update();
        hasSelected = false;
        selectedTikiIdx = null;

        setTimeout(function() {
            comAIMove();
        }, 1000);
    })
    cards.eq(4).text('Kill!').on('click', function() {
        killCardRemain--;

        updateState(4, tikis.length - 1, 1);
        killLast();
        console.log(tikis);
        
        if (0 === killCardRemain) {
            $(this).css('opacity', '0.6').unbind('click');
        }
        if (hasSelected) {
            stage.removeChild(selectMark);
            stage.update();
            hasSelected = false;
            selectedTikiIdx = null;
        }

        setTimeout(function() {
            comAIMove();
        }, 1000);
    });
}

function resetGame() {
    stage.removeAllChildren();
    createTikis();
    initParams();
    setupAnimVar();
}

function setupAnimVar() {
    // Setup global variables in animation.js
    animStage = stage;
    animTikis = tikis;
    animTikiWidth = tikiWidth;
    animTikiHeight = tikiHeight;
}

})();
