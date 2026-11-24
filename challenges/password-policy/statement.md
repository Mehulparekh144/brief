Our sign-up form accepts weak passwords. check() in policy.py only tests length (8) and digits. Make it follow the new security policy.

check(password, username) returns the codes of the rules that fail, in this exact order. An empty list means the password is accepted.

1. LENGTH: fewer than 12 characters.
2. UPPER: no letter A–Z.
3. LOWER: no letter a–z.
4. DIGIT: no digit 0–9.
5. SYMBOL: no character other than A–Z, a–z and 0–9. A space counts as a symbol.
6. CONTAINS_USERNAME: the password contains the username, ignoring case. An empty username never matches.
7. COMMON: the password, ignoring case, is a line in data/common_passwords.txt. Skip blank lines and lines that start with "#".

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
