var snsList ={
    kakao : "/ithink/review/kakao_json.do",
    fb : "/ithink/review/fb_json.do",
    ins : "/ithink/review/insta_json.do"
}

var total_sns_lst = [];
var fb_load_check = false;
var fb_next = "";
var fb_list = [];
var num = 1;

function getFBList(){
    var data = { uri : fb_next}

    if(fb_list.length < num*20 && fb_next != "end"){
        gFN_lodingS();
        gFN_ajaxPost2(data,snsList.fb,function(data){
            gFN_lodingE();
            try{
                //console.log(data);
                var profile = JSON.parse(data.paramData.profile);
                var strData = JSON.parse(data.paramData.data);
                var data = (strData.feed && strData.feed.data) || strData.data;
                var html = "";
                if(data.length != 0){
                    for(var i=0; i<data.length; i++){
                        if(data[i].full_picture !== undefined){
                            html += '<li class="face"><img src="'+data[i].full_picture+'" />';
                            html += '<a href="'+data[i].link+'" target="_blank">';
                            html += '<div class="user">'
                            html += '<span class="thum"><img src="'+profile.picture.data.url+'" /></span>'
                            html += '<dl><dt>'+profile.name+'</dt><dd>'+prettyDate(data[i].created_time)+'</dd></dl>'
                            html += '</div>'
                            html += '<span class="zoom"></span>'
                            html += '<span class="ca"><img src="/bf_img/sub/m_icon_fb.png" alt="페이스북"></span>';
                            html += '</a></li>';
                            fb_list.push(html);
                            total_sns_lst.push({data : html, type : "FB", date : data[i].created_time, toString: function(){return this.data;}});
                            html = "";
                        }
                    }
                    fb_next = (strData.feed && strData.feed.paging.next) || strData.paging.next;

                    if(fb_list.length < num*20) fb_next = "end";
                }else{
                    fb_next = "end";
                }
                fb_load_check = true;
            }catch(e){fb_load_check = true;}
        }, function(){fb_load_check = true;});
    }else{
        fb_load_check = true;
    }

}


var ins_load_check = false;
var ins_list = [];
var ins_lastId = "";
function getInsList(){
    var more = num || 1;
    var data = {MIN_ID : ins_lastId}
    if(ins_list.length < num*24){
        gFN_lodingS();
        gFN_ajaxPost2(data,snsList.ins,function(data){
            gFN_lodingE();
            try{
                var origin = JSON.parse(data.paramData.data);

                var profile_name = data.paramData.name;
                var profile_pic = data.paramData.img;
                var data = origin.graphql.hashtag.edge_hashtag_to_media.edges;
                ins_lastId = origin.graphql.hashtag.edge_hashtag_to_media.page_info.end_cursor;
                //console.log(data);
                if(data.length != 0){
                    var html = "";
                    for(var i=0; i<data.length; i++){
                        html += '<li class="instar"><img src="'+data[i].node.thumbnail_src+'" />'
                        html += '<a href="https://www.instagram.com/p/'+data[i].node.shortcode+'" target="_blank">';
                        html += '<div class="user">';
                        html += '<span class="thum"><img src="'+profile_pic+'" /></span>';
                        html += '<dl><dt>'+profile_name+'</dt><dd>'+prettyDate(parseInt(data[i].node.taken_at_timestamp) * 1000)+'</dd></dl>';
                        html += '</div>';
                        html += '<span class="zoom"></span>';
                        html += '<span class="ca"><img src="/bf_img/sub/m_icon_in.png" alt="인스타그램"></span>';
                        html += '</a></li>';
                        ins_list.push(html);
                        total_sns_lst.push({data : html, type : "IN", date : parseInt(data[i].node.taken_at_timestamp * 1000),toString: function(){return this.data;}});
                        html = "";
                    }
                    ins_load_check = true;
                    if(ins_list.length < num*24) ins_lastId = "end";
                }else{
                    ins_lastId = "end";
                }
            }catch(e){ins_load_check = true;}
        }, function(){ins_load_check = true;})
    }else{
        ins_load_check = true;
    }
}

var kk_load_check = false;
var kk_lastId = "";
var kk_lastId_save = "blank";
var kk_list = [];

function getKKList(){
    var more = num || 1;
    if(kk_list.length < num*24 && kk_lastId != kk_lastId_save && kk_lastId != "end"){
        if(kk_lastId != "") var id_data={last_id : kk_lastId};
        gFN_lodingS();
        gFN_ajaxPost2(id_data,snsList.kakao,function(data){
            gFN_lodingE();
            try{
                kk_lastId_save = kk_lastId;
                var profile = JSON.parse(data.paramData.profile);
                var data  = JSON.parse(data.paramData.data);
                //console.log(data);
                if(data.length != 0){
                    var html = "";
                    for(var i=0; i<data.length; i++){
                        if(data[i].media_type == 'PHOTO'){
                            html += '<li class="cacao"><img src="'+data[i].media[0].small+'" />';
                            html += '<a href="'+data[i].url+'" target="_blank">';
                            html += '<div class="user">';
                            html += '<span class="thum"><img src="'+profile.thumbnailURL+'" /></span>';
                            html += '<dl><dt>롯데푸드</dt><dd>'+prettyDate(data[i].created_at)+'</dd></dl>';
                            html += '</div>';
                            html += '<span class="zoom"></span>';
                            html += '<span class="ca"><img src="/bf_img/sub/m_icon_ca.png" alt="카카오스토리"></span>';
                            html += '</a></li>';
                            kk_list.push(html);
                            total_sns_lst.push({data : html, type : "KK", date : data[i].created_at, toString: function(){return this.data;}});
                        }
                        if(i == data.length-1) kk_lastId = data[i].id;
                        html = "";
                    }
                    if(kk_list.length < num*24) kk_lastId = "end";
                }else{
                    kk_lastId = "end";
                }
                kk_load_check = true;
            }catch(e){kk_load_check = true;}
        }, function(){kk_load_check = true;});
    }else{
        kk_load_check = true;
    }

}

function prettyDate(time){
    var date = new Date(time),
        diff = (((new Date()).getTime() - date.getTime()) / 1000);

    if(diff < 0) diff = 0;
    day_diff = Math.floor(diff / 86400);
    if ( isNaN(day_diff) || day_diff < 0 )
        return;
    return day_diff == 0 && (
        diff < 60 && "방금전" ||
        diff < 120 && "1분전" ||
        diff < 3600 && Math.floor( diff / 60 ) + "분 전" ||
        diff < 7200 && "1시간전" ||
        diff < 86400 && Math.floor( diff / 3600 ) + "시간 전") ||
        day_diff == 1 && "어제" ||
        day_diff < 7 && day_diff + "일 전" ||
        day_diff < 31 && Math.floor( day_diff / 7 ) + "주 전" ||
        day_diff < 360 && Math.floor( day_diff / 30 ) + "개월 전" ||
        day_diff >= 360 && (Math.floor( day_diff / 360 )==0?1:Math.floor( day_diff / 360 )) + "년 전"

}


var ckCnt= 0;
function setSortHtml(){
    if (kk_load_check == true && ins_load_check == true && fb_load_check == true){
        gFN_lodingE();
        total_sns_lst.sort(function(a,b){
            return new Date(b.date) - new Date(a.date);
        });

        $("#test").html(total_sns_lst.slice(0,num*24).join(""));

        var onId = $(".socialTab").find('.on').attr('id');
        var onTabId = onId.substr(7,onId.length);
        socialTab(onTabId);
    }else{
        if (ckCnt < 300){
            ckCnt++;
            setTimeout(setSortHtml, 100);
        }else{
            alert("데이터를 가져오는데 문제가 생겼습니다.[01]");
        }
    }
}


$(document).ready(function(){
    getKKList();
    getFBList();
    getInsList();

    if('' != ""){
        if('' == 'fb'){
            socialTab('fb')
        }
        if('' == 'kk'){
            socialTab('kk')
        }
        if('' == 'in'){
            socialTab('in')
        }
    }
    setSortHtml();




    $("#sns_more").on("click",function(){
        kk_load_check = false;
        ins_load_check = false;
        fb_load_check = false;

        num = $("#sns_more").data("num") + 1;
        $("#sns_more").data("num",num);

        //console.log(num);
        getKKList();
        getFBList();
        getInsList();

        setSortHtml();

        if($("#sns_more").data("num") == 10) $("#sns_more").hide();
    })


})