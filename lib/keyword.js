var db_component = fis.db.COLLECTION_LIST.pkg,
    db_pkgKeyword = fis.db.COLLECTION_LIST.pkgKeyword,
    async = require('async'),
    moment = require('moment'),
    ROOT_USER = "root",
    Q = require('q');

//更新keywords列表，把新的包的keywords加入表中
module.exports.update = function(pkgname, keywords, username){
    var defer = Q.defer();
    var keywords = ['all'].concat(keywords);
    var addToSet = {$addToSet : {"pkgs" : pkgname}};
    var query = {"_id" : {$in : keywords}};
    fis.db.update(db_pkgKeyword, username, query, addToSet, {multi:true}, function(err, result){
        if(err){
            defer.reject(err);
        }else{
            defer.resolve(result);
        }
    });
    return defer.promise;
};

////删掉多个关键字
//module.exports.removeEmptyKey = function(config, username, option){
//    var defer = Q.defer();
//    var keywords = ['all'].concat(config.keywords);
//    var pullAll = keywords.push(null);
//    var query = {$pullAll:{"pkgs": pullAll}};
//    // //collection, userid, query, update, options, callback
//    fis.db.update(db_pkgKeyword, username, {}, query, {multi:true}, function(err, result){
//        if(err){
//            defer.reject(err);
//        }else{
//            defer.resolve(result);
//        }
//    });
//    return defer.promise;
//};

//删掉所有包裹。删掉keywords表中所有的pkgname，即所有的关键字中都不包含pkgname这个包
module.exports.removePkg = function(pkgname, username){
    var deferred = Q.defer();
    var query = {"pkgs" : {$in : [pkgname]}};
    //collection, userid, query, fields, options,
    //collection, userid, query, update, options, callback
    fis.db.update(db_pkgKeyword, username, query, {$pullAll:{"pkgs": [pkgname, null]}}, {multi:true}, function(err, result){
        if(err){
            deferred.rejected("remove all keyword failed");
        }else{
            deferred.resolve(result);
        }
    });
    return defer.promise;
};


function _UpdatePkgKeyword(keyword, pkgname, username){
    var deferred = Q.defer();
    fis.db.findOne(db_pkgKeyword, username, {_id: keyword}, function(err, result){
        if(err){
            deferred.rejected("find keyword failed");
        }else if(result == null){
            //新增keyword
            var doc = {
                _id : keyword,
                pkgs: [pkgname],
                permission : {mode : 777}
            };
            //collection, userid, docs, options, callback
            fis.db.insert(db_pkgKeyword, username, doc, {}, function(err, result){
                if(err){
                    deferred.reject('insert keyword failed');
                }else{
                    deferred.resolve(result);
                }
            });
        }else{
            //更新已经有的keyword表
            //todo --force更新的时候，删除的key还会留在表中，应该删除后，再重新添加
            if(!fis.util.in_array(pkgname, result.pkgs, false)){
                result.pkgs.push(pkgname);
                delete result._id;
                //collection, userid, query, update, options, callback
                fis.db.update(db_pkgKeyword, username, {_id: keyword}, result, {}, function(err, result){
                    if(err){
                        deferred.reject('update keyword failed');
                    }else{
                        deferred.resolve(result);
                    }
                });
            }else{
                deferred.resolve(result);
            }
        }
    });
    return deferred.promise;
};

function _RemovePkgKeyword(keyword, pkgname, username){
    var deferred = Q.defer();
    fis.db.findOne(db_pkgKeyword, username, {_id: keyword}, function(err, result){
        if(err){
            deferred.rejected("find keyword failed");
        }else if(result !== null){
            //更新已经有的keyword表,删掉这个包
            var doc = result;
            if(fis.util.in_array(pkgname, doc.pkgs, false)){
                for(var i=0;i<doc.pkgs.length;i++){
                    if(doc.pkgs[i] == pkgname){
                        doc.pkgs.splice(i, 1);
                    }
                }
                if(doc.pkgs.length == 0){
                    //keyword已经没有pkg，直接删除这个关键字
                    //collection, userid, query, options, callback
                    fis.db.remove(db_pkgKeyword, username, {_id: keyword}, {}, function(err, result){
                        if(err){
                            deferred.reject('remove keyword failed');
                        }else{
                            deferred.resolve(result);
                        }
                    });
                }else{
                    delete doc._id;
                    //collection, userid, query, update, options, callback
                    fis.db.update(db_pkgKeyword, username, {_id: keyword}, doc, {}, function(err, result){
                        if(err){
                            deferred.reject('update keyword failed');
                        }else{
                            deferred.resolve(result);
                        }
                    });
                }
            }else{
                deferred.resolve(result);
            }
        }else{
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};

var DEFAULT_KEYWORD = [
    "framework", "css", "test", "widget",
    "smartyplugin", "assets", "kernal", "monitor",
    "scaffold", "html5", "utils", "all"
];

//获取默认的类型列表数目
module.exports.getCategories = function(callback){
    var categories = [];
    DEFAULT_KEYWORD.forEach(function(item){
        categories[item] = {name : item, number : 0};
    });
    fis.db.find(db_pkgKeyword, ROOT_USER, {_id: {$in:DEFAULT_KEYWORD}}, {}, {}, function(err, cursor){
        if(err){
            callback(err);
        }else{
            cursor.toArray(function(error, result){
                if(error){
                    callback(error);
                }else{
                    var cate = [];
                    result.forEach(function(item){
                        fis.util.map(categories, function(k, v){
                            if(item._id == k){
                                categories[k] = {name:item._id, number:item.pkgs.length};
                            }
                        });
                    });
                    var newcate = [];
                    fis.util.map(categories, function(k, v){
                        newcate.push(v);
                    });
                    callback(null, newcate.sort(sortNumber));
                }
            });
        }
    });
};
//获取数量最多的10个keyword
module.exports.getHotTags = function(callback){
    fis.db.find(db_pkgKeyword, ROOT_USER, {}, {}, {}, function(err, cursor){
        if(err){
            callback(err);
        }else{
            cursor.toArray(function(error, result){
                if(error){
                    callback(error);
                }else{
                    var categories = [];
                    result.forEach(function(item){
                        if(item._id !== 'all'){
                            categories.push({
                                name : item._id,
                                number : item.pkgs.length
                            });  
                        }
                    });
                    callback(null, categories.sort(sortNumber).slice(0, 10));
                }
            });
        }
    });
};


function sortNumber(a ,b){
    if(a.name == 'all'){
        return -1;
    }else if(b.name == 'all'){
        return 1;
    }else{
        return b.number - a.number;
    }
};