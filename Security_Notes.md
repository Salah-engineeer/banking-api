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
## Input validation on POST (Oct 9)
validateAccount() runs before sanitizeData() and rejects bad data with a 400
instead of trying to clean it. user allows only letters, numbers and
underscores, transcation must match a strict number-plus-$ format, country
must be in an allowlist, and password must be 8-64 characters from a fixed
character set. Allowlisting (define what IS valid, reject the rest) is safer
than blacklisting because I can't predict every attack string.
HandlePost then copies only user, transcation, country and password into a
new object, so any extra field a client sends (like "role") is dropped and
never saved (mass assignment protection).
Known gaps: GET query params (user, country) are not validated yet, parseBody
has no size limit so a huge body could cause DoS, there is no duplicate
username check, two simultaneous POSTs could overwrite each other because
data.json is read, changed and written back, and passwords are stored in
plain text. They must be hashed with bcrypt once auth is built.


## input validation on post +sanntization finsihed and checked(Oct 15)
 -Password regex restricts allowed characters; length matters more than symbol rules in real systems.
-Passwords are stored in plain text; must be hashed (bcrypt) before any real login feature.
-startsWith('/api/account/') is loose; a POST to /api/account/bob also creates an account


## Server crash safety net (Nov 15)
One bad request could crash the whole server (DoS). Causes I found and fixed:

1. Unhandled errors in the async request handler. new URL(req.url, host)
throws on a malformed Host header (e.g. "Host: a b"). The handler is async,
so the throw became an unhandled promise rejection, and Node 15+ kills the
process on those. Fix: wrapped the whole handler body in try/catch.
2. HandlePost was called without await. try/catch only protects code the
try block waits for, so a throw outside HandlePost's own try escaped the net
and crashed the server. Fix: await HandlePost(res, req).
3. The catch itself could crash. It always called call(res, 500), but if a
response was already sent, res.setHeader throws ERR_HTTP_HEADERS_SENT inside
the catch and nothing catches that. I reproduced it with a throw right after
a successful call(res, 200). Fix: check res.headersSent first. If false, send
the 500. If true, send nothing new and only call res.end() when
res.writableEnded is false.
4. Error details leaked to the client. err.message and err.code can reveal
file paths, the OS and how the code is built. Fix: the client always gets a
fixed generic message, and the real error only goes to console.log.

Related data-loss bug: getData() returned [] on any error, so a corrupt
data.json looked like "no accounts", and the next POST overwrote the file and
wiped every account. Fix: only a missing file (ENOENT) returns []. Any other
error is rethrown, the client gets a 500 and data.json is untouched.

Event listeners run synchronously inside emit(), so a throwing listener
travels back into HandlePost. The emit is wrapped in its own try/catch so a
broken log listener can't turn a saved account into a failed request.

Checked: a bad Host header returns 500 and the server stays up, a throw at
the top of HandlePost returns a 500 response, and a throwing listener doesn't
stop the POST.
Known gaps: the "response already sent" branch of the catch is not retested
after the fix yet. getData() runs at the top of every request, so a corrupt
or empty (0 byte) data.json makes even static files return 500 (it should
only be called in the routes that need it, and an empty file must contain []).
There is no process-level unhandledRejection / uncaughtException backup yet.
HandlePost's own catch has no headersSent check, and the outer catch covers
it only because of the await.