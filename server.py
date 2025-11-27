from flask import Flask, request, jsonify
import database
from main import cast_vote, create_genesis_block

app = Flask(__name__)

# Call genesis block function to initialize the blockchain
create_genesis_block()

# Create database
database.create_db()

# Add candidates to database
candidates = ["Doug Ford", "JD Vance", "Zohran Mamdani", "Bernie Sanders", "Tim Houston"]
for c in candidates:
    database.add_candidate(c)

# Define vote endpoint
@app.route("/vote", methods=["POST"]) # React sends POST request to /vote

# Function executed every time a POST request is made to /vote
def vote_endpoint():
    # Read JSON data from request
    data = request.json # Parse JSON data into a Python dictionary
    token = data.get("token")
    selected_candidate = data.get("selected_candidate")
    
    # Call cast_vote function from main.py
    result = cast_vote(token, selected_candidate)

    # Return result to React as JSON response
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)