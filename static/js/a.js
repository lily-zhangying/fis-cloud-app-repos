
$(document).ready(function(){
    $('#syncBtn').click(function(event){
        var url = '/repos/sync?lastSyncTime=null&currentSyncTime=' + Date.parse(new Date()),
            options = {
                type: "GET",
                url: url,
//                data: {
//                    name : nameval,
//                    auth : auth
//                },
                async: false,
                error: function(request){
//                    hint(request.responseText);
                    console.log(error);
                },
                success: function(data){
//                    hint(data.msg + "\r\n redirect to your page now");
//                    setTimeout(function(){
//                        location.href = data.url;
//                    }, 2000);
                    console.log(CharacterData);
                }
            };
console.log(new Date());
        console.log(url);
//        $.ajax(options);
        event.preventDefault();

    });
});
