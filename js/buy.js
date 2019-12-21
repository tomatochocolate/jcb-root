$(function () {
	var selectGoodId = 0;// 当前选择的产品套餐
	var token = getToken();

	if (token.length <= 0) {
		$('#goods').html('请先&nbsp;&nbsp;<a href="login.html">登录</a>')
		$('#con').html('');
	} else {
		$.ajax({
			url: (apiUrl + '/api/qt/goods'),
			cache: false,
			type: 'post',
			beforeSend: function (xhr) {
				xhr.setRequestHeader('token', token);
			},
			success: function (json) {
				if (json.code == 0) {
					setGoodsList(typeof json.data == 'string' ? eval('(' + json.data + ')') : json.data);
					return;
				}
				$('#goods').html(json.msg);
				$('#con').html('');
			},
			error: function (jqXHR, textStatus, errorThrown) {
				$('#goods').html('发生错误，HTTP代码是' + (jqXHR ? jqXHR.status : '未知'));
				$('#con').html('');
			},
			complete: function () {//无论成功还是失败，都会调用此函数
			}
		});
	}

	function setGoodsList(list) {
		var str = '';
		for (var i = 0; i < list.length; i++) {
			var _id = list[i].id;
			var _price = list[i].price;
			var _priceDay = list[i].priceDay;
			var _title = list[i].title;
			var _priceShow = list[i].priceShow;
			var _priceSave = list[i].priceSave;
			str += '<li>';
			str += '<div class="main">';
			str += '<span class="days">' + _title + '</span><span class="price">￥' + _price + '</span><span class="buy">';
			str += '<a href="#" goodId="' + _id + '" class="btn"><i class="icon"><img src="../image/buy.png" alt=""></i><span>购买</span></a>';
			str += '</span>';
			str += '</div>';
			str += '<div class="info">';
			str += '<span class="average">￥' + ((_priceDay + '').substring(0, 8)) + '/天</span>';
			str += '</div>';
			str += '</li>';
		}
		// str += '<li><div class="main"><div class="card">卡序列号兑换:<span class="buy"><a href="card.html" goodid="104" class="tocard"><span>兑换</span></a></span></div></div><div class="info"></div></li>'
		$('#goods').html(str);

		$(".product .btn").click(function () {
			selectGoodId = $(this).attr('goodId');//设置当前选择的产品套餐
			$(".buylist").addClass("show");//显示选择支付方式

			$(".buylist .close").click(function () {//关闭 不支持
				selectGoodId = 0; //清空当前选择的产品套餐
				$(".buylist").removeClass("show");//隐藏选择支付方式
			});

			$(".buylist .alipay").click(function () {//选择 支付宝
				goPay('alipay');
			});

			$(".buylist .wechat").click(function () {//选择 微信
				goPay('wechat');
			});

		});
	}

	function goPay(payChannel) {
		//showMessage('selectGoodId='+selectGoodId+'\npayChannel='+payChannel+'\ntoken='+token);
		$('#payload').show();
		$.ajax({
			url: (apiUrl + '/api/qt/pay'),
			cache: false,
			type: 'post',
			data: { goodsId: selectGoodId, payChannel: payChannel },
			beforeSend: function (xhr) {
				xhr.setRequestHeader('token', token);
			},
			success: function (json) {

				if (json.code == 0) {
					//showMessage(json.data.payUrl);
					var _json = (typeof json.data == 'string' ? eval('(' + json.data + ')') : json.data);
					var orderNo = _json.orderNo;
					var payUrl = _json.payUrl;

					if (orderNo.length > 0 && payUrl.length > 0) {
						setCookie('orderNo', orderNo, 5 * 60 * 1000);//5分钟有效
						$('#payloadText').html('请在新窗口完成支付后，回到订单页面刷新查看');
						window.open(payUrl, '_blank');
					} else {
						$('#payload').hide();
						showMessage('请求返回不存在有效的订单编号或支付URL',"error");
					}
					return;
				}
				$('#payload').hide();
				showMessage(json.msg,"error");
			},
			error: function (jqXHR, textStatus, errorThrown) {
				showMessage('发生错误，HTTP代码是' + (jqXHR ? jqXHR.status : '未知',"error"));
			},
			complete: function () {//无论成功还是失败，都会调用此函数
			}
		});
	}

	// 适配移动端
	function isHide(flag) {
		if (flag == false) {
			$(".product").attr("style", "margin-top:0px")
			$("input").focus(function () {
				var wHeight = window.innerHeight;   //获取初始可视窗口高度  
				window.addEventListener('resize', function () {       //监测窗口大小的变化事件  
					var hh = window.innerHeight;     //当前可视窗口高度  
					var viewTop = $(window).scrollTop();   //可视窗口高度顶部距离网页顶部的距离  
					if (wHeight > hh) {           //可以作为虚拟键盘弹出事件  
						$(".content").animate({ scrollTop: viewTop + 200 });    //调整可视页面的位置  
					} else {         //可以作为虚拟键盘关闭事件  
						$("content").animate({ scrollTop: viewTop - 200 });
					}
					wHeight = hh;
				});
			})
		}
	}

	function IsPC() {
		var userAgentInfo = navigator.userAgent;
		var Agents = [
			"Android",
			"iPhone",
			"SymbianOS",
			"Windows Phone",
			"iPad",
			"iPod"
		];
		var flag = true;

		for (var v = 0; v < Agents.length; v++) {
			if (userAgentInfo.indexOf(Agents[v]) > 0) {
				flag = false;
				break;
			}
		}

		return isHide(flag);
	}
	IsPC();
})