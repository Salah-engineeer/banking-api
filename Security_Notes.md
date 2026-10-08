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

## sanitizeData tag policy (Sep 18)
Account fields (user, password, transcation, country) never legitimately
need HTML formatting, so allowedTags is empty — strip everything, no
exceptions. Only allow specific tags like <b> when a field is genuinely
free-form text a user might want to format (e.g. a story/description field).

## Input validation on POST (Oct 8)
validateAccount() runs before sanitizeData() and rejects bad data with a
400 instead of cleaning it. user is limited to letters, numbers and
underscores, transcation must match a strict number-plus-$ format, country
must be in an allowlist, and password must be 8-64 characters from a fixed
character set. Allowlisting (define what IS valid, reject the rest) is safer
than blacklisting bad input because I can't predict every attack string.
Known gaps: GET query params (user, country) are not validated yet, parseBody
has no size limit so a huge request body could cause DoS, there's no duplicate
username check, and passwords are stored in plain text in data.json. Must be
hashed with bcrypt once auth is built.