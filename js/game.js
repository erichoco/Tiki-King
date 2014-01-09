/*Each Round of Game implement in here */
/*Each round of game exists a judge to handle the game*/

var state = new State();

// This is the 'class' of State
function State() {
    this.comActions = [0, 0, 1, 2, 3, 4, 4]; // actions of computer player remained
    this.humActions = [0, 0, 1, 2, 3, 4, 4]; // actions of human player remained
    this.comMission = [1, 3, 4]; // the AI's mission
    this.humMission = [0, 1, 2];
    this.tikiOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.init = function() {
        this.comActions = [0, 0, 1, 2, 3, 4, 4];
        this.humActions = [0, 0, 1, 2, 3, 4, 4];
        // TODO: move createMission in main.js to here
    }
}


/*
 * reset the game , prepare for the new game
 */
function reset()
{
   Console.log("This is reset function!")

}


function copyState( stateToBeCopied,targetState)
{
    stateToBeCopied.comActions = targetState.comActions.slice(0);
    stateToBeCopied.humActions = targetState.humActions.slice(0);
    stateToBeCopied.tikiOrder = targetState.tikiOrder.slice(0);
    stateToBeCopied.comMission = targetState.comMission.slice(0);
    stateToBeCopied.humMission = targetState.humMission.slice(0);
}
