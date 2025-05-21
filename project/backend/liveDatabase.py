import sqlite3
import time

def export_users():
    conn = sqlite3.connect('./database/database.sqlite')
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()

    with open('users.txt', 'w') as file:
        for row in rows:
            file.write(str(row) + '\n')

    conn.close()
    # print("users.txt updated.")

# Repeat every few seconds
while True:
    export_users()
    time.sleep(5)  # wait 5 seconds



#run python3 liveDatabase.py to check all the users in the database OR
#run npx concurrently "nodemon index.js" "python3 liveDatabase.py" in bash OR
# run npm start
#For this to work i installed npx install concurrently
#and in package.json added the rule:
#  "scripts": {
# 	"start": "concurrently \"nodemon index.js\" \"python3 liveDatabase.py\""
#   },


