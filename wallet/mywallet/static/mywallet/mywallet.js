$("a").focus(
    function(){
        this.blur();
    });

var newWalletForm =' <div id="add-new-wallet-form" class="col-md-2 wallet-block wallet-frame disabled"> <form class="form-horizontal" role="form"> <div id="name-group" class="form-group"> <input id="new-wallet-name" type="text" class="form-control input-sm" placeholder="Wallet name"> </div> <hr> <div id="type-group" class="form-group"> <input id="new-wallet-type" type="text" class=" form-control input-sm" placeholder="Currency (USD,EUR,etc.)"> </div> <hr> <div id="sum-group" class="form-group"> <input id="new-wallet-sum" type="text" class="form-control input-sm" placeholder="Available (5000)"> </div> <hr> <p><a id="add-new-wallet-btn" class=" btn glyphicon glyphicon-ok center-block"></a></p> </form> </div>';


$(document).ready(function () {
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
    var dateField = $('.nav-right #date-field');
    dateField.append(month + "/" + day + "/" + year + " (" + weekday[d.getDay()] + ")")
});

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

var isWalletAddFormPresent = function(){
    return $("#add-new-wallet-form").length !== 0;
};

var verifyAddWalletFields = function(data){
    if (data.status == '400') {

        var nameGroup =  $("#name-group");
        var typeGroup = $("#type-group");
        var sumGroup =  $("#sum-group");

        if(typeof data.name !== 'undefined'){
            var nameField = $("#new-wallet-name");
            nameField.attr("placeholder", data.name);
            nameField.val('');
            nameGroup.addClass("has-error");

        }
        else{
           nameGroup.removeClass("has-error");
           nameGroup.addClass("has-success");
        }

        if('type' in data){
            var typeField = $("#new-wallet-type");
            typeField.attr("placeholder", data.type);
            typeField.val('');
            typeGroup.addClass("has-error");
        }
        else{
            typeGroup.removeClass("has-error");
            typeGroup.addClass("has-success");
        }

        if('sum' in data){
            var sumField = $("#new-wallet-sum");
            sumField.attr("placeholder", data.sum);
            sumField.val('');
            sumGroup.addClass("has-error");
        }
        else {
            sumGroup.removeClass("has-error");
            sumGroup.addClass("has-success");
        }
    }
    if(data.status == '200')
    {
        $("#add-new-wallet-form").remove();
        refreshWallets();
        getWalletsTitles();
    }
};

$(function(){
    var button = $("#add-wallet-button");
        button.click(function(){
        if(isWalletAddFormPresent()){
            return;
        }
        $("#add-button-div").before(newWalletForm);
        showBlock($("#add-new-wallet-form"));
        $(function(){
            $("#add-new-wallet-btn").click(function(){
                $.ajax({
                    url: "addwallet/",
                    type: "POST",
                    data: {
                        name: $("#new-wallet-name").val(),
                        type: $("#new-wallet-type").val(),
                        sum: $("#new-wallet-sum").val()
                    },
                    dataType: 'json'})
                .done(verifyAddWalletFields);
                });
            });
        });
});

var getWalletsTitles = function () {
    $.ajax({
        url: "get-wallets-titles/",
        type: "POST",
        dataType: 'json',
        success: function (data) {
            var selectWallets = $("#id_wallets");
           $.each(data, function (iter, value) {
               selectWallets.append( $('<option value='+value.title+'>'+value.title+'</option>'));
           });
            var title = selectWallets.find(":selected").text();
            getSelectWalletCodes(title);
        }
    })
};

$(document).ready(getWalletsTitles());

var getSelectWalletCodes = function (title) {
    $.ajax({
            url: "get-codes-by-wallet-title/",
            type: "POST",
            data: {
                walletTitle: title
            },
            dataType: 'json',
            success: function (data) {
                var code = $("#id_code");
                code.empty();
           $.each(data, function (iter, value) {
               code.append( $("<option value="+iter+">"+value+"</option>"));
           });
            }
        })
};


$(function () {
   var info = $("#id_wallets");
    info.click(function () {
        var title = info.find(":selected").text();
        getSelectWalletCodes(title);
    });
});


var hideBlock = function (block) {
    block.animate({
        opacity: 0
    });
    block.hide();
};

var showBlock = function (block) {
  block.show();
  block.animate({
      opacity: 1
  });
};

String.prototype.trimAll=function()
{
  var r=/\s+/g;
  return this.replace(r,'');
};

 // <!--<p><button class="glyphicon-plus center-block"></button></p>-->

var createWalletDiv = function (title) {
    var div = document.createElement("div");
    var walletDivId = ("id-wallet-" + title).trimAll();
    div.id= walletDivId;
    $("#add-button-div").before(div);
    div = $("#"+walletDivId);
    div.addClass("col-md-2 wallet-block wallet-frame disabled");
    div.append('<h4>'+title+'<a class="btn-padding btn pull-right glyphicon glyphicon-pencil"></a></h4>');
    div.append('<p><button class="glyphicon-plus center-block"></button></p>');
};

var fillWallet = function (title, currencyCode, value) {
    var walletDivId = ("id-wallet-" + title).trimAll();
    var div = $("#"+walletDivId);
    var div_button = $("#"+walletDivId +" .glyphicon-plus");
    div_button.before('<hr>');
    div_button.before("<p>"+currencyCode+'<span class="pull-right">'+value+'</span>');
    showBlock(div);
};

var addWalletsToHtml = function (json_data) {
          $.each(json_data, function (title, element) {
              createWalletDiv(title);
              $.each(element, function (value, code) {
                  fillWallet(title, code, value);
              })
          });
};

var refreshWallets = function () {
    var wallet = $(".wallet-block");
    hideBlock(wallet);
    wallet.remove();
    getAllWallets();
    var select = $("#id_wallets");
    select.empty();
};

var getAllWallets = function () {
  $.ajax({
      url:"get-all-wallets/",
      type: "POST",
      dataType: "json",
      success: function (data) {
          addWalletsToHtml(data)
      }
  })
};

$(document).ready(getAllWallets());
