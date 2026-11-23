Some users get the daily email two or three times. The last log (logs/last_run.log) shows SMTP timeouts and retries.

But we checked: every retry is logged, and the duplicate sends have no retry line next to them. The retry logic is fine. Do not change mailer/smtp.py.

Find the real cause and fix it.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
