/**
 * @author A1exandr Bel|kh
 * @email zimovchanin@gmail.com
 * @description Стандартное меню
 * version: 0.0.1
 *
 * Создан 03.02.2014 Будет генерировать меню по указаному шаблону. В шаблоне можно задать префикс, суффикс, активный элемент, пассивный элемент, разделитель. Данные необходимо передавать в определенном формате как data ( 0JHQtdC70YvRhSDQkNC70LXQutGB0LDQvdC00YAg0KHQtdGA0LPQtdC10LLQuNGHIHppbW92Y2hhbmluQGdtYWlsLmNvbQ== )
 */
jQuery.fn.standart_menu = function(options){
	var options = jQuery.extend({
		data: [],
		prefix:'<ul>',
		suffix:'</ul>',
		active:'<li class="selected"><a href="%URL">%NAME</a>%CHILDREN</li>',
		unactive:'<li><a href="%URL">%NAME</a>%CHILDREN</li>',
		divider:'',
	},options);
	
	return this.each(function() {
		var $this = jQuery(this);
		var html = "";
		var reqursion = function(list){ /* Рекурсия для сбора дерева в код */
			
			var code = options.prefix;
			
			if( list.length > 0 ) {
				for( element in list ){ /* Пробегаем по элементам */
					
					var str = (list[element].selected) ? options.active : options.unactive ;
					var children = "";
					str = str.replace("%URL",list[element].url);
					str = str.replace("%NAME",list[element].name);
					if( list[element].children ) children = reqursion( list[element].children );
					str = str.replace("%CHILDREN",children);
					
					code += str;
				}
			}
			
			code += options.suffix;
			
			return code;
		};
		
		html = reqursion( options.data ); /* Формируем код */
		$this.html(html);
	});
};
/* d5b8675f7f6f9cfa7c296c91eb970dd2 */