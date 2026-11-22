from mailer.log import log

MAX_ATTEMPTS = 3


class FakeSMTP:
    """Stands in for the mail server. fail_first makes the first N calls time out."""

    def __init__(self, fail_first=0):
        self.sent = []
        self._fail_left = fail_first

    def _deliver(self, address):
        if self._fail_left:
            self._fail_left -= 1
            raise TimeoutError("SMTP timeout")
        self.sent.append(address)

    def send(self, address):
        for attempt in range(1, MAX_ATTEMPTS + 1):
            try:
                self._deliver(address)
                return True
            except TimeoutError:
                log("WARNING", f"SMTP timeout, retrying (attempt {attempt + 1}/{MAX_ATTEMPTS}) to={address}")
        log("ERROR", f"giving up to={address}")
        return False
