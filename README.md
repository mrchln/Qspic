## 图片放大插件 - Qspic

### 示例：
[https://mrchln.github.io/Qspic/](https://mrchln.github.io/Qspic/)

### 介绍：
```markdown
/**
 * 青史图片方法切换、轮播插件
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
```markdown
$(element).Qspic({
	animationShow: 'transition.expand',	//打开动画
	animationSwitch: 'moveIn',		//切换动画
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

$('#button').click(function(){
	$(element).Qspic('reset');//调用重置方法，该方法重新获取图片，会根据浏览器可视范围重置打开图片的宽高，以及runtime
	$(element).Qspic('destroy');//调用销毁方法，该方法会关闭打开的图片
	$(element).Qspic('clearAutoPlay');//清除自动轮播
})

//element为图片集合的父级元素
```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/mrchln/hanfuqingshi.github.io/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://help.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out.
