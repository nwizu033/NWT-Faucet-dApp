import {useState, useEffect} from "react";
import { ethers } from "ethers";
import faucet_ABI from "./faucet_ABI.json"
function App() {
const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractAddress = '0x887D8D4a6Ca171Df2741616392D4413214Cb1fd2';
const [account, setAccount] = useState();
const [address, setAddress] = useState();
const [transHash,setTransHash] = useState();

const connectWallet = async () => {
  const accounts = await provider.send("eth_requestAccounts", []);
  setAccount(accounts[0]);
}

const disconnectWallet = async () => {

  const accounts = await provider.send("eth_requestAccounts", []);
  setAccount(!accounts[0]);
}

const getTokens = async () => {
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, faucet_ABI, signer);
  const getFaucet = await contract.getFaucet(address);
  await getFaucet.wait();
  setTransHash(getFaucet.hash);
  // console.log(getFaucet.hash);
  alert("done");

}

  return (
    <>
      <div className="container">
          <header>
            <h2>NWT Faucet</h2>
            {!account ?  <button onClick={connectWallet}>Connect Wallet</button> :
            <button onClick={disconnectWallet}>Connected: {account}</button>}
          </header>

          <div className="request-body">
              <input type="text" placeholder="Enter Your wallet Address" onChange={(e)=>{setAddress(e.target.value)}}/>
              <button onClick={getTokens}>Get Tokens</button>
              <div className="transaction-details">Transaction Details</div>
              <p>transaction hash: {transHash}</p>

          </div>

      </div>
    </>
  );
}

export default App;
