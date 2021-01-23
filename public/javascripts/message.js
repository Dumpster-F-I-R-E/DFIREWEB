function showMessage(title, msg, type) {
    $('.modal-title').text(title);
    $('.modal-body').text(msg);
    $('.modal').modal('toggle');
    if (type == 'Error') {
        $('.modal-body').css('color', 'red');
    } else {
        $('.modal-body').css('color', 'black');
    }
}
