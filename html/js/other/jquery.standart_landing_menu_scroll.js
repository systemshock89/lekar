/**
 * @description Плавный скролл по пуктам верхнего меню с выбором активного пункта, скролл по логотипу наверх
 * version: 1.0.3
 */

jQuery.fn.standart_landing_menu_scroll = function(options){

    var options = jQuery.extend({
        sections: $('section'), // секции, отображающиеся в виде пунктов верхнего меню
        nav: $('.menu-top ul li a, .slicknav_menu ul li a, .logo'), // сами пункты меню и логотип
        nav_height: 0, //  отступ сверхну, например от хедера
        speed: 500, //скорость анимации скролла
        updateHash: false // Обновлять URL ссылки во время прокрутки
    },options);

    return this.each(function() {

        // плавная прокрутка для пунктов верхнего меню
        options.nav.bind('click', function (e) {
            e.preventDefault();

            showSection($(this).attr('href'), true, options.sections, options.nav, options.nav_height);

        });

        // мгновенная прокрутка к нужной секции, если перещли по ссылке с хешом (нужен таймаут, чтоб загрузились слайдеры и другие скрипты)
        setTimeout(function () {
            showSection(window.location.hash, false, options.sections, options.nav, options.nav_height);
        }, 1000);

        checkSection(options.sections, options.nav, options.nav_height);
        $(window).scroll(function () {
            checkSection(options.sections, options.nav, options.nav_height);
        });


        // ф-я плавной прокрутки к выбранному пункту меню
        function showSection(sectionHash, isAnimate, sections, nav, nav_height) {
            var
                direction = sectionHash.replace(/#/, ''),
                reqSection,
                reqSectionPos;

            if( direction === 'top' ){
                $('body,html').stop().animate({scrollTop: 0}, options.speed, function() {
                    history.pushState("", document.title, window.location.pathname  + window.location.search);
                    navActiveBeforeClick(nav, direction);
                });
                return false;
            }

            if(direction){
                reqSection = sections.filter('[data-section="' + direction + '"]');
                offsetSection(reqSection);
                reqSectionPos = reqSection.offset().top - nav_height + reqOffset + 1;
            } else{
                return false;
            }

            if (isAnimate){

                if( $('.header-desktop').is(":visible") ){
                    //на десктопе анимация прокурутки идет сразу после нажатия
                    $('body, html').stop().animate({scrollTop: reqSectionPos}, options.speed, function () {
                        navActiveBeforeClick(nav, direction);
                    });
                } else{
                    //а на мобиле анимация идет с задержкой, чтобы мобильное меню успело свернуться и не возникало глюков прокурутки
                    $('body, html').stop().delay(450).animate({scrollTop: reqSectionPos}, options.speed, function () {
                        navActiveBeforeClick(nav, direction);
                    });
                }

            } else {
                $('body, html').scrollTop(reqSectionPos);

                setTimeout(function () {
                    navActiveBeforeClick(nav, direction);
                }, 1200);
            }

        }

        //ф-я, которая будет определять, видно ли сейчас данную секцию или нет и ставить активный пункт меню ти хеш
        function checkSection(sections, nav, nav_height) {
            sections.each(function () {
                var
                    $this = $(this),
                    topEdge,
                    bottomEdge,
                    wScroll = $(window).scrollTop();

                offsetSection($this);
                topEdge = $this.offset().top - nav_height + reqOffset;
                bottomEdge = topEdge + $this.height();

                if (topEdge < wScroll && bottomEdge > wScroll){
                    var
                        currentId = $this.data('section'),
                        reqLink = nav.filter('[href="#' + currentId + '"]');

                    nav.closest('li').removeClass('selected');
                    reqLink.closest('li').addClass('selected');

                    if(currentId){
                        if(options.updateHash){
                            window.location.hash = currentId;
                        }
                    }

                }
            });

        }

        //ф-я оступов у блоков в зависимости от breakpoint
        function offsetSection(reqSection) {
            // отступы в конкретном блоке на разных разрешениях. Если не укаазан отступ на конкретном breakpoint,
            // то используется отступ offset, если не указано никаких отступов, то offset = 0
            var width = $(window).width(),
                dataOffset = reqSection.data('offset');
            if (dataOffset) {
                reqOffset = dataOffset;
            } else {
                reqOffset = 0;
            }
            if (width > 1359) {
                var dataOffsetXl = reqSection.data('offset-xl');
                if(dataOffsetXl){
                    reqOffset = dataOffsetXl;
                }
            }
            else if (width > 991) {
                var dataOffsetLg = reqSection.data('offset-lg');
                if(dataOffsetLg){
                    reqOffset = dataOffsetLg;
                }
            }
            else if (width > 767) {
                var dataOffsetMd = reqSection.data('offset-md');
                if(dataOffsetMd){
                    reqOffset = dataOffsetMd;
                }
            }
            else if (width > 575) {
                var dataOffsetSm = reqSection.data('offset-sm');
                if(dataOffsetSm){
                    reqOffset = dataOffsetSm;
                }
            }
            else if (width > 319) {
                var dataOffsetXs = reqSection.data('offset-xs');
                if(dataOffsetXs){
                    reqOffset = dataOffsetXs;
                }
            }
        }

        //ф-я подсвечивания активного пункта меню при клике на него после скролла до этого блока
        function navActiveBeforeClick(nav, direction) {
            nav.closest('li').removeClass('selected');
            reqLink = nav.filter('[href="#' + direction + '"]');
            reqLink.closest('li').addClass('selected');
        }

    });
};