/*Each Round of Game implement in here */
/*Each round of game exists a judge to handle the game*/


//player1 -> player ; player2 -> AI
var state = new State();
var player1Score = null;
var player2Score = null;

// This is the 'class' of State
function State() {
    // Old Actions and Missions
    this.comActions = [0, 0, 1, 2, 3, 4, 4]; // actions of computer player remained
    this.humActions = [0, 0, 1, 2, 3, 4, 4]; // actions of human player remained
    this.comMission = [1, 3, 4]; // the AI's mission
    this.humMission = [0, 1, 2];

    // New Actions and Missions
    this.Actions = new Array();
    this.Missions = new Array();
    for (var i=0; i<2; i++) { // Default two players!!!
        this.Actions[i] = [0, 0, 1, 2, 3, 4, 4];
        this.Missions[i] = [0, 3, 6];
    }

    this.tikiOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.init = function() {
        // Old Actions
        this.comActions = [0, 0, 1, 2, 3, 4, 4];
        this.humActions = [0, 0, 1, 2, 3, 4, 4];

        // New Actions
        for (var i=0; i<2; i++) { // Default two players!!!
            this.Actions[i] = [0, 0, 1, 2, 3, 4, 4];
        }

        // TODO: move createMission in main.js to here
    }
}


/*
 * Reset the game , prepare for the new game
 */
function resetGame()
{
   console.log("This is reset function!");
   state = new State();
   player1Score = null;
   player2Score = null;

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
        computeResult( player1Score , player2Score);
    }
}

/*
 * called by 
 * return scores
 */
function askJudge()
{
    console.log("This is askJudge function")

    if(player1Score == null || player2Score == null) {
        return null;
    }
    else {
        return [player1Score, player2Score];
    }
}



/***** Helper Functions *****/


/*
 * input is 2 scores
 * one is Computer Score , one is Human
 */
function computeResult( winner  , comScore) {
     comScore = computeAISocre(state), humScore = computeHumSocre(state);
     winner = (comScore > humScore)? 'Computer' : 'You';
    alert('Your score: ' + humScore +
          '\nComputer\'s score: ' + comScore +
          '\n' + winner + ' Wins');
}

// The following functions are related to update state
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


