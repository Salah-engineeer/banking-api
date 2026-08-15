# Security Notes

## Account lookup route (Aug 9)
Filters accounts by username using a fake memory array.
No input  yet — once a real database is added, this exact pattern is where SQL injection risk lives. Will need parameterized
queries here specifically.

## Parameter route (Aug 13): 
Only allows known/approved query parameter keys, and returns only specific non-sensitive information instead of exposing passwords or other sensitive data.

## CORS configuration (Aug 13)
Access-Control-Allow-Origin set to '*' — allows ANY website to call 
this API. Fine for local learning/testing now, but NOT safe for a 
real banking API. Once real auth exists, this must be restricted to 
specific trusted origins only, never '*', to prevent unauthorized 
sites from making requests using a logged-in user's credentials.