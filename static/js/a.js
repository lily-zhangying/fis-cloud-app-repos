
$(document).ready(function(){
    $('#syncBtn').click(function(event){
        var url = '/repos/sync?repos=localhost:3459&lastSyncTime=null&currentSyncTime=' + Date.parse(new Date()),
            options = {
                type: "GET",
                url: url,
                async: false,
                error: function(request){
//                    hint(request.responseText);
                    console.log("err" + request);
                },
                success: function(data){
//                    hint(data.msg + "\r\n redirect to your page now");
//                    setTimeout(function(){
//                        location.href = data.url;
//                    }, 2000);
                    console.log("succ" + data);
                }
            };
console.log(new Date());
        console.log(url);
        $.ajax(options);
        event.preventDefault();

    });
});
