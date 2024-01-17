
onClickHeader = (event) => {
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
        class: 'accordion-item branch',
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
        class: 'accordion-item leaf',
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


toggle_searching_paths = (data, toggle) => {
    var accordion_item = null;
    $('.accordion-item').hide();
//    console.log(data.path);
    var max = Math.max(...data.path.map(i => i.length))
    for(var i = 0; i < max; i++) {
        for(var j = 0; j < data.path.length; j++) {
            if(i > data.path[j].length - 2) continue;
            accordion_item = $('#' + data.path[j][i] + '.accordion-item');
            if(accordion_item.css('display') == 'none') {
                var id = accordion_item.prop('id');
                var body = accordion_item.find('.accordion-body')
                if(!body.hasClass('.loaded')) {
                    var add_data = getData('get', id); // запрос данных из справочника
                    buildAccordion('#' + body.prop('id'), add_data);
                    body.addClass('.loaded');
                }
                accordion_item.children('.accordion-collapse').addClass('show');
                accordion_item.children().children('button').removeClass('collapsed');
                accordion_item.children().children('button').attr('aria-expanded', 'true');
                accordion_item.find('.accordion-item').hide();
                accordion_item.show();
            }
        }
    }
}


bypass_tree = (tree) => {
    for(item in tree) {
        if(!(Object.keys(tree[item]).length === 0)) {
//            console.log('node: ' + item);
            accordion_item = $('#' + item + '.accordion-item.branch');
            if(accordion_item.css('display') == 'none') {
                body = accordion_item.find('.accordion-body');
                if(!body.hasClass('.loaded')) {
                    add_data = getData('get', item); // запрос данных из справочника
                    buildAccordion('#' + body.prop('id'), add_data);
                    body.addClass('.loaded');
                }
                accordion_item.children('.accordion-collapse').addClass('show');
                accordion_item.children().children('button').removeClass('collapsed');
                accordion_item.children().children('button').attr('aria-expanded', 'true');
                accordion_item.show();
                accordion_item.find('.accordion-item').hide();
            }
            bypass_tree(tree[item]);
        } else {
//            console.log('leaf: ' + item);
            accordion_item = $('#' + item + '.accordion-item.leaf');
            accordion_item.show();
        }
    }
}

var old_search_str = '';

onKeyUpSearch = (event) => {
    search_str = $(event.target).val();
//    console.log(event.keyCode);
    if(event.keyCode == 27) {
        $('#phonebook_search').val('');
        search_str = '';
        old_search_str = '';
        accordion_item = $('.accordion-item');
        accordion_item.children('.accordion-collapse').removeClass('show');
        accordion_item.children().children('button').addClass('collapsed');
        accordion_item.children().children('button').attr('aria-expanded', 'false');
        accordion_item.show();
    } else {
        if((search_str.length >= 3) && (search_str != old_search_str)) {
            data = getData('search', search_str);
            $('.accordion-item').hide();
            bypass_tree(data.path);
        } else if((old_search_str.length >= 3) && (search_str != old_search_str)) {
            accordion_item = $('.accordion-item');
            accordion_item.children('.accordion-collapse').removeClass('show');
            accordion_item.children().children('button').addClass('collapsed');
            accordion_item.children().children('button').attr('aria-expanded', 'false');
            accordion_item.show();
        }
        old_search_str = search_str;
    }
}


$(document).ready(() => { // при загрузке страницы
    var data = getData('get', '0'); // запрос корня справочника
    $('#phonebook_search').focus();
    buildAccordion('#phonebook_list', data);
    $('#phonebook_search').keyup(onKeyUpSearch);
});

