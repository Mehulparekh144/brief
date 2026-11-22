from mailer.batch import build_batch
from mailer.log import log


def run_daily(teams, smtp):
    """Send the digest to every team. teams: {name: [user, ...]}"""
    for name, users in teams.items():
        batch = build_batch(users)
        log("INFO", f"team={name} recipients={len(batch)}")
        for address in batch:
            smtp.send(address)
