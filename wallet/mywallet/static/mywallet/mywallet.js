jQuery("a").focus(
    function(){
        this.blur();
    });

var new_wallet_from =' <div id="add-new-wallet-form" class="col-md-2 wallet-block wallet-frame"> <form class="form-horizontal" role="form"> <div id="name-group" class="form-group"> <input id="new-wallet-name" type="text" class="form-control input-sm" placeholder="Wallet name"> </div> <hr> <div id="type-group" class="form-group"> <input id="new-wallet-type" type="text" class=" form-control input-sm" placeholder="Currency (USD,EUR,etc.)"> </div> <hr> <div id="sum-group" class="form-group"> <input id="new-wallet-sum" type="text" class="form-control input-sm" placeholder="Available (5000)"> </div> <hr> <p><a id="add-new-wallet-btn" class=" btn glyphicon glyphicon-ok center-block"></a></p> </form> </div>';


function get_date() {
    var weekday=new Array(7);
    weekday[0]="Sunday";
    weekday[1]="Monday";
    weekday[2]="Tuesday";
    weekday[3]="Wednesday";
    weekday[4]="Thursday";
    weekday[5]="Friday";
    weekday[6]="Saturday";

    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var date_field = $('.nav-right #date-field');
    date_field.append(month + "/" + day + "/" + year + " (" + weekday[d.getDay()] + ")")
}

get_date();

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        var csrftoken = getCookie('csrftoken');
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

$(function(){
    $("#add-wallet-button").click(function(){
        if($("div").is("#add-new-wallet-form")) return 0;
        $("#add-button-div").before(new_wallet_from);
        $(function(){
            $("#add-new-wallet-btn").click(function(){
                $.ajax({
                    url: "addwallet/",
                    type: "POST",
                    data:({
                        name: $("#new-wallet-name").val(),
                        type: $("#new-wallet-type").val(),
                        sum: $("#new-wallet-sum").val()
                    }),
                    dataType: 'json',
                    success: function(data){
                        if (data.status == '400') {

                            var name_group =  $("#name-group");
                            var type_group = $("#type-group");
                            var sum_group =  $("#sum-group");

                            if(typeof data['name'] !== 'undefined'){
                                var name_field = $("#new-wallet-name");
                                name_field.attr("placeholder", data.name);
                                name_field.val('');
                               name_group.addClass("has-error");

                            }
                            else{
                               name_group.removeClass("has-error");
                               name_group.addClass("has-success");
                            }

                            if('type' in data){
                                var type_field = $("#new-wallet-type");
                                type_field.attr("placeholder", data.type);
                                type_field.val('');
                                type_group.addClass("has-error");
                            }
                            else{
                                type_group.removeClass("has-error");
                                type_group.addClass("has-success");
                            }

                            if('sum' in data){
                                var sum_field = $("#new-wallet-sum");
                                sum_field.attr("placeholder", data.sum);
                                sum_field.val('');
                               sum_group.addClass("has-error");
                            }
                            else {
                               sum_group.removeClass("has-error");
                                sum_group.addClass("has-success");
                            }
                        }
                        if(data.status == '200')
                        {
                            $("#add-new-wallet-form").remove();
                        }
                    }
                })
            })
        });
    })
});