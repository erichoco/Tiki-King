/* Implement AI here */

//class state
// remaining action , Tiki Order , 

//var target


//getAIAction(action) // for main.js to call
//miniMax()
//evaluation function()
//updateState(action) // for main.js to call

var state = new State();


$(document).ready(function() {

        console.log("Test it");
        test();
        console.log("change color");

});

function test() {
    console.log("test function");
}


// This is the 'class' of State
function State() {
    this.myActions = [0, 0, 1, 2, 3, 4, 4]; // actions remained
    this.opActions = [0, 0, 1, 2, 3, 4, 4]; // actions of opponent remained
    this.tikiOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
}

/*
 * Update state object.
 *
 * action: index of new action (card used)
 * tikiIdx: tiki index on which the action applied
 * player: play who conducts the action (0: AI, 1: human player)
 */
function updateState(action, tikiIdx, player) {
    console.log('Hey, I receive action', action, 'on Tiki #' + tikiIdx);

    // Adjust tiki order here

    if (0 === player) {
        var idx = state.myActions.indexOf(action);
        state.myActions.splice(idx, 1);
    }
    else if (1 === player) {
        var idx = state.opActions.indexOf(action);
        state.opActions.splice(idx, 1);
    }
    else {
        console.log('ERROR: invalid "player" passed to updateState()')
    }

    console.log('Updated State:', state);
}