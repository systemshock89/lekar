/**
 * @author Serega K.
 * @description Всплывающее окно со слайдом
 * version: 1.0.2
 *
 */
$(function () {

    var modalSlideOpenFlag = false; // определяет, был ли открыт попап хотя бы 1 раз

    // Если попап еще ни разу не был открыт (нет куки modal_slide_show)
    if( !Cookies.get('modal_slide_show') ){
        // if( !$.cookie('modal_slide_show') ){

        setTimeout(function(){
            // И если попап не открывали вручную и в данный момент не открыто никакого другого попапа
            if (!modalSlideOpenFlag && $('.fancybox-is-open').length == 0){
                modalSlideOpenFlag = true;

                // То открываем этот попап (спустя 30 сек нахождения на странице)
                // (опять же, если нет куки modal_slide_show)
                // Проверяем куку для того, чтобы попап не открывался на каждой странице сайта, если было открыто несколько вкладок.
                if( !Cookies.get('modal_slide_show') ){
                    // if( !$.cookie('modal_slide_show') ){
                    $.fancybox.open({
                        src : '/modal_slide',
                        type : 'ajax'
                    });
                }

                // и стаим куку на сутки, показывающую что попап был открыт
                Cookies.set('modal_slide_show', 'true', { expires: 1 });
                // $.cookie('modal_slide_show', 'true', {
                //     expires: 1,
                //     path: '/' //чтобы кука была доступна на всем сайте
                // });
            }
        },30000);
    }

});