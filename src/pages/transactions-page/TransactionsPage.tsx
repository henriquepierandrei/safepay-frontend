import React from 'react'
import GlobeComponent from '../../components/transactions-components/Globe'

function TransactionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-emerald-950 to-black">
      <GlobeComponent transactions={[
        { lat: 37.7749, lng: -122.4194 }, // San Francisco
        { lat: -21.203786, lng: -42.865677 },  // Rodeiro
        { lat: -22.203786, lng: -43.865677 },  // Rodeiro

        { lat: 51.5074, lng: -0.1278 },    // Londres
        { lat: 35.6895, lng: 139.6917 },   // Tóquio
      ]} />

    </div>
  )
}

export default TransactionsPage
