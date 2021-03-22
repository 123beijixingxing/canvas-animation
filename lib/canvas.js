/*
* 使用canvas 实现 gif 动画
*
* 
*/
/*
   *
   * 暴露模块一个类
   * 参数一：动画容器的 DOM，用于存放图片和CANVAS的DOM节点，该项必选。
   * 参数二：配置对象
   *        imgType： 图片的类名，gif 的图片都有一个大的类名
   * 		imgArr：图片序列数组，该项必选。支持图片地址及base64。
   *        start： 图片开始下标
   *        over： 图片结束下标
   *        interval： 时间间隔
   *        autoplay： 自动播放 默认 false
   *        loop： 是否无限循环 默认 false
   * 		startplay: 是否开始播放，从头开始，第1帧播放
   * 		starlength: 高级设置传参数，谨慎使用，因不同网络环境，必须大于执行图片数量的2/3，最好图片都加载完执行
   * 		pauseplay: 是否暂停播放，不销毁
   * 		restartplay: 是否开始播放，从暂停的帧数开始播放
   * 		gotoplayarray: 直接跳到第i帧，开始播放，i必选。type:number。gotoplayarray(startnum,endnum),startnum开始帧数，endnum结束帧数
   * 		flashbackplay: 配合loop使用，该项可选。如果设置为true，循环播放的时候会回播。
   * 		useCanvas: 是否用CANVAS播放动画，该项可选。如果设置为false，则使用IMG播放。
   * 		options： 播放参数，该项可选
   * 		destroy(): 清除所有动画及监听事件。
   *        CB 动画结束时回调，只在一次性动画时有效
   *
   * 
   * 
   */
const projectName = 'canvas-gif-common'; // 项目名称
const LO = window.location.origin; // 当前URL
const UA = navigator.userAgent; // 用来区分设备和浏览器

// 安卓微信存在黑屏风险，不能使用 canvas
// const isAndroidWeixin = /Android|Adr/i.test(UA) && /MicroMessenger/i.test(UA);
const isAndroidWeixin = true; // 测试安卓
// isAndroidWeixin = 1;

module.exports = class CanvasGif {
  	constructor(dom, obj) { 	
		const T = this;
    		const creatcanvas = document.createElement('canvas'); 	       
	    const {
    	  		useCanvas,
	      	imgType,
	      	imgArr,
	      	start,
	      	over,
	      	interval, 
	      	autoplay, 
	      	loop, 
	      	startplay,
	      	starlength,
	      	pauseplay,
	      	restartplay,
	      	flashbackplay,
	      	gotoplayarray,
	      	options,
	      	CB,
	      	destroy,
	    } = obj;
    		//Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
		//Object.assign(target, ...sources)    【target：目标对象】，【souce：源对象（可多个）】
		//举个栗子：
		/*
		 	const object1 = {
			  	a: 1,
			  	b: 2,
			  	c: 3
			};	
			const object2 = Object.assign({c: 4, d: 5}, object1);
			console.log(object2.c, object2.d); // 3,5
			console.log(object1)  // { a: 1, b: 2, c: 3 }
			console.log(object2)  // { c: 3, d: 5, a: 1, b: 2 }
		*/
    		Object.assign(T,obj,{dom},{creatcanvas}); // 复制到目标对象
    		// console.log('初始化T：',T,T.creatcanvas);
    		console.log('初始化T：',T,T.dom);
    		// 可能存在部分机型，安卓微信环境下，使用canvas，安卓微信存在黑屏风险，不能使用canvas，
    		// 确保功能的完整使用，使用img方法执行序列帧动画
    		// 判断区分设备和浏览器，环境
    		// 若isAndroidWeixin的值为false，为非安卓微信环境，true为安卓微信环境
    		if (!isAndroidWeixin) {  // 非安卓微信环境，执行语句
	    		// 判断是否使用canvas来执行序列帧动画
		    if(T.useCanvas){ // 获取传过来的参数useCanvas，来决定使用哪种方法执行序列帧动画，true使用canvas，false使用img	
		    		T.dom.append(T.creatcanvas); // 创建canvas元素标签dom节点
      			T.pen = T.creatcanvas.getContext('2d'); // 获取2d画笔
      			T.creatcanvas.id = T.canvasid; // 创建canvas元素，id选择标签属性
		    		T.creatcanvas.width = T.canvaswidth; // 设置canvas宽度，播放动画图片的宽度，注意，为播放图片的宽度，与样式里的宽度概念不同
		    		T.creatcanvas.height = T.canvasheight; // 设置canvas高度，播放动画图片的高度，注意，为播放图片的高度，与样式里的高度概念不同
		    		// creatcanvas.style = T.canvasstyle; // 简单样式传参方法，传参直接拼成样式字符串
		    		T.creatcanvas.style = `width: ${T.canvasstyle.width};height: ${T.canvasstyle.height};overflow: ${T.canvasstyle.overflow};`;
		    		// 对象样式传参方法，对象拼接样式字符串
		    		// 设置canvas的宽，高，超出是否隐藏等样式，以375的移动端宽度为例，必须，否则不兼容，会出现图片溢出
		    		// console.log('0,T',T,T.useCanvas);
		    		// console.log('0,样式',`width: ${T.canvasstyle.width};height: ${T.canvasstyle.height};overflow: ${T.canvasstyle.overflow};`);
		    		console.log('useCanvas的传参值为true，使用canvas方法执行序列帧动画');
		    } else { // useCanvas的传参值为false，使用img方法执行序列帧动画
		    		const img = new Image();
	        		img.setAttribute('crossOrigin', 'anonymous');
	        		console.log('useCanvas的传参值为false，使用img方法执行序列帧动画');
		    }
	    } else { //安卓微信环境，执行语句
	    		if(T.useCanvas){ // 获取传过来的参数useCanvas，来决定使用哪种方法执行序列帧动画，true使用canvas，false使用img	
		    		T.dom.append(T.creatcanvas); // 创建canvas元素标签dom节点
      			T.pen = T.creatcanvas.getContext('2d'); // 获取2d画笔
      			T.creatcanvas.id = T.canvasid;
		    		T.creatcanvas.width = T.canvaswidth; // 设置canvas宽度，播放动画图片的宽度，注意，为播放图片的宽度，与样式里的宽度概念不同
		    		T.creatcanvas.height = T.canvasheight; // 设置canvas高度，播放动画图片的高度，注意，为播放图片的高度，与样式里的高度概念不同
		    		// creatcanvas.style = T.canvasstyle; // 简单样式传参方法，传参直接拼成样式字符串
		    		T.creatcanvas.style = `width: ${T.canvasstyle.width};height: ${T.canvasstyle.height};overflow: ${T.canvasstyle.overflow};`;
		    		// 对象样式传参方法，对象拼接样式字符串
		    		// 设置canvas的宽，高，超出是否隐藏等样式，以375的移动端宽度为例，必须，否则不兼容，会出现图片溢出
		    		// console.log('0,T',T,T.useCanvas);
		    		// console.log('0,样式',`width: ${T.canvasstyle.width};height: ${T.canvasstyle.height};overflow: ${T.canvasstyle.overflow};`);
		    		console.log('useCanvas的传参值为true，使用canvas方法执行序列帧动画');
		    } else { // useCanvas的传参值为false，使用img方法执行序列帧动画
		    		const img = new Image();
	        		img.setAttribute('crossOrigin', 'anonymous');
	        		console.log('useCanvas的传参值为false，使用img方法执行序列帧动画');
		    }
	    }
    		//console.log('初始化T2：',T.useCanvas,T.canvasstyle);    		
    		T.imgArr = [];// 图片的数组
    		T.promiseArr = [];// promise 的数组，等图片加载完成才能执行 gif
    		T.timer = null;
    		const loadImg = function playimg(useCanvas, imgTypes, starts, overs) {
      		// canvasimgdatas.forEach((I, i) => { // 在封装组件里写动画数组图片，被遗弃的写法，采用高级传云图片数组参数
	      	imgTypes.forEach((IMGarry, i) => { // 循环遍历播放图片数组
	        		// 匹配下标
	        		// const index = i;
	        		const img = new Image();
	        		img.setAttribute('crossOrigin', 'anonymous');
	        		// img.src = `${urlPrefix}assets/images/${imgType}${index}.png`; // 被遗弃的写法
	        		img.src = IMGarry.url;
	        		T.imgArr.push(img);
		        // console.log(imgTypes[i], i);
		        // console.log('图片路径', img.src);
		        // isAndroidWeixin && T.dom.append(img); // 旧写法
		        // T.imgArr.push(img); // 旧写法
		        // 前十张图加载完才能动画
		        // if (i < 10) { // 旧写法
		        //   T.promiseArr.push(new Promise(((resolve) => {
		        //     img.onload = resolve;
		        //   })));
		        // }
		        // 安卓微信环境，执行语句，构建img执行
		        if (isAndroidWeixin) {
		        		if(!T.useCanvas){
		          		T.dom.append(img);
		          	}
		        }
		        // 判读图片加载完多少张，开始执行序列帧动画
	        		// 前15张图加载完才能动画，高级设置传参数，谨慎使用，因不同网络环境，必须大于执行图片数量的2/3，最好图片都加载完执行
		        if(T.starlength){ // 提前预加载，边加载边播放，高级设置传参数，开启
		        		if (i < T.starlength) { // 前预加载，高级设置传参数，到达设置值，提前预加载播放
			          	T.promiseArr.push(new Promise(((resolve) => { // 加载完图片
			            		img.onload = resolve;
		          		})));
		        		}
		        } else { // 提前预加载播放，边加载边播放，高级设置传参数，未开启，默认加载完播放
		        		if (i < T.imgArr.length) { // 到达图片数量，加载播放
			          	T.promiseArr.push(new Promise(((resolve) => { // 加载完图片
			            		img.onload = resolve;
		          		})));
		        		}
		        } 
	      	});
    		};
    		loadImg(useCanvas, imgType, start, over); // 加载图片
    		// autoplay && T.animate(); // 旧写法
    		// 是否开启自动播放
    		if (autoplay) { // 值为true，开启，初始化canvas组件时，加载完图片，自动触发播放
      		T.animate(); // gif播放
    		}
  	}

  	/*
    * gif播放
    * 
    */
  	animate() {
    		const T = this;
	    const {
	      pen, dom, imgArr, promiseArr, interval, loop, CB, flashbackplay, count, gotoplay_gif, success_info
	    } = T; // 参数值
	    clearInterval(T.timer); // 防止叠加触发，每次触发运行，清除前一次缓存
	    T.success_info = ''; // 额外动画播放完成，提供的返回参数值
	    Promise.all(promiseArr).then(() => {
	    		if(T.gotoplayarray) { // 是否直接跳到第i帧，开始播放，设置了，开始帧数，结束帧数，否则，默认顺序播放
		    		if(T.flashbackplay){ //倒叙播放
			    		if(T.count){	 // 暂停当前帧数，从当前帧数继续播放，但是从设置的开始帧数起步	
			    			if(!(T.count >T.gotoplayarray[0] && T.count < T.gotoplayarray[1])){
			    				T.count = T.gotoplayarray[1];
			    			}
			    			console.log('计数', T.count);
			    		} else { // 暂停当前帧数，销毁了，从新开始播放
			    			// let i = T.imgArr.length -1;
			        		// T.count = i;
			        		T.count = T.gotoplayarray[1];
			    		}
			    	} else { // 正常顺序播放
			    		if(T.count){	 // 暂停当前帧数，从当前帧数继续播放，但是从设置的开始帧数起步	
			    			if(!(T.count >=T.gotoplayarray[0] && T.count <T.gotoplayarray[1])){
			    				T.count = T.gotoplayarray[0];
			    			}
			    			// T.count = T.gotoplayarray[0];
			    			console.log('计数', T.count);
			    		} else { // 暂停当前帧数，销毁了，从新开始播放，但是从设置的开始帧数起步
			    			// let i = 0;
			        		// T.count = i;
			        		T.count = T.gotoplayarray[0];
			    		}
			    	}
			    	console.log('启用直接跳到第i帧', T.gotoplayarray);
			} else { // 不启用直接跳到第i帧功能，默认顺序播放
				if(T.flashbackplay){ //倒叙播放
			    		if(T.count){	 // 暂停当前帧数，从当前帧数继续播放			
			    			console.log('计数', T.count);
			    		} else { // 暂停当前帧数，销毁了，从新开始播放
			    			let i = T.imgArr.length -1;
			        		T.count = i;
			    		}
			    	} else { // 正常顺序播放
			    		if(T.count){	 // 暂停当前帧数，从当前帧数继续播放   			
			    			console.log('计数', T.count);
			    		} else { // 暂停当前帧数，销毁了，从新开始播放
			    			let i = 0;
			        		T.count = i;
			    		}
			    	}
				console.log('不启用直接跳到第i帧', T.gotoplayarray);
			}
	    		// let i = 0;
	        // 第一张先显示出来
	        // console.log(imgArr[0]);
	        console.log('计数',T.count,T.flashbackplay);
	        console.log(dom);
	        // 是否安卓微信环境，运行动画
	        if (isAndroidWeixin) { // 安卓微信环境
	        		// const canvas = document.createElement('canvas');
	        		// T.dom.append(canvas);
		      	// T.pen = canvas.getContext('2d'); // 获取画笔
	          	// T.pen.drawImage(imgArr[i], 0, 0);
	          	// 是否使用canvas画布功能，运行动画
          		if(T.useCanvas){ // 使用canvas画布功能，运行动画
		          	if(T.gotoplayarray) { // 是否直接跳到第i帧，开始播放，设置了，开始帧数，结束帧数，否则，默认顺序播放
			          	if(T.flashbackplay){ //倒叙播放
			          		T.pen.drawImage(imgArr[T.count], 0, 0);
			          	} else { // 正常顺序播放
			          		T.pen.drawImage(imgArr[T.count], 0, 0);
			          	}
			         } else { // 不启用直接跳到第i帧功能，默认顺序播放
			         	if(T.flashbackplay){ //倒叙播放
			          		T.pen.drawImage(imgArr[T.count], 0, 0);
			          	} else { // 正常顺序播放
			          		T.pen.drawImage(imgArr[T.count], 0, 0);
			          	}
			         }
		         } else {
		         	imgArr.forEach((imgArrshow, i) => { // 循环遍历播放图片数组
		         		imgArrshow.style.display = 'none';
		         	});
		         	if(T.gotoplayarray) { // 是否直接跳到第i帧，开始播放，设置了，开始帧数，结束帧数，否则，默认顺序播放
			          	if(T.flashbackplay){ //倒叙播放
			          		// T.pen.drawImage(imgArr[T.count], 0, 0);
			          		T.dom.children[T.count ? T.count - 1 : imgArr.length - 1].style.display = 'none';
		            			T.dom.children[T.count].style.display = 'block';
			          	} else { // 正常顺序播放
			          		// T.pen.drawImage(imgArr[T.count], 0, 0);
			          		T.dom.children[T.count ? T.count - 1 : imgArr.length - 1].style.display = 'none';
		            			T.dom.children[T.count].style.display = 'block';
			          	}
			         } else { // 不启用直接跳到第i帧功能，默认顺序播放
			         	if(T.flashbackplay){ //倒叙播放
			          		// T.pen.drawImage(imgArr[T.count], 0, 0);
			          		T.dom.children[T.count ? T.count - 1 : imgArr.length - 1].style.display = 'none';
		            			T.dom.children[T.count].style.display = 'block';
		            			console.log('不启用直接跳到第i帧功能倒叙播放',T);
			          	} else { // 正常顺序播放
			          		// T.pen.drawImage(imgArr[T.count], 0, 0);
			          		T.dom.children[T.count ? T.count - 1 : imgArr.length - 1].style.display = 'none';
		            			T.dom.children[T.count].style.display = 'block';
			          	}
			         }
		         }
	          // dom.children[i].style.display = 'block';
	        } else { // 非安卓微信环境    		
		      	// console.log(T.dom);
		      	console.log(T);
	      		// T.dom.append(canvas);
	      		// T.pen = canvas.getContext('2d'); // 获取画笔
	      		// T.dom.append(T.creatcanvas);
		      	// T.pen = T.creatcanvas.getContext('2d'); // 获取画笔
	          	// T.pen.drawImage(imgArr[i], 0, 0);
	          	if(T.gotoplayarray) { // 是否直接跳到第i帧，开始播放，设置了，开始帧数，结束帧数，否则，默认顺序播放
		          	if(T.flashbackplay){ //倒叙播放
		          		T.pen.drawImage(imgArr[T.count], 0, 0);
		          	} else { // 正常顺序播放
		          		T.pen.drawImage(imgArr[T.count], 0, 0);
		          	}
          		} else { // 不启用直接跳到第i帧功能，默认顺序播放
          			if(T.flashbackplay){ //倒叙播放
		          		T.pen.drawImage(imgArr[T.count], 0, 0);
		          	} else { // 正常顺序播放
		          		T.pen.drawImage(imgArr[T.count], 0, 0);
		          	}
          		}
	        }
	        // isAndroidWeixin ? dom.children[i].style.display = 'block' : pen.drawImage(imgArr[i], 0, 0); // 旧写法
	        T.timer = setInterval(() => { // 定时运行加载播放图片
	        		if(T.flashbackplay){ //倒叙播放
	        			T.count--;
	        		} else { // 正常顺序播放
	        			T.count++;
	        		}
	        		//i = T.count;
	          	//i++;
	          	//T.count = i;
	          	// if (i === imgArr.length) {
	          	if(T.gotoplayarray) { // 是否直接跳到第i帧，开始播放，设置了，开始帧数，结束帧数，否则，默认顺序播放
		          	if(T.flashbackplay){ //倒叙播放
			          	if (T.count === (T.gotoplayarray[0] -2)) { // 播放完了一遍 // 是否直接跳到第i帧功能，到了倒叙播放结束帧数
				            // 是否开启了循环
				            if (loop) { // 开启了循环
				              // i = 0;
				              T.count = T.gotoplayarray[1] -1;
				            } else { // 没有开启循环，播放1次完整动画，结束
				              clearInterval(T.timer); // 结束动画运行，不销毁，保留设置的初始化参数
				              T.success_info = true; // 额外动画播放完成，提供的返回参数值
				              if (CB) {
				                CB();
				              }
				              return;
				            }
			          	}
			          	// console.log('当前倒叙播放',T.count);
		          	} else { // 正常顺序播放
		          		if (T.count === T.gotoplayarray[1]) { // 播放完了一遍 // 是否直接跳到第i帧功能，到了顺序播放结束帧数
				            // 是否开启了循环
				            if (loop) { // 开启了循环
				              // i = 0;
				              T.count = T.gotoplayarray[0]; // 是否直接跳到第i帧功能，重置到开始帧数
				            } else { // 没有开启循环，播放1次完整动画，结束
				              clearInterval(T.timer); // 结束动画运行，不销毁，保留设置的初始化参数
				              T.success_info = true; // 额外动画播放完成，提供的返回参数值
				              if (CB) {
				                CB();
				              }
				              return;
				            }
			          	}
		          		// console.log('当前正常播放',T.count);
		          	}
	          	} else { // 不启用直接跳到第i帧功能，默认顺序播放
	          		if(T.flashbackplay){ //倒叙播放
			          	if (T.count === -1) { // 播放完了一遍 // 到了倒叙播放结束帧数
			          		// 是否开启了循环
				            if (loop) { // 开启了循环
				              // i = 0;
				              T.count = T.imgArr.length -1;
				            } else { // 没有开启循环，播放1次完整动画，结束
				              clearInterval(T.timer); // 结束动画运行，不销毁，保留设置的初始化参数
				              T.success_info = true; // 额外动画播放完成，提供的返回参数值
				              T.count = '';
				              if (CB) { 
				                CB();
				              }
				              return;
				            }
			          	}
			          	// console.log('当前倒叙播放',T.count);
		          	} else { // 正常顺序播放
		          		if (T.count === imgArr.length) { // 播放完了一遍 // 到了顺序播放结束帧数
		          			// 是否开启了循环
				            if (loop) { // 开启了循环
				              // i = 0;
				              T.count = 0;
				            } else { // 没有开启循环，播放1次完整动画，结束
				              clearInterval(T.timer); // 结束动画运行，不销毁，保留设置的初始化参数
				              T.success_info = true; // 额外动画播放完成，提供的返回参数值
				              T.count = '';
				              if (CB) {
				                CB();
				              }
				              return;
				            }
			          	}
		          		// console.log('当前正常播放',T.count);
		          	}
	          	}
	          	// 是否安卓微信环境，运行动画
	          	if (isAndroidWeixin) { // 安卓微信环境
	          		// 是否使用canvas画布功能，运行动画
	          		if(!T.useCanvas){ // 不使用canvas画布功能，运行动画
		            		//T.dom.children[i ? i - 1 : imgArr.length - 1].style.display = 'none';
		            		//T.dom.children[i].style.display = 'block';
		            		T.dom.children[T.count ? T.count - 1 : imgArr.length - 1].style.display = 'none';
		            		T.dom.children[T.count].style.display = 'block';
		           	} else {
		           		T.pen.clearRect(0, 0, 750, 1424);
	            			// T.pen.drawImage(imgArr[i], 0, 0);
	            			T.pen.drawImage(imgArr[T.count], 0, 0);
	            			// console.log('当前',T.count);
		           	}
	          	} else { // 非安卓微信环境
	            		if(!T.useCanvas){ // 不使用canvas画布功能，运行动画
		            		// T.dom.children[i ? i - 1 : imgArr.length - 1].style.display = 'none';
		            		// T.dom.children[i].style.display = 'block';
		            		T.dom.children[T.count ? T.count - 1 : imgArr.length - 1].style.display = 'none';
		            		T.dom.children[T.count].style.display = 'block';
		           	} else { // 使用canvas画布功能，运行动画
		           		T.pen.clearRect(0, 0, 750, 1424);
	            			// T.pen.drawImage(imgArr[i], 0, 0);
	            			T.pen.drawImage(imgArr[T.count], 0, 0);
		           	}
	          	}
	        }, interval);
  		});
  	}
  	
	/*
  	* 暂停
	* 
    */
 	pause() {
		clearInterval(this.timer);
  	}
 	/*
  	* 暂停销毁
	* 
    */
 	destroy() {
 		const T = this;
 		T.count = '';
 		T.success_info = '';
 		T.gotoplayarray = '';
 		T.flashbackplay = '';
		clearInterval(this.timer);
		console.log('暂停销毁',T);
  	}
 	/*
  	* 顺序播放帧动画
	* 
    */
 	normalplay() {
 		const T = this;
 		T.flashbackplay = false;
 		T.animate();
 		console.log('倒叙播放帧动画',T);
 	}
 	/*
  	* 倒叙播放帧动画
	* 
    */
 	backplay() {
 		const T = this;
 		T.flashbackplay = true;
 		T.animate();
 		console.log('倒叙播放帧动画',T);
 	}
 	/*
  	* 直接跳到第i帧，开始播放，i必选。type:number。gotoplayarray(startnum,endnum),startnum开始帧数，endnum结束帧数，播放帧动画
	* 
    */
 	gotoplay(s,e) {
 		const T = this;
 		T.gotoplayarray = [s,e];
 		console.log('直接跳到第i帧，开始播放帧动画',T,s,e,T.gotoplayarray);
 	}
 	/*
  	* 完成帧动画，播放结束
	* 
    */
 	oncompleteplay() {
 		const T = this;
 		console.log('完成帧动画，播放结束',T,T.success_info);
 	}
};
