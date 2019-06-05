$(document).ready(function(){
    $('.delete-grade').on('click', function(e){
        $target = $(e.target);   
        const id = $target.attr('data-id')
        $.ajax({
            type:'DELETE',
            url: '/teacher/grade/'+id,
            success: function(response){
                alert("Grade deleted");
                window.location.href='/teacher';
            },
            error: function(){
                console.log(err);
            }
        })
    });
});