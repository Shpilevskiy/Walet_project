
    jQuery("a").focus(
    function(){
        this.blur();
    });


    var login_btn = $('.carousel-inner #log-btn');
    var registration_btn = $('.carousel-inner #reg-button');
    var home = $('#home');
    var reg_form = $('#registration-form');
    var login_from = $('#login-form');

    registration_btn.click(function() {
        swap_block(home, reg_form)
    });

    login_btn.click(function(){
        swap_block(home, login_from)
    });

function swap_block(active, passive){
    active.animate({
        opacity: 0
    });
    active.hide();

    passive.show();
    passive.animate({
        opacity: 1
    });
}