import Navbar from '../components/navbar-components/NavBar'
import HeroSection from '../components/home-components/HeroSection'
import FeatureCards from '../components/home-components/FeatureCards';
import Logo from '../assets/logo.png';

function Home() {
  const handlePrimaryClick = () => {
    console.log('Get Started clicked');
    // Add your navigation or action here
  };

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
        title="Simulação na prática"
        subtitle="sistema antifraude para Cartões de Crédito"
        description="Entenda através desse projeto como grandes empresas constroem sistemas de detecção de fraudes em tempo real utilizando técnicas de Análise de dados e Machine Learning."
        primaryButtonText="Get Started"
        secondaryButtonText="Learn More"
        onPrimaryClick={handlePrimaryClick}
        onSecondaryClick={handleSecondaryClick}
      />

      {/* Feature Cards */}
      <FeatureCards />
    </div>
  )
}

export default Home
