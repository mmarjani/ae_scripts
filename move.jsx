#include repetitive_actions.jsxinc

characters[0].position=[968,532];
characters[0].comp = getComp('endakenny');
characters[1].position=[376,680];
characters[1].comp = getComp('adviser');

var scene_comp = getComp(scene_name);
var precomp = scene_comp.layer('Pre-Comp');

function moveToSpeaker(precomp, character){
    focusOn(precomp, character.position, character.comp);
};
    
app.beginUndoGroup('Scene Move');

defaultFocus(precomp, [0], 125);
for ( var i = 0; i <  characters.length; i++ ) { 
    moveToSpeaker(precomp, characters[i]);
    }

app.endUndoGroup();
