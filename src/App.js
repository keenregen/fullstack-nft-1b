import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

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
            <Button style={{ marginBottom: "7px" }}>Connect Wallet</Button>
            <div
              className="card"
              id="wallet-address"
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
              <label htmlFor="floatingInput">Wallet Address</label>
              <label>Select the amount of NFTs to mint (min:1, max:3)</label>
              <input
                type="number"
                name="amount"
                defaultValue="1"
                min="1"
                max="3"
              />
              <Button style={{ marginTop: "3px", marginBottom: "3px" }}>
                Mint/Buy
              </Button>
              <label>Price: 0.001 ETH per NFT.</label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
