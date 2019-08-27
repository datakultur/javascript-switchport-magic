
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.fill();

var rectsize = 45;
var switchsize = 24;
var skipports = 2;

var rows = []
var allswitches = []


// Execute a function when the user releases a key on the keyboard
var newline = document.getElementById("newline")
var input = document.getElementById("num")
input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        addNewRow(input.value, false, newline.checked)
    }
  });


function howmanyswitches(nx) {
    var places = (nx * 2);
    return Math.ceil(places / (switchsize-skipports));
}

function howmanyperswitch(nx) {
    return Math.round((nx*2) / howmanyswitches(nx));
}

function addNewRow(nx, redraw=false, newline=true) {
    var ny = 0;
    var xbegin = 50;
    if(newline) {
        ny = 50 + (rows.length * 150)
    } else {
        if(rows.length>0) {
            ny = 50 + ((rows.length-1) * 150)
        } else {
            ny = 50;
        }
        //xbegin = 50 + (rows[rows.length-1].length/2+1)*rectsize
        xbegin = rows[rows.length-1][rows[rows.length-1].length-1].x + rectsize*2.5
    }
    createRow(nx, ny, redraw, xbegin)
    var nrows = document.getElementById('n-rows')
    var nplaces = document.getElementById('n-places')
    var nports = document.getElementById('n-ports')
    var nswitches = document.getElementById('n-switches')
    nrows.textContent = rows.length
    nswitches.textContent = countAllChildren(allswitches)
    nplaces.textContent = countAllChildren(rows)
    nports.textContent = countAllChildren(allswitches) * switchsize;
}

function countAllChildren(arr) {
    total = 0;
    for(i=0; i<arr.length; i++) {
        total += arr[i].length;
    }
    return total
}

var outside_switches = []

function createRow(nx, ny, redraw, xbegin) {
    var places = []
    var place = {x: 50, y:50}
    var magicnumber = Math.ceil((nx/howmanyswitches(nx))/2)
    var anothermagicnumber = 0;
    var numsw = 0;
    var portnumber = 1 + skipports;
    var cursw={x: 0, y: 0, text: "A"}
    if(xbegin==50) {
        createRowNumber((xbegin-25), ny, ((rows.length*2)+1))
        createRowNumber((xbegin-25), ny+rectsize, ((rows.length*2)+2))
        var switches = []
    } else {
        var switches = outside_switches;
    }
    

    for(i=0; i<nx; i++) {
        x=(rectsize*i)+xbegin
        // console.log(magicnumber)
        // console.log(anothermagicnumber)
        
        if(i == (magicnumber + anothermagicnumber - 1)) {

            numsw = numsw + 1;
            anothermagicnumber = (Math.ceil(howmanyperswitch(nx)/2)) * numsw;
            cursw = {x: (x+(rectsize/1.5)), y: (ny+(rectsize/1.5)), text: String.fromCharCode(64 + (switches.length+1)), row: ((rows.length*2)+1), switch: ((rows.length*2)+1)+cursw['text']}
            createSwitch(cursw)
            if(!redraw) {
                switches.push(cursw)
            }
        }

        var place = {x: x, y: ny, text: cursw['text']+portnumber, i: (i+1), switch: ((rows.length*2)+1)+cursw['text'], portnumber: portnumber, row: ((rows.length*2)+1), seat: (i+1)}
        // console.log("Portnumber: "+portnumber);

        portnumber++;
        createPlaceNumber(x, ny, (i+1))

        createPlace(place)
        places.push(place)
        var place = {x: x, y: (ny+rectsize), text: cursw['text']+portnumber, i: (i+1), switch: ((rows.length*2)+1)+cursw['text'], portnumber: portnumber, row: ((rows.length*2)+2), seat: (i+1)}
        createPlace(place)
        places.push(place)

        // console.log("Portnumber: "+portnumber)
        if(portnumber == (howmanyperswitch(nx)+skipports) || (portnumber-1) == (howmanyperswitch(nx)+skipports)) {
            var portnumber = 1 + skipports;
            var cursw={x: 0, y: 0, text: String.fromCharCode(64 + (switches.length+1))}
        } else {
            portnumber++;
        }

    }
    if(!redraw) {
        if(xbegin==50) {
            rows.push(places)
        } else {
            rows[rows.length-1] = rows[rows.length-1].concat(places)
        }
    }
    outside_switches = switches
    allswitches.push(switches)
}

function createRowNumber(x, y, n) {
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.fillStyle = 'black';
    ctx.font = '18px Courier';
    ctx.fillText(n, x, y+(rectsize/2)+(18/4))
    ctx.stroke()
}

function createPlaceNumber(x, y, n, dir) {
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.fillStyle = 'black';
    ctx.font = '12px Courier';
    ctx.fillText(n, x+(rectsize/2)-(rectsize/4), y-5)
    ctx.stroke()
}

function createSwitch(sw) {
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.fillStyle = 'black';
    ctx.fillRect(sw['x'], sw['y'], rectsize/1.5, rectsize/1.5);
    ctx.fillStyle = 'white';
    ctx.font = '12px Courier';
    ctx.fillText(sw['text'], (sw['x']+4), (sw['y']+14))
    ctx.stroke();
}

function createPlace(place) {
    ctx.fillStyle = 'black';
    ctx.font = '12px Courier'; 
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = "black";
    ctx.rect(place['x'], place['y'], rectsize, rectsize);
    ctx.fillText(place['text'], (place['x']+(rectsize/2)-(rectsize/4)), (place['y']+28))
    ctx.stroke();
}

function dlImage() {
    var canvas = document.getElementById("canvas");
    var link = document.getElementById('link');
    link.setAttribute('download', 'switchport-generated.png');
    link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
}

function dlJson() {
    var jsondl = []
    jsondl.push(rows);
    jsondl.push(allswitches);
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsondl));
    var dlAnchorElem = document.getElementById('link2');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "generated-rows.json");
}

var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    
    window.addEventListener('load', resize, false);
    window.addEventListener('resize', resize, false); // JQuery: $(window).resize(function() {...});

    /**
     * Scale proportionally: If the width of the canvas > the height, the canvas height
     * equals the height of the browser window. Else, the canvas width equals the width of the browser window.
     * If the window is resized, the size of the canvas changes dynamically.
     */
    function resize() {
        var ratio = canvas.width / canvas.height;
        var canvas_height = window.innerHeight;
        var canvas_width = canvas_height * ratio;
        if(canvas_width>window.innerWidth){
            canvas_width=window.innerWidth;
            canvas_height=canvas_width/ratio;
        }

        canvas.style.width = canvas_width + 'px';
        canvas.style.height = canvas_height + 'px';
    }
