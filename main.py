import database
from Block import Block

# A blockchain consists of blocks, each containing a list of transactions
# A blockchain is a type of linked list that uses hashes to link blocks together instead of pointers
# Each block in a blockchain contains the hash of the previous block, a timestamp, and transaction data

# Initialize blockchain array
blockchain = []

# Predefined hash for genesis block, since it has no previous block
GENESIS_PREV_HASH = "0" * 64

# Function to create genesis block
def create_genesis_block():
    genesis = Block(GENESIS_PREV_HASH, ["Genesis block"])
    blockchain.append(genesis)

# Function to add new block to the blockchain
def add_block(transactions):
    last_hash = blockchain[-1].block_hash # Get hash of the last block in the chain
    new_block = Block(last_hash, transactions)
    blockchain.append(new_block)

# Function to validate the integrity of the blockchain
def validate_blockchain(chain):
    for i in range(1, len(chain)):
        # Check if the previous hash of the current block matches the hash of the previous block
        if chain[i].previous_hash != chain[i - 1].block_hash:
            return False
    return True    

# Function to cast vote
def cast_vote(token, selected_candidate):
    # Validate token exists and hasn't been used
    if not database.is_token_valid(token):
        return {"success": False, "message": "Invalid or already used token."}

    # Add vote to blockchain
    vote_message = f"User token {token} voted for {selected_candidate}"
    add_block([vote_message])

    # Mark token as used
    database.mark_token_used(token)

    # Validate blockchain integrity
    if not validate_blockchain(blockchain):
        return {"success": False, "message": "Blockchain integrity compromised. Vote not recorded."}

    return {"success": True, "message": "Vote successfully added to the blockchain!"}