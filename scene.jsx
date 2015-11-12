#include repetitive_actions.jsx
#include s1e1.jsx

function importCharacter(character){;  
            character.folder = importComp(character.project_path, false);
            var folder_items = character.folder.items; 
            for ( var i = 1; i <  folder_items.length; i++ ) { 
                if (folder_items[i] instanceof CompItem){ 
                   character.comp =  folder_items[i];
                   }
            }
            var audio_layer = importAudio(character.audio_path);
            character.comp.layers.add(audio_layer);
            character.audio_layer = audio_layer.name;
            setDuration(character.comp, duration);
            if (character.sitting){
                sittingDown(character.comp, 0);
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
    var backgroundComp = importImage(backgroundPath, false);
    comp.layers.add(backgroundComp);
    setDuration(backgroundComp, duration);
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
