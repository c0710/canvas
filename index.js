/**
 * Created by 98435 on 2017/3/6.
 */
var windowW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var windowH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;
var endTime = new Date();
endTime .setTime(endTime.getTime()+3600*1000);
var currentTimeSeconds = 0;
var balls = [];
var ballColors = ['#f44336','#e91e63','#9c27b0','#673ab7','#009688','#4caf50','#8bc34a','#ff9800','#795548'];


var canvas = document.getElementById('canvas');
if(canvas.getContext){
    var context = canvas.getContext('2d');
    /*设置计时器位于窗口的中央，两边各10%*/
    MARGIN_LEFT = Math.round(windowW/10);
    MARGIN_TOP = Math.round(windowH/5);
    /*小球半径*/
    RADIUS = Math.round(windowW*4/5/108)-1;
    canvas.width = windowW;
    canvas.height = windowH;

    /*获取当前时间距离目标时间的秒数*/
    currentTimeSeconds = getCurrentShowTimeSeconds();
    render(context);
    /*每隔50毫秒渲染一次小球位置*/
    setInterval(function () {
        render(context);
        update();
    },50);
}
/*更新小球位置*/
function update() {
    /*获取此时新的seconds*/
    var nextTimeSeconds = getCurrentShowTimeSeconds();

    /*当前seconds对应的时分秒*/
    var nextHours = parseInt(nextTimeSeconds/3600),
        nextMinutes = parseInt((nextTimeSeconds-nextHours*3600)/60),
        nextSecond = parseInt(nextTimeSeconds%60);
    var curHours = parseInt(currentTimeSeconds/3600),
        curMinutes = parseInt((currentTimeSeconds-curHours*3600)/60),
        curSecond = parseInt(currentTimeSeconds%60);
    /*如果当前秒数发生变化*/
    if(nextSecond != curSecond){

        /*如果hours的十位数发生变化*/
        if(parseInt(nextHours/10) != parseInt(curHours/10)){
            /*在变化的地方添加小球*/
            addBall(MARGIN_LEFT,MARGIN_TOP,parseInt(curHours/10))
        }
        if(parseInt(nextHours%10) != parseInt(curHours%10)){
            addBall(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHours%10))
        }
        if(parseInt(nextMinutes/10) != parseInt(curMinutes/10)){
            addBall(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10))
        }
        if(parseInt(nextMinutes%10) != parseInt(curMinutes%10)){
            addBall(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes%10))
        }
        if(parseInt(nextSecond/10) != parseInt(curSecond/10)){
            addBall(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(curSecond/10))
        }
        if(parseInt(nextSecond%10) != parseInt(curSecond%10)){
            addBall(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(curSecond%10))
        }
        /*将下一次的seconds 赋值给currentTimeSeconeds*/
        currentTimeSeconds = nextTimeSeconds
    }
    /*更新小球的下落位置*/
    updateBalls();
}
/*在数字变化的地方添加小球*/
function addBall(x,y,num) {
    for(var i = 0;i<digit[num].length;i++){
        for(var j= 0;j<digit[num][i].length;j++){
            if(digit[num][i][j] == 1){
                var aBall = {
                    x:x+j*2*(RADIUS+1)+RADIUS+1,
                    y:y+i*2*(RADIUS+1)+RADIUS+1,
                    g:1.5+Math.random(),
                    vx:Math.pow( -1,Math.ceil( Math.random()*1000))*5,
                    vy:-5,
                    color:ballColors[ Math.floor(Math.random() * ballColors.length) ]
                };
                balls.push(aBall);
                console.log(balls.length)
            }
        }
    }
}
/*更新小球的下落位置*/
function updateBalls() {
    for(var i = 0;i<balls.length;i++){
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if(balls[i].y >= windowH - RADIUS){
            balls[i].y = windowH - RADIUS;
            balls[i].vy = -balls[i].vy*0.65;
        }
    }
    var cnt = 0;
    for(var j = 0;j<balls.length;j++){
        if(balls[j].x+RADIUS > 0 && balls[j].x-RADIUS < windowW){
            balls[cnt++] = balls[j];
        }

    }
//            console.log(balls.length);
    while (balls.length>/*Math.min(300,cnt)*/cnt){
        balls.pop()
    }
}
/*获取当前时间距离目标时间的秒数*/
function getCurrentShowTimeSeconds() {
    var currentTime = new Date().getTime();
    var ret = endTime - currentTime;
    ret = Math.round(ret/1000);
    return ret>0?ret:0
}
function render(cxt) {
    /*清理画布*/
    cxt.clearRect(0,0,windowW,windowH);
    /*获取当前时间秒数对应的时分秒*/
    var hours = parseInt(currentTimeSeconds/3600),
        minutes = parseInt((currentTimeSeconds-hours*3600)/60),
        second = parseInt(currentTimeSeconds%60);

    /*渲染指定位置的指定数字*/
    renderDigit( MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),cxt);
    renderDigit( MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),cxt);
    renderDigit( MARGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,cxt);
    renderDigit( MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),cxt);
    renderDigit( MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),cxt);
    renderDigit( MARGIN_LEFT+69*(RADIUS+1),MARGIN_TOP,10,cxt);
    renderDigit( MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(second/10),cxt);
    renderDigit( MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(second%10),cxt);
    /*渲染下落的小球*/
    for(var i = 0 ;i < balls.length;i++){
        cxt.fillStyle = balls[i].color;
        cxt.beginPath();
        cxt.arc( balls[i].x,balls[i].y,RADIUS,0,2*Math.PI );
        cxt.closePath();
        cxt.fill();
    }

}
function renderDigit(x, y, num, cxt) {
    cxt.fillStyle = 'red';
    for(var i=0;i<digit[num].length;i++){
        for(var j = 0;j<digit[num][i].length;j++){
            if(digit[num][i][j] == 1){
                cxt.beginPath();
                cxt.arc(x+j*2*(RADIUS+1)+RADIUS+1,y+i*2*(RADIUS+1)+RADIUS+1,RADIUS,0,2*Math.PI);
                cxt.closePath();
                cxt.fill();
            }
        }

    }
}

