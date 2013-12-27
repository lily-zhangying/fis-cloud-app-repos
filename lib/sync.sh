#!/user/bin/env bash
#mkdir
echo $DUMPPATH

mongodump --host fedev.baidu.com:8887 --db test --out $DUMPPATH -vvv

#rm -rf user,keyword
#user.metadata.json  user.bson  pkgKeyword.bson  pkgKeyword.metadata.json

rm -rf user.*,pkgKeyword.*
mongorestore --port 8887 --db test -vvv $DUMPPATH
