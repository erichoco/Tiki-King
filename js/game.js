/*Each Round of Game implement in here */
/*Each round of game exists a judge to handle the game*/

var state = new State();
var playerScores = null;
var playersNumber = null;
var allMissions = null;
var gameEnd = 0;
var UI_Mode = 1;  // 0 testMode ; 1 UI_mode
var allRecord = new Array();


// This is the 'class' of State
function State() {
    this.playersAction = new Array();
    this.tikiOrder = new Array();
    this.record = new Array();
    this.round = 0;
}

function stepRecord(doAction, onTiki) {
    this.doAction = doAction;
    this.onTiki = onTiki;
    return this;
}

/*
 * Reset the game , prepare for the new game
 */
function setupGame(pNumber, playerMissions, tikiOrder)
{
    // console.log("This is setupGame function!");
    state = new State();
    playerScores = null;
    playersNumber = pNumber;
    allMissions = new Array();
    for(var i = 0 ; i < playersNumber ; i++)
        allMissions[i] = playerMissions[i].slice(0);


    initialAction = [0 , 0 , 1 , 2 , 3 , 4 ,4];

    state.playersAction = new Array();
    for(var i = 0 ; i < playersNumber ; i++) {
        state.playersAction[i] = initialAction.slice(0);
        state.record[i] = [];
        state.record[i][0] = -1;
        allRecord[i] = [];
    }

    //initialTikiOrder  = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    state.tikiOrder = tikiOrder;//initialTikiOrder.slice(0);
    gameEnd = 0;


}
/*
 * for Agent to call
 */
function getState()
{
    return state;
}


/*
 * Tell game judge who are you , which Tiki you want to move , and what is your action
 * Then Judge should update game state according to the request  
 */

 //problem: What should be the input ? tikiID or tikiIdx?
function tellJudge(playerID , tikiIdx , action)
{
    // console.log("This is tellJudge function")
    if (action == undefined) {
        // console.log("Undefined action:", action);
        debugger;
    }
    updateState(action , tikiIdx , playerID);
    checkGameEnd();
}


/*
 * Check whether the game is over
 * If yes , assign the score
 */
function checkGameEnd()
{
    // console.log("This is checkGameEnd function")
    
    var flagOrder = 0;
    if (state.tikiOrder.length <= 3) {
        flagOrder = 1;
    }
    var flag = 1;
    for (var i = 0; i < state.playersAction.length; i++) {
        if (0 != state.playersAction[i].length) {
            flag = 0;
            break;
        }
    }
    if (flag || flagOrder) {
        // console.log('GAME END');
        playerScores = new Array();
        for(var  i = 0 ; i < playersNumber ; i++) {
            playerScores[i] = computeScore(state.tikiOrder, allMissions[i]);
        }
        gameEnd = 1;
    }
}

/*
 * called by  main
 * return scores
 */
function askJudge()
{
    // console.log("This is askJudge function")
    if(gameEnd == 0) {
        return null;
    }
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
    // console.log('Hey, I receive action', action, 'on Tiki #' + tikiIdx);
    // console.log('Current Order:', state.tikiOrder);
    console.log('Agent', player, ' action', action, ' tiki', tikiIdx);
    var tikiId = state.tikiOrder[tikiIdx]

    if (action == 0) {
        updateStateWithMoveup(1,tikiId , state , player , action);
        state.record[player][state.round] = tikiId;
        if(UI_Mode && player)
            moveUp(tikiIdx, 1);
    }
    else if (action == 1) {
        updateStateWithMoveup(2,tikiId, state , player , action);
        state.record[player][state.round] = tikiId;
        if(UI_Mode && player)
            moveUp(tikiIdx, 2);
    }
    else if (action == 2) {
        updateStateWithMoveup(3,tikiId, state , player , action);
        state.record[player][state.round] = tikiId;
        if(UI_Mode && player)
            moveUp(tikiIdx, 3);
    }
    else if (action == 3) {
        updateStateWithPush(tikiId, state , player , action);
        if(UI_Mode && player)
            moveToBottom(tikiIdx);
    }
    else if (action == 4) {
        updateStateWithKill(state , player , action);
        if(UI_Mode && player) {
            console.log('no');
            killLast();
          }
    }
    else {
        console.log('ERROR: invalid "action" passed to updateState(), action:', action);
    }
    var step = new stepRecord(action, tikiId);
    allRecord[player].push(step);

    // Record agent's movement
    

    //console.log('Current Order after update:', state.tikiOrder)
}




function updateStateWithMoveup(moveup , tikiId , targetState , playerID , actionID)
{
    var tmp = tikiId
    var moveTime = 0
    var tikiIndex = getTikiIndex(targetState.tikiOrder, tikiId)
    if (tikiIndex<0) {
        debugger;
    }
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

    var tikiIndex = getTikiIndex(targetState.tikiOrder, tikiId);
    var index = tikiIndex;
    if (tikiIndex<0) {
        debugger;
    }

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
