package main

import (
	"net/http"
	"time"
	"encoding/json"

	"database/sql"
	 _ "github.com/go-sql-driver/mysql"
)

func updateuser(w http.ResponseWriter, r *http.Request) {
	type output struct {
		Session_expired bool `json:"session_expired"`
	}

	out := output{Session_expired: true}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")	
	w.Header().Set("Content-Type", "application/json")

	if r.Method == "OPTIONS" {
		return
	} else if r.Method != "POST" {
		statuscode(w, INVALID_REQUEST_TYPE)
		return
	}

	db,err := sql.Open("mysql", "root:poopgroup@/test?parseTime=true")
	defer db.Close()

	if err != nil {
		statuscode(w, DATABASE_CONNECTION_ERROR)
		return
	}

	// getBody is defined in core.go
	body,errorcode := getBody(r)

	if errorcode < 0 {
		statuscode(w, errorcode)
		return
	}

	sid,inbody := body["session_id"]

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		return
	}

	firstname,inbody := body["first_name"]

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		return
	}

	lastname,inbody := body["last_name"]

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		return
	}

	username,inbody := body["username"]

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		return
	}

	password,inbody := body["password"]

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		return
	}

	sessionid := sid.(string)
	fname := firstname.(string)
	lname := lastname.(string)
	user := username.(string)
	pass := password.(string)

	// validSession is defined in core.go
	userid := validSession(db, sessionid)

	if userid < 0 {
		json.NewEncoder(w).Encode(out)
		return
	}

	_,err = db.Query("UPDATE users SET first_name=?, last_name=?, username=?, password=?, last_updated=? WHERE session_id=?", fname, lname, user, pass, time.Now(), sessionid)

	out = output{Session_expired: false}

	if err != nil {
		statuscode(w, QUERY_ERROR)
		json.NewEncoder(w).Encode(out)
		return
	}

	json.NewEncoder(w).Encode(out)
}