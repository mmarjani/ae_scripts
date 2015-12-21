#include repetitive_actions.jsxinc
#include e1s1.jsxinc

function doMovements(character){
    
    
    };

function importCharacter(character){
        var audio_path = character.audio_path || false;        
        var movements = character.movements || [];
        character.folder = importComp(character.project_path, false);
        var folder_items = character.folder.items; 
        for ( var i = 1; i <  folder_items.length; i++ ) { 
            if (folder_items[i] instanceof CompItem){ 
               character.comp =  folder_items[i];
               }
        }
        if (audio_path){
            var audio_layer = importAudio(character.audio_path);
            character.comp.layers.add(audio_layer);
            character.audio_layer = audio_layer.name;
         }
        setDuration(character.comp, duration);
        if (character.sitting){
            sittingDown(character.comp, 0);
            }
        for ( var i = 0; i <  movements.length; i++ ){
            var movement = movements[i][0];
            var args = character.movements[i][1];
            args.unshift(character.comp);
            movement.apply(this, args);
            }
        return character.comp;
};

function convertAudioWizard(characters){
    var character = characters.next();
    if (character){
        deselectAll();
        character.comp.openInViewer();
        character.comp.layer(character.audio_layer).selected = true;
        win = openWizardWindow('Right-click ' + character.audio_layer + ' and convert audio to keyframes', convertAudioWizard, [characters])
        }
    }

function initial_setup(){
    var project = getProject();
    var comp = newComp(scene_name, duration);
    var backgroundComps = [];
    for ( var i=0;  i < backgroundPaths.length; i++ ){
        var backgroundPath = backgroundPaths[i];
        var backgroundComp = importImage(backgroundPath, false);
        backgroundComps.push(backgroundComp);
        comp.layers.add(backgroundComp);
        setDuration(backgroundComp, duration);
    }
    for ( var i = 0; i <  characters.length; i++ ) { 
        comp.layers.add(importCharacter(characters[i])); 
     }
    if (additionalAudioPath){
        var audioComp = importAudio(additionalAudioPath)
        comp.layers.add(audioComp);
        }
    var precomp = newPreComp(comp);
    iterifyArr(characters);
    convertAudioWizard(characters);
    return precomp
};

app.beginUndoGroup('Scene Setup');
var precomp = initial_setup();
app.endUndoGroup();
