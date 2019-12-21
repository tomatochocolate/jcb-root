$(function(){
    var token = getToken();
	if(token.length<=0){
		$('#orders').html('请先&nbsp;&nbsp;<a href="login.html">登录</a>')
	}else{
		$.ajax({
			url: (apiUrl+'/api/qt/pay/records'),
			cache: false,
			type: 'post',
			beforeSend: function(xhr) {
				xhr.setRequestHeader('token',token);
			},
			success: function (json) {
				if (json.code == 0 ) {
                    
                    if(json.data.total == 0){
                        $('#orders').html("<div>未购买套餐<div>");
                        return
                    }
					setOrderList( typeof json.data.data == 'string' ? eval('('+json.data.data+')') : json.data.data );
					return;
				}
				$('#orders').html(json.msg);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				$('#orders').html('发生错误，HTTP代码是' + (jqXHR ? jqXHR.status : '未知'));
			},
			complete: function () {//无论成功还是失败，都会调用此函数
			}
		});
	}

	
})
function setOrderList(list) {
    var str = '';
    for (var i = 0; i < list.length; i++) {
        var _goodsName = list[i].goodsName;
        var _addTime = list[i].addTime;
        var _total = list[i].total;
        str += '<li>';
        str += '<div class="info">';
        str += '<div class="name">'+_goodsName+'</div>';
        str += '<div class="time">'+_addTime+'</div>';
        str += '</div><div class="price">￥'+_total+'</div>';
        str += '<div class="clear"></div>';
        str += '</li>';
    }
    $('#orders').html(str);
}