
function Agent(agentName, agentNumber) {
	this.agentName = agentName;
    this.agentNumber = agentNumber;
	this.move = move;
	function move() {
		"""
		TODO: Change state
		"""
		var allNextState = [];
    	var allNextAction = [];
    	var allNextMovingTiki = [];
    	// get legal actions
    	for(var i = 0 ; i < state.comActions.length ; i++) {
        	for(var j = 0 ; j < state.tikiOrder.length ; j++)
        	{
            	var illegal = checkLegalAction(state.comActions[i] , state.tikiOrder[j] , state);
            	if (illegal == 1) 
            	    continue;

            	var nextState = getNextState(state.comActions[i] , state.tikiOrder[j] , state);
            	allNextState.push(nextState);
            	allNextAction.push(i);
            	allNextMovingTiki.push(j);
        
            	//console.log("The nextState oeder is " , nextState.tikiOrder)
        	}
    	}

    	// Find best action
    	var maxIndex = 0;
    	var maxValue = -100000;
    	for(var i = 0 ; i < allNextState.length ; i++)
    	{
        	var tmpValue = evaluationFunction(allNextState[i]);
        	if(tmpValue > maxValue)
        	{
          		maxValue = tmpValue;
           		maxIndex = i;
        	}
    	}

    	// Update state with best action
    	console.log("AI do operation " , state.comActions[allNextAction[maxIndex]] , " on tiki " , state.tikiOrder[allNextMovingTiki[maxIndex]]);
    	var operation = state.comActions[allNextAction[maxIndex]];
    	updateState(operation, allNextMovingTiki[maxIndex], 0);

    	// For debugging
    	var AIscore = computeAISocre(state);
    	console.log("AI now scores ", AIscore);
	}

	

}


function checkLegalAction(action , tikiId , targetState)
{

    index = getTikiIndex(tikiId, targetState);

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

    //console.log("In checkLegalAction , The tikiIdx , index , action , illegal " , tikiIdx , index , action , illegal)

    return illegal;

}

function getTikiIndex(tikiId , targetState)
{
    var idx = 0;
    for(var i = 0 ; i < targetState.tikiOrder.length ; i++)
        if (targetState.tikiOrder[i] == tikiId)
            {
            	idx = i ;
            	return idx;
            }

     //console.log('The tiki you try to find is not in tikiOrder , which may be killed...')
     //console.log('Tiki Order is ' , targetState.tikiOrder)
     //console.log('The tikiOrder ', tikiIdx , ' , which is not in tikiOrder!')
}

function getNextState(action , tikiId , currentState)  
{
	var nextState = new State();
	copyState(currentState, nextState);

    if (action == 0)
        updateStateWithMoveup(1,tikiId , nextState);
    else if (action == 1)
        updateStateWithMoveup(2,tikiId, nextState);
    else if (action == 2)
        updateStateWithMoveup(3,tikiId, nextState); 
    else if (action == 3)
        updateStateWithPush(tikiId, nextState);
    else if (action == 4)
        updateStateWithKill(nextState);

    return nextState;
}




