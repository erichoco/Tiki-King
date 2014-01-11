
function Agent(agentName, agentNumber, mission) {
	this.agentName = agentName;
    this.agentNumber = agentNumber;
    this.mission = mission;
	this.move = move;
	function move() {
		var allNextState = [];
    	var allNextAction = [];
    	var allNextMovingTiki = [];
    	// get legal actions
    	for(var i = 0 ; i < state.comActions.length ; i++) {
        	for(var j = 0 ; j < state.tikiOrder.length ; j++)
        	{
            	var illegal = checkLegalAction(state, state.Actions[i] , state.tikiOrder[j]);
            	if (illegal == 1) 
            	    continue;
            	var nextState = getNextState(state, state.Actions[i] , state.tikiOrder[j]);
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
        	var tmpValue = evaluationFunction(allNextState[i], mission);
        	if(tmpValue > maxValue)
        	{
          		maxValue = tmpValue;
           		maxIndex = i;
        	}
    	}

    	// Call game.js to update state with best action
    	// console.log("AI do operation " , state.comActions[allNextAction[maxIndex]] , " on tiki " , state.tikiOrder[allNextMovingTiki[maxIndex]]);
    	var operation = state.comActions[allNextAction[maxIndex]];
    	tellJudge(agentNumber, allNextMovingTiki[maxIndex], operation);
	}
}


function checkLegalAction(targetState, action, tikiId)
{

    var index = getTikiIndex(targetState.tikiOrder, tikiId);
    var illegal = 0;
    if(action == 0)
    {
        if(index == 0)
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
        if (index >= targetState.tikiOrder.length-1)
            illegal = 1;
    }

    //console.log("In checkLegalAction , The tikiIdx , index , action , illegal " , tikiIdx , index , action , illegal);
    return illegal;

}



function getNextState(currentState, action, tikiId)  
{
	var nextState = new State();
	copyState(currentState, nextState);

    if (action == 0)
        updateStateWithMoveup(1, tikiId, nextState);
    else if (action == 1)
        updateStateWithMoveup(2, tikiId, nextState);
    else if (action == 2)
        updateStateWithMoveup(3, tikiId, nextState); 
    else if (action == 3)
        updateStateWithPush(tikiId, nextState);
    else if (action == 4)
        updateStateWithKill(nextState);

    return nextState;
}

function evaluationFunction(currentState, mission)
{
    var score = computeSocre(currentState.tikiOrder, mission);
    var distance = 0;
    var idx;
    for( var i = 0 ; i < mission.length ; i++) {
        idx = getTikiIndex(currentState.tikiOrder, mission[i]);
        if(idx > i) {
            distance += Math.abs(idx-i);
        }
    }

    return score*10 - distance;
}

