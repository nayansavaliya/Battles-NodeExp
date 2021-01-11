
const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "localhost",
    user: "rootnode",
    password: "root",
    database: "battles",
  });


function authUser(username,password) {

    return new Promise((resolve, reject)=>{
        conn.query("SELECT * FROM users", function (err, result) {
            if (err) reject(err);
            let user = result[0].username;
            let pass = result[0].password;
            user === username && pass === password?resolve("true"):resolve("false");
            
        })

    })

}

function readBattle (battleName) {

    return new Promise((resolve, reject)=>{
        conn.query(`SELECT name FROM battLes_data WHERE name = '${battleName}'`, function (err, result) {
            if (err) reject(err);
            let data = result.map((item) => item.name);
            resolve(data);
            
        })

    })

}

function createBattle(battleName) {

    return new Promise((resolve, reject)=>{
        conn.query(`SELECT name FROM battLes_data WHERE name = '${battleName}'`, function (err, result) {
            if (err) reject(err);
            if (result.length === 0){
                conn.query(`INSERT INTO battLes_data (name) VALUES ('${battleName}')`, function (err, result) {
                    if (err) reject(err);
                    conn.query(`SELECT name FROM battLes_data WHERE name = '${battleName}'`, function (err, result) {
                        if (err) reject(err);
                        battleName === result[0].name? resolve("Battle Inserted Successfully"):resolve("Please try again");
                        
                    })
                })
            }
            else{
                resolve("Battle already exist");
                
            } 
        })

    })

}

function deleteBattle(battleName) {

    return new Promise((resolve, reject)=>{
        conn.query(`SELECT name FROM battLes_data WHERE name = '${battleName}'`, function (err, result) {
            if (err) reject(err);
            if (result.length===0){
                resolve("Battle not found");
             
            }
            else if (result[0].name === battleName){
                conn.query(`DELETE FROM battLes_data WHERE name = '${battleName}'`, function (err, result) {
                    if (err) reject(err);
                    conn.query(`SELECT name FROM battLes_data WHERE name = '${battleName}'`, function (err, result) {
                        if (err) reject(err);
                        result.length === 0? resolve("Deleted Successfully"):resolve("Please try again");
                        
                    })
                })
            }
            else {
                resolve("Battle not found");
                
            }
        })

    })

}

function updateBattle(battleName, newBattleName) {

    return new Promise((resolve, reject)=>{
        conn.query(`SELECT name FROM battLes_data WHERE name = '${battleName}'`, function (err, result) {
            if (err) reject(err);
            if (result.length===0){
                resolve("Battle not found");
                
            }
            else if (result[0].name === battleName){
                conn.query(`UPDATE battles_data SET name = '${newBattleName}' WHERE name = '${battleName}'`, function (err, result) {
                    if (err) reject(err);
                    conn.query(`SELECT name FROM battLes_data WHERE name = '${newBattleName}'`, function (err, result) {
                        if (err) reject(err);
                        newBattleName === result[0].name? resolve("Updated Successfully"):resolve("Please try again");
                        
                    })
                })
            }
            else{
             resolve("Battle not found");
             
            }
        })

    })

}

function api(){

    deleteBattle("Nayan").then(e => console.log(e))

}

function getList () {

    return new Promise((resolve, reject)=>{
        conn.query("SELECT DISTINCT region FROM battles_data", function (err, result) {
            if (err) reject(err);
            var data = result.map((item) => item.region);
            resolve(data);
            
        })
        
    }) 
}

function searchBattle(king,location=null,type=null) {

    let query = `SELECT name FROM battLes_data WHERE (attacker_king = '${king}' OR defender_king = '${king}')`;

    location !== null ? query += ` AND location = '${location}'` : null;

    type !== null ?  query += ` AND battle_type = '${type}'` : null;

    console.log(query)

    return new Promise((resolve, reject)=>{
        conn.query(query, function (err, result) {
            if (err) reject(err);
            let data = result.map((item) => item.name);
            resolve(data);
            
        })
        
    }) 
}


module.exports.list = getList;
module.exports.searchBattle = searchBattle;

module.exports.authUser = authUser;
module.exports.createBattle = createBattle;
module.exports.readBattle = readBattle;
module.exports.updateBattle = updateBattle;
module.exports.deleteBattle = deleteBattle;




