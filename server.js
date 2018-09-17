const sqlite3 = require('sqlite3').verbose()

const DB_PATH = './sqlite.db'

const DB = new sqlite3.Database(DB_PATH, function(err){
    if (err) {
        console.log(err)
        return
    }
    console.log('Connected to ' + DB_PATH + ' database.')

    DB.exec('PRAGMA foreign_keys = ON;', function(error)  {
        if (error){
            console.error("Pragma statement didn't work.")
        } else {
            console.log("Foreign Key Enforcement is on.")
        }
    });
});

var dbSchema = `CREATE TABLE IF NOT EXISTS Users (
        id integer NOT NULL PRIMARY KEY,
        login text NOT NULL UNIQUE,
        password text NOT NULL,
        email text NOT NULL UNIQUE,
        first_name text,
        last_name text
    );

    CREATE TABLE IF NOT EXISTS Blogs (
        id integer NOT NULL PRIMARY KEY,
        user_id integer NOT NULL UNIQUE,
        blog text ,
        title text NOT NULL,
        publish_date date,
            FOREIGN KEY (user_id) REFERENCES Users(id)
    );`

DB.exec(dbSchema, function(err){
    if (err) {
        console.log(err)
    }
})

// RUN QUERY  ==================================================================
function registerUser(login, password, email) {
    var sql= "INSERT INTO Users (login, password, email) "
    sql += "VALUES (? ,?, ?) "

    DB.run(sql, [login, password, email], function(error) {
        if (error) {
            console.log(error)
        } else {
            console.log("Last ID: " + this.lastID)
            console.log("# of Row Changes: " + this.changes)
        }
    });
};

// registerUser("newuser", "pass", "test@test4637.com")
// registerUser("newuser2", "pass", "test@test4827.com")
// registerUser("newuser3", "pass", "test@test5830.com")

// GET QUERY  ==================================================================
function printUserEmail(email) {
    console.log("User's email is: " + email)
}

function findUserByLogin(user_login) {
    var sql = 'SELECT email '
    sql += 'FROM Users '
    sql += 'WHERE login = ? '


    DB.get(sql, user_login, function(error, row) {
        if (error) {
            console.log(error)
            return
        }

        printUserEmail(row.email)
    });
}

// findUserByLogin('newuser')

// ALL QUERY  ==================================================================
function listUserEmails(userEmails) {
    userEmails.forEach(email => {
        console.log(email.email)
    });
}

function getUserEmails() {
    var sql = 'SELECT email '
    sql += 'FROM Users '

    DB.all(sql, [], function(error, rows) {
        if (error) {
            console.log(error)
            return
        }

        listUserEmails(rows)
    });
}

// getUserEmails()


// EACH QUERY  =================================================================
function getUserEmails() {
    var sql = 'SELECT email '
    sql += 'FROM Users '

    DB.each(sql, [], function(error, row){
        if (error) {
            console.log(error)
            return
        }

        console.log(row.email)
    });
}

// getUserEmails()

DB.close()