import hashlib
from time import time

class Block:
    def __init__(self, previous_hash, transaction):
        # Initialize block with previous hash and transaction data
        self.transaction = transaction
        self.previous_hash = previous_hash
        self.timestamp = time()  # Current time in seconds

        # Convert transactions to a single string
        string_to_hash = "".join(transaction) + previous_hash + str(self.timestamp)

        # Create hash for this block as a hexadecimal string
        # SHA-256 produces a hash that is 256 bits, which is 64 hex characters (each hex character is 4 bits)
        self.block_hash = hashlib.sha256(string_to_hash.encode()).hexdigest()