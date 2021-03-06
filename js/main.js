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

var graAgent = []; // Agent in graphic mode
var graMissions = [];

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
    var $setting = $('#setting');
    var agentOptions = $setting.find('select[name=agent]');
    var agentNames = [];
    for (var i = 0; i < agentOptions.length; ++i) {
        if ('none' != agentOptions[i].value) {
            agentNames.push(agentOptions[i].value);
        }
    }
    graMissions = createPKMissions(agentNames.length+1);
    displayMissions(graMissions);

    setupGame(agentNames.length+1, graMissions, tikiOrder);
    graAgent = [];
    for (var i = 0; i < agentNames.length; i++) {
        var agent = new Agent();
        agent.init(agentNames[i], i+1, graMissions[i+1]);
        graAgent.push(agent);
    };
    //graAgent = new Agent();
    //graAgent.init($setting.find('select[name=agent]')[0].value, 1, graMissions[1]);
    //graAgent.setEval($setting.find('select[name=eval]')[0].value);

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

    var $setting = $('#setting');

    $setting.find('input').change(function() {
        comMissionBoard.fadeToggle();
    });
    $setting.find('select[name=agent]').on('change', function() {
        resetGame();
        /*var idx = $setting.children('select').index($(this));
        graAgent[idx] = new Agent();
        graAgent[idx].init(this.value, idx+1, graMissions[idx+1]);*/
    });
    $setting.find('select[name=eval]').on('change', function() {
        graAgent.setEval(this.value);
    });
    $setting.find('#replay').click(resetGame);
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
        var agentMissions = '';
        for (var j = 1; j < missions.length; ++j) {
            agentMissions += missions[j][i] + ' ';
        }
        mission.html(orderStr[i] + ': ' + agentMissions);
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
    var cards = $('#card-wrapper .cards').css('opacity', '').unbind('click');;

    var allAgentMove; // setInterval var

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

        var idx = 0;
        allAgentMove = setInterval(function() {
            agentMove(idx++);
        }, 2000);
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

        var shouldBr = false;
        //console.log(graAgent[0]);
        //for (var i = 0; i < graAgent.length; i++) {
            //console.log(i);
        var idx = 0;
        allAgentMove = setInterval(function() {
            agentMove(idx++);
        }, 2000);
            // setTimeout(function () {
            //     console.log(graAgent[i], i);
            //     graAgent[0].move();
            //     if (handleEnd()) {
            //         shouldBr = true;
            //         return;
            //     }
            //     if agent
            // }, 1000);
            //if (shouldBr) {
              //  break;
            //} }
        /*
        setTimeout(function() {
            graAgent.move();
            handleEnd();
        }, 1000);*/
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

        var idx = 0;
        allAgentMove = setInterval(function() {
            agentMove(idx++);
        }, 2000);
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

        var idx = 0;
        allAgentMove = setInterval(function() {
            agentMove(idx++);
        }, 2000);

        /*var shouldBr = false;
        for (var i = 0; i < graAgent.length; i++) {
            setTimeout(function () {
                graAgent[i].move();
                if (handleEnd()) {
                    shouldBr = true;
                    return;
                }
            }, 1000);
            if (shouldBr) {
                break;
            }
        }*/
    })
    cards.eq(4).text('Kill!').on('click', function() {
        updateState(4, tikis.length-1, 0);

        killCardRemain--;
        if (0 === killCardRemain) {
            $(this).css('opacity', '0').unbind('click');
        }

        if (hasSelected) {
            stage.removeChild(selectMark);
            stage.update();
            hasSelected = false;
            selectedTikiIdx = null;
        }

        killLast();
        if (handleEnd()) return;

        var idx = 0;
        allAgentMove = setInterval(function() {
            agentMove(idx++);
        }, 2000);
    });

    function agentMove(agentIdx) {
        graAgent[agentIdx].move();
        if (handleEnd() || graAgent.length === agentIdx+1) {
            clearInterval(allAgentMove);
            return;
        }
    }
}

function handleEnd() {
    var result = askJudge();
    if (null !== result) {
        var winner = '';
        var bestResult = 0;
        for (var i = 0; i < result.length; i++) {
            var agent = '';
            if (0 === i) {
                agent = 'Human';
            } else {
                agent = 'Agent' + i;
            }
            if (result[i] > bestResult) {
                bestResult = result[i];
                winner = agent;
            }
            else if (result[i] === bestResult) {
                winner += ' ' + agent;
            }
            console.log(agent + ' score: ' + result[i]);
        };
        console.log(winner + ' Wins!');
        /*var humScore = result[0],
            comScore = result[1];
        var winner = (comScore > humScore)? 'Computer' : 'You';
        console.log('Your score: ' + humScore +
            '\nComputer\'s score: ' + comScore +
            '\n' + winner + ' Wins');*/
        return true;
    }
    return false;
}


/*
 * Agent PK Agent
 */

function agentPk() {
    var configDiv = $('#test-wrapper #config-div');
    var inputEl = configDiv.children('input');
    var iter = inputEl.first()[0].value;
    var showStep = inputEl.last()[0].checked;
    if (isNaN(iter)) {
        alert('Iterations value invalid.');
        inputEl.first()[0].value = '';
        return;
    }

    var agentOptions = configDiv.find('select[name=agent]');
    var agentNames = [];
    for (var i = 0; i < agentOptions.length; ++i) {
        if ('none' != agentOptions[i].value) {
            agentNames.push(agentOptions[i].value);
        }
    }

    var results = [];

    var resultArea = $('#result-wrapper')
        .html('<ul class="clearfix"></ul>');
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

        /*if (showStep) {
            $('body').on('keyup', function(e) {
                e.preventDefault();
            })

        } else {*/
        while(1) {
            var endingResult;
            for (var j = 0; j < agents.length; j++) {
                if (showStep) {
                    plotTikiOrder(i, j);
                }
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

                // displayResult(endingResult, i);
                break;
            }
            state.round++;
            for (var k = 0; k < playersNumber; k++) {
                state.record[k][state.round] = -1;
            }

        }
        //}
    }
    for (var n = 0; n < win.length; n++) {
        console.log('A', (n+1), 'win:', win[n]);
    }
    $('#result-wrapper').prepend(function() {
        var winStr = '';
        var style = 'style="color: #8533db;font-weight: bold;"';
        for (var i = 0; i < win.length; i++) {
            winStr += '<span>Agent ' + (i+1) + '</span>';
            winStr += '<span ' + style + '>' + win[i] + '</span>'
        }
        return '<p style="class:clearfix">' + winStr + '</p>';
    });
}

function showResult(iter, result) {
    var score = '';
    for (var i = 0; i < result.length; i++) {
        score += ('A' + (i+1) + ': ' + result[i] + ' ');
    };
    console.log('#', iter+1, score);
}

function displayResult(results, iter) {
    $('#result-wrapper').prepend(function() {
        var resultStr = ''
        for (var i = 0; i < results.length; i++) {
            resultStr += ' Agent' + (i+1) + ' ' + results[i];
        };
        return '<p>Iteration #' + iter + ': ' + resultStr + '</p>';
    });
/*
        var content = '<span>Iter&nbsp;#' + iter + '</span></br>';
        for (var i = 0; i < results.length; i++) {
            content += '<span>Agent&nbsp;' + i + '&nbsp;score:&nbsp;'
                             + results[i] + '</span>';
        };
        return oldhtml + content + '</br>';
    });*/
}


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

        UI_Mode = ~~(activeTab === 'graphic');
        if (UI_Mode) {
            resetGame();
        }
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

function plotTikiOrder(iter, step) {
    var curState = getState();
    var curOrder = curState.tikiOrder;
    var $orderList = $('#result-area ul');

    var ulWidth = $orderList.width();
    $orderList.width((parseInt(ulWidth)+130) + 'px');

    var iterP = '<p>' + 'Iter ' + (iter+1) + '</p>';
    var stepP = '<p>' + 'Step ' + (step+1) + '</p>';

    var divEl = '';
    for (var i = 0; i < curOrder.length; i++) {
        divEl += '<div>' + curOrder[i] + '</div>\n';
    }

    $orderList.append('<li>' + iterP + stepP + divEl + '</li>');//.html(curOrder);
    var testTikis = $orderList.children('li').last().find('div');
    for (var i = 0; i < testTikis.length; i++) {
        $(testTikis[i]).css('background-color',
            tikiColor[curOrder[i]]);
    };
}


})();
