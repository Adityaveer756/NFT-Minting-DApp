import { useEffect, useState, useRef } from "react";
import "./App.css";
import contract from "./NFT.json";
import { ethers } from "ethers";
import background from "./utils/CBHome.png";
import background1 from "./utils/cyberbot1.svg";
import background2 from "./utils/cyberbot11.svg";

const contractAddress = "0xf44bB76929ddD7869347A0198F7F79BCABD19327";
const abi = contract.abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [mintState, setMintState] = useState(true);
  const [showOwnersPage, setOwnersPage] = useState();
  const [NFTContract, setContract] = useState(null);
  const [buttonText,setButtonText] = useState();
  const [error,setError] = useState(null)
  const input1 = useRef();
  const input2 = useRef();
  const input3 = useRef();
  const accounts = useRef(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists!");
    
    }

    if(accounts.current===null){
      accounts.current = await ethereum.request({ method: "eth_accounts" });
    }
    

    if (accounts.current.length !== 0) {
      const account = accounts.current[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
      console.log(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
      console.log(currentAccount);
 
    } catch (err) {
      console.log(err);
    }
  };

  const getContract = async() =>{
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(contractAddress, abi, signer);
      console.log(nftContract)
      setContract(nftContract);
      const state = await nftContract.publicMintEnabled();
      console.log(state)
      setMintState(state);
      
    
    } else {
      console.log("Please install metamask!");
    }
  } 

  window.ethereum.on("accountsChanged", function () {
    console.log("accounts changed");
    window.location.reload();
  });

  const mintNft = async () => {
    try {
      setMintState(await NFTContract.publicMintEnabled());
      console.log(NFTContract);
      console.log("Initialize payment");
     
      const quantity = input2.current.value;
      const price = quantity * 0.001
      let nftTxn = await NFTContract.mint(quantity, {
        value: ethers.utils.parseEther(price.toString()),
      });

      console.log("Mining... please wait");
      await nftTxn.wait();

      console.log(
        `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
      );
      
    } catch (err) {
      console.log(err.message);
      if(err.message.toUpperCase()!=="METAMASK TX SIGNATURE: USER DENIED TRANSACTION SIGNATURE."){
        setError(err.message.toUpperCase());
      }
      
    }
  };

  const changeMintState = async() => {
    console.log(NFTContract);
    console.log(mintState);
    if( mintState){
      const txn1 = await NFTContract.setPublicMintEnabled(false);
      await txn1.wait();
      console.log("txn1 done");
      setMintState(false);
    }else{
      
      const txn2 = await NFTContract.setPublicMintEnabled(true);
      await txn2.wait();
      setError(null);
      console.log("txn2 done")
      setMintState(true);
    }
  }

  const withdrawAmount = async() => {
    await NFTContract.withdraw();
  }

  const changeOwner = async() => {
    const address = input1.current.value;
    await NFTContract.transferOwnership(address);
  }

  const changeMintLimit = async() => {
    const limit = input3.current.value;
    console.log(NFTContract);
    await NFTContract.changeMintLimit(limit);
  }
  
  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWallet}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };

 
  const mintNftButton = () => {
    return (
      <div>
        <input type="number" className="input2" min="1" placeholder="Quantity" ref={input2}></input><br/> 
        <button onClick={mintNft} className="cta-button mint-nft-button">
          MINT NFT
        </button>
      </div>
   
    );
  };

  useEffect( () => {
    checkWalletIsConnected();
    getContract();
    console.log("called");
  }, []);

  useEffect(() => {
    setButtonText(mintState?"DISABLE MINT":"ENABLE MINT");
  },[mintState]);

  useEffect(() => {
    console.log(currentAccount);
    console.log(NFTContract);
    if(NFTContract!==null){

        NFTContract.owner().then((result) => {
          console.log(result)
          console.log(currentAccount)
        if (currentAccount === result.toLowerCase()) {
          setOwnersPage(true);
          console.log("owner true");
        } else {
          setOwnersPage(false);
          console.log("owner false");
        }
      });
    }
 
  }, [currentAccount]);

  return (
    <div className="main-app">
      <h1
        style={{
          "font-size": "50px",
          color: "#EEEEFF",
          "font-family": "Orbitron, sans-serif",
        }}
      >
        CYBER BOTS
      </h1>

      {showOwnersPage ? (
        <div>
          <div className="row">
            <div className="column">
              <img src={background1}  style={{width:"100%"}}/>
            </div>
            <div className="column">
             
              <button onClick={changeMintState} className="cta-button mint-nft-button1">{buttonText}</button>&emsp;&emsp;
              <button onClick={withdrawAmount} className="cta-button mint-nft-button1">WITHDRAW AMOUNT</button>&emsp;&emsp;<br/>
              <input className="input1" ref={input1} placeholder="Account Address"></input>&emsp;&emsp;<br/>
              <button onClick={changeOwner} className="cta-button mint-nft-button1">CHANGE OWNER</button>&emsp;&emsp;<br/>
              <input type="number" className="input2" min="1" max="10" placeholder="Limit" ref={input3}></input>&emsp;&emsp;<br/>
              <button onClick={changeMintLimit} className="cta-button mint-nft-button1">CHANGE MINT LIMIT</button>&emsp;&emsp;<br/>
              <input type="number" className="input2" min="1" placeholder="Quantity" ref={input2}></input>&emsp;&emsp;<br/>
              <button onClick={mintNft} className="cta-button mint-nft-button1 a">MINT NFT</button>&emsp;&emsp;
              {(error == null) ? <p></p> : <p className="mintState1">{error}</p>} &emsp;&emsp;
              <h5 className="contractAddress">SMART CONTRACT ADDRESS:</h5>
              <p className="contractAddress1">{contractAddress}</p>
            </div>
            <div className="column">
              <img src={background2} style={{width:"100%"}}/>
            </div>
          </div>
  
        </div>
      ) : (
        <div>
          <img src={background} height="100%" width="100%" /> &emsp;&emsp;
          <div>
            {currentAccount ? mintNftButton() : connectWalletButton()}
            {(error == null) ? <p></p> : <p className="mintState">{error}</p>}
            <h5 className="contractAddress">SMART CONTRACT ADDRESS:</h5>
            <p className="contractAddress1">{contractAddress}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
