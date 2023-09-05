import React, { useState } from 'react';
import axios from 'axios'
import './App.css'

const TopSalesTracker = () => {
  const [excludeDex, setExcludeDex] = useState('true');
  const [blockchain, setBlockchain] = useState('eth-main');
  const [timeframe, setTimeframe] = useState('1_DAY');
  const [sales, setSales] = useState([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasClicked, setHasClicked] = useState(false)

  const getSales = async () => {
    setHasClicked(true)
    setSales([])
    setLoading(true)
    const url = `https://api.blockspan.com/v1/nfts/topnfts/?chain=${blockchain}&timeframe=${timeframe}&exclude_dex=${excludeDex}&include_nft_details=true`;
    const headers = {
      accept: 'application/json',
      'X-API-KEY': 'YOUR_BLOCKSPAN_API_KEY',
    };

    try {
      const response = await axios.get(url, { headers });
      setSales(response.data.results)
      setError(null);
      setLoading(false)
    } catch (error) {
      console.error(error);
      error.response.status === 401 ?
        setError('Invalid blockspan API key!') :
        setError('No sales found over this timeframe.');
      setSales([]);
      setLoading(false)
    }
  };

  const checkData = (data) => {
    if (data === null) {
        return 'N/A'
    } 
    return data
  }

  return (
    <div>
      <h1 className="title">Top Sales Tracker</h1>
      <p className="message">
          Select a blockchain and timeframe to see most expensive transactions on that chain.
      </p>
      <div className="inputContainer">
        <select name="blockchain"
          value={blockchain}
          onChange={e => setBlockchain(e.target.value)}>
          <option value="eth-main">eth-main</option>
          <option value="arbitrum-main">arbitrum-main</option>
          <option value="optimism-main">optimism-main</option>
          <option value="poly-main">poly-main</option>
          <option value="bsc-main">bsc-main</option>
          <option value="eth-goerli">eth-goerli</option>
        </select>
        <select name="timeframe"
          value={timeframe}
          onChange={e => setTimeframe(e.target.value)}>
          <option value="1_DAY">One Day</option>
          <option value="7_DAYS">Seven Days</option>
          <option value="30_DAYS">Thirty Days</option>
        </select>
        <select name="excludeDex"
          value={excludeDex}
          onChange={e => setExcludeDex(e.target.value)}>
          <option value="false">Include DEX Contracts</option>
          <option value="true">Exclude DEX Contracts</option>
        </select>
        <button onClick={getSales}>Find Top Sales</button>
      </div>
      {loading && (
        <p className='message'>Loading...</p>
      )}
      {error && !loading && (
        <p className='errorMessage'>{error}</p>
      )}
      {sales.length > 0 ? (
        <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Top Sale:{' '}
          {sales[0].transfer_type} for ${parseFloat(sales[0].price_usd).toFixed(2)}{' '}
          ({parseFloat(sales[0].price_native).toFixed(2)} {sales[0].price_currency})
        </p>
      ) : !error && hasClicked && !loading && sales.length === 0 && (
        <p className='message'>No sales data found!</p>
      )}
      {sales.length > 0 && (
        <div>
          <table className='tableContainer'>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>Number</th>
                <th>Price USD</th>
                <th>Price Native</th>
                <th>Contract Address</th>
                <th>Token ID</th>
                <th>Block Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => ( 
                <tr style={{ backgroundColor: '#f2f2f2' }} key={index}>
                  <td>{index + 1}</td>
                  <td>{checkData(parseFloat(sale.price_usd).toFixed(2))}</td>
                  <td>{checkData(parseFloat(sale.price_native).toFixed(2))}</td>
                  <td>{checkData(sale.contract_address)}</td>
                  <td>{checkData(sale.id)}</td>
                  <td>{checkData(sale.block_timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TopSalesTracker;
