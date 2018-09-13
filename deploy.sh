if pgrep -x "contacts" > /dev/null
then
	kill $(pgrep contacts)
fi
go build -o contacts *.go
./contacts &
