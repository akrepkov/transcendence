1. SQL Injection example
curl -k -X POST https://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"username": "admin'\'' OR 1=1 --", "password": "anything"}'

union attack
curl -k -G "https://localhost:3000/api/view_user_profile" --data-urlencode "username=djoyke' UNION SELECT userId, username, email, password, avatar FROM User--" -H "Cookie: token="

2. XSS attack
<script>alert('XSS')</script>

3. TEST UPDATE USER PROFILE (AVATAR UPLOAD)
// curl -X PATCH https://localhost:3000/api/update_user_profile \
//   -F "avatar=@/Users/mbp14/Downloads/loki_mad.webp" \              
//  -H "cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE2LCJzZXNzaW9uSWQiOiJiZTBlN2RhZWIxMjFmNzM0N2ZmYmE3OTgxODBmYzI1MDkwZDJiYWVlMjI4NDlmZGZhYTg1MWEyMDRkOWJjODgzIiwiaWF0IjoxNzU1NTE1MTYwLCJleHAiOjE3NTU1MzMxNjB9.45NZSZ5rB42ExMnnIUJj11nBBusMb2hWOxh_wFU3yPg" -k

4. curl -X GET "https://localhost:3000/api/view_user_profile?username=lena" -H "Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE3LCJzZXNzaW9uSWQiOiI5NDFiNThmMTY1NDEwYjA1YTI3ZmUxMDdmMzhlMjAyZGQwZjg5ZTAwNDQxOTY4YWQ4YWVlN2FjNjRhMzllNTEzIiwiaWF0IjoxNzU1NTE4OTM3LCJleHAiOjE3NTU1MzY5Mzd9.KUpGT__49WDdElQrbADohxJgnDpcRqdzOwDudvTTalA" -k


5. curl -X GET https://localhost:3000/api/users -H "Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE3LCJzZXNzaW9uSWQiOiI5NDFiNThmMTY1NDEwYjA1YTI3ZmUxMDdmMzhlMjAyZGQwZjg5ZTAwNDQxOTY4YWQ4YWVlN2FjNjRhMzllNTEzIiwiaWF0IjoxNzU1NTE4OTM3LCJleHAiOjE3NTU1MzY5Mzd9.KUpGT__49WDdElQrbADohxJgnDpcRqdzOwDudvTTalA" -k


6. curl -X POST https://localhost:3000/api/auth/tournament -H "Content-Type: application/json" -H "Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE3LCJzZXNzaW9uSWQiOiI5NDFiNThmMTY1NDEwYjA1YTI3ZmUxMDdmMzhlMjAyZGQwZjg5ZTAwNDQxOTY4YWQ4YWVlN2FjNjRhMzllNTEzIiwiaWF0IjoxNzU1NTE4OTM3LCJleHAiOjE3NTU1MzY5Mzd9.KUpGT__49WDdElQrbADohxJgnDpcRqdzOwDudvTTalA" -d '{"username":"lena"}'-k

7. Changes to prisma:
    npx prisma migrate dev --name fix-game-relations
	npx prisma generate