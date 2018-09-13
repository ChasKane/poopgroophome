package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"database/sql"
	_ "github.com/go-sql-driver/mysql"
)

func updatecontact(w http.ResponseWriter, r *http.Request) {
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

	db, err := sql.Open("mysql", "root:poopgroup@/test?parseTime=true")
	defer db.Close()

	if err != nil {
		statuscode(w, DATABASE_CONNECTION_ERROR)
		return
	}

	body, errorcode := getBody(r)

	if errorcode < 0 {
		statuscode(w, errorcode)
		return
	}

	sid, inbody := body["session_id"]

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		return
	}

	cid, inbody := body["contact_id"]

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		return
	}

	firstname, inbody := body["first_name"]

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		return
	}

	lastname, inbody := body["last_name"]

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		return
	}

	address_1, inbody := body["address1"]

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		return
	}

	address_2, inbody := body["address2"]

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		return
	}

	cityname, inbody := body["city"]

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		return
	}

	statename, inbody := body["state"]

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		return
	}

	zipcode, inbody := body["zip"]

	if !inbody {
		statuscode(w, INVALID_REQUEST_BODY)
		return
	}

	sessionid := sid.(string)
	contactid, _ := strconv.Atoi(cid.(string))
	fname := firstname.(string)
	lname := lastname.(string)
	address1 := address_1.(string)
	address2 := address_2.(string)
	city := cityname.(string)
	state := statename.(string)
	zip, _ := zipcode.(string)
	userid := validSession(db, sessionid)

	if userid < 0 {
		json.NewEncoder(w).Encode(out)
		return
	}

	out = output{Session_expired: false}

	_, err = db.Query("UPDATE contacts SET user_id=?, first_name=?, last_name=?, address1=?, address2=?, city=?, state=?, zip_code=? WHERE contact_id=?", userid, fname, lname, address1, address2, city, state, zip, contactid)

	if err != nil {
		statuscode(w, QUERY_ERROR)
		return
	}

	json.NewEncoder(w).Encode(out)
}
