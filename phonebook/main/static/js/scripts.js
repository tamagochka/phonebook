var onClickHeader = (event) => {
    alert($(event.target).parent().parent().prop('id'));
    // подгружаем из базы эл-ты у которых dapartment и parent_id == id
    // и рисуем новый вложенный баян





}


function buildAccordionItem(place_id, header_text, id) {

    var accordion_item = $('<div>', {
        class: 'accordion-item',
        id: id
    });
    var accordion_header = $('<h4>', {
        class: 'accordion-header',
        id: 'heading-' + id
    });
    accordion_header.append(
        $('<button>', {
            text: header_text,
            type: 'button',
            class: 'accordion-button collapsed',
            'data-bs-toggle': 'collapse',
            'data-bs-target': '#collapse-' + id,
            'aria-expanded': 'false',
            'aria-controls': 'collapse-' + id
        }).on({
            click: onClickHeader
        })
    );
    accordion_item.append(accordion_header);
    var accordion_body = $('<div>', {
        id: 'collapse-' + id,
        class: 'accordion-collapse collapse',
        'aria-labelledby': 'heading-' + id
    });
    accordion_body.append(
        $('<div>', {
            id: 'accordion-body-' + id,
            class: 'accordion-body',
            text: 'stub'
        })
    );
    accordion_item.append(accordion_body);
    accordion_item.appendTo(place_id);

}


function buildAccordion(place_id, data) {

//    for(var i = 0; i < data.abonents.length; i++) {
//        buildAccordionItem(place_id, 'some_text', i);
//    }
    for(var i = 0; i < data.departments.length; i++) {
        buildAccordionItem(place_id, data.departments[i].title, data.departments[i].id);
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

    var data = getData('get', '3'); // запрос корня справочника

    buildAccordion('#phonebook_list', data);

});

