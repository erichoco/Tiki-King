/* Implement AI here */

//class state
// remaining action , Tiki Order , 

//var target

//getAIAction(action) // for main.js to call
//miniMax()
//evaluation function()
//updateState(action) // for main.js to call


var state = new State();

// This is the 'class' of State
function State() {
    this.myActions = [0, 0, 1, 2, 3, 4, 4]; // actions remained
    this.opActions = [0, 0, 1, 2, 3, 4, 4]; // actions of opponent remained
    this.tikiOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.missionTarget = [1 , 3 , 4 ] //the AI's mission
}

function copyState( stateToBeCopied,targetState)
{


    
    stateToBeCopied.myActions = targetState.myActions.slice(0)
    stateToBeCopied.opActions = targetState.opActions.slice(0)
    stateToBeCopied.tikiOrder = targetState.tikiOrder.slice(0)
    stateToBeCopied.missionTarget = targetState.missionTarget.slice(0)

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
    console.log('Hey, I receive action', action, 'on Tiki #' + tikiIdx);


    var tikiId = state.tikiOrder[tikiIdx]

    if (0 === player) {
        var idx = state.myActions.indexOf(action);
        state.myActions.splice(idx, 1);
        console.log('This is AI do the action')
    }
    else if (1 === player) {

        var idx = state.opActions.indexOf(action);
        state.opActions.splice(idx, 1);
        console.log('This is human do the action')

      
    if (action == 0)
        updateStateWithMoveup(1,tikiId , state);
    else if (action == 1)
        updateStateWithMoveup(2,tikiId, state);
    else if (action == 2)
        updateStateWithMoveup(3,tikiId, state); 
    else if (action == 3)
        updateStateWithPush(tikiId, state);
    else if (action ==4)
        updateStateWithKill(state);

    }

    else {
        console.log('ERROR: invalid "player" passed to updateState()')
    }

    console.log('Updated State:', state.tikiOrder)
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
    else if (action ==4)
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
    targetState.tikiOrder[tikiIndex - moveup] = tmp
}

function updateStateWithPush(tikiId , targetState)
{

    var tikiIndex = getTikiIndex(tikiId , targetState)
    var index = tikiIndex


    while(index<targetState.tikiOrder.length-1){
        targetState.tikiOrder[index] = targetState.tikiOrder[index+1]
        index +=1
    }

    targetState.tikiOrder[targetState.tikiOrder.length-1] = tikiId

}

function updateStateWithKill(targetState)
{

    targetState.tikiOrder.pop()

}

function evaluationFunction(currentState)
{
    var score = 0 
    var distance = 0  
    var idx

    for( var i = 0 ; i < currentState.missionTarget.length ; i++){
      
      idx = getTikiIndex(currentState.missionTarget[i] , currentState);
      if(idx <= i)
        {

            if (i == 0) score+=9
            else if (i == 1) score+=5
            else if (i == 2) score +=2
        }
      else distance += Math.abs(idx-i);
    }

    return score*10 - distance
     
}

//compute the states of every remained action and to every tiki on the table
//use evaluation function to get the score , return the best action
function comAIMove() 
{
    console.log('Computer AI turn')
    

    var allNextState = []
    var allNextAction = []
    var allNextMovingTiki = []
    for(var i = 0 ; i < state.opActions.length ; i++)
        for(var j = 0 ; j < state.tikiOrder.length ; j++)
        {
            var nextState = new State()
            copyState(nextState,state)
            //console.log("try state " , state , "with op and tikiOrder " , state.opActions[i] , state.tikiOrder[j])
            var illegal = checkLegalAction(state.opActions[i] , state.tikiOrder[j] , nextState)


            if (illegal == 1) 
                continue

            nextState = tryNextState(state.opActions[i] , state.tikiOrder[j] , nextState)
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

    

    console.log("AI say do operation " , state.opActions[allNextAction[maxIndex]] , " on tiki " , state.tikiOrder[allNextMovingTiki[maxIndex]])

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



