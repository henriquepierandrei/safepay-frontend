import React from 'react'
import GlobeComponent from '../../components/transactions-components/Globe'
import Navbar from '../../components/navbar-components/NavBar'

function TransactionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-emerald-950 to-black">
      <Navbar />
      <GlobeComponent transactions={[
        { lat: 37.7749, lng: -122.4194, cardBrand: 'Visa', ipAddress: '192.168.1.1' }, // San Francisco
        { lat: -21.203786, lng: -42.865677, cardBrand: 'Mastercard', ipAddress: '192.168.1.2' },  // Rodeiro
        { lat: -22.203786, lng: -43.865677, cardBrand: 'Elo', ipAddress: '192.168.1.3' },  // Rodeiro

        { lat: 51.5074, lng: -0.1278, cardBrand: 'Visa', ipAddress: '192.168.1.4' },    // Londres
        { lat: 35.6895, lng: 139.6917, cardBrand: 'Mastercard', ipAddress: '192.168.1.5' },   // Tóquio
      ]} />

    </div>
  )
}

export default TransactionsPage
