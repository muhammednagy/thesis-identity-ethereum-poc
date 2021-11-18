import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import ethereumPassportContract from '../build/contracts/EthPassport.json'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      Id: null,
      FN: null,
      LN: null,
      ID: null,
      BD: null,
      citizenship: null,
      CountryOfBirth: null,
      web3: null,
      contract: null,
      account: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch((e) => {
      console.log(e)
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
    const contract = require('truffle-contract')
    const ethereumPassport = contract(ethereumPassportContract)
    ethereumPassport.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on ethereumPassport.
    let ethereumPassportInstance;
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      ethereumPassport.deployed().then((instance) => {
        ethereumPassportInstance = instance
        // return ethereumPassportInstance.set(10, {from: accounts[0]})
      // }).then((result) => {
        // Get the value from the contract to prove it worked.
        this.setState({contract: ethereumPassportInstance, account: accounts[0]} )
        // ethereumPassportInstance.enroll("Nagy", "salem","01/07/2000","Egyptian","Egypt",{ from: accounts[0] })
        console.log(accounts)
        return ethereumPassportInstance.isSet({ from: accounts[0] })
      }).then((result) => {
        window.weird_Stuff = ethereumPassportInstance
        console.log(result)
        if (result) {
          // Update state with the result.
          return ethereumPassportInstance.myPassport({ from: accounts[0] })
              .then((result) => {
                return this.setState({Id: result[0].toNumber(), FN: result[1], LN: result[2], BD: result[3], citizenship: result[4], CountryOfBirth: result[5]})
              })
        }
      })
    })
  }


  enable(event) {
    //Will Start the metamask extension
    this.state.web3.currentProvider.request({ method: 'eth_requestAccounts' }).then(result => {
      this.instantiateContract()
    })
    console.log("done")
  }

  update(event) {
    const contract = this.state.contract
    const account = this.state.account

    var FN = document.getElementById('FN').value
    var LN = document.getElementById('LN').value
    var BD = document.getElementById('BD').value
    var citizenship = document.getElementById('citizenship').value
    var CountryOfBirth = document.getElementById('CountryOfBirth').value

    if (this.state.FN != null) {
      console.log("test1")
      contract.update(FN, LN, BD, citizenship, CountryOfBirth,{ from: account })
      .then(result => {
        return contract.myPassport.call({ from: account })
      }).then(result => {
        return this.setState({FN: result[1], LN: result[2], BD: result[3], citizenship: result[4], CountryOfBirth: result[5]})
      })
    } else {
      console.log("tes!")
      contract.enroll(FN, LN, BD, citizenship, CountryOfBirth,{ from: account })
      .then(result => {
        console.log(result)
        return contract.myPassport.call({ from: account })
      }).then(result => {
        console.log(result)
        window.weird = result[0]
        return this.setState({Id: result[0].toNumber(), FN: result[1], LN: result[2], BD: result[3], citizenship: result[4], CountryOfBirth: result[5]})
      })

    }
  }

  auth(event) {
    const contract = this.state.contract
    const account = this.state.account


    const FN = document.getElementById('FNAuth').value;
    const LN = document.getElementById('LNAuth').value;
    const Id = document.getElementById('Id').value;


    if (this.state.FN != null) {
      contract.auth(account, Id, FN, LN,{ from: account })
      .then(result => {
        return alert("You are authenticated")
      })
    } else {
      alert("Please add your data first")
    }
  }
  render() {
    return (
      <div className="App">
      <nav className="navbar pure-menu pure-menu-horizontal">
      <a href="#" className="pure-menu-heading pure-menu-link">Ethereum Passport</a>
      </nav>
      <main className="container">
      <div className="pure-g">
      <div className="pure-u-1-1">
        <h1>Please notice that this is a proof of concept made by a backend engineer/DevOps enginner so the design is not one of my best skills </h1>
        <button onClick={this.enable.bind(this)}>Enable ethereum</button>
        <h1>Here is your info</h1>
      <p>Your first name is: {this.state.FN}</p>
      <p>Your ID is: {this.state.Id}</p>
      <p>Your Last name is: {this.state.LN}</p>
      <p>Your Birthday  is: {this.state.BD}</p>
      <p>Your citizenship  is: {this.state.citizenship}</p>
      <p>Your Country of birth  is: {this.state.CountryOfBirth}</p>
      <p>First name: <input type="text" name="FN" id="FN"></input></p>
      <p>Last name: <input type="text" name="LN" id="LN"></input></p>
      <p>Birth day: <input type="text" name="BD" id="BD"></input></p>
      <p>citizenship: <input type="text" name="citizenship" id="citizenship"></input></p>
      <p>Country of birth: <input type="text" name="CountryOfBirth" id="CountryOfBirth"></input></p>
      <br></br>
      <button onClick={this.update.bind(this)}>Change/Enroll</button>
      <br></br>
      <p>Other websites which  is wanting to authenticate a  user can do so by making auth function call and passinng the required paramters ID, Firstname and Lastname   in  this order</p>
      <p>Required data to authenticate</p>
      <p>First name: <input type="text" name="FN" id="FNAuth"></input></p>
      <p>Last name: <input type="text" name="LN" id="LNAuth"></input></p>
      <p>ID: <input type="text" name="ID" id="Id"></input></p>
      <button onClick={this.auth.bind(this)}>Auth</button>


      </div>
      </div>
      </main>

      </div>
      );
  }
}

export default App
