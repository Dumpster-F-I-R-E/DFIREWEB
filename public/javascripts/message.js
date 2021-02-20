/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */


function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


function showMessage(title, msg, type) {
    $('.modal-title').text(title);
    $('.modal-body').html(msg);
    $('.modal').modal('toggle');
    if (type == 'Error') {
        $('.modal-body').css('color', 'red');
    } else {
        $('.modal-body').css('color', 'black');
    }
}

$(document).ready(function(){
    let msg = getUrlParameter('error');
    if(msg)
        showMessage('Error', msg);
});