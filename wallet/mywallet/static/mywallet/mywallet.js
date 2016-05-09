jQuery("a").focus(
    function(){
        this.blur();
    });

var NewContent=' <div class="col-md-2 wallet-block wallet-frame"> <form class="form-horizontal" role="form"> <div class="form-group"> <input type="text" class="form-control input-sm" placeholder="Wallet name"> </div> <hr> <div class="form-group"> <input type="text" class=" form-control input-sm" placeholder="Currency (USD,EUR,etc.)"> </div> <hr> <div class="form-group"> <input type="text" class="form-control input-sm" placeholder="Available (5000)"> </div> <hr> <p><button type="submit" class="glyphicon glyphicon-ok center-block"></button></p> </form> </div>';


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


$(function(){
    $("#add-wallet-button").click(function(){
        $("#add-button-div").before(NewContent)
    })
});