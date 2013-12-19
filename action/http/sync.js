//处理同步数据库的功能

module.exports = function(req, res, app){
    var lastUpdateTime = req.query.lastTime;
    var currentUpdateTime = req.query.currentTime;
    //获取两次时间中，更新的pkgs
    //返回更新的插件的id列表
    var option = {};

};