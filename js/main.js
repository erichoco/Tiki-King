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

var graAgent; // Agent in graphic mode
var graMissions;

$(document).ready(function() {
    //initParams();
    createCanvasStage();
    createCards();
    setupOthers();
    //setupAnimVar();
    resetGame();

    //displayResult($('#result-area'), [16, 9], 2)
    setupTest();
    //$('#tabs').find('li:nth-child(2) a').click();
});


/*
 * Human pk Agent
 */
// Initialize parameters in main.js
function initParams() {
    selectedTikiIdx = null;
    hasSelected = false;
    upCardRemain = 2;
    killCardRemain = 2;
}

// Initialize global variables in animation.js
function setupAnimVar() {
    animStage = stage;
    animTikis = tikis;
    animTikiWidth = tikiWidth;
    animTikiHeight = tikiHeight;
}

/*function startGame() {
    var 

    setupGame(2, graMissions);
}*/

function resetGame() {
    stage.removeAllChildren();
    initParams();

    var tikiOrder = createTikiOrder();
    graMissions = createPKMissions(2);
    displayMissions(graMissions);

    setupGame(2, graMissions, tikiOrder);
    graAgent = new Agent();
    graAgent.init($('#setting').find('select')[0].value, 1, graMissions[1]);

    createTikis(tikiOrder);
    setupCards();
    setupAnimVar();
}



function createCanvasStage() {
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

function createCards() {
    $('#card-wrapper li').append('<div class="cards"></div>');
}

function setupOthers() {
    var comMissionBoard = $('#mission-wrapper div:nth-child(2)');
    //console.log(comMissionBoard);
    $('#replay').click(resetGame);
    $('#setting input').change(function() {
        comMissionBoard.fadeToggle();
    });
    $('#setting').find('select').on('change', function() {
        graAgent = new Agent();
        graAgent.init(this.value, 1, graMissions[1]);
    });
    /*$('#apply-btn').click(function() {
        var agentName = $('#setting').find('select').value;
        graAgent = new Agent();
        graAgent.init(agentName, 2, graMissions[1]);
        setupGame(2, graMissions);
    });*/
}

function displayMissions(missions) {
    var orderStr = ['9pt', '5pt', '2pt'];
    var missionBoard = $('#mission-wrapper .mission-board:first-child');
    for (var i = 0; i < missions[0].length; ++i) {
        var mission = missionBoard.children(':nth-child(' + (i+2) + ')');
        mission.html(orderStr[i] + ': ' + missions[0][i]);
    }
    missionBoard = missionBoard.next();
    for (var i = 0; i < missions[1].length; ++i) {
        var mission = missionBoard.children(':nth-child(' + (i+2) + ')');
        mission.html(orderStr[i] + ': ' + missions[1][i]);
    }
}

function createTikis(tikiOrder) {
    //var tikiOrder = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
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
        stage.addChild(container);
    }

    stage.update();
}

function setupCards() {
    var cards = $('#card-wrapper .cards').css('opacity', '');

    cards.eq(0).text('Up 1').on('click', function() {
        if (!hasSelected) return;
        if (0 >= selectedTikiIdx) {
            alert('Cannot move the first Tiki!');
            return;
        }

        //humanAnim = true;
        updateState(0, selectedTikiIdx, 0);
        tikis = moveUp(selectedTikiIdx, 1);

        upCardRemain--;
        if (0 === upCardRemain) {
            $(this).css('opacity', '0').unbind('click');
        }

        stage.removeChild(selectMark);
        stage.update();
        hasSelected = false;
        selectedTikiIdx = null;

        if (handleEnd()) return;

        setTimeout(function() {
            graAgent.move();
            handleEnd();
        }, 1000);
    });
    cards.eq(1).text('Up 2').on('click', function() {
        if (!hasSelected) return;
        if (1 >= selectedTikiIdx) {
            alert('Cannot move Tiki!');
            return;
        }

        updateState(1, selectedTikiIdx, 0);
        tikis = moveUp(selectedTikiIdx, 2);

        $(this).css('opacity', '0').unbind('click');

        stage.removeChild(selectMark);
        stage.update();
        hasSelected = false;
        selectedTikiIdx = null;

        if (handleEnd()) return;

        setTimeout(function() {
            graAgent.move();
            handleEnd();
        }, 1000);
    });
    cards.eq(2).text('Up 3').on('click', function() {
        if (!hasSelected) return;
        if (2 >= selectedTikiIdx) {
            alert('Cannot move Tiki!');
            return;
        }

        updateState(2, selectedTikiIdx, 0);
        tikis = moveUp(selectedTikiIdx, 3);

        $(this).css('opacity', '0').unbind('click');

        stage.removeChild(selectMark);
        stage.update();
        hasSelected = false;
        selectedTikiIdx = null;

        if (handleEnd()) return;

        setTimeout(function() {
            graAgent.move();
            handleEnd();
        }, 1000);
    })
    cards.eq(3).text('Push!').on('click', function() {
        if (!hasSelected) return;
        if (-1 === selectedTikiIdx) {
            alert('Please select again');
            return;
        }
        updateState(3, selectedTikiIdx, 0);
        moveToBottom(selectedTikiIdx);
        
        $(this).css('opacity', '0').unbind('click');
        stage.removeChild(selectMark);
        stage.update();
        hasSelected = false;
        selectedTikiIdx = null;

        if (handleEnd()) return;

        setTimeout(function() {
            graAgent.move();
            handleEnd();
        }, 1000);
    })
    cards.eq(4).text('Kill!').on('click', function() {
        killCardRemain--;

        updateState(4, tikis.length - 1, 0);
        killLast();

        if (0 === killCardRemain) {
            $(this).css('opacity', '0').unbind('click');
        }
        if (hasSelected) {
            stage.removeChild(selectMark);
            stage.update();
            hasSelected = false;
            selectedTikiIdx = null;
        }

        if (handleEnd()) return;

        setTimeout(function() {
            graAgent.move();
            handleEnd();
        }, 1000);
    });
}

function handleEnd() {
    var result = askJudge();
    if (null !== result) {
        var humScore = result[0],
            comScore = result[1];
        var winner = (comScore > humScore)? 'Computer' : 'You';
        alert('Your score: ' + humScore +
            '\nComputer\'s score: ' + comScore +
            '\n' + winner + ' Wins');
        return true;
    }
    return false;
}


/*
 * Agent PK Agent
 */

function agentPk() {
    var configDiv = $('#test-wrapper #config-div');
    var iter = configDiv.find('input')[0].value;
    if (isNaN(iter)) {
        alert('Iterations value invalid.');
        configDiv.find('input')[0].value = '';
        return;
    }

    var agentOptions = configDiv.find('select');
    var agentNames = [];
    for (var i = 0; i < agentOptions.length; ++i) {
        if ('none' != agentOptions[i].value) {
            agentNames.push(agentOptions[i].value);
        }
    }

    var results = [];
    var resultArea = $('#result-area').html('');
    var win = [0, 0, 0, 0];
    for (var i = 0; i < iter; ++i) {
        var missions = createPKMissions(agentNames.length);
        allMissions = missions; // Set up global var in game.js

        // Create Agents
        var agents = new Array();
        for (var j = 0; j < agentNames.length; ++j) {
            agents[j] = new Agent();
            agents[j].init(agentNames[j], j, missions[j]);
        }

        // PK!!!
        setupGame(agentNames.length, missions.slice(), createTikiOrder());
        while(1) {
            var endingResult;
            for (var j = 0; j < agents.length; j++) {
                agents[j].move();
                endingResult = askJudge();
                if (null !== endingResult) {
                    break;
                }
            }
            
            if (null !== endingResult) {
                showResult(i, endingResult);
                results.push(endingResult);
                var ind = endingResult.indexOf(Math.max.apply(Math, endingResult));
                for (var k=0; k<endingResult.length; k++) {
                    if (endingResult[k]==endingResult[ind])
                        win[k]++;
                }
                
                //displayResult(resultArea, endingResult, i);
                break;
            }
            state.round++;
            for (var k = 0; k < playersNumber; k++) {
                state.record[k][state.round] = -1;
            }
            
        }
    }
    for (var n = 0; n < win.length; n++) {
        console.log('A', (n+1), 'win:', win[n]);
    }
}

function showResult(iter, result) {
    var score = '';
    for (var i = 0; i < result.length; i++) {
        score += ('A' + (i+1) + ': ' + result[i] + ' ');
    };
    console.log('#', iter+1, score);
}
/*
function displayResult(area, results, iter) {
    area.html(function(idx, oldhtml) {
        var content = '<span>Iter&nbsp;#' + iter + '</span></br>';
        for (var i = 0; i < results.length; i++) {
            content += '<span>Agent&nbsp;' + i + '&nbsp;score:&nbsp;'
                             + results[i] + '</span>';
        };
        return oldhtml + content + '</br>';
    });
}
*/

function setupTest() {
    var pagedivs = $('.tabpage');

    var tabsAnchor = $('#tabs li a');
    tabsAnchor.first().addClass('selected');
    tabsAnchor.on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        $this.addClass('selected')
            .parent().siblings().find('a').removeClass('selected');
        var activeTab = $this.attr('href').slice(1);
        pagedivs.removeClass('hide').addClass('hide');
        $('#'+activeTab).removeClass('hide');

        UI_Mode = ~~(activeTab == 'graphic');
    });

    var $configDiv = $('#config-div');
    var $goBtn = $configDiv.find('#go-btn2');
    $goBtn.on('click', agentPk);
    $configDiv.find('input').on('keyup', function(e) {
        if (13 === e.keyCode) {
            $goBtn.click();
        }
    });

}


})();
