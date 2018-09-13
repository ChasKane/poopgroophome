package main

import (
	"net/http"
	"encoding/json"

	"database/sql"
	 _ "github.com/go-sql-driver/mysql"
)

func deleteuser(w http.ResponseWriter, r *http.Request) {
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

	sessionid,inbody := body["session_id"].(string)

	if !inbody {
		json.NewEncoder(w).Encode(out)
		return
	}

	_,err = db.Query("DELETE FROM users WHERE session_id=?", sessionid)

	out = output{Session_expired: false}
	
	if err != nil {
		json.NewEncoder(w).Encode(out)
		statuscode(w, QUERY_ERROR)
		return
	}

	json.NewEncoder(w).Encode(out)
}

