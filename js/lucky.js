/**
 * Created by Paris on 2016/12/12.
 */
var lucky = {
    tmpWinner : null,
    //update draw title
    init:function(){
        if(lucky.tmpWinner == undefined || lucky.tmpWinner == null){
            lucky.tmpWinner = new Array();
            if(data.result != undefined){
                for(var i in data.result){
                    if(i != undefined){
                        for(var j in data.result[i]){
                            lucky.tmpWinner.push(data.result[i][j].name + '@' + data.result[i][j].phone);
                        }
                    }
                }
            }
        }
        //init prizes
        var prizeSelect = $('#js_prizes_menu');
        prizeSelect.empty();
        for(var i in data.prizes){
            var prize = data.prizes[i];
            if(i == 0){
                lucky.displayResult(prize.id);
            }
            prizeSelect.append('<option value="' + prize.id + '">' + prize.name + '</option>');
        }
    },
    displayResult:function(id){
        var names = '';
        var winners = data.result[id];
        if(winners != undefined && winners.length > 0){
            for(var i in winners){
                var winner = winners[i];
                names += winner.photo + '@' + winner.phone + '@@';
            }
        }
        $('#js_prize_display').html(lucky.formatWinnerDisplay(names));
    },
    formatWinnerDisplay:function(names){
        if(undefined == names || null == names || names.length == 0){
            return names;
        }
        var nameList = names.split('@@');
        var html = '';
        for(var i in nameList){
            if(undefined != nameList[i] && nameList[i].length > 0){
                var namePhone = nameList[i].split('@');
                html += '<div style="text-align:center;font-size: 16px;width: 125px;float: left;margin-top: 10px;"><img style="vertical-align: middle;" width="30px;"  src="photo/'
                    + namePhone[0]
                    + '"></src>';
                var phone = namePhone[1];
                if(undefined != phone && null != phone && phone.length != 0){
                    html += '<span>' + lucky.displayPhone(phone) + '</span></div>';
                }
            }
        }
        return html;
    },

    displayPhone : function(phone){
        if(undefined == phone || null == phone || phone.length == 0){
            return phone;
        }
        if(phone.length == 11){
            return phone.substr(0,3) + '****' + phone.substr(7);
        }
        return phone;
    },

    prizeChange:function() {
        var id = $('#js_prizes_menu').val();
        lucky.displayResult(id);
    },

    getWinnerPhoto:function(){
        var userNumbers = data.photos.length;
        var calNu = userNumbers - 1;
        var index = lucky.randomNumBoth(0,calNu);
        while(lucky.userAlreadWin(index)){
            index = lucky.randomNumBoth(0,calNu);
        }
        var user = data.photos[index];
        return 'photo/' + user.photo;
    },
    userAlreadWin : function(index){
        var user = data.photos[index];
        var tmpKey = user.name + '@' + user.phone;
        if(-1 == $.inArray(tmpKey,lucky.tmpWinner)){
            return false;
        }
        return true;
    },
    getRandomPhoto:function(){
        var userNumbers = data.photos.length;
        var calNu = userNumbers - 1;
        var index = lucky.randomNumBoth(0,calNu);
        var user = data.photos[index];
        return 'photo/' + user.photo;
    },
    handlerWinner:function(){
        var imgSrc = $('#gallery li.focus a img').attr("src");
        var photo = imgSrc.substring('photo/'.length);
        for(var i in data.photos){
            var user = data.photos[i];
            if(user.photo == photo){
                lucky.tmpWinner.push(user.name + '@' + user.phone);
                var prizeId = $('#js_prizes_menu').val();
                var prizeResultList;
                if(undefined == data.result[prizeId]){
                    prizeResultList = new Array();

                }else{
                    prizeResultList = data.result[prizeId];
                }
                prizeResultList.push({
                    name : user.name,
                    phone : user.phone,
                    photo : user.photo
                });
                data.result[prizeId] = prizeResultList;
                lucky.displayResult(prizeId);
                break;
            }
        }
    },

    randomNumBoth:function(min,max){
        var range = max - min;
        var rand = Math.random();
        return min + Math.round(rand * range);
    }
}

$(function(){
    lucky.init();

    var file_num = data.photos.length;
    var photo_row = 8;
    var photo_col = 8;
    var photo_num = photo_row * photo_col;
    var gallery = $('#gallery');
    var photos = [];
    for(var i = 0; i < photo_num; i++){
        photos.push(lucky.getRandomPhoto());
    }
    var loadedIndex = 1;
    $.each(photos, function(index, photo){
        var img = document.createElement('img');
        var link = document.createElement('a');
        var li = document.createElement('li');
        li.setAttribute("style","width:60px;")

        link.href = 'javascript:;';
        link.appendChild(img);
        li.appendChild(link);

        gallery[0].appendChild(li);

        img.onload = function(e){
            img.onload = null;
            setTimeout( function(){
                $(li).addClass('loaded');
            }, 10 * loadedIndex++);
        };

        img.src = photo;
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
                var index = lucky.randomNumBoth(0,photo_num -1);
                $('#gallery li:eq('+ index +')').addClass('focus');
            },100);
            timer_small = setInterval(function(){
                $('#gallery li:eq('+ lucky.randomNumBoth(0,photo_num -1) +') img').attr('src',lucky.getRandomPhoto());
            },1);
        }else{
            $(this).data('action','start').html('Go');
            $('#gallery li.focus').addClass('hover');
            clearInterval(timer_big);
            clearInterval(timer_small);
            //保存得奖用户
            $('#gallery li.focus img').attr('src',lucky.getWinnerPhoto());
            lucky.handlerWinner();
        }
    });
})