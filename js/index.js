var index = {
    menuSelect : function(){
        var prizeName = $("#js_prizes_menu").val();

        //清空获奖人列表，如果已经抽奖过，显示已经获奖的用户信息
        //$("#js_prize_winner").find("li").remove();
        $("#js_prize_winner").html("");
        var html = '';
        for(var i in users.prizeWinnerResult){
            var winnerResult = users.prizeWinnerResult[i];
            if(winnerResult.prize == prizeName){
                html += winnerResult.winnerName;
                if(i < users.prizeWinnerResult.length - 1){
                    html += "、";
                }
            }
        }
        $("#js_prize_winner").html(html);
    },

    showPrizeInfo : function(name, amount, prize, price){
        $("#js_prize_name").html(name);
        $("#js_prize_prize").html(prize);
        $("#js_prize_price").html(price);

        //清空获奖人列表，如果已经抽奖过，显示已经获奖的用户信息
        $("#js_prize_winner").find("li").remove();
        for(var i in users.prizeWinnerResult){
            var winnerResult = users.prizeWinnerResult[i];
            if(winnerResult.prize == name){
                var li = document.createElement('li');
                var text = document.createTextNode(winnerResult.winnerName);
                li.appendChild(text);
                $("#js_prize_winner")[0].appendChild(li);
            }
        }
    },

    handleWinner : function(){
        var imgSrc = $('#gallery li.focus a img').attr("src");
        var index = imgSrc.substring(6,imgSrc.length - 4);
        index = parseInt(index);
        //1. 保存到获奖人列表
        var winner = users.userList[index];
        users.prizeWinnerList.push(index);

        //2. 保存获奖结果
        var prizeName = $("#js_prizes_menu").val();
        var winnerResult = {
            prize : prizeName,
            winnerName : winner.name
        }
        users.prizeWinnerResult.push(winnerResult);


        //展示获奖人列表
        //var li = document.createElement('li');
        //var text = document.createTextNode(winner.name);
        //li.appendChild(text);
        //$("#js_prize_winner")[0].appendChild(li);
        var html = $("#js_prize_winner").html();
        if(html && html.length > 0){
            html += "、";
        }
        html += winner.name;
        $("#js_prize_winner").html(html);
    }
}
!(function(){
    'use strict';

    var file_num = 16;
    var photo_row = 5;
    var photo_col = 5;
    var photo_num = photo_row * photo_col;
    var gallery = $('#gallery');
    var photos = [];

    for (var i=0; i<photo_num; i++){
        //photos.push('photo/'+Math.ceil(Math.random()*file_num)+'.jpg');
    	photos.push('photo/'+ i +'.jpg');
    }

    var loadedIndex = 1;

    $.each(photos, function(index, photo){
        var img = document.createElement('img');
        var link = document.createElement('a');
        var li = document.createElement('li');

        link.href = 'javascript:;';
        link.appendChild(img);
        li.appendChild(link);

        gallery[0].appendChild(li);

        img.onload = function(e){
            img.onload = null;
            setTimeout( function(){
                $(li).addClass('loaded');
            }, 10*loadedIndex++);
        };

        img.src = photo;

        /* 此方式会将重复图片连在一起输出
        var img = document.createElement('img');

        img.onload = function(e){
            img.onload = null;
            var link = document.createElement('a');
            var li = document.createElement('li');

            link.href = '#';
            link.appendChild(this);
            li.appendChild(link);

            gallery[0].appendChild(li);

            setTimeout(function(){
                $(li).addClass('loaded');
            }, 25*loadedIndex++);
        };
        img.src = photo;
        */
    });

    var timer_big, timer_small;
    var timer_small_slow = setInterval(function(){
        $('#gallery li:eq('+Math.ceil(Math.random()*photo_num)+')')
            .addClass('animated bounce')
            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this)
                    .removeClass('animated bounce')
                    .find('img')
                    .attr('src','photo/'+Math.ceil(Math.random()*file_num)+'.jpg')

            });
    },100);

    $(document).keypress(function(event){
        if(event.which == 13 || event.which == 32) {
            $('#action').click();
        }
    });

    $('#action').click(function(){
        if (timer_small_slow){
            clearInterval(timer_small_slow);
        }
        if ($(this).data('action') == 'start'){
            $(this).data('action','stop').html('Stop');
            timer_big = setInterval(function(){
            	$('#gallery li.focus').removeClass('focus hover');
            	var index = getRandomIndex(photo_num);
                $('#gallery li:eq('+ index +')').addClass('focus');
            },100);
            timer_small = setInterval(function(){
            	$('#gallery li:eq('+Math.ceil(Math.random()*photo_num)+') img').attr('src','photo/'+Math.ceil(Math.random()*file_num)+'.jpg');
            },1);
        }else{
        	
        	//保存获奖用户
            index.handleWinner();
            
            $(this).data('action','start').html('Go');
            $('#gallery li.focus').addClass('hover');
            
            clearInterval(timer_big);
            clearInterval(timer_small);
        }
    });

    //获取未获奖index
    var getRandomIndex = function(photo_num){
    	var calNu = photo_num - 1;
    	var index = Math.ceil(Math.random()*calNu);
    	while(checkIsWinner(index)){
    		index = Math.ceil(Math.random()*calNu);
    	}
    	return index;
    };
    
    //比对图片index是否已经获奖
    var checkIsWinner = function(index){
    	var imgSrc = $('#gallery li:eq('+ index +') a img').attr("src");
    	var imgIndex = imgSrc.substring(6,imgSrc.length - 4);
    	var exist = $.inArray(parseInt(imgIndex), users.prizeWinnerList);
    	if(exist == -1){
    		return false;
    	}
    	return true;
    };

    //初始化菜单列表
    var initMenu = function(){
        var menu = $("#js_prizes_menu");
        for(var i in prizes.prizeSettings){
            var prize = prizes.prizeSettings[i];
            var link = document.createElement('a');
            var li = document.createElement('li');
            var text = document.createTextNode(prize.name);

            link.href = '#';
            link.setAttribute("onclick", "index.showPrizeInfo('"
                + prize.name + "','"
                + prize.amount + "','"
                + prize.prize + "','"
                + prize.price
                + "');return false;");
            link.appendChild(text);

            li.appendChild(link);

            menu[0].appendChild(li);
        }
    };

    var initSelectMenu = function(){
        var select = $("#js_prizes_menu");
        for(var i in prizes.prizeSettings){
            var prize = prizes.prizeSettings[i];
            var option = '<option value='
            + prize.name
            + '>'
            + prize.name
            + '</option>';
            select.append(option);
        }
    };

   // initMenu();
    initSelectMenu();
})();
