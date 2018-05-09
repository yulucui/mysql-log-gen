module.exports = function(conn,dbname,tablename){
    var promise = new Promise((res) => res(true));
    if(tablename.slice(-3) == 'REL' || tablename.slice(-3) == 'LOG')
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
        var insertSQL = getSQL(tablename,schema,'INSERT');
        return new Promise((resolve,reject) => {
            conn.query(insertSQL,(err,res) => {
                if(err)
                    console.error(err);
                resolve(schema);
            });
        })
    }).then(schema => {
        var updateSQL = getSQL(tablename,schema,'UPDATE');
        return new Promise((resolve,reject) => {
            conn.query(updateSQL,(err,res) => {
                if(err)
                    console.error(err);
                resolve(schema);
            });
        });
    }).then(schema => {
        var deleteSQL = getSQL(tablename,schema,'DELETE');
        return new Promise((resolve,reject) => {
            conn.query(deleteSQL,(err,res) => {
                if(err)
                    console.error(err);
                resolve(res);
            });
        });
    });
}

var getSQL = function(tablename,schema,type){
    var logname = `${tablename}_LOG`;
    var fAndV = getFieldsAndValues(tablename,schema,type);
    return `CREATE TRIGGER If Not Exists \`${tablename}_${type}\` AFTER ${type} ON \`${tablename}\` FOR EACH ROW
        INSERT INTO \`${logname}\`(${fAndV.fields.join(',')}) VALUES(${fAndV.values.join(',')});
    `
}
var getFieldsAndValues = function(tablename,fields,type){
    var fieldsAndValues = {
        fields: [],
        values: []
    }
    var now = type == 'DELETE' ? 'old' : 'new'; 
    fields.forEach(function(f) {
        if(f.COLUMN_NAME == 'ID'){
            fieldsAndValues.fields.push(`\`${tablename}_ID\``);
            fieldsAndValues.values.push(`${now}.ID`);
        }else{
            fieldsAndValues.fields.push(`\`${f.COLUMN_NAME}\``);
            fieldsAndValues.values.push(`${now}.${f.COLUMN_NAME}`);
        }
    }, this);
    fieldsAndValues.fields.push('`OPT_TIME`');
    fieldsAndValues.fields.push('`OPT_TYPE`');
    fieldsAndValues.values.push('NOW()');
    fieldsAndValues.values.push(`'${type}'`);
    return fieldsAndValues;
}