## 图片放大插件 - Qspic

### 示例：
[https://mrchln.github.io/Qspic/examples](https://mrchln.github.io/Qspic/examples)

### 介绍：
```markdown
/**
 * 青史图片放大切换、轮播插件
 * @version 2.0.0
 * @author 汉服青史
 * @date 2018
 * @desc 
 * 依赖动画特效插件 velocity.min.js、 velocity.ui.min.js 开发时版本：1.5.0
 * 依赖jquery插件，开发时版本1.7.1
 * 1.自动识别页面上指定元素下的大图，并绑定点击放大、缩小事件。
 * 2.自动识别浏览器可视范围，给出最佳图片放大效果
 * 3.支持左右切换图片
 * 4.支持自动轮播
 * 5.自定义参数
 * 6.提供内置方法
 * 7.提供回调函数
 */
 
```

### 使用方法：

在需要查看大图的页面  
引入依赖的`jquery.min.js`,  
引入依赖的动画特效插件`velocity.min.js、velocity.ui.min.js`。  
引入插件`Qspic.js`，  
>`<script src="js/jquery.min.js"></script>`  
>`<script src="js/velocity.min.js"></script>`  
>`<script src="js/velocity.ui.min.js"></script>`  
>`<script src="js/Qspic.js"></script>`  
  
**调用**
```markdown
$(element).Qspic({
	animationShow: 'transition.expand',	//打开动画，所有velocity提供的动画
	animationSwitch: 'moveIn',		//切换动画，所有velocity提供的动画
	speed: 500,	//切换动画速度，单位毫秒
	debug:false,	//调试模式，动画调试，默认关闭，true为打开
	loop:false,	//开启循环，默认关闭，true为打开
	min:[200,100],	//最小加载图片的大小，[宽,高]，单位像素，一般用于过滤小图片
	autoPlay:false,	//自动轮播，自动切图,false为关闭，1000为1000毫秒切换
        opened:function(){			//图片打开完成时回调
                console.log('opened');
        },
        switched:function(){			//图片切换完成时回调
                console.log('switched');
        }
	closed:function(){			//图片关闭完成时回调
                console.log('closed');		
        },
});

//element为图片集合的父级元素
```
### 内置方法使用：
```markdown
$('#button').click(function(){
	$(element).Qspic('reset');//调用重置方法，该方法重新获取图片，会根据浏览器可视范围重置打开图片的宽高，以及runtime
	$(element).Qspic('destroy');//调用销毁方法，该方法会关闭打开的图片
	$(element).Qspic('clearAutoPlay');//清除自动轮播
})

//element为图片集合的父级元素
```



