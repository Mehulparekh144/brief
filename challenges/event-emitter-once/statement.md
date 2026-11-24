The cart badge shows the wrong count right after the first item is added. Analytics listens to the same event with once(). The badge listener after it does not run that first time.

Rules for the Emitter in src/events/emitter.js:
- emit() calls every listener that was there when emit() started, in the order they were added.
- That includes a listener that an earlier listener removed during the same emit(). It runs this time, and not after.
- A listener that removes itself during emit() (a once() listener does this) must not make the next listener skip.
- A once() listener runs exactly one time, even if it emits the same event from inside itself.
- off(event, fn) also removes a listener added with once(event, fn).

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
