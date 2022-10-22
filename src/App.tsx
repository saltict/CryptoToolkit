import React, {ChangeEventHandler, useState} from 'react';
import './App.css';
import {decodeAddress, isEthereumAddress} from "@polkadot/util-crypto";
import {u8aToHex} from "@polkadot/util";
import QRCode from 'react-qr-code';

function generateImportString(input: string, accountName?: string): string {
  const address = input.trim();
  try {
    if (isEthereumAddress(address)) {
      return `ethereum:${address}:${accountName || 'AccountName'}`;
    } else {
      const publicKey = u8aToHex(decodeAddress(address))
      return `substrate:${address}:${publicKey}:${accountName || 'AccountName'}`;
    }
  } catch (e) {
    return ''
  }
}

function App() {
  const [accountName, setAccountName] = useState('Account-001');
  const [inputAddress, setInputAddress] = useState('');
  const [importString, setImportString] = useState('');

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    setInputAddress(value);
    if (value && value !== '') {
      setImportString(generateImportString(value, accountName))
    } else {
      setImportString('');
    }
  }

  const onAccountChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setAccountName(e.target.value);
    const value = inputAddress;
    if (value && value !== '') {
      setImportString(generateImportString(value, accountName))
    } else {
      setImportString('');
    }
  }

  return (
    <div className="app-container">
      <div className="qr-import-generator">
        <div className="input-area">
          <label>Input Address</label>
          <input type="text" value={inputAddress} onChange={onInputChange}/>
          <label>Account Name</label>
          <input type="text" value={accountName} onChange={onAccountChange}/>
        </div>
        {importString !== '' && <div className="output-area">
            <label>Output</label>
            <textarea className="result" readOnly={true} value={importString}></textarea>
            <div className="qr-result">
                <QRCode
                    size={256}
                    style={{height: "auto", maxWidth: "100%", width: "100%"}}
                    value={importString}
                    viewBox={`0 0 256 256`}
                />
            </div>
        </div>}
      </div>
    </div>
  );
}

export default App;
