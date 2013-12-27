var render_helper = require("../../lib/render.js");

module.exports = function(req, res, app){
    render_helper.setRender(app);
    //读取json内容，渲染到页面
    //读取json内容作为key，value在数据库中


    res.render("setting", {
        appName : app.get("appName")
    });
};
