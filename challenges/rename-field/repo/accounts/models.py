from dataclasses import dataclass


@dataclass
class User:
    user_name: str
    email: str
    active: bool = True
