#include repetitive_actions.jsxinc

var compName = "endakenny";
var movements = [
                        
                        [standUp, [1, 31]],
                    ]
                    
var comp = getComp(compName);

app.beginUndoGroup('Add movements');
for (i = 0; i < movements.length; i++){
        movement = movements[i][0];
        args = movements[i][1];
        args.unshift(comp);
        movement.apply(this, args);
    }
app.endUndoGroup();