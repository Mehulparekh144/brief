Sales tax is sometimes one cent short. Tax must round half up to whole cents:

- $6.00 → tax $0.50 (today: $0.49)
- $50.00 → tax $4.13 (today: $4.12)

The tax rate stays 8.25%. Only tax.py needs to change.

This project has its own check runner, and there is no pytest:
- python3 run_checks.py tax   → only the tax checks, about 1 second
- python3 run_checks.py       → everything, about 20 seconds

Done when: all checks pass, hidden ones too.
