import {useState} from "react";
import { ethers } from "ethers";
import faucet_ABI from "./faucet_ABI.json"
import '../src/app.css'
function App() {
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractAddress = '0x887D8D4a6Ca171Df2741616392D4413214Cb1fd2';
const [account, setAccount] = useState();
const [address, setAddress] = useState('');
const [transHash,setTransHash] = useState();
const [error, setError] = useState();
const shortenAddress = (address) => `${address.slice(0, 3)}...${address.slice(address.length - 4)}`

const connectWallet = async () => {
  const accounts = await provider.send("eth_requestAccounts", []);
  setAccount(accounts[0]);
}

const disconnectWallet = async () => {

  const accounts = await provider.send("eth_requestAccounts", []);
  setAccount(!accounts[0]);
}

const getTokens = async () => {
  try{
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, faucet_ABI, signer);
    if(address!=='') {
      const getFaucet = await contract.getFaucet(address);
      await getFaucet.wait();
      setTransHash(getFaucet.hash);
    }
    else{
      setError('Enter a valid eth address');
    }
    
  } catch (err) {
   setError("To be fair to all developers, we give out tokens every one hour");
   setTransHash("null")
   setTimeout(() => {
    window.location.reload(false);
  }, 2000);
  }
}



  return (
    <>
      <div className="container">
          <header>
            <h2><span>NWTFaucet</span></h2>
            {!account ?  <button onClick={connectWallet}>Connect Wallet</button> :
            <button onClick={disconnectWallet}>Connected: {shortenAddress(account)}</button>}
          </header>

          <div className="request-body">
              <h1><span>Welcome To Nwizu Token Faucets</span></h1>
              <p>You can get 100NWT every hour</p>
              <div className="details">
                  <input type="text" placeholder="Enter Your wallet Address" onChange={(e)=>{setAddress(e.target.value)}}/>
                  <button onClick={getTokens}>Get Tokens</button>
                  <div className="transaction-details">Transaction Details</div>
                  <p className="txn-hash">transaction hash: {transHash}</p>
                  {(error==='')? <p></p> : <p className="red">{error}</p>}  
                  
                 
                 
              </div>

          </div>

      </div>
    </>
  );
}

export default App;
