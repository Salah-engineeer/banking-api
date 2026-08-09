# Security Notes

## Account lookup route (Aug 9)
Filters accounts by username using a fake memory array.
No input  yet — once a real database is added, this exact pattern is where SQL injection risk lives. Will need parameterized
queries here specifically.