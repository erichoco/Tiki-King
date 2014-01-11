// Return the randomly-ordered input array o
function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

// Extension for Array object:
// Check the 2 arrays are identical
Array.prototype.compare = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

function copyState( stateToBeCopied,targetState)
{
    stateToBeCopied.Actions = targetState.Actions.slice(0);
    stateToBeCopied.tikiOrder = targetState.tikiOrder.slice(0);
}

function computeSocre(tikiOrder, mission)
{
    var score = 0;
    for( var i = 0 ; i < mission.length ; i++) {
      idx = getTikiIndex(tikiOrder, mission[i]);
      if(idx <= i)
        {
            if (i == 0) score+=9;
            else if (i == 1) score+=5;
            else if (i == 2) score +=2;
        }
    }

    return score;
}

function getTikiIndex(tikiOrder, tikiId) 
{
    var idx = 0;
    for(var i = 0 ; i < tikiOrder.length ; i++)
        if (tikiOrder[i] == tikiId)
            {
                idx = i ;
                return idx;
            }
}