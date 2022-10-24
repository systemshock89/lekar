$(document).ready(function(){
    $(document).on("dblclick", ".div_ajax_change", function(){
        // $(".div_ajax_change").dblclick(function(){
        var id = $(this).data('id');
        var fld = $(this).data('fld');
        $("#id_div_ajax_change_"+fld+"_"+id).hide();
        $("#id_div_input_ajax_change_"+fld+"_"+id).show();
        $("#id_input_ajax_change_"+fld+"_"+id).focus();
    });
    $(document).on("blur", ".input_ajax_change", function(){
        // $(".input_ajax_change").blur(function(){
        var nv = $(this).val();
        var id = $(this).data('id');
        var cid = $(this).data('cid');
        var fld = $(this).data('fld');
        $.ajax({
            url: "/ajax/admin/ajax_change_action.php",
            type: "POST",
            data: {'cid' : cid, 'fld': fld, 'id' : id, 'value' : nv },
            success: function(html){
                $("#id_div_svg").html(html);
                $("#id_div_ajax_change_"+fld+"_"+id).html(nv);
                $("#id_div_ajax_change_"+fld+"_"+id).show();
                $("#id_div_ajax_change_"+fld+"_"+id).addClass("changed");
                $("#id_div_input_ajax_change_"+fld+"_"+id).hide();
                coord_click_svg();
                setTimeout(function(){
                    $("#id_div_ajax_change_"+fld+"_"+id).removeClass("changed");
                },2000);
            },
            dataType: 'text'
        });
    });
    $(document).on("click", ".input_ajax_change_checkbox", function(){
        // $(".input_ajax_change_checkbox").click(function(){
        //showLoader();
        var nv = 0;
        if($(this).prop("checked") == true){
            nv = 1;
        }
        var id = $(this).data('id');
        var cid = $(this).data('cid');
        var fld = $(this).data('fld');
        $.ajax({
            url: "/ajax/admin/ajax_change_action.php",
            type: "POST",
            data: {'cid' : cid, 'fld': fld, 'id' : id, 'value' : nv },
            success: function(html){
                $("#id_div_ajax_change_checkbox_"+fld+"_"+id).css("color","green");
                setTimeout(function(){
                    $("#id_div_ajax_change_checkbox_"+fld+"_"+id).css("color","black");
                },2000);
                //hideLoader();
            },
            dataType: 'text'
        });
    });
    coord_click_svg();
    if($("#id_admin_select_filtr_flat").size()){
        $("#id_admin_select_filtr_flat").change(function(){
            var floor_id = $(this).find("option:selected").val();
            window.location.href = "/netcat/?inside_admin=1&cc=106&floorid="+floor_id;
        });
    }
    if($("#id_admin_select_filtr_th").size()){
        $("#id_admin_select_filtr_th").change(function(){
            var floor_id = $(this).find("option:selected").val();
            window.location.href = "/netcat/?inside_admin=1&cc=119&floorid="+floor_id;
        });
    }
    $("#id_admin_select_filtr_planf_flat").change(function(){
        var pflat_id = $(this).find("option:selected").val();
        window.location.href = "/netcat/?inside_admin=1&cc=106&planflatid="+pflat_id;
    });
});

function coord_click_svg()
{
    $("#dom_areas_svg").click(function(e){
        var offset = $(this).offset();
        var relativeX = (e.pageX - offset.left);
        var relativeY = (e.pageY - offset.top);
        $("#id_coord_click").val(relativeX +" "+relativeY);
    });
}