from passlib.context import CryptContext

ctx = CryptContext(schemes=["sha256_crypt"])


def get_password_hash(password: str) -> str:
    return ctx.hash(password)
