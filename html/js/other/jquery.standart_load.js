/**
 * @author Alexandr Belikh
 * @email zimovchanin@gmail.com
 * @description Общение с сервером
 * version: 0.0.4
 *
 * Создан 19.03.2014 Позволяет удобно общаться с сервером. Отправляет пост запрос, получает ответ в формате json ( 0JHQtdC70YvRhSDQkNC70LXQutGB0LDQvdC00YAg0KHQtdGA0LPQtdC10LLQuNGHIHppbW92Y2hhbmluQGdtYWlsLmNvbQ== )
 */
jQuery.fn.standart_load = function(options){
    var $this = {};
    var options = jQuery.extend({
        url:false,/* Спец урл */
        func:function(data){/* Обработчик ответа */
            var sc_ = '';
            if(data['script']) {
                sc_ = data['script'];
                delete data['script'];
            }
            for( i in data ) {
                jQuery(i).html(data[i]);
            }
            sc_ = sc_.replace(/\/\/.*\n/g, "");
            sc_ = sc_.replace(/\/\/.*\r/g, "");
            sc_ = sc_.replace(/\n/g, "");
            sc_ = sc_.replace(/\r/g, "");
            sc_ = sc_.replace(/\t/g, "");
            eval(sc_);
        },
        data:false,/* Данные */
        force:false, /* Насильная отправка без ожидания события */
    },options);

    return this.each(function(event) {
        $this = jQuery(this);
        var action = function() {/* Основные действия */
            var url = '/ajax/';
            var post_data = {};

            if( $this.is('a') ){/* Если ссылка */
                url = $this.attr('href'); /* УРЛ из хреф */
            } else if( $this.is('form') ){/* Если форма */
                url = $this.attr('action'); /* УРЛ из акшион */
                post_data = $this.serializeArray(); /* Данные из формы */
            }

            if( options.url ) /* Специфический урл */
                url = options.url;

            if( options.data ) /* Специфические данные */
                post_data = options.data;

			/* ПОЕХАЛИ */
            jQuery.post(
                url,
                post_data,
                options.func,
                'json'
            );
        };

        if(options.force) { /* Без событий - насильная отправка */
            action();
        } else { /* Вешаем События */
            $this.bind({
                click: function(event){/* Клик по ссылке */
                    event.preventDefault();
                    if( $this.is('a') )
                        action();
                },
                submit: function(event){/* Отправка формы */
                    event.preventDefault();
                    if( $this.is('form') )
                        action();

                }
            });
        }

    });
};
/* d5b8675f7f6f9cfa7c296c91eb970dd2 */