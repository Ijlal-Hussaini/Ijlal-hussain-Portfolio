/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import AboutView from "./components/AboutView";
import ProjectsView from "./components/ProjectsView";
import CertificationsView from "./components/CertificationsView";
import ContactView from "./components/ContactView";

export default function App() {
  const tabs = ["Home", "About", "Projects", "Certifications", "Contact"];
  const [activeTab, setActiveTab] = useState<string>("Home");
  const [isScrollVisible, setIsScrollVisible] = useState<boolean>(false);

  // Monitor page scroll to toggle the scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsScrollVisible(true);
      } else {
        setIsScrollVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Scroll to top of the page immediately on activeTab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle active view rendering based on tab state
  const renderActiveView = () => {
    switch (activeTab) {
      case "Home":
        return <HomeView onNavigate={(tab) => setActiveTab(tab)} />;
      case "About":
        return <AboutView />;
      case "Projects":
        return <ProjectsView />;
      case "Certifications":
        return <CertificationsView />;
      case "Contact":
        return <ContactView />;
      default:
        return <HomeView onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  // Stagger variants for initial page mount
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.05,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.5, ease: "easeOut" as const }
    },
  };

  const mainVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    },
  };

  const footerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.5, ease: "easeOut" as const }
    },
  };

  return (
    <motion.div
      id="portfolio-app-root"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-bg text-text-main flex flex-col justify-between selection:bg-cyan-glow/30 selection:text-cyan-bright"
    >
      
      {/* 1. Global Animated Cosmic Neon Orbs background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-Right Purple Aura */}
        <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] sm:w-[50vw] sm:h-[50vw] bg-purple-glow/5 rounded-full blur-[120px] animate-pulse-subtle" />
        
        {/* Mid-Left Cyan Aura */}
        <div className="absolute top-[35%] left-[-20%] w-[80vw] h-[80vw] sm:w-[60vw] sm:h-[60vw] bg-cyan-glow/5 rounded-full blur-[140px] animate-float" style={{ animationDuration: '10s' }} />
        
        {/* Bottom-Right Dark Indigo Aura */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] sm:w-[45vw] sm:h-[45vw] bg-purple-bright/5 rounded-full blur-[110px] animate-pulse-subtle" style={{ animationDelay: '2s' }} />
      </div>

      {/* 2. Header component */}
      <motion.div variants={headerVariants} className="w-full relative z-50">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      </motion.div>

      {/* 3. Main Stage Content Container with responsive margins */}
      <motion.main
        variants={mainVariants}
        className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative z-10 w-full"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {/* 4. Footer component */}
      <motion.div variants={footerVariants} className="w-full relative z-10">
        <Footer />
      </motion.div>

      {/* 5. Scroll-To-Top Dynamic Float Trigger */}
      <AnimatePresence>
        {isScrollVisible && (
          <motion.button
            id="scroll-to-top-btn"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-gradient-to-r from-cyan-bright to-purple-bright text-slate-950 shadow-lg shadow-cyan-glow/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-bright/50 btn-glow-cyan flex items-center justify-center transition-all"
            title="Scroll back to top"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

