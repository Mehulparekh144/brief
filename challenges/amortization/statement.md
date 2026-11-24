schedule() in amortization.py builds the monthly payment plan for a loan. It uses floats, so the cents drift and the last balance is not 0. It also crashes on a 0% loan. Make it follow these rules:

1. principal and annual_rate_percent can be int, float, str or Decimal. Convert them with Decimal(str(x)). Do all math in Decimal.
2. months < 1 raises ValueError.
3. Monthly rate r = annual_rate_percent / 100 / 12. Do not round r.
4. Payment = principal × r / (1 − (1 + r)^−months). If the rate is 0, payment = principal / months.
5. Each month: interest = balance × r. principal = payment − interest. New balance = old balance − principal.
6. The last month pays off the loan: principal = old balance, payment = old balance + interest, balance = 0.00.
7. Round half up to cents (10.005 → 10.01) at exactly these points: the principal input, the payment (once, before month 1), and each month's interest (before you use it).
8. Principal and balance then come out in whole cents. Carry the rounded balance into the next month. Never keep unrounded values between months.
9. Each row keeps its keys: month (1, 2, …), payment, interest, principal, balance.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
