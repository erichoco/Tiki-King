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

function copyState(stateToBeCopied, targetState)
{
    for (var i = 0; i < targetState.playersAction.length; i++) {
        stateToBeCopied.playersAction[i] = targetState.playersAction[i].slice(0);
        stateToBeCopied.record[i] = targetState.record[i].slice(0);
    }
    stateToBeCopied.tikiOrder = targetState.tikiOrder.slice(0);
    stateToBeCopied.round = targetState.round;
    // stateToBeCopied = jQuery.extend(true, {}, targetState);
}

function computeScore(tikiOrder, mission)
{
    var score = 0;
    for (var i = 0; i < mission.length; i++) {
        var idx = tikiOrder.indexOf(mission[i]);
        if (-1 === idx) {
            continue;
        }
        else if (idx <= i)
        {
            if (i == 0) score+=9;
            else if (i == 1) score+=5;
            else if (i == 2) score +=2;
        }
    }
    return score;
}

function guessTikiScore(tikiOrder, tiki)
{
    var idx = tikiOrder.indexOf(tiki);
    var score = 0;
    if (idx == 0) score = 9;
    else if (idx == 1) score = 5;
    else if (idx == 2) score = 2;
    return score;
}

function getTikiIndex(tikiOrder, tikiId) 
{
    // console.log(tikiOrder, tikiId, tikiOrder.indexOf(tikiId));
    return tikiOrder.indexOf(tikiId);
    
    // var idx = 0;
    // for(var i = 0 ; i < tikiOrder.length ; i++)
    //     if (tikiOrder[i] == tikiId)
    //         {
    //             idx = i ;
    //             return idx;
    //         }
}

function createTikiOrder() {
    var naiveOrder = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    var randLi1 = shuffle(naiveOrder);

    var trueTikiOrder = [];
    for (var i = 0; i < randLi1.length; i++) {
        var randLi2 = shuffle(randLi1[i]);
        for (var j = 0; j < randLi2.length; j++) {
            trueTikiOrder.push(randLi2[j]);
        }
    }

    return trueTikiOrder;
}

function createPKMissions(agentNum) {
    var missionsLi = [];
    var naiveOrder = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];

    for (var i = 0; i < agentNum; ++i) {
        var singleMission = [];
        var randIdx = shuffle([0, 1, 2]);
        for (var j = 0; j < 3; ++j) {
            singleMission.push(
                naiveOrder[randIdx[j]][Math.floor(Math.random()*3)]
            );
        }

        var dup_flag = false;
        for (var j = 0; j < missionsLi.length; ++j) {
            if (singleMission.compare(missionsLi[j])) {
                dup_flag = true;
                break;
            }
        }
        if (dup_flag) {
            --i;
        } else {
            missionsLi.push(singleMission);
        }
    }

    return missionsLi;
}
