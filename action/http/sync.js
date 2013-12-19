//处理同步数据库的功能
var Component = require("../lib/component.js");

module.exports = function(req, res, app){
    var lastSyncTime = req.query.lastSyncTime;
    var currentSyncTime = req.query.currentSyncTime;
    //获取两次时间中，更新的pkgs
    var query = {
        "updateStamp" : {"$gte": lastSyncTime, "$lte": currentSyncTime}
    };
    Component.getComponentByQuery(query, {_id:true, maintainers:true}, {}, function(err, cursor){
        if(err){
            res.send(500, 'sorry, Synchronize database failed, please try later');
        }else if(!cursor){
            res.send(200, null);
        }else{
            cursor.toArray(function(error, components){
                if(error){
                    res.send(500, 'sorry, Synchronize database failed, please try later');
                }else{
                    res.send(200, components);
                }
            });
        }
    });

};