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

/*
 * Update state object.
 *
 * action: index of new action (card used)
 * tikiIdx: tiki index on which the action applied
 * player: player who conducts the action (0: AI, 1: human player)
 */
function updateState(action, tikiIdx, player) {
    console.log('Hey, I receive action', action, 'on Tiki #' + tikiIdx);

    if (0 === player) {
        var idx = state.myActions.indexOf(action);
        state.myActions.splice(idx, 1);
        console.log('This is player do the action')
    }
    else if (1 === player) {
        var idx = state.opActions.indexOf(action);
        state.opActions.splice(idx, 1);
        console.log('This is AI do the action')


        
    if (action == 0)
        updateStateWithMoveup(1,tikiIdx);
    else if (action == 1)
        updateStateWithMoveup(2,tikiIdx);
    else if (action == 2)
        updateStateWithMoveup(3,tikiIdx); 
    else if (action == 3)
        updateStateWithPush(tikiIdx);
    else if (action ==4)
        updateStateWithKill();

    var currentState = state.tikiOrder.slice();
    evaluationFunction(currentState);
    if(currentState[0] == 7)
        console.log('update currentState!');
    }

    else {
        console.log('ERROR: invalid "player" passed to updateState()')
    }

    console.log('Updated State:', state.tikiOrder);
}

function updateStateWithMoveup(moveup , tikiIdx)
{
    tmp = state.tikiOrder[tikiIdx];
    moveTime = 0;
    while(moveTime<moveup){
        index = tikiIdx - moveTime;
        state.tikiOrder[index] = state.tikiOrder[index-1];
        moveTime +=1;
    }
    state.tikiOrder[tikiIdx - moveup] = tmp;
}

function updateStateWithPush(tikiIdx)
{
    tmp = state.tikiOrder[tikiIdx]; 
    index = tikiIdx
    while(index<state.tikiOrder.length-1){
        state.tikiOrder[index] = state.tikiOrder[index+1];
        index +=1;
    }

    state.tikiOrder[state.tikiOrder.length-1] = tmp;

}

function updateStateWithKill()
{


    state.tikiOrder.pop();

}

function evaluationFunction(currentState)
{
    score = 0 ;
    distance = 0 ;

    
}

// used for get mission target 's idx'
function getIdxInTikiOrder(key)
{

    for(i = 0 ; i < state.tikiOrder.length; i++)
        if(state.tikiOrder[i] == key)
            {index = i; return index; }


    console.log('Error! the key ', key , 'is not in tikiOrder!');


}


function comAIMove() {
    console.log('Computer AI turn');
}

