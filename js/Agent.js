
function Agent() {
    this.agentName = '';
    this.agentNumber = 0;
    this.mission = [];
    this.move;
}

Agent.prototype.init = function(agentName, agentNumber, mission) {
    this.agentName = agentName;
    this.agentNumber = agentNumber;
    this.mission = mission;
    switch(agentName) {
            case 'simple-1':
                this.eval = 1;
                this.move = reflexMove;
                break;
            case 'simple-2':
                this.eval = 2;
                this.move = reflexMove;
                break;
            case 'simple-3':
                this.eval = 3;
                this.move = reflexMove;
                break;
            case 'simple-4':
                this.eval = 4;
                this.move = reflexMove;
                break;
            case 'minimax1-1':
                this.depth = 1;
                this.eval = 1;
                this.move = minimaxMove;
                break;
            case 'minimax2-1':
                this.depth = 2;
                this.eval = 1;
                this.move = minimaxMove;
                break;
            case 'minimax3-1':
                this.depth = 3;
                this.eval = 1;
                this.move = minimaxMove;
                break;
            case 'minimax1-2':
                this.depth = 1;
                this.eval = 2;
                this.move = minimaxMove;
                break;
            case 'minimax2-2':
                this.depth = 2;
                this.eval = 2;
                this.move = minimaxMove;
                break;
            case 'minimax3-2':
                this.depth = 3;
                this.eval = 2;
                this.move = minimaxMove;
                break;
            default:
                console.log(agent);
                alert('haha');
    }
};
/*
Agent.prototype.setEval = function(evalName) {
    switch(evalName) {
            case 'eval1':
                this.move = reflexMove;
                break;
            case 'minimax1':
                this.depth = 1;
                this.move = minimaxMove;
                break;
            case 'minimax2':
                this.depth = 2;
                this.move = minimaxMove;
                break;
            case 'minimax3':
                this.depth = 3;
                this.move = minimaxMove;
                break;
            default:
                console.log(agent);
                alert('haha');
    }
};*/


function minimaxMove() {
    var myActions = state.playersAction[this.agentNumber];
    var availTiki = state.tikiOrder;

    var nextMoves = [];
    var nextStates = [];
    for (var i = 0; i < myActions.length; ++i) {
        for (var j = 0; j < availTiki.length; ++j) {
            if (!checkLegalAction(state, myActions[i], availTiki[j])) {
                nextMoves.push({
                    'tiki': availTiki[j],
                    'action': myActions[i],
                });
                nextStates.push(
                    getNextState(state, myActions[i], availTiki[j], this.agentNumber)
                );
            }
        }
    }
    /*if (0 === nextStates.length) {
        console.log('state len 0:', myActions, availTiki);
    }*/

    var depth = this.depth; // default minimax depth
    var scores = [];
    for (var i = 0; i < nextStates.length; i++) {

        scores.push(minimax(this, nextStates[i], depth+1, this.agentNumber, 
            -Number.MAX_VALUE, Number.MAX_VALUE));
    };
    var bestScore = Math.max.apply(null, scores);

    var bestMove = nextMoves[scores.indexOf(bestScore)];

    tellJudge(this.agentNumber, availTiki.indexOf(bestMove.tiki), bestMove.action);
}

// thisAgent is the original agent calling move function
function minimax(thisAgent, currentState, depth, agentNumber, alpha, beta) {
    if (agentNumber === thisAgent.agentNumber) {
        depth--;
    }
    var legalActions = getLegalActions(currentState, agentNumber);
    //console.log(legalActions.length);
    if (!depth || !legalActions.length) {
        var score;
        if (thisAgent.eval == 1)
            score = evaluationFunction(currentState, thisAgent.mission);
        else if (thisAgent.eval == 2)
            score = evalEvalFunc(currentState, thisAgent.mission, thisAgent.agentNumber);
        else {
            console.log('WRONG!', eval);
            debugger;
        }
        //console.log(score);
        return score;
        // return evaluationFunction(currentState, thisAgent.mission)
    }

    var numOfAgent = currentState.playersAction.length;
    var currentScores = [];

    var nextAgentNum = (agentNumber+1) % numOfAgent;
    for (var j = 0; j < legalActions.length; j++) {
        if (alpha >= beta) {
            break;
        }
        var nextState = getNextState(currentState,
            legalActions[j].action, legalActions[j].tiki, nextAgentNum);
        var score = minimax(thisAgent, nextState, depth, nextAgentNum, alpha, beta);
        currentScores.push(score);

        if (agentNumber === thisAgent.agentNumber) {
            if (score > alpha) {
                alpha = score;
            }
        } else {
            if (score < beta) {
                beta = score;
            }
        }
    }

    if (agentNumber === thisAgent.agentNumber) {
        return Math.max.apply(null, currentScores);
    } else {
        var sum = 0;
        for (var i = 0; i < currentScores.length; i++) {
            sum += currentScores[i];
        }
        return sum/currentScores.length;
    }
}

function reflexMove() {
    var allNextState = [];
    var allNextAction = [];
    var allNextMovingTiki = [];
    // get legal actions
    for(var i = 0 ; i < state.playersAction[this.agentNumber].length ; i++) {
        for(var j = 0 ; j < state.tikiOrder.length ; j++)
        {
            var illegal = checkLegalAction(state, state.playersAction[this.agentNumber][i] , state.tikiOrder[j]);
            if (illegal == 1) 
                continue;
            var nextState = getNextState(state, state.playersAction[this.agentNumber][i] , state.tikiOrder[j], this.agentNumber);
            allNextState.push(nextState);
            allNextAction.push(i);
            allNextMovingTiki.push(j);
        }
    }

    // Find best action
    var maxIndex = 0;
    var maxValue = -100000;
    for(var i = 0 ; i < allNextState.length ; i++)
    {
        var tmpValue = 0;
        if (this.eval == 1)
            tmpValue = evaluationFunction(allNextState[i], this.mission);
        else if (this.eval == 2)
            tmpValue = evalEvalFunc(allNextState[i], this.mission, this.agentNumber);
        else if (this.eval == 3)
            tmpValue = stupidEvalFunc(allNextState[i], this.mission);
        else if (this.eval == 4) {
            tmpValue = killerEvalFunc(state, allNextState[i], allNextAction[i], this.mission);
        }
        else {
            console.log('WRONG eval!!!');
            debugger;
        }
        if(tmpValue > maxValue)
        {
            maxValue = tmpValue;
            maxIndex = i;
        }
    }

    // Call game.js to update state with best action
    // console.log("AI do operation " , state.comActions[allNextAction[maxIndex]] , " on tiki " , state.tikiOrder[allNextMovingTiki[maxIndex]]);
    var operation = state.playersAction[this.agentNumber][allNextAction[maxIndex]];

    if (operation === undefined || allNextMovingTiki[maxIndex] === undefined || maxIndex === undefined) {
        // console.log('operation:', operation);
        // console.log('allNextMovingTiki[maxIndex]:', allNextMovingTiki[maxIndex]);
        // console.log('maxIndex:', maxIndex);
        debugger;
    }
    tellJudge(this.agentNumber, allNextMovingTiki[maxIndex], operation);
}

function getLegalActions(currentState, agentNumber) {
    var myActions = currentState.playersAction[agentNumber];
    var availTiki = currentState.tikiOrder;

    var nextMoves = [];
    for (var i = 0; i < myActions.length; ++i) {
        for (var j = 0; j < availTiki.length; ++j) {
            if (1 === checkLegalAction(currentState, myActions[i], availTiki[j])) {
                nextMoves.push({
                    'tiki': availTiki[j],
                    'action': myActions[i],
                });
            }
        }
    }
    return nextMoves;
}

function checkLegalAction(targetState, action, tikiId)
{
    var index = getTikiIndex(targetState.tikiOrder, tikiId);
    var illegal = 0;
    if(action == 0)
    {
        if(index <= 0)
            illegal = 1;
    }
    else if(action ==1)
    {
        if(index <=1)
            illegal = 1;
    }
    else if(action ==2)
    {
        if(index <= 2)
            illegal = 1;
    }
    else if(action == 3)
    {
        if (index >= targetState.tikiOrder.length-1 || index < 0)
            illegal = 1;
    }

    //console.log("In checkLegalAction , The tikiIdx , index , action , illegal " , tikiIdx , index , action , illegal);
    return illegal;

}



function getNextState(currentState, action, tikiId, player)  
{
    var nextState = new State();
    copyState(nextState, currentState);

    if (action == 0) {
        updateStateWithMoveup(1,tikiId , nextState , player , action);
    }
    else if (action == 1) {
        updateStateWithMoveup(2,tikiId, nextState, player , action);
    }
    else if (action == 2) {
        updateStateWithMoveup(3,tikiId, nextState , player , action);
    }
    else if (action == 3) {
        updateStateWithPush(tikiId, nextState , player , action);
    }
    else if (action == 4) {
        updateStateWithKill(nextState , player , action);
    }
    else {
        console.log('ERROR: invalid "player" passed to getNextState(), action:', action);
    }

    return nextState;
}

function evaluationFunction(currentState, mission)
{
    var score = computeScore(currentState.tikiOrder, mission);
    var distance = 0;
    var idx;
    for( var i = 0 ; i < mission.length ; i++) {
        idx = getTikiIndex(currentState.tikiOrder, mission[i]);
        if(idx > i) {
            distance += Math.abs(idx-i);
        } else if (idx == -1) {
            distance += 10;
        }
    }

    return score*10 - distance;
}

function evalEvalFunc(currentState, mission, playerID)
{
    var myValue = evaluationFunction(currentState, mission);
    var othersValue = 0;
    for (var i = 0; i < state.round; i++) {
        for (var j = 0; j < playersNumber; j++) {
            if (j != playerID) {
                if (currentState.record[j][i] != -1) {
                    othersValue += (10-i)*guessTikiScore(currentState.tikiOrder, currentState.record[j][i])/5;
                }
            }
        } 
    }
    return (myValue - othersValue);
}

function stupidEvalFunc(currentState, mission)
{
    if (currentState.round<2) {
        return Math.random();
    }
    else
        return evaluationFunction(currentState, mission);
}

function killerEvalFunc(currentState, nextState, action, mission)
{
    if (mission.indexOf(state.tikiOrder[state.tikiOrder.length - 1]) === -1 && 
        state.tikiOrder.length > nextState.tikiOrder.length) {
        return 10000 + evaluationFunction(nextState, mission);
    } 
    else {
        return evaluationFunction(nextState, mission);
    }

}
