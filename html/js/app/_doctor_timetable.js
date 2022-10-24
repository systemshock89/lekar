/**
 * @description Скрипты графика приема врачей (ajax подгрузка списка врачей и расписания на страницы и в формы записи)
 */

// JQUERY DOCUMENT READY
$(function () {

    try {
        // кнопка вызова общей формы записи на прием
        $("[data-fancybox].modal-zapis-btn").fancybox({
            autoFocus: false,
            afterShow : function( instance, current ) {
                form_zapis_main();
            },
            beforeClose : function() {
                //удалим календарь при закрытии попапа, если он сам не успел
                $('.field_date input').datepicker( "destroy" );
                $('.ui-datepicker').remove();
            }
        });

        // кнопка вызова формы записи на прием для конкретного врача
        $("[data-fancybox].modal-zapis-doctor-btn").fancybox({
            autoFocus: false,
            afterShow : function( instance, current ) {
                let btn_trigger = instance.$trigger[0];
                form_zapis_doctor($(btn_trigger).data('employee-id'));
            },
            beforeClose : function() {
                //удалим календарь при закрытии попапа, если он сам не успел
                $('.field_date input').datepicker( "destroy" );
                $('.ui-datepicker').remove();
            }
        });
    } catch (err) {
    }

}); // END READY

const kanzler_id = 68,
      kanzler_guid = 'F12F4605-C5D8-4B94-B287-C3FEB37339BA';

// Получение списка врачей и графика приема во всплыващей форме
function form_zapis_main() {
    let field_doctor = $('.field_doctor select'),
        field_doctor_div = $('.field_doctor'),
        field_date = $('.field_date input'),
        field_date_div = $('.field_date'),
        field_time = $('.field_time select'),
        instance = $.fancybox.getInstance();

    instance.showLoading(); // покажем лоадер, пока грузится список врачей

    // поля сначала недоступны
    field_doctor.prop('disabled', true);
    field_date.prop('disabled', true);
    field_time.prop('disabled', true);

    $.ajax({
        // Получение списка сотрудников без расписания с рейтингом и фото GET
        url: "https://web.kanzler.pro:9017/Kanzler_web_service/GetEmployeesInfoList/" + kanzler_id + "." + kanzler_guid,
        dataType: "json",
        crossDomain: true,
        processData: false,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "cache-control": "no-cache",
            // "Postman-Token": "04e87f9a-772f-467f-9f6e-05892b2f8fa0"
        },
    }).done(function (response) {
        if (!$.trim(response)){
            // null/undefined/empty
            instance.hideLoading();
            field_doctor_div.addClass('error').find('.form-control-feedback').show().html('Ошибка загрузки списка врачей! <br>Попробуйте позже.');
        } else {
            // console.log(response);

            let field_doctor_options_arr = [];

            // сортировка списка врачей по алфавиту (поле FIO)
            response.sort(function(a, b){
                let nameA=a.FIO.toLowerCase(), nameB=b.FIO.toLowerCase()
                if (nameA < nameB) //сортируем строки по возрастанию
                    return -1
                if (nameA > nameB)
                    return 1
                return 0 // Никакой сортировки
            })

            // вставляем список врачей в select в виде option, скрываем лоадер, фокус на этот select и делаем его доступным
            $.each( response, function( i ) {
                field_doctor_options_arr.push("<option value='"+ response[i].FIO  +"' data-employee_id='"+ response[i].id  +"'>"+ response[i].FIO +"</option>");
                // field_doctor_options_arr.push("<option value='"+ (i+1)  +"' data-employee_id='"+ response[i].id  +"'>"+ response[i].FIO +"</option>");
            });
            if(field_doctor_options_arr.length){
                field_doctor.append(field_doctor_options_arr.join(''));
                field_doctor.prop('disabled', false);
                instance.hideLoading();
                instance.focus();
            }

            field_doctor.change(function(){
                let employee_id = $(this).find(':selected').data('employee_id');

                field_date.html("");
                field_date.prop('disabled', true);
                field_time.html('<option value="0">Выберите время приема</option>');
                field_time.prop('disabled', true);

                field_date.datepicker( "destroy" ); // уничтожим старый экземпляр календаря
                field_date.val(''); // и сотрем предыдушее значения даты из поля

                if(employee_id){
                    instance.showLoading(); // покажем лоадер, пока грузится график приема конкретного врача

                    $.ajax({
                        // Получение группированного списка доступного для записи даты/времени для одного сотрудника GET
                        url: "https://web.kanzler.pro:9017/Kanzler_web_service/GetEmployeeAviableDateTimeGroupedList/" + kanzler_id + '.' + kanzler_guid + '.' + employee_id,
                        dataType: "json",
                        crossDomain: true,
                        processData: false,
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "cache-control": "no-cache",
                            // "Postman-Token": "04e87f9a-772f-467f-9f6e-05892b2f8fa0"
                        },
                    }).done(function (response2) {
                        if (!$.trim(response2)){
                            // null/undefined/empty
                            instance.hideLoading();
                            field_date_div.addClass('error').find('.form-control-feedback').show().html('У данного врача нет свободного времени приема.');
                        } else {
                            // console.log(response2);

                            let dateParse_arr = [],
                                time_arr = [],
                                time_not_actual_index_arr = [],
                                dateParse1 = '',
                                dateParse2 = '';

                            $.each( response2, function( i ) {

                                // Приведем дату к формату YY,MM,YY, вместо DD.MM.YY
                                dateParse1 = new Date(response2[i].DateComponent.replace( /(\d{2}).(\d{2}).(\d{4})/, "$3,$2,$1"));
                                if(isToday(dateParse1)){

                                    // В расписании сегодняшнего дня выберем удалим те часы, которые уже не актуальны
                                    $.each( response2[i].AvailableTimeList, function( j ) {
                                        // Приведем дату к формату YYYY-MM-DDThh:mm
                                        dateParse2 = new Date( response2[i].DateComponent.replace( /(\d{2}).(\d{2}).(\d{4})/, "$3-$2-$1") + 'T' + response2[i].AvailableTimeList[j].data);

                                        if(dateParse2 < new Date()){
                                            time_not_actual_index_arr.push(j);
                                        }
                                    });
                                    response2[i].AvailableTimeList.splice(0, time_not_actual_index_arr.length); // начиная с индекса 0 (т.е. сначала) удалим столько записей, сколько равна длина массива с неактуальными записями
                                    time_not_actual_index_arr.length = 0; // очищаем массив
                                }

                                // если в этот есть актуальное время для записей, то добавляем эти дни в массив для календаря
                                if(response2[i].AvailableTimeList.length){
                                    dateParse_arr.push(response2[i].DateComponent.replace( /(\d{2}).(\d{2}).(\d{4})/, "$3-$2-$1"));
                                }
                            });

                            // календарь
                            field_date.datepicker({
                                monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                                dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
                                firstDay: 1,
                                dateFormat: "dd.mm.yy",
                                closeText: 'Закрыть',
                                prevText: 'Предыдущий',
                                nextText: 'Следующий',
                                isRTL: false,
                                showMonthAfterYear: false,
                                yearSuffix: '',
                                minDate: 0, // Отключить прошедшие дни
                                beforeShowDay: function(date){
                                    // также отключить все дни кроме доступных для записи дней
                                    let string = jQuery.datepicker.formatDate('yy-mm-dd', date);
                                    return [dateParse_arr.indexOf(string) != -1]
                                    // return [dateParse_arr.indexOf(string) == -1]
                                },
                                onSelect: function(date){
                                    $.each( response2, function( i ) {
                                        if( response2[i].DateComponent === date){
                                            $.each( response2[i].AvailableTimeList, function( j ) {
                                                time_arr.push("<option value='"+ response2[i].AvailableTimeList[j].data  +"'>"+ response2[i].AvailableTimeList[j].data +"</option>");
                                            });
                                        }
                                    });

                                    if(time_arr.length){ // если в этот день есть часы для записи
                                        field_time.html("").append(time_arr.join(''));
                                        time_arr.length = 0; // очищаем массив
                                        field_time.prop('disabled', false);
                                        field_time.focus();
                                    }
                                }
                            });

                            instance.hideLoading();
                            field_date.prop('disabled', false);
                            field_date.focus();
                        }
                    }).fail(function () {
                        instance.hideLoading();
                        field_date_div.addClass('error').find('.form-control-feedback').show().html('Ошибка загрузки графика приема выбранного врача! <br>Попробуйте позже.');
                    });
                }
            });

        }
    }).fail(function () {
        instance.hideLoading();
        field_doctor_div.addClass('error').find('.form-control-feedback').show().html('Ошибка загрузки списка врачей! <br>Попробуйте позже.');
    });
}

// Получение графика приема конкретного врача во всплыващей форме
function form_zapis_doctor(employee_id) {
    let field_date = $('.field_date input'),
        field_date_div = $('.field_date'),
        field_time = $('.field_time select'),
        instance = $.fancybox.getInstance();

    // поля сначала недоступны
    field_date.prop('disabled', true);
    field_time.prop('disabled', true);

    if(employee_id){
        instance.showLoading(); // покажем лоадер, пока грузится график приема конкретного врача

        $.ajax({
            // Получение группированного списка доступного для записи даты/времени для одного сотрудника GET
            url: "https://web.kanzler.pro:9017/Kanzler_web_service/GetEmployeeAviableDateTimeGroupedList/" + kanzler_id + '.' + kanzler_guid + '.' + employee_id,
            dataType: "json",
            crossDomain: true,
            processData: false,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
                // "Postman-Token": "04e87f9a-772f-467f-9f6e-05892b2f8fa0"
            },
        }).done(function (response2) {
            if (!$.trim(response2)){
                // null/undefined/empty
                instance.hideLoading();
                field_date_div.addClass('error').find('.form-control-feedback').show().html('У данного врача нет свободного времени приема.');
            } else {
                // console.log(response2);

                let dateParse_arr = [],
                    time_arr = [],
                    time_not_actual_index_arr = [],
                    dateParse1 = '',
                    dateParse2 = '';

                $.each( response2, function( i ) {

                    // Приведем дату к формату YY,MM,YY, вместо DD.MM.YY
                    dateParse1 = new Date(response2[i].DateComponent.replace( /(\d{2}).(\d{2}).(\d{4})/, "$3,$2,$1"));
                    if(isToday(dateParse1)){

                        // В расписании сегодняшнего дня выберем удалим те часы, которые уже не актуальны
                        $.each( response2[i].AvailableTimeList, function( j ) {
                            // Приведем дату к формату YYYY-MM-DDThh:mm
                            dateParse2 = new Date( response2[i].DateComponent.replace( /(\d{2}).(\d{2}).(\d{4})/, "$3-$2-$1") + 'T' + response2[i].AvailableTimeList[j].data);

                            if(dateParse2 < new Date()){
                                time_not_actual_index_arr.push(j);
                            }
                        });
                        response2[i].AvailableTimeList.splice(0, time_not_actual_index_arr.length); // начиная с индекса 0 (т.е. сначала) удалим столько записей, сколько равна длина массива с неактуальными записями
                        time_not_actual_index_arr.length = 0; // очищаем массив
                    }

                    // если в этот есть актуальное время для записей, то добавляем эти дни в массив для календаря
                    if(response2[i].AvailableTimeList.length){
                        dateParse_arr.push(response2[i].DateComponent.replace( /(\d{2}).(\d{2}).(\d{4})/, "$3-$2-$1"));
                    }
                });

                // календарь
                field_date.datepicker({
                    monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                    dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
                    firstDay: 1,
                    dateFormat: "dd.mm.yy",
                    closeText: 'Закрыть',
                    prevText: 'Предыдущий',
                    nextText: 'Следующий',
                    isRTL: false,
                    showMonthAfterYear: false,
                    yearSuffix: '',
                    minDate: 0, // Отключить прошедшие дни
                    beforeShowDay: function(date){
                        // также отключить все дни кроме доступных для записи дней
                        let string = jQuery.datepicker.formatDate('yy-mm-dd', date);
                        return [dateParse_arr.indexOf(string) != -1]
                        // return [dateParse_arr.indexOf(string) == -1]
                    },
                    onSelect: function(date){
                        $.each( response2, function( i ) {
                            if( response2[i].DateComponent === date){
                                $.each( response2[i].AvailableTimeList, function( j ) {
                                    time_arr.push("<option value='"+ response2[i].AvailableTimeList[j].data  +"'>"+ response2[i].AvailableTimeList[j].data +"</option>");
                                });
                            }
                        });

                        if(time_arr.length){ // если в этот день есть часы для записи
                            field_time.html("").append(time_arr.join(''));
                            time_arr.length = 0; // очищаем массив
                            field_time.prop('disabled', false);
                            field_time.focus();
                        }
                    }
                });

                instance.hideLoading();
                field_date.prop('disabled', false);
                field_date.focus();
            }
        }).fail(function () {
            instance.hideLoading();
            field_date_div.addClass('error').find('.form-control-feedback').show().html('Ошибка загрузки графика приема выбранного врача! <br>Попробуйте позже.');
        });
    }
}

// Получение графика работы сотрудника
function timeTable_ajax_func(employee_id, f_RowID){

    let table_time_wrap = '',
        modal_zapis_doctor_btn = '';
    if(f_RowID){
        // если передан f_RowID, значит ф-я работает для списка врачей
        table_time_wrap = $('.item-' + f_RowID + ' .table-time-wrap');
        modal_zapis_doctor_btn = $('.item-' + f_RowID + ' .button.modal-zapis-doctor-btn');
    } else {
        // если f_RowID не передается, значит эта ф-я работает в карточке врача
        table_time_wrap = $('.table-time-wrap');
        modal_zapis_doctor_btn = $('.button.modal-zapis-doctor-btn');
    }

    $.ajax({
        // Получение группированного списка доступного для записи даты/времени для одного сотрудника GET
        url: "https://web.kanzler.pro:9017/Kanzler_web_service/GetEmployeeAviableDateTimeGroupedList/" + kanzler_id + '.' + kanzler_guid + '.' + employee_id,
        dataType: "json",
        crossDomain: true,
        processData: false,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "cache-control": "no-cache",
            // "Postman-Token": "04e87f9a-772f-467f-9f6e-05892b2f8fa0"
        },
    }).done(function (response) {
        table_time_wrap.removeClass('loading');
        if (!$.trim(response)){
            // null/undefined/empty

            // table_time_wrap.append("<span class='red-color'><i class='fas fa-exclamation-circle'></i> Ошибка загрузки графика приема! <br>Попробуйте позже.</span>");

            // если у врача нет графика, то меняем кнопку "Запись на прием" на ссылку с телефоном
            if(modal_zapis_doctor_btn_phone){

                modal_zapis_doctor_btn
                    .attr('data-src', '/form_fmc/api/popap/?ext_key=3ce086d4b9ff9fe959e06c6b4cd5d1b2')
                    .removeAttr('data-employee-id')
                    .removeClass('modal-zapis-doctor-btn');

                // modal_zapis_doctor_btn.unbind()
                //     .removeAttr('data-fancybox data-type data-src data-employee-id')
                //     .attr('title', 'Позвонить' )
                //     .attr('href', 'tel:' + modal_zapis_doctor_btn_phone )
                //     .addClass('mgo-number');
                //
                // setTimeout(function () {
                //     modal_zapis_doctor_btn.text('Запись на прием');
                // }, 2000)
            }

            if(!f_RowID){
                $('.doctor-inner-title').hide();
            }
        } else {
            // console.log(response);
            let timeTableTr = [],
                timeTableTd = [],
                dateParse1 = '',
                dateParse2 = '';

            $.each( response, function( i ) {
                // Приведем дату к формату YY,MM,YY, вместо DD.MM.YY
                dateParse1 = new Date(response[i].DateComponent.replace( /(\d{2}).(\d{2}).(\d{4})/, "$3,$2,$1"));

                if(isToday(dateParse1)){

                    // В расписании сегодняшнего дня выберем только те часы, которые идут после текущего времени
                    $.each( response[i].AvailableTimeList, function( j ) {
                        // Приведем дату к формату YYYY-MM-DDThh:mm
                        dateParse2 = new Date( response[i].DateComponent.replace( /(\d{2}).(\d{2}).(\d{4})/, "$3-$2-$1") + 'T' + response[i].AvailableTimeList[j].data);

                        if(dateParse2 >= new Date()){
                            timeTableTd.push(response[i].AvailableTimeList[j].data);
                        }
                    });
                } else {
                    $.each( response[i].AvailableTimeList, function( j ) {
                        timeTableTd.push(response[i].AvailableTimeList[j].data);
                    });
                }

                if(timeTableTd.length){ // если в этот день есть часы для записи
                    timeTableTr.push("<tr>" +
                        "<th>"+
                        response[i].DateComponent +
                        "<div>"+ getWeekDay(dateParse1) + "</div>" +
                        "</th>" +
                        "<td>"+ timeTableTd.join(', ') +"</td>" +
                        "</tr>");

                    // очищаем массив с часами записи, чтоб они не попали в строку со следующим днем
                    timeTableTd.length = 0;
                }

            });

            if(timeTableTr.length > 7){
                // если строк больше 7, то выводим их в две таблицы
                table_time_wrap.append("<table class='time'>"+ timeTableTr.slice(0, 7).join('') +"</table>") // выводим 7 первых строк
                table_time_wrap.append("<div class='table-time-hidden'>" + // выводим остальные строки в скрытую таблицу
                    "<table class='time'>"+ timeTableTr.slice(7).join('') +"</table>" +
                    "</div>" +
                    "<a href='#' class='table-time-btn "+ (!f_RowID ? 'button2' : null) +"'>Показать еще...</a>");

                $('.table-time-btn').click(function (e) {
                    e.preventDefault();
                    $('.table-time-hidden').slideDown();
                    $(this).hide();
                });

            } else {
                // если строк 7 или меньше, то выводим их все в одну таблицу
                table_time_wrap.append("<table class='time'>"+ timeTableTr.join('') +"</table>")
            }

            // очищаем массив графика приема, чтоб в списке врачей они не попали к другому врачу
            timeTableTr.length = 0;
        }
    }).fail(function () {
        table_time_wrap.removeClass('loading');
        table_time_wrap.append("<span class='red-color'><i class='fas fa-exclamation-circle'></i> Ошибка загрузки графика приема! <br>Попробуйте позже.</span>");
    });
}

// Выводит название дней недели
function getWeekDay(date) {
    let days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[date.getDay()];
}

// определяет, сегодняшяя ли дата
const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
}