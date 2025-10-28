// src/app/page.js
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Linkedin, Instagram, Menu, X } from 'lucide-react';
import { Volume2, VolumeX, Pause } from 'lucide-react';
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
  MessageCircle,
  ChevronDown,
  Sparkles,
  Target,
  BarChart3,
  Lightbulb,
  Rocket
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
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay
  
  // Enhanced countdown with urgency
  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // Enhanced countdown timer with urgency effects
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

  // Enhanced scroll effect with parallax
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Video controls
  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavClick = (sectionId) => {
    scrollToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  // Enhanced validation patterns
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
        } else if (value.length < 1) {
          error = 'Le message doit contenir au moins 1 caractère';
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
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbzsfmzfNfKCM0KdXQ7psIop9Z0xb6M-FDARCm_r7THhxEAZwh3PV9ZQ-4UDXpTcQv6a/exec';
      const submissionData = {
        nom: formData.nom.trim(),
        email: formData.email.trim(),
        telephone: formData.telephone.trim(),
        niveau: formData.niveau,
        message: formData.message.trim(),
        horsHeures: formData.horsHeures,
        consentement: formData.consentement,
        date: new Date().toISOString(),
        timestamp: new Date().toLocaleString('fr-FR'),
        source: 'Site Web Polaris.K'
      };
      
      console.log('📤 Données à envoyer:', submissionData);

      // Envoi vers Google Sheets
      const sheetsPromise = fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const sheetsTimeout = new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Timeout Google Sheets')), 10000);
      });

      await Promise.race([sheetsPromise, sheetsTimeout])
        .then(() => {
          console.log('✅ Données envoyées à Google Sheets');
        })
        .catch(err => {
          console.warn('⚠️ Erreur Google Sheets (non critique):', err);
        });

      // Envoi des emails
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: submissionData.nom,
          email: submissionData.email,
          telephone: submissionData.telephone,
          niveau: submissionData.niveau,
          message: submissionData.message,
          horsHeures: submissionData.horsHeures,
          date: submissionData.date,
          timestamp: submissionData.timestamp
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        throw new Error(`Erreur email: ${emailResponse.status} - ${errorText}`);
      }

      const emailResult = await emailResponse.json();
      console.log('✅ Emails envoyés avec succès:', emailResult);

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
      
      if (error.message.includes('Timeout')) {
        setSubmitStatus('warning');
      } else if (error.message.includes('email')) {
        setSubmitStatus('error');
      } else {
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 8000);
    }
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const phoneNumber = "+212718834201";
    const message = "Bonjour, je suis intéressé(e) par la formation Polaris.K et je souhaite obtenir plus d'informations.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Enhanced benefits data
  const benefits = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: '100% à distance',
      description: 'Formation accessible depuis n\'importe où au Maroc ou à l\'étranger'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Pédagogie active',
      description: 'Études de cas réels, simulations interactives et mises en pratique'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Formation',
      description: 'Apprenez et développez vos compétences pour évoluer dans votre carrière'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Flexibilité totale',
      description: 'Apprentissage à votre rythme avec replays disponibles'
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: 'Encadrement expert',
      description: 'Suivi personnalisé par nos formateurs spécialisés'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Résultats rapides',
      description: 'Compétences applicables immédiatement en entreprise'
    }
  ];

  // Enhanced program data
  const program = [
    {
      week: "Semaines 1 & 2",
      title: "Fondamentaux du Contrôle de Gestion & GRH",
      topics: ["Pratique du contrôle de gestion", "Gestion des ressources humaines", "Tableaux de bord stratégiques"],
      icon: <Target className="w-6 h-6" />
    },
    {
      week: "Semaine 3",
      title: "Stratégie et Analyse Financière",
      topics: ["Diagnostic stratégique et financier", "Ingénierie financière", "Marketing approfondi"],
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      week: "Semaine 4",
      title: "Audit et Développement d'Entreprise",
      topics: ["Audit comptable et financier", "Stratégie et développement", "Analyse de performance"],
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      week: "Semaine 5",
      title: "Gestion de Projets Avancée",
      topics: ["Montage et évaluation de projets", "Simulation de décisions", "Présentation finale"],
      icon: <Rocket className="w-6 h-6" />
    }
  ];

  // Enhanced testimonials
  const testimonials = [
    {
      name: 'Fatima El Amri',
      role: 'Responsable RH – Agadir',
      content: 'Grâce à Polaris.K, j\'ai pu suivre la formation depuis Agadir tout en travaillant. J\'ai gagné en efficacité et en confiance dans mes décisions managériales.',
      rating: 5,
      avatar: 'FE'
    },
    {
      name: 'Youssef Benali',
      role: 'Auditeur Interne – Casablanca',
      content: 'La plateforme est fluide, les formateurs sont disponibles et compétents. Une expérience à distance vraiment humaine et professionnelle !',
      rating: 5,
      avatar: 'YB'
    },
    {
      name: 'Nadia Cherkaoui',
      role: 'Cadre Administrative – Rabat',
      content: 'Le format à distance m\'a permis de concilier vie professionnelle et formation. Les cas pratiques sont directement applicables dans mon travail.',
      rating: 5,
      avatar: 'NC'
    }
  ];

  // Enhanced animations
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

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  // Navigation items
  const navItems = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'pourquoi', label: 'Pourquoi' },
    { id: 'programme', label: 'Programme' },
    { id: 'avantages', label: 'Avantages' },
    { id: 'tarifs', label: 'Tarifs' },
    { id: 'temoignages', label: 'Témoignages' }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Enhanced Session Banner */}
      <motion.div 
        className="bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white py-3 text-center font-bold relative overflow-hidden"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
          <span className="text-sm lg:text-base">
            🚀 Session Novembre 2025 – Inscriptions ouvertes ! Places limitées • Dernières places disponibles
          </span>
          <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
        </div>
      </motion.div>

      {/* Enhanced Premium Navigation */}
      <motion.header 
        className={`fixed top-4 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-2xl py-3 rounded-2xl mx-4' : 'bg-transparent py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Enhanced Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Polaris.K - Formation d'Excellence"
                className={`transition-all duration-500 ${
                  isScrolled 
                    ? 'h-12 lg:h-14 filter-none' 
                    : 'h-14 lg:h-16 filter brightness-0 invert drop-shadow-lg'
                }`}
              />
              <div className={`hidden lg:block ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                <div className="font-bold text-lg leading-tight"></div>
                <div className="text-xs opacity-80"></div>
              </div>
            </div>
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-medium transition-colors relative group ${
                  isScrolled ? 'text-gray-700 hover:text-[#F58723]' : 'text-white hover:text-[#F58723]'
                }`}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <span className="relative z-10">{item.label}</span>
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F58723] group-hover:w-full"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </motion.button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 rounded-lg transition-colors backdrop-blur-sm"
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
          
          {/* Enhanced CTA Button */}
          <motion.button
            onClick={() => scrollToSection('tarifs')}
            className="hidden lg:block bg-gradient-to-r from-[rgb(58,19,228)] to-[#e08733] text-white px-6 py-3 rounded-full font-semibold shadow-2xl hover:shadow-3xl transition-all transform text-sm relative overflow-hidden group"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(58, 19, 228, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="flex items-center relative z-10">
              <Calendar className="w-4 h-4 mr-2" />
              S'inscrire maintenant
            </span>
          </motion.button>
        </div>
      </motion.header>

      {/* Enhanced Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
            />
            
            <motion.div
              className="fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-white to-gray-50 shadow-2xl z-50 lg:hidden border-l border-gray-200"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="/logo.png" 
                      alt="Polaris.K"
                      className="h-10"
                    />
                    <div>
                      <div className="font-bold text-gray-800"></div>
                      <div className="text-xs text-gray-500"></div>
                    </div>
                  </div>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <nav className="flex-1 p-6">
                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <motion.button
                        key={item.id}
                        onClick={() => handleMobileNavClick(item.id)}
                        className="w-full text-left py-4 px-4 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-[#0F377A]/5 hover:to-[#F58723]/5 hover:text-[#0F377A] font-medium transition-all duration-300 border border-transparent hover:border-[#0F377A]/10 group"
                        whileHover={{ x: 8 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <span className="flex items-center justify-between">
                          {item.label}
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </nav>

                <div className="p-6 border-t border-gray-200 bg-white">
                  <motion.button
                    onClick={() => handleMobileNavClick('tarifs')}
                    className="w-full bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all mb-4 relative overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="flex items-center justify-center relative z-10">
                      <Calendar className="w-4 h-4 mr-2" />
                      S'inscrire maintenant
                    </span>
                  </motion.button>
                  
                  <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-4 h-4 mr-3 text-[#F58723]" />
                      <span>07 18 83 42 01</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-4 h-4 mr-3 text-[#F58723]" />
                      <span>fejjal1998@gmail.com</span>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    {[
                      { 
                        name: 'Facebook', 
                        icon: <Facebook className="w-5 h-5" />,
                        url: 'https://www.facebook.com'
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
                        whileHover={{ scale: 1.1, y: -2 }}
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

      {/* Enhanced Hero Section with Video */}
      <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0F377A] via-[#1a4ba5] to-[#2c5fc4]">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                opacity: 0
              }}
              animate={{ 
                y: [null, -100],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
              >
                <Zap className="w-4 h-4 text-[#F58723] mr-2" />
                <span className="text-white text-sm font-medium">🎯 Formation Executive 100% Digital</span>
              </motion.div>

              <motion.h1 
                className="text-5xl lg:text-6xl font-bold text-white mb-6 font-montserrat leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Devenez Expert en 
                <span className="bg-gradient-to-r from-[#F58723] to-[#ff9a3d] bg-clip-text text-transparent block">
                  Gestion Stratégique
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Maîtrisez les <strong>compétences stratégiques</strong> les plus demandées grâce à notre 
                formation certifiante <strong>100% en ligne</strong>. Développez votre expertise depuis 
                chez vous avec un accompagnement <strong>personnalisé</strong>.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <motion.button
                  onClick={() => scrollToSection('tarifs')}
                  className="bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all relative overflow-hidden group"
                  whileHover={{ 
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="flex items-center justify-center relative z-10">
                    Commencer mon parcours
                    <Rocket className="ml-2 w-5 h-5" />
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
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold backdrop-blur-sm hover:bg-white/10 transition-all group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center justify-center">
                    <Download className="mr-2 w-5 h-5 group-hover:animate-bounce" />
                    Brochure Détaillée
                  </span>
                </motion.button>
              </motion.div>

              {/* Enhanced Trust Indicators */}
              <motion.div 
                className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-white/80"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <div className="flex items-center justify-center lg:justify-start">
                  <Shield className="w-5 h-5 mr-2 text-green-400" />
                  <span className="text-sm">Certification RNCP</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                  <Users className="w-5 h-5 mr-2 text-blue-400" />
                  <span className="text-sm">750+ Alumni</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                  <CheckCircle className="w-5 h-5 mr-2 text-[#F58723]" />
                  <span className="text-sm">97% Satisfaction</span>
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
                  

{/* Enhanced Video Container with Sound Controls */}
<div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 flex items-center justify-center">
  <div className="w-full max-w-md h-80 bg-black rounded-lg overflow-hidden shadow-2xl relative group">
    <video 
      ref={videoRef}
      className="w-full h-full object-cover"
      autoPlay
      muted={isMuted}
      loop
      playsInline
      poster="/video-poster.jpg"
      onPlay={() => setIsVideoPlaying(true)}
      onPause={() => setIsVideoPlaying(false)}
    >
      <source src="/POLARIS.mp4" type="video/mp4" />
      Votre navigateur ne supporte pas la lecture de vidéos.
    </video>
    
    {/* Enhanced Video Overlay with Sound Control */}
    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isVideoPlaying ? 'opacity-0' : 'opacity-100'}`}>
      <motion.button
        onClick={toggleVideoPlay}
        className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-4 shadow-2xl transform transition-all group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Play className="w-8 h-8 fill-current transform group-hover:scale-110 transition-transform" />
      </motion.button>
    </div>

    {/* Enhanced Video Controls */}
    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="flex items-center space-x-2 bg-black/70 backdrop-blur-sm rounded-full px-3 py-2">
        <button
          onClick={toggleVideoPlay}
          className="text-white hover:text-[#F58723] transition-colors"
        >
          {isVideoPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
        </button>
        
        {/* Sound Control */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-white hover:text-[#F58723] transition-colors ml-2"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
        
        {/* Progress Bar - Simplified */}
        <div className="w-20 h-1 bg-gray-600 rounded-full ml-2">
          <div className="h-full bg-[#F58723] rounded-full w-1/3"></div>
        </div>
      </div>
      
      <div className="text-white text-sm bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
        Demo Platform
      </div>
    </div>

    {/* Sound Status Indicator */}
    {!isMuted && (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center"
      >
        <Volume2 className="w-3 h-3 mr-1" />
        Son activé
      </motion.div>
    )}
  </div>
</div>
                  <div className="text-center mt-6">
                    <p className="text-gray-700 font-semibold">Découvrez notre plateforme d'apprentissage</p>
                    <p className="text-sm text-gray-500 mt-2">Interface intuitive • Support 24/7 • Contenu interactif</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-2xl z-10 border border-gray-100"
                initial={{ y: 20, opacity: 0, rotate: -5 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                whileHover={{ y: -5, rotate: 5 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-800">Session Nov. 2025</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white rounded-2xl p-4 shadow-2xl z-10"
                initial={{ y: 20, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.1 }}
              >
                <div className="text-center">
                  <div className="text-lg font-bold">100%</div>
                  <div className="text-xs opacity-90">Flexible</div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white/70 flex flex-col items-center cursor-pointer"
              onClick={() => scrollToSection('pourquoi')}
            >
              <span className="text-sm mb-2">Découvrir</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Pourquoi Section */}
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
        Pourquoi choisir Polaris.K en <span className="text-[#F58723]">formation à distance</span> ?
      </h2>
      <motion.p 
        className="text-2xl text-gray-600 max-w-3xl mx-auto italic bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        viewport={{ once: true }}
      >
        « L'excellence n'attend pas que vous soyez au bureau. Elle vous suit partout. »
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
          className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 relative overflow-hidden cursor-pointer"
          whileHover={{ y: -10, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => scrollToSection('tarifs')} // Simple trick here
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0F377A] to-[#F58723]"></div>
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-[#0F377A] to-[#1a4ba5] rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:from-[#F58723] group-hover:to-[#ff9a3d]"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            {benefit.icon}
          </motion.div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat group-hover:text-[#0F377A] transition-colors">
            {benefit.title}
          </h3>
          <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
            {benefit.description}
          </p>
          
          {/* Simple hover indicator */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center text-sm text-[#F58723] font-semibold">
              Voir les tarifs
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
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
        onClick={() => scrollToSection('tarifs')}
        className="bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="flex items-center">
          Découvrir les tarifs et m'inscrire
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </span>
      </motion.button>
    </motion.div>
  </div>
</section>
      {/* Enhanced Programme Section */}
      <section id="programme" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white rounded-full mb-6"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">PROGRAMME DÉTAILLÉ</span>
            </motion.div>

            <h2 className="text-5xl font-bold text-[#0F377A] mb-6 font-montserrat">
              Un Curriculum <span className="text-[#F58723]">Intensif</span> et 
              <span className="text-[#F58723]"> Pragmatique</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              5 semaines transformatrices pour maîtriser les compétences stratégiques 
              les plus demandées sur le marché, avec une approche 100% pratique et applicable.
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Enhanced Timeline */}
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
                    transition={{ delay: index * 0.15 }}
                    viewport={{ once: true }}
                    className="flex group"
                  >
                    <div className="flex flex-col items-center mr-6">
                      <motion.div 
                        className="w-14 h-14 bg-gradient-to-br from-[#0F377A] to-[#1a4ba5] rounded-2xl flex items-center justify-center text-white font-bold shadow-lg relative overflow-hidden group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 5 }}
                      >
                        <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <span className="relative z-10">{index + 1}</span>
                      </motion.div>
                      {index < 3 && (
                        <div className="w-1 h-full bg-gradient-to-b from-[#0F377A] to-[#1a4ba5] mt-2 rounded-full"></div>
                      )}
                    </div>
                    
                    <motion.div 
                      className="flex-1 pb-8 group-hover:transform group-hover:-translate-y-1 transition-transform duration-300"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 group-hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#F58723] to-[#ff9a3d]"></div>
                        
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#F58723] to-[#ff9a3d] rounded-xl flex items-center justify-center text-white mr-3">
                            {item.icon}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-sm">
                              {item.week}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 mb-4 leading-tight">
                          {item.title}
                        </h3>
                        
                        <ul className="space-y-3">
                          {item.topics.map((topic, topicIndex) => (
                            <motion.li 
                              key={topicIndex} 
                              className="flex items-center text-gray-600 group/item"
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.15 + topicIndex * 0.1 }}
                              viewport={{ once: true }}
                            >
                              <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                              <span>{topic}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Enhanced Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="sticky top-24"
              >
                <div className="bg-gradient-to-br from-[#0F377A] to-[#1a4ba5] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-6 font-montserrat flex items-center">
                      <Award className="w-6 h-6 mr-3 text-[#F58723]" />
                      Informations Clés
                    </h3>
                    
                    <div className="space-y-6 mb-8">
                      {[
                        { icon: Clock, label: "Durée", value: "4 à 6 semaines intensives" },
                        { icon: Globe, label: "Mode", value: "100% en ligne (Zoom + LMS)" },
                        { icon: Calendar, label: "Prochaine session", value: "Novembre 2025" },
                        { icon: Users, label: "Format", value: "Cohorte limitée à 25 participants" }
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          viewport={{ once: true }}
                          className="flex items-center p-3 bg-white/10 rounded-2xl backdrop-blur-sm"
                        >
                          <item.icon className="w-6 h-6 mr-4 text-[#F58723]" />
                          <div>
                            <div className="font-semibold">{item.label}</div>
                            <div className="text-white/80 text-sm">{item.value}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      viewport={{ once: true }}
                      className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm mb-6 border border-white/20"
                    >
                      <div className="text-3xl font-bold mb-2">3,000 MAD</div>
                      <div className="text-white/80 text-sm">Paiement en 2 fois sans frais</div>
                      <div className="text-green-300 text-sm mt-1 font-semibold">
                        ✅ Frais de dossier offerts
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      viewport={{ once: true }}
                      className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4 mb-6 backdrop-blur-sm"
                    >
                      <div className="text-yellow-200 text-sm font-semibold text-center">
                        🎯 Places limitées — sélection sur étude de dossier
                      </div>
                    </motion.div>

                    <motion.button
                      onClick={() => scrollToSection('tarifs')}
                      className="w-full bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <span className="flex items-center justify-center relative z-10">
                        <Rocket className="w-5 h-5 mr-2" />
                        Réserver ma place maintenant
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Avantages Section */}
      <section id="avantages" className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-[#0F377A]/5 to-[#F58723]/5 rounded-full -translate-x-36 -translate-y-36"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-[#F58723]/5 to-[#0F377A]/5 rounded-full translate-x-48 translate-y-48"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#0F377A] to-[#1a4ba5] text-white rounded-full mb-6"
            >
              <Zap className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">AVANTAGES EXCLUSIFS</span>
            </motion.div>

            <h2 className="text-5xl font-bold text-[#0F377A] mb-6 font-montserrat">
              Pourquoi Nos Participants 
              <span className="text-[#F58723]"> Réussissent</span> ?
            </h2>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: "💻",
                  title: "Flexibilité Totale",
                  description: "Apprenez à votre rythme depuis n'importe quel appareil",
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  icon: "👩‍🏫",
                  title: "Experts Disponibles",
                  description: "Accompagnement personnalisé par des professionnels",
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  icon: "📜",
                  title: "Certification Valorante",
                  description: "Diplôme reconnu par les employeurs marocains",
                  gradient: "from-green-500 to-emerald-500"
                },
                {
                  icon: "🤝",
                  title: "Réseau Professionnel",
                  description: "Intégrez une communauté de cadres ambitieux",
                  gradient: "from-orange-500 to-red-500"
                },
                {
                  icon: "🎥",
                  title: "Contenu Premium",
                  description: "Accès illimité aux replays pendant 6 mois",
                  gradient: "from-indigo-500 to-blue-500"
                },
                {
                  icon: "🔄",
                  title: "Méthodologie Agile",
                  description: "Adaptée aux contraintes des professionnels",
                  gradient: "from-teal-500 to-cyan-500"
                },
                {
                  icon: "🎯",
                  title: "Pratique Intensive",
                  description: "Cas réels et mises en situation professionnelles",
                  gradient: "from-amber-500 to-orange-500"
                },
                {
                  icon: "🚀",
                  title: "Impact Immédiat",
                  description: "Compétences applicables dès la première semaine",
                  gradient: "from-rose-500 to-pink-500"
                }
              ].map((avantage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center group relative overflow-hidden"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <motion.div
                    className={`text-3xl mb-4 relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${avantage.gradient} text-white shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {avantage.icon}
                  </motion.div>
                  
                  <h3 className="font-bold text-gray-800 mb-3 font-montserrat relative z-10 group-hover:text-[#0F377A] transition-colors">
                    {avantage.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm relative z-10 leading-relaxed">
                    {avantage.description}
                  </p>

                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-[#F58723] transition-all duration-300"></div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <motion.button
                onClick={() => scrollToSection('tarifs')}
                className="bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all group relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="flex items-center justify-center relative z-10">
                  Rejoindre la Session Novembre 2025
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
                className="text-gray-500 mt-4 text-sm"
              >
                ⏳ Dernières places disponibles pour la prochaine cohorte
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Tarifs & Inscription Section */}
      <section id="tarifs" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-white/50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white rounded-full mb-6"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">INVESTISSEMENT & MODALITÉS</span>
            </motion.div>

            <h2 className="text-5xl font-bold text-[#0F377A] mb-6 font-montserrat">
              Un Investissement 
              <span className="text-[#F58723]"> Stratégique</span> pour 
              <span className="text-[#F58723]"> Votre Carrière</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transformez votre potentiel en expertise reconnue avec un programme 
              conçu pour maximiser votre retour sur investissement.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Enhanced Pricing Card */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="lg:col-span-1"
              >
                <div className="bg-gradient-to-br from-[#0F377A] to-[#1a4ba5] rounded-3xl p-8 text-white shadow-2xl text-center relative overflow-hidden border border-[#0F377A]/20">
                  {/* Enhanced Badge */}
                  <div className="absolute -top-3 -right-3 bg-red-500 text-white px-6 py-3 rounded-full text-sm font-bold rotate-12 shadow-2xl animate-pulse">
                    ⏳ Offre Limitée
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute top-4 left-4 w-8 h-8 bg-white/10 rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 bg-white/10 rounded-full"></div>

                  <h3 className="text-2xl font-bold mb-6 font-montserrat relative z-10">
                    Formation Complète
                  </h3>
                  
                  <div className="relative mb-6">
                    <div className="text-5xl font-bold mb-2 relative z-10">3,000 MAD</div>
                    <div className="text-white/80 text-lg mb-2">Paiement en 2 fois sans frais</div>
                    <div className="text-green-300 text-sm font-semibold bg-green-500/20 px-3 py-1 rounded-full inline-block">
                      ✅ 50% de réduction inclus
                    </div>
                  </div>

                  {/* Enhanced Countdown */}
                  <div className="mb-8 relative z-10">
                    <div className="text-sm text-white/80 mb-4 font-semibold">
                      ⚡ Dernière chance pour s'inscrire :
                    </div>
                    <div className="flex justify-center space-x-2 bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                      {[
                        { value: timeLeft.days, label: 'Jours' },
                        { value: timeLeft.hours, label: 'Heures' },
                        { value: timeLeft.minutes, label: 'Minutes' },
                        { value: timeLeft.seconds, label: 'Secondes' }
                      ].map((item, index) => (
                        <div key={item.label} className="text-center">
                          <div className="bg-white/20 rounded-xl p-3 min-w-14 shadow-inner">
                            <div className="text-xl font-bold text-white font-mono">
                              {item.value.toString().padStart(2, '0')}
                            </div>
                            <div className="text-xs text-white/70 mt-1">{item.label}</div>
                          </div>
                          {index < 3 && (
                            <div className="text-white font-bold mt-3"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 relative z-10">
                    {[
                      "Formation 100% en ligne interactive",
                      "Accès plateforme premium 6 mois",
                      "Support formateurs experts dédié",
                      "Certification officielle reconnue",
                      "Frais de dossier offerts",
                      "Réseau alumni exclusif"
                    ].map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center text-left"
                      >
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4 mb-6 backdrop-blur-sm"
                  >
                    <div className="text-yellow-200 text-sm text-center font-semibold">
                      🎯 Niveau Bac+3 ou expérience équivalente requise
                    </div>
                  </motion.div>

                  <motion.button
                    onClick={() => document.getElementById('inscription')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group mb-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="flex items-center justify-center relative z-10">
                      <Rocket className="w-5 h-5 mr-2" />
                      Réserver Maintenant
                    </span>
                  </motion.button>

                  <p className="text-xs text-white/60">
                    * Offre spéciale - {timeLeft.days} jours restants • Garantie satisfait ou remboursé 14 jours
                  </p>
                </div>
              </motion.div>

              {/* Enhanced Inscription Form */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                id="inscription"
                className="lg:col-span-2"
              >
                <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
                  {/* Form Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0F377A]/5 to-[#F58723]/5 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-[#F58723]/5 to-[#0F377A]/5 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <div className="text-center mb-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#0F377A] to-[#1a4ba5] text-white rounded-full mb-4"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        <span className="text-sm font-semibold">INSCRIPTION EXPRESS</span>
                      </motion.div>
                      
                      <h2 className="text-3xl font-bold text-[#0F377A] mb-2 font-montserrat">
                        Rejoignez la Session Novembre 2025
                      </h2>
                      <p className="text-gray-600">
                        Inscrivez-vous en 2 minutes et transformez votre carrière dès maintenant
                      </p>
                    </div>

                    {/* Enhanced Status Messages */}
                    <AnimatePresence>
                      {submitStatus === 'success' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: -20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="mb-6 p-6 bg-green-50 border border-green-200 rounded-2xl text-green-700 shadow-lg"
                        >
                          <div className="flex items-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
                            </motion.div>
                            <div>
                              <div className="font-semibold">Félicitations ! Votre inscription est confirmée.</div>
                              <div className="text-sm mt-1">
                                Notre équipe vous contactera dans les 24h pour finaliser votre admission.
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {submitStatus === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: -20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="mb-6 p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 shadow-lg"
                        >
                          <div className="flex items-center">
                            <span className="text-xl mr-3">❌</span>
                            <div>
                              <div className="font-semibold">Une erreur est survenue</div>
                              <div className="text-sm mt-1">
                                Veuillez réessayer ou nous contacter directement au 07 18 83 42 01
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          viewport={{ once: true }}
                        >
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
                            className={`w-full px-4 py-3 border-2 rounded-2xl focus:ring-2 focus:ring-[#0F377A] focus:border-transparent transition-all bg-gray-50/50 backdrop-blur-sm ${
                              errors.nom ? 'border-red-500' : 'border-gray-200'
                            }`}
                            placeholder="Votre nom complet"
                          />
                          {errors.nom && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-sm text-red-600 flex items-center"
                            >
                              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                              {errors.nom}
                            </motion.p>
                          )}
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          viewport={{ once: true }}
                        >
                          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email professionnel *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-2xl focus:ring-2 focus:ring-[#0F377A] focus:border-transparent transition-all bg-gray-50/50 backdrop-blur-sm ${
                              errors.email ? 'border-red-500' : 'border-gray-200'
                            }`}
                            placeholder="votre@email.com"
                          />
                          {errors.email && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-sm text-red-600 flex items-center"
                            >
                              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                              {errors.email}
                            </motion.p>
                          )}
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          viewport={{ once: true }}
                        >
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
                            className={`w-full px-4 py-3 border-2 rounded-2xl focus:ring-2 focus:ring-[#0F377A] focus:border-transparent transition-all bg-gray-50/50 backdrop-blur-sm ${
                              errors.telephone ? 'border-red-500' : 'border-gray-200'
                            }`}
                            placeholder="+212 XXX XXX XXX"
                          />
                          {errors.telephone && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-sm text-red-600 flex items-center"
                            >
                              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                              {errors.telephone}
                            </motion.p>
                          )}
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          viewport={{ once: true }}
                        >
                          <label htmlFor="niveau" className="block text-sm font-semibold text-gray-700 mb-2">
                            Niveau d'études *
                          </label>
                          <select
                            id="niveau"
                            name="niveau"
                            required
                            value={formData.niveau}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-2xl focus:ring-2 focus:ring-[#0F377A] focus:border-transparent transition-all bg-gray-50/50 backdrop-blur-sm ${
                              errors.niveau ? 'border-red-500' : 'border-gray-200'
                            }`}
                          >
                            <option value="">Sélectionnez votre niveau</option>
                            <option value="Bac+2">Bac+2 (DEUG, DUT, BTS, DTS)</option>
                            <option value="Bac+3">Bac+3 (Licence, Bachelor)</option>
                            <option value="Bac+4">Bac+4 (Maîtrise, Master 1)</option>
                            <option value="Bac+5">Bac+5 (Master, MBA)</option>
                          </select>
                          {errors.niveau && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-sm text-red-600 flex items-center"
                            >
                              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                              {errors.niveau}
                            </motion.p>
                          )}
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                          Motivation & Objectifs *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-2xl focus:ring-2 focus:ring-[#0F377A] focus:border-transparent transition-all bg-gray-50/50 backdrop-blur-sm resize-none ${
                            errors.message ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="Décrivez vos motivations et objectifs professionnels (minimum 50 caractères)..."
                          minLength={50}
                          maxLength={2000}
                        />
                        {errors.message && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-red-600 flex items-center"
                          >
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            {errors.message}
                          </motion.p>
                        )}
                        <div className="mt-2 text-xs text-gray-500 text-right flex justify-between">
                          <span>Minimum 50 caractères</span>
                          <span>{formData.message.length}/2000 caractères</span>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-4 bg-gray-50/50 rounded-2xl p-6 backdrop-blur-sm"
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="horsHeures"
                            name="horsHeures"
                            checked={formData.horsHeures}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-[#0F377A] border-gray-300 rounded focus:ring-[#0F377A] mt-1"
                          />
                          <label htmlFor="horsHeures" className="text-sm text-gray-600 flex-1">
                            Je suis disponible pour des sessions en soirée ou week-end (optionnel)
                          </label>
                        </div>

                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="consentement"
                            name="consentement"
                            required
                            checked={formData.consentement}
                            onChange={handleInputChange}
                            className={`w-5 h-5 text-[#0F377A] border-gray-300 rounded focus:ring-[#0F377A] mt-1 ${
                              errors.consentement ? 'border-red-500' : ''
                            }`}
                          />
                          <label htmlFor="consentement" className="text-sm text-gray-600 flex-1">
                            J'accepte le traitement de mes données personnelles conformément à la 
                            <a href="#" className="text-[#0F377A] hover:underline ml-1">politique de confidentialité</a>. *
                          </label>
                        </div>
                        {errors.consentement && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-600 flex items-center ml-8"
                          >
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            {errors.consentement}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting || !formData.consentement}
                        className="w-full bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                        whileHover={{ scale: isSubmitting || !formData.consentement ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting || !formData.consentement ? 1 : 0.98 }}
                      >
                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        
                        {isSubmitting ? (
                          <span className="flex items-center justify-center relative z-10">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                            />
                            Traitement en cours...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center relative z-10">
                            <Send className="w-5 h-5 mr-2" />
                            Soumettre ma candidature
                          </span>
                        )}
                      </motion.button>

                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        viewport={{ once: true }}
                        className="text-xs text-gray-500 text-center"
                      >
                        * Champs obligatoires. Vos données sont sécurisées et utilisées uniquement pour traiter votre inscription.
                        <br />
                        🔒 Protégé par le RGPD • Réponse sous 24h
                      </motion.p>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Témoignages Section */}
      <section id="temoignages" className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-[#F58723]/10 to-[#ff9a3d]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-[#0F377A]/10 to-[#1a4ba5]/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#0F377A] to-[#1a4ba5] text-white rounded-full mb-6"
            >
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">TÉMOIGNAGES</span>
            </motion.div>

            <h2 className="text-5xl font-bold text-[#0F377A] mb-6 font-montserrat">
              Ils Nous <span className="text-[#F58723]">Font Confiance</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez les parcours inspirants de nos alumni qui ont transformé 
              leur carrière grâce à notre formation à distance.
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 group relative overflow-hidden"
                whileHover={{ y: -5 }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F58723] to-[#ff9a3d]"></div>
                
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#0F377A] to-[#1a4ba5] rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4 space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.2 + i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>
                
                <motion.p 
                  className="text-gray-700 leading-relaxed italic relative z-10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.3 }}
                  viewport={{ once: true }}
                >
                  "{testimonial.content}"
                </motion.p>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Quote className="w-8 h-8 text-[#F58723]/20" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-20 bg-gradient-to-r from-[#0F377A] to-[#1a4ba5] rounded-3xl p-8 text-white shadow-2xl"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "97%", label: "Taux de satisfaction" },
                { number: "750+", label: "Professionnels formés" },
                { number: "89%", label: "Promotion de carrière" },
                { number: "4.9/5", label: "Note moyenne" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white rounded-full mb-6"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">FOIRE AUX QUESTIONS</span>
            </motion.div>

            <h2 className="text-5xl font-bold text-[#0F377A] mb-6 font-montserrat">
              Questions <span className="text-[#F58723]">Fréquentes</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tout ce que vous devez savoir sur notre formation et son déroulement.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                question: "Puis-je suivre la formation tout en travaillant à temps plein ?",
                answer: "Absolument ! Notre formation est spécialement conçue pour les professionnels en activité. Les cours sont disponibles en replay 24h/24 et les sessions live ont lieu en soirée ou le week-end pour s'adapter à votre emploi du temps."
              },
              {
                question: "Comment se déroulent les évaluations et la certification ?",
                answer: "L'évaluation est continue : études de cas, projets pratiques et QCM. La certification est délivrée après validation de tous les modules et un projet final. Notre certificat est reconnu par les professionnels du secteur."
              },
              {
                question: "Quelle est la politique de remboursement ?",
                answer: "Nous offrons une garantie satisfait ou remboursé de 14 jours. Si la formation ne répond pas à vos attentes dans les 14 premiers jours, nous vous remboursons intégralement."
              },
              {
                question: "Y a-t-il un accompagnement après la formation ?",
                answer: "Oui ! Vous bénéficiez d'un accès à vie à notre communauté alumni, de sessions de networking et d'un support carrière pendant 6 mois après votre certification."
              },
              {
                question: "Quel matériel technique est nécessaire ?",
                answer: "Un ordinateur avec connexion internet stable. Une webcam et un micro sont recommandés pour une meilleure interaction. Tous les logiciels nécessaires sont fournis ou disponibles en version d'essai gratuite."
              },
              {
                question: "Puis-je échelonner le paiement ?",
                answer: "Oui, le paiement peut être effectué en 2 fois sans frais supplémentaires. Des solutions de financement supplémentaires peuvent être étudiées sur demande."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="mb-4 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <motion.button 
                  className="w-full text-left p-6 bg-gray-50 hover:bg-gray-100 transition-colors font-semibold flex justify-between items-center group"
                  onClick={() => toggleFaq(index)}
                  whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                >
                  <span className="text-lg text-gray-800 pr-4">{item.question}</span>
                  <motion.div
                    animate={{ rotate: activeFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-[#F58723] group-hover:scale-110 transition-transform" />
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 bg-white border-t border-gray-100"
                    >
                      <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
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
            <div className="bg-gradient-to-r from-[#0F377A] to-[#1a4ba5] rounded-3xl p-8 text-white shadow-2xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 font-montserrat">
                Une question spécifique ?
              </h3>
              <p className="text-white/80 mb-6">
                Notre équipe est disponible pour répondre à toutes vos interrogations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={openWhatsApp}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </motion.button>
                <motion.button
                  onClick={() => scrollToSection('inscription')}
                  className="bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Nous appeler
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 relative overflow-hidden">
        {/* Footer Background */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#F58723]/10 to-[#ff9a3d]/10 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-[#0F377A]/10 to-[#1a4ba5]/10 rounded-full translate-x-40 translate-y-40"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="flex items-center mb-6">
                <img 
                  src="/logo.png" 
                  alt="Polaris.K - Formation à Distance d'Excellence"
                  className="h-12 lg:h-14 filter brightness-0 invert mr-4"
                />
                <div>
                  <h3 className="text-xl font-bold font-montserrat"></h3>
                  <p className="text-gray-400 text-sm"></p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Votre partenaire d'excellence pour la formation à distance en gestion 
                et management au Maroc. Développez vos compétences avec des experts.
              </p>
              <div className="flex space-x-3">
                {[
                  { 
                    name: 'Facebook', 
                    icon: <Facebook className="w-4 h-4" />,
                    url: 'https://www.facebook.com/people/Formateur-et-expert-Elmehdi-Fejjal/61582691739308/?rdid=MWgzwruRhFXAJ5CC&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1FkZpr46X7%2F'
                  },
                  { 
                    name: 'LinkedIn', 
                    icon: <Linkedin className="w-4 h-4" />,
                    url: 'https://www.linkedin.com/in/elmehdi-fejjal-275023390/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
                  },
                  { 
                    name: 'Instagram', 
                    icon: <Instagram className="w-4 h-4" />,
                    url: 'https://www.instagram.com/polaris.kenitra/'
                  }
                ].map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-700 hover:bg-[#F58723] rounded-lg transition-colors flex items-center justify-center"
                    whileHover={{ scale: 1.1, y: -2 }}
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
              <h4 className="font-bold text-lg mb-6 font-montserrat flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-[#F58723]" />
                Contact
              </h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 mt-1 text-[#F58723] flex-shrink-0" />
                  <span className="text-gray-400 text-sm leading-relaxed">
                    Angle Rue Maâmoura & Reine Élisabeth<br />Kénitra, Maroc
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-[#F58723] flex-shrink-0" />
                  <span className="text-gray-400">07 18 83 42 01</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-[#F58723] flex-shrink-0" />
                  <a href="mailto:fejjal1998@gmail.com" className="text-gray-400 hover:text-[#F58723] transition-colors">
                    fejjal1998@gmail.com
                  </a>
                </div>
              </div>
            </motion.div>

            {[
              {
                title: "Formations",
                links: ["Gestion Stratégique", "Contrôle de Gestion", "Audit Interne", "Management", "Certifications"]
              },
              {
                title: "Ressources",
                links: ["Brochure PDF", "FAQ", "Témoignages", "Blog", "Contact"]
              }
            ].map((column, index) => (
              <motion.div
                key={column.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 2) * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-bold text-lg mb-6 font-montserrat">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-[#F58723] transition-colors text-sm flex items-center group">
                        <ArrowRight className="w-3 h-3 mr-2 transform group-hover:translate-x-1 transition-transform" />
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
            <p className="text-gray-400 text-sm">
              © 2025 Institut Polaris.K. Tous droits réservés. | 
              <span className="text-[#F58723] mx-1">Formation à Distance d'Excellence</span>
              | Développé avec passion
            </p>
          </motion.div>
        </div>
      </footer>

      {/* Enhanced Floating CTA */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 2, duration: 0.5, type: "spring" }}
      >
        <motion.button
          onClick={() => scrollToSection('tarifs')}
          className="bg-gradient-to-r from-[#F58723] to-[#ff9a3d] text-white p-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all relative overflow-hidden group"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="flex items-center relative z-10">
            <Calendar className="w-5 h-5 mr-2" />
            S'inscrire
          </span>
        </motion.button>
      </motion.div>

      {/* Enhanced WhatsApp Button */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ scale: 0, opacity: 0, rotate: 180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 2.5, duration: 0.5, type: "spring" }}
      >
        <motion.button
          onClick={openWhatsApp}
          className="bg-green-500 text-white p-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all relative overflow-hidden group"
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
            <MessageCircle className="w-5 h-5 mr-2" />
            WhatsApp
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}

// Add missing Quote icon component
const Quote = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
  </svg>
);