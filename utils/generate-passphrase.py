import secrets
import sys


def generate_passphrase(length: int) -> str:
    with open("utils/words.txt", "r") as file:
        words = file.readlines()

    words = [word.strip() for word in words]
    password = "-".join(secrets.choice(words) for i in range(length))
    return password


if __name__ == "__main__":
    length = int(sys.argv[1]) if len(sys.argv) > 1 else 6
    print(generate_passphrase(length))
