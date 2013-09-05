var exports = module.exports = {};
var fis = require('fis-cloud-kernel');


exports.search = function(req, res, app){
    var db = fis.db.getConnection();


//test data
//    var pkg1 = {
//        _id: 'fis-cloud-app-ppt',
//        name: 'fis-cloud-app-ppt',
//        version: '0.0.3',
//        description: 'fis-cloud-app-ppt',
//        main: 'fis-cloud-app-ppt.js',
//        dependencies: { ejs: '*', marked: '0.2.9' },
//        devDependencies: {},
//        author: 'wangcheng-test',
//        license: 'BSD',
//        latest: '0.0.2',
//        time : '2013-08-04 13:30:46',
//        _attachments:{
//            name : 'fis-cloud-app-ppt-0__0__3__zip',
//            'content-type': 'application/zip',
//            length: 24
//        },
//        "repository": {
//            "type": "git",
//            "url": "https://github.com/xiangshouding/fis-pc.git"
//        },
//        "versionHistory" : [
//            "0.0.0",
//            "0.0.1"
//        ],
//        "versions": {
//            "0__0__1": {
//                "name": "fis-cloud-kernel",
//                "version": "0.1.1",
//                "description": "Front End Integrated Solution for PC",
//                "main": "fis-pc.js",
//                "readme": "ERROR: No README data found!",
//                "repository": {
//                    "type": "git",
//                    "url": "https://github.com/xiangshouding/fis-pc.git"
//                },
//                "keywords": [
//                    "fis",
//                    "fis-pc"
//                ],
//                "maintainers": [
//                    {
//                        name : "lily-zhangying",
//                        email : "zhangying3210@gmail.com"
//                    }
//                ],
//                _attachments:{
//                    name : 'fis-cloud-app-ppt-0__0__1__zip',
//                    'content-type': 'application/zip',
//                    length: 24
//                }
//            }
//        }
//    };
//    var pkg2 = {
//        _id: 'gis-cloud-app-ppt',
//        name: 'gis-cloud-app-ppt',
//        version: '0.0.3',
//        description: 'fis-cloud-app-ppt',
//        main: 'fis-cloud-app-ppt.js',
//        dependencies: { ejs: '*', marked: '0.2.9' },
//        devDependencies: {},
//        author: 'wangcheng-test',
//        license: 'BSD',
//        latest: '0.0.2',
//        time : '2013-08-04 13:30:46',
//        _attachments:{
//            name : 'fis-cloud-app-ppt-0__0__3__zip',
//            'content-type': 'application/zip',
//            length: 24
//        },
//        "repository": {
//            "type": "git",
//            "url": "https://github.com/xiangshouding/fis-pc.git"
//        },
//        "versionHistory" : [
//            "0.0.0",
//            "0.0.1"
//        ],
//        "versions": {
//            "0__0__1": {
//                "name": "fis-cloud-kernel",
//                "version": "0.1.1",
//                "description": "Front End Integrated Solution for PC",
//                "main": "fis-pc.js",
//                "readme": "ERROR: No README data found!",
//                "repository": {
//                    "type": "git",
//                    "url": "https://github.com/xiangshouding/fis-pc.git"
//                },
//                "keywords": [
//                    "fis",
//                    "fis-pc"
//                ],
//                "maintainers": [
//                    {
//                        name : "lily-zhangying",
//                        email : "zhangying3210@gmail.com"
//                    }
//                ],
//                _attachments:{
//                    name : 'fis-cloud-app-ppt-0__0__1__zip',
//                    'content-type': 'application/zip',
//                    length: 24
//                }
//            }
//        }
//    };
//    var pkg3 = {
//        _id: 'no',
//        name: 'no',
//        version: '0.0.3',
//        description: 'no'
//    };


//    fis.db.insert(fis.db.COLLECTION_LIST.pkg, {}, [pkg1,pkg2,pkg3], {}, function(err, result){
//        if(err){
//            console.log(1);
//            console.log(err);
//        }else{
//            console.log(2);
//        }});

//建立索引
//db.collection(fis.db.COLLECTION_LIST.pkg).ensureIndex({name:1, description:1, author:1, keywords:1, maintainers:1});

    var query = {},
        queryObj = {};
    if(req.query.q){
        query = req.query.q;
        var reg = new RegExp(query, 'g');
        queryObj = {
            $or: [
                {name: reg},
                {description: reg},
                {author:reg},
                {keywords:reg},
                {"repository.url": reg}
            ]
        };
    }

    var options = {
        name:true,
        description:true,
        keywords: true,
        author:true,
        maintainers:true
    };

    fis.db.find(fis.db.COLLECTION_LIST.pkg, 'root', queryObj, options, {}, function(err, result){
        if(err){
            res.json(500, {error : err});
        }else{
            if(result === null){
                res.json(500, {error : 'no pkg found'});
            }else{
                //查询maintainers，返回数组，merge后返回
                result.toArray(function(err, r){
                    if(err){
                        res.json(500, {error : err});
                    }else{
                        res.json(200, r);
                    }
                });
            }
        }
    });
};