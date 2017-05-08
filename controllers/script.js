$('.delete').on('click', function(e) {
    e.preventDefault();
    var url = $(this).attr('href');

    $.ajax({
        method: 'DELETE',
        url: url
    }).done(function() {

        url.remove();

        window.location = '/';
    });
});
