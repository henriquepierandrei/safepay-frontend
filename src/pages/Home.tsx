import Navbar from '../components/navbar-components/NavBar'
import HeroSection from '../components/home-components/HeroSection'
import FeatureCards from '../components/home-components/FeatureCards';
import Logo from '../assets/logo.png';
import GlobeComponent from '../components/transactions-components/Globe';

function Home() {
  const handlePrimaryClick = () => {
    console.log('Get Started clicked');
    // Add your navigation or action here
  };

  const transactions = [
    { lat: 37.7749, lng: -122.4194 }, // San Francisco
    { lat: -23.5505, lng: -46.6333 },  // São Paulo
    { lat: 51.5074, lng: -0.1278 },    // Londres
    { lat: 35.6895, lng: 139.6917 },   // Tóquio
  ]

  const handleSecondaryClick = () => {
    console.log('Learn More clicked');
    // Add your navigation or action here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-emerald-950 to-black">
      {/* Navbar */}
      <Navbar logoSrc={Logo}/>

      

      {/* Hero Section */}
      <HeroSection 
        title="Simulação sistema antifraude"
        subtitle=" para Cartões de Crédito"
        description="Entenda através desse projeto como grandes empresas constroem sistemas de detecção de fraudes em tempo real utilizando técnicas de Análise de dados e Machine Learning."
        primaryButtonText="Testar Agora"
        secondaryButtonText="Documentação"
        onPrimaryClick={handlePrimaryClick}
        onSecondaryClick={handleSecondaryClick}
      />

      {/* Feature Cards */}
      <FeatureCards />
    </div>
  )
}

export default Home
