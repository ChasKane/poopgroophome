require 'rubygems'
require 'sqlite3'


DBNAME = "hello.sqlite"
File.delete(DBNAME) if File.exists?DBNAME

DB = SQLite3::Database.new( DBNAME )
DB.execute("CREATE TABLE testdata(class_name, method_name)")

# Looping through some Ruby data classes

# This is the same insert query we'll use for each insert statement
insert_query = "INSERT INTO testdata(class_name, method_name) VALUES(?, ?)"

[Numeric, String, Array, IO, Kernel, SQLite3, NilClass, MatchData].each do |klass|
  puts "Inserting methods for #{klass}"

  # a second loop: iterate through each method
  klass.methods.each do |method_name|
    # Note: method_name is actually a Symbol, so we need to convert it to a String
    # via .to_s
    DB.execute(insert_query, klass.to_s, method_name.to_s)
  end
end


## Select record count
q = "SELECT COUNT(1) FROM testdata"
results = DB.execute(q)
puts "\n\nThere are #{results} total entries\n"

## Select 20 longest method names
puts "Longest method names:"
q = "SELECT * FROM testdata
ORDER BY LENGTH(method_name)
DESC LIMIT 20"
results = DB.execute(q)

# iterate
results.each do |row|
  puts row.join('.')
end


## Select most common methods
puts "\nMost common method names:"
q = "SELECT method_name, COUNT(1) AS mcount FROM testdata GROUP BY method_name ORDER BY mcount DESC, LENGTH(method_name) DESC LIMIT 10"
results = DB.execute(q)
# iterate
results.each do |row|
  puts row.join(": ")
end
