package main

import (
	"time"
	"net/http"
	"encoding/json"

	"database/sql"
	 _ "github.com/go-sql-driver/mysql"
)

func login(w http.ResponseWriter, r *http.Request) {
	type output struct {
		Session_id string `json:"session_id"`
		User_found bool `json:"user_found"`
		Pass_match bool `json:"pass_match"`
	}

	out := output{Session_id: "BAD_SESSION_ID", User_found: false}

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
		json.NewEncoder(w).Encode(out)
		return
	}

	// getBody is defined in core.go
	body,errorcode := getBody(r)

	if errorcode < 0 {
		statuscode(w, errorcode)
		json.NewEncoder(w).Encode(output{Session_id: "SESSION_ID_INVALID", User_found: false, Pass_match: false})
		return
	}

	user,inbody := body["username"].(string)

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		json.NewEncoder(w).Encode(out)
		return
	}

	pass,inbody := body["password"].(string)

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		json.NewEncoder(w).Encode(out)
		return
	}

	// getUser is defined in core.go
	userid,errorcode := getUserID(db, user, pass)

	if errorcode == USER_DOES_NOT_EXIST {
		// statuscode is defined in core.go
		json.NewEncoder(w).Encode(output{Session_id: "", User_found: false, Pass_match: false})
		return
	}
	if errorcode == WRONG_PASSWORD {
		// statuscode is defined in core.go
		json.NewEncoder(w).Encode(output{Session_id: "", User_found: true, Pass_match: false})
		return
	}

	// newSessionID is defined in core.go
	sessionid,errorcode := newSessionID(db)

	if errorcode < 0 {
		statuscode(w, errorcode)
		return
	}

	_, err = db.Query("UPDATE users SET session_id=?, last_updated=? WHERE user_id=?", sessionid, time.Now(), userid)

	out = output{Session_id: "INVALID_SESSION_ID", User_found: true, Pass_match: true}

	if err != nil {
		statuscode(w, QUERY_ERROR)
		json.NewEncoder(w).Encode(out)
		return
	}

	out = output{Session_id: sessionid, User_found: true, Pass_match: true}

	json.NewEncoder(w).Encode(out)
}
