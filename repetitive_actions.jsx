﻿fps = 24    // frames per second
width=1860
height=1980
pixelAspect = 0.94
            
var iterifyArr = function (arr) {
    var cur = -1;
    arr.next = (function () { return (++cur >= this.length) ? false : this[cur]; });
    arr.prev = (function () { return (--cur < 0) ? false : this[cur]; });
    arr.cur = (function () { return this[cur]; });
    return arr;
};

function deselectLayers(comp){
    var layers = comp.layers;
    if (layers) {
        for ( var i = 1; i < layers.length; i++ ) {
            layers[i].selected = false;
            }
     }
};

function deselectAll(){
    var comps = app.project.items;
    for ( var i = 1; i < comps.length; i++ ) {
        deselectLayers(comps[i]);
    }
};

function getProject(path) {
    app.beginUndoGroup("Get Project");
    if (app.project) {
        writeLn("Closing current project");
        app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);
    }        
    var project_file = new File(path);
    if (project_file.exists){
        writeLn('Attempting to open existing project ' + path);
        project = app.open(project_file);
        if (project){
            writeLn('Project ' + path + ' opened');
            alert(project.file.name);
        }
    }
    else {
        writeLn("Creating new Project");
        project = app.newProject();
    }
    app.endUndoGroup()
    return project;
};


//App.executeCommand not working
 function convertAudioToKeyframes(comp, layerName){
      deselectAll ();
      var layer = comp.layer(layerName);
      layer.selected = true;
      app.executeCommand(app.findMenuCommandId("Convert Audio to Keyframes"));
 };
   
function importAudio(path, convertToKeyframes) {
    writeLn('Attempting to import audio ' + path);
    var io = new ImportOptions(File(path));
    if (io.canImportAs(ImportAsType.FOOTAGE)); {
            app.beginUndoGroup("Import Audio");
            writeLn("Importing as project");
            io.importAs = ImportAsType.FOOTAGE;
            var layer= project.importFile(io);
            writeLn('Audio file imported');
            app.endUndoGroup();
            return layer;
            }
};
        
function importComp(path) {
    writeLn('Attempting to import composition ' + path);
    var io = new ImportOptions(File(path));
    if (io.canImportAs(ImportAsType.PROJECT)); {
            app.beginUndoGroup('Import Existing Composition');
            writeLn("Importing as project");
            io.importAs = ImportAsType.PROJECT;
            var comp = project.importFile(io);
            writeLn('File imported');
            app.endUndoGroup()
            return comp;
            }
 };

function importImage(path, open) {
    writeLn('Attempting to import composition ' + path);
    var io = new ImportOptions(File(path));
    if (io.canImportAs(ImportAsType.COMP_CROPPED_LAYERS)); {
            app.beginUndoGroup("Import .psd file");
            writeLn("Importing with cropped layers");
            io.importAs = ImportAsType.COMP_CROPPED_LAYERS;
            var comp = project.importFile(io);
            writeLn('File imported');
            comp.bgColor = [1,1,1];
            writeLn('Opening composition in viewer');
            if (open) {
                comp.openInViewer();
                }
            app.endUndoGroup()
            return comp;
            }
 };

function openWizardWindow(text, okfunction, args){
        var win = new Window ("palette", text, undefined,{closeButton:true,resizeable:true});
        win.size = [300, 50];
        var buttonsGroup = win.add("group");
        buttonsGroup.alignment = ["fill","bottom"];
        var okButton = buttonsGroup.add("button",undefined,"Next");
        var cancelButton = buttonsGroup.add("button",undefined,"Cancel");        
        okButton.onClick = function() {
                  win.close();
                  if (okfunction){
                    okfunction.apply(this, args);
                  }
            }
        cancelButton.onClick = function() {
                  win.close();
            }
        win.show();  
        win.location = [450, 475];
};
   
function addKeyframe(comp, layerName, category, propertyName, time, value){
    var layer = comp.layer(layerName);
    layer.property(category).property(propertyName).setValueAtTime(time, value);
};

function getComp(compName){
    var numItems = app.project.numItems;
    for (var i = 1; i <= app.project.numItems; i ++){
        if ((app.project.item(i) instanceof CompItem) && (app.project.item(i).name == compName)){
            var comp = app.project.item(i);
            break;
        }
    }
    return comp;
};

function setDuration(comp, duration){
    comp.duration = duration;
    var layers = comp.layers;
    for (var i = 1; i <= layers.length; i++) {
        var layer = layers[i];
        var layerName = layer.name;
        if ((layerName != '[Audio Amplitude]') && (layerName.indexOf('mp3') == -1)){ 
            var time = layer.outPoint;
            var stretch = (duration / time) * 100;
            if (stretch < 99.9 || stretch > 100.1){ 
                layer.locked = false;
                layer.stretch= stretch;
                }
            }
        }   
};

function addKeyframes(comp, layerName, category, propertyName, times, values){
    var layer = comp.layer(layerName);
    layer.property(category).property(propertyName).setValuesAtTimes(times, values);
    /*switch (property) {
        case 'position':
            layer.transform.position.setValuesAtTimes(times, values);
            break;
        case 'scale':
            layer.transform.scale.setValuesAtTimes(times, values);
            break;
        case 'rotation':
            layer.transform.rotation.setValuesAtTimes(times, values);
            break;
        case 'opacity':
            llayer.transform.opacity.setValuesAtTimes(times, values);
            break;
            }*/
};

function getValueAtTime(comp, layerName, category, propertyName, time){
    var layer = comp.layer(layerName);
    var value = layer.property(category).property(propertyName).valueAtTime(time, true);
    /*switch (property) {
        case 'position':
            var value = layer.transform.position.valueAtTime(time, true);
            break;
        case 'scale':
            var value = layer.transform.scale.valueAtTime(time, true);
            break;
        case 'rotation':
            var value = layer.transform.rotation.valueAtTime(time, true);
            break;
        case 'opacity':
            var value = layer.transform.opacity.valueAtTime(time, true);
            break;
     }*/
     return value;
};

function getInitialValue(comp, category, layerName, property){
    var value = getValueAtTime(comp, category, layerName, property, 0);
    return value;
};
        
function setInitialValue(comp, layerName, category, property, value){
    var value = addKeyframe(comp, layerName, category, property, 0, value);
};

function addEffectKeyframes(comp, layerName, effectName, propertyName, times, values){
     var layer = comp.layer(layerName);
    layer.property("Effects").property(effectName)(propertyName).setValuesAtTimes(times, values);
};

function addOffsetKeyframe(comp, layerName, category, property, time, offsetValue){
       var initialValue = getValueAtTime(comp, layerName, category, property, time)
       if (offsetValue.constructor == Array){
            var initial_x = initialValue[0];
            var initial_y = initialValue[1];
            var offset_x = offsetValue[0];
            var offset_y =offsetValue[1];
            var x= initial_x - offset_x;
            var y = initial_y - offset_y;
            var value = [x, y];
            }
        else{
            var value = initalValue + offsetValue;
            }
     addKeyframe(comp, layerName, category, property, time, value);
};    
    
function addOffsetKeyframes(comp, layerName, category, property, cycle, overrideFirstValue, speed, startTime, offsetTimes, offsetValues){
    var values = [];
    if (overrideFirstValue){
        offsetValues[0] = getInitialValue(comp, layerName, category, property);
        }
    var previous_x = 0;
    var previous_y = 0;
    for ( var i = 0; i <  offsetValues.length; i++ ) { 
        if (offsetValues[i].constructor == Array){
            var offset_x = offsetValues[i][0];
            var offset_y = offsetValues[i][1];
            var x= previous_x + offset_x;
            var y = previous_y + offset_y;
            values[i] = [x, y];
            var previous_x = x;
            var previous_y = y;
            }
        else{
            var offset = offsetValues[i];
            var value = previous_x + offset;
            values[i] = value;
            var previous_x = value;
            }
        }
        var times = []
       for ( var i = 0; i <  offsetTimes.length; i++ ) { 
           times[i] = startTime + (speed * offsetTimes[i]);
           }
       addKeyframes(comp, layerName, category, property, times, values);
       if (cycle){
           expression = 'loopOut(type="cycle", numKeyframes=' + times.length + ')';
           addExpression(comp, layerName, category, property, expression)
            }
};
   

function addExpression(comp, layerName, category, propertyName, expression){
    var layer = comp.layer(layerName);
    var value = layer.property('category').property(propertyName).expression = expression;
    /*var layer = comp.layer(layerName)
    switch (property) {
        case 'position':
            layer.transform.position.expression = expression;
            break;
        case 'scale':
            layer.transform.scale.expression = expression;
            break;
        case 'rotation':
            layer.transform.rotation.expression = expression;
            break;
        case 'opacity':
            layer.transform.opacity.expression = expression;
            break;
            }*/
};
    
function setPropertyInterpolationType(layer, category, propertyName, interpolationType){
    var property = layer.property(category).property(propertyName);
    var numKeys = property.numKeys;
    for ( var i =1; i <=  property.numKeys; i++ ) { 
          property.setInterpolationTypeAtKey(i, interpolationType);
        }
};

function setEffectPropertyInterpolationType(layer, effectName, propertyName, interpolationType){
    var property = layer.property("Effects").property(effectName)(propertyName);
    var numKeys = property.numKeys;
    for ( var i =1; i <=  property.numKeys; i++ ) { 
          property.setInterpolationTypeAtKey(i, interpolationType);
        }
};

function newComp(name, duration){
    return app.project.items.addComp(name, width, height, pixelAspect, duration, fps);
};

function newPreComp(comp){
    var layers = comp.layers;
    var layerIndices = [];
    for ( var i = 1; i <  layers.length +1; i++ ) { 
        layerIndices[i-1] = i;
    }
    comp.layers.precompose(layerIndices, 'Pre-Comp', true);
    var precomp = getComp ('Pre-Comp');
    /*precomp.height = ;
    precomp.width = ;*/
    return precomp;
};
    
function focusOn(precomp, position, comp){
    var positions = [];
    var scales = [];
    var times = focusOnSpeakerTimes (comp);
    for ( var i = 0; i <  times.length; i++ ) { 
        positions[i] = position;
        scales[i] = [400,400];
    }
    precomp.transform.position.setValuesAtTimes(times, positions);
    setPropertyInterpolationType(precomp, 'Position', KeyframeInterpolationType.HOLD);
    precomp.transform.scale.setValuesAtTimes(times, scales);
    setPropertyInterpolationType(precomp, 'Scale', KeyframeInterpolationType.HOLD);
};

function defaultFocus(precomp, times){
    var positions = [];
    var scales = [];
    var position = precomp.property('Transform').property('Position').valueAtTime(0, true);
    for ( var i = 0; i <  times.length; i++ ) { 
        positions[i] = position
        scales[i] = [100, 100];
    }
    precomp.transform.position.setValuesAtTimes(times, positions);
    precomp.transform.scale.setValuesAtTimes(times, scales);
};

function focusOnSpeakerTimes(comp){
     var layers = comp.layers;
     var times = [];
     for (var j = 1; j <= layers.length; j++) {
        var layer = layers[j];
        if (layer.name == 'Audio Amplitude') {
            var property = layer.property("Effects").property('Both Channels')('slider');
            var value0 = 0;
            var value1 = 0;
            for (var k = 1; k <= property.numKeys; k++){ 
                var value2 = property.keyValue(k);
                if ((value0 < 1) && (value1 < 1) && (value2 > 2)){
                    var time = property.keyTime(k) - 0.25;
                    times.push(time);
                    }
                var value0 = value1;
                var value1 = value2;
                }
            }
        }
    return times;
};

function walking(comp, speed, startTime){
    addExpression(comp, 'C_Head', 'transform', 'position', '[92, -57]');
    addOffsetKeyframes(comp, 'C_Head', 'transform', 'rotation', true, true, speed, startTime, [0, 0.625, 1.25], [-6.34019, 7.125015, -7.125015]); 
    addOffsetKeyframes(comp, 'C_shoulders', 'transform','position', true, true, speed, startTime, [0, 0.29, 0.625, 0.875, 1.25], [[104,-412], [-27.5352, -12.797], [-21.9171,-12.602], [14.4775, -13.693],[34.9748, 39.092]
]);
    addOffsetKeyframes(comp, 'C_shoulders', 'transform','rotation', true, true, speed, startTime, [0, 1.25], [0, 0]);
    addOffsetKeyframes(comp, 'C_L Foot', 'transform','position', true, true, speed, startTime, [0, 0.1667, 0.375, 0.625, 0.875, 1.25], [[-791.055, -756.909], [-2.664, -167.2], [413.939, -4.182], [298.7254, 219.382], [-174.004, 64.8], [-536, -112.8]]);
    addOffsetKeyframes(comp, 'C_L Foot', 'transform','rotation', true, true, speed, startTime, [0, 0.1667, 0.375, 0.625, 0.875, 1.25], [19.828, 40.8816, -4.6566, -91.388, 30.45289, 24.71011]);
    addOffsetKeyframes(comp, 'C_R Foot', 'transform','position', true, true, speed, startTime, [0, 0.208, 0.375, 0.625, 0.875, 1.0833, 1.25], [[75.8788, -731.151], [-377.3378, 28.666], [-277.465, -89.867], [-81.197, -44.799], [182.401, -119.6], [401.5461, 51.33], [152.0527,174.27]]);   
    addOffsetKeyframes(comp, 'C_R Foot', 'transform','rotation', true, true, speed, startTime, [0, 0.208, 0.375, 0.625, 0.875, 1.0833, 1.25], [-46.3832, 32.8634, 4.91833, 22.37747, 28.9363, -30.4975, -58.598]);
    addOffsetKeyframes(comp, 'C_C_Pelvis', 'transform','position', true, true, speed, startTime, [0, 1.25], [[50, 50], [0,0]]);     
    addOffsetKeyframes(comp, 'C_C_Pelvis', 'transform','rotation', true, true, speed, startTime, [0, 1.25], [0,0]);     
    addOffsetKeyframes(comp, 'C_Pelvis', 'transform','position', true, true, speed, startTime, [0, 0.291667, 0.625, 0.91667, 1.25], [[-302,-1479], [0.543, 8.13], [13.457, -12.13], [-6.529, 13.87], [-7.471, -9.87]]);
    addOffsetKeyframes(comp, 'C_Pelvis', 'transform','rotation', true, true, speed, startTime, [0, 1.25], [0,0]);
    addOffsetKeyframes(comp, 'C_R Hand', 'transform','position', true, true, speed, startTime, [0, 0.41667, 0.625, 0.91667, 1.25], [[-298, 23], [480.664,26], [225.336, -2], [-161.202, 47.2], [-544.798, -71.2]]);   
    addOffsetKeyframes(comp, 'C_R Hand', 'transform','rotation', true, true, speed, startTime, [0, 0.625, 1.25], [0, 22.62, -22.62]);
    addOffsetKeyframes(comp, 'C_L Hand', 'transform','position', true, true, speed, startTime, [0, 0.41667, 0.625, 0.91667, 1.25], [[7.5833, -6.333], [-16.9167,7.5833], [7.5833, -6.3333], [-161.202, 47.2], [-544.798, -71.2]]);   
    addOffsetKeyframes(comp, 'C_L Hand', 'transform','rotation', true, true, speed, startTime, [0, 0.625, 1.25], [-101.73, 107.7775, -107.778]);
};
    
function sitDown(comp, speed, startTime){
    addOffsetKeyframes(comp, 'C_Pelvis', 'transform','position', false, true, speed, startTime, [0, 0.208333], [[-342,-1471],[-268, 144]]); 
};
    
function standUp(comp, speed, startTime){
   addOffsetKeyframes(comp, 'C_Pelvis', 'transform', 'position', false, true, speed, startTime, [0, 0.208333], [[-582,-1119],[240, -352]]); 
};
    
function sittingDown(comp, time){
   addOffsetKeyframe(comp,  'C_Pelvis', 'transform', 'position', 0, [236, -180]);
};
 
 function drinking(comp, speed, startTime){
     addOffsetKeyframes(comp, 'C_R Hand', 'transform', 'position', false, true, speed, startTime, [0, 0.5, 2, 2.5], [[48, -72],[92, -244], [0, 0], [-92, 244]]); 
};
      
function kissing(comp, speed, startTime){
     addOffsetKeyframes(comp,  'C_shoulders', 'transform', 'position', false, true, speed, startTime, [0, 1], [[64, -732],[176, 224]]); 
};
      
function changeMouthOpenShape(comp, shape, times){
    var values = [];
    for ( var i = 0; i <  times.length; i++ ) { 
        values[i] = shape;
        }
        addEffectKeyframes(comp, 'Talking Head Controls', 'Mouth Shape Open', 'Slider', times, values);
};

function lookDown(comp, startTime, endTime, length){
    var layer = comp.layer('Talking Head Controls');
    var currentLookDirection = layer.property("Effects").property('Look Direction')('Point').valueAtTime(startTime, true);
    var newx = currentLookDirection[0] + 5;
    var newy = currentLookDirection[1] + 5;
    var newLookDirection = [newx, newy];
    times = [0, startTime -0.5, startTime, startTime + length, endTime];
    values = [currentLookDirection, currentLookDirection, newLookDirection, newLookDirection, currentLookDirection];
    layer.property("Effects").property('Look Direction')('Point').setValuesAtTimes(times, values);
};

/*app.beginUndoGroup('Scene Setup');

var scene = getComp('Scene 1');
var enda = getComp('endakenny');
var adviser = getComp('adviser');
var enda_head = [682, 2601];
var adviser_head = [2709,2312];

//var precomp = scene.layer('Pre-comp 1');
//sittingDown(enda, 0);
//sittingDown(adviser, 0);
//defaultFocus(precomp, [0.34]);
//focusOn(precomp, enda_head, [3.33,8.5,11.8, 18.9, 25.1, 32.8]);
//focusOn(precomp, adviser_head, [5.5,9.8,17.2, 21, 26.4]);
//lookDown(adviser, 28.5, 30, 1);

//app.endUndoGroup();*/