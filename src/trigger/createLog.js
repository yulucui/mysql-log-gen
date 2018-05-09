module.exports = function(conn,dbname,tablename){
    var promise = new Promise((res) => res(true));
    if(tablename.slice(-3) == 'REL')
        return promise.then(() => false);
    
    return promise.then(() => {
        return new Promise((resolve,reject) => {
            conn.query(`select * from information_schema.COLUMNS where table_name = '${tablename}' and table_schema = '${dbname}'`,(err,res) => {
                if(err)
                    console.error(err);
                resolve(res);
            });
        });
    }).then((schema) => {
        var sql = getSQL(tablename,schema);
        return new Promise((resolve,reject) => {
            conn.query(sql,(err,res) => {
                if(err)
                    console.error(err);
                resolve(res);
            });
        });
    });
}

var getSQL = function(tablename,schema){
    var logname = `${tablename}_LOG`;
    var fieldsSQL = [];
    schema.forEach(function(f) {
        fieldsSQL.push(getFieldSQL(tablename,f));
    });
    fieldsSQL.push('`OPT_TIME` datetime');
    fieldsSQL.push("`OPT_TYPE` varchar(20) COMMENT '操作类型'");
    fieldsSQL.unshift('`ID` int(11) NOT NULL AUTO_INCREMENT');
    fieldsSQL.push('PRIMARY KEY (`ID`)');
    return `CREATE TABLE If Not Exists \`${logname}\`
        (${fieldsSQL.join(',')}) ENGINE=InnoDB DEFAULT CHARSET=utf8;`
}
var getFieldSQL = function(tablename,f){
    var id = f.COLUMN_NAME == 'ID' ? `${tablename}_ID` : f.COLUMN_NAME;
    return `\`${id}\` ${f.COLUMN_TYPE}`
}