import React, { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import './App.css'; // Import CSS file

// Import your ERC20 token ABI here
import tokenABI from './TheodoresTokenABI.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState('0');
  const [totalSupply, setTotalSupply] = useState('0');
  const [tokenName, setTokenName] = useState('');
  const [decimals, setDecimals] = useState('0');
  const [tokenContract, setTokenContract] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [spenderAddress, setSpenderAddress] = useState('');

  // Define token contract address
  const tokenContractAddress = '0x3Bc99db296a6317A4DDC3a9B31d315bb261d62bB';

  // Function to fetch token details before connecting to MetaMask
  const fetchTokenDetails = async () => {
    try {
      const provider = await detectEthereumProvider();
      const web3Instance = new Web3(provider);
      const contract = new web3Instance.eth.Contract(tokenABI, tokenContractAddress);

      const [name, supply, decimals] = await Promise.all([
        contract.methods.name().call(),
        contract.methods.totalSupply().call(),
        contract.methods.decimals().call()
      ]);

      setTokenName(name);
      setTotalSupply(supply);
      setDecimals(decimals);
    } catch (error) {
      console.error('Error fetching token details:', error);
    }
  };

  // Initial fetch of token details
  useEffect(() => {
    fetchTokenDetails();
  }, []);

  useEffect(() => {
    const init = async () => {
      // Detect MetaMask provider
      const provider = await detectEthereumProvider();

      if (provider) {
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);

        // Request access to MetaMask account
        try {
          const accounts = await provider.request({ method: 'eth_requestAccounts' });
          setAccounts(accounts);
        } catch (error) {
          console.error('User rejected MetaMask access');
        }
      } else {
        console.error('MetaMask not detected');
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (web3 && accounts.length > 0) {
      // Initialize token contract
      const contract = new web3.eth.Contract(tokenABI, tokenContractAddress);
      setTokenContract(contract);

      // Fetch token details
      contract.methods.totalSupply().call()
        .then(totalSupply => setTotalSupply(totalSupply))
        .catch(console.error);

      contract.methods.name().call()
        .then(name => setTokenName(name))
        .catch(console.error);

      contract.methods.decimals().call()
        .then(decimals => setDecimals(decimals))
        .catch(console.error);

      // Get token balance
      contract.methods.balanceOf(accounts[0]).call()
        .then(balance => setBalance(balance))
        .catch(console.error);
    }
  }, [web3, accounts]);

  // Transfer tokens
  const transferTokens = async () => {
    try {
      await tokenContract.methods.transfer(transferTo, transferAmount).send({ from: accounts[0] });
      alert('Transfer successful');
      // Update balance after transfer
      const newBalance = await tokenContract.methods.balanceOf(accounts[0]).call();
      setBalance(newBalance);
    } catch (error) {
      console.error(error);
      alert('Transfer failed');
    }
  };

  // Mint tokens
  const mintTokens = async () => {
    try {
      await tokenContract.methods.mint(recipient, amount).send({ from: accounts[0] });
      alert('Minting successful');
      // Update balance after minting
      const newBalance = await tokenContract.methods.balanceOf(accounts[0]).call();
      setBalance(newBalance);
    } catch (error) {
      console.error(error);
      alert('Minting failed');
    }
  };

  // Burn tokens
  const burnTokens = async () => {
    try {
      await tokenContract.methods.burn(amount).send({ from: accounts[0] });
      alert('Burning successful');
      // Update balance after burning
      const newBalance = await tokenContract.methods.balanceOf(accounts[0]).call();
      setBalance(newBalance);
    } catch (error) {
      console.error(error);
      alert('Burning failed');
    }
  };

  // Stake tokens
  const stakeTokens = async () => {
    try {
      await tokenContract.methods.stake(amount).send({ from: accounts[0] });
      alert('Staking successful');
      // Update balance after staking
      const newBalance = await tokenContract.methods.balanceOf(accounts[0]).call();
      setBalance(newBalance);
    } catch (error) {
      console.error(error);
      alert('Staking failed');
    }
  };

  // Unstake tokens
  const unstakeTokens = async () => {
    try {
      await tokenContract.methods.unstake(amount).send({ from: accounts[0] });
      alert('Unstaking successful');
      // Update balance after unstaking
      const newBalance = await tokenContract.methods.balanceOf(accounts[0]).call();
      setBalance(newBalance);
    } catch (error) {
      console.error(error);
      alert('Unstaking failed');
    }
  };

  // Approve tokens
  const approveTokens = async () => {
    try {
      await tokenContract.methods.approve(spenderAddress, amount).send({ from: accounts[0] });
      alert('Approval successful');
    } catch (error) {
      console.error(error);
      alert('Approval failed');
    }
  };

  // Multisend tokens
  const multisendTokens = async (recipients, amounts) => {
    try {
      if (recipients.length !== amounts.length) {
        console.error('Number of recipients and amounts should match.');
        return;
      }

      // Iterate through each recipient and amount pair
      for (let i = 0; i < recipients.length; i++) {
        // Send tokens to each recipient
        await tokenContract.methods.transfer(recipients[i], amounts[i]).send({ from: accounts[0] });
      }

      // Refresh balance
      const newBalance = await tokenContract.methods.balanceOf(accounts[0]).call();
      setBalance(newBalance);
    } catch (error) {
      console.error('Error sending tokens:', error);
    }
  };

  // Pause contract
  const pauseContract = async () => {
    try {
      await tokenContract.methods.pause().send({ from: accounts[0] });
      alert('Contract paused');
    } catch (error) {
      console.error(error);
      alert('Failed to pause contract');
    }
  };

  // Unpause contract
  const unpauseContract = async () => {
    try {
      await tokenContract.methods.unpause().send({ from: accounts[0] });
      alert('Contract unpaused');
    } catch (error) {
      console.error(error);
      alert('Failed to unpause contract');
    }
  };
  // Connect to MetaMask
  const connectToMetaMask = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (provider) {
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        setAccounts(accounts);
      } else {
        console.error('MetaMask not detected');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Theodores Token</h1>
        <button className='connectButton' onClick={connectToMetaMask}>Connect to MetaMask</button>

        <p>Token Name: <span id="tokenName">{tokenName}</span></p>
        <p>Connected Account: <span id="connectedAccount">{accounts.length > 0 ? accounts[0] : 'Not connected'}</span></p>
        <p>Token Balance: <span id="tokenBalance">{web3 && balance && web3.utils.fromWei(balance, 'ether')}</span></p>
        <p>Total Supply: <span id="totalSupply">{web3 && totalSupply && web3.utils.fromWei(totalSupply, 'ether')}</span></p>
        <p>Decimals: 18<span id="decimals">{decimals}</span></p>
        <div className='column'>
          <h2>Transfer Tokens</h2>
          <div>
            <div>
              <input type="text" placeholder="Recipient Address" value={transferTo} onChange={(e) => setTransferTo(e.target.value)} /></div>
            <input type="number" placeholder="Amount" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} /></div>
          <button onClick={transferTokens}>Transfer</button>

          <h2>Mint Tokens</h2>
          <div>
            <div>
              <input type="text" placeholder="Recipient Address" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>
            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <button onClick={mintTokens}>Mint</button>

          <h2>Burn Tokens</h2>
          <div>
            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <button onClick={burnTokens}>Burn</button>

          <h2>Stake Tokens</h2>
          <div>
            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <button onClick={stakeTokens}>Stake</button>

          <h2>Unstake Tokens</h2>
          <div>
            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <button onClick={unstakeTokens}>Unstake</button>
        </div>
        <div className='columns'>
          <h2>Approve Tokens</h2>
          <div>
            <input type="text" placeholder="Spender Address" value={spenderAddress} onChange={(e) => setSpenderAddress(e.target.value)} />
            <div>
              <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          </div>
          <button onClick={approveTokens}>Approve</button>
          <div>
            <h2>Multi-send Tokens</h2>
            <h3>Recipient Addresses: </h3>
            <input
              type="text"
              placeholder="Recipient Addresses"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <h3>Amounts: </h3>
            <input
              type="text"
              placeholder="Amounts"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button className="button" onClick={() => {
            const recipientsArray = recipient.split(',').map(addr => addr.trim());
            const amountsArray = amount.split(',').map(amt => amt.trim());
            multisendTokens(recipientsArray, amountsArray);
          }}>Multi-send Tokens</button>

          <h2>Pause/Unpause Contract</h2>
          <button onClick={pauseContract}>Pause Contract</button>
          <button className="buttons" onClick={unpauseContract}>Unpause Contract</button>
        </div>
      </header>
    </div>
  );
}

export default App;
