package main

import (
	"net/http"
)

func main() {
	// Functionality for accessing http:/46.101.195.223/
	http.Handle("/", http.FileServer(http.Dir("")))

	// Functionality for accessing http:/46.101.195.223/updateuser
	http.HandleFunc("/updateuser", updateuser)

	// Functionality for accessing http:/46.101.195.223/signup
	http.HandleFunc("/signup", signup)

	// Functionality for accessing http:/46.101.195.223/login
	http.HandleFunc("/login", login)

	// Functionality for accessing http:/46.101.195.223/deleteuser
	http.HandleFunc("/deleteuser", deleteuser)

	// Functionality for accessing http:/46.101.195.223/profile
	http.HandleFunc("/profile", profile)

	// Functionality for accessing http:/46.101.195.223/makecontact
	http.HandleFunc("/makecontact", makecontact)

	// Functionality for accessing http:/46.101.195.223/updatecontact
	http.HandleFunc("/updatecontact", updatecontact)

	// Functionality for accessing http:/46.101.195.223/deletecontact
	http.HandleFunc("/deletecontact", deletecontact)

	http.HandleFunc("/searchcontact", searchcontact)

	// Start listening on port 8080 for requests
	http.ListenAndServe(":80", nil)
}
