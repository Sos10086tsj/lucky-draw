!(function(){
    'use strict';

    var file_num = 43;
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
            },100);
        }else{
        	
        	//保存获奖用户
            var imgSrc = $('#gallery li.focus a img').attr("src");
            var index = imgSrc.substring(6,imgSrc.length - 4);
            
            var winner = users.userList[index];
            users.prizeWinnerList.push(parseInt(index));
            
            console.info(users.prizeWinnerList);
            
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
    }
})();
