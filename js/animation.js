var animStage; // reference "stage" variable in main.js
var animTikis; // reference to "tikis" variable in main.js
var animanimTikiWidth, animTikiHeight;
//var humanAnim = false;

/*
 * Handle animation for moving Tiki up k position
 * tikiIdx: index of Tiki moving (should > 0)
 * k: # of position moving up
 */
function moveUp(targetIdx, k) {
    //console.log(animTikis);
    var upper, lower;

    upper = animTikis.slice(targetIdx - k, targetIdx);
    lower = animTikis[targetIdx];

    animTikis[targetIdx - k] = lower;
    for (var i = 0; i < upper.length; ++i) {
        animTikis[targetIdx - k + 1 + i] = upper[i];
    }
    //animTikis[targetIdx] = upper;
    //console.log(upper);
    //console.log(lower);
    var upperX = upper[0].x, upperY = upper[0].y;
    var lowerX = lower.x, lowerY = lower.y;
    var animStep = 0;

    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setInterval(60);
    createjs.Ticker.setFPS(60);

    function tick(event) {
        if (animStep === 0) {
            if (lowerX - lower.x > animTikiWidth + 1) {
                animStep = 1;
            } 
            else {
                //upper.x = upper.x + animTikiWidth / 5;
                lower.x = lower.x - animTikiWidth / 5;
            }
        }
        if (animStep === 1) {
            if (lower.y <= upperY) {
                lower.y = upperY;
                for (var i = 0; i < upper.length; ++i) {
                    upper[i].y = upperY + (lowerY - upperY) / k * (i + 1);
                }
                //upper.y = lowerY;
                animStep = 2;
            }
            else {
                for (var i = 0; i < upper.length; ++i) {
                    upper[i].y = upper[i].y + (lowerY - upperY) / 10 / k;
                }
                //upper.y = upper.y + (lowerY - upperY) / 10;
                lower.y = lower.y - (lowerY - upperY) / 10;
            }
        }
        if (animStep === 2) {
            if (lower.x >= upperX) {
                lower.x = upperX;
                //upper.x = lowerX;
                animStep = 3;
            }
            else {
                //upper.x = upper.x - animTikiWidth / 5;
                lower.x = lower.x + animTikiWidth / 5;
            }
        }
        if (animStep === 3) {
            createjs.Ticker.removeEventListener('tick', tick);
            /*if (humanAnim) {
                humanAnim = false;
                updateState(k - 1, targetIdx, 1);
            }*/
        }

        animStage.update(event);
    }

    return animTikis;
}

function moveToBottom(targetIdx) {
    if (animTikis.length === targetIdx + 1) {
        return;
    }

    var upper, lower;

    upper = animTikis[targetIdx];
    lower = animTikis.slice(targetIdx + 1);

    animTikis[animTikis.length-1] = upper;
    for (var i = 0; i < lower.length; ++i) {
        animTikis[targetIdx + i] = lower[i];
    }

    var upperX = upper.x, upperY = upper.y;
    var lowerX = lower[lower.length-1].x, lowerY = lower[lower.length-1].y;
    var animStep = 0;

    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setInterval(60);
    createjs.Ticker.setFPS(60);

    function tick(event) {
        if (animStep === 0) {
            if (upper.x - upperX > animTikiWidth + 1) {
                animStep = 1;
            } 
            else {
                upper.x = upper.x + animTikiWidth / 5;
            }
        }
        if (animStep === 1) {
            if (upper.y >= lowerY) {
                upper.y = lowerY;
                for (var i = 0; i < lower.length; ++i) {
                    lower[i].y = upperY + (lowerY - upperY) / lower.length * i;
                }
                //upper.y = lowerY;
                animStep = 2;
            }
            else {
                for (var i = 0; i < lower.length; ++i) {
                    lower[i].y = lower[i].y - (lowerY - upperY) / 10 / lower.length;
                }
                upper.y = upper.y + (lowerY - upperY) / 10;
            }
        }
        if (animStep === 2) {
            if (upper.x <= upperX) {
                upper.x = upperX;
                animStep = 3;
            }
            else {
                upper.x = upper.x - animTikiWidth / 5;
            }
        }
        if (animStep === 3) {
            createjs.Ticker.removeEventListener('tick', tick);
        }

        animStage.update(event);
    }
}

function killLast() {
    
    animStage.removeChild(animTikis[animTikis.length-1]);
    animStage.update();
    animTikis.pop();
}