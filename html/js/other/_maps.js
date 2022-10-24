/**
 * @description Карты Яндекса
 */

$(function () {

    /* КАРТА YANDEX - ввода адреса в админке*/
    try {
        function init_map_with_adress($map_adress_string, $map_id, $map_zoom) {
            return function () {
                // карта в карточке товара
                var myMap_tovar = new ymaps.Map($map_id, {
                    // При инициализации карты обязательно нужно указать
                    // её центр и коэффициент масштабирования.
                    center: [64.8644,101.7029],
                    zoom: $map_zoom
                });

                // Поиск координат центра Нижнего Новгорода.
                ymaps.geocode($map_adress_string, {
                    /**
                     * Опции запроса
                     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/geocode.xml
                     */
                    // boundedBy: myMap_tovar.getBounds(), // Сортировка результатов от центра окна карты
                    // strictBounds: true, // Вместе с опцией boundedBy будет искать строго внутри области, указанной в boundedBy
                    results: 1 // Если нужен только один результат, экономим трафик пользователей
                }).then(function (res) {
                    // Выбираем первый результат геокодирования.
                    var firstGeoObject = res.geoObjects.get(0),
                        // Координаты геообъекта.
                        coords = firstGeoObject.geometry.getCoordinates(),
                        // Область видимости геообъекта.
                        bounds = firstGeoObject.properties.get('boundedBy');

                    // Добавляем первый найденный геообъект на карту.
                    //myMap_tovar.geoObjects.add(firstGeoObject);
                    // Масштабируем карту на область видимости геообъекта.
                    myMap_tovar.setBounds(bounds, {
                        checkZoomRange: true // проверяем наличие тайлов на данном масштабе.
                    });

                    /**
                     * Если нужно добавить по найденным геокодером координатам метку со своими стилями и контентом балуна, создаем новую метку по координатам найденной и добавляем ее на карту вместо найденной.
                     */

                    var myPlacemark = new ymaps.Placemark(coords, {
                        hintContent: firstGeoObject.properties.get('name')
                    }, {
                        //preset: 'islands#violetStretchyIcon',
                        // Опции.
                        // Необходимо указать данный тип макета.
                        iconLayout: 'default#image',
                        // Своё изображение иконки метки.
                        // iconImageHref: '/img/map2.png',
                        // Размеры метки.
                        // iconImageSize: [72, 62],
                        // Смещение левого верхнего угла иконки относительно
                        // её "ножки" (точки привязки).
                        // iconImageOffset: [-21, -58],
                        draggable: false
                    });

                    myMap_tovar.geoObjects.add(myPlacemark);

                    myMap_tovar.zoomRange.get(coords).then(function (range) {
                        myMap_tovar.setCenter(coords, range[1] - 2);
                    });

                });
            }
        }

        $(".contacts-block .item").each(function () {

            $this = $(this);
            $map_adress_string = $this.find('.map_adress_string').text();
            $map_id = $this.find('.map_id').text();
            $map_zoom = $this.find('.map_zoom').text();

            if ($map_adress_string != '' && $map_id != '' && $map_zoom != '') {
                ymaps.ready(init_map_with_adress($map_adress_string, $map_id, $map_zoom));
            }

        });
    } catch (err) {

    }
    /* /КАРТА YANDEX - ввода адреса в админке*/


    /* КАРТА YANDEX - старая*/
    // try {
    //     if ($('#map').length > 0) {
    //
    //         var myMap;
    //
    //         function init() {
    //             // Создание экземпляра карты и его привязка к контейнеру с
    //             // заданным id ("map").
    //             myMap = new ymaps.Map('map', {
    //                 // При инициализации карты обязательно нужно указать
    //                 // её центр и коэффициент масштабирования.
    //                 center: [55.76, 37.64],
    //                 zoom: 10
    //             });
    //
    //             // Создаем геообъект с типом геометрии "Точка".
    //             myGeoObject = new ymaps.GeoObject({
    //                 // Описание геометрии.
    //                 geometry: {
    //                     type: "Point",
    //                     coordinates: [55.76, 37.64]
    //                 },
    //                 // Свойства.
    //                 properties: {
    //                     // Контент метки.
    //                     iconContent: 'Москва златоглавая',
    //                     hintContent: 'Дополнительная инфа всплывает'
    //                 }
    //             }, {
    //                 // Опции.
    //                 // Иконка метки будет растягиваться под размер ее содержимого.
    //                 preset: 'islands#blackStretchyIcon',
    //                 // Метку можно перемещать.
    //                 draggable: false
    //             });
    //
    //             myMap.behaviors.disable('scrollZoom');
    //
    //             myMap.geoObjects
    //                 .add(myGeoObject);
    //
    //             // ховер на геообъект
    //             myGeoObject.events
    //                 .add('mouseenter', function (e) {
    //                     // Ссылку на объект, вызвавший событие,
    //                     // можно получить из поля 'target'.
    //                     e.get('target').options.set('preset', 'islands#redStretchyIcon');
    //                 })
    //                 .add('mouseleave', function (e) {
    //                     e.get('target').options.set('preset', 'islands#blackStretchyIcon');
    //                 });
    //
    //         }
    //
    //         // Дождёмся загрузки API и готовности DOM.
    //         ymaps.ready(init);
    //     }
    // } catch (err) {
    //
    // }
    /* КАРТА YANDEX - старая*/


}); // END READY
