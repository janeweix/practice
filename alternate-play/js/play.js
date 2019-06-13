window.onload = function () {
    var list = document.getElementById('list');
    var prev = document.getElementById('prev');
    var next = document.getElementById('next');
    function animate(offset) {
        /*获取的是style.left，是相对左边获取距离，所以第一张图后style.left都为负值，
        且style.left获取的是字符串，需要用parseInt()取整转化为数字。*/
        var newLeft = parseInt(list.style.left) + offset;
        list.style.left = newLeft + 'px';
        if (newLeft < -3000) {
            list.style.left = -600 + 'px';
        }
        if (newLeft > -600) {
            list.style.left = -3000 + 'px';
        }
    }
    /*需要定位到按钮的样式*/
    var buttons = document.getElementById('buttons').getElementsByTagName('span');
    var index = 1;
    function buttonShow() {
        /*console.log(buttons.length);*/
        /*清除之前的样式*/
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].className === 'on') {
                buttons[i].className = '';
            }
        }
        /*数组从0开始，temp从-1开始*/
        buttons[index - 1].className = 'on';
    }
    /*上一步*/
    prev.onclick = function () {
        index = index - 1;
        if (index < 1) {
            index = 5;
        }
        buttonShow();
        animate(600);
    }
    /*下一步*/
    next.onclick = function () {
        index = index + 1;
        if (index > 5) {
            index = 1;
        }
        buttonShow();
        animate(-600);
    }
    /*自动循环播放*/
    var timer;

    function play() {
        timer = setInterval(function () {
            next.onclick();
        }, 1500)
    }
    play();
    /*鼠标放上（离开）对应轮播暂停（播放）*/
    var container = document.getElementById('container');

    function stop() {
        clearInterval(timer);
    }
    container.onmouseover = stop;
    container.onmouseout = play;
    /*小圆点的点击事件*/
    for (var i = 0; i < buttons.length; i++) {
        /*使用立即函数*/
        (function (i) {
            buttons[i].onclick = function () {
                console.log(i);
                /*偏移量的获取：获取鼠标的小圆点的位置，用this把index绑定到对象buttons[i]上*/
                /*由于index是自定义属性，需要用到getAttribute()这个dom的2级方法，去获取自定义的index属性*/
                var clickIndex = parseInt(this.getAttribute('index'));
                var offset = 600 * (index - clickIndex);
                animate(offset);
                index = clickIndex;
                buttonShow();
            }
        })(i)
    }
}