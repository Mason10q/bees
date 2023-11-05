const mysql = require('mysql');
const dotenv = require('dotenv');
const fs = require('fs');

const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

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


function pathFromFileName(filename) {
    return `/public/images/${filename}`;
}


exports.updateProfile = (req, res) => {
    let db = getDb();
    let query = "UPDATE Users \
                    SET username = ?, name = ?, location = ?\
                    WHERE id = ?";
    const { username, name, location } = req.body

    console.log(req.body);

    db.connect();

    db.query(query, [username, name, location, req.session.user_id], (err, rows, fields) => {
        console.log(err);
        res.redirect('back');        
    });

    db.end()
}



exports.getApirie = (req, res) => {
    let db = getDb();
    let user_id = req.session.user_id;
    let query = "SELECT A.id, A.apiary_name, A.apiary_photo_url, H.id as hive_id, H.hive_name, H.nest_amount, H.store_amount, H.bee_nature, H.queen_age \
                    FROM Apiaries as A \
                    JOIN Hives as H \
                    ON H.apiary_id = A.id \
                    WHERE A.user_id = ?";

    db.connect();

    if (matchesId(user_id)) {
        db.query(query, [user_id], (err, rows, fields) => {
            if (rows != undefined && rows.length > 0) {
                req.session.apiary_id = rows[0].id;

                rows.map((image) => { image, image.apiary_photo_url = pathFromFileName(image.apiary_photo_url); });
                res.render(`${__approot}/html/apiary.html`, { apiary: rows });
            } else {
                res.sendFile(`${__approot}/html/noapirieyet.html`);
            }
        });
    }

    db.end();
}



exports.getScheduledHiveWork = (req, res) => {
    let db = getDb();
    let query = "SELECT id, description, date \
                    FROM Works \
                    WHERE isDone = false \
                    AND hive_id = ?";

    db.connect();

    db.query(query, [req.session.hive_id], (err, rows, fields) => {
        res.render(`${__approot}/html/hive_work_scheduled.html`, { works: rows, hive_name: req.query.hive_name });
    });

    db.end();
}


exports.insertWork = (req, res) => {
    let db = getDb();
    let query = "INSERT INTO Works (description, date, hive_id) \
                    VALUES (?, ?, ?)";

    db.connect();

    db.query(query, [req.body.description, req.body.date, req.session.hive_id], (err, rows, fields) => {
        res.send();
    });

    db.end();
}


exports.updateWork = (req, res) => {
    let db = getDb();
    let query = "UPDATE Works SET description = ?, date = ? WHERE id = ?";

    db.connect();

    db.query(query, [req.body.description, req.body.date, req.body.id], (err, rows, fields) => {
        res.send();
    });

    db.end();
}


exports.deleteWork = (req, res) => {
    let db = getDb();
    let query = "DELETE FROM Works WHERE id = ?";

    db.connect();

    db.query(query, [req.body.id], (err, rows, fields) => {
        res.send();
    });

    db.end();
}

exports.getDoneHiveWork = (req, res) => {
    let db = getDb();
    let query = "SELECT id, description, date \
                    FROM Works \
                    WHERE isDone = true \
                    AND hive_id = ?";

    db.connect();

    db.query(query, [req.session.hive_id], (err, rows, fields) => {
        res.render(`${__approot}/html/hive_work_done.html`, { works: rows, hive_name: req.query.hive_name });
    });

    db.end();
}

exports.getAllScheduledWork = (req, res) => {
    let db = getDb();
    let apiary_id = req.session.apiary_id;
    let query = "SELECT H.hive_name, W.description, W.date \
                    FROM Hives as H\
                    LEFT OUTER JOIN Works as W \
                    ON W.hive_id = H.id \
                    WHERE H.apiary_id = ? \
                    AND (W.isDone = false OR W.isDone IS NULL) \
                    ORDER BY W.date";

    db.connect();

    db.query(query, [apiary_id], (err, rows, fields) => {
        if (apiary_id === undefined) {
            res.sendFile(`${__approot}/html/noapirieyet.html`);
            return;
        }

        res.render(`${__approot}/html/work.html`, { works: rows });
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
                    WHERE H.apiary_id = ? \
                    AND (W.isDone = true OR W.isDone IS NULL) \
                    ORDER BY W.date";

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
    let query = "UPDATE Works \
                    SET isDone = true \
                    WHERE id IN (?)";

    db.connect();

    db.query(query, [req.body.work_ids], (err, rows, fields) => {
        console.log(err);
        res.send();
    });

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
    let query = "SELECT id, note_text \
                    FROM Notes \
                    WHERE user_id = ?";

    db.connect();

    if (matchesId(user_id)) {
        db.query(query, [user_id], (err, rows, fields) => {
            console.log(rows);
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

exports.getRedactApiaryPage = (req, res) => {
    let db = getDb();
    let query = "SELECT A.id, A.apiary_name, A.apiary_photo_url, H.id as hive_id, H.hive_name, H.nest_amount, H.store_amount, H.bee_nature, H.queen_age \
                    FROM Apiaries as A \
                    JOIN Hives as H \
                    ON H.apiary_id = A.id \
                    WHERE A.user_id = ?";

    db.connect();

    db.query(query, [req.session.user_id], (err, rows, fields) => {
        rows.map((image) => { image, image.apiary_photo_url = pathFromFileName(image.apiary_photo_url); });
        res.render(`${__approot}/html/redact_apiary.html`, { apiary: rows });
    });
    

    db.end();
}


exports.redactApiary = (req, res) => {
    b = req.body;
    const db = getDb();

    let apiaryQuery = "UPDATE Apiaries SET apiary_name = ?, apiary_photo_url = ?"
}


exports.createApiary = (req, res) => {
    let b = req.body;
    const db = getDb();

    let apiaryQuery = "INSERT INTO Apiaries SET?";
    let hiveQuery = "INSERT INTO Hives (hive_name, bee_nature, queen_age, nest_amount, store_amount, apiary_id) VALUES ";

    for (hive of b.hives) {
        hiveQuery += `("${hive.hive_name}", "${hive.bee_nature}", ${hive.queen_age[0]}, ${hive.nest_amount}, ${hive.store_amount}, ${req.session.user_id})`;

        if (hive != b.hives[b.hives.length - 1]) {
            hiveQuery += ',';
        }
    }


    db.connect();

    db.query(apiaryQuery, { id: req.session.user_id, apiary_name: b.apiary_name, user_id: req.session.user_id }, (err, rows, fields) => {
        req.session.apiary_id = req.session.user_id;
    });

    db.query(hiveQuery, (err, rows, fields) => {
        res.send();
    });

    db.end();
}


exports.deleteApiary = (req, res) => {
    const db = getDb();
    db.connect();

    let id = req.session.apiary_id;
    let query = "DELETE FROM Apiaries WHERE id = ?"
    let imageQuery = "SELECT A.apiary_photo_url, H.hive_photo_url \
                            FROM Apiaries as A \
                            JOIN Hives as H \
                            ON A.id = H.apiary_id \
                            WHERE A.id = ?"




    db.query(imageQuery, [id], (err, rows, fields) => {
        if (rows[0].apiary_photo_url != null) {
            unlinkAsync(__approot + pathFromFileName(rows[0].apiary_photo_url));
        }

        for (let path of rows) {
            if (path != null) {
                unlinkAsync(__approot + pathFromFileName(path.hive_photo_url));
            }
        }
    });

    db.query(query, [id], (err, rows, fields) => {
        res.redirect('/profile/apiary');
    });

    db.end()
}


exports.getHive = (req, res) => {
    const db = getDb();

    let query = "SELECT * FROM Hives \
                    WHERE apiary_id = ? \
                    AND id = ?"

    db.connect();

    db.query(query, [req.session.apiary_id, req.query.hive_id], (err, rows, fields) => {
        req.session.hive_id = req.query.hive_id;
        rows.map((image) => { image, image.hive_photo_url = pathFromFileName(image.hive_photo_url); });
        res.render(`${__approot}/html/hive.html`, { hive: rows[0] })
    });

    db.end();
}



exports.updateApiaryAvatar = (req, res) => {
    const db = getDb();

    let updateQuery = "UPDATE Apiaries \
                        SET apiary_photo_url = ? \
                        WHERE id = ?";

    let unlinkQuery = "SELECT apiary_photo_url \
                        FROM Apiaries \
                        WHERE id = ?";

    db.connect();

    db.query(unlinkQuery, [req.session.apiary_id], (err, rows, fields) => {
        if (rows[0].apiary_photo_url) {
            unlinkAsync(__approot + pathFromFileName(rows[0].apiary_photo_url));
        }
    });

    db.query(updateQuery, [req.file.filename, req.session.apiary_id], (err, rows, fields) => {
        res.send();
    });

    db.end();
}


exports.updateHive = (req, res) => {
    const db = getDb();

    console.log(req.body)

    let query = "UPDATE Hives \
                    SET hive_photo_url = ?, \
                    description = ? \
                    WHERE id = ?";

    let unlinkQuery = "SELECT hive_photo_url \
                        FROM Hives \
                        WHERE id = ?";

    db.connect();

    if (req.file != undefined) {
        db.query(unlinkQuery, [req.session.hive_id], (err, rows, fields) => {
            if (rows[0].hive_photo_url != undefined) {
                unlinkAsync(__approot + pathFromFileName(rows[0].hive_photo_url));
            }
        });

        db.query(query, [req.file.filename, req.body.description, req.session.hive_id], (err, rows, fields) => {
            res.send();
        });
    } else {
        query = "UPDATE Hives \
                    SET description = ? \
                    WHERE id = ?";

        db.query(query, [req.body.description, req.session.hive_id], (err, rows, fields) => {
            console.log(err);
            res.send();
        });
    }

    db.end();
}


exports.updateNote = (req, res) => {
    const db = getDb();
    const query = "UPDATE Notes \
                    SET note_text = ? \
                    WHERE user_id = ? \
                    AND id = ?"

    db.connect()

    db.query(query, [req.body.text, req.session.user_id, req.body.id], (err, rows, fields) => {
        console.log("update", req.body.text, req.session.user_id, req.body.id);
        res.send();
    });

    db.end()
}


exports.deleteNote = (req, res) => {
    const db = getDb();
    const query = "DELETE FROM Notes \
                    WHERE user_id = ? \
                    AND id = ?";

    db.query(query, [req.session.user_id, req.body.id], (err, rows, fields) => {
        console.log("delete");
        res.send();
    });

    db.end()
}


exports.insertNote = (req, res) => {
    const db = getDb();

    const query = "INSERT INTO Notes (note_text, user_id) VALUES (?, ?)";

    db.query(query, [req.body.text, req.session.user_id], (err, rows, fields) => {
        console.log("insert" + req.body.text);
        res.send();
    });

    db.end()
}