import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Web3 from "web3";
import { ABI } from "./abi";
import { ADDRESS } from "./address";

var account;
var contract;

async function connectWallet() {
  try {
    if (window.ethereum) {
      var web3 = new Web3(window.ethereum);
      await window.ethereum.send("eth_requestAccounts");
      var accounts = await web3.eth.getAccounts();
      account = accounts[0];
      document.getElementById("wallet-address").textContent =
        "Connected Wallet: " + account.slice(0, 5) + "..." + account.slice(-4);
      document.getElementById("connect-button").textContent = "Connected";
      contract = new web3.eth.Contract(ABI, ADDRESS);
    }
  } catch (err) {
    console.log(err);
  }
}

async function mint() {
  try {
    if (window.ethereum) {
      var _mintAmount = Number(document.querySelector("[name=amount]").value);
      var mintRate = Number(await contract.methods.cost().call());
      var totalAmount = mintRate * _mintAmount;
      if (String(await contract.methods.owner().call()) === String(account)) {
        await contract.methods
          .mint(account, _mintAmount)
          .send({ from: account });
      } else {
        await contract.methods
          .mint(account, _mintAmount)
          .send({ from: account, value: String(totalAmount) });
      }
    }
  } catch (err) {
    console.log(err);
  }
}

function App() {
  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <form
            className="col-lg-5"
            style={{
              marginTop: "13px",
              paddingRight: "15px",
              paddingLeft: "15px",
              paddingTop: "11px",
              paddingBottom: "20px",
              borderRadius: "33px",
              boxShadow: "1px 1px 10px",
            }}
          >
            <h4>Mint Portal</h4>
            <h5>Use The Button To Connect Your Wallet</h5>
            <Button
              id="connect-button"
              onClick={connectWallet}
              style={{ marginBottom: "7px" }}
            >
              Connect Wallet
            </Button>
            <div
              className="card"
              style={{
                marginTop: "1px",
                paddingRight: "7px",
                paddingLeft: "7px",
                paddingTop: "7x",
                paddingBottom: "7px",
                borderRadius: "15px",
                boxShadow: "1px 1px 10px",
              }}
            >
              <h5 id="wallet-address" style={{ marginTop: "10px" }}>
                Wallet Address
              </h5>
            </div>
            <div
              className="card"
              id="mint-card"
              style={{
                marginTop: "7px",
                paddingRight: "7px",
                paddingLeft: "7px",
                paddingTop: "7x",
                paddingBottom: "7px",
                borderRadius: "15px",
                boxShadow: "1px 1px 10px",
              }}
            >
              <h5 style={{ marginTop: "5px" }}>
                Enter the amount of NFTs to mint
                <br />
                (min:1, max:3)
              </h5>
              <input
                style={{
                  marginTop: "3px",
                  fontSize: "20px",
                  textAlign: "center",
                }}
                type="number"
                name="amount"
                defaultValue="1"
                min="1"
                max="3"
              />
              <Button
                onClick={mint}
                style={{ marginTop: "5px", marginBottom: "3px" }}
              >
                Mint/Buy
              </Button>
              <h5>Price: 0.00001 ETH per NFT.</h5>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
