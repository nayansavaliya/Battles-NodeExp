const express = require('express');

const jwt = require('jsonwebtoken');

const cors = require('cors')

const sql = require('./sqlConn');

const app = express();

app.use(express.json());

app.use(cors())


app.get('/list', (req, res) => {

    sql.list().then(data =>res.json(data) );   
});

app.get('/search', (req, res) => {
    if(!req.query.king){
        res.sendStatus(400);
    }
    sql.searchBattle(req.query.king,req.query.location,req.query.type).then(data =>{console.log(data) ;res.json(data)} );   
});


function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== "undefined"){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else{
        res.sendStatus(403);
    }
}


app.post('/login', (req, res) => {
    if(!req.body.username || !req.body.password){
        res.sendStatus(400);
    }
    else{
        sql.authUser(req.body.username,req.body.password).then(
            (result)=>{
                if (result === 'true'){
                    jwt.sign(req.body,'secretKey',{expiresIn:'1h'},
                    (err, token)=>{
                        
                        res.json({"token":token})
                    });   
                }
                else{
                    res.json({"status":"Invalid Credentials"})
                }

            }
        )
    }
    
});



app.post('/battleApi', verifyToken, (req, res) => {
    jwt.verify(req.token,'secretKey',(err, data)=>{
        console.log(data,err);
        if(err){
            
            res.json({err})
           
        }
        else{
            if(!req.body.battleName ){
                res.sendStatus(400);
            }
            else{
                sql.createBattle(req.body.battleName).then(
                    (result)=>{
                            res.json({result,data})
                        
                    }
                )
            }
        }
    })
    
    
});

app.get('/battleApi', (req, res) => {
    if(!req.body.battleName ){
        res.sendStatus(400);
    }
    else{
        sql.readBattle(req.body.battleName).then(
            (result)=>{
                    res.json({result})
                

            }
        )
    }
    
});

app.delete('/battleApi', (req, res) => {
    if(!req.body.battleName ){
        res.sendStatus(400);
    }
    else{
        sql.deleteBattle(req.body.battleName).then(
            (result)=>{
                    res.json({result})
                

            }
        )
    }
    
});

app.put('/battleApi', (req, res) => {
    if(!req.body.battleName ||!req.body.newBattleName ){
        res.sendStatus(400);
    }
    else{
        sql.updateBattle(req.body.battleName,req.body.newBattleName).then(
            (result)=>{
                    res.json({result})
                

            }
        )
    }
    
});





app.listen(3000, () => console.log("Listening port 3000…"));