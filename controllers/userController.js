const mysql = require('mysql');
const dotenv = require('dotenv');

function getConfig() {
    return dotenv.config({ path: __approot + '/.env' });
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


function matchesId(id) {
    if (id === undefined) { return false; }
    return /[0-9]+/.test(id.toString());
}


exports.getApirie = (req, res) => {
    let db = getDb();
    let user_id = req.session.user_id;
    let query = "SELECT A.id, A.apiary_name, A.apiary_photo_url, H.hive_name, COUNT(N.id) as nest_count, COUNT(S.id) as store_count, H.bee_nature, H.queen_age \
                    FROM Apiaries as A \
                    JOIN Hives as H \
                    ON H.apiary_id = A.id \
                    JOIN HiveNests as N \
                    ON H.id = N.hive_id \
                    JOIN HiveStores as S \
                    ON H.id = S.hive_id \
                    WHERE A.user_id = ? \
                    GROUP BY A.apiary_name, A.apiary_photo_url, H.hive_name, H.bee_nature, H.queen_age";

    db.connect();
    console.log("get");

    if (matchesId(user_id)) {
        db.query(query, [user_id], (err, rows, fields) => {
            if (rows != undefined && rows.length > 0) {
                req.session.apiary_id = rows[0].id;
                res.render(`${__approot}/html/apiary.html`, { apiary: rows });
            } else {
                res.sendFile(`${__approot}/html/noapirieyet.html`);
            }
        });
    }

    db.end();
}


exports.getHive = (req, res) => {
    let db = getDb();
    let apiary_id = req.session.apiary_id;
    let query = "SELECT id, name, photo_url, description \
                    FROM Hives \
                    WHERE H.apiary_id=?";

    db.connect();

    if (matchesId(apiary_id)) {
        db.query(query, [apiary_id], (err, rows, fields) => {

        });
    }

    db.end();
}


exports.getSheduledHiveWork = (req, res) => {
    let db = getDb();
    let hive_id = req.session.hive_id;
    let query = "SELECT description, date \
                    FROM Work \
                    WHERE isDone IS NULL \
                    AND hive_id = ?";

    db.connect();

    if (matchesId(hive_id)) {
        db.query(query, (err, rows, fields) => {

        });
    }

    db.end();
}


exports.getDoneHiveWork = (req, res) => {
    let db = getDb();
    let hive_id = req.session.hive_id;
    let query = "SELECT description, date \
                    FROM Work \
                    WHERE isDone = '' \
                    AND hive_id = ?";

    db.connect();

    if (matchesId(hive_id)) {
        db.query(query, [hive_id], (err, rows, fields) => {

        });
    }

    db.end();
}

exports.getAllScheduledWork = (req, res) => {
    let db = getDb();
    let apiary_id = req.session.apiary_id;
    let query = "SELECT H.hive_name, W.description, W.date \
                    FROM Hives as H\
                    LEFT OUTER JOIN Works as W \
                    ON W.hive_id = H.id \
                    WHERE H.apiary_id = 4 \
                    AND (W.isDone = false OR W.isDone IS NULL)";

    db.connect();

    db.query(query, [apiary_id], (err, rows, fields) => {
        if (apiary_id === undefined) {
            res.sendFile(`${__approot}/html/noapirieyet.html`);
            return;
        }

        res.render(`${__approot}/html/work.html`, { works: rows })
    });

    db.end();
}



exports.getAllDoneWork = (req, res) => {
    let db = getDb();
    let apiary_id = req.session.apiary_id;
    let query = "SELECT H.hive_name, W.description, W.date \
                    FROM Hives as H\
                    LEFT OUTER JOIN Works as W \
                    ON W.hive_id = H.id \
                    WHERE H.apiary_id = 4 \
                    AND (W.isDone = true OR W.isDone IS NULL)";

    db.connect();

    db.query(query, [apiary_id], (err, rows, fields) => {
        if (apiary_id === undefined) {
            res.sendFile(`${__approot}/html/noapirieyet.html`);
            return;
        }

        res.render(`${__approot}/html/work.html`, { works: rows })
    });

    db.end();
}


exports.makeWorkDone = (req, res) => {
    let db = getDb();
    let hive_id = req.session.hive_id;
    let query = "ALTER TABLE Work \
                    SET isDone = '' \
                    WHERE hive_id = ?";

    db.connect();

    if (matchesId(hive_id)) {
        db.query(query, [hive_id], (err, rows, fields) => {

        });
    }

    db.end();
}


exports.getProfile = (req, res) => {
    let db = getDb();
    let user_id = req.session.user_id;
    let query = "SELECT username, name, email, location \
                    FROM Users \
                    WHERE id = ?";

    db.connect();

    if (matchesId(user_id)) {
        db.query(query, [user_id], (err, rows, fields) => {
            res.render(`${__approot}/html/profile.html`, { user: rows[0] })
        });
    }

    db.end();

}


exports.getNotes = (req, res) => {
    let db = getDb();
    let user_id = req.session.user_id;
    let query = "SELECT note_text \
                    FROM Notes \
                    WHERE user_id = ?";

    db.connect();

    if (matchesId(user_id)) {
        db.query(query, [user_id], (err, rows, fields) => {
            res.render(`${__approot}/html/notes.html`, { notes: rows });
        });
    }

    db.end();
}


exports.getChangePasswordPage = (req, res) => {
    res.sendFile(`${__approot}/html/change_password.html`);
}


exports.getCreateApiaryPage = (req, res) => {
    res.render(`${__approot}/html/createapiary.html`);
}


exports.createApiary = (req, res) => {
    let b = req.body;
    console.log("insert");
    console.log(b, req.file);
    const db = getDb();

    let apiaryQuery = "INSERT INTO Apiaries SET?";
    let hiveQuery = "INSERT INTO Hives (hive_name, bee_nature, queen_age, apiary_id) VALUES ";

    for (hive of b.hives) {
        hiveQuery += `("${hive.hive_name}", "${hive.bee_nature}", ${hive.queen_age[0]}, ${req.session.user_id})`;

        if (hive != b.hives[b.hives.length - 1]) {
            hiveQuery += ',';
        }
    }


    db.connect();

    db.query(apiaryQuery, { id: req.session.user_id, apiary_name: b.apiary_name, user_id: req.session.user_id }, (err, rows, fields) => {
        req.session.apiary_id = req.session.user_id;

        db.query(hiveQuery, (err, rows, fields) => {
            db.end();
        });
    });
}


exports.deleteApiary = (req, res) => {
    const db = getDb();
    db.connect();

    let id = req.session.apiary_id;
    let query = "DELETE FROM Apiaries WHERE id = ?"

    db.query(query, [id], (err, rows, fields) => {
        res.redirect('back');
    });

    db.end()
}


exports.getHive = (req, res) => {
    const db = getDb();

    let query = ""

    db.connect();

    db.query(query, (err, rows, fields) => {
        
    });

    db.end();
}