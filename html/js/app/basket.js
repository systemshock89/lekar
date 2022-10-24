$(document).ready(function(){
    init_basket();
});

function init_basket()
{
    addToBasket();
    tovar_plus();
    delTovar();
    show_right_basket_on_click_by_rb();

    $("#id_oformlemie_zak").click(function(){
        $("#id_div_zakaz").toggle();
    });
}

function reInitBasket()
{
    $("#idBasket_reinit").load(window.location.href + " #idBasket", function(){
        init_basket();
    });
}

function addToBasket()
{
    $(document).on("click", ".button-to-cart", function(){
        // $(".button-to-cart").click(function(){
        showLoader();
        var show_modal_cart = $(this).data('show_modal_cart');
        var tovar_id = $(this).data('tovar_id');
        var class_id = 0;
        if($(this).data('class_id')){
            class_id = $(this).data('class_id');
        }
        var cnt = 1;
        if($("#id_cnt_add_to_cart"+tovar_id).val()){
            cnt = $("#id_cnt_add_to_cart"+tovar_id).val();
        }
        $.ajax({
            url: "/ajax/basket/addToBasket.php",
            type: "POST",
            data: {'tovar_id' : tovar_id, 'cnt' : cnt, 'class_id' : class_id},
            success: function(html){
                //change_summ_top_basket();
                change_tovar_cnt();
                changeTop();
                show_right_basket();
                if($(".header-mobile").is(":hidden") && show_modal_cart){
                    $.fancybox.open({ src : '/json/modal_cart/', type : 'ajax', autoFocus: false, touch : false });
                }
                //yaC.reachGoal('CART');
                hideLoader();
            },
            dataType: 'text'
        });
    });
}

function changeTop()
{
    $.ajax({
        url: "/ajax/basket/action.php",
        type: "POST",
        data: {'flag' : 'changetop'},
        success: function(html){
            $("#basket_top").html(html);
            hideLoader();
        },
        dataType: 'text'
    });
}

function tovar_plus()
{
    $(".tovar_plus").click(function(){
        showLoader();
        var tovar_id = $(this).data('tovar_id');
        var m = $(this).data('m');
        var formid = $(this).data('form_id');
        //alert(formid);
        var tt_now = $("#id_tovar_"+tovar_id).val();
        if(m == "plus"){
            tt_now++;
        }else{
            tt_now--;
        }
        $("#id_tovar_"+tovar_id).val(tt_now);
        $.ajax({
            url: "/ajax/basket/action.php",
            type: "POST",
            data: {
                'flag' : 'plusminus',
                'tovar_id' : tovar_id,
                'm' : m
            },
            success: function(text){
                //change_summ_top_basket();
                change_tovar_cnt();
                changeTop();
                show_right_basket();
                reInitBasket();
                setTimeout(function(){
                    //initSubmitForm("id_fmc_snd"+formid);
                    initSubmitForm(formid);
                    hideLoader();
                },1500);
            },
            dataType: 'text'
        });
    });

    $(document).on("click", ".tovar_counter_list", function(){
        // $(".tovar_counter_list").click(function(){
        var actm = $(this).data('m');
        var tovar_id = $(this).data('tovar_id');
        var cnt = parseInt($("#id_cnt_add_to_cart"+tovar_id).val());
        if(actm == "minus" && cnt > 1){
            var new_cnt = cnt - 1;
            $("#id_cnt_add_to_cart"+tovar_id).val(new_cnt);
        }
        if(actm == "plus"){
            var new_cnt = cnt + 1;
            $("#id_cnt_add_to_cart"+tovar_id).val(new_cnt);
        }

    });

    $(".tovar_change_cnt_manual").keyup(function(){
        var tovar_id = $(this).data('tovar_id');
        var formid = $(this).data('form_id');
        var cnt = $("#id_tovar_" + tovar_id).val();
        showLoader();
        $.ajax({
            url: "/ajax/basket/action.php",
            type: "POST",
            data: {
                'flag' : 'change_cnt_tovar_manual',
                'tovar_id' : tovar_id,
                'cnt' : cnt
            },
            success: function(text){
                change_tovar_cnt();
                changeTop();
                show_right_basket();
                reInitBasket();
                setTimeout(function(){
                    //initSubmitForm("id_fmc_snd"+formid);
                    initSubmitForm(formid);
                    hideLoader();
                },1500);
            },
            dataType: 'text'
        });
    });
}

function change_summ_top_basket()
{
    $.ajax({
        url: "/ajax/basket/action.php",
        type: "POST",
        data: {'flag' : 'change_summ_top' },
        success: function(text){
            //$("#id_div_summ_top_basket").html(text + ' &#8381;');
            $("#id_div_summ_top_basket").html(text);
        },
        dataType: 'text'
    });
}

function show_right_basket()
{
    $.ajax({
        url: "/ajax/basket/action.php",
        type: "POST",
        data: {'flag' : 'show_ajax_right' },
        success: function(text){
            $("#right_cart_big").addClass('active');
            $("#right_card_mini").addClass('active');
            $("#bottom_basket_line").show();
            $("#right_cart_big_tovar_cnt").html(text.cnt);
            $("#right_cart_big_tovar_sum").html(text.summ);
            $("#right_cart_big").removeClass('mini');
            $("#right_cart_big_tovar_full").show();
            $("#right_cart_big_tovar_full2").show();
            $("#right_cart_big_tovar_empty").hide();


        },
        dataType: 'json'
    });
}

function change_tovar_cnt()
{
    $.ajax({
        url: "/ajax/basket/action.php",
        type: "POST",
        data: {'flag' : 'change_tovar_cnt' },
        success: function(text){
            $(".ajax_count_tovar").text(text);
            if(text > 0){
                $(".ajax_count_tovar").show();
                //$("#text_basket_top_empty").hide();
            }else{
                $(".ajax_count_tovar").hide();
                //$("#text_basket_top_empty").show();
            }
        },
        dataType: 'text'
    });
}



function show_right_basket_on_click_by_rb()
{
    $(".mini-cart-show-button").click(function(){
        show_right_basket();
    });
}

function delTovar()
{
    $(".del_tovar").click(function(){
        var tovar_id = $(this).data('tovar_id');
        var formid = $(this).data('form_id');
        if(confirm("Вы действительно хотите удалить товар из корзины?")){
            showLoader();
            $.ajax({
                url: "/ajax/basket/action.php",
                type: "POST",
                data: {
                    'flag' : 'del',
                    'tovar_id' : tovar_id
                },
                success: function(text){
                    changeTop();
                    //change_summ_top_basket();
                    //change_tovar_cnt();
                    //show_right_basket();                    
                    reInitBasket();
                    setTimeout(function(){
                        initSubmitForm(formid);
                        hideLoader();
                    },500);
                },
                dataType: 'text'
            });
        }
    });
    $(".delete-all").click(function(){
        if(confirm("Вы действительно хотите удалить все товары из корзины?")){
            $.ajax({
                url: "/ajax/basket/action.php",
                type: "POST",
                data: {
                    'flag' : 'del_all'
                },
                success: function(text){
                    //change_summ_top_basket();
                    //change_tovar_cnt();
                    //show_right_basket();
                    changeTop();
                    reInitBasket();
                },
                dataType: 'text'
            });
        }
    });
}