function buildAccordion(place_id, data) {


    for(var i = 0; i < data; i++) {
        var div_accordion_item = $('<div>', {
            class: 'accordion-item'
        });
        var h4_accordion_header = $('<h4>', {
            class: 'accordion-header',
            id: 'heading-' + i
        });
        var button_accordion_button = $('<button>', {
            text: 'button ' + i,
            type: 'button',
            class: 'accordion-button collapsed',
            'data-bs-toggle': 'collapse',
            'data-bs-target': '#collapse-' + i,
            'aria-expanded': 'false',
            'aria-controls': 'collapse-' + i
        });
        var div_accordion_collapse = $('<div>', {
            id: 'collapse-' + i,
            class: 'accordion-collapse collapse',
            'aria-labelledby': 'heading-' + i,
        });
        var div_accordion_body = $('<div>', {
            id: 'accordion-body-' + i,
            class: 'accordion-body',
            text: 'some little text'
        });


        h4_accordion_header.append(button_accordion_button);
        div_accordion_item.append(h4_accordion_header);
        div_accordion_collapse.append(div_accordion_body);
        div_accordion_item.append(div_accordion_collapse);

        div_accordion_item.appendTo(place_id);

    }


}

// request_type:
// 'get' - запрос конкретного отдела в качестве запроса указывается id отдела
// 'search' - поиск по введенному значению в качестве запроса указывается введенное значение
function getData(request_type, request) {
    var result = null;
    var dict = {};
    dict[request_type] = request;
    $.ajax({
        type: 'POST',
        url: 'get_data/',
        async: false,
        data: dict,
        success: function(response) {
            result = JSON.parse(response.response);
        },
        error: function(response) {
            result = response.responseJSON.errors;
        }
    });
    return result;
}

$(document).ready(function() { // при загрузке страницы

    data = getData('get', '3'); // запрос корня справочника
//    alert(data.departments[0].title);



    buildAccordion('#phonebook_list', 10);

});

