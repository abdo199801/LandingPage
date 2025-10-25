// src/app/page.js
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Linkedin, Instagram, Menu, X } from 'lucide-react';
// ou selon la bibliothèque d'icônes que vous utilisez
import { 
  Play, 
  Users, 
  Award, 
  Clock, 
  MapPin,
  Phone,
  Mail,
  Calendar,
  Send,
  ArrowRight,
  CheckCircle,
  Star,
  Download,
  Video,
  BookOpen,
  Globe,
  Headphones,
  Zap,
  Shield,
  TrendingUp,
  MessageCircle
} from 'lucide-react';

export default function Home() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    niveau: '',
    message: '',
    horsHeures: false,
    consentement: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // Déclaration du compteur
  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          return { ...prev, seconds: seconds - 1 };
        } else if (minutes > 0) {
          return { ...prev, minutes: minutes - 1, seconds: 59 };
        } else if (hours > 0) {
          return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
        } else if (days > 0) {
          return { ...prev, days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking on a link
  const handleMobileNavClick = (sectionId) => {
    scrollToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  // Regex patterns
  const patterns = {
    nom: /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,60}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    telephone: /^(\+?\d{1,3}[ -]?)?[0-9]{8,15}$/
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'nom':
        if (!value.trim()) {
          error = 'Le nom complet est requis';
        } else if (!patterns.nom.test(value)) {
          error = 'Le nom doit contenir entre 2 et 60 caractères alphabétiques';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'L\'email est requis';
        } else if (!patterns.email.test(value)) {
          error = 'Format d\'email invalide';
        }
        break;

      case 'telephone':
        if (!value.trim()) {
          error = 'Le téléphone est requis';
        } else if (!patterns.telephone.test(value)) {
          error = 'Format de téléphone invalide';
        }
        break;

      case 'niveau':
        if (!value) {
          error = 'Le niveau scolaire est requis';
        }
        break;

      case 'message':
        if (!value.trim()) {
          error = 'Le message est requis';
        } else if (value.length < 20) {
          error = 'Le message doit contenir au moins 20 caractères';
        } else if (value.length > 2000) {
          error = 'Le message ne doit pas dépasser 2000 caractères';
        }
        break;

      case 'consentement':
        if (!value) {
          error = 'Vous devez accepter le traitement de vos données';
        }
        break;
    }

    return error;
  };

  const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  const fieldValue = type === 'checkbox' ? checked : value;

  setFormData(prev => ({
    ...prev,
    [name]: fieldValue
  }));

  // Clear error when user starts typing
  if (errors[name]) {
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  }
};

const validateForm = () => {
  const newErrors = {};

  Object.keys(formData).forEach(key => {
    const error = validateField(key, formData[key]);
    if (error) {
      newErrors[key] = error;
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  console.log('🔄 Début de la soumission du formulaire');
  console.log('📝 Données du formulaire:', formData);
  
  if (!validateForm()) {
    console.log('❌ Validation du formulaire échouée');
    return;
  }

  setIsSubmitting(true);
  
  try {
    // 1. Envoi vers Google Apps Script (optionnel - gardé pour compatibilité)
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbyV35BkjharOEU_KNEuFPNAcP8sAJ2rJcvnuU2mNJkEACqF3EMaFXNsjlVw2b69igSV/exec';
    
    const submissionData = {
      nom: formData.nom,
      email: formData.email,
      telephone: formData.telephone,
      niveau: formData.niveau,
      message: formData.message,
      horsHeures: formData.horsHeures,
      consentement: formData.consentement,
      date: new Date().toISOString(),
    };
    
    console.log('📤 Données à envoyer:', submissionData);
    
    // Envoi vers Google Sheets (mode no-cors)
    fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    }).then(() => {
      console.log('✅ Données envoyées à Google Sheets');
    }).catch(err => {
      console.error('❌ Erreur Google Sheets:', err);
    });

    // 2. Envoi des emails via notre API (PRINCIPAL)
    console.log('📨 Envoi des emails...');
    const emailResponse = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        niveau: formData.niveau,
        message: formData.message,
        horsHeures: formData.horsHeures,
        date: new Date().toISOString(),
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      throw new Error(emailResult.error || 'Erreur lors de l\'envoi des emails');
    }

    console.log('✅ Emails envoyés avec succès:', emailResult);

    // 3. Simuler un succès pour Google Sheets (puisque nous ne pouvons pas lire la réponse en no-cors)
    setSubmitStatus('success');
    setFormData({
      nom: '',
      email: '',
      telephone: '',
      niveau: '',
      message: '',
      horsHeures: false,
      consentement: false
    });
    setErrors({});
    
    console.log('✅ Formulaire traité avec succès');
    
  } catch (error) {
    console.error('❌ Erreur complète:', error);
    setSubmitStatus('error');
  } finally {
    setIsSubmitting(false);
    setTimeout(() => setSubmitStatus(null), 5000);
  }
};
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fonction pour ouvrir WhatsApp
  const openWhatsApp = () => {
    const phoneNumber = "+212767768606";
    const message = "Bonjour, je suis intéressé(e) par la formation Polaris.K et je souhaite obtenir plus d'informations.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const benefits = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: '100% à distance',
      description: 'Suivez la formation depuis n\'importe où au Maroc ou à l\'étranger'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Apprentissage actif',
      description: 'Études de cas, simulations, QCM et forums interactifs'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Certification reconnue',
      description: 'Diplôme valorisant dans les secteurs public et privé'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Horaires flexibles',
      description: 'Sessions en direct + replays disponibles 24h/24'
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: 'Encadrement personnalisé',
      description: 'Suivi individuel par nos formateurs experts'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Accès immédiat',
      description: 'Démarrage rapide avec des résultats concrets'
    }
  ];

  const program = [
    {
      week: "Semaines 1 & 2",
      title: "Fondamentaux du Contrôle de Gestion & GRH",
      topics: ["Pratique du contrôle de gestion", "Gestion des ressources humaines", "Tableaux de bord stratégiques"]
    },
    {
      week: "Semaine 3",
      title: "Stratégie et Analyse Financière",
      topics: ["Diagnostic stratégique et financier", "Ingénierie financière", "Marketing approfondi"]
    },
    {
      week: "Semaine 4",
      title: "Audit et Développement d'Entreprise",
      topics: ["Audit comptable et financier", "Stratégie et développement", "Analyse de performance"]
    },
    {
      week: "Semaine 5",
      title: "Gestion de Projets Avancée",
      topics: ["Montage et évaluation de projets", "Simulation de décisions", "Présentation finale"]
    }
  ];

  const testimonials = [
    {
      name: 'Fatima El Amri',
      role: 'Responsable RH – Agadir',
      content: 'Grâce à Polaris.K, j\'ai pu suivre la formation depuis Agadir tout en travaillant. J\'ai gagné en efficacité et en confiance dans mes décisions managériales.',
      rating: 5
    },
    {
      name: 'Youssef Benali',
      role: 'Auditeur Interne – Casablanca',
      content: 'La plateforme est fluide, les formateurs sont disponibles et compétents. Une expérience à distance vraiment humaine et professionnelle !',
      rating: 5
    },
    {
      name: 'Nadia Cherkaoui',
      role: 'Cadre Administrative – Rabat',
      content: 'Le format à distance m\'a permis de concilier vie professionnelle et formation. Les cas pratiques sont directement applicables dans mon travail.',
      rating: 5
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Navigation items for both desktop and mobile
  const navItems = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'pourquoi', label: 'Pourquoi' },
    { id: 'programme', label: 'Programme' },
    { id: 'avantages', label: 'Avantages' },
    { id: 'tarifs', label: 'Tarifs' },
    { id: 'temoignages', label: 'Témoignages' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Bandeau Session */}
      <motion.div 
        className="bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white py-2 text-center font-semibold"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🚀 Session Novembre 2025 – Inscriptions ouvertes ! Places limitées
      </motion.div>

      {/* Navigation Premium */}
      <motion.header 
        className={`fixed top-4 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-2xl py-3 rounded-2xl mx-4' : 'bg-transparent py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Enhanced Logo - Bigger and better */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="flex items-center space-x-3">
              {/* Bigger Logo Image */}
              <div className="relative">
                <img 
                  src="/logo.png" 
                  alt=""
                  className={`transition-all duration-500 ${
                    isScrolled 
                      ? 'h-12 lg:h-14 filter-none'  // Bigger colored logo when scrolled
                      : 'h-14 lg:h-16 filter brightness-0 invert drop-shadow-lg'  // Bigger white logo when transparent
                  }`}
                />
              </div>
            </div>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-medium transition-colors relative ${
                  isScrolled ? 'text-gray-700 hover:text-[#F58723]' : 'text-white hover:text-[#F58723]'
                }`}
                whileHover={{ y: -2 }}
              >
                {item.label}
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F58723]"
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 rounded-lg transition-colors"
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            )}
          </motion.button>
          
          {/* CTA Button - Hidden on mobile */}
          <motion.button
            onClick={() => scrollToSection('tarifs')}
            className="hidden lg:block bg-gradient-to-r from-[rgb(58,19,228)] to-[#e08733] text-white px-5 lg:px-6 py-2.5 lg:py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-sm"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(58, 19, 228, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center">
              📅 S'inscrire maintenant
            </span>
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
            />
            
            {/* Sidebar */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="/logo.png" 
                      alt=""
                      className="h-10"
                    />
                    <span className="font-bold text-xl text-[#0F377A]">
                    <span className="text-[#F58723]"></span>
                    </span>
                  </div>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 p-6">
                  <div className="space-y-4">
                    {navItems.map((item) => (
                      <motion.button
                        key={item.id}
                        onClick={() => handleMobileNavClick(item.id)}
                        className="w-full text-left py-4 px-4 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-[#0F377A]/5 hover:to-[#F58723]/5 hover:text-[#0F377A] font-medium transition-all duration-300 border border-transparent hover:border-[#0F377A]/10"
                        whileHover={{ x: 8 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <span className="flex items-center">
                          {item.label}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </nav>

                {/* Footer CTA */}
                <div className="p-6 border-t border-gray-200">
                  <motion.button
                    onClick={() => handleMobileNavClick('tarifs')}
                    className="w-full bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center justify-center">
                      📅 S'inscrire maintenant
                    </span>
                  </motion.button>
                  
                  {/* Contact Info */}
                  <div className="mt-6 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-3 text-[#F58723]" />
                      <span>0530 44 93 98</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-3 text-[#F58723]" />
                      <span>polarisprivateinstitute@gmail.com</span>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex space-x-4 mt-6">
                    {[
                      { 
                        name: 'Facebook', 
                        icon: <Facebook className="w-5 h-5" />,
                        url: 'https://facebook.com'
                      },
                      { 
                        name: 'LinkedIn', 
                        icon: <Linkedin className="w-5 h-5" />,
                        url: 'https://linkedin.com'
                      },
                      { 
                        name: 'Instagram', 
                        icon: <Instagram className="w-5 h-5" />,
                        url: 'https://instagram.com'
                      }
                    ].map((social) => (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gray-100 hover:bg-[#F58723] text-gray-600 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section Premium */}
      <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0F377A] via-[#1a4ba5] to-[#2c5fc4]">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                opacity: 0
              }}
              animate={{ 
                y: [null, -100],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
              >
                <TrendingUp className="w-4 h-4 text-[#F58723] mr-2" />
                <span className="text-white text-sm font-medium">🚀 Formation 100% à Distance</span>
              </motion.div>

              <motion.h1 
                className="text-4xl lg:text-5xl font-bold text-white mb-6 font-montserrat leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Maîtrisez la gestion moderne grâce à la 
                <span className="bg-gradient-to-r from-[#F58723] to-[#ff9a3d] bg-clip-text text-transparent">
                  {" "}simulation d'entreprise
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-white/90 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Une formation certifiante <strong>100% en ligne</strong> pour maîtriser la gestion, 
                le management et la prise de décision à distance. Développez des compétences 
                concrètes depuis chez vous, avec un accompagnement personnalisé.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <motion.button
                  onClick={() => scrollToSection('tarifs')}
                  className="bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 25px 50px rgba(245, 135, 35, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center justify-center">
                    Je m'inscris maintenant
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                </motion.button>

                <motion.button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = 'Brochure-Formation-Polaris-K.pdf';
                    link.download = 'Brochure-Formation-Polaris-K.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold backdrop-blur-sm hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center justify-center">
                    <Download className="mr-2 w-5 h-5" />
                    Télécharger la brochure
                  </span>
                </motion.button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                className="flex items-center space-x-6 text-white/80"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-400" />
                  <span>Certification reconnue</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-400" />
                  <span>500+ professionnels formés</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-[#F58723]" />
                  <span>95% de satisfaction</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60, rotateY: 10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="relative"
            >
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl transform perspective-1000">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#F58723] to-[#ff9a3d] rounded-3xl blur-xl opacity-30"></div>
                <div className="relative bg-white rounded-2xl p-6 shadow-lg">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 flex items-center justify-center">
                    {/* Conteneur vidéo format 9:16 */}
                    <div className="w-160 h-[340px] bg-black rounded-lg overflow-hidden shadow-lg">
                      <video 
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        poster="/video-poster.jpg" // Optionnel: image de remplacement
                      >
                        <source src="/POLARIS.mp4" type="video/mp4" />
                        Votre navigateur ne supporte pas la lecture de vidéos.
                      </video>
                    </div>
                  </div>
                  
                  {/* Texte descriptif sous la vidéo */}
                  <div className="text-center mt-4">
                    <p className="text-gray-600 font-medium">Plateforme de formation en ligne interactive</p>
                    <p className="text-sm text-gray-500 mt-1">Zoom + LMS Polaris.K</p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-2xl z-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-semibold text-gray-800">Session Nov. 2025</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white rounded-2xl p-4 shadow-2xl z-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-center">
                  <div className="text-lg font-bold">100%</div>
                  <div className="text-xs opacity-90">À distance</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rest of your existing sections remain exactly the same */}
      {/* Pourquoi Section */}
      <section id="pourquoi" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#0F377A] mb-4 font-montserrat">
              Pourquoi choisir notre formation <span className="text-[#F58723]">à distance</span> ?
            </h2>
            <motion.p 
              className="text-2xl text-gray-600 max-w-3xl mx-auto italic"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              « Parce que la performance n'attend pas que vous soyez au bureau. »
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-[#0F377A] to-[#1a4ba5] rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {benefit.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              onClick={() => scrollToSection('programme')}
              className="bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Découvrir le programme complet
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Programme Section */}
      <section id="programme" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#0F377A] mb-4 font-montserrat">
              Programme <span className="text-[#F58723]">Détaillé</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un curriculum intensif de 5 semaines conçu par des experts pour une montée 
              en compétences rapide et efficace, 100% en ligne.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Timeline */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {program.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex group"
                  >
                    <div className="flex flex-col items-center mr-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#0F377A] to-[#1a4ba5] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {index + 1}
                      </div>
                      {index < 3 && (
                        <div className="w-1 h-full bg-gradient-to-b from-[#0F377A] to-[#1a4ba5] mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center mb-3">
                          <div className="w-3 h-3 bg-[#F58723] rounded-full mr-3"></div>
                          <span className="font-semibold text-gray-700">{item.week}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3">{item.title}</h3>
                        <ul className="space-y-2">
                          {item.topics.map((topic, topicIndex) => (
                            <li key={topicIndex} className="flex items-center text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="sticky top-24"
              >
                <div className="bg-gradient-to-br from-[#0F377A] to-[#1a4ba5] rounded-3xl p-8 text-white shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6 font-montserrat">Informations Clés</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex items-center">
                      <Clock className="w-6 h-6 mr-4 text-[#F58723]" />
                      <div>
                        <div className="font-semibold">Durée</div>
                        <div className="text-white/80">4 à 6 semaines intensives</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Globe className="w-6 h-6 mr-4 text-[#F58723]" />
                      <div>
                        <div className="font-semibold">Mode</div>
                        <div className="text-white/80">100% en ligne (Zoom + LMS)</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="w-6 h-6 mr-4 text-[#F58723]" />
                      <div>
                        <div className="font-semibold">Prochaine session</div>
                        <div className="text-white/80">Novembre 2025</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Award className="w-6 h-6 mr-4 text-[#F58723]" />
                      <div>
                        <div className="font-semibold">Certification</div>
                        <div className="text-white/80">Attestation officielle Polaris.K</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm mb-6">
                    <div className="text-3xl font-bold mb-2">3,000 MAD</div>
                    <div className="text-white/80 text-sm">Paiement en 2 fois sans frais</div>
                    <div className="text-green-300 text-sm mt-1">Frais de dossier offerts</div>
                  </div>

                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4 mb-6">
                    <div className="text-yellow-200 text-sm font-semibold">
                      🎯 Places limitées — sélection sur étude de dossier
                    </div>
                  </div>

                  <motion.button
                    onClick={() => scrollToSection('tarifs')}
                    className="w-full bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Je réserve ma place dès maintenant
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages Section */}
      <section id="avantages" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#0F377A] mb-4 font-montserrat">
              Avantages du <span className="text-[#F58723]">Distanciel</span> avec Polaris.K
            </h2>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "💻",
                  title: "Apprentissage flexible",
                  description: "Accessible depuis ordinateur, tablette ou smartphone"
                },
                {
                  icon: "👩‍🏫",
                  title: "Formateurs disponibles",
                  description: "Experts à votre écoute tout au long de la formation"
                },
                {
                  icon: "📜",
                  title: "Attestation officielle",
                  description: "Certificat Polaris.K reconnu par les professionnels"
                },
                {
                  icon: "🤝",
                  title: "Networking professionnel",
                  description: "Communauté en ligne de cadres et professionnels"
                },
                {
                  icon: "🎥",
                  title: "Supports et replays",
                  description: "Accès à tous les contenus pendant 6 mois"
                },
                {
                  icon: "🔄",
                  title: "Flexibilité totale",
                  description: "Adaptez votre apprentissage à votre emploi du temps"
                },
                {
                  icon: "🎯",
                  title: "Pédagogie active",
                  description: "Cas concrets et mises en situation réelles"
                },
                {
                  icon: "🚀",
                  title: "Démarrage rapide",
                  description: "Inscription simple et intégration immédiate"
                }
              ].map((avantage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center"
                >
                  <div className="text-3xl mb-4">{avantage.icon}</div>
                  <h3 className="font-bold text-gray-800 mb-3 font-montserrat">
                    {avantage.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {avantage.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <motion.button
                onClick={() => scrollToSection('tarifs')}
                className="bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Je veux rejoindre la prochaine session
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tarifs & Inscription */}
      <section id="tarifs" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#0F377A] mb-4 font-montserrat">
              Investissement & <span className="text-[#F58723]">Modalités</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Pricing Card avec compteur */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="lg:col-span-1"
              >
                <div className="bg-gradient-to-br from-[#0F377A] to-[#1a4ba5] rounded-3xl p-8 text-white shadow-2xl text-center relative overflow-hidden">
                  {/* Badge Offre Limitée */}
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold rotate-12 shadow-lg">
                    ⏳ Offre limitée
                  </div>

                  <h3 className="text-2xl font-bold mb-4 font-montserrat">Formation Complète</h3>
                  
                  <div className="text-4xl font-bold mb-2">3,000 MAD</div>
                  <div className="text-white/80 mb-6">Paiement en 2 fois sans frais</div>

                  {/* Compteur Élégant */}
                  <div className="mb-6">
                    <div className="text-sm text-white/80 mb-3">Temps restant pour s'inscrire :</div>
                    <div className="flex justify-center space-x-1 bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="bg-white/20 rounded-xl p-2 min-w-12">
                          <div className="text-xl font-bold text-white">{timeLeft.days.toString().padStart(2, '0')}</div>
                          <div className="text-xs text-white/70">Jours</div>
                        </div>
                      </div>
                      <div className="text-white font-bold pt-3">:</div>
                      <div className="text-center">
                        <div className="bg-white/20 rounded-xl p-2 min-w-12">
                          <div className="text-xl font-bold text-white">{timeLeft.hours.toString().padStart(2, '0')}</div>
                          <div className="text-xs text-white/70">Heures</div>
                        </div>
                      </div>
                      <div className="text-white font-bold pt-3">:</div>
                      <div className="text-center">
                        <div className="bg-white/20 rounded-xl p-2 min-w-12">
                          <div className="text-xl font-bold text-white">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                          <div className="text-xs text-white/70">Minutes</div>
                        </div>
                      </div>
                      <div className="text-white font-bold pt-3">:</div>
                      <div className="text-center">
                        <div className="bg-white/20 rounded-xl p-2 min-w-12">
                          <div className="text-xl font-bold text-white">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                          <div className="text-xs text-white/70">Secondes</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-sm">Formation 100% en ligne</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-sm">Accès plateforme 6 mois</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-sm">Support formateurs</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-sm">Certification officielle</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-sm">Frais de dossier offerts</span>
                    </div>
                  </div>

                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-3 mb-6">
                    <div className="text-yellow-200 text-xs text-center">
                      🎯 Niveau Bac+3 ou équivalent requis
                    </div>
                  </div>

                  <motion.button
                    onClick={() => scrollToSection('inscription')}
                    className="w-full bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all mb-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Je réserve ma place
                  </motion.button>

                  <p className="text-xs text-white/60">
                    * Offre spéciale - {timeLeft.days} jours restants
                  </p>
                </div>
              </motion.div>

              {/* Inscription Form */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                id="inscription"
                className="lg:col-span-2"
              >
                <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#0F377A] mb-2 font-montserrat">
                      Inscrivez-vous dès aujourd'hui
                    </h2>
                    <p className="text-gray-600">
                      Commencez votre formation à distance et transformez votre carrière
                    </p>
                  </div>

                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700"
                    >
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Votre demande d'inscription a été envoyée avec succès ! Nous vous contacterons sous 24h.
                      </div>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700"
                    >
                      <div className="flex items-center">
                        <span className="mr-2">❌</span>
                        Une erreur est survenue. Veuillez réessayer ou nous contacter directement.
                      </div>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="nom" className="block text-sm font-semibold text-gray-700 mb-2">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          id="nom"
                          name="nom"
                          required
                          value={formData.nom}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-[#0F377A] focus:border-transparent transition-all bg-gray-50 ${
                            errors.nom ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Votre nom complet"
                        />
                        {errors.nom && (
                          <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-[#0F377A] focus:border-transparent transition-all bg-gray-50 ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="votre@email.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="telephone" className="block text-sm font-semibold text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          id="telephone"
                          name="telephone"
                          required
                          value={formData.telephone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-[#0F377A] focus:border-transparent transition-all bg-gray-50 ${
                            errors.telephone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="+212 XXX XXX XXX"
                        />
                        {errors.telephone && (
                          <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="niveau" className="block text-sm font-semibold text-gray-700 mb-2">
                          Niveau scolaire *
                        </label>
                        <select
                          id="niveau"
                          name="niveau"
                          required
                          value={formData.niveau}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-[#0F377A] focus:border-transparent transition-all bg-gray-50 ${
                            errors.niveau ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Choisissez votre niveau</option>
                          <option value="Bac+2">Bac+2</option>
                          <option value="Bac+3">Bac+3</option>
                          <option value="Bac+4">Bac+4</option>
                          <option value="Bac+5">Bac+5</option>
                        </select>
                        {errors.niveau && (
                          <p className="mt-1 text-sm text-red-600">{errors.niveau}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                        Message / Motivation *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-[#0F377A] focus:border-transparent transition-all bg-gray-50 resize-none ${
                          errors.message ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Décrivez votre motivation pour cette formation (20 à 2000 caractères)..."
                        minLength={20}
                        maxLength={2000}
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                      )}
                      <div className="mt-1 text-xs text-gray-500 text-right">
                        {formData.message.length}/2000 caractères
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="horsHeures"
                          name="horsHeures"
                          checked={formData.horsHeures}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-[#0F377A] border-gray-300 rounded focus:ring-[#0F377A] mt-1"
                        />
                        <label htmlFor="horsHeures" className="ml-2 text-sm text-gray-600">
                          Je suis disponible pour des sessions hors heures administratives (week-ends)
                        </label>
                      </div>

                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="consentement"
                          name="consentement"
                          required
                          checked={formData.consentement}
                          onChange={handleInputChange}
                          className={`w-4 h-4 text-[#0F377A] border-gray-300 rounded focus:ring-[#0F377A] mt-1 ${
                            errors.consentement ? 'border-red-500' : ''
                          }`}
                        />
                        <label htmlFor="consentement" className="ml-2 text-sm text-gray-600">
                          J'accepte le traitement de mes données conformément à la politique de confidentialité. *
                        </label>
                      </div>
                      {errors.consentement && (
                        <p className="mt-1 text-sm text-red-600 ml-6">{errors.consentement}</p>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting || !formData.consentement}
                      className="w-full bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: isSubmitting || !formData.consentement ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting || !formData.consentement ? 1 : 0.98 }}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                          />
                          Envoi en cours...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Send className="w-5 h-5 mr-2" />
                          Envoyer ma demande d'inscription
                        </span>
                      )}
                    </motion.button>

                    <p className="text-xs text-gray-500 text-center">
                      * Champs obligatoires. Vos données sont sécurisées et utilisées uniquement pour votre inscription.
                    </p>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section id="temoignages" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#0F377A] mb-4 font-montserrat">
              Ils Nous <span className="text-[#F58723]">Font Confiance</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les retours d'expérience de nos anciens participants 
              qui ont transformé leur carrière grâce à notre formation à distance.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0F377A] to-[#1a4ba5] rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-3 space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#0F377A] mb-4 font-montserrat">
              Questions <span className="text-[#F58723]">Fréquentes</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "Puis-je suivre la formation à mon rythme ?",
                answer: "Oui, tous les replays sont disponibles 24h/24 et 7j/7. Vous pouvez adapter votre apprentissage à votre emploi du temps."
              },
              {
                question: "Comment se déroulent les cours en ligne ?",
                answer: "Les cours se déroulent via Zoom pour les sessions en direct et sur notre plateforme LMS pour les contenus asynchrones, exercices et échanges."
              },
              {
                question: "Puis-je payer en plusieurs fois ?",
                answer: "Oui, le paiement peut être effectué en 2 tranches sans frais supplémentaires."
              },
              {
                question: "Le certificat est-il reconnu ?",
                answer: "Oui, le certificat est délivré par l'Institut Polaris.K et reconnu par les professionnels du secteur."
              },
              {
                question: "Quand débute la prochaine session ?",
                answer: "La prochaine session débutera en Novembre 2025. Les inscriptions sont ouvertes jusqu'à épuisement des places."
              },
              {
                question: "Quel matériel est nécessaire ?",
                answer: "Un ordinateur avec connexion internet stable. Une webcam et un micro sont recommandés pour une meilleure interaction."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="mb-4 border border-gray-200 rounded-2xl overflow-hidden"
              >
                <button 
                  className="w-full text-left p-6 bg-gray-50 hover:bg-gray-100 transition-colors font-semibold flex justify-between items-center"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-lg">{item.question}</span>
                  <motion.div
                    animate={{ rotate: activeFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 bg-white border-t border-gray-100"
                    >
                      <p className="text-gray-700">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                {/* Logo Image - Replaced the PK circle */}
                <img 
                  src="/logo.png" 
                  alt="Polaris.K - Formation à Distance d'Excellence"
                  className="h-12 lg:h-14 filter brightness-0 invert mr-3"
                />
                <h3 className="text-xl font-bold font-montserrat"></h3>
              </div>
              <p className="text-gray-400 mb-4">
                Votre partenaire d'excellence pour la formation à distance en gestion et management au Maroc.
              </p>
              <div className="flex space-x-3">
                {[
                  { 
                    name: 'Facebook', 
                    icon: (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    ),
                    url: 'https://facebook.com'
                  },
                  { 
                    name: 'LinkedIn', 
                    icon: (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    ),
                    url: 'https://linkedin.com'
                  },
                  { 
                    name: 'Instagram', 
                    icon: (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C8.396 0 7.986.012 6.756.06 2.702.227.228 2.698.06 6.756.012 7.986 0 8.396 0 12.017c0 3.62.012 4.03.06 5.26.168 4.058 2.642 6.532 6.7 6.7 1.23.048 1.64.06 5.26.06 3.62 0 4.03-.012 5.26-.06 4.058-.168 6.532-2.642 6.7-6.7.048-1.23.06-1.64.06-5.26 0-3.62-.012-4.03-.06-5.26-.168-4.058-2.642-6.532-6.7-6.7C16.047.012 15.637 0 12.017 0zm0 2.16c3.203 0 3.585.012 4.804.06 3.252.15 4.77 1.692 4.92 4.92.048 1.219.06 1.6.06 4.804 0 3.204-.012 3.585-.06 4.804-.15 3.227-1.668 4.77-4.92 4.92-1.219.048-1.6.06-4.804.06-3.204 0-3.585-.012-4.804-.06-3.252-.15-4.77-1.692-4.92-4.92-.048-1.219-.06-1.6-.06-4.804 0-3.204.012-3.585.06-4.804.15-3.227 1.668-4.77 4.92-4.92 1.219-.048 1.6-.06 4.804-.06zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>
                      </svg>
                    ),
                    url: 'https://instagram.com'
                  }
                ].map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-gray-700 hover:bg-[#F58723] rounded-lg transition-colors flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold text-lg mb-4 font-montserrat">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-1 text-[#F58723]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-400">Angle Rue Maâmoura & Reine Élisabeth, Kénitra</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-[#F58723]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-400">0530 44 93 98 / 0665 08 92 76</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-[#F58723]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:polarisprivateinstitute@gmail.com" className="text-gray-400 hover:text-[#F58723]">
                    polarisprivateinstitute@gmail.com
                  </a>
                </div>
              </div>
            </motion.div>

            {[
              {
                title: "Formations",
                links: ["Gestion à Distance", "Contrôle de Gestion", "Audit Interne", "Management"]
              },
              {
                title: "Ressources",
                links: ["Brochure PDF", "FAQ", "Témoignages", "Contact"]
              }
            ].map((column, index) => (
              <motion.div
                key={column.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 2) * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-bold text-lg mb-4 font-montserrat">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-[#F58723] transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="border-t border-gray-700 mt-12 pt-8 text-center"
          >
            <p className="text-gray-400">
              © 2025 Institut Polaris.K. Tous droits réservés. | Formation à Distance d'Excellence
            </p>
          </motion.div>
        </div>
      </footer>

      {/* Floating CTA */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.button
          onClick={() => scrollToSection('tarifs')}
          className="bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white p-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="flex items-center">
            📅 S'inscrire
          </span>
        </motion.button>
      </motion.div>

      {/* Bouton WhatsApp Flottant */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        <motion.button
  onClick={openWhatsApp}
  className="bg-green-500 text-white p-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all relative overflow-hidden"
  animate={{
    scale: [1, 1.05, 1],
    y: [0, -5, 0],
    boxShadow: [
      "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
      "0 25px 50px -5px rgba(34, 197, 94, 0.5)",
      "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
    ]
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut"
  }}
  whileHover={{ 
    scale: 1.1, 
    rotate: 5,
    transition: { duration: 0.2 }
  }}
  whileTap={{ scale: 0.9 }}
>
  {/* Shine effect */}
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
    animate={{ x: ["-100%", "200%"] }}
    transition={{
      duration: 3,
      repeat: Infinity,
      repeatDelay: 5
    }}
  />
  
  <span className="flex items-center relative z-10">
    <MessageCircle className="w-6 h-6 mr-2" />
    WhatsApp
  </span>
</motion.button>
      </motion.div>
    </div>
  );
}