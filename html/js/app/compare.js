$(document).ready(function(){
    init_compare();
});

function init_compare()
{
    addToCompare();
    removeFromCompare();
}

function addToCompare()
{
    $(document).on("click", ".button-to-compare", function(){
        // $(".button-to-compare").click(function(){
        showLoader();
        var tovar_id = $(this).data('tovar_id');
        $.ajax({
            url: "/ajax/compare/addToCompare.php",
            type: "POST",
            data: {'tovar_id' : tovar_id},
            success: function(res){
                change_count_compare();
                if($(".header-mobile").is(":visible")){
                    $("#btn-add-to-compare-mobile"+tovar_id).hide();
                    $("#btn-remove-from-compare-mobile"+tovar_id).show();
                }else{
                    $("#btn-add-to-compare"+tovar_id).hide();
                    $("#btn-remove-from-compare"+tovar_id).show();
                }
                //yaC.reachGoal('COMPARE');
                hideLoader();
            },
            dataType: 'text'
        });
    });
}

function removeFromCompare()
{
    $(document).on("click", ".button-to-remove-compare", function(){
        // $(".button-to-remove-compare").click(function(){
        showLoader();
        var tovar_id = $(this).data('tovar_id');
        var reload = $(this).data('reload');
        $.ajax({
            url: "/ajax/compare/action.php",
            type: "POST",
            data: {
                'tovar_id' : tovar_id,
                'flag' : 'remove',
            },
            success: function(res){
                if(reload){
                    window.location.href = window.location.href;
                }else{
                    if($(".header-mobile").is(":visible")){
                        $("#btn-add-to-compare-mobile"+tovar_id).show();
                        $("#btn-remove-from-compare-mobile"+tovar_id).hide();
                    }else{
                        $("#btn-add-to-compare"+tovar_id).show();
                        $("#btn-remove-from-compare"+tovar_id).hide();
                    }
                    change_count_compare();
                    hideLoader();
                }
            },
            dataType: 'text'
        });
    });
}

function change_count_compare()
{
    $.ajax({
        url: "/ajax/compare/action.php",
        type: "POST",
        data: {'flag' : 'count'},
        success: function(res){
            $("#compare_top").html(res);
        },
        dataType: 'text'
    });
    change_count_compare_mobile();
}

function change_count_compare_mobile()
{
    if($(".header-mobile").is(":visible")){
        $.ajax({
            url: "/ajax/compare/action.php",
            type: "POST",
            data: {'flag' : 'ajax_cnt'},
            success: function(res){
                $(".compare_mobile_cnt").html(res);
                if(res > 0){
                    $(".compare_mobile_cnt").show();
                }else{
                    $(".compare_mobile_cnt").hide();
                }
            },
            dataType: 'text'
        });
    }
}