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

function getData() {

    $.ajax({
        type: 'POST',
        url: 'get_data/',
        data: {
            'req': 'req_content',
        },
        success: function(response) {
            alert(response.answer);
        },

        error: function(response) {
            alert(response.responseJSON.errors);
        }


    });
}






$(document).ready(function() {


    getData();

    buildAccordion('#phonebook_list', 10);

});

