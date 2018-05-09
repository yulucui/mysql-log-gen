var mysql = require('mysql');
var mysql_conf = require('../../mysql_conf');
var tablesGetter = require('./getTables');

module.exports = function(){
    var conn = mysql.createConnection(mysql_conf);
    conn.connect();
    tablesGetter(conn,mysql_conf.database)
        .then(tables => {
            tables.forEach(function(t) {
                var opts = ['INSERT','UPDATE','DELETE'];
                var tname = t.TABLE_NAME;
                if(tname.slice(-3) == 'REL') return ;
                if(tname.slice(-3) == 'LOG'){
                    var sql = `DROP TABLE IF EXISTS \`${tname}\`;`;
                    conn.query(sql,(err,res) => {
                        if(err)
                            console.error(err);
                        console.log(`${tname} 删除成功`);
                    });
                }else{
                    opts.forEach(opt => {
                        var optSQL = `DROP TRIGGER IF EXISTS ${tname}_${opt}`;
                        conn.query(optSQL,(err,res) => {
                            if(err)
                                console.error(err);
                            console.log(`${tname}_${opt}触发器 删除成功`);
                        });
                    });
                }
            }, this);
        });
}

