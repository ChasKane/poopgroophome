package main

import (
	"net/http"
	"time"
	"encoding/json"

	"database/sql"
	 _ "github.com/go-sql-driver/mysql"
)

func signup(w http.ResponseWriter, r *http.Request) {
	type output struct {
		Session_id string `json:"session_id"`
		Name_available bool `json:"name_available"`
	}

	out := output{Session_id: "BAD_SESSION_ID", Name_available: false}

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

	// getBody is defined in core.go (line 17)
	body,errorcode := getBody(r)

	if errorcode < 0 {
		statuscode(w, errorcode)
		return
	}

	fname,inbody := body["first_name"].(string)

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		return
	}

	lname,inbody := body["last_name"].(string)

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		return
	}

	user,inbody := body["username"].(string)

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		return
	}

	pass,inbody := body["password"].(string)

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		return
	}

	errorcode = validUser(db, user)
	if errorcode < 0 {
		json.NewEncoder(w).Encode(out)
		return
	}

	// newSessionID is defined in core.go
	sessionid,errorcode := newSessionID(db)

	if errorcode < 0 {
		statuscode(w, errorcode)
		return
	}

	out = output{Session_id: sessionid, Name_available: true}

	_,err = db.Query("INSERT INTO users VALUES (null, ?, ?, ?, ?, ?, ?)", fname, lname, user, hashAndSalt(pass), sessionid, time.Now())

	if err != nil {
		statuscode(w, QUERY_ERROR)
		return
	}

	json.NewEncoder(w).Encode(out)
}
