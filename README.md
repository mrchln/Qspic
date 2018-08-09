## 图片点击放大插件，基于jq，提供方法和自定义参数

###介绍：
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
 */

###示例：[https://mrchln.github.io/Qspic/](https://mrchln.github.io/Qspic/)

###使用方法：
```markdown
$('#boxcontent_box').Qspic({
		animationShow: 'transition.expand',	//打开动画
		animationSwitch: 'moveIn',	//切换动画
		speed: 500,		//动画速度
		debug:true,	//调试模式，默认关闭
		loop:true,		//开启循环，默认关闭
		min:[200,100],	//最小加载大小，[宽,高]，单位像素
		autoPlay:2000,	//自动播放，自动切图
		closed:function(){
			console.log('closed');
		},
		opened:function(){
			console.log('opened');
		},
		switched:function(){
			console.log('switched');
		}
	});
	$('#qspictest').click(function(){
		console.log($('#boxcontent_box').Qspic('reset'));
	})
```
### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

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
