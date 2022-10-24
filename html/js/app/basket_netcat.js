$(function() {

    /**
     * Инициализация кнопок «Положить в корзину» (предполагается, что у таких
     * кнопок есть CSS-класс .tpl-link-cart-add).
     */
    $('.tpl-link-cart-add').on('click', function(e) {
        var form = $(e.target).closest('form');

        showLoader();

        $.post(form.attr('action'), form.serialize() + "&json=1", null, 'json')
            .done(function(response) { processCartResponse(response); })
            .fail(processCartError);
        return false;
    });


    /**
     * кнопки плюс и минус
     */
    $(".tovars-counter-btn").on('click', function(e) {
        e.preventDefault();
        var tovars_counter_id = $(this).data('tovar_id'),
            tovars_counter_input = $('[name="cart' + tovars_counter_id + '"]'),
            tovars_counter_input_val = tovars_counter_input.val(),
            tovars_counter_type = $(this).data('type');

        if (tovars_counter_type == "plus") {
            tovars_counter_input_val++;
        } else {
            if(tovars_counter_input_val > 1 ){
                tovars_counter_input_val--;
            }
        }
        tovars_counter_input.val(tovars_counter_input_val);
        // return false;
    });


    /**
     * Изменение value счетчика товаров при вводе количества с клавиатуры
     */
    $( ".tovars-counter-input" ).keyup(function() {
        var $this = $(this),
            $this_val = $this.val(),
            tovars_counter_input_name = $(this).attr('name');
        $( "input[name='" + tovars_counter_input_name + "']" ).val($this_val);
    });


});


/**
 * Обработчик ответа на запрос на добавление товара в корзину
 */
function processCartResponse(response) {
    // Обновим блок «Корзина» на странице
    var totalItems = response.TotalItemCount,
        totalItemPriceF = response.TotalItemPriceF;

    // корзина в десктопном хедере
    if($('.header-mini-cart').length){
        var header_mini_cart = $('.header-mini-cart');

        header_mini_cart.find($('.tovar-count')).html(totalItems + ' ' + pluralForm(totalItems, 'товар', 'товара', 'товаров'));
        header_mini_cart.find($('.summ')).removeClass('hidden').html('на сумму ' + totalItemPriceF);
    }

    // корзина в мобильном хедере
    if($('.header-mobile-buttons .fa-shopping-basket.cart').length){
        var header_mobile_cart = $('.header-mobile-buttons .fa-shopping-basket.cart'),
            header_mobile_cart_count = header_mobile_cart.find($('.count'));
        if( header_mobile_cart_count.length ){
            header_mobile_cart_count.html(totalItems);
        } else {
            header_mobile_cart.html('<span class="count">' + totalItems + '</span>');
        }
    }

    // Корзина-виджет справа 1
    if($('.mini-cart').length){
        $('.mini-cart').addClass('active').find($('.count')).html(totalItems);
    }

    // Корзина-виджет справа 2
    if($('.mini-cart2').length){
        var mini_cart2 = $('.mini-cart2');

        mini_cart2
            .addClass('active')
            .removeClass('mini')
            .find($('.count')).html(totalItems);

        mini_cart2.find($('.tovar-count')).html(totalItems + ' ' + pluralForm(totalItems, 'товар', 'товара', 'товаров'));
        mini_cart2.find($('.summ')).removeClass('hidden').html('на сумму ' + totalItemPriceF);
        mini_cart2.find($('.oformit-zakaz')).removeClass('hidden');
    }

    // Корзина-виджет снизу
    if($('.mini-cart3').length){
        $('.mini-cart3').removeClass('hidden').find($('.count')).html(totalItems);
    }

    // Сообщения о невозможности добавить выбранное количество товара в корзину
    if (response.QuantityNotifications) {
        // Обработка таких сообщений не показана в этом примере для краткости
    }

    hideLoader();

    // Сообщение о том, что товар успешно добавлен в корзину:
    //alert('Товар добавлен в корзину');
}


/**
 * Обработчик ошибки запроса на добавление товара в корзину
 */
function processCartError() {
    // alert('Не удалось добавить товар в корзину');
    fancybox_success_message2('Ошибка', 'Не удалось добавить товар в корзину');

    setTimeout(function(){
        $.fancybox.getInstance().close();
        hideLoader();
    },1000);
}

/**
 * Всплывающее окно с текстом (например об ошибке)
 */
function fancybox_success_message2(title_send, text_send) {
    $.fancybox.open('' +
        '<div class="modal modal-success">' +
        '<form class="form-container">' +
        '<div class="h2">'+title_send+'</div>' +

        '<div class="form-group">' +
        '<div class="success-text">'+text_send+'</div>' +
        '</div>' +

        '<div class="button-container">' +
        '<a class="button" href="#" data-fancybox-close >Ok</a>' +
        '</div>' +

        '</form>' +
        '</div>' +
        '');
}

/**
 * Склонение русских слов
 * @param {Number} itemQuantity  Количество товаров
 * @param {String} one           «товар»
 * @param {String} two           «товара»
 * @param {String} many          «товаров»
 * @returns {String}
 */
function pluralForm(itemQuantity, one, two, many) {
    itemQuantity = Math.abs(itemQuantity) % 100;
    var underHundred = itemQuantity % 10,
        result = many;

    if (underHundred > 1 && underHundred < 5) { result = two; }
    if (underHundred == 1) { result = one; }
    if (itemQuantity > 10 && itemQuantity < 20) { result = many; }

    return result;
}