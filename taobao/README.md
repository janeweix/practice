# 淘宝静态首页

## 涉及大体的知识点

* title显示

* css样式引入

* css选择器，选择器权重

* 滚动条消失

* 快捷键的应用

* display

* 浮动

* 元素居中（文字垂直居中）

* 盒模型（标准模式的盒模型与IE模式下的盒模型）

* 伪类（:hover等）与伪元素（before和after）

* 定位

* form表单

* 背景颜色渐变 linear-gradient

* 圆角 

* overflow

* 去除input默认样式 border/outline

* 文字属性 line-height/text-align

* 文字环绕图片

* 精灵图，雪碧图（小图像的组合）。通过img标签每请求一个图片，就会耗费性能，所以把小图标组成一张图片，就只请求一次。再通过背景图片的位置来调节当前的背景图片的显示区域。

* 盒模型的转化（标准模式下的盒模型与IE模式下的盒模型）box-sizing: border-box;

* 背景定位：background-position

## 1. 前言

### 1.1 零散知识点

* 中间是一个轮播图，可以将轮播图封装成一个插件

* 在搜索框内输入搜索词，会弹出相关搜索词条，和js操作有关（获取数据信息）

* 引入GIF动图，可以用img标签引入。

* 鼠标覆盖时有下拉菜单，或dom元素的变化，需要js配合。

* 可以自己新增js内容。

* w3c标准：万维网（www）联盟标准。一系列标准的集合。world wide web consortium的缩写，3代表3个w。

* 思考：网页由哪几部分组成？结构，样式，行为，三者分离。

* 有一些标签自带样式，就要避免使用这些标签。

### 1.2 设计思想

* 首先确定页面布局（上下还是左右），将整个页面区分成大的区域。

* 确定大区域的范围尺寸，利用div布局并且设置固定宽高及边框。（从外往里）

* 细分每个盒子中的子布局，实现具体样式

### 1.3 主要知识点

* 盒模型（标准盒模型，ie盒模型）

* 元素定位的用法

* display元素框的类型

* 浮动及清除浮动（伪元素）

* 自适应布局、居中样式

* html基础标签与css基础样式应用

* 两栏与三栏布局

### 1.4 页面分析

* 主要内容区是做居中处理的。

* 拉动控制台，首先整体会保持居中的效果，到一定宽度后，控制台区域会覆盖内容区。说明页面存在一个最小宽度，当页面宽度大于这个宽度时，页面会左右居中；小于这个宽度时，内容区不会缩小，但控制台会覆盖上内容区，页面就不能完整地显示了，这时应该出现横向滚动条（淘宝网没有横向滚动条）。

* “天猫”这行导航栏上有字体图标，鼠标移上去，上方会出现一个小图标，用一个图片来代替。

* 中间左侧部分在大屏幕中会展示三栏，在小屏幕中会展示两栏，设计了媒体查询自适应部分（会根据当前屏幕大小来调节页面显示）。

![aa.png](https://github.com/janeweix/practice/blob/master/taobao/img/aa.png)

## 2. 顶部导航栏

### 2.1 零散知识点

* 样式初始化工作

```
* {
    margin: 0;
    padding: 0;
    list-style: none;   /*无序列表的初始化*/
    text-decoration: none;    /*a标签的初始化*/
}
```

* 宽高的100%设置。如果直接给wrapper设置高为100%，它会根据内容撑开，而不是占满整屏。给html设置高度为100%，才是选中document页面设置整屏，即设置为浏览器的高度。wrapper是body的第一个子元素，且基于父级进行定位。

```
html,body {
    width: 100%;
    height: 100%;
    background-color: #f4f4f4;
    color: #3c3c3c;
    overflow-x: hidden;  
}

.wrapper {
    width: 100%;
    height: 100%;
}

```

* 若两个类名选择器之间有空格，表示被选中的两个元素具有父子关系；若类名选择器之间没有空格，说明一个元素同时具有这两个类名。

* 当内容区超出屏幕宽度就会出现横向滚动条。淘宝没有横向滚动条。

```
html,body {
    overflow-x: hidden;  //使横向滚动条消失
}
```

* 共分为四个部分，其中top-nav-wrap和search-wrap区域的宽度为100%，其他的宽高都是固定值。

```
.wrapper .top-nav-wrap {
    width: 100%;
    height: 105px;
}
```

* 广告条的宽度如果直接为100%，则它会根据页面进行压缩。所以它的父级宽度是100%，它本身是固定宽度的。广告可以用a标签做跳转，如果不做跳转，就用div中包含一个img标签来做。为什么不直接用img标签？

* 阿里的字体图库。bootstrap自带字体图库。

* 小图标当做span标签的背景图片出现。

* 所有要放小图标的部分设置一个相同的类名，此外每个图标都有一个自己的类名。

```
<li class="top-nav-menu china">
     <span class="c-span">中国大陆</span>
     <span class="bg-pic xsj-pic"></span> 
</li>
```

* 用井号代替跳转地址，后台接口没写完时可以先这样写。

` <a href="#" class="sign">免费注册</a> `

* ul的浮动使两个子导航栏分别向左右浮动（此时导航项还处于竖直方向），li的浮动使导航项水平排列。

```
.wrapper .top-nav-wrap .top-nav .top-nav-l {
  float: left;
}
.wrapper .top-nav-wrap .top-nav .top-nav-r {
  float: right;
}
.wrapper .top-nav-wrap .top-nav ul li {
  float: left;
  margin-right: 7px;
}
```

* 先设置大部分文字的样式，文字在a标签中。再处理细节的样式。

* 用层级选择器。

* 先让背景图片（小图标）全部出现，再以不同的类名替换。

* 小三角在水平方向上是根据下基准线对齐的。因为inline-block的vertical-align属性默认为bottom，所以这里要重新设置vertical的值。

```
.wrapper .top-nav-wrap .top-nav .bg-pic {
  display: inline-block;  
  width: 6px;
  height: 3px;
  background-image: url('./img/xsj.png');
  background-size: 100% 100%;
  vertical-align: middle; // 改变小三角垂直对齐方式
}
.wrapper .top-nav-wrap .top-nav .bg-pic.xsj-pic { // 根据不同的类名替换小图标（最后两个类名之间没有空格）
  background-image: url('./img/xsj.png');
}
.wrapper .top-nav-wrap .top-nav .bg-pic.shopCar-pic { //根据不同的类名替换小图标
  background-image: url('./img/gwc.png');
  width: 12px;  // 需要调整一下大小，否则就显示不出来
  height: 12px;
}
...
```

* 广告部分的样式（父级有与广告图相同的背景颜色，导致视觉上是一张图片）

## 3.  搜索区域

* 这个区域包括三部分。先让每一部分出现，再做细节。absolute相对于父级进行定位。

* 表单区域。两个小图标放在a标签的背景图片里。

![bb.png](https://github.com/janeweix/practice/blob/master/taobao/img/bb.png)
          
```
<div class="search-tab">
    <ul>
        <li class="select">宝贝</li>  //默认被选中需要做另外的样式
        <li>天猫</li>
        <li>店铺</li>
    </ul>
</div>
<div class="search-panel">  //两个图标基于父元素进行定位
    <a href="#" class="sousuo"></a>
    <form action="">
        <div class="btn"> //用绝对定位
            <button class="submit">搜索</button>
        </div>
      <div class="search-inp-box">  //搜索框
        <div class="search-inp">
            <input type="text" placeholder="荣耀10降价">  //输入框的默认内容
        </div>
      </div>
    </form>
    <a href="#" class="camera"></a>
</div>
```

* button有默认的样式，文字默认居中。

* 背景颜色渐变：background: linear-gradient(to right, #ff9000 0, #ff5000 100%);

## 4. 中间导航条

* 整体渐变，“主题市场”再覆盖上去。
* 用了三个ul，因为缩小界面会消失一部分，分成三块更方便。

```
<div class="screen-nav-con">
        <h2>主题市场</h2>
        <ul>
          <li><a href="#">天猫</a></li>
          <li><a href="#">聚划算</a></li>
          <li><a href="#">天猫超市</a></li>
        </ul>
        <ul>
          <li><a href="#">|</a></li>
          <li><a href="#">淘抢购</a></li>
          <li><a href="#">电器城</a></li>
          <li><a href="#">司法拍卖</a></li>
          <li><a href="#">淘宝心选</a></li>
          <li><a href="#">兴农扶贫</a></li>
        </ul>
        <ul>
          <li><a href="#">|</a></li>
          <li><a href="#">飞猪旅行</a></li>
          <li><a href="#">智能生活</a></li>
          <li><a href="#">苏宁易购</a></li>
        </ul>
      </div>
```

* li的伪元素要做什么。

```
.wrapper .screen-nav .screen-nav-con ul li:hover::before {
  content: "";
  display: block;
  width: 30px;
  height: 30px;
  background: url('./img/up.png') no-repeat;
  background-size: center;
  /*基于鼠标移动上去的对应的li进行定位*/
  /*不定位会出现在li的前面，占据li的位置*/
  position: absolute;
  top: -10px;
  /*左顶点居中*/
  left: 50%;
  /*结合使其中心点居中*/
  margin-left: -15px;
}
```

## 5. 图片区域

### 5.1 左侧

* 分成左右，左边分成上下，上面分成左中右。

* 右三角放在span中。斜线直接加在后面。

* background-position: 100% 100%;

### 5.2 右侧

* 宽度为100%，再加一个border-bottom: 1px;元素就会冲出去，因为它的总宽度超过父级。利用box-sizing:border-box；（改变盒模型模式）

* 精灵图，在控制台中调节位置，确定具体的值。是负值就往下移动，是正值就往上移动，所以这里的位置的值都是负值。


