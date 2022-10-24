/**
 * @description Основные скрипты
 */

document.addEventListener("DOMContentLoaded", function(event) {

    // Mmenu
    new Mmenu( "#mmenu", {
        // options
        slidingSubmenus: false, // открывать подменю снизу или в виде скользящих меню
        // scrollBugFix: { // пока обходимся без фикса
        //     "fix": false
        // },
        navbar: false, // убрать сверху название меню
        // "counters": true, // кол-во подразделов
        extensions: [
            "border-full", // линии пунктов на всю ширину меню
            "multiline", // длинные навания без сокращений
            "pagedim-black", // затемнение сайта при открытии меню
            // "theme-dark"
        ],
        navbars: [
            // {
            //     position: "top",
            //     content: [
            //         "searchfield"
            //     ]
            // },
            {
                position: "top",
                // content: $("#mmenu-top-buttons").children().toArray()
                content: Array.from(document.querySelector("#mmenu-top-buttons").children)
            },
            // {
            //     "position": "top",
            //     "type": "tabs",
            //     // "content": $("#mmenu-tabs").children().toArray()
            //     "content": Array.from(document.querySelector("#mmenu-tabs").children)
            // },
            {
                // "use": ($("#mmenu-socials").length > 0 ? true : false),
                use: (document.querySelector("#mmenu-socials") ? true : false),
                position: "bottom",
                // content: $("#mmenu-socials").children().toArray()
                content: (document.querySelector("#mmenu-socials") ? Array.from(document.querySelector("#mmenu-socials").children) : null)
            },
        ],
        // setSelected: {
        //     hover: true // чтобы пункт меню был активным при наведении мышью (например, для десктопа). Раскомментировать только если меню будет использоваться на десктопе
        // },
    }, {
        // configuration
        classNames: {
            selected: (document.querySelector("body.item") ? "active": "selected"),
        },
        offCanvas: {
            page: {
                selector: ".page"
            }
        },
        language: "ru",
        // "searchfield": {
        //     "clear": true
        // }
    });

    // options for landing
    if( document.querySelector("body.landing") ){
        Mmenu.options.onClick.close = true;
    }

    // скрипт, чтобы верхнее меню пряталось при прокрутке вниз
    // new Mhead( ".header-mobile", {
    //     pin: 100
    // });

    // fix min-height: 100vh on mobile browsers (vh-check.min.js)
    vhCheck();

});


// Lazyload
// with use_native
const lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy",
    use_native: true,
    // callback_loaded: function (el) {
    //     if ( el.closest('.lazy-container') ){
    //         el.closest('.lazy-container').classList.add("loaded");
    //     }
    //     if ( el.closest('.lazy-container-simple') ){
    //         el.closest('.lazy-container-simple').classList.add("loaded");
    //     }
    // }
});

// without use_native (false)
const lazyLoadInstance2 = new LazyLoad({
    elements_selector: ".block-bg, .img-container-bg"
});

const lazyLoadInstance_slider = new LazyLoad({
    elements_selector: ".lazy-slider-bg"
});
// /Lazyload


// JQUERY DOCUMENT READY
$(function () {

    // прокрутка к следующему блоку по кнопке
    $('.index-video-block .button-bottom').click(function (e) {
        e.preventDefault();
        $('body,html').animate({scrollTop: ($('.index-video-block').next().offset().top - $('.header-desktop').innerHeight() )}, 500);

    });
    // прокрутка к следующему блоку по кнопке


    /* Верхнее меню - пункт еще */
    try {
        $('.menu-top ul.level1').flexMenu({
            linkText : 'Еще...',
            linkTitle : 'Показать еще пункты',
            // popupClass : 'level2'
        });
    } catch (err) {

    }
    /* /Верхнее меню - пункт еще */


    /* Разворачивание разделов в вертикальном меню */
    // по клику на стрелку
    $('.vertical-menu .submenu-btn').click(function (e) {
        e.preventDefault();
        var $this = $(this),
            $this_li = $this.closest('li');

        $this_li.find('ul.level2').slideToggle(200, function(){
            /*
            Состояния пункта меню:
            - Если у пункта меню есть оба класса "selected" и "active" - то находимся в разделе, имеющем подразделы
            - Если у пункта меню один класс "active" - мы находимся в дочернем разделе, родитель которого имеет подразделы
             */
            if( !$this_li.hasClass('active') ){
                $this.toggleClass('submenu-btn-show') // если мы не находимся в разделе или подразделе этого пункта меню, то подставлять класс submenu-btn-show, при котором стрелка развернута
            } else {
                $this.toggleClass('submenu-btn-hide'); // иначе подставлять класс submenu-btn-hide, при котором стрелка свернута
            }
        });
    });

    // по клику на раздел без перехода в этот раздел (при активации галочки в админке)
    $('.vertical-menu .submenu-toggle').click(function (e) {
        e.preventDefault();
        $(this).closest('.item-wrap').find('.submenu-btn').trigger( "click" );
    });
    /* Разворачивание разделов в вертикальном меню */


    /* Верхнее меню - раздер без перехода внутрь - попадаем в подразделы */
    $('.menu-top .submenu-toggle').click(function (e) {
        e.preventDefault(); // при клике на ссылку никуда не переходим
    })
        .keydown(function(e){
            if(e.which === 13){
                e.preventDefault();
                $(this).closest('li').find('> ul').slideToggle(200); // при нажатии на enter разворачиваем подразделы
            }
        });
    /* Разворачивание разделов в вертикальном меню - попадаем в подразделы */


    // Функционал кнопок в мобильном меню - раскрывающих элементы
    $(".header-mobile-buttons a").each(function (index) {
        var this_btn = $(this);

        this_btn.click(function (e) {

            header_mobile_button_func(index);

            // если кнопка раскрывает какое-лиюо меню
            if (this_btn.data('buttonName')) {
                e.preventDefault();
                this_btn.toggleClass('active');

                $('.header-mobile-button-container').each(function () {
                    if (this_btn.data('buttonName') === $(this).data('buttonName')) {
                        $(this).slideToggle(200);
                    }
                });

            }
        });
    });

    //проверка, не нажата ли другая мобильная кнопка
    function header_mobile_button_func(index) {

        $(".header-mobile-buttons a").each(function( index_func ) {
            var this_btn_func = $(this);

            if( index_func!=index){
                if( this_btn_func.hasClass('active')){

                    this_btn_func.removeClass('active');

                    $('.header-mobile-button-container').each(function() {
                        if( this_btn_func.data('buttonName') === $(this).data('buttonName') ){

                            $(this).slideToggle(200);

                        }
                    });
                }
            }
        });

    }
    // //Функционал кнопок в мобильном меню - раскрывающих элементы


    //фокус на input при клике на кнопке поиска
    $(".header-mobile-buttons a[data-button-name='search']").click(function (e) {
        $('.header-mobile-button-container[data-button-name="search"] input[type="search"]').focus();
    });


    /* Index Owl Slider */
    $(".index-slider:not(.one-slide) .owl-carousel").each(function(){
        var owl =  $(this);

        owl.owlCarousel({
            items: 1,
            loop: (owl.find(".item").length > 1) ? true: false,
            margin: 0,
            autoplay: true,
            autoplayTimeout: 9000,
            autoplayHoverPause: true,
            // lazyLoad:true,
            nav: true,
            navText:  [
                "",
                ""
            ],
            // эффект FadeUp
            animateOut: 'owl-fadeUp-out',
            animateIn: 'owl-fadeUp-in',
            responsiveBaseElement: $('.page, #fullpage'),
            responsive:{
                0:{
                    nav: false,
                    mouseDrag: false
                },
                768:{

                }
            },
            onInitialized: function () {
                lazyLoadInstance_slider.update();
            }
        }).on('changed.owl.carousel', function (event) {
            // при ручном перелистывании слайдера обновлять таймаут автопрокрутки
            owl.trigger('stop.owl.autoplay');
            owl.trigger('play.owl.autoplay', [9000]);
        });

        owl.find('.owl-nav .owl-prev').attr('title', 'Предыдущий');
        owl.find('.owl-nav .owl-next').attr('title', 'Следующий');
    });
    /* /Index Owl Slider */


    /* Fullwidth Owl Slider */
    $(".fullwidth-slider:not(.one-slide) .owl-carousel").each(function(){
        var owl =  $(this);
        owl.owlCarousel({
            items: 1,
            loop: (owl.find(".item").length > 1) ? true: false,
            margin: 0,
            autoplay: true,
            autoplayTimeout: 9000,
            autoplayHoverPause: true,
            // lazyLoad:true,
            nav: true,
            navText:  [
                "",
                ""
            ],
            // эффект FadeUp
            animateOut: 'owl-fadeUp-out',
            animateIn: 'owl-fadeUp-in',
            responsiveBaseElement: $('.page, #fullpage'),
            responsive:{
                0:{
                    nav: false,
                    mouseDrag: false
                },
                768:{

                }
            },
            onInitialized: function () {
                lazyLoadInstance_slider.update();
            }
        }).on('changed.owl.carousel', function (event) {
            // при ручном перелистывании слайдера обновлять таймаут автопрокрутки
            owl.trigger('stop.owl.autoplay');
            owl.trigger('play.owl.autoplay', [9000]);
        });

        owl.find('.owl-nav .owl-prev').attr('title', 'Предыдущий');
        owl.find('.owl-nav .owl-next').attr('title', 'Следующий');
    });
    /* /Fullwidth Owl Slider */


    /* Basic Owl Slider */
    $(".basic-slider:not(.one-slide) .owl-carousel").each(function(){
        var owl =  $(this);
        owl.owlCarousel({
            // autoHeight:true,
            items: 1,
            loop: (owl.find(".item").length > 1) ? true: false,
            margin: 100,
            autoplay: true,
            autoplayTimeout: 9000,
            autoplayHoverPause: true,
            // lazyLoad:true,
            navText:  [
                "",
                ""
            ],
            responsiveBaseElement: $('.page, #fullpage'),
            responsive:{
                0:{
                    nav: false,
                    mouseDrag: false,
                    dots: true
                },
                768:{
                    nav: true,
                    dots: false
                }
            }
        }).on('changed.owl.carousel', function (event) {
            // при ручном перелистывании слайдера обновлять таймаут автопрокрутки
            owl.trigger('stop.owl.autoplay');
            owl.trigger('play.owl.autoplay', [9000]);
        });

        owl.find('.owl-nav .owl-prev').attr('title', 'Предыдущий');
        owl.find('.owl-nav .owl-next').attr('title', 'Следующий');
    });
    /* /Basic Owl Slider */


    /* /Carousel Owl Slider */
    $(".carousel-slider .owl-carousel").each(function(){
        var owl =  $(this);
        owl.owlCarousel({
            autoplay: true,
            autoplayTimeout: 9000,
            autoplayHoverPause: true,
            // lazyLoad:true,
            navText:  [
                "",
                ""
            ],
            dots: false,
            responsiveBaseElement: $('.page, #fullpage'),
            responsive:{
                0:{
                    items:1,
                    margin: 15,
                    nav: false,
                    dots: true,
                    // stagePadding: 35,
                    loop: true,
                    mouseDrag: false
                },
                576:{
                    items: 2,
                    margin: 30,
                    nav: false,
                    rewind:true,
                    dots: true,
                    mouseDrag: false
                },
                768:{
                    items: 3,
                    margin: 30,
                    nav: true,
                    rewind:true,
                    mouseDrag: true
                },
                992:{
                    items: 4,
                    margin: 30,
                    nav: true,
                    rewind:true
                }

            }
        }).on('changed.owl.carousel', function (event) {
            // при ручном перелистывании слайдера обновлять таймаут автопрокрутки
            owl.trigger('stop.owl.autoplay');
            owl.trigger('play.owl.autoplay', [9000]);
        });

        owl.find('.owl-nav .owl-prev').attr('title', 'Предыдущий');
        owl.find('.owl-nav .owl-next').attr('title', 'Следующий');
    });
    /* /Carousel Owl Slider */


    /* SYNCED Owl Slider */
    if ($(".synced-slider1:not(.one-slide) .owl-carousel").is("div")) {

        var owl = $('.synced-slider1 .owl-carousel');
        var owl2 = $('.synced-slider2 .owl-carousel');

        owl.owlCarousel({
            items: 1,
            autoplay: true,
            autoplayTimeout: 9000,
            autoplayHoverPause: true,
            margin: 30,
            // lazyLoad: true,
            nav: true,
            navText:  [
                "",
                ""
            ],
            dots: false,
            responsiveBaseElement: $('.page, #fullpage'),
            responsive:{
                0:{
                    margin: 15,
                    nav: false,
                    dots: true,
                    mouseDrag: false
                    // stagePadding: 35
                },
                576:{
                    dots: true,
                    mouseDrag: false
                },
                768:{

                },
                992:{

                }

            }
        }).on('changed.owl.carousel', function (event) {
            owl2.trigger('to.owl.carousel', [event.item.index, 300, true]);
            // (Optional) Remove .current class from all items
            owl2.find('.current').removeClass('current');
            // (Optional) Add .current class to current active item
            owl2.find('.owl-item .item').eq(event.item.index).addClass('current');

            // при ручном перелистывании слайдера обновлять таймаут автопрокрутки
            owl.trigger('stop.owl.autoplay');
            owl.trigger('play.owl.autoplay', [9000]);
        });

        owl2.owlCarousel({
            // margin: 6,
            // margin: 30,
            // items: 6,
            // lazyLoad: true,
            navText:  [
                "",
                ""
            ],
            nav: false,
            dots: false,
            responsiveBaseElement: $('.page, #fullpage'),
            responsive:{
                0:{

                },
                576:{

                },
                768:{
                    margin: 15,
                    items: 4,
                },
                992:{
                    margin: 15,
                    items: 5,
                },
                1360:{
                    margin: 30,
                    items: 6,
                }
            }
        })
            .on('click', '.owl-item', function (event) {
                owl.trigger('to.owl.carousel', [$(event.target).parents('.owl-item').index(), [300], true]);
            })
            .on('changed.owl.carousel', function (event) {
                // при ручном перелистывании слайдера обновлять таймаут автопрокрутки
                owl.trigger('stop.owl.autoplay');
                owl.trigger('play.owl.autoplay', [9000]);
            });

        owl2.find('.owl-item').first().find('.item').addClass('current');
    }
    /* /SYNCED Owl Slider */


    /* SYNCED single Owl Slider */
    $(".synced-slider-single:not(.one-slide) .owl-carousel").each(function(){
        var owl =  $(this);
        owl.owlCarousel({
            items: 1,
            autoplay: true,
            autoplayTimeout: 9000,
            autoplayHoverPause: true,
            margin: 30,
            // lazyLoad: true,
            nav: true,
            navText:  [
                "",
                ""
            ],
            dots: false,
            responsiveBaseElement: $('.page, #fullpage'),
            responsive:{
                0:{
                    margin: 15,
                    nav: false,
                    dots: true,
                    mouseDrag: false
                    // stagePadding: 35
                },
                576:{
                    nav: true,
                    dots: true,
                    mouseDrag: false
                },
                768:{

                },
                992:{

                }

            }
        })
            .on('changed.owl.carousel', function (event) {
                $('.synced-slider-thumbs .item').removeClass('selected');
                $('.synced-slider-thumbs .item').eq(event.item.index).addClass('selected');

                // при ручном перелистывании слайдера обновлять таймаут автопрокрутки
                owl.trigger('stop.owl.autoplay');
                owl.trigger('play.owl.autoplay', [9000]);
            });

        $('.synced-slider-thumbs .item').first().addClass('selected');

        $('.synced-slider-thumbs .item').each(function (index) {
            var this_btn = $(this);

            this_btn.click(function (e) {
                e.preventDefault();
                owl.trigger('to.owl.carousel', [index, 300]);
            });
        });
    });
    /* /SYNCED single Owl Slider */


    /* reviews Owl Slider */
    $(".reviews-slider .owl-carousel").each(function(){
        var owl =  $(this);
        owl.owlCarousel({
            // autoHeight:true,
            items: 1,
            loop: (owl.find(".item").length > 1) ? true: false,
            autoplay: true,
            autoplayTimeout: 9000,
            autoplayHoverPause: true,
            margin: 0,
            // lazyLoad:true,
            nav: true,
            navText:  [
                "",
                ""
            ],
            responsiveBaseElement: $('.page, #fullpage'),
            responsive:{
                0:{
                    nav: false,
                    dots: true,
                    mouseDrag: false
                },
                768:{

                }
            }
        }).on('changed.owl.carousel', function (event) {
            // при ручном перелистывании слайдера обновлять таймаут автопрокрутки
            owl.trigger('stop.owl.autoplay');
            owl.trigger('play.owl.autoplay', [9000]);
        });

        owl.find('.owl-nav .owl-prev').attr('title', 'Предыдущий');
        owl.find('.owl-nav .owl-next').attr('title', 'Следующий');
    });
    /* /reviews Owl Slider */


    /* fancybox 3 */
    try {

        // настройки для всех fancybox по умолчанию
        $.fancybox.defaults.thumbs.autoStart = true;
        $.fancybox.defaults.animationEffect = "zoom";
        $.fancybox.defaults.transitionEffect = "slide";
        $.fancybox.defaults.hash = false;
        $.fancybox.defaults.infobar = true;
        $.fancybox.defaults.mobile.thumbs = {
            autoStart : false
        };
        $.fancybox.defaults.buttons = [
            'slideShow',
            'fullScreen',
            'thumbs',
            'close',
            // 'share',
            // 'download',
            // 'zoom'
        ];
        $.fancybox.defaults.lang = 'ru';
        $.fancybox.defaults.i18n = {
            'ru': {
                CLOSE: 'Закрыть',
                NEXT: 'Следующий',
                PREV: 'Предыдуший',
                ERROR: 'Запрошенный контент не может быть загружен. <br/> Пожалуйста, повторите попытку позже.',
                PLAY_START: 'Слайдшоу',
                PLAY_STOP: 'Пауза',
                FULL_SCREEN: 'На весь экран',
                THUMBS: 'Эскизы',
                DOWNLOAD: 'Скачать',
                SHARE: 'Поделиться',
                ZOOM: 'Увеличить'
            }
        };

        // кнопка вызова окна заказа в товаре (оно большое по высоте - нужно чтобы прокручивалось на мобильном)
        $("[data-fancybox].order").fancybox({
            mobile : {
                touch : false
            }
        });

        // widget-phone
        $("[data-fancybox].widget-phone").fancybox({
            beforeClose : function( instance, current ) {

                $widget_str = current.$content["0"].className;

                // если попап является виджетом обратного звонка, то включать значок при закрытии попапа
                if ($widget_str.indexOf('modal-widget-phone') + 1) {
                    $('.widget-phone').stop().fadeIn(450);
                }
            }
        });

        /* Открываем автоматом по id через класс */
        var fancybox_start_id = window.location.href.indexOf("#");
        if (fancybox_start_id > 0) {
            var fancybox_id = window.location.href.substring(fancybox_start_id + 1);

            $("[data-fancybox]").each(function() {
                if( $(this).attr('data-fancybox-id') == fancybox_id){
                    $(this).click();
                }
            });
        }

    } catch (err) {
    }
    /* /fancybox 3 */


    /* Табы */
    //показываем первую вк
    $('.tovar-container .tabs .tabs-controls > .item').first().addClass('active');
    $('.tovar-container .tabs .tabs-list > .item').first().addClass('active');

    $('.tabs-controls > .item').on('click', function (e) {
        e.preventDefault();

        var item = $(this),
            contentItem = $(this).parent().parent().find('.tabs-list > .item'),
            itemPosition = item.index();

        contentItem.eq(itemPosition)
            .add(item)
            .addClass('active')
            .siblings()
            .removeClass('active');
    });
    /* /Табы */


    /* Кнопки для вкладок */
    $(".buttons-tabs .buttons-item").each(function () {
        var this_btn = $(this);

        this_btn.click(function (e) {
            e.preventDefault();

            // tab_scroll_func();

            // открытие нужной вкладки
            tab_open_func(this_btn.attr('href').replace("#", ""));
            // tab_open_func(this_btn.data('tabName'));
        });
    });

    // function tab_scroll_func(){
    //     // учитываем высоту мобильного хедера, если мобильник
    //     var $header_height = 0;
    //     if ($('.header-mobile').css('display') == 'block'){
    //         $header_height = $('.header-mobile').height();
    //     } else{
    //         $header_height = $('.menu-top-container').height();
    //         // $header_height = 0;
    //     }
    //     // скролл до нужной вкладки
    //     if($('.tabs .tabs-controls .item').length > 0){
    //         $('body,html').animate({scrollTop: $('.tabs .tabs-controls .item').offset().top - $header_height - 15}, 500);
    //     }
    //
    // }
    function tab_open_func($tab_name){
        $('.tabs .tabs-controls > .item').each(function (index) {
            if ($tab_name === $(this).attr('id')) {

                $('.tabs .tabs-controls > .item').removeClass('active');
                $(this).addClass('active');

                $('.tabs .tabs-list > .item').removeClass('active');
                $('.tabs .tabs-list > .item').eq(index).addClass('active');
            }
        });
    }

    var page_full_id = window.location.href.indexOf("#");
    if (page_full_id > 0) {
        var page_id = window.location.href.substring(page_full_id + 1);

        // tab_scroll_func();
        tab_open_func(page_id);
    }
    /* /Кнопки для вкладок */


    /* Кнопки - виджеты */
    var contentBlock = $('.page-content .container').first(), // блок с контентом сайта
        documentWidth,
        contentBlockWidth,
        contentOffsetLeft;

    /* кнопка Наверх */
    toTopButton();
    function toTopButton() {
        $('body').append('<a href="#top" class="toTop" title="Наверх"></a>');

        var toTop = $('.toTop'),
            toTopOffset = 30, // отступ кнопки от контента в px (при большом экране)
            toTopOffsetSmallScreen = 15, // отступ кнопки от левого края в px (при малом экране)
            toTopWidth = toTop.width();

        $(window).scroll(function () {
            if ($(this).scrollTop() != 0) {
                toTop.show();
                toTop.addClass('show');
            } else {
                toTop.removeClass('show');

                setTimeout(function () {
                    toTop.hide();
                }, 250)

            }
        });

        // toTop.click(function (e) {
        //     e.preventDefault();
        //     $('body,html').animate({scrollTop: 0}, 500);
        //
        // });

        //определение позиции кнопки "Наверх"
        if (contentBlock.length > 0) { // если указанный блок с контентом существует
            toTopPosition();

            $(window).resize(function () {
                toTopPosition();
            });
        }
        function toTopPosition() {
            documentWidth = $(document).width();
            contentBlockWidth = contentBlock.width();

            contentOffsetLeft = (documentWidth - contentBlockWidth) / 2;

            if (documentWidth <= (contentBlockWidth + (toTopOffset + toTopWidth + toTopOffsetSmallScreen) * 2 ) ) {
                // когда ширина окна браузера меньше чем ширина контента + ширина кнопки Назад
                toTop.css('left', toTopOffsetSmallScreen);
            } else {
                // когда ширина окна браузера больше чем ширина контента + ширина кнопки Назад
                toTop.css('left', contentOffsetLeft - toTopWidth - toTopOffset);
            }
        }
    }
    /* /кнопка Наверх */

    /* кнопка Мини-корзина 1 */
    miniCartButton();
    function miniCartButton() {

        var miniCart = $('.mini-cart'),
            miniCartOffset = 36, // отступ кнопки от контента в px (при большом экране)
            miniCartOffsetSmallScreen = 45, // отступ кнопки от правого края в px (при малом экране)
            miniCartWidth = miniCart.width();

        $(window).scroll(function () {
            cartVerticalPosition();
        });

        //определение позиции кнопки "Мини-корзина"
        if (contentBlock.length > 0) { // если указанный блок с контентом существует
            toTopPosition();

            $(window).resize(function () {
                toTopPosition();
            });
        }
        function toTopPosition() {
            documentWidth = $(document).width();
            contentBlockWidth = contentBlock.width();

            contentOffsetLeft = (documentWidth - contentBlockWidth) / 2;

            //позиционирование мини корзины по горизонтали
            if (documentWidth <= (contentBlockWidth + (miniCartOffset + miniCartWidth + miniCartOffsetSmallScreen) * 2 )) {
                $('.mini-cart').css('right', miniCartOffsetSmallScreen);
            } else{
                $('.mini-cart').css('right', contentOffsetLeft - miniCartWidth - miniCartOffset);
            }

        }

        //позиционирование мини корзины по вертикали
        function cartVerticalPosition(){

            if ($(window).scrollTop() > 149){
                $('.mini-cart').addClass('fixed');
            } else{
                $('.mini-cart').removeClass('fixed');
            }
        }
        cartVerticalPosition();
    }
    /* /кнопка Мини-корзина 1*/

    /* кнопка Мини-корзина 2*/
    miniCartButton2();
    function miniCartButton2() {

        var miniCart = $('.mini-cart2');

        $(window).scroll(function () {
            cartVerticalPosition();
        });

        //позиционирование мини корзины по вертикали
        function cartVerticalPosition(){

            if ($(window).scrollTop() > 149){
                $('.mini-cart2').addClass('fixed');
            } else{
                $('.mini-cart2').removeClass('fixed');
            }
        }
        cartVerticalPosition();

        miniCart.find('.btn-rollup, .continue').click(function(e) {
            e.preventDefault();
            miniCart.toggleClass('mini');
        });
    }
    /* /кнопка Мини-корзина 2*/
    /* Кнопки - виджеты */


    /* WIDGET PHONE */
    try {
        $('.widget-phone').standart_widgetPhone({
            // widgetTimer: 0, // таймер ,по истечении которого появится виджет
            //contentBlock: $('.page'), // блок с контентом сайта (для позиционирования виджета)
        });
    } catch (err) {
    }
    /* /WIDGET PHONE */


    /* FAQ MINI */
    $('.faq-mini .item .question').click(function(e) {

        var faq_mini_item_this = $(this).closest('.item');
        e.preventDefault();

        if ( !faq_mini_item_this.hasClass('selected') ){
            faq_mini_item_this.find('.answer').slideToggle();
            faq_mini_item_this.toggleClass('selected');
        } else {
            faq_mini_item_this.find('.answer').slideUp();
            faq_mini_item_this.toggleClass('selected');
        }
    });
    /* /FAQ MINI */


    // Маска для удобного ввода телефона
    phone_input_mask();


    // таблица адаптивная - поведение стрелок
    table_responsive_func();


    // при клике по заголовку раскрывается таблица с ценами
    $('.price-block-button').click(function (e) {
        var $item =  $(this).closest('.price-block');
        e.preventDefault();
        $(this).toggleClass("active");
        $item.find('.block-hidden').slideToggle( function () {
            $item.toggleClass("opened");
        });
    });
    // /при клике по заголовку раскрывается таблица с ценами


    // дополнительные изображения в списке товаров
    $('.catalog-products .item .img-container .dopimages .dopimages-item,' +
        '.catalog-products2 .item .img-container .dopimages .dopimages-item,' +
        '.catalog-products3 .item .img-container .dopimages .dopimages-item').mouseover(function(){
        $(this).parent().find(".dopimages-item").removeClass('selected');
        $(this).addClass('selected');
        $(this).parent().parent().find("img").attr("src", $(this).data("dop-src"));
    });
    // /дополнительные изображения в списке товаров


    /* Блок со сворачивающимся текстом */
    // if ( $(window).width() <= 575) {
    $(".text-resize-block").each(function () {
        var $this = $(this),
            text_resize_block_text_full = $this.find('.text-resize-block-full'),
            text_resize_block_text_full_height = text_resize_block_text_full.height(), // полная высота текста
            text_resize_block_text_compact,
            text_resize_block_text_height_limit = 130, // высота, больше или равно которой - то сворачивать текст
            text_resize_block_text_compact_height = 100, // высота свернутого блока
            text_resize_block_button,
            text_resize_block_button_text_closed = 'Читать далее',
            text_resize_block_button_text_opened = 'Свернуть';

        if (text_resize_block_text_full_height >= text_resize_block_text_height_limit) {
            text_resize_block_text_full.wrap('<div class="text-resize-block-compact" />');
            $this.append('<div class="text-resize-block-button-wrap">\n' +
                '                      <a class="text-resize-block-button" href="#">' + text_resize_block_button_text_closed + '</a>\n' +
                '                  </div>');

            text_resize_block_text_compact = $this.find('.text-resize-block-compact');
            text_resize_block_button = $this.find('.text-resize-block-button');

            text_resize_block_button.click(function (e) {
                e.preventDefault();

                if ($(this).hasClass('opened')) {
                    text_resize_block_text_compact.animate({
                        height: text_resize_block_text_compact_height
                    }, 500);
                    $this.removeClass('opened');
                    $(this).removeClass('opened');
                    $(this).html(text_resize_block_button_text_closed);
                } else {
                    text_resize_block_text_compact.animate({
                        height: text_resize_block_text_full_height
                    }, 500);
                    $this.addClass('opened');
                    $(this).addClass('opened');
                    $(this).html(text_resize_block_button_text_opened);
                }
            });
        }
        $this.removeClass('text-resize-block-hidden');
    });
    // }
    /* /Блок со сворачивающимся текстом */


    /* скрытие ссылок для seo */
    $('.hidden-link').replaceWith(function () {
        return '<a href="' + $(this).data('link') + '" target="_blank">' + $(this).html() + '</a>';
    });
    /* /скрытие ссылок для seo */


    // ссылка-якорь 1
    url_anchor_func(); // переход к якорю с id из урла (без анимации). Для корректной работы запускать после всех остальных скриптов (в конце ready)

    if( $('body.landing').length ) { // в лендинге
        $(window).scroll(function () {
            checkLandingSection($('.landing-section'), anchor_offset);
        });
    }
    // /ссылка-якорь 1

    // Выбор города - Где купить - Вариант 2
    $("select[name='select_city']").change(function(){
        if(this.value > 0){
            $("#selectcity").submit();
        }
    });

}); // END READY


//Скрипт добавления ссылки на источник при копировании
(function($) {
    $(function() {
        function addLink() {
            var body_element = document.getElementsByTagName ('body') [0];
            var html = "";
            if (typeof window.getSelection != "undefined") {
                var selection = window.getSelection();
                if (selection.rangeCount) {
                    var container = document.createElement("div");
                    for (var i = 0, len = selection.rangeCount; i < len; ++i) {
                        container.appendChild(selection.getRangeAt(i).cloneContents());
                    }
                    html = container.innerHTML;
                }
            } else {
                return;
            }
            if (html.toString().split(' ').length < 10) {
                return;
            }

            var pagelink = "<br/><br/> Подробнее: <a href='" + document.location.href+ "'>"  +document.location.href+ "</a>";
            var copytext = html + ' ' + pagelink;
            var newdiv = document.createElement('div');
            newdiv.style.position = 'absolute';
            newdiv.style.left = '-99999px';
            body_element.appendChild(newdiv);
            newdiv.innerHTML = copytext;
            selection.selectAllChildren(newdiv);
            window.setTimeout(function() {
                body_element.removeChild(newdiv);
            },0);
        }
        document.oncopy = addLink;
    });
})(jQuery);


//preloader
function showLoader() {
    $("#preloader").show();
}

function hideLoader() {
    $("#preloader").hide();
}


// Маска для удобного ввода телефона
function phone_input_mask() {
    try {
        $('.form-group.phone input[type=tel]').inputmask({
            mask : "(+7)|(8) ( 999 ) 999 - 99 - 99",
            "positionCaretOnClick": "ignore"
        });
    } catch (err) {
    }
}


// таблица адаптивная - поведение стрелок
function table_responsive_func() {

    $('.table-responsive').each(function() {
        var $this = $(this),
            $table_overflow = $this.find('.overflow'),
            $table =  $this.find('.overflow table'),
            $table_responsive_arrow_right_flag = false;

        $this.prepend('<div class="table-responsive-arrow arrow-left">' +
            '            <i class="fa fa-chevron-right fa-2x"></i>' +
            '        </div>' +
            '        <div class="table-responsive-arrow arrow-right">' +
            '            <i class="fa fa-chevron-right fa-2x"></i>' +
            '        </div>');

        // если таблица не помещается в контентную область, то активировать флаг
        if( $table.width() > $table_overflow.width() ){
            $table_responsive_arrow_right_flag = true;
        }

        $(window).resize(function () {
            if( $table.width() > $table_overflow.width() ){
                $table_responsive_arrow_right_flag = true;
            }
        });

        // если таблица не помещается в контентную область, показывать стрелку справа
        if( $table_responsive_arrow_right_flag ){
            $this.addClass('table-responsive-arrow-right-on');
        }

        $table_overflow.scroll(function() {

            // показать стрелку слева
            if( $table_overflow.scrollLeft() > 0 ){
                $this.addClass('table-responsive-arrow-left-on');
            }

            // убрать стрелку слева
            if( $table_overflow.scrollLeft() == 0 ){
                $this.removeClass('table-responsive-arrow-left-on');
            }

            // показать стрелку справа
            if( $table_responsive_arrow_right_flag &&
                ($table_overflow.scrollLeft() + $this.width() ) < $table.width() ){
                $this.addClass('table-responsive-arrow-right-on');
            }

            // убрать стрелку справа
            if( $table_responsive_arrow_right_flag &&
                ($table_overflow.scrollLeft() + $this.width() ) >= $table.width()-1 ){ // на мобиле стрелка не убирается, если не добавить -1
                // ($table_overflow.scrollLeft() + $this.width() ) >= $table.width() ){
                $this.removeClass('table-responsive-arrow-right-on');
            }

        });

        //клик на кнопки влево и вправо - гориз.скролл
        $this.find(".table-responsive-arrow.arrow-left").click(function () {
            var leftPos = $table_overflow.scrollLeft();
            $table_overflow.animate({scrollLeft: leftPos - 100}, 150);
        });

        $this.find(".table-responsive-arrow.arrow-right").click(function () {
            var leftPos = $table_overflow.scrollLeft();
            $table_overflow.animate({scrollLeft: leftPos + 100}, 150);
        });

    });
}
// /таблица адаптивная - поведение стрелок


// Добавить в Избранное
function add_favorite() {

    var bookmarkUrl = location.href;
    var bookmarkTitle = document.title;

    if ($.browser.mozilla) // For Mozilla Firefox Bookmark
    {
        alert('dfhfg!!');
        window.sidebar.addPanel(bookmarkTitle, bookmarkUrl,"");
    }
    else if($.browser.msie || $.browser.webkit) // For IE Favorite
    {
        window.external.AddFavorite( bookmarkUrl, bookmarkTitle);
    }
    else if($.browser.opera ) // For Opera Browsers
    {
        $(this).attr("href",bookmarkUrl);
        $(this).attr("title",bookmarkTitle);
        $(this).attr("rel","sidebar");
        $(this).click();
    }
    else // for other browsers which does not support
    {
        alert('Пожалуйста нажмите CTRL+D чтобы создать закладку в вашем браузере');
    }
    return false;
}
// /Добавить в Избранное


// focus-visible - Lazy-loading
window.addEventListener('focus-visible-polyfill-ready',
    () => window.applyFocusVisiblePolyfill(myComponent.shadowRoot),
    { once:  true });


// отложенная загрузка скрипта яндекс карт (из конструктора)
function showYandexMap(yandex_map_src, yandex_map_element_id){
    var script   = document.createElement("script");
    script.src   = yandex_map_src;
    document.getElementById(yandex_map_element_id).appendChild(script);
}
// /отложенная загрузка скрипта яндекс карт (из конструктора)


// ссылка-якорь 2
var anchor_offset, // отступ прилипающего хедера или меню (на десктопе и мобильном разный)
    anchor_offset_small = 0;
anchor_offset_small_val = 10; // еще небольшой отступ в 10px, чтоб не было впритык (но если у блока фон - то этот оступ игнорируется)

if($('.header-desktop').is(":visible")){
    if($('.nc-navbar.nc--fixed').length){
        anchor_offset = $('.menu-top-container').outerHeight() + $('.nc-navbar.nc--fixed').outerHeight();
        // anchor_offset = $('.menu-top-container ul.level1 > li:first-child').outerHeight() + $('.nc-navbar.nc--fixed').outerHeight();
    } else {
        anchor_offset = $('.menu-top-container').outerHeight();
        // anchor_offset = $('.menu-top-container ul.level1 > li:first-child').outerHeight();
    }
} else{
    anchor_offset = $('.header-mobile').outerHeight();
}

// прокрутка к якорю при клике на ссылку
$("body").on('click', '[href*="#"]', function () {
    var href = $.attr(this, 'href'),
        href_id_block;

    // если ссылка содержит href="#top", то прокручивать в начало страницы
    if( href == '#top' ){
        $('body,html').animate({scrollTop: 0}, 500);
        return false;
    } else {

        // не обрабатывать сслылки, где href содержит только '#' или '#mmenu'
        // также не обрабатывать ссылки из табов (где помимо href есть id начинающийся на tab - при клике на них не нужно перемещаться до ссылки. Перемещаться нужно только по урлу с id этого таба)
        // также не обрабытывается ссыока из режима редактирования netcat 6
        if (href != '#' && !$(this).filter('[href^="#mm"]').length && !$(this).filter('[id^="tab"]').length && !$(this).closest('.nc6-toolbar').length ) {
            // if (href != '#' && href != '#mmenu' && !$(this).filter('[id^="tab"]').length ) {

            if($(href).hasClass('tpl-anchor')){ // при включенной доп. разметке компонента появляется div class tpl-anchor
                href_id_block = $(href).next().filter('[style*="background"]').length;
            } else {
                href_id_block = $(href).filter('[style*="background"]').length;
            }

            if(href_id_block){
                anchor_offset_small = 0;
            } else {
                anchor_offset_small = anchor_offset_small_val;
            }

            anchor_offset_func($(this)); // индивидуальный отступ

            $('html, body').animate({
                scrollTop: $(href).offset().top - anchor_offset - anchor_offset_small - anchor_offset_more
            }, 500, function () {

                // В лендинге: подсвечивание активного пункта меню при клике на него после скролла до этого блока
                if( $('body.landing').length ) {
                    $menu_top_li = $('.menu-top ul > li');
                    $menu_top_li.removeClass('selected');
                    $menu_top_li.find('> a').filter('[href="' + window.location.hash + '"]').closest('li').addClass('selected');

                    $mmenu_li = $('#mmenu ul > li');
                    $mmenu_li.removeClass('mm-listitem_selected');
                    $mmenu_li.find('> a').filter('[href="' + window.location.hash + '"]').closest('li').addClass('mm-listitem_selected');
                }
            });
            // history.pushState(null,null,href);
            history.pushState(null,null,window.location.pathname + window.location.search + href );
            // window.location.search - это параметры url'а. Нужны для правильного отображения страницы в реж. редактирования,
            // когда нажали на якорь.
            // Возможно в других случаях не нужны или помешают
            return false;
        }
    }
});

// переход к якорю с id из урла (без анимации)
function url_anchor_func() {
    if (window.location.hash.indexOf('#') !== -1) {
        // var location_hash = window.location.hash.replace("#", "");
        var location_hash = window.location.hash;

        if ($(location_hash).offset()) {

            if($(location_hash).filter('[style*="background"]').length){
                anchor_offset_small = 0;
            } else {
                anchor_offset_small = anchor_offset_small_val;
            }

            anchor_offset_func($(location_hash)); // индивидуальный отступ

            setTimeout(function () {
                $('body, html').scrollTop($(location_hash).offset().top - anchor_offset - anchor_offset_small - anchor_offset_more);
            }, 500); // на локальном хостинге подойдет небольшое значение, а на боевом значение побольше, например 500
            // $(window).on('load', function(){
            //     $('body, html').scrollTop($(location_hash).offset().top - anchor_offset - anchor_offset_small - anchor_offset_more);
            // });

            // В лендинге: подсвечивание активного пункта меню при клике на него после скролла до этого блока
            if( $('body.landing').length ) {
                $menu_top_li = $('.menu-top ul > li');
                $menu_top_li.removeClass('selected');
                $menu_top_li.find('> a').filter('[href="' + location_hash + '"]').closest('li').addClass('selected');

                $mmenu_li = $('#mmenu ul > li');
                $mmenu_li.removeClass('mm-listitem_selected');
                $mmenu_li.find('> a').filter('[href="' + location_hash + '"]').closest('li').addClass('mm-listitem_selected');
            }
        }
    }
}

// ф-я определяет, видно ли сейчас данную секцию или нет и в зависимости от этого делает пункт меню активным и ставит хэш
function checkLandingSection(landing_sections, anchor_offset) {
    landing_sections.each(function () {
        var
            $this = $(this),
            topEdge,
            bottomEdge,
            wScroll = $(window).scrollTop();

        anchor_offset_func($this);
        topEdge = $this.offset().top - anchor_offset + anchor_offset_more;
        bottomEdge = topEdge + $this.height();

        if (topEdge < wScroll && bottomEdge > wScroll){
            var currentId = '#' + $this.attr('id');

            $menu_top_li = $('.menu-top ul > li');
            $menu_top_li.removeClass('selected');
            $menu_top_li.find('> a').filter('[href="' + currentId + '"]').closest('li').addClass('selected');

            $mmenu_li = $('#mmenu ul > li');
            $mmenu_li.removeClass('mm-listitem_selected');
            $mmenu_li.find('> a').filter('[href="' + currentId + '"]').closest('li').addClass('mm-listitem_selected');

            // if(currentId){
            //     window.location.hash = currentId.replace("#", ""); // Обновлять URL ссылки во время прокрутки
            // }
        }
    });
}

//ф-я доп. оступов у блоков с якорем в зависимости от дата-атрибутов и разрешения экрана (breakpoint)
var $window_width = $(window).width(),
    $anchor_offset_breakpoint,
    anchor_offset_more;
function anchor_offset_func(anchor_id) {
    // Первым используется отступ указанный В БЛОКЕ в атрибуте текущего разрешения
    // Если он не указан, то используется отступ указанный В ССЫЛКЕ в атрибуте текущего разрешения
    // Если он не указан, то используется отступ указанный В БЛОКЕ в атрибуте 'data-offset'
    // Если он не указан, то используется отступ указанный В ССЫЛКЕ в атрибуте 'data-offset'
    // Если ничего из этого не указано, то отступ 0

    switch (true) {
        case ($window_width >= 1359):
            $anchor_offset_breakpoint = 'offset-lg';
            break;
        case ($window_width >= 991) :
            $anchor_offset_breakpoint = 'offset-md';
            break;
        case ($window_width >= 767)  :
            $anchor_offset_breakpoint = 'offset-sm';
            break;
        case ($window_width >= 575)  :
            $anchor_offset_breakpoint = 'offset-xs';
            break;
        default:
            $anchor_offset_breakpoint = 'offset';
    }

    if( anchor_id.filter('[data-' + $anchor_offset_breakpoint + ']').length ){
        anchor_offset_more = anchor_id.data($anchor_offset_breakpoint);
    } else{
        anchor_link_id = '#' + anchor_id.attr('id');
        if($('a[href="' + anchor_link_id + '"][data-' + $anchor_offset_breakpoint + ']').length){
            anchor_offset_more = $('a[href="' + anchor_link_id + '"]').data($anchor_offset_breakpoint);
        } else {
            if( anchor_id.filter('[data-offset]').length ){
                anchor_offset_more = anchor_id.data('offset');
            } else{
                anchor_link_id = '#' + anchor_id.attr('id');
                if($('a[href="' + anchor_link_id + '"][data-offset]').length){
                    anchor_offset_more = $('a[href="' + anchor_link_id + '"]').data('offset');
                } else {
                    anchor_offset_more = 0;
                }
            }
        }
    }

    // если указано несколько ссылок с одним и тем же href="#id", но например рахными data-offset,
    // то по условиям выше anchor_offset_more может получиться undefined (напр, при переходе по урлу), тогда приравняем ее к 0
    if(!anchor_offset_more){
        anchor_offset_more = 0;
    }

    return anchor_offset_more;
}
// /ссылка-якорь 2


// Определение номера счетчика Яндекс.Метрики (используется для работы целей яндекс метрики)
window.onload = function () {
// document.addEventListener("DOMContentLoaded", () => { // при этом условии срабатывает через раз, тк метрика не успевает инициализироваться
    if (typeof Ya !== 'undefined') { // счетчик существует
        if (typeof Ya.Metrika !== 'undefined') { // счетчик называется Ya.Metrika
            yaC = Ya.Metrika.counters()[0].id;
        } else {
            if (typeof Ya.Metrika2 !== 'undefined') { // счетчик называется Ya.Metrika2
                yaC = Ya.Metrika2.counters()[0].id;
            }
        }
    }
// });
}


// Поиск по каталогу с подсказками
var ident_seach = 0;
$('.nc_search .text').bind("input", function() {
    ident_search = $(this).parent().attr("id");
    if ($(this).val().length > 3) {
        $.ajax({
            url: "/ajax/search/search.php",
            type: "POST",
            data: {'gosearch' : $(this).val()},
            success: function(html){
                if (html != 0) {
                    $("#" + ident_search).parents(".search-wrapper").find(".search-variants").html(html).show();
                    $("#" + ident_search).parents(".search-wrapper").find(".search-variants-option").click(function(e){
                        $("#" + ident_search + " .text").val($(this).text());
                        $("#" + ident_search).submit();
                    });
                }
            },
            dataType: 'text'
        });
    } else {
        $("#" + ident_search).parents(".search-wrapper").find(".search-variants").html('').hide();
    }
});