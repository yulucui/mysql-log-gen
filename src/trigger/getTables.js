module.exports = function(conn,dbname){
    let sql = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='${dbname}'`;
    return new Promise(function(resolve,reject){
        conn.query(sql,function(err,res){
            if(err)
                reject(err);
            resolve(res);
        });
    });
}