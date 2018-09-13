package main

import (
	"fmt"
	"net/http"
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"time"
	"log"

	"golang.org/x/crypto/bcrypt"
	"github.com/segmentio/ksuid"
)

const OK = http.StatusOK
const CREATED = http.StatusCreated

const WRONG_PASSWORD = -http.StatusUnauthorized
const USER_ALREADY_EXISTS = -http.StatusBadRequest
const SESSION_ID_EXPIRED = -http.StatusRequestTimeout
const SESSION_ID_INVALID = -http.StatusBadRequest
const USER_DOES_NOT_EXIST = -http.StatusNotFound
const INVALID_REQUEST_TYPE = -http.StatusBadRequest
const DATABASE_CONNECTION_ERROR = -http.StatusInternalServerError
const QUERY_ERROR = -http.StatusInternalServerError
const DATABASE_ERROR = -http.StatusInternalServerError
const IO_ERROR = -http.StatusInternalServerError
const JSON_PARSING_ERROR = -http.StatusInternalServerError
const INVALID_REQUEST_BODY = -http.StatusBadRequest

func statuscode(w http.ResponseWriter, code int) int {
	w.WriteHeader(-code)
	return code
}

func getBody(r *http.Request) (map[string]interface{}, int) {
	var (
		body map[string]interface{}
		errorcode int
	)

	errorcode = 0

	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()

	if err != nil {
		errorcode = IO_ERROR
	}

	err = json.Unmarshal(b, &body)

	if err != nil && errorcode == 0 {
		errorcode = JSON_PARSING_ERROR
	}

	return body,errorcode
}

func getUser(db *sql.DB, user string, pass string) (int, string, string, string, string, string, time.Time, int) {
	rows,err := db.Query("SELECT * FROM users WHERE username=?", user)
	defer rows.Close()

	var errorcode int
	errorcode = 0

	if err != nil {
		errorcode = QUERY_ERROR
	}

	if rows.Next() {
		var (
			userid int
			fname string
			lname string
			username string
			password string
			sessionid string
			timestamp time.Time
		)

		err := rows.Scan(&userid, &fname, &lname, &username, &password, &sessionid, &timestamp)

		if err != nil && errorcode == 0 {
			errorcode = DATABASE_ERROR
		}
		if !comparePasswords(password, pass) {
			return WRONG_PASSWORD, "", "", "", "", "", time.Now(), WRONG_PASSWORD
		}

		return userid, fname, lname, username, password, sessionid, timestamp, errorcode
	} else if errorcode == 0 {
		errorcode = USER_DOES_NOT_EXIST
	}

	return USER_DOES_NOT_EXIST, "", "", "", "", "", time.Now(), errorcode
}

func getUserID(db *sql.DB, user string, pass string) (int, int) {
	// getUser is defined above
	user_id,_,_,_,_,_,_,errorcode := getUser(db, user, pass)

	return user_id, errorcode
}

func newSessionID(db *sql.DB) (string, int) {
	var errorcode int
	errorcode = 0

	for true {
		id := ksuid.New().String()

		rows,err := db.Query("SELECT user_id FROM users WHERE session_id=?", id)

		if err != nil {
			errorcode = QUERY_ERROR
		}

		if !rows.Next() {
			return id, errorcode
		}
	}

	return "",SESSION_ID_INVALID
}

func deleteSession(db *sql.DB, userid int) int {
	_,err := db.Query("UPDATE users SET session_id=null WHERE user_id=?", userid)

	if err != nil {
		return QUERY_ERROR
	}

	return 0
}

func validUser(db  *sql.DB, user string) int {
	rows,err := db.Query("SELECT user_id FROM users WHERE username=?", user)
	defer rows.Close()

	if err != nil {
		return QUERY_ERROR
	}

	if rows.Next() {
		var userid int

		err := rows.Scan(&userid)

		if err != nil {
			return DATABASE_ERROR
		}

		return USER_ALREADY_EXISTS
	}

	return 0
}

func validSession(db *sql.DB, sessionid string) int {
	rows,err := db.Query("SELECT user_id, last_updated FROM users WHERE session_id=?", sessionid)
	defer rows.Close()

	if err != nil {
		return QUERY_ERROR
	}

	if rows.Next() {
		var (
			userid int
			timestamp time.Time
		)

		err := rows.Scan(&userid, &timestamp)

		if err != nil {
			return DATABASE_ERROR
		}

		if time.Since(timestamp).Minutes() >= 30 {
			fmt.Printf(">%s<\n >%s<\n", time.Now(), timestamp)
			deleteSession(db, userid)
			return SESSION_ID_EXPIRED
		}

		return userid
	}
	return SESSION_ID_INVALID
}

// Password salt and hash ops taken from:
// https://medium.com/@jcox250/password-hash-salt-using-golang-b041dc94cb72
func hashAndSalt(pass string) string {
    pwd := []byte(pass)
    // Use GenerateFromPassword to hash & salt pwd
    // MinCost is just an integer constant provided by the bcrypt
    // package along with DefaultCost & MaxCost.
    // The cost can be any value you want provided it isn't lower
    // than the MinCost (4)
    hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
    if err != nil {
        log.Println(err)
    }
    // GenerateFromPassword returns a byte slice so we need to
    // convert the bytes to a string and return it
    return string(hash)
}

func comparePasswords(hashedPwd string, plainPwd string) bool {
    // Since we'll be getting the hashed password from the DB it
    // will be a string so we'll need to convert it to a byte slice,
    // as that's what CompareHashAndPassword expects
    err := bcrypt.CompareHashAndPassword([]byte(hashedPwd), []byte(plainPwd))
    if err != nil {
        log.Println(err)
        return false
    }

    return true
}
