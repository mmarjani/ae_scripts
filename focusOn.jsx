#include "C:/Users/epalman/Documents/Adobe Scripts/repetitive_actions.jsxinc"

compName = 'e1s1';
defaultPosition = [1875, 990];
defaultFocusTimes = [0, 31];
characters = [
    {
        name: 'endakenny',
        position: [3843,3314]
     },
     {
        name: 'adviser',
        position: [7167,2142]
     },
]

precompName = 'Pre-Comp';

comp = getComp(compName);
precomp = comp.layer(precompName);

app.beginUndoGroup('Focus On Speakers');
defaultFocus(precomp,  defaultFocusTimes);
for ( i=0; i< characters.length; i++){
    character = characters[i];
    comp = getComp(character.name);
    focusOn(precomp, character.position, comp);
    }
app.endUndoGroup();