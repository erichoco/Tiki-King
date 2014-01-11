/*Each Round of Game implement in here */
/*Each round of game exists a judge to handle the game*/



var state = new State();
var playerScores = null;
var playersNumber = null;
var allMissions = null;
var gameEnd = 0;
var UI_Mode = 0;  // 0 testMode ; 1 UI_mode


// This is the 'class' of State
function State() {

    this.playersAction = null;
    this.tikiOrder = null;
}


/*
 * Reset the game , prepare for the new game
 */
function setupGame(   pNumber , playerMissions )
{
   console.log("This is setupGame function!");
   state = new State();
   playerScores = null;
   playersNumber = pNumber;
   allMissions = new Array();
   for(var i = 0 ; i < playersNumber ; i++)
     allMissions[i] = playerMissions[i].slice(0);


   initialAction = [0 , 0 , 1 , 2 , 3 , 4 ,4];
   state.playersAction = new Array();   
   for(var i = 0 ; i < playersNumber ; i++)
      state.playersAction[i] = initialAction.slice(0);

   initialTikiOrder  = [0, 1, 2, 3, 4, 5, 6, 7, 8];
   state.tikiOrder = initialTikiOrder.slice(0);
   gameEnd = 0;


}
/*
 * for Agent to call
 */
function getState()
{

    return state ;

}






/*
 * Tell game judge who are you , which Tiki you want to move , and what is your action
 * Then Judge should update game state according to the request  
 */

 //problem: What should be the input ? tikiID or tikiIdx?
function tellJudge(playerID , tikiIdx , action)
{
    console.log("This is tellJudge function")
    updateState(action , tikiIdx , playerID)
    checkGameEnd()
}


/*
 * Check whether the game is over
 * If yes , assign the score
 */
function checkGameEnd()
{
    console.log("This is checkGameEnd function")
    if ((0 === state.humActions.length && 0 === state.comActions.length) || state.tikiOrder.length <= 3) 
    {
        playerScores = new Array();
        for(var  i = 0 ; i < playersNumber ; i++)         
            playerScores[i] = computeScore( allMissions[i] , state.tikiOrder);
        gameEnd = 1;
         
    }
}

/*
 * called by  main
 * return scores
 */
function askJudge()
{
    console.log("This is askJudge function")


    if(gameEnd == 0) 
        return null;
    
    else {
        return playerScores;
    }
}



/***** Helper Functions *****/
/*
 * input is 2 scores
 * one is Computer Score , one is Human
 */

 /*
function computeResult( winner  , comScore) {
     comScore = computeAISocre(state), humScore = computeHumSocre(state);
     winner = (comScore > humScore)? 'Computer' : 'You';
    alert('Your score: ' + humScore +
          '\nComputer\'s score: ' + comScore +
          '\n' + winner + ' Wins');
}
*/

// The following functions are related to update state
function updateState(action, tikiIdx, player) {
    //console.log('Hey, I receive action', action, 'on Tiki #' + tikiIdx);
    var tikiId = state.tikiOrder[tikiIdx]
 

    if (action == 0) {
        updateStateWithMoveup(1,tikiId , state , player , action);
        if(UI_Mode == 1)
          moveUp(tikiIdx, 1);
    }
    else if (action == 1) {
        updateStateWithMoveup(2,tikiId, state , player , action);
        if(UI_Mode == 1)
          moveUp(tikiIdx, 2);
    }
    else if (action == 2) {
        updateStateWithMoveup(3,tikiId, state , player , action);
        if(UI_Mode == 1)
          moveUp(tikiIdx, 3);
    }
    else if (action == 3) {
        updateStateWithPush(tikiId, state , player , action);
        if(UI_Mode == 1)
          moveToBottom(tikiIdx);
    }
    else if (action == 4) {
        updateStateWithKill(state , player , action);
        if(UI_Mode == 1)
          killLast();
    }
   
    else {
        console.log('ERROR: invalid "player" passed to updateState()')
    }

    console.log('Current Order:', state.tikiOrder)
    
}




function updateStateWithMoveup(moveup , tikiId , targetState , playerID , actionID)
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

    var beRemovedActionIndex = targetState.playersAction[playerID].indexOf(actionID);
    targetState.playersAction[playerID].splice(beRemovedActionIndex , 1);
}

function updateStateWithPush(tikiId , targetState , playerID , actionID)
{

    var tikiIndex = getTikiIndex(tikiId , targetState);
    var index = tikiIndex;


    while(index<targetState.tikiOrder.length-1){
        targetState.tikiOrder[index] = targetState.tikiOrder[index+1];
        index +=1;
    }

    targetState.tikiOrder[targetState.tikiOrder.length-1] = tikiId;

    var beRemovedActionIndex = targetState.playersAction[playerID].indexOf(actionID);
    targetState.playersAction[playerID].splice(beRemovedActionIndex , 1);

}

function updateStateWithKill(targetState , playerID , actionID)
{

    targetState.tikiOrder.pop();

    var beRemovedActionIndex = targetState.playersAction[playerID].indexOf(actionID);
    targetState.playersAction[playerID].splice(beRemovedActionIndex , 1);

}


