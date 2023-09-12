const mysql = require('mysql');
const dotenv = require('dotenv');


function getConfig() {
    return dotenv.config({path: __approot + '/.env'});
}

function getDb() {
    let config = getConfig();
    return mysql.createConnection({
        host: config.parsed.DB_HOST,
        user: config.parsed.DB_USER,
        database: config.parsed.DB_NAME,
        password: config.parsed.DB_PASS
    });
}


function matchesId(id){
    return id.matches("[0-9]+");
}


exports.getApirie = (req, res) => {
    let db = getDb();
    let user_id = req.body.user_id;
    let query = "SELECT A.name, A.photo_url, H.name, N.frame_amount, S.frame_amount, CH.character, H.queen_age \
                    FROM Apiries as A \
                    JOIN Hives as H \
                    ON H.apiary_id = A.id \
                    JOIN Characters as CH \
                    ON CH.id = H.character_id \
                    JOIN HiveNests as N \
                    ON H.id = N.hive_id \
                    JOIN HiveStores as S \
                    ON H.id = S.hive_id \
                    WHERE A.user_id = ? \
                    LIMIT 1";

    db.connect();

    if(matchesId(user_id)){
        db.query(query, [user_id], (err, rows, fields)=>{
            if(rows.length > 0){
                res.sendFile(`${__approot}/html/`)
            } else {
                res.sendFile(`${__approot}/html/noapirieyet.html`);
            }
        });
    }

    db.end();
}


exports.getHive = (res, req) => {
    let db = getDb();
    let apiary_id = req.body.apiary_id;
    let query = "SELECT id, name, photo_url, description \
                    FROM Hives \
                    WHERE H.apiary_id=?";

    db.connect();
    
    if(matchesId(apiary_id)){
        db.query(query, [apiary_id], (err, rows, fields)=>{
            
        });
    }

    db.end();
}


exports.getSheduledHiveWork = (res, req) => {
    let db = getDb();
    let hive_id = req.body.hive_id;
    let query = "SELECT description, date \
                    FROM Work \
                    WHERE isDone = NULL \
                    AND hive_id = ?";

    db.connect();

    if(matchesId(hive_id)){
        db.query(query, (err, rows, fields)=>{

        });
    }

    db.end();
}


exports.getDoneHiveWork = (res, req) => {
    let db = getDb();
    let hive_id = req.body.hive_id;
    let query = "SELECT description, date \
                    FROM Work \
                    WHERE isDone = '' \
                    AND hive_id = ?";

    db.connect();

    if(matchesId(hive_id)){
        db.query(query, [hive_id], (err, rows, fields)=>{

        });
    }

    db.end();
}

exports.getAllScheduledWork = (res, req) => {
    let db = getDb();
    let query = "SELECT H.name, W.description, W.date \
                    FROM Hive \
                    WHERE isDone = NULL";

    db.connect();

    db.query(query, (err, rows, fields)=>{

    });

    db.end();
}



exports.getAllDoneWork = (res, req) => {
    let db = getDb();
    let query = "SELECT H.name, W.description, W.date \
                    FROM Hives as H\
                    JOIN Work as W \
                    ON W.hive_id = H.id \
                    WHERE isDone = ''";

    db.connect();

    db.query(query, (err, rows, fields)=>{

    });

    db.end();
}


exports.makeWorkDone = (res, req) => {
    let db = getDb();
    let hive_id = req.body.hive_id;
    let query = "ALTER TABLE Work \
                    SET isDone = '' \
                    WHERE hive_id = ?";

    db.connect();

    if(matchesId(hive_id)){
        db.query(query, [hive_id], (err, rows, fields)=>{

        });
    }

    db.end();
}


exports.getProfile = (res, req) => {
    let db = getDb();
    let user_id = req.body.user_id;
    let query = "SELECT username, name, email, location \
                    FROM Users \
                    WHERE id = ?";
        
    db.connect();

    if(matchesId(user_id)){
        db.query(query, [user_id], (err, rows, fields)=>{

        });
    }

    db.end();

}


exports.getNotes = (res, req) => {
    let db = getDb();
    let user_id = req.body.user_id;
    let query = "SELECT note_text \
                    FROM Notes \
                    WHERE user_id = ?";
        
    db.connect();

    if(matchesId(user_id)){
        db.query(query, [user_id], (err, rows, fields)=>{

        });
    }

    db.end();
}


exports.addNote = (res, req) => {
    let db = getDb();
    let user_id = req.body.user_id;
    let query = "SELECT username, name, email, location \
                    FROM Users \
                    where id = ?";
        
    db.connect();

    if(matchesId(user_id)){
        db.query(query, [user_id], (err, rows, fields)=>{

        });
    }

    db.end();
}


