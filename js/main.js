(function() {

var stage;
var tikis; // save all canvas objects of tikis

var selectedTiki;
var selectedTikiIdx;
var hasSelected; // Boolean

var tikiWidth = 0, tikiHeight = 0;
//var tikiColor = ['blue', 'green', 'yellow', 'orange', 'red'];
var tikiColor = ['orange', 'orange', 'orange', 'orange',
'orange', 'orange', 'orange', 'orange', 'orange'];

var upCardRemain = 2, killCardRemain = 2;

$(document).ready(function() {
        startCanvas();
        createCards();
    });

function startCanvas() {

    // Scale canvas with its actually width and height
    var gameCanvas = $('#game-canvas');
    var canvasWidth = gameCanvas.width();
    var canvasHeight = gameCanvas.height();
    gameCanvas.attr('width', canvasWidth)
            .attr('height', canvasHeight);

    // Initial stage by referencing canvas
    stage = new createjs.Stage(gameCanvas[0]);
    stage.enableMouseOver(20);

    tikis = new Array();
    tikiHeight = canvasHeight / tikiColor.length - 10;
    tikiWidth = tikiHeight * 2 / 3;
    var tikiX = canvasWidth / 2 - tikiWidth / 2;
    var tikiY = 10;

    var circleMark = new createjs.Graphics();
        circleMark.setStrokeStyle(1).beginFill('#FFFFFF').drawCircle(0, 0, 3);
    var selectMark = new createjs.Shape(circleMark);

    selectedTiki = selectedTikiIdx = null;
    hasSelected = false;
    for (var i = 0; i < tikiColor.length; ++i) {
        var tiki = new createjs.Shape();
        tiki.graphics.beginFill(tikiColor[i])
            .drawRoundRect(0, 0, tikiWidth, tikiHeight, 5);
        tiki.x = tikiX;
        tiki.y = tikiY;
        tikiY += tikiHeight + 5;

        tiki.addEventListener('mouseover', function(evt) {
            //evt.target.alpha = 0.6;
            //console.log(!hasSelected);
            if (!hasSelected) {
                selectMark.x = evt.target.x + 10;
                selectMark.y = evt.target.y + 10;
                stage.addChild(selectMark);
                stage.update();
            }
        });
        tiki.addEventListener('mouseout', function(evt) {
            //evt.target.alpha = 1;
            if (!hasSelected) {
                stage.removeChild(selectMark);
                stage.update();
            }
        });
        tiki.addEventListener('click', function(evt) {
            if (null === selectedTiki) {
                selectedTiki = evt.target;
                selectedTikiIdx = tikis.indexOf(selectedTiki);
                hasSelected = true;
            }
            else {
                stage.removeChild(selectMark);
                if (evt.target === selectedTiki) {
                    selectedTiki = selectedTikiIdx = null;
                    hasSelected = false;
                }
                else {
                    selectedTiki = evt.target;
                    selectedTikiIdx = tikis.indexOf(selectedTiki);
                    selectMark.x = evt.target.x + 10;
                    selectMark.y = evt.target.y + 10;
                    stage.addChild(selectMark);
                }
            }
            stage.update();
        });

        tikis.push(tiki);
        stage.addChild(tiki);
    }

    stage.update();
}

function createCards() {
    $('#card-wrapper li').append('<div class="cards"></div>');

    var cards = $('#card-wrapper .cards');

    cards.eq(0).text('Up 1').on('click', function() {
        if (null === selectedTikiIdx) return;
        updateState(0, selectedTikiIdx, 1);

        upCardRemain--;
        //console.log('Up 1');
        if (0 === upCardRemain) {
            $(this).css('opacity', '0.6').unbind('click');
        }
    });
    cards.eq(1).text('Up 2').on('click', function() {
        if (null === selectedTikiIdx) return;
        //console.log('Up 2');
        updateState(1, selectedTikiIdx, 1);
        $(this).css('opacity', '0.6').unbind('click');
    });
    cards.eq(2).text('Up 3').on('click', function() {
        if (null === selectedTikiIdx) return;
        //console.log('Up 3');
        updateState(2, selectedTikiIdx, 1);
        $(this).css('opacity', '0.6').unbind('click');
    })
    cards.eq(3).text('Push!').on('click', function() {
        if (null === selectedTikiIdx) return;
        //console.log('Push!');
        updateState(3, selectedTikiIdx, 1);
        $(this).css('opacity', '0.6').unbind('click');
    })
    cards.eq(4).text('Kill!').on('click', function() {
        if (null === selectedTikiIdx) return;
        killCardRemain--;
        //console.log('Kill!');
        updateState(4, selectedTikiIdx, 1);
        if (0 === killCardRemain) {
            $(this).css('opacity', '0.6').unbind('click');
        }
    });


    /*$('#card-wrapper li div').on('click', function() {

        //var targetIdx = Math.floor(Math.random() * (tikis.length-1)) + 1;
        if (null === selectedTiki) {
            return;
        }

        var upper, lower;
        var targetIdx = tikis.indexOf(selectedTiki);
        if (-1 === targetIdx) {
            console.log("selected tiki not in tiki list!");
            return;
        }
        else if (0 === targetIdx) {
            alert('Cannot move the first Tiki!');
            return;
        }
        else {
            upper = tikis[targetIdx - 1];
            lower = selectedTiki;
        }
        tikis[targetIdx - 1] = lower;
        tikis[targetIdx] = upper;
        console.log(upper);
        console.log(lower);

        var upperX = upper.x, upperY = upper.y;
        var lowerX = lower.x, lowerY = lower.y;
        var animStep = 0;

        stage.removeChildAt(5);
        hasSelected = false;
        selectedTiki = null;

        createjs.Ticker.addEventListener("tick", tick);
        createjs.Ticker.setInterval(60);
        createjs.Ticker.setFPS(60);

        function tick(event) {
            if (animStep === 0) {
                if (lowerX - lower.x > tikiWidth / 2 + 1) {
                    animStep = 1;
                } 
                else {
                    upper.x = upper.x + tikiWidth / 5;
                    lower.x = lower.x - tikiWidth / 5;
                }
            }
            if (animStep === 1) {
                if (lower.y <= upperY) {
                    lower.y = upperY;
                    upper.y = lowerY;
                    animStep = 2;
                }
                else {
                    upper.y = upper.y + (lowerY - upperY) / 10;
                    lower.y = lower.y - (lowerY - upperY) / 10;
                }
            }
            if (animStep === 2) {
                if (lower.x >= upperX) {
                    lower.x = upperX;
                    upper.x = lowerX;
                    animStep = 3;
                }
                else {
                    upper.x = upper.x - tikiWidth / 5;
                    lower.x = lower.x + tikiWidth / 5;
                }
            }
            if (animStep === 3) {
                createjs.Ticker.removeEventListener('tick', tick);
            }

            stage.update(event);
        }
    });*/
}

})();