/**
 * @author Serega K.
 * @description Скрипт версии для слабовидящих
 * version: 1.0.1
 *
 */

// при клике по кнопке показывается окно с настройками
$('.svhelp-button').click(function(e){
    e.preventDefault();
    $(this).closest('.svhelp').toggleClass('open');
});

// клик "Обычная версия сайта"
$('.svhelp-default').click(function(e){
    e.preventDefault();

    $('html').removeClass('svhelp-theme-white');
    $('html').removeClass('svhelp-theme-dark');
    $('html').removeClass('svhelp-theme-brown');
    $('html').removeClass('svhelp-theme-blue');
    $('html').removeClass('svhelp-font-size-small');
    $('html').removeClass('svhelp-font-size-medium');
    $('html').removeClass('svhelp-font-size-big');
    $('html').removeClass('svhelp-font-times');
    $('html').removeClass('svhelp-font-arial');

    // $.removeCookie('svhelp-theme', { path: '/' });
    // $.removeCookie('svhelp-font-size', { path: '/' });
    // $.removeCookie('svhelp-font', { path: '/' });

    Cookies.remove('svhelp-theme');
    Cookies.remove('svhelp-font-size');
    Cookies.remove('svhelp-font');

    try {
        $.fn.matchHeight._update(); //обновить значения скрипта высоты - matchHeight
        flexMenu(); // обновить скрипт меню с кнопкой "еще"
    } catch (err) {

    }
});

// клик "Цветовая схема"
$('.svhelp-item.svhelp-theme .item').click(function(e){
    e.preventDefault();

    $('html').removeClass('svhelp-theme-white');
    $('html').removeClass('svhelp-theme-dark');
    $('html').removeClass('svhelp-theme-brown');
    $('html').removeClass('svhelp-theme-blue');

    $('html').addClass($(this).data('svhelpClass'));

    // $.cookie('svhelp-theme', $(this).data('svhelpClass'), {
    //     expires: 1, // таймер действия куки (1 сутки)
    //     path: '/' //чтобы кука была доступна на всем сайте
    // });

    Cookies.set('svhelp-theme', $(this).data('svhelpClass'), { expires: 1 }) // таймер действия куки (1 сутки)

});

// клик "Размер шрифта"
$('.svhelp-item.svhelp-font-size .item').click(function(e){
    e.preventDefault();

    $('html').removeClass('svhelp-font-size-small');
    $('html').removeClass('svhelp-font-size-medium');
    $('html').removeClass('svhelp-font-size-big');

    $('html').addClass($(this).data('svhelpClass'));

    // $.cookie('svhelp-font-size', $(this).data('svhelpClass'), {
    //     expires: 1,
    //     path: '/'
    // });

    Cookies.set('svhelp-font-size', $(this).data('svhelpClass'), { expires: 1 })

    try {
        $.fn.matchHeight._update(); //обновить значения скрипта высоты - matchHeight
        flexMenu(); // обновить скрипт меню с кнопкой "еще"
    } catch (err) {

    }

});

// клик "Шрифт"
$('.svhelp-item.svhelp-font .item').click(function(e){
    e.preventDefault();

    $('html').removeClass('svhelp-font-times');
    $('html').removeClass('svhelp-font-arial');

    $('html').addClass($(this).data('svhelpClass'));

    // $.cookie('svhelp-font', $(this).data('svhelpClass'), {
    //     expires: 1,
    //     path: '/'
    // });

    Cookies.set('svhelp-font', $(this).data('svhelpClass'), { expires: 1 })
});

// if( $.cookie('svhelp-theme') != 'false' ){
//     $('html').addClass($.cookie('svhelp-theme'));
// }
// if( $.cookie('svhelp-font-size') != 'false' ){
//     $('html').addClass($.cookie('svhelp-font-size'));
// }
// if( $.cookie('svhelp-font') != 'false' ){
//     $('html').addClass($.cookie('svhelp-font'));
// }

if( Cookies.get('svhelp-theme') != 'false' ){
    $('html').addClass(Cookies.get('svhelp-theme'));
}
if( Cookies.get('svhelp-font-size') != 'false' ){
    $('html').addClass(Cookies.get('svhelp-font-size'));
}
if( Cookies.get('svhelp-font') != 'false' ){
    $('html').addClass(Cookies.get('svhelp-font'));
}
/* /ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ */