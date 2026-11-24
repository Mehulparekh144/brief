parse_csv() in csv_reader.py splits on newlines and commas. Real exports from our CRM break it. Make it follow these rules:

1. The first row is the header. Each later row becomes a dict: header name → field.
2. Fields are separated by commas.
3. A field in double quotes can contain commas, newlines and doubled quotes. `"say ""hi"""` → `say "hi"`.
4. Rows end with "\n" or "\r\n".
5. A newline at the very end adds no row. Empty text returns [].
6. A row with fewer fields than the header: the missing fields are "".
7. A row with more fields than the header raises ValueError.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
