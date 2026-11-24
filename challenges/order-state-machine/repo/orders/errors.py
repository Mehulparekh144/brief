class InvalidTransition(Exception):
    """An order was asked to move to a state it cannot reach from where it is."""
