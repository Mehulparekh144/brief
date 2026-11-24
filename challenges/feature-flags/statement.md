The new checkout was meant for 25% of users. About 75% got it. The dark-mode flag is at 100%, but nobody has it.

During an incident we set FLAG_NEW_CHECKOUT=off to turn the new checkout off. Nothing changed.

Rules for isEnabled(flag, userId, env) in src/flags/isEnabled.js:
- The env override wins. Its name is FLAG_ plus the flag name in upper case, with "-" as "_". new-checkout uses FLAG_NEW_CHECKOUT.
- "on" turns the flag on for every user. "off" turns it off for every user. Any other value is ignored.
- With no override, the flag is on when `bucket < rollout`.
- `bucket` is `fnv1a(flag + ":" + userId) % 100`, with fnv1a from src/flags/hash.js. The same user always gets the same answer.
- So rollout 0 is nobody, and rollout 100 is everybody.
- A flag that is not in src/flags/config.js is off.
- Do not change the flag list or the hash.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
