/**
 * @description Дополнительные скрипты
 */

$(function () {

    // отложенная загрузка изображений и фонов
    // try {
    //     $("img.lazyload").lazyload(); // отложенная загрузка изображений
    //     $(".block-bg").lazyload(); // отложенная загрузка фонов
    // } catch (err) {
    //
    // }
    // /отложенная загрузка изображений и фонов


    // задаем одинаковую высоту для элементов
    // setCatalogHeight();

    // if( $(".catalog-gallery .item .no-img").length > 0 ){
    //     $(".catalog-gallery .item .img-container").matchHeight();
    // }
    // /задаем одинаковую высоту для элементов


    //Плавный скролл по пуктам верхнего меню с выбором активного пункта, скролл по логотипу наверх
    if( $('body.landing').length > 0 ) {
        try {
            $('.menu-top').standart_landing_menu_scroll({
                sections: $('.landing-section'), // секции, отображающиеся в виде пунктов верхнего меню
                nav: $('.menu-top ul li a, #mmenu ul li a, .logo, .header-mobile-logo a, .footer-menu ul li a'), // сами пункты меню и логотип
                nav_height: ($('.header-desktop').is(":visible") ? $('.menu-top-container').outerHeight() : $('.header-mobile').outerHeight()), //  отступ сверхну, например от хедера (на десктопе одна высота, а на мобиле другая)
            });
        } catch (err) {

        }
    }
    //Плавный скролл по пуктам верхнего меню с выбором активного пункта, скролл по логотипу наверх


    /* Картинка для элемента по дефолту */
    var cur_img = '';
    $(".row .item").each(function () {

        $(this).find('img').each(function () {
            cur_img = $(this).attr('src');
            if (cur_img == "")
                $(this).attr({'src': 'img/temp/empty_icon.png'});
        });

    });
    /* /Картинка для элемента по дефолту */


    /* Адаптивное верхнее меню slicknav */
    try {
        $('.menu-top').eq(0).slicknav({
            label: '',
            prependTo: '.header-mobile',
            closeOnClick:true,
            allowParentLinks: true
        });

        var window_height = $(window).height(),
            header_mobile_height = $('.header-mobile').height();
        $('.slicknav_nav').css({'max-height': window_height - header_mobile_height, 'overflow-y':'scroll'}); //для верт. скролла очень длинных меню

    } catch (err) {

    }
    /* /Адаптивное верхнее меню slicknav */


    /* ЭЛЕМЕНТЫ КАТАЛОГА */
    if ($('.catalog .catalog-container .item').length > 0) {

        var curPositionTop = $('.catalog .catalog-container > .item').eq(0).position().top, //берем позицию первого эл-та
            elementsInRow = []; //массив, в кот-й помещаем элементы, находящиеся на одной строке

        $('.catalog .catalog-container').each(function () {

            var catalog = $(this),
                catalog_item_height = 0;

            catalog.find('.item').each(function () {

                /* Картинка по дефолту */
                var cur_img = $(this).find('.img-container img').attr('src');
                if (cur_img == "")
                    $(this).find('.img-container img').attr({'src': '/img/empty_icon.png'});
                /* /Картинка по дефолту */


                /* Выравнивание высоты*/
                //если эл-ты находятся на одной строке
                if ($(this).position().top != curPositionTop) {

                    curPositionTop = $(this).position().top;

                    for (var k in elementsInRow) {
                        elementsInRow[k].height(catalog_item_height);
                    }

                    catalog_item_height = $(this).height();

                    elementsInRow = [];

                }

                elementsInRow.push($(this));

                var cur_height = $(this).height();
                if (cur_height > catalog_item_height)
                    catalog_item_height = cur_height;

                /* Выравнивание высоты*/
            });

            //для последней строки элементов, если она не полная, повторяем
            for (var k in elementsInRow) {
                elementsInRow[k].height(catalog_item_height);
            }
            elementsInRow = [];
        });

    }
    /* /ЭЛЕМЕНТЫ КАТАЛОГА */


    /* Переносим правый блок вправо */
    $('.floatblock.center-min, .floatblock.center-middle').before($('.floatblock.right').show());
    $('.padding-right').hide();
    /* /Переносим правый блок вправо */


    /* Стартуем слайдеры */
    if ($(".standart_slider").is(".index_slider2")) {
        $.getScript('js/other/jquery.standart.slider.js', function () {

            $('.index_slider2').standart_slider({
                timeout: 12000,
                time: 400,
                timer: 1, /* Включение-выключение перелистывания */
                size: 1, /* Количество отображаемых обьектов в окне показов */
                type: 'scroll_horiz'
            });

        });
    }
    if ($(".standart_slider").is(".tovar_slider2")) {
        $.getScript('js/other/jquery.standart.slider.js', function () {

            $('.tovar_slider2').standart_slider({
                timeout: 12000,
                time: 400,
                timer: 1, /* Включение-выключение перелистывания */
                size: 1, /* Количество отображаемых обьектов в окне показов */
                type: 'scroll_horiz'
            });

        });
    }
    /* /Стартуем слайдеры */


    /* uniform */
    // uniform_func();
    /* /uniform */


    /* selectik */
    if ($('select').is('.selectik')) {
        $('head').append("<link rel='stylesheet' type='text/css'  href='css/selectik.css'/>");
        $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js', function () {
            $.getScript('js/other/jquery.selectik.min.js', function () {

                $('select.selectik').selectik({maxItems: 8, minScrollHeight: 20});

            });

        });
    }
    /* /selectik */


    /* Slider-range с возможностью вводить значения */
    if ($('div').is('.slider-range')) {
        $('head').append("<link rel='stylesheet' type='text/css'  href='css/jquery-ui.css'/>");
        $.getScript('js/other/jquery-ui.min.js', function () {
            $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js', function () {


                $(".slider-range-container").each(function () {

                    var $this = $(this),
                        $slider_range,
                        $slider_range_input1 = $this.find('input.input1'),
                        $slider_range_input2 = $this.find('input.input2'),
                        $slider_range_min = parseInt($slider_range_input1.val()), // минимальное возможное значение у бегунка (указывается в инпуте 1)
                        $slider_range_max = parseInt($slider_range_input2.val()), // максимальное возможное значение у бегунка (указывается в инпуте 2)
                        $slider_range_default_min = parseInt($this.data("slider-range-default-min")), // ДЕФОЛТНОЕ минимальное возможное значение у бегунка (если необходимо)
                        $slider_range_default_max = parseInt($this.data("slider-range-default-max")), // ДЕФОЛТНОЕ максимальное возможное значение у бегунка (если необходимо)
                        $slider_range_step = parseInt($this.data("slider-range-step")), // шаг бегунка


                        $slider_range = $this.find('.slider-range').slider({
                            range: true,
                            min: ( $slider_range_default_min >= 0 ? $slider_range_default_min : $slider_range_min ),
                            max: ( $slider_range_default_max >= 0 ? $slider_range_default_max : $slider_range_max ),
                            values: [
                                $slider_range_min,
                                $slider_range_max

                            ],
                            step: ( $slider_range_step ? $slider_range_step : 1 ),
                            slide: function (event, ui) { // cобытие происходит на каждое движении мыши, при перетаскивании рукоятки ползунка

                                stepRange(parseInt(ui.values[0]), parseInt(ui.values[1]), ( $slider_range_default_max >= 0 ? $slider_range_default_max : $slider_range_max ));
                            },
                            stop: function (event, ui) { // событие происходит в момент завершения перетаскивания рукоятки ползунка.

                                stepRange(parseInt(ui.values[0]), parseInt(ui.values[1]), ( $slider_range_default_max >= 0 ? $slider_range_default_max : $slider_range_max ));

                            }
                        });

                    // при вводе значений в инпуты перемещть бегунок
                    $this.find('input.input1, input.input2').bind('keyup mouseup', function () {

                        $slider_range.slider({
                            values: [
                                $this.find('input.input1').val(),
                                $this.find('input.input2').val()
                            ]
                        });

                    });

                    // ф-я записывает числовые значения бегунков в инпуты и формирует минимальное расстояние бегунков друг от друга
                    function stepRange(val1, val2, max) {

                        var stepRangeVal = Math.max(Math.round(max * 0.05), 1); //вычисление минимального расстояния, которое остается между бегунками

                        if (val2 - val1 < stepRangeVal) {
                            val2 = Math.min(val1 + stepRangeVal, max);
                            val1 = val2 - stepRangeVal;
                        }

                        // записываются значения бегунков в input-ы цены "от ... до"
                        $slider_range_input1.val(val1);
                        $slider_range_input2.val(val2);
                        $slider_range.slider({values: [val1, val2]});
                    }

                });

            });
        });
    }
    /* /Slider-range с возможностью вводить значения */


    /* scrollbar */
    if ($('div').is('.content-with-scroll')) {
        $('head').append("<link rel='stylesheet' type='text/css'  href='css/jquery.scrollbar.css'/>");
        $.getScript('js/other/jquery.scrollbar.min.js', function () {

            $('.content-with-scroll').scrollbar();

        });
    }
    /* /scrollbar */


    /* Свернуть/развернуть Фильтр слева */
    $('.filter .item-block .see-all').click(function (e) {
        e.preventDefault();

        $(this).closest('.item-block').find('.item-container').slideToggle(function() {
            $(this).closest('.item-block').toggleClass('selected');
        });
    });
    /* /Свернуть/развернуть Фильтр слева */


    /* jquery.form*/
    if ($(".open-popup").is('div')) {
        $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jquery.form/3.51/jquery.form.min.js', function () {
        });
    }
    /* jquery.form*/


    /* Стартуем стандартную ajax обработку */
    try {
        $('form.standart_load,a.standart_load').standart_load();
    } catch (err) {

    }
    /* /Стартуем стандартную ajax обработку */


    /* Fullpage.js */
    var navigationTooltipsArr = [],
        anchorsArr = [];
    $('.section').each(function(n){
        navigationTooltipsArr[n] = $(this).data('tooltip');  // Берем название секции из атрибута data-tooltip
        anchorsArr[n] = $(this).data('anchor');  // Берем название анкора из атрибута data-anchor
    });


    if( $('#fullpage').length > 0 ){
        $('#fullpage').fullpage({
            menu: '#menu',
            // lockAnchors:true,
            anchors: anchorsArr,
            sectionsColor: ['#C63D0F', '#1BBC9B', '#7E8F7C'],
            scrollOverflow: true,
            scrollOverflowOptions: {
                interactiveScrollbars: true
            },
            navigation: true,
            navigationPosition: 'right',
            navigationTooltips: navigationTooltipsArr,
            showActiveTooltip: true,
            // paddingTop: '169px',
            paddingBottom: '0px', //нужно, чтоб можно было указать отступ сверху путем css
            loopBottom: true,
            afterLoad: function(){

                // $.fn.fullpage.reBuild(); // чтоб не зависал скролл

                //убирать точки, если слайд только один
                if ( $('#fullpage section.section').length > 1 ){
                    $('#fp-nav').show();
                }
            }
        });
        // чтоб не зависал скролл
        // setTimeout(function() {
        //     $.fn.fullpage.reBuild();
        // }, 500);
        /* /Fullpage.js */

    }
    /* /Fullpage.js */


}); // END READY



var Load = function (url, param) { // Функция для стандартизации общения с сервером
    $.post(
        url,
        param,
        function (data) {
            var sc_ = '';
            if (data['script']) {
                sc_ = data['script'];
                delete data['script'];
            }
            for (i in data) {
                $(i).html(data[i]);
            }
            eval(sc_);
        },
        'json'
    );
};


var Message = function (message) { // Всплывающее сообщение на базе наработки standart_window

    $('.window.message').remove();
    /* Удалилил старое окно */
    /* Добавлеяем новое окно */
    $('body').append(
        '<div class="window message">' +
        '<div class="window-popup-overflower"></div>' +
        '    <div class="window_body">' +
        '        <div class="close">x</div>' +
        '        <div class="content">' +
        '            <div class="block">' +
        message +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>');

    $('.window.message').standart_window();
};


/* кастомный input file */
/**
 * Кастомный инпут - клик
 */
function customInputFile(obj) {
    obj.click();
}

/**
 * Вставляет название файла в кастомный инпут
 * @param obj
 */
function setInputFileName(obj) {
    if (obj.val() !== '') {
        obj.parent().find('.file-name').html('<img class="clear-input-file" src="img/temp/close.png" onclick="clearInputFile($(this))" alt=""/>')
            .css('display', 'inline-block')
            .append(obj.val().replace(/.*[\\\/](.*)/, "$1"))
            .parent().parent().find('.validation-informer').hide();
    } else {
        obj.parent().find('.file-name').html('');
    }
}

/**
 * Очистка поля файл
 * @param obj
 */
function clearInputFile(obj) {
    obj.parent().html('').hide()
        .parent().parent().find('input[type=file]').val('')
}
/* /кастомный input file */


//Баг в ie с прыгающим рывками элементом с position: fixed
if (navigator.userAgent.match(/Trident.*rv[ :]*11\.| Edge\/12\./) || navigator.userAgent.match(/MSIE 10/i) || navigator.userAgent.match(/MSIE 9/i)) {
    $('body').on("mousewheel", function (e) {
        e.preventDefault();

        var wheelDelta = event.wheelDelta;

        var currentScrollPosition = window.pageYOffset;
        window.scrollTo(0, currentScrollPosition - wheelDelta);
    });
}


/* Выравнивание элементов по одинаковой высоте */
(function ($) {
    $.fn.equalHeights = function () {
        var $items = $(this);
        function equalize() {
            $items.height('initial');
            var maxH = $items.eq(0).height();
            $items.each(function () {
                maxH = ($(this).height() > maxH) ? $(this).height() : maxH;
            });
            $items.height(maxH);
        }
        equalize();
        $(window).bind('resize', function () {
            equalize();
        });
    };
})(jQuery);
/* Выравнивание элементов по одинаковой высоте */


//preloader
$(window).on('load', function () {
    var $preloader = $('#page-preloader'),
        $spinner = $preloader.find('.spinner');
    $spinner.fadeOut();
    $preloader.delay(400).fadeOut('slow');
});


/* uniform */
function uniform_func() {

    if ($('input[type=checkbox]')) { //checkbox
        $('head').append("<link rel='stylesheet' type='text/css'  href='css/uniform.default.min.css'/>");
        $('head').append("<link rel='stylesheet' type='text/css'  href='css/_uniform.checkbox.css'/>"); //стили checkbox
        $.getScript('js/other/jquery.uniform.min.js', function () {

            $('input[type=checkbox]').uniform();

        });
    }
    if ($('input[type=radio]')) { //radio
//        $('head').append("<link rel='stylesheet' type='text/css'  href='/css/uniform.default.min.css'/>");
        $('head').append("<link rel='stylesheet' type='text/css'  href='css/_uniform.radio.css'/>"); //стили radio
        $.getScript('js/other/jquery.uniform.min.js', function () {

            $('input[type=radio]').uniform();

        });
    }
    if ($('select').is('.uniform')) { //select
//        $('head').append("<link rel='stylesheet' type='text/css'  href='/css/uniform.default.min.css'/>");
        $('head').append("<link rel='stylesheet' type='text/css'  href='css/uniform.select.css'/>"); //стили select
        $.getScript('js/other/jquery.uniform.min.js', function () {

            $('select.uniform').uniform();

        });
    }
}
/* /uniform */


