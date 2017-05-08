$('.delete').on('click', function(e) {
    e.preventDefault();
    var url = $(this).attr('user');

    $.ajax({
        method: 'DELETE',
        url: url
    }).done(function() {

        url.remove();

        window.location = '/';
    });
});
