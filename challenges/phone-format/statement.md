to_e164() in phone.py stores phone numbers as E.164 ("+16175550142"). Today it puts "+1" in front of every number, so foreign and bad numbers get through. Make it follow these rules:

1. Remove spaces and the characters `-` `.` `(` `)`.
2. Any other character that is not a digit raises ValueError. A `+` is allowed only as the first character.
3. After step 1, a leading "00" means "+": "0044 20 7946 0958" → "+442079460958".
4. A number with "+": keep its digits as they are. It must have 8 to 15 digits, else ValueError.
5. A number without "+" uses default_country. Only "US" is supported. Any other value raises ValueError.
6. US: 10 digits → "+1" and the digits.
7. US: 11 digits that start with "1" → "+" and the digits.
8. Anything else raises ValueError.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
