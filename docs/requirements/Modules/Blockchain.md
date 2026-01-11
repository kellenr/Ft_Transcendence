# ⛓️ Blockchain Modules

## 🔵 Major Module (2 points)

### Store Tournament Scores on Blockchain

**Use blockchain technology for immutable tournament score storage**

---

## 🎯 What is This Module?

Store tournament results on a blockchain to ensure:
- **Immutability** - Scores can't be altered after recording
- **Transparency** - Anyone can verify results
- **Decentralization** - No single point of failure
- **Tamper-proof** - Cryptographic security

---

## ✅ Requirements

### Technology Stack:
- ✅ Use **Avalanche** blockchain
- ✅ Write smart contracts in **Solidity**
- ✅ Deploy on a **test blockchain** (testnet)

### Smart Contract Features:
- ✅ **Record** tournament scores
- ✅ **Manage** tournament data
- ✅ **Retrieve** historical scores
- ✅ **Ensure data integrity** and immutability

---

## 🏗️ Architecture

```
[Web App] → [Backend] → [Smart Contract] → [Avalanche Blockchain]
                              ↓
                         Tournament Scores
                         (Immutable Storage)
```

---

## 💻 Smart Contract Example

### Solidity Smart Contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TournamentScores {
    struct Tournament {
        uint256 id;
        string name;
        uint256 timestamp;
        address creator;
    }

    struct Match {
        uint256 tournamentId;
        address player1;
        address player2;
        uint256 player1Score;
        uint256 player2Score;
        address winner;
        uint256 timestamp;
    }

    // Storage
    mapping(uint256 => Tournament) public tournaments;
    mapping(uint256 => Match[]) public tournamentMatches;
    uint256 public tournamentCount;
    uint256 public matchCount;

    // Events
    event TournamentCreated(uint256 indexed tournamentId, string name, address creator);
    event MatchRecorded(uint256 indexed tournamentId, uint256 matchId, address winner);

    // Create a new tournament
    function createTournament(string memory _name) public returns (uint256) {
        tournamentCount++;

        tournaments[tournamentCount] = Tournament({
            id: tournamentCount,
            name: _name,
            timestamp: block.timestamp,
            creator: msg.sender
        });

        emit TournamentCreated(tournamentCount, _name, msg.sender);
        return tournamentCount;
    }

    // Record a match result
    function recordMatch(
        uint256 _tournamentId,
        address _player1,
        address _player2,
        uint256 _player1Score,
        uint256 _player2Score
    ) public returns (uint256) {
        require(tournaments[_tournamentId].id != 0, "Tournament doesn't exist");

        matchCount++;
        address winner = _player1Score > _player2Score ? _player1 : _player2;

        Match memory newMatch = Match({
            tournamentId: _tournamentId,
            player1: _player1,
            player2: _player2,
            player1Score: _player1Score,
            player2Score: _player2Score,
            winner: winner,
            timestamp: block.timestamp
        });

        tournamentMatches[_tournamentId].push(newMatch);

        emit MatchRecorded(_tournamentId, matchCount, winner);
        return matchCount;
    }

    // Get tournament matches
    function getTournamentMatches(uint256 _tournamentId)
        public
        view
        returns (Match[] memory)
    {
        return tournamentMatches[_tournamentId];
    }

    // Get player's tournament stats
    function getPlayerStats(uint256 _tournamentId, address _player)
        public
        view
        returns (uint256 wins, uint256 losses, uint256 totalScore)
    {
        Match[] memory matches = tournamentMatches[_tournamentId];

        for (uint256 i = 0; i < matches.length; i++) {
            if (matches[i].player1 == _player) {
                totalScore += matches[i].player1Score;
                if (matches[i].winner == _player) wins++;
                else losses++;
            } else if (matches[i].player2 == _player) {
                totalScore += matches[i].player2Score;
                if (matches[i].winner == _player) wins++;
                else losses++;
            }
        }

        return (wins, losses, totalScore);
    }
}
```

---

## 🔌 Backend Integration

### Using ethers.js:

```javascript
const { ethers } = require('ethers');

// Connect to Avalanche testnet
const provider = new ethers.providers.JsonRpcProvider(
  'https://api.avax-test.network/ext/bc/C/rpc'
);

// Your wallet (use environment variables for private key!)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract interface
const contractAddress = '0x...'; // Your deployed contract address
const contractABI = [...]; // Your contract ABI

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Create a tournament
async function createTournament(name) {
  try {
    const tx = await contract.createTournament(name);
    await tx.wait(); // Wait for transaction confirmation

    console.log('Tournament created:', tx.hash);
    return tx;
  } catch (error) {
    console.error('Error creating tournament:', error);
    throw error;
  }
}

// Record a match
async function recordMatch(tournamentId, player1, player2, score1, score2) {
  try {
    const tx = await contract.recordMatch(
      tournamentId,
      player1,
      player2,
      score1,
      score2
    );
    await tx.wait();

    console.log('Match recorded:', tx.hash);
    return tx;
  } catch (error) {
    console.error('Error recording match:', error);
    throw error;
  }
}

// Get tournament matches
async function getTournamentMatches(tournamentId) {
  try {
    const matches = await contract.getTournamentMatches(tournamentId);
    return matches;
  } catch (error) {
    console.error('Error getting matches:', error);
    throw error;
  }
}

// Get player stats
async function getPlayerStats(tournamentId, playerAddress) {
  try {
    const [wins, losses, totalScore] = await contract.getPlayerStats(
      tournamentId,
      playerAddress
    );

    return {
      wins: wins.toNumber(),
      losses: losses.toNumber(),
      totalScore: totalScore.toNumber()
    };
  } catch (error) {
    console.error('Error getting player stats:', error);
    throw error;
  }
}

module.exports = {
  createTournament,
  recordMatch,
  getTournamentMatches,
  getPlayerStats
};
```

---

## 🚀 Deployment Steps

### 1. Set Up Development Environment

```bash
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
```

### 2. Configure Hardhat

```javascript
// hardhat.config.js
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.0",
  networks: {
    fuji: { // Avalanche testnet
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

### 3. Deploy Contract

```javascript
// scripts/deploy.js
async function main() {
  const TournamentScores = await ethers.getContractFactory("TournamentScores");
  const contract = await TournamentScores.deploy();
  await contract.deployed();

  console.log("TournamentScores deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

```bash
npx hardhat run scripts/deploy.js --network fuji
```

---

## 🎮 Frontend Integration

### React Example:

```javascript
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

function TournamentScores() {
  const [contract, setContract] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    initContract();
  }, []);

  async function initContract() {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      setContract(contractInstance);
    }
  }

  async function createTournament(name) {
    if (!contract) return;

    const tx = await contract.createTournament(name);
    await tx.wait();
    alert('Tournament created! TX: ' + tx.hash);
  }

  async function recordMatchScore(tournamentId, player1, player2, score1, score2) {
    if (!contract) return;

    const tx = await contract.recordMatch(
      tournamentId,
      player1,
      player2,
      score1,
      score2
    );
    await tx.wait();
    alert('Match recorded! TX: ' + tx.hash);

    // Refresh matches
    loadMatches(tournamentId);
  }

  async function loadMatches(tournamentId) {
    if (!contract) return;

    const matchData = await contract.getTournamentMatches(tournamentId);
    setMatches(matchData);
  }

  return (
    <div>
      <h2>🏆 Tournament Scores (Blockchain)</h2>
      <button onClick={() => createTournament('Winter Tournament')}>
        Create Tournament
      </button>

      <div className="matches">
        {matches.map((match, i) => (
          <div key={i} className="match-card">
            <p>Player 1: {match.player1}</p>
            <p>Score: {match.player1Score.toString()}</p>
            <p>Player 2: {match.player2}</p>
            <p>Score: {match.player2Score.toString()}</p>
            <p>Winner: {match.winner}</p>
            <small>Block Time: {new Date(match.timestamp * 1000).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 💰 Testnet Setup

### Get Testnet AVAX (for gas fees):
1. Go to **Avalanche Faucet**: https://faucet.avax.network/
2. Enter your wallet address
3. Request testnet AVAX
4. Use for deploying and testing

### MetaMask Configuration:
- **Network Name**: Avalanche Fuji C-Chain
- **RPC URL**: https://api.avax-test.network/ext/bc/C/rpc
- **Chain ID**: 43113
- **Currency Symbol**: AVAX
- **Block Explorer**: https://testnet.snowtrace.io/

---

## ✅ Benefits of Blockchain Storage

1. **Immutability**: Scores can't be changed once recorded
2. **Transparency**: All results are publicly verifiable
3. **Decentralization**: No central authority controls data
4. **Security**: Cryptographic protection
5. **Audit Trail**: Complete history preserved
6. **Trust**: Players can verify fairness

---

## 🧪 Testing Checklist

- [ ] Smart contract compiles without errors
- [ ] Contract deploys to testnet successfully
- [ ] Can create tournaments
- [ ] Can record matches
- [ ] Can retrieve match history
- [ ] Player stats calculate correctly
- [ ] Events are emitted properly
- [ ] Gas costs are reasonable
- [ ] Frontend can interact with contract
- [ ] Error handling works

---

## 💡 Best Practices

**Smart Contract Security:**
- Keep contracts simple
- Use OpenZeppelin libraries
- Test extensively
- Consider formal verification
- Have contracts audited

**Gas Optimization:**
- Minimize storage operations
- Use events for logs
- Batch operations when possible
- Use appropriate data types

**User Experience:**
- Show transaction status
- Handle pending states
- Provide gas estimates
- Clear error messages

**Value**: 2 points

---

## 🟣 Minor Module (1 point)

### ICP (Internet Computer Protocol) Backend

**Use blockchain for your entire backend infrastructure**

---

## ⚠️ Important Note:
**Incompatible with SSR (Server-Side Rendering)**

---

## 🎯 What is ICP?

The Internet Computer is a blockchain that can host:
- Full applications (frontend + backend)
- Smart contracts (called "canisters")
- Data storage
- Computation

---

## 📋 Requirements

### Backend on ICP:
- ✅ Deploy backend logic as **canisters**
- ✅ Handle HTTP requests
- ✅ Manage data storage
- ✅ Execute business logic

### Technologies:
- **Motoko** (ICP's native language)
- **Rust** (alternative)
- **dfx** (ICP CLI tool)

---

## 💻 Basic Example

### Motoko Canister:

```motoko
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";

actor {
  // Store user data
  stable var users : [(Text, Text)] = [];
  var userMap = HashMap.HashMap<Text, Text>(0, Text.equal, Text.hash);

  // Initialize from stable storage
  system func preupgrade() {
    users := Iter.toArray(userMap.entries());
  };

  system func postupgrade() {
    for ((key, value) in users.vals()) {
      userMap.put(key, value);
    };
  };

  // Create user
  public func createUser(username : Text, email : Text) : async Text {
    userMap.put(username, email);
    return "User created: " # username;
  };

  // Get user
  public query func getUser(username : Text) : async ?Text {
    userMap.get(username)
  };

  // List all users
  public query func listUsers() : async [Text] {
    Iter.toArray(Iter.map(userMap.keys(), func (k: Text) : Text { k }))
  };
};
```

---

## 🚀 Deployment

```bash
# Install dfx
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"

# Create new project
dfx new my_backend
cd my_backend

# Start local replica
dfx start --background

# Deploy canister
dfx deploy

# Get canister ID
dfx canister id my_backend
```

---

## 🔌 Frontend Integration

```javascript
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "./declarations/my_backend";

// Create agent
const agent = new HttpAgent({ host: "https://ic0.app" });
const canisterId = "your-canister-id";

// Create actor
const backend = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});

// Call backend methods
async function createUser(username, email) {
  const result = await backend.createUser(username, email);
  console.log(result);
}

async function getUser(username) {
  const user = await backend.getUser(username);
  return user;
}
```

---

## 💡 Benefits

- Fully decentralized backend
- No traditional servers needed
- Built-in persistence
- Scalable
- Tamper-proof

## ⚠️ Limitations

- Learning curve (Motoko)
- Can't use with SSR
- Different development paradigm
- Newer technology

**Value**: 1 point

---

## 🎯 Key Takeaway

Blockchain modules demonstrate understanding of:
- Decentralized systems
- Smart contract development
- Immutable data storage
- Web3 integration

