package main

import (
	"net/http"
	"encoding/json"

	"database/sql"
	 _ "github.com/go-sql-driver/mysql"
)

func searchcontact(w http.ResponseWriter, r *http.Request) {
	type output struct {
		Contacts [][]interface{} `json:"contact_list"`
		Session_expired bool `json:"session_expired"`
	}

	out := new(output)
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

	sessionid := sid.(string)
	fname := firstname.(string)
	lname := lastname.(string)

	// getUserID is defined in core.go
	userid := validSession(db, sessionid)

	if userid < 0 {
		json.NewEncoder(w).Encode(out)
		return
	}

	out.Session_expired = false

	contacts,err := db.Query("SELECT * FROM contacts WHERE first_name=? AND last_name=?", fname, lname)

	if err != nil {
		statuscode(w, QUERY_ERROR)
		return
	}

	var (
		contactid int
		address1 string
		address2 string
		city string
		state string
		zip int
	)

	for contacts.Next() {
		err := contacts.Scan(&contactid, &userid, &fname, &lname, &address1, &address2, &city, &state, &zip)

		if err != nil {
			statuscode(w, DATABASE_ERROR)
			return
		}

		s := []interface{}{contactid, userid, fname, lname, address1, address2, city, state, zip}
		out.Contacts = append(out.Contacts, s)
	}

	json.NewEncoder(w).Encode(out)
}