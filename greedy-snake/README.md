# 1. 游戏思路分析

* 把整个小游戏看作一个对象，该对象中有食物、蛇、地图。

# 2. 画地图

* 蛇和食物都相对于地图脱离文档流，所以map中有position:relative;

# 3. 创建食物和删除食物

* 当蛇吃到食物时，先把原先的食物删掉，再重新创建一个食物。--> 在食物初始化的过程中，先删掉食物，再重新创建。

* 两种自调用函数，这里用第二种。

```
/ 小括号1与小括号2并列，把函数放在小括号1中
(function () {

})();
// 小括号1包含小括号2，函数与小括号2一起放在小括号1中
(function () {

}());
```

* 把构造函数暴露给window，自调用函数外部就可以使用这个构造函数来创建对象。

* 方法都是有对象调用的，不要忘了每个方法前都要有对象点。

## 3.1 步骤

1. 食物的构造函数。食物就是一个对象，有宽、高、颜色、横纵坐标；先定义构造函数，再创建对象。构造函数中有一系列属性。

2. 食物的初始化方法init()。食物可以在地图的任意位置显示，这是一个行为，写在构造函数的原型对象中。

    1）首先要使食物出现，创建一个div，设置它的样式（width,x,color,position等），并把它追加到map中。在自调用函数的全局中创建一个数组，用来保存每个食物。最后将食物div加到数组中。

    2）因为食物在地图上显示，所以需要用到地图，即需要传递map这个参数 --> 利用地图的宽和高来计算每行或每列可以放N个食物，随机数的范围就是[0,N)，取不到N，（随机数*食物的宽）就是食物出现的横坐标。--> 得到横坐标数值后，将x传递给食物div的left值。

    3）在实例化对象并调用方法时，传递map参数。

3. 删除食物，写在私有函数中，外部不能访问。每创建一个食物div时，map和数组中都出现div。
    
    1）首先删除map中的食物div--> 找到该数组项的父级元素，删除父元素的子元素。（ele.parentNode.removeChild(ele);）

    2）再删除数组中的这个食物div--> 循环遍历数组，用Array.splice(i,j)方法，从第i个数组项开始，删除j项。循环结束后，所有的食物div都被删除。elements.splice(i,1);

    3）在初始化的开始调用这个函数。则即使多次调用食物初始化的方法，会再初始化开始删除所有的食物，再重新创建一个食物。

```
// 食物的自调用函数
(function () {
    // 数组用来保存每个食物
    var elements = [];
    // 分析食物的属性和行为，写食物的构造函数，用构造函数来创建对象
    function Food(x, y, width, height, color) {
        // 每个属性都有一个默认值，若不传递参数，就为默认样式
        // 左边是属性，右边是传递的参数值
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 20;
        this.height = height || 20;
        this.color = color || "green";
    }
    // 食物的初始化，使它在map中显示，是一个方法，写在原型对象中
    Food.prototype.init = function (map) {
        // 先删除这个食物
        remove();
        var div = document.createElement("div");
        map.appendChild(div);
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.backgroundColor = this.color;
        div.style.position = "absolute";
        // 横纵坐标是随机产生的
        this.x = parseInt(Math.random() * (map.offsetWidth / this.width)) * this.width;
        this.y = parseInt(Math.random() * (map.offsetHeight / this.height)) * this.height;
        div.style.left = this.x + "px";
        div.style.top = this.y + "px";
        // 将食物加到数组中
        elements.push(div);
    };
    // 删除食物
    function remove() {
        for (var i = 0; i < elements.length; i++) {
            var ele = elements[i];
            // 从map地图上删除这个子元素div
            ele.parentNode.removeChild(ele);
            // 从数组中删除这个子元素div
            elements.splice(i, 1);
        }
    }
    // 将构造函数暴露给window，使得外部可以使用它来实例化对象
    window.Food = Food;
}());
var food = new Food();
food.init(document.querySelector(".map"));
```

# 4. 小蛇的构造函数及初始化

* 需要用户传入的值，就需要写在参数中；不需要传入，就不用谢在参数中。

## 4.1 步骤：

1. 小蛇的构造函数。每一个部分有宽、高、方向这些属性，有默认值。将小蛇的横纵坐标点和颜色存在一个body数组中，方便小蛇身体的增长。分析小蛇初始化时的位置，由三个方块组成，方块的纵坐标点相同，横坐标从头部的方块开始递减。

2. 小蛇的初始化。循环遍历body数组。
    1）先创建div对象（小蛇的每个部分），追加到map中。

    2）设置div的样式，宽、高、position。因为数组的每个数组项都是一个对象，所以将每个对象存到每个变量中，通过对象点属性获取每个div的x、y、color。计算出每个部分的横纵坐标并将结果赋给div的left和top属性--> 头部的横坐标为div.style.left = obj.x * this.width + "px";（针对小蛇的每个div对象来说）

    3）最后将每个div对象加到数组中，目的是为了删除。

3. 将Snake()构造函数暴露给window对象，在自调用函数外部创建实例对象，并调用小蛇的init()方法，记得传递map参数。

```
// 小蛇的自调用函数
(function () {
    var elements = []; // 存放小蛇身体的每个部分
    // 小蛇的构造函数
    function Snake(width, height, direction) {
        // 组成小蛇的每个方块
        this.width = width || 20;
        this.height = height || 20;
        this.direction = direction || "right";
        // 小蛇的身体
        this.body = [
            { x: 4, y: 2, color: "red" }, //头
            { x: 3, y: 2, color: "orange" }, //身体
            { x: 2, y: 2, color: "orange" } //身体
        ];
    }
    Snake.prototype.init = function (map) {
        // 循环遍历创建div，并设置div的样式
        for (var i = 0; i < this.body.length; i++) {
            var obj = this.body[i]; // 数组中的每个数组项都是一个对象
            var div = document.createElement("div");
            map.appendChild(div);
            div.style.width = this.width + "px";
            div.style.height = this.height + "px";
            div.style.position = "absolute";
            // 横纵坐标，每个属性由对象点出来
            div.style.left = obj.x * this.width + "px";
            div.style.top = obj.y * this.height + "px";
            div.style.backgroundColor = obj.color; // 背景颜色
            // 把div加入到elements数组中--> 为了删除
            elements.push(div);
        }
    };
    window.Snake = Snake;
}());
var snake = new Snake();
snake.init(document.querySelector(".map"));
```

# 5. 小蛇移动的坐标

* 为原型添加方法，使小蛇动起来--> 小蛇在地图上动，且要找到食物，所以要传food和map这两个参数。

## 5.1 步骤：


1. 改变蛇的坐标，分成身体和头两部分。身体上的小方块改变坐标的方式是，循环遍历body数组，将前一个方块的坐标点给后一个方块。

2. 因为头要改变方向，所以头的方块的坐标是根据direction变化的，用switch语句来判断。若direction为right，则body数组的第一个对象的x属性加1（this.body[0].x += 1; ）。--> 计算机的坐标轴的零点在左上角， 横坐标从左向右，纵坐标从上到下。根据direction的值（left，right，top，bottom），用switch语句判断小蛇的头部的横纵坐标（body[0].x）是加1还是减1。

```
// 为原型添加方法，小蛇动起来
Snake.prototype.move = function (food, map) {
    // 改变小蛇身体的坐标
    var i = this.body.length-1;
    for (; i > 0; i--) {
        this.body[i].x = this.body[i - 1].x;
        this.body[i].y = this.body[i - 1].y;
    }
    // 判断方向--改变小蛇的头的坐标位置
    switch (this.direction) {
        case "right": 
            this.body[0].x += 1; 
            break;
        case "left": 
            this.body[0].x -= 1; 
            break;
        case "top": 
            this.body[0].y -= 1; 
            break;
        case "bottom": 
            this.body[0].y += 1; 
            break;
    }
};
```

# 6. 初始化游戏对象

![1.png](https://github.com/janeweix/practice/blob/master/greedy-snake/img/1.png)

--> 移动两次后蛇的样子--> 所以要在每次初始化之前，删除所有的小蛇，再重新创建。--> 写一个私有函数，删除原来的小蛇（地图和数组中的都要删除），在初始化方法的开头调用该函数。

```
var map=document.querySelector(".map");
var food = new Food();
food.init(map);
var snake = new Snake();
snake.init(map); // 第一条小蛇
snake.move(food,map); // 第一次改变蛇的坐标
snake.init(map); // 第二条小蛇
snake.move(food,map); // 第二次改变蛇的坐标
snake.init(map); // 第三条小蛇
```

**删除小蛇的私有函数怎么写？**

1. 因为小蛇的每一部分是保存在数组中的，且每一部分都被追加到地图上，所以在删除时也是把每一个方块div删除，从而达到删除一条蛇的效果。需要循环遍历数组，在循环中获取某一个方块（elements.[i]），保存在ele变量中。

2. 首先删除地图上的每个方块。根据当前方块div的父级元素的removeChild()方法删除这个子元素方块--> ` ele.parentNode.removeChild(ele); `
再删除数组中的每一个方块。通过数组的splice(i,j)方法，从第i项开始，删除j个数组项。这里就是删除当前这个元素就可以，所以是 ` elements.splice(i,1); `。

* 加上删除小蛇的函数之后：

![2.png]()
--> 小蛇向右移动两次之后

```
function remove() {
    var i = elements.length - 1;
    for (; i > 0; i--) {
        var ele = elements[i]; // 根据当前元素，找到其父元素
        ele.parentNode.removeChild(ele); // 删除父元素的子元素div，即从地图中删除该div
        elements.splice(i, 1); //从数组中删除这个子元素div
    }
}
```

**怎样让小蛇移动？**
    创建一个定时器，每个一段时间，就让小蛇改变一次位置（snake.move(food,map);），且创建一次（snake.init(map);）。先让小蛇出现在地图上，所以在定时器之前先初始化一次。

```
snake.init(map); // 让小蛇出现在地图上
setInterval(function () {
    snake.move(food, map); // 移动
    snake.init(map); // 创建
}, 200);
```

* 到现在为止，让游戏大致运转起来的代码有下面这几行--> 接下来把游戏当做一个对象，为游戏创建自调用函数。

```
var map = document.querySelector(".map");
var food = new Food();
food.init(map);
var snake = new Snake();
snake.init(map); // 让小蛇出现在地图上
setInterval(function () {
    snake.move(food, map);
    snake.init(map);
}, 200);
```

**为游戏创建自调用函数：**

1. 创建游戏的构造函数，其中包括食物、小蛇、地图这三个对象，保存在三个属性中。

2. 初始化游戏，此方法写在构造函数的原型对象中。初始化游戏，就是使食物、小蛇显示出来，即食物和小蛇的初始化；并且蛇开始移动。

3. 注意：setInterval()是window对象的方法，它的this指向的是window。当把它放到游戏的初始化方法中时，setInterval()方法中的this就被改变（本来应该指向实例对象，但现在指向为window，而window中没有snake这个构造函数？所以就会报错）。解决方法：在自调用函数的开头定义一个that变量（初始值为null），在游戏的初始化方法中使that保存this指向，在setInterval()中就用that代替原来的this。

4. 将游戏的构造函数暴露给window对象，在自调用函数外部实例化对象，并调用实例对象的方法。

**注意：**

1. 只要写得很多的代码，就把它们封装到一个函数中去。

2. 什么时候要传递参数map，什么时候不用传？--> 在游戏的构造函数中，传递了map；在初始化方法中，没有传递map，用的就是构造函数中的map。

3. 在游戏初始化中，对食物和小蛇进行初始化时，要记得传递map参数，这里的map被保存到this.map属性中，直接用这个属性就可以。达到的初始效果：小蛇每隔200毫秒就向右（默认）移动一次，且一直向右，最终会超出map。

```
// 游戏的自调用函数
(function () {
    var that = null;
    // 游戏的构造函数
    function Game(map) {
        this.food = new Food(); //食物对象
        this.snake = new Snake(); //小蛇对象
        this.map = map;
        that = this;
    }
    // 游戏的初始化
    Game.prototype.init = function () {
        this.food.init(this.map);
        this.snake.init(this.map);
        // 小蛇移动
        setInterval(function () {
            that.snake.move(that.food, that.map);
            that.snake.init(that.map);
        }, 200)
    };
    window.Game = Game;
}());
// 实例化对象
var gm = new Game(document.querySelector(".map"));
gm.init();
```

# 7. 小蛇自动移动并设置游戏结束

* 因为小蛇移动的范围在map内，若碰到map边缘，则游戏结束；且小蛇移动的方向由键盘上的方向键确定，所以小蛇移动这个行为要另外封装在一个方法中。

* 在游戏的初始化方法中调用小蛇移动的方法（原型对象的方法可以互相调用），记得要传递参数，参数是构造函数中已有的两个属性。this.runSnake(this.food, this.map);

* 同样，定时器中的this指向的是window，这里我们用bind()方法来改变this指向，用在定时器的函数后面，将正确的this指向（即that）传递给bind()方法，name调用它的函数中的this就都指向that。

**怎么让小蛇在碰到map边界时停止移动？**

1. 设置横纵坐标的最大值和最小值，若蛇头的坐标点超出这个范围，就清理定时器（因为小蛇是在定时器中移动的）。

2. 横坐标的最小值为0，最大值就是map的宽/蛇头的宽。

**注意：**

1. 这些判断条件都是写在定时器的函数中的。

2. 在蛇移动的方法中，需要传递food和map参数，这两个参数是在游戏的初始化方法中调用蛇移动的方法时，才传递的。而在蛇移动的方法中，只需要用food和map就好了。

```
// 游戏的初始化
Game.prototype.init = function () {
    this.food.init(this.map);
    this.snake.init(this.map);
    // 调用小蛇移动的方法
    this.runSnake(this.food, this.map);
};
// 写在原型对象上的方法，控制小蛇的移动
Game.prototype.runSnake = function (food, map) {
    var timeId = setInterval(function () {
        this.snake.move(food, map);
        this.snake.init(map);
        // 设置小蛇移动的范围
        var maxX = map.offsetWidth / this.snake.width;
        var maxY = map.offsetHeight / this.snake.height;
        // 蛇头的坐标
        var headX = this.snake.body[0].x;
        var headY = this.snake.body[0].y;
        // 小蛇撞墙时，停止游戏
        if (headX < 0 || headX >= maxX || headY < 0 || headY >= maxY) {
            clearInterval(timeId);
            alert("游戏结束");
        }
        console.log(headX + "---" + headY + "---" + maxX);
    }.bind(that), 150);
}
```

# 8. 获取键盘按下的键的值

事件参数对象就是e，即arguments[0]--> 两者指向的是同一个对象。

以后遇到事件处理函数，就要想到它的事件参数对象，且这个事件参数对象是与注册的事件有关的。

在这个参数对象中：

1. 比如说shiftkey:false这个属性，表示是否按下的是shift键，为false，即按的不是shift键。

2. keyCode这个属性，代表每个按键的数值编码。

```
document.onkeydown = function (e) {
    console.log(arguments[0]);
    console.log(e);
    console.log(e.keyCode);
};
```

# 9. 设置用户按键，改变小蛇移动方向

* document.addEventListener(每有on的事件名，事件处理函数，false); --> 用这个方法注册事件和添加事件处理函数，它的this指向的是触发这个事件的对象，即document。所以需要在事件处理函数添加bind()方法，改变this指向。

* 在原型上添加方法，用来为document注册键盘按下事件，获取键值，根据键值确定direction的属性值。-->用到事件参数对象，记得传递参数。

* 然后在初始化方法中调用这个方法，即蛇一移动就调用这个方法，就可以知道用户按下的是哪个键。

**注意：**

    direction是this.snake的值，注意调用它的对象不要写错。

![2.png](https://github.com/janeweix/practice/blob/master/greedy-snake/img/2.png)

```
Game.prototype.bindKey = function () {
    // 为页面注册键盘按下事件，判断键值
    document.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case 37:
                this.snake.direction = "left";
                break;
            case 38:
                this.snake.direction = "top";
                break;
            case 39:
                this.snake.direction = "right";
                break;
            case 40:
                this.snake.direction = "bottom"
                    ; break;
        }
    }.bind(that), false);
}
```

# 10. 小蛇吃到食物

* 当蛇头和食物的位置相同时，就吃到了食物。--> 在小蛇移动的过程中判断有没有吃到食物，若吃到了，就调用小蛇吃到食物的那个方法。即这个判断是写在小蛇的自调用函数的Snake.prototype.move = function (food, map) {}方法中的。

**步骤：**

1. 在小蛇移动的方法中--> 首先获取蛇头和食物的坐标点，若相等，则小蛇的身体增长，且食物消失并重新创建。

2. 小蛇的身体增长--> 先获取body数组中的最后一个对象，存到last变量中。把对象复制一次，并将这个对象加到数组的最后一项中（body.[length-1]）。这个对象中的x,y,color都是根据last（最后一个对象，即蛇尾的位置）动态变化的，需要在对象中设置这些属性的值。

3. 食物的消失和重建--> 因为食物的init()函数中包含了这两个过程，所以直接调用这个方法就可以。

**注意：**

1. 这里的 food.init(map);-->前面没有加this，因为food是一个对象，这里是调用food对象的方法，直接调用就可以，因为原型中的方法可以互相调用。而body是snake对象的属性，所以需要用this点出来。--> 方法和函数的区别：方法通过对象调用；函数直接调用，写函数名就可以。

```
// 判断有没有吃到食物
// 先获取蛇头的坐标值
var headX = this.body[0].x * this.width;
var headY = this.body[0].y * this.height;
// 若吃到食物，蛇身增长，且食物重建
if (headX == food.x && headY == food.y) {
    var last = this.body[this.body.length - 1];
    this.body.push({ //蛇身增长
        x: last.x,
        y: last.y,
        color: last.color
    });
    // 食物重建，记得传递map参数
    food.init(map);
}
```

