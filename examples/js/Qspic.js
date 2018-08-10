/**
 * 青史图片方法切换、轮播插件
 * @version 2.0.0
 * @author 汉服青史
 * @date 2016
 * @desc 
 * 依赖动画特效插件 velocity.min.js、 velocity.ui.min.js 开发时版本：1.5.0
 * 依赖jquery插件，开发时版本1.7.1
 * 自动识别页面上指定元素下的大图，并绑定点击放大、缩小事件。
 * 自动识别浏览器可视范围，给出最佳图片放大效果
 * 支持左右切换图片
 * 支持自动轮播
 */

!(function($) {
	"use strict";
	
	//支持的动画列表，velocity内置动画，结尾不包含In或Out
	var transition = [
		"transition.fade",
		"transition.flipX",
		"transition.flipY",
		"transition.flipBounceX",
		"transition.flipBounceY",
		"transition.swoop",
		"transition.whirl",
		//"transition.shrk",
		"transition.expand",
		"transition.bounce",
		"transition.bounceDown",
		"transition.bounceLeft",
		"transition.bounceRight",
		"transition.slideUp",
		"transition.slideDown",
		"transition.slideLeft",
		"transition.slideRight",
		"transition.slideUpBig",
		"transition.slideDownBig",
		"transition.slideLeftBig",
		"transition.slideRightBig",
		"transition.perspectiveUp",
		"transition.perspectiveDown",
		"transition.perspectiveLeft",
		"transition.perspectiveRight",
	];
	
	var Qspic = function (element, options) {
        this.element = element;
        this.options = $.extend({}, Qspic.DEFAULTS, options);
    };
    
	// 默认参数
    Qspic.DEFAULTS = {
    	animationShow: 'transition.expand',	//打开动画
		animationSwitch: 'moveIn',	//切换动画
		speed: 500,		//动画速度
		debug:false,	//调试模式，动画调试，默认关闭，true为打开
		loop:false,		//开启循环，默认关闭，true为打开
		min:[200,100],	//最小加载图片的大小，[宽,高]，单位像素，一般用于过滤小图片
		autoPlay:false,	//自动轮播，自动切图,false为关闭，1000为1000毫秒切换
		closed:'',	//图片关闭完成的回调
		switched:'',		//图片切换完成的回调
		opened:'',		//图片切换完成的回调
    };
    
    // 系统常量
    Qspic.SYSTEM = {
    	$switch: $('<div class="qsImage-switch-box" style="display: none; left: 50%; position: absolute; top: 50%; border: 3px solid rgb(255, 255, 255); box-shadow: rgb(24, 24, 24) 2px 0px 20px; overflow-y: hidden; overflow-x: hidden;"><div class="prev-img" style="height: 100%; position: relative; z-index: 1999; width: 40%; opacity: 0.2;float: left;"></div><div class="next-img" style="height: 100%; position: relative; z-index: 1999; width: 40%; opacity: 0.2;float: right;"></div><div class="img-number" style="height: 40px; width: 40px; line-height: 20px; text-align: center; position: absolute; bottom: -20px; background: rgba(150, 150, 150, 0.6); z-index: 1003; right: 0; color: white; padding: 0 5px;"></div></div>')
    	//遮罩层
		,$shade : $('<div class="qsImage-shade" style="position: fixed; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); top: 0; z-index: 999;"></div>')
		//显示大图的父层
		,$parbox : $('<div class="qsImage-img-box" style="cursor:pointer;position: fixed; width: 100%; height: 100%; top: 0; z-index: 999;"></div>')
		//加载层
		,$loading : $('<div class="qsImage-loading">loading……</div>')
    };
    
    //运行时参数
    Qspic.RUNTIME = {
    	index:-1,
    	content_img_list:[],
    	show_img_list:[],
    	status:{},
    	autoPlayId:null,
    };
    
    // 私有方法
    var private_methods = {
    	//加载图片
       loadImage:function(that,index) {
       		// 判断是否缓存图片
			Qspic.RUNTIME.content_img_list = $._data(this, "Qspic.RUNTIME.content_img_list");
			// 如果没有缓存, 就缓存它
            if (!Qspic.RUNTIME.content_img_list) $._data(this, "Qspic.RUNTIME.content_img_list", (Qspic.RUNTIME.content_img_list = $(that.element).find('img')));
       		//循环加载图片,从上到下加载
			//var Qspic.RUNTIME.content_img_list = that.find('img');
			if(Qspic.RUNTIME.content_img_list.length<=0)return;
        	var _w = parseInt($(window).width()) * 0.85 //浏览器宽度
				,_h = parseInt($(window).height()) * 0.85 //浏览器宽度
				,newimg = $('<img>').attr('src', $(Qspic.RUNTIME.content_img_list[index]).attr('src'))
				,dfd = $.Deferred(); //// 新建一个deferred延迟对象
			var load = this;
			newimg.load(function() {
				$(Qspic.RUNTIME.content_img_list[index]).attr('data-img-index', index);
				var rw = this.width,
					rh = this.height;
				
				
				var $new = $(this);
				var _whb = rw / rh; //宽高比
				var init_img = function(t) {
					t.appendTo(Qspic.SYSTEM.$switch);
					var cssObj = {};
					/**
					 * 	同比例缩小图片核心公式：
					 *  显示的高 ＝ 浏览器宽/图片真实宽高比 
					 *  显示的宽 ＝ 浏览器高*图片真实宽高比
					 */
					var height = rw < _w && rh > _h ? _h : rw > _w && rh < _h ? _w / _whb : rw > _w && rh > _h ? rw > rh ? _w / _whb > _h ? _h : _w / _whb : _h : rh;
					var width = rw < _w && rh > _h ? _h * _whb : rw > _w && rh < _h ? _w : rw > _w && rh > _h ? rw > rh ? _w / _whb > _h ? _h * _whb : _w : _h * _whb : rw;
					t.css({
						height: height + 'px',
						width: width + 'px',
						'margin-left': -width / 2 + 'px',
						'margin-top': -height / 2 + 'px',
						'opacity': '0',
						'left': '50%',
						'position': 'absolute',
						'top': '50%',
						'cursor':'default',
					});
					dfd.resolve(); //改变deferred对象的执行状态
					return dfd.promise();
				}
				$.when(init_img($new)).done(function() {
					//最小加载图片大小的处理
					if(that.options.min[0]>0&&that.options.min[1]>0){
						Qspic.RUNTIME.show_img_list.push($new);
					}else{
						//grep返回的是数组对象，这里需要转换成jq对象
						Qspic.RUNTIME.content_img_list=$($.grep(Qspic.RUNTIME.content_img_list,function(n,i){
							return i!=index;
						}));
						$._data(load, "Qspic.RUNTIME.content_img_list", Qspic.RUNTIME.content_img_list);
						index--;
					}
					if(index===Qspic.RUNTIME.content_img_list.length-1){
						Qspic.RUNTIME.content_img_list.css('cursor','crosshair').attr('title','查看大图');
						private_methods.bindClick(that);
						return;
					}
					//console.log(_new.attr('src')+' 加载完成 '+index);
					private_methods.loadImage(that,index+1);
				})
			})
		},
		
		//切换图片
		switchImage:function(that,e){
			var show_img_list = Qspic.RUNTIME.show_img_list,
				$switch = Qspic.SYSTEM.$switch;
				
			var index = Qspic.RUNTIME.index,
				completed = Qspic.RUNTIME.status.completed,
				opt = that.options,
				speed = opt.speed,
				loop = opt.loop;
				
			var isPrev = e.attr('class') === 'prev-img';
			var isNext = e.attr('class') === 'next-img';
			
			var n = isPrev ? index - 1 : isNext ? index + 1 : index;
			//是否到底第一张和最后一张
			if(n<0){
				n = show_img_list.length-1;
				if(!loop)return;
			}
			if(n>show_img_list.length-1){
				n = 0;
				if(!loop)return;
				
			}
			if((isPrev || isNext)&&completed) {
				Qspic.RUNTIME.status.completed = false;
				var index_cssObj = {
					height: show_img_list[n].css('height'),
					width: show_img_list[n].css('width'),
					'margin-left': parseInt(-show_img_list[n].css('width').replace(/[^-\d\.]/g, '')) / 2 + 'px',
					'margin-top': parseInt(-show_img_list[n].css('height').replace(/[^-\d\.]/g, '')) / 2 + 'px'
				}
				$switch.velocity(index_cssObj, {duration:speed});
				//动画已执行完成
				var finish = function(){
					show_img_list[index>=0?index:show_img_list.length-1].css('opacity', '0');
					index = loop?isNext?n-1:n+1:index;
					$switch.find('.img-number').html(n+1 + '/' + show_img_list.length);
					isPrev ? index -- : isNext ? index ++ : index;
					Qspic.RUNTIME.index = index;
					Qspic.RUNTIME.status.completed = completed;
				}

				if(opt.animationSwitch === 'moveIn') {
					var indexWidth = show_img_list[index][0].width;
					var changeWidth = show_img_list[n][0].width;
					show_img_list[index].velocity({
						'margin-left': -indexWidth / 2 + (isPrev?1:-1)*(changeWidth > indexWidth ? (changeWidth - indexWidth) / 2 + indexWidth : (indexWidth - changeWidth) / 2 + changeWidth) + 'px',

					}, {duration:speed});
					show_img_list[n].css({
						'margin-left': (isPrev?-indexWidth:-indexWidth) / 2 - (isPrev?changeWidth:-indexWidth) + 'px',
						'opacity': '1',
					});
					show_img_list[n].velocity({
						'margin-left': -changeWidth / 2 + 'px'
					},{
						complete: function(elements) { 
							completed = true; finish();
							private_methods.switchAction();
							private_methods.callBack(opt.switched,elements,Qspic.RUNTIME);
						},//切换完成的回调
						duration:speed
					});
				} else {
					show_img_list[index].velocity(opt.animationSwitch + 'Out', {duration:speed});
					show_img_list[n].velocity(opt.animationSwitch + 'In' ,{
						complete: function(elements) {
							completed = true;finish();
							private_methods.switchAction();
							private_methods.callBack(opt.switched,elements,Qspic.RUNTIME)
							},//切换完成的回调
						duration:speed
					});;
				}
			}else{
				if(completed){
					e.velocity("stop", true).velocity({opacity: "0.5"}).velocity({opacity: "0.2"});
				}
			}
		},
		
		//绑定点击事件
		bindClick:function(that){
			Qspic.RUNTIME.content_img_list.each(function() {
				var $img = $(this);
				$img.unbind(); //绑定之前，移除所有事件，以免意外发生
				$img.click(function(e) {
					var show_img_list = Qspic.RUNTIME.show_img_list,
						$switch = Qspic.SYSTEM.$switch,
						$parbox = Qspic.SYSTEM.$parbox,
						$shade = Qspic.SYSTEM.$shade;
					
						//当前激活的图片序号
					var index = Qspic.RUNTIME.index = $(this).data('img-index'),
						completed = Qspic.RUNTIME.status.completed = false,
						opt = that.options,
						speed = opt.speed;
						
					private_methods.switchAction();
						
					var switch_width = show_img_list[index].css('width');
					var switch_height = show_img_list[index].css('height');
	
					var index_cssObj = {
						height: switch_height,
						width: switch_width,
						'margin-left': parseInt(-switch_width.replace(/[^-\d\.]/g, '')) / 2 + 'px',
						'margin-top': parseInt(-switch_height.replace(/[^-\d\.]/g, '')) / 2 + 'px'
					}
					$switch.css(index_cssObj);
	
					//图片数量显示
					$switch.find('.img-number').html(index + 1 + '/' + show_img_list.length)
	
					$parbox.html($switch);
					$('body').append($shade).append($parbox);
					$switch.hover(function(){$(this).children('.img-number').css('display','block')});
					$switch.find('.prev-img,.next-img').hover(function(){
						$(this).css({'cursor':'pointer','background':'#ccc',})
					},function(){
						$(this).css({'cursor':'default','background':'none',})
					});
					$shade.velocity('transition.fadeIn', {duration:speed});
					$switch.velocity(opt.animationShow + 'In', {duration:speed});
					show_img_list[index].velocity(opt.animationShow + 'In', {
						complete: function(elements) {
							Qspic.RUNTIME.status.completed = completed = true;
							//打开完成的回调
							private_methods.callBack(opt.opened,elements,Qspic.RUNTIME);
							if(!isNaN(parseInt(opt.autoPlay))&&Qspic.RUNTIME.status.completed){
								Qspic.RUNTIME.autoPlayId = setInterval(function(){
									private_methods.switchImage(that,$('.next-img'));
								},opt.autoPlay)
							}
						},
						duration:speed
					})
					//defereds.push(dfd);
	
					//点击遮罩层关闭图片
					$parbox.click(function(e) {
						private_methods.closeImage(e,opt,completed);
					})
					//上一张、下一张
					$switch.on('click', '.prev-img,.next-img', function(e) {
						if(Qspic.RUNTIME.status.completed)
						private_methods.switchImage(that,$(this));
					})
					
	
				})
			})
		},
       
       //关闭图片
       closeImage:function(e,opt){
       		var $switch = Qspic.SYSTEM.$switch,
       			$parbox = Qspic.SYSTEM.$parbox,
       			$shade = Qspic.SYSTEM.$shade,
       			show_img_list = Qspic.RUNTIME.show_img_list,
       			completed = Qspic.RUNTIME.status.completed;
       		//点击的图片框内不关闭
			if($switch.has(e.target).length > 0||!completed)
				return;
			//Qspic.RUNTIME.show_img_list[index].velocity(opt.animationShow + 'Out',{duration:speed});
			$switch.velocity(opt.animationShow + 'Out', {
				complete: function(elements) {
					$parbox.remove();
					$shade.velocity('transition.fadeOut', {
						complete: function(elements) {
							$shade.remove();
							Qspic.RUNTIME.status.completed = false;
							clearInterval(Qspic.RUNTIME.autoPlayId);
							//关闭完成的回调
							private_methods.callBack(opt.closed,elements,Qspic.RUNTIME);
						}, duration:opt.speed
					});
					
				}, duration:opt.speed
			});
			
			//关闭后初始化图片为未打开的状态
			for(var m in show_img_list) {
				var indexWidth = parseInt(show_img_list[m].css('width').replace(/[^-\d\.]/g, ''));
				var indexHeight = parseInt(show_img_list[m].css('height').replace(/[^-\d\.]/g, ''));
				show_img_list[m].velocity({
					'z-index': '1000',
					'margin-left': -indexWidth / 2 + 'px',
					'margin-top': -indexHeight / 2 + 'px',
					'opacity': '0'
				});
			}
      },
      //切换按钮的显示和隐藏
      switchAction:function(){
	      	if(Qspic.RUNTIME.index>0){
				Qspic.SYSTEM.$switch.find('.prev-img').show();
			}else{
				Qspic.SYSTEM.$switch.find('.prev-img').hide();
			}
			if(Qspic.RUNTIME.index<Qspic.RUNTIME.show_img_list.length-1){
				Qspic.SYSTEM.$switch.find('.next-img').show();
			}else{
				Qspic.SYSTEM.$switch.find('.next-img').hide();
			}
      },
      
      //调试模式
      debug:function(that){
      	var opt = that.options;
		if(opt.debug){
			//Debug
			var debug = $('<div class="qsImage-debug" style="position: fixed; top: 0; right: 0;"></div>')
				,switch_select = $('<select class="switch_select"><option>切图特效(defalut:moveIn)</option></select>')
				,open_select = $('<select class="open_select"><option>弹图特效(defalut:transition.slideLeft)</option></select>');
			for (var i in transition) {
				switch_select.append($('<option>'+transition[i]+'</option>'));
				open_select.append($('<option>'+transition[i]+'</option>'));
			}
			debug.append(switch_select).append(open_select);
			$('body').append(debug);
			debug.children('select').change(function(){
				if($(this).find("option:selected").index()>0){
					if($(this).attr('class')==='switch_select'){
						opt.animationSwitch = $(this).val();
					}else{
						opt.animationShow = $(this).val();
					}
				}
			})
		}
     },
     //回调函数构造
     callBack:function(fun,data,global){
     	if(typeof(fun)==="function"){
			fun(data,global);
		}
     },
     //加载必要的特效JS
     loadScript:function(url, callback) {
	  var script = document.createElement("script");
	  script.type = "text/javascript";
	  if(typeof(callback) != "undefined"){
	    if (script.readyState) {
	      script.onreadystatechange = function () {
	        if (script.readyState == "loaded" || script.readyState == "complete") {
	          script.onreadystatechange = null;
	          callback();
	        }
	      };
	    } else {
	      script.onload = function () {
	        callback();
	      };
	    }
	  }
	  script.src = url;
	  document.body.appendChild(script);
	},
    }

	$.fn.Qspic = function(options) {
		return this.each(function () {
			// 判断是否初始化过的依据
			var data = $._data(this, "Qs.pic");
			var opts = typeof options == 'object' && options;
			// 如果没有初始化过, 就初始化它
            if (!data) $._data(this, "Qs.pic", (data = new Qspic(this, opts)));
            // 调用方法
            if (typeof options === "string" && typeof data[options] == "function") {
                // 执行插件的方法
                // Array.prototype.slice.call(arguments, 1) 
	            //arguments:类数组对象,call把arguments转换成Array.prototype.slice的this,同时传入参数1,使它成为slice的this,slice又是Array的拓展,所以arguments就转成了数组对象
	            //最后相当于arguments.slice(1)
	            //slice()方法可从已有的数组中返回选定的元素。arrayObject.slice(start,end(可选))
                data[options].apply(data,  Array.prototype.slice.call(arguments, 1));
            }else if(typeof options === 'object' || !options){
            	data.init.apply(data, arguments);
            }else{
            	$.error('Method ' + options + ' does not exist on jQuery.Qspic');
            }
                
		})
	}
	
	//共有方法.
    Qspic.prototype = {
        //插件初始化
        init : function () {
			private_methods.debug(this);
			private_methods.loadImage(this,0);
			//如果没有引入velocity，则自动从官网引入
			window.onload = function(){
				if(typeof($('body').velocity)=="undefined"){
					private_methods.loadScript('https://cdn.jsdelivr.net/npm/velocity-animate@1.5.0/velocity.min.js',function(){
						private_methods.loadScript('https://cdn.jsdelivr.net/npm/velocity-animate@1.5.0/velocity.ui.min.js',function(){
							console.log('Qs.pic:您当前没有引入velocity.min.js/velocity.ui.min.js，已为您自动引入。');
						})
					})
				}
			}
			
        },
        //销毁
        destroy: function(){
        	private_methods.closeImage(Qspic.SYSTEM.$parbox,this.options,true);
        },
        //重置
        reset: function(){
        	Qspic.RUNTIME = {
        		index:0,
		    	content_img_list:[],
		    	show_img_list:[],
		    	status:{},
		    	autoPlayId:null,
        	};
        	var a = $(this.element);
        	a.options = this.options;
          	private_methods.loadImage(a,0);
        },
        //清除自动播放
        clearAutoPlay:function(){
        	console.log(Qspic.RUNTIME.autoPlayId);
        	clearInterval(Qspic.RUNTIME.autoPlayId);
        	Qspic.DEFAULTS.autoPlay=false;
        },
        getRunTime:function(){
        	return Qspic.RUNTIME.autoPlayId;
        },
         //
        getGLOBAL:function(){
        	return Qspic.GLOBAL;
        }
    };
	
})(jQuery)
