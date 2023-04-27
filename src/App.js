import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Web3 from "web3";
import { ABI } from "./abi";
import { useEffect, useState } from "react";
import axios from "axios";

const bscEndPoint = process.env.REACT_APP_BSC_TEST_ESCAN_END_POINT;
const ADDRESS = process.env.REACT_APP_CON_ADDRESS;
const BSCAPIKEY = process.env.REACT_APP_BSC_TEST_API_KEY;

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

// async function maxAmount() {}

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
  const [balance, setBalance] = useState(0);
  const [nftData, setNftData] = useState([]);
  let nftDataList = [
    { id: 0, to: 0 },
    { id: 1, to: 1 },
    { id: 2, to: 2 },
    { id: 3, to: 3 },
  ];

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(
        bscEndPoint +
          `?module=stats&action=tokensupply&contractaddress=${ADDRESS}&apikey=${BSCAPIKEY}`
      )
      .then((res) => setBalance(res.data.result))
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("Cancelled!");
        } else {
          //todo:errorHandling
        }
      });

    return () => {
      controller.abort();
    };
  }, [balance]);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(
        bscEndPoint +
          `?module=account&action=tokennfttx&contractaddress=${ADDRESS}&page=1&offset=100&tag=latest&apikey=${BSCAPIKEY}`
      )
      .then((res) => {
        for (let i = 0; i < res.data.result.length; i++) {
          nftDataList[i].id = res.data.result[i].tokenID;
          nftDataList[i].to = res.data.result[i].to;
        }
      })
      .then(() => {
        setNftData(nftDataList);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("Cancelled!");
        } else {
          //todo:errorHandling
        }
      });

    return () => {
      controller.abort();
    };
  }, [setNftData]); // ask about dependency array

  console.log(nftData);

  return (
    <div className="App">
      <div className="container">
        <div className="row justify-content-center">
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
              <h5>Price: 0.01 ETH per NFT.</h5>
              <h5>NFTs minted in the collection so far: {balance} out of 4</h5>
            </div>
          </form>
          <div className="row items mt-3 mb-3 justify-content-center">
            {nftData.map((item, id) => {
              return (
                <div
                  key={`exo_${id}`}
                  className="col-12 col-sm-6 col-lg-3 item"
                >
                  <div className="card">
                    <div className="image-over">
                      <img className="card-img-top" src={item.to} alt="" />
                    </div>
                    <div className="card-caption col-12 p-0">
                      <div className="card-body">
                        <h5 className="mb-0">
                          {id}#{item.to}
                        </h5>
                        <div className="card-bottom d-flex justify-content-center">
                          <Button className="btn btn-bordered-white btn-smaller mt-3">
                            <i className="mr-2" />
                            Buy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
