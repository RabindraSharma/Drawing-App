
$(document).ready(function(){
    getDisplays();
    activeLayout();
});

function getDisplays() {
    $.ajax({
        url: listdisplays,
        "headers":{
            "accept": "application/json",
            "Access-Control-Allow-Origin":"*",
          },
        type: "POST",
        crossDomain: true,
        dataType: "json",
        success: function (response) {
            var originalData = response;
            mapedLayout(originalData);
        },
        error: function (error, sts) {
           
        }
    });
}

function mapedLayout(scope) {
    $('.contentRow').empty();
    $('.mainRow').empty();
    let displayRow='';
    for (var display of scope) {
        var displayId = display.id;
        
        var uniquedisplayId = displayId.replace(/ /g,"-");
        displayRow = "<div class='row mainRow border'>"+
            "<div class='col-md-2 border-right bg-white p-2'>"+
                   "<div class='roundDisplay rounded'>"+displayId+"</div>"+
            "</div>"+
            "<div class='col-md-10 bg-light zonetoggle-"+uniquedisplayId+"' id='zonetoggle-"+uniquedisplayId+"'>"+
            "</div>"+
        "</div>"        
        $('#contentRow').append(displayRow);
        
        for(var zone of display.zones){
        
           for(var cord of zone.zonecoordinates){
                let zonName = cord.name; 
                var zonID = zonName.replace(/ /g, '-');
                var zoneRows = "<div class='row m-1 rounded'>"+
                                    '<div data-role="accordion" data-one-frame="false" data-show-active="true">'+
                                        '<div class="frame">'+
                                            '<div class="heading border-bottom">'+cord.name+'</div>'+
                                                '<div class="content bg-white">'+
                                                    '<div class="row pl-1 pr-1 layout" id="layout'+uniquedisplayId+zonID +'">'+
                                                '</div>' +
                                            '</div>'+
                                        '</div>'+  
                                    '</div>'+
                                '</div>' +
                            "</div>"
                $('#zonetoggle-'+uniquedisplayId).append(zoneRows);
        for(var layout of cord.layouts){
            let lName = layout.name;
            let layoutName ;
            var key = uniquedisplayId+cord.name+lName;
            

            //alert(layoutName);
            if(layout.active){
                layoutName = layout.name;
                
            }
            let rows = layout.rows;
            let cols = layout.columns;
            if(cols == -1 && rows == -1){
                getNoTilesLayout(layout,zonName,displayId,lName);
            }else{
                var map = new Map();
                var references = layout.references;
               
    
                
                var data;
                
                
                for (var reference of references) {
                    var sourcename = reference.source.name;
                    var sourceType = reference.source.type;
                    var applabel = reference.applicationLabel;
                    var location = reference.applicationLabel.location;
                    var size = reference.applicationLabel.size;
                    var x = applabel.rectanglePoint.x;
                    var y = applabel.rectanglePoint.y;
                    
                        data = {
                        'zone': zonName,
                        'applabel': applabel,
                        'location':location,
                        'layoutname':layoutName,
                        'size':size,
                        'id':displayId,
                        'type':sourceType,
                        'sourcename': sourcename,
                        'x': x,
                        'y': y,
                        'rows': rows,
                        'columns': cols
                    };
                    
                    if (zonName) {
                        if (map.has(key)) {
                            map.get(key).push(data);
                        } else {
                            var arr = [data];
                            map.set(key, arr);
                        }
                    }
                }
                
                for(let key of map.keys()){
                    
                    var s = 0;
                    var data = map.get(key);
                    var cID = key.replace(/ /g,'-');
                    
                    var zn = data[0].zone;
                    let layName = data[0].layoutname;
    
            if(typeof layName !=="undefined"){
                var znID = zn.replace(/ /g,'-');
                //console.log(znID)
                var uniquedisplayId = data[0].id.replace(/ /g,"-");
                
                $('#layout'+uniquedisplayId+znID).append(
                    '<div class="activeLayout">' +
                        '<div class="text-justify-content bg-dark rounded text-info border newlayout p-2" id="layout">' + layoutName +    
                        '</div>' +
                        '<div class="row m-1 " id="box'+cID+'" name="'+zn+'">'+'</div>'+
                    '</div>'
                );
    
            for (var i = 0; i < data.length; i++) {
           
            let flexBox ="<div id='wPaint"+zn+data[i].sourcename+"' class=' col-md-4 m-0 col-sm-6 border text-black flexbox' style='width:100vw; height:82vh;'>"+
                                   "<span class='right-text'>"+data[i].sourcename+"</span>"+
                                    "<span id='apply"+zn+data[i].sourcename+"' zone='"+data[i].zone+"' layout='"+data[i].layoutname+"' display='"+data[i].id+"' data='"+JSON.stringify(data[i].applabel.location.x)+','+JSON.stringify(data[i].applabel.location.y)+"' name='"+data[i].sourcename+"' class='fa fa-arrow-right apply btn btn-white border' data='"+JSON.stringify(data)+"'></span>"+
                            "</div>"
                      
                    $('#box'+cID).append(flexBox);
        
                    $('#wPaint'+zn+data[i].sourcename).wPaint({
                        menuOffsetLeft:0,
                        menuOffsetTop:0,
                        menuOrientation:'vertical',
                        onShapeUp: createCallback('onShapeUp')
                                           
                    });
                    let flag = false;
                    let strokColor;
                    let fillColor;
                    let circlesArray = [];
                    let rectArray = [];
                    let ellipseArray = [];
                    var arrayData='';
                    let px,py;
                    let moveX,moveY;
                    let width,height;
                    let mode;
                    let allData='';
                    
                    function createCallback(cbName){
                        return function(e){
                             px = this.canvasTempLeftOriginal;
                             py = this.canvasTempTopOriginal;
                            
                            moveX = this.canvasWidth ;
                            moveY = this.canvasHeight;
                            //console.log('x'+px+' y '+py+' width >'+moveX+' height >'+moveY);
                           
                            var w = this.width;
                            var h = this.height;
                            
                            width = Math.trunc(w);
                            height = Math.trunc(h);
                            mode = this.options.mode;
                            //var text = this.$textInput.val(linesNew.join('\n')).val().split('\n');
                            //console.log(text)
                            strokColor = hexToRgbA(this.options.strokeStyle,px,py);
                            fillColor = hexToRgbABackground(this.options.fillStyle,px,py,moveX,moveY);
                            
                            if(this.options.fillStyle=='#FFFFFF'){
                                flag = false;
                            }else{
                                flag = true;
                            }
                           
                             arrayData = "{"
                                
                            if(mode =='circle'){
                                var circleJson ="{"+'"color"'+":"+'{'+strokColor+','+fillColor+'},"x":"'+px+'","y":"'+py+'","fill":"'+flag+'","radius":"75"}';
                                circlesArray.push(circleJson);
                                var circ = '"circles"'+":["+circlesArray+"],";
                                allData +=circ;
                            }else if(mode =='rectangle'){
                                var rectJson = "{"+'"color"'+":"+'{'+strokColor+','+fillColor+'},"x":"'+px+'","y":"'+py+'","width":"'+moveX+'","height":"'+moveY+'","fill":"'+flag+'"}';
                                rectArray.push(rectJson); 
                                var rect = '"rectangles"'+":["+rectArray+"],";
                                allData +=rect;
                            }else if(mode =='ellipse'){
                                var ellipseJson = "{"+'"color"'+":"+'{'+strokColor+','+fillColor+'}, "x":"'+px+'","y":"'+py+'","width":"'+moveX+'","height":"'+moveY+'","fill":"'+flag+'"}';
                                ellipseArray.push(ellipseJson);
                                var ovals ='"ovals"'+":["+ellipseArray+"],";
                                allData += ovals;
                            }
                           
                        }
                        
                    }  
                    
                    $('#apply'+zn+data[i].sourcename).on('click', function(e){
                         let source = $(this).attr('name');
                         let display = $(this).attr('display');
                         let layout = $(this).attr('layout');
                         let zone = $(this).attr('zone');
                         let location = $(this).attr('data').split(',');
                         let xcord = location[0];
                         let ycord = location[1];
                        getCordinates(arrayData,allData,zone,layout,source,xcord,ycord);
                    });
                    
                 }         
                }
             } 
            }
        }
       }
      }    
    }
}

function getNoTilesLayout(layout,zone,displayId,layoutName){
    //console.log('Notiles '+layout)
        var uniquedisplayId = displayId.replace(/ /g,"-");
        var layoutNs = layout.name;
        var layoutN = layoutNs.replace(/ /g,'-');
        var ntZone = zone.replace(/ /g,'-');

        //console.log(uniquedisplayId+' '+layoutNs+' '+layoutN+' '+ntZone)
        $('#layout'+uniquedisplayId+ntZone).append(
            '<div class="activeLayout">' +
                '<div class="text-justify-content bg-dark rounded text-info border newlayout p-2" id="layout">' + layoutN +    
                '</div>' +
                '<div class="row m-1 " id="box'+uniquedisplayId+layoutN+'" name="'+ntZone+'">'+'</div>'+
            '</div>'
        );

        var map = new Map();
        var references = layout.references;
        var data;       
        var splitComma=',';
        for(let reference of references){
            var sourceType = reference.source;
            var sourceN = sourceType.name;
            var types = sourceType.type;
           
            var rectangle = reference.rectangle;
            var text = rectangle.text;
            var replaceData = text.replace(/[/(/)]/g,',');
            var splitData = replaceData.split(splitComma);
           
            const oXvalue = rectangle.x;
            const oYvalue = rectangle.y;
            const oWvalue = rectangle.width;
            const oHvalue = rectangle.height;

            //console.log(oXvalue+' '+oYvalue+' '+oWvalue+' '+oHvalue)


            let flexBox ="<div id='wPaint"+ntZone+sourceN+"' class=' col-md-4 m-0 col-sm-6 border text-black flexbox' style='width:100vw; height:82vh;'>"+
                 "<span class='right-text'>"+sourceN+"</span>"+
                    "<span id='apply"+ntZone+sourceN+"' zone='"+ntZone+"' layout='"+layoutN+"' display='"+displayId+"' data='"+oXvalue+','+oYvalue+"' name='"+sourceN+"' class='fa fa-arrow-right apply btn btn-white border' data='"+rectangle+"'></span>"+
                 "</div>"

            $('#box'+uniquedisplayId+layoutN).append(flexBox);

            $('#wPaint'+ntZone+sourceN).wPaint({
                menuOffsetLeft:0,
                menuOffsetTop:0,
                menuOrientation:'vertical',
                onShapeUp: createCallback('onShapeUp')
                                   
            });
            let flag = false;
            let strokColor;
            let fillColor;
            let circlesArray = [];
            let rectArray = [];
            let ellipseArray = [];
            var arrayData='';
            let px,py;
            let moveX,moveY;
            let width,height;
            let mode;
            let allData='';
            
            function createCallback(cbName){
                return function(e){
                     px = this.canvasTempLeftOriginal;
                     py = this.canvasTempTopOriginal;
                    
                    moveX = this.canvasWidth ;
                    moveY = this.canvasHeight;
                    console.log('x'+px+' y '+py+' width >'+moveX+' height >'+moveY);
                   
                    var w = this.width;
                    var h = this.height;
                    
                    width = Math.trunc(w);
                    height = Math.trunc(h);
                    mode = this.options.mode;
                    
                    strokColor = hexToRgbA(this.options.strokeStyle,px,py);
                    fillColor = hexToRgbABackground(this.options.fillStyle,px,py,moveX,moveY);
                    
                    if(this.options.fillStyle=='#FFFFFF'){
                        flag = false;
                    }else{
                        flag = true;
                    }
                   
                     arrayData = "{"
                        
                    if(mode =='circle'){
                        var circleJson ="{"+'"color"'+":"+'{'+strokColor+','+fillColor+'},"x":"'+px+'","y":"'+py+'","fill":"'+flag+'","radius":"75"}';
                        circlesArray.push(circleJson);
                        var circ = '"circles"'+":["+circlesArray+"],";
                        allData +=circ;
                    }else if(mode =='rectangle'){
                        var rectJson = "{"+'"color"'+":"+'{'+strokColor+','+fillColor+'},"x":"'+px+'","y":"'+py+'","width":"'+moveX+'","height":"'+moveY+'","fill":"'+flag+'"}';
                        rectArray.push(rectJson); 
                        var rect = '"rectangles"'+":["+rectArray+"],";
                        allData +=rect;
                    }else if(mode =='ellipse'){
                        var ellipseJson = "{"+'"color"'+":"+'{'+strokColor+','+fillColor+'}, "x":"'+px+'","y":"'+py+'","width":"'+moveX+'","height":"'+moveY+'","fill":"'+flag+'"}';
                        ellipseArray.push(ellipseJson);
                        var ovals ='"ovals"'+":["+ellipseArray+"],";
                        allData += ovals;
                    }
                   
                }
                
            }  
            
            $('#apply'+ntZone+sourceN).on('click', function(e){
                 let source = $(this).attr('name');
                 let display = $(this).attr('display');
                 let layout = $(this).attr('layout');
                 let zone = $(this).attr('zone');
                 let location = $(this).attr('data').split(',');
                 let xcord = location[0];
                 let ycord = location[1];
                getCordinates(arrayData,allData,zone,layout,source,xcord,ycord);
            });
        }
    
}

function hexToRgbA(hex,x,y){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        var rgba = 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',255)';
        var rgba1 = rgba.replace(/[rgba(/\ )]/g,'').split(',');
        
        var string1 ='"x1":"'+x+'","y1":"'+y+'","red1":"'+rgba1[0]+'","green1":"'+rgba1[1]+'","blue1":"'+rgba1[2]+'","alpha1":"'+rgba1[3]+'"';
        return string1;
    }
    throw new Error('Bad Hex');
}

function hexToRgbABackground(hex,x,y,w,h){
    var c;
   
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        var rgba = 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',255)';
        var rgba1 = rgba.replace(/[rgba(/\ )]/g,'').split(',');
        
        var string1 ='"x2":"'+(x+w)+'","y2":"'+(y+h)+'","red2":"'+rgba1[0]+'","green2":"'+rgba1[1]+'","blue2":"'+rgba1[2]+'","alpha2":"'+rgba1[3]+'"';
        
        return string1;
    }
    throw new Error('Bad Hex');
}

function apply(dData,alld,source,x,y,w,h){
    dData +=alld+ '"webframetotalwidth":"'+w+'","webframetotalheight":"'+h+'"}';
   // console.log(dData+' '+x+' '+y+' '+w+' '+h)
    $.ajax({
        type:"post",
        url: overlayurl+'source='+source+'&x='+x+'&y='+y+'',
        data:dData,
        success:function(res){
           //console.log(res);
            Fnon.Hint.Success("The drawing has been successfuly created!", {
                callback:function(){
                }
              });
        },
        error:function(e){
            Fnon.Hint.Danger("Oops, something  went wrong!", {
                callback:function(){
                }
              });
        }
    });
}

function activeLayout(){
    $.ajax({
        type:"post",
        url: activelayout,
        processData:false,
        contentType:false,
        cache:false,
        timeout:6000000,
        success:function(res){
        },
        error:function(e){
            Fnon.Hint.Danger("Oops, something  went wrong!", {
                callback:function(){
                }
              });
        }
    });
}

function getCordinates(circles,alldata,zone,layout,source,cordx,cordy){
    $.ajax({
        type:"POST",
        url:'overlay/coordinates?zone='+zone+'&layout='+layout+'&source='+source+'&x='+cordx+'&y='+cordy+'',
        processData:false,
        contentType:false,
        cache:false,
        timeout:6000000,
        success:function(res){
           var newdata = JSON.parse(res);
           const cordX = newdata[0];
           const cordY = newdata[1];
           const cordWidth = newdata[2];
           const cordHeight = newdata[3];
           //console.log('x '+cordx+' y '+cordY+' width '+cordWidth+' height '+cordHeight)
          apply(circles,alldata,source,cordX,cordY,cordWidth,cordHeight);
           
        },
        error:function(e){
            Fnon.Hint.Danger("Oops, something  went wrong!", {
                callback:function(){
                }
              });
        }
    });
}