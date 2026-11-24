compare(a, b) in src/semver.js orders version strings. It compares the parts as text and does not know about prereleases. Make it follow these rules:

1. Return exactly -1 when a < b, 0 when they are equal, and 1 when a > b.
2. A valid version is MAJOR.MINOR.PATCH (three whole numbers), then an optional "-prerelease", then an optional "+build". Prerelease and build are identifiers separated by dots. An identifier has letters, digits and hyphens.
3. One leading lowercase "v" is allowed: "v1.2.3" equals "1.2.3".
4. Anything else throws a TypeError with the message `invalid version: <input>`, for example `invalid version: 1.2`.
5. Build metadata is ignored: "1.0.0+a" equals "1.0.0+b".
6. Compare MAJOR, MINOR and PATCH as numbers: "1.10.0" > "1.9.0".
7. A version with a prerelease is lower than the same version without one: "1.0.0-rc.1" < "1.0.0".
8. Compare prerelease identifiers one by one, from left to right:
   - Two identifiers with only digits compare as numbers: "beta.2" < "beta.11".
   - Two text identifiers compare by ASCII code: "Beta" < "alpha" (capital letters come first).
   - An identifier with only digits is lower than a text identifier: "1" < "alpha".
   - If all shared identifiers are equal, the version with more identifiers is greater: "alpha" < "alpha.1".

Example order: 1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta < 1.0.0-beta < 1.0.0-beta.2 < 1.0.0-beta.11 < 1.0.0-rc.1 < 1.0.0.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
