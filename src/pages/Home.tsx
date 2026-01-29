import Navbar from '../components/navbar-components/NavBar';
import HeroSection from '../components/home-components/HeroSection';
import FeatureCards from '../components/home-components/FeatureCards';
import HowItWorks from '../components/home-components/HowItWorks';
import TechStack from '../components/home-components/TechStack';
import CTASection from '../components/home-components/CTASection';
import Footer from '../components/home-components/Footer';
import Logo from '../assets/logo.png';

function Home() {
  const handlePrimaryClick = () => {
    console.log('Get Started clicked');
    // Add your navigation or action here
  };

  const transactions = [
    { lat: 37.7749, lng: -122.4194 }, // San Francisco
    { lat: -23.5505, lng: -46.6333 }, // São Paulo
    { lat: 51.5074, lng: -0.1278 },   // Londres
    { lat: 35.6895, lng: 139.6917 },  // Tóquio
  ];

  const handleSecondaryClick = () => {
    console.log('Learn More clicked');
    // Add your navigation or action here
  };

  const handleDocumentation = () => {
    console.log('Documentation clicked');
    // Navigate to documentation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#09140e] to-black">
      {/* Navbar */}
      <Navbar logoSrc={Logo} />

      {/* Hero Section */}
      <HeroSection
        title="Simulação antifraude"
        subtitle="para Cartões de Crédito"
        description="Entenda através desse projeto como grandes empresas constroem sistemas de detecção de fraudes em tempo real utilizando técnicas de Análise de dados e Machine Learning."
        primaryButtonText="Testar Agora"
        secondaryButtonText="Documentação"
        onPrimaryClick={handlePrimaryClick}
        onSecondaryClick={handleSecondaryClick}
      />


      {/* Feature Cards */}
      <FeatureCards />

      {/* How It Works */}
      <HowItWorks />

      {/* Tech Stack */}
      <TechStack />


      {/* CTA Section */}
      <CTASection
        onPrimaryClick={handlePrimaryClick}
        onSecondaryClick={handleDocumentation}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;