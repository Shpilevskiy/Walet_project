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



var makeFieldBad = function (block,field, text) {
    field.attr("placeholder", text);
    field.val('');
    block.addClass("has-error");
};

var makeFieldOk = function (block) {
    block.removeClass("has-error");
    block.addClass("has-success");
};

var addWalletCurrency = function () {
    var addButton = $(".wallet-block .glyphicon-plus");
    addButton.click(function () {
        var btn = $(addButton[addButton.index(this)]);
        var form = btn.siblings(".disabled");
        var titleForm = btn.siblings("h4");
        showBlock(form);
        hideBlock(btn);
        var submitBtn = form.find('p:last');

        var codeForm = form.find('#add-currency-input');
        var sumForm = form.find('#add-value-input');

        var title = titleForm.text();

        submitBtn.click(function () {
            var code = codeForm.val();
            var sum = sumForm.val();
            $.ajax({
                url:"add-new-currency/",
                type: "POST",
                dataType: 'json',
                data: {
                  title: title,
                  code: code,
                  sum: sum
                },
                success: function (data) {
                    console.log(data);
                    if('type' in data){
                       makeFieldBad(codeForm.parent(), codeForm, data.type)
                    }
                    else{
                        makeFieldOk(codeForm.parent())
                    }

                    if('sum' in data){
                       makeFieldBad(sumForm.parent(), sumForm, data.sum)
                    }
                    else{
                        makeFieldOk(sumForm.parent())
                    }
                    if(data.status == '200')
                    {
                        refreshWallets();
                    }
                }
            })
        })
    })
};


var createWalletDiv = function (title) {
    var div = document.createElement("div");
    var walletDivId = ("id-wallet-" + title).trimAll();
    div.id= walletDivId;
    $("#add-button-div").before(div);
    div = $("#"+walletDivId);
    div.addClass("col-md-2 wallet-block wallet-frame disabled");
    div.append('<h4 id="wallet-title">'+title+'<a class="btn-padding btn pull-right glyphicon glyphicon-pencil"></a></h4>');
    div.append('<hr>');
    div.append('<div id="new-currency-"'+title+' class="form-group disabled">  <p> <input id="add-currency-input" type="text" class=" form-control input-sm" placeholder="Currency (USD,EUR,etc.)"> </p> <p><input id="add-value-input" type="text" class=" form-control input-sm" placeholder="Value"> </p> <p><a class="btn-padding btn  glyphicon glyphicon-ok center-block"></a></p> </div>');
    div.append(' <a class=" btn glyphicon glyphicon-plus center-block"></a>');
};

var fillWallet = function (title, currencyCode, value) {
    var walletDivId = ("id-wallet-" + title).trimAll();
    var div = $("#"+walletDivId);
    var div_button = $("#"+walletDivId +" .form-group");
    div_button.before("<p>"+currencyCode+'<span class="pull-right">'+value+'</span>');
    div_button.before('<hr>');
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
    getWalletsTitles();
};

var getAllWallets = function () {
  $.ajax({
      url:"get-all-wallets/",
      type: "POST",
      dataType: "json",
      success: function (data) {
          addWalletsToHtml(data);
          addWalletCurrency();
      }
  });
};

$(document).ready(getAllWallets());
