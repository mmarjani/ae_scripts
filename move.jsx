#include repetitive_actions.jsx
characters[0].position=[682, 2601];
characters[1].position=[2709,2312];

function moveToSpeaker(precomp, character){
    focusOn(precomp, character.position, character.comp);
};
    
app.beginUndoGroup('Scene Move');
var pre = precomp;
for ( var i = 0; i <  characters.length; i++ ) { 
    moveToSpeaker(precomp, characters[i]);
    }
app.endUndoGroup();
