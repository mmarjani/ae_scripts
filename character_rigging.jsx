#include "C:/Users/epalman/Documents/Adobe Scripts/Duik_api.jsxinc"
#include "C:/Users/epalman/Documents/Adobe Scripts/repetitive_actions.jsx"

var characterPath = "C:/Users/epalman/Documents/cartoon/characters/adviser/full.psd";
var projectPath = "C:/Users/epalman/Documents/cartoon/characters/adviser/comp.aep";

function renameBones(comp, pinGroup, layer, pinGroups, layerNames){
         layer.selected = false;
         var pins = getPins(layer);
         for ( var i = 0; i <  pinGroup.length; i++ ) { 
                var boneName = 'B_Puppet Pin ' + (i + 1).toString();
                var newName = pinGroup[i];
                writeLn('Renaming  ' + boneName + ' to ' +  newName);            
                var bone = comp.layer(boneName);
                writeLn('Layer is ' + bone.name);
                for ( var j =0; pins.length; j++){
                    var pinName = 'Puppet Pin ' + (i+1).toString();
                    writeLn('Checking pin ' + pinName);
                    if (pins[j].name == pinName){
                        writeLn('Using pin ' + pinName);
                        pin = pins[j]
                        var current_expression = pin.position.expression;
                        var re = new RegExp(boneName,"g");
                        writeLn('Current expression is ' + current_expression);
                        pin.position.expression = current_expression.replace(re, newName);
                        writeLn('New expression is ' + pin.position.expression);
                        break;
                        }
                   }
               bone.name = newName;    
               pin.position.expression = current_expression.replace(re, newName);
               bone.selected = false;
            }
        createPuppetPins(comp, pinGroups, layerNames)  
    }
    
function boneDialog(comp, pinGroup, layer, pinGroups, layerNames){
         writeLn('Creating bones for layer ' + layer.name);
         var pins = getPins(layer);
         for ( var i = 0; i <  pins.length; i++ ) { 
             pins[i].selected=false;
             }
        layer.selected = true;
        doBone();
        renameBones(comp, pinGroup, layer, pinGroups, layerNames)
    }

function createPuppetPinDialogs(comp, pinGroup, layer, pinGroups, layerNames) {
    var bodyPart = pinGroup.next();
    if (bodyPart) {        
        openWizardWindow('Create puppet pin for ' + bodyPart + ' on layer ' + layer.name, createPuppetPinDialogs, [comp, pinGroup, layer, pinGroups, layerNames]);      
        }
    else{
        boneDialog(comp, pinGroup, layer, pinGroups, layerNames)
        }
}    
    
function createPuppetPins(comp, pinGroups, layerNames){
        var layerName = layerNames.next()
        var pinGroup = pinGroups.next()
        iterifyArr(pinGroup)
        if (layerName) {
            writeLn('Creating puppet pins for layer ' + layerName);
            var layer = comp.layer(layerName);
            layer.selected = true;  
            createPuppetPinDialogs(comp, pinGroup, layer, pinGroups, layerNames);
            }
        else{
            setLayerParents(comp)
            }
 }    

function createAllPuppetPins(comp){
        writeLn("Creating Puppet Pins");
        var bodyPins=["Pelvis", "Neck"];
        var rightArmPins = ["R Arm", "R Forearm", "R Hand"];
        var leftArmPins = ["L Arm", "L Forearm", "L Hand"];
        var rightLegPins = ["R Thigh", "R Calf", "R Foot"];
        var leftLegPins = ["L Thigh", "L Calf", "L Foot"];
    
        var pinGroups = [bodyPins, rightArmPins, leftArmPins, rightLegPins, leftLegPins];
        var layerNames = ['Body', 'Right Arm', 'Left Arm', 'Right Leg', 'Left Leg'];
     
        iterifyArr(pinGroups);
        iterifyArr(layerNames);

        createPuppetPins(comp, pinGroups, layerNames);
}
    

function setLayerParent(comp, layerName, parentName){
    writeLn("Parenting " + layerName + " to " + parentName);
    var layer = comp.layer(layerName);
    var parent = comp.layer(parentName);
    layer.parent = parent;
    writeLn(layerName + ' parented to ' + parentName);
    }

function setLayerParents(comp){
    var headLayers=["Mouth Open", "Mouth Closed", "Mouth Round", "Eyebrow Right", "Eyebrow Left", "Eye Left", "Eye Right", "Jaw", "Face"]
     for ( var i = 0; i < headLayers.length; i++ ) { 
         setLayerParent(comp, headLayers[i], "Head")
    }
    setLayerParent(comp, "Pupil Right", "Eye Right");
    setLayerParent(comp, "Pupil Left", "Eye Left");
    openWizardWindow ('Now run the Duik Auto-Rig command', talkingHead, [comp])
}

function setTalkingHeadLayer(comp, headLayers){
        layers = comp.selectedLayers;
        for ( var i = 0; i < layers.length; i++ ) {
            layers[i].selected = false;
            }
        var layerName = headLayers.next();
        if (layerName){
            var layer = comp.layer(layerName);
            layer.selected = true;
            openWizardWindow ('Press the ' + layerName + ' button on Talking Head', setTalkingHeadLayer, [comp, headLayers])    
            }
        /*else{
            var mouthLayers=["Mouth Open", "Mouth Closed", "Mouth Round"];
            for ( var i = 0; i < mouthLayers.length; i++ ) { 
                var layerName = mouthLayers[i];
                var layer = comp.layer(layerName);
                layer.selected = true;
                }
            openWizardWindow('Press the Mouth button on Talking Head');
    }        */
    }

function talkingHead(comp){
    var headLayers=["Eyebrow Left", "Eyebrow Right", "Pupil Left", "Pupil Right", "Eye Left", "Eye Right", "Jaw", "Face"];
    iterifyArr(headLayers);
    setTalkingHeadLayer(comp, headLayers);
    }

app.beginUndoGroup('Character Rigging');
var project = getProject(projectPath);
var characterComp = importImage(characterPath, true);
createAllPuppetPins(characterComp);
comp = app.project.activeItem;
talkingHead(comp);
app.endUndoGroup();
