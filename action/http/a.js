var render_helper = require("../../lib/render.js"),
    setting = require("../../lib/set.js");

module.exports = function(req, res, app){
    render_helper.setRender(app);
    //读取json内容，渲染到页面
    //读取json内容作为key，value在数据库中
    var appName = app.get("appName");
//    setting.findOne({_name:appName}, function(err, result){
//        if(err){
//            res.send(500, "Read setting failed, please try later");
//        }else if(!result){
//            //数据库中没有setting信息，从setting.json中读取
//        }else{
//            //显示数据库中的信息
//        }
//    });
    var json = fis.util.readJSON(APP_ROOT + '/setting.json');
    //merge json 和数据库数据，显示到页面
    res.render("setting", {
        appName : appName
    });
};
