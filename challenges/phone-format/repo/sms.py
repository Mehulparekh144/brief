class FakeGateway:
    """Stands in for the SMS provider in tests and local runs."""

    def __init__(self):
        self.outbox = []

    def send(self, to: str, body: str) -> None:
        if not to.startswith("+"):
            raise ValueError("the gateway needs an E.164 number")
        self.outbox.append((to, body))


def send_reminder(gateway, contact, when: str) -> None:
    gateway.send(contact["phone"], f"Hi {contact['name']}, see you {when}.")
