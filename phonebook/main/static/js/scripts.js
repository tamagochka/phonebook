
var onClickHeader = (event) => {
    var accordion_item = $(event.target).parent().parent();
    var id = accordion_item.prop('id');
    var body = accordion_item.find('.accordion-body')
    if(!body.hasClass('.loaded')) {
        var data = getData('get', id); // запрос данных из справочника
        buildAccordion('#' + body.prop('id'), data);
        body.addClass('.loaded');
    }
}


buildAccordionBranch = (place_id, header_text, id) => {
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
        })
    );
    accordion_item.append(accordion_body);
    accordion_item.appendTo(place_id);
}


buildAccordionLeaf = (place_id, item_data, id) => {
    var accordion_item = $('<div>', {
        class: 'accordion-item',
        id: id
    });
    var accordion_header = $('<h4>', {
        class: 'accordion-header',
    });
    accordion_header.append(
        $('<div>', {
            class: 'accordion-button collapsed',
            style: '--bs-accordion-btn-icon: none'
        }).append(
            '<table cellpadding="10px" width="100%" align="left">' +
                '<tr style="border: none">' +
                    '<td align="left" valign="center" width="15%" style="border-right: solid 1px #DEE2E6">' +
                        item_data.post +
                    '</td>' +
                    '<td align="left" valign="center" width="15%" style="border-right: solid 1px #DEE2E6">' +
                        item_data.surname + '<br>' + item_data.name + ' ' + item_data.patronymic +
                    '</td>' +
                    '<td align="center" valign="center" width="10%" style="border-right: solid 1px #DEE2E6">' +
                        item_data.rank +
                    '</td>' +
                    '<td align="center" valign="center" width="10%" style="border-right: solid 1px #DEE2E6">' +
                        item_data.extension_number +
                    '</td>' +
                    '<td align="center" valign="center" width="10%">' +
                        item_data.landline_number +
                    '</td>' +
                '</tr>' +
            '</table>'
        )
    );
    accordion_item.append(accordion_header);
    accordion_item.appendTo(place_id);
}


buildAccordion = (place_id, data) => {

    for(var i = 0; i < data.abonents.length; i++) {
        buildAccordionLeaf(place_id, data.abonents[i], data.abonents[i].id);
    }

    for(var i = 0; i < data.departments.length; i++) {
        buildAccordionBranch(place_id, data.departments[i].title, data.departments[i].id);
    }

}


// request_type:
// 'get' - запрос конкретного отдела в качестве запроса указывается id отдела
// 'search' - поиск по введенному значению в качестве запроса указывается введенное значение
getData = (request_type, request) => {
    var result = null;
    var dict = {};
    dict[request_type] = request;
    $.ajax({
        type: 'POST',
        url: 'get_data/',
        async: false,
        data: dict,
        success: (response) => {
            result = JSON.parse(response.response);
        },
        error: (response) => {
            result = response.responseJSON.errors;
        }
    });
    return result;
}


$(document).ready(() => { // при загрузке страницы
    var data = getData('get', '0'); // запрос корня справочника
    buildAccordion('#phonebook_list', data);
});

