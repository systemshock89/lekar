/**
 * @description Анимации
 */

$(function () {

    try {
        var waypoint_offset = $('.menu-top-container').height(); // отступ, который нужен для точности (например, высота меню или хедера)

        offsetAnimateResponsive();

        // пример: анимации преимуществ
        var waypoint_object = $('.catalog-advantage-variant9');
        if( waypoint_object.length ){
            var waypoint = new Waypoint({
                element: waypoint_object,
                handler: function(direction) {
                    // this.element.find('.item').addClass('animated bounceInRight');
                    animateCss(this.element.find('.item'), 'animate__bounceInRight');
                    this.disable();
                    // console.log(direction);
                },
                // offset: function () {
                //     return this.context.innerHeight() - this.adapter.outerHeight() - 100
                // }
                // offset: 'bottom-in-view'
                offset: '50%'
            });
        }

        // пример: анимации текста в 2 колонки - 1 колонка
        var waypoint_object = $('.text-block-two-columns-anim');
        if( waypoint_object.length ){
            var waypoint = new Waypoint({
                element: waypoint_object,
                handler: function(direction) {
                    animateCss(this.element.find('[class*="col-"]:nth-child(1) .text-container'), 'animate__bounceInLeft');
                    this.disable();
                },
                offset: '50%'
            });
        }

        // пример: анимации текста в 2 колонки - 2 колонка
        var waypoint_object = $('.text-block-two-columns-anim');
        if( waypoint_object.length ){
            var waypoint = new Waypoint({
                element: waypoint_object,
                handler: function(direction) {
                    animateCss(this.element.find('[class*="col-"]:nth-child(2) .text-container'), 'animate__bounceInRight');
                    this.disable();
                },
                offset: '50%'
            });
        }

        // пример: анимации преимуществ 2
        var waypoint_object = $('.catalog-advantage-animate');
        if( waypoint_object.length ){
            var waypoint = new Waypoint({
                element: waypoint_object,
                handler: function(direction) {
                    animateCss(this.element.find('.item'), 'animate__fadeIn');
                    this.disable();
                },
                offset: '50%'
            });
        }

    } catch (err) {

    }

}); // END READY

function animateCss(element, animationName, callback) {
    // если анимируемых элементов много, то проделываем манипуляции с каждым
    // к каждому элементу подставляется класс animated (скрытый элемент становится виден) и класс типа анимации.
    // Когда анимация заканчичивается, то класс animated и класс типа анимации удаляются (чтобы не мешать другим стилям)
    // и подставляется класс animated-end, который препятствует исчезновению элементов и их повторной анимации
    $.each(element, function() {
        var $this = $(this);

        if( !$this.hasClass('animated-end') ){

            $this.addClass('animate__animated ' + animationName);

            $this.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
                function(e) {
                    $this.removeClass('animate__animated ' + animationName);
                    $this.addClass('animated-end');

                    if (typeof callback === 'function') callback()
                });
        }
    });
}

// ф-я разных видов отступов на разных экранах
function offsetAnimateResponsive() {
    var width = $(window).width();

    if (width > 1359) {
        offsetAnimate = 'bottom-in-view';
    }
    else if (width > 991) {
        offsetAnimate = '100%';
    }
    else if (width > 767) {
        offsetAnimate = '100%';
    }
    else if (width > 575) {
        offsetAnimate = '100%';
    }
    else if (width > 319) {
        offsetAnimate = '100%';
    }
    else {
        offsetAnimate = '100%';
    }
    return offsetAnimate;
}