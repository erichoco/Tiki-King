/* Implement AI here */

var state = new State();
console.log("AI's target", state.comMission);

// This is the 'class' of State
function State() {
    this.comActions = [0, 0, 1, 2, 3, 4, 4]; // actions of computer player remained
    this.humActions = [0, 0, 1, 2, 3, 4, 4]; // actions of human player remained
    this.comMission = [1, 3, 4]; // the AI's mission
    this.humMission = [0, 1, 2];
    this.tikiOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
}


function copyState( stateToBeCopied,targetState)
{
    stateToBeCopied.comActions = targetState.comActions.slice(0);
    stateToBeCopied.humActions = targetState.humActions.slice(0);
    stateToBeCopied.tikiOrder = targetState.tikiOrder.slice(0);
    stateToBeCopied.comMission = targetState.comMission.slice(0);
    stateToBeCopied.humMission = targetState.humMission.slice(0);
}

/*
 * Update state object.
 *
 * action: index of new action (card used)
 * tikiIdx: tiki index on which the action applied
 * player: player who conducts the action (0: AI, 1: human player)
 * tikiId: is the identity of the tiki , it represent the tiki
 */
function updateState(action, tikiIdx, player) {
    //console.log('Hey, I receive action', action, 'on Tiki #' + tikiIdx);
    var tikiId = state.tikiOrder[tikiIdx]

    if (0 === player) {
        var idx = state.comActions.indexOf(action);
        state.comActions.splice(idx, 1);
        console.log('This is AI do the action', action, tikiIdx)
        if (action == 0) {
            updateStateWithMoveup(1,tikiId , state);
            moveUp(tikiIdx, 1);
        }
        else if (action == 1) {
            updateStateWithMoveup(2,tikiId, state);
            moveUp(tikiIdx, 2);
        }
        else if (action == 2) {
            updateStateWithMoveup(3,tikiId, state);
            moveUp(tikiIdx, 3);
        }
        else if (action == 3) {
            updateStateWithPush(tikiId, state);
            moveToBottom(tikiIdx);
        }
        else if (action == 4) {
            updateStateWithKill(state);
            killLast();
        }
    }
    else if (1 === player) {

        var idx = state.humActions.indexOf(action);
        state.humActions.splice(idx, 1);
        console.log('This is human do the action')

        if (action == 0)
            updateStateWithMoveup(1,tikiId , state);
        else if (action == 1)
            updateStateWithMoveup(2,tikiId, state);
        else if (action == 2)
            updateStateWithMoveup(3,tikiId, state); 
        else if (action == 3)
            updateStateWithPush(tikiId, state);
        else if (action == 4)
            updateStateWithKill(state);
    }

    else {
        console.log('ERROR: invalid "player" passed to updateState()')
    }

    console.log('Current Order:', state.tikiOrder)

    checkGameEnd();
}

//used for AI get nextState in ComAI()
function tryNextState(action , tikiId , currentState)  
{

    if (action == 0)
        updateStateWithMoveup(1,tikiId , currentState);
    else if (action == 1)
        updateStateWithMoveup(2,tikiId, currentState);
    else if (action == 2)
        updateStateWithMoveup(3,tikiId, currentState); 
    else if (action == 3)
        updateStateWithPush(tikiId, currentState);
    else if (action == 4)
        updateStateWithKill(currentState);

    return currentState
}

function updateStateWithMoveup(moveup , tikiId , targetState)
{

    var tmp = tikiId
    var moveTime = 0
    var tikiIndex = getTikiIndex(tikiId , targetState)

    while(moveTime<moveup){
        var index = tikiIndex - moveTime
        targetState.tikiOrder[index] = targetState.tikiOrder[index-1]
        moveTime +=1
    }
    targetState.tikiOrder[tikiIndex - moveup] = tmp;
}

function updateStateWithPush(tikiId , targetState)
{

    var tikiIndex = getTikiIndex(tikiId , targetState);
    var index = tikiIndex;


    while(index<targetState.tikiOrder.length-1){
        targetState.tikiOrder[index] = targetState.tikiOrder[index+1];
        index +=1;
    }

    targetState.tikiOrder[targetState.tikiOrder.length-1] = tikiId;

}

function updateStateWithKill(targetState)
{

    targetState.tikiOrder.pop();

}

function evaluationFunction(currentState)
{
    var score = computeAISocre(currentState);
    var distance = 0;
    var idx;

    for( var i = 0 ; i < currentState.comMission.length ; i++){
      
        idx = getTikiIndex(currentState.comMission[i] , currentState);
      /*if(idx <= i)
        {

            if (i == 0) score+=9
            else if (i == 1) score+=5
            else if (i == 2) score +=2
        }*/
        if(idx > i) {
            distance += Math.abs(idx-i);
        }
    }

    return score*10 - distance;
}

//compute the states of every remained action and to every tiki on the table
//use evaluation function to get the score , return the best action
function comAIMove() 
{
    //console.log('Computer AI turn')
    

    var allNextState = []
    var allNextAction = []
    var allNextMovingTiki = []
    for(var i = 0 ; i < state.comActions.length ; i++)
        for(var j = 0 ; j < state.tikiOrder.length ; j++)
        {
            var nextState = new State()
            copyState(nextState,state)
            //console.log("try state " , state , "with op and tikiOrder " , state.comActions[i] , state.tikiOrder[j])
            var illegal = checkLegalAction(state.comActions[i] , state.tikiOrder[j] , nextState)


            if (illegal == 1) 
                continue

            nextState = tryNextState(state.comActions[i] , state.tikiOrder[j] , nextState)
            allNextState.push(nextState)
            allNextAction.push(i)
            allNextMovingTiki.push(j)
        
            //console.log("The nextState oeder is " , nextState.tikiOrder)

        }

    var maxIndex = 0 ;
    var maxValue = -100000 ;

    for(var i = 0 ; i < allNextState.length ; i++)
    {
        var tmpValue = evaluationFunction(allNextState[i])
        if(tmpValue > maxValue)
            {maxValue = tmpValue
             maxIndex = i
            }
    }

    console.log("AI say do operation " , state.comActions[allNextAction[maxIndex]] , " on tiki " , state.tikiOrder[allNextMovingTiki[maxIndex]])
    var operation = state.comActions[allNextAction[maxIndex]];
    updateState(operation, allNextMovingTiki[maxIndex], 0);

    var AIscore = computeAISocre(state)
    console.log("AI now scores ", AIscore)

}


//check if the action is legal to the tiki
//ex: action push up 3 is not allowed for tiki of order 0
//p.s. kill is always allowed
function checkLegalAction( action,tikiId , targetState)
{

    index = getTikiIndex(tikiId , targetState)

    var illegal = 0
    if(action == 0)
    {
        if(index == 0)
            illegal = 1
    }
    else if(action ==1)
    {
        if(index <=1)
            illegal = 1
    }
    else if(action ==2)
    {
        if(index <= 2)
            illegal = 1
    }

    else if(action == 3)
    {
        if (index >= targetState.tikiOrder.length-1)
            illegal = 1
    }

    //console.log("In checkLegalAction , The tikiIdx , index , action , illegal " , tikiIdx , index , action , illegal)

    return illegal

}

//give a tiki id , it return the tiki 's order in array tikiOrder
function getTikiIndex(tikiId , targetState)
{
    var idx = 0;
    for(var i = 0 ; i < targetState.tikiOrder.length ; i++)
        if (targetState.tikiOrder[i] == tikiId)
            {idx = i ;
            return idx;}

     //console.log('The tiki you try to find is not in tikiOrder , which may be killed...')
     //console.log('Tiki Order is ' , targetState.tikiOrder)
     //console.log('The tikiOrder ', tikiIdx , ' , which is not in tikiOrder!')
}

function computeAISocre(currentState)
{
    var score = 0 
    for( var i = 0 ; i < currentState.comMission.length ; i++){
      
      idx = getTikiIndex(currentState.comMission[i] , currentState);
      if(idx <= i)
        {

            if (i == 0) score+=9
            else if (i == 1) score+=5
            else if (i == 2) score +=2
        }
    }

   return score
}

function computeHumSocre(currentState)
{
    var score = 0;
    var reward = [9, 5, 2];
    for (var i = 0; i < currentState.humMission.length; i++) {
        idx = currentState.tikiOrder.indexOf(currentState.humMission[i]);
        if (idx <= i && idx !== -1) {
            score += reward[i];
        }
    }
   return score;
}

function checkGameEnd() {
    if ((0 === state.humActions.length && 0 === state.comActions.length) || state.tikiOrder.length <= 3) {
        computeResult();
    }
}

function computeResult() {
    var comScore = computeAISocre(state), humScore = computeHumSocre(state);
    var winner = (comScore > humScore)? 'Computer' : 'You';
    alert('Your score: ' + humScore +
          '\nComputer\'s score: ' + comScore +
          '\n' + winner + ' Wins');
}
