package main

import (
	"net/http"
	"time"
	"encoding/json"

	"database/sql"
	 _ "github.com/go-sql-driver/mysql"
)

func profile(w http.ResponseWriter, r *http.Request) {
	type output struct {
		Userinfo []interface{} `json:"user_info"`
		Contacts [][]interface{} `json:"contact_list"`
		Session_expired bool `json:"session_expired"`
	}

	out := new(output)
	out.Userinfo = []interface{}{}
	out.Contacts = [][]interface{}{}
	out.Session_expired = true

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

	sessionid := sid.(string)

	// validSession is defined in core.go
	userid := validSession(db, sessionid)

	if userid < 0 {
		json.NewEncoder(w).Encode(out)
		return
	}

	out.Session_expired = false

	var (
		fname string
		lname string
		user string
		pass string
		lastupdated time.Time
	)

	rows,err := db.Query("SELECT * FROM users WHERE user_id=?", userid)
	defer rows.Close()

	if err != nil {
		statuscode(w, QUERY_ERROR)
		return
	}

	if !rows.Next() {
		statuscode(w, DATABASE_ERROR)
		return
	}

	err = rows.Scan(&userid, &fname, &lname, &user, &pass, &sessionid, &lastupdated)

	if err != nil {
		statuscode(w, DATABASE_ERROR)
		return
	}

	out.Userinfo = []interface{}{userid, fname, lname, user, pass, sessionid, lastupdated}

	var (
		contactid int
		address1 string
		address2 string
		city string
		state string
		zip int
	)

	contacts,err := db.Query("SELECT * FROM contacts WHERE user_id=?", userid)
	defer contacts.Close()

	if err != nil {
		statuscode(w, QUERY_ERROR)
		return
	}

	for contacts.Next() {
		err := contacts.Scan(&contactid, &userid, &fname, &lname, &address1, &address2, &city, &state, &zip)

		if err != nil {
			statuscode(w, DATABASE_ERROR)
			return
		}

		s := []interface{}{contactid, userid, fname, lname, address1, address2, city, state, zip}
		out.Contacts = append(out.Contacts, s)
	}
	
	if err != nil {
		json.NewEncoder(w).Encode(out)
		statuscode(w, QUERY_ERROR)
		return
	}

	json.NewEncoder(w).Encode(out)
}