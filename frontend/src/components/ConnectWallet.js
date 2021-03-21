import React from "react";

import { NetworkErrorMessage } from "./NetworkErrorMessage";

export function ConnectWallet({ connectWallet, networkError, dismiss }) {
  return (
    <div className="" style={{ 
      backgroundImage: "url(./background.png)",
      backgroundRepeat  : 'no-repeat',
      backgroundSize: 'cover',
      fontFamily: "Bungee"
    }} >

      <div className="row justify-content-md-center">
        <div className="col-12 text-center">
          {/* Metamask network should be set to Localhost:8545. */}
          {networkError && (
            <NetworkErrorMessage 
              message={networkError} 
              dismiss={dismiss} 
            />
          )}
        </div>

        <div className="col-6 p-4 text-center">
          
          <p></p>
          <p>Please connect to your wallet.</p>
          <button
            className="btn btn-success"
            type="button"
            onClick={connectWallet}
          >
            Connect Wallet
          </button> 
          <span> </span>
          <img src="../mm-logo.svg" />
          <hr />
          <img src="../logo_256x256.png" />
          <h2>Decentreelized</h2>
        </div>
      </div>
    </div>
  );
}
