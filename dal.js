const cfg = require('./config.json');
const sql = require('mssql')
var currentTran;

module.exports = {
    source: sql, connect: connect, beginTran, commitTran, rollback
}

async function connect() {
    await sql.connect(`Server=${cfg.database.host},1433;Database=${cfg.database.dbName};User Id=${cfg.database.username};Password=${cfg.database.password};Encrypt=false`)
}

function beginTran() {
    return currentTran = new sql.Transaction(sql);
}

async function commitTran() {
    if (currentTran != null) await currentTran.commit();
}

async function rollback() {
    if (currentTran != null) await currentTran.rollback();
}
