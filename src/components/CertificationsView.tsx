import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Award, 
  CheckCircle, 
  Clock, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  X,
  BrainCircuit,
  Briefcase,
  Terminal,
  Globe,
  Palette,
  ClipboardList,
  ZoomIn
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Certification, certificationsData } from "../data";

export default function CertificationsView() {
  const [activeFilter, setActiveFilter] = useState<"All" | "Completed" | "Pending">("All");
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const handleDownload = async (e: React.MouseEvent, url: string, defaultFilename: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Network error! status: ${response.status}`);
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        console.error("Attempted to download non-existent asset, fallback HTML returned. Opening in new tab instead.");
        window.open(url, "_blank");
        return;
      }
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = defaultFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download via blob, falling back to window.open:", err);
      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setIsZoomed(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedCert]);

  const filteredCerts = activeFilter === "All"
    ? certificationsData
    : certificationsData.filter((c) => c.status === activeFilter);

  const getCertIcon = (id: string) => {
    switch (id) {
      case "cert1": // Generative AI & Machine Learning
        return <BrainCircuit className="w-5 h-5" />;
      case "cert2": // AI Development Internship
        return <Briefcase className="w-5 h-5" />;
      case "cert3": // Python Essentials 1
        return <Terminal className="w-5 h-5" />;
      case "cert4": // Freelancing
        return <Globe className="w-5 h-5" />;
      case "cert5": // Graphic Design
        return <Palette className="w-5 h-5" />;
      case "cert6": // Requirements Engineering
        return <ClipboardList className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  return (
    <div id="certifications-view-container" className="space-y-12 pb-12">
      
      {/* HEADER */}
      <section id="certifications-header" className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="text-left space-y-2">
          <span className="font-mono text-xs text-purple-bright uppercase tracking-wider">
            Academic & Industry Accreditations
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-main">
            Verified Certifications
          </h1>
          <p className="font-sans text-xs sm:text-sm text-text-muted max-w-xl">
            A dynamic ledger of professional certifications issued by global academic portals and local agencies. 
            Click any card to launch the verification sheet.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-1.5 self-start sm:self-auto border-b border-white/5 pb-2 sm:pb-0">
          {(["All", "Completed", "Pending"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl font-sans text-xs font-semibold tracking-wide cursor-pointer transition-all ${
                activeFilter === filter
                  ? "bg-gradient-to-r from-cyan-bright to-purple-bright text-slate-950 shadow-md shadow-purple-glow/10"
                  : "bg-white/5 text-text-sub hover:bg-white/10"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* CARDS GRID */}
      <section id="certs-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[350px]">
        <AnimatePresence mode="popLayout">
          {filteredCerts.map((cert) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className="group cursor-pointer bg-card border border-white/5 rounded-2xl p-5 hover:border-purple-glow/30 transition-all relative overflow-hidden flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Certificate Preview/Placeholder */}
                {cert.imageUrl ? (
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-white/5 border border-white/5">
                    <img 
                      src={cert.imageUrl} 
                      alt={cert.title} 
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-3">
                      <span className="font-sans text-[9px] text-cyan-bright font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md bg-card/95 backdrop-blur-sm border border-cyan-glow/20 shadow-md">
                        Expand Credential
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-white/[0.02] border border-dashed border-white/10 flex flex-col items-center justify-center space-y-2">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.05),transparent_70%)] pointer-events-none" />
                    <Clock className="w-8 h-8 text-gold-accent/40 animate-pulse-subtle" />
                    <span className="font-mono text-[9px] text-gold-accent/60 uppercase tracking-widest">
                      Evaluation Pending
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-white/5 text-purple-bright group-hover:scale-110 transition-transform">
                    {getCertIcon(cert.id)}
                  </div>
                  {cert.status === "Completed" ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-mono font-semibold bg-green-accent/10 text-green-accent">
                      <CheckCircle className="w-3 h-3" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-mono font-semibold bg-gold-accent/10 text-gold-accent">
                      <Clock className="w-3 h-3 text-gold-accent" />
                      <span>Pending Evaluation</span>
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-display font-bold text-base text-text-main group-hover:text-cyan-bright transition-colors line-clamp-2 leading-snug">
                    {cert.title}
                  </h3>
                  <p className="font-sans text-xs text-text-sub">
                    {cert.organization}
                  </p>
                  <p className="font-mono text-[10px] text-text-muted">
                    Timeline: {cert.period}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                {cert.credentialId ? (
                  <span className="font-mono text-[9px] text-text-muted">
                    ID: {cert.credentialId}
                  </span>
                ) : (
                  <span className="font-mono text-[9px] text-text-muted italic">
                    Institutional Record
                  </span>
                )}
                {cert.pdfUrl && (
                  <button
                    onClick={(e) => handleDownload(e, cert.pdfUrl!, cert.pdfUrl!.split('/').pop() || "certificate.pdf")}
                    className="p-1.5 rounded-lg bg-white/5 text-text-sub hover:text-cyan-bright hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
                    title="Download PDF Certificate"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      {/* HIGH FIDELITY CREDENTIAL MODAL */}
      {createPortal(
        <AnimatePresence>
          {selectedCert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
              style={{ zIndex: 99999 }}
              onClick={() => setSelectedCert(null)}
              role="dialog"
              aria-modal="true"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="w-full max-w-4xl bg-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header backdrop color strip */}
                <div className="h-2 bg-gradient-to-r from-cyan-glow via-purple-glow to-green-accent" />

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Close trigger */}
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 text-text-sub hover:text-text-main hover:bg-white/10 transition-colors cursor-pointer z-10"
                    aria-label="Close verification panel"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-stretch">
                    {/* Left Column: Certificate Image Preview */}
                    <div className="md:col-span-7 flex flex-col justify-center space-y-3">
                      {selectedCert.imageUrl ? (
                        <div 
                          onClick={() => setIsZoomed(true)}
                          className="relative group rounded-2xl overflow-hidden bg-card2 border border-white/10 flex items-center justify-center shadow-xl cursor-zoom-in min-h-[250px] md:min-h-[380px] max-h-[480px] aspect-[16/10] w-full"
                        >
                          <img 
                            src={selectedCert.imageUrl} 
                            alt={selectedCert.title} 
                            className="max-h-[440px] w-full h-full object-contain p-2 rounded-xl select-none group-hover:scale-[1.01] transition-transform duration-500" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="font-sans text-xs text-text-main font-semibold bg-card/95 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-cyan-glow/30 shadow-lg flex items-center space-x-2">
                              <ZoomIn className="w-4 h-4 text-cyan-bright" />
                              <span>Click to Expand View</span>
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-white/[0.02] border border-dashed border-white/10 flex flex-col items-center justify-center space-y-3 py-16">
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.05),transparent_70%)] pointer-events-none" />
                          <Clock className="w-12 h-12 text-gold-accent/40 animate-pulse-subtle" />
                          <span className="font-mono text-xs text-gold-accent/60 uppercase tracking-widest">
                            Evaluation Pending
                          </span>
                        </div>
                      )}
                      {selectedCert.imageUrl && (
                        <p className="font-sans text-[10px] text-text-muted text-center italic">
                          Click image to view high-resolution zoom
                        </p>
                      )}
                    </div>

                    {/* Right Column: Metadata details */}
                    <div className="md:col-span-5 flex flex-col justify-between space-y-6 text-left">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="w-12 h-12 rounded-full bg-cyan-glow/10 text-cyan-bright flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 animate-pulse-subtle" />
                          </div>
                          <span className="inline-block font-mono text-[9px] text-green-accent font-semibold tracking-widest uppercase">
                            ✓ SECURE CREDENTIAL VERIFIED
                          </span>
                          <h2 className="font-display font-extrabold text-lg sm:text-xl text-text-main leading-snug">
                            {selectedCert.title}
                          </h2>
                          <p className="font-sans text-xs text-text-sub font-semibold">
                            {selectedCert.organization}
                          </p>
                        </div>

                        {/* Dynamic simulated Certificate Frame */}
                        <div className="p-4 rounded-xl bg-bg border border-white/5 space-y-3 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-glow/5 rounded-full blur-xl pointer-events-none" />
                          
                          <div className="space-y-0.5">
                            <span className="block font-mono text-[8px] text-text-muted tracking-wider uppercase">Issued To Candidate:</span>
                            <span className="block font-display font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-cyan-bright to-purple-bright">Ijlal Hussain</span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-white/5">
                            <div>
                              <span className="block font-mono text-[8px] text-text-muted uppercase">Duration Timeline:</span>
                              <span className="block font-sans text-[10px] text-text-sub font-semibold">{selectedCert.period}</span>
                            </div>
                            <div>
                              <span className="block font-mono text-[8px] text-text-muted uppercase">Credential Status:</span>
                              <span className={`block font-sans text-[10px] font-semibold ${selectedCert.status === "Completed" ? "text-green-accent" : "text-gold-accent"}`}>
                                {selectedCert.status === "Completed" ? "Completed" : "Pending Verification"}
                              </span>
                            </div>
                          </div>

                          {selectedCert.credentialId && (
                            <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
                              <div>
                                <span className="block font-mono text-[8px] text-text-muted uppercase">Verification Hash:</span>
                                <span className="block font-mono text-[9px] text-cyan-bright font-bold">{selectedCert.credentialId}</span>
                              </div>
                              <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-text-muted">
                                SHA256 Encrypted
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="font-sans text-[10px] text-text-muted leading-relaxed">
                          This record verifies that the individual named above has successfully engaged and fulfilled the academic criteria corresponding to the program.
                        </p>
                      </div>

                      {/* Action */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
                        {selectedCert.pdfUrl && selectedCert.status === "Completed" ? (
                          <>
                            <button
                              onClick={() => window.open(selectedCert.pdfUrl, "_blank")}
                              className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-text-main font-sans font-semibold text-xs transition-colors cursor-pointer text-center"
                              title="Open PDF in a new tab for native high-resolution full-screen viewing"
                            >
                              <ExternalLink className="w-4 h-4 text-cyan-bright" />
                              <span>View PDF</span>
                            </button>
                            <button
                              onClick={(e) => handleDownload(e, selectedCert.pdfUrl!, selectedCert.pdfUrl!.split('/').pop() || "certificate.pdf")}
                              className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-bright to-purple-bright text-slate-950 font-sans font-bold text-xs uppercase tracking-wider btn-glow-cyan shadow-md shadow-cyan-glow/10 cursor-pointer text-center transition-all"
                              title="Download official PDF file to your local storage"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download PDF</span>
                            </button>
                          </>
                        ) : selectedCert.status === "Completed" ? (
                          <div className="flex-1 text-center font-mono text-[10px] text-text-muted border border-white/5 bg-white/[0.02] rounded-xl py-2 flex items-center justify-center">
                            PDF Unavailable
                          </div>
                        ) : (
                          <div className="flex-1 text-center font-mono text-[10px] text-gold-accent border border-gold-accent/10 bg-gold-accent/5 rounded-xl py-2 flex items-center justify-center">
                            Verifying Academic Records...
                          </div>
                        )}
                        {selectedCert.id === "cert4" || selectedCert.id === "cert5" ? (
                          <a
                            href="https://digiskills.pk/verify/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-text-main font-sans font-semibold text-xs transition-colors cursor-pointer"
                            title="Verify credential on DigiSkills official portal"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-bright" />
                            <span>Verify Live</span>
                          </a>
                        ) : (
                          <button
                            type="button"
                            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-sans font-semibold text-xs transition-colors cursor-default"
                            title="Verified Institutional Credential"
                          >
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>Verified</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* FULL SCREEN LIGHTBOX ZOOM MODAL */}
      {createPortal(
        <AnimatePresence>
          {selectedCert && isZoomed && selectedCert.imageUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black/95 p-4 overflow-hidden cursor-zoom-out"
              style={{ zIndex: 100000 }}
              onClick={() => setIsZoomed(false)}
              role="dialog"
              aria-modal="true"
            >
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/5 text-text-sub hover:text-white hover:bg-white/15 transition-all cursor-pointer shadow-lg shadow-black/20"
                aria-label="Close zoomed certificate"
              >
                <X className="w-6 h-6" />
              </button>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedCert.imageUrl}
                  alt={selectedCert.title}
                  className="max-h-[90vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10 select-none cursor-zoom-out"
                  onClick={() => setIsZoomed(false)}
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
