import sys

from tokenizer import tokenize

if __name__ == "__main__":
    for line in sys.stdin:
        print(" ".join(tokenize(line)))
