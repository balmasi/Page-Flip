function distance(x1,x2,y1,y2){
    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}


$(document).ready( function(){
document.body.style.cursor = 'none';
getEl =function(id){return document.getElementById(id);};
c = getEl("myCanvas");
cWidth=320;c.style.width=cWidth+"px";
cHeight=240;c.style.height=cHeight+"px";
circRadius = 10;

//===========================
var mouse;
spine = { x:cWidth/2,y:0};
sb = { x:spine.x,y:cHeight};
sm = { x:spine.x,y:cHeight/2};
st = { x:spine.x, y:0};
f = { x: 0, y: 0};
mc= { x: 0, y: 0};
active = false;
msRefresh = 10;
speed = 6; // 1-10
speed = speed < 1 ? 1 : speed > 10 ? 10 : speed;
//======draw some stuff============
//spine:
var spineLine = getEl("spine");
spineLine.style.height= cHeight+"px";
spineLine.style.left=spine.x+"px";
spineLine.style.top=spine.y+"px";
//spineBot:
var spineBot = getEl("spineBot");
spineBot.style.left = sb.x-circRadius+"px";
spineBot.style.top = sb.y-2*circRadius+"px";
var spineMid = getEl("spineMid");
spineMid.style.left = sm.x-circRadius+"px";
spineMid.style.top = sm.y-circRadius+"px";
var spineTop = getEl("spineTop");
spineTop.style.left = st.x-circRadius+"px";
spineTop.style.top = st.y+"px";


//===================================
});
mAbsPos = function(e) {
    //raw Mouse (mouse)
    var xLim = cWidth + c.offsetLeft,yLim = cHeight + c.offsetTop;
    var m = { x: e.pageX - c.offsetLeft, y: e.pageY - c.offsetTop};
   // m.x = m.x < 0 ? 0 : m.x; m.y = m.y < 0 ? 0 : m.y;
   // m.x = m.x > xLim ? xLim : m.x; m.y = m.y > yLim ? yLim : m.y;
    mouse = m;
    //debug
    getEl("mx").value=m.x;
    getEl("my").value=m.y;

};

drawTrail = function() {
    //============follower Logic {  
    active = true;
    dx = Math.round(mouse.x - f.x);
    dy = Math.round(mouse.y - f.y);
    if (dx !== 0 || dy !== 0) {
        f.x += dx * 0.1 * speed / 4;
        f.y += dy * 0.1 * speed / 4;
    }
    

    
    //} ===========follower Logic
    
    //=============Constrained1 logic{
    var botRadius = cWidth/2;
    var sb2f = { dx: f.x-spine.x, dy: sb.y-f.y}; 
    var st2f = { dx: f.x-spine.x, dy: -f.y };

    var ab2f = Math.atan2(sb2f.dy,sb2f.dx);
    var at2f = Math.atan2(-st2f.dy,st2f.dx);
    
    var pageDiag = distance(0,cWidth/2,0,cHeight);
    
    var rst1 = { x:
                 spine.x+Math.cos(ab2f)*botRadius,   y: sb.y-Math.sin(ab2f)*botRadius };
    var rst2 = { x:spine.x+Math.cos(at2f)*pageDiag ,   y: Math.sin(at2f)*pageDiag};
    
    var db2f =  distance(f.x,spine.x,sb.y,f.y);
    
    var dt2f = distance(st2f.dx,0,0,st2f.dy);
    var db2rst2= distance(sb.y,rst2.y,sb.x,rst2.x);
        
    var corner= (db2f < botRadius) ? { x:f.x,y:f.y} : {x:rst1.x,y:rst1.y};
    if (dt2f>pageDiag) {corner.x = rst2.x;corner.y=rst2.y;}

    var bisect = {x:cWidth-(cWidth-corner.x)/2,y:cHeight-(cHeight-corner.y)/2};
    var dc2bi= distance(cWidth,bisect.x,cHeight,bisect.y);
    var anglec2bi = Math.atan2(-bisect.y+cHeight,-bisect.x+cWidth);
    var bisTan = bisect.x - Math.tan(anglec2bi)*((cHeight)-bisect.y);
    var fold = { x: bisTan<cWidth/2?cWidth/2:bisTan,y:cHeight};
    var anglef2corner = Math.atan2(fold.y-corner.y,fold.x-corner.x)*180/Math.PI;
    
     var msk= document.getElementById("mask");
    msk.style.height=cHeight+2*(pageDiag-cHeight)+"px";
    msk.style.width=cWidth/2+"px";
    
    var anglemask= 90 - Math.atan2(cHeight-bisect.y,
                                   (bisect.x-fold.x)<0? 0 :bisect.x-fold.x) 
        *180/ Math.PI;if (anglemask >90) {anglemask -=180;}
    var anglemaskrad = anglemask*Math.PI/180;
    var mskLeft =fold.x-cWidth/2;
    msk.style.webkitTransform="translateX("+(mskLeft)+"px)";
    msk.style.webkitTransformOrigin = "right "+cHeight+"px";
    msk.style.webkitTransform +=" rotate("+anglemask+"deg)";
    
    var pg= document.getElementById("page");
    var pwidth = cWidth/2;
    pg.style.height=cHeight+"px";
    pg.style.width=cWidth/2+"px";
    
    //pg.style.webkitTransform = "rotate(" + anglef2corner + "deg)";
    pg.style.webkitTransformOrigin = "0% 100%";
pg.style.webkitTransform = " rotate("+(-anglemask+anglef2corner)+"deg)";
    //render:
    pg.style.webkitTransform += " translateY("+(Math.sin(anglemaskrad)*pwidth-(cHeight-corner.y))+"px)";
    pg.style.webkitTransform += " translateX("+((Math.cos(anglemaskrad)*pwidth)-fold.x+corner.x)+"px)";

    
    var constFollow1= getEl("circConst");
    var constFollow2= getEl("circConst2");
    var corn = getEl("corner");
    var follower = getEl("follow");
    var bis = getEl("bisect");
    var foldLoc = getEl("fld");
    
    constFollow1.style.left = rst1.x-circRadius+"px";
    constFollow1.style.top = rst1.y-circRadius+"px";
    constFollow2.style.left = rst2.x-circRadius+"px";
    constFollow2.style.top = rst2.y-circRadius+"px";
    corn.style.left = corner.x-circRadius+"px";
    corn.style.top = corner.y-circRadius+"px";
    foldLoc.style.left = fold.x-circRadius+"px";
    foldLoc.style.top = fold.y-circRadius+"px";

    follower.style.left = f.x-circRadius+"px";
    follower.style.top = f.y-circRadius+"px";
    
    bis.style.left= bisect.x-circRadius+"px";
    bis.style.top= bisect.y-circRadius+"px";

    setTimeout(function() {drawTrail();}, msRefresh);
    
    //debug

    getEl("constX").value=Math.round(rst1.x);
    getEl("constY").value=Math.round(rst1.y);
    getEl("const2X").value=Math.round(rst2.x);
    getEl("const2Y").value=Math.round(rst2.y); 
    getEl("bisX").value=Math.round(bisect.x);
    getEl("bisY").value=Math.round(bisect.y);
    getEl("foldX").value=Math.round(fold.x);
    getEl("foldY").value=Math.round(fold.y);  
    getEl("deltaX").value=bisect.x-fold.x;
    getEl("deltaY").value=cHeight-bisect.y;  
    getEl("angle").value=anglemask;  
    
};

moveHandle = function(e) {
    mAbsPos(e);
    if (!active) {
        drawTrail();
    }
};
window.addEventListener("mousemove", moveHandle, false);

