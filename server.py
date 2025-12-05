from flask import Flask, request, jsonify
from flask_cors import CORS
import database
from main import cast_vote, create_genesis_block

app = Flask(__name__)
CORS(app) # Enable CORS

# Call genesis block function to initialize the blockchain
create_genesis_block()

# Create database
database.create_db()

# Add candidates to database
candidates = ["Doug Ford", "Dwayne 'The Rock' Johnson", "Zohran Mamdani", "Bernie Sanders", "Tim Houston"]
for c in candidates:
    database.add_candidate(c)

# Register endpoint
@app.route("/register", methods=["POST"])
def register_endpoint():
    try:
        # Get registration data from request
        data = request.json
        name = data.get("name")
        dob = data.get("date_of_birth")
        address = data.get("address")
        
        # Validate that all fields are provided
        if not name or not dob or not address:
            return jsonify({
                "success": False,
                "message": "All fields are required."
            }), 400
        
        # Check if voter is already registered
        if database.is_voter_registered(name, dob):
            return jsonify({
                "success": False,
                "message": "Voter already registered."
            }), 400
        
        # Generate unique token
        token = database.generate_unique_token()
        
        # Add voter to database
        database.add_voter(name, dob, address, token)
        
        # Return success with token
        return jsonify({
            "success": True,
            "token": token,
            "message": "Registration successful. Please save your token."
        }), 201
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Registration failed: {str(e)}"
        }), 500

# Validate token endpoint
@app.route("/validate-token", methods=["POST"])
def validate_token_endpoint():
    # Validate token before allowing user to see voting page
    try:
        data = request.json
        token = data.get("token")
        
        if not token:
            return jsonify({
                "success": False,
                "message": "Token is required."
            }), 400
        
        if database.is_token_valid(token):
            return jsonify({
                "success": True,
                "message": "Token is valid. Proceed to vote."
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "Invalid or already used token."
            }), 400
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Validation failed: {str(e)}"
        }), 500

# Vote endpoint
@app.route("/vote", methods=["POST"])
def vote_endpoint():
    try:
        # Read JSON data from request
        data = request.json
        token = data.get("token")
        selected_candidate = data.get("selected_candidate")
        
        # Validate input
        if not selected_candidate:
            return jsonify({
                "success": False,
                "message": "Candidate selection is required."
            }), 400
        
        # Call cast_vote function from main.py
        result = cast_vote(token, selected_candidate)
        
        # Return status code
        status_code = 200 if result["success"] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Vote submission failed: {str(e)}"
        }), 500

# Candidates endpoint
@app.route("/candidates", methods=["GET"])
def candidates_endpoint():
    # Return list of all candidates
    try:
        candidates_list = database.get_all_candidates()
        return jsonify({
            "success": True,
            "candidates": candidates_list
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to fetch candidates: {str(e)}"
        }), 500

# Blockchain endpoint
@app.route("/blockchain", methods=["GET"])
def view_blockchain():
    try:
        from main import blockchain
        
        chain_data = []
        for i, block in enumerate(blockchain):
            chain_data.append({
                'block_index': i,
                'previous_hash': block.previous_hash,
                'timestamp': block.timestamp,
                'transactions': block.transaction,
                'block_hash': block.block_hash
            })
        
        return jsonify({
            'success': True,
            'blockchain': chain_data,
            'length': len(blockchain)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to fetch blockchain: {str(e)}'
        }), 500

if __name__ == "__main__":
    app.run(debug=True)