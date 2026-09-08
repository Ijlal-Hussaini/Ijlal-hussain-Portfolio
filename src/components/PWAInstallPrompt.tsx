import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DownloadCloud, X, Sparkles, Smartphone, Check } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Check if already running as installed standalone PWA
    if (
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true)
    ) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed in this session
    const wasDismissed = sessionStorage.getItem("pwa_prompt_dismissed");

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent standard browser mini-infobar
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Expose globally so header/drawer install buttons can invoke it
      (window as unknown as { pwaPrompt?: BeforeInstallPromptEvent }).pwaPrompt = promptEvent;

      if (!wasDismissed) {
        // Show after a slight delay for smooth page entrance
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
      (window as unknown as { pwaPrompt?: null }).pwaPrompt = null;
    };

    // Allow custom events from other components (like Header) to open install prompt
    const handleTriggerInstall = () => {
      handleInstallClick();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("trigger-pwa-install", handleTriggerInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("trigger-pwa-install", handleTriggerInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || (window as unknown as { pwaPrompt?: BeforeInstallPromptEvent }).pwaPrompt;

    if (!promptEvent) {
      // Fallback instruction for browsers like iOS Safari or Firefox
      alert("To install this app on your device:\n\n• On iOS (Safari): Tap the Share button and select 'Add to Home Screen'.\n• On Desktop Chrome/Edge: Click the install icon (⬇️) in the address bar.");
      return;
    }

    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === "accepted") {
        setIsSuccess(true);
        setTimeout(() => {
          setIsVisible(false);
          setIsInstalled(true);
        }, 2000);
      } else {
        setIsVisible(false);
        sessionStorage.setItem("pwa_prompt_dismissed", "true");
      }
      setDeferredPrompt(null);
      (window as unknown as { pwaPrompt?: null }).pwaPrompt = null;
    } catch {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("pwa_prompt_dismissed", "true");
  };

  if (isInstalled || !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-6 left-4 sm:left-6 z-[99999] max-w-sm w-[calc(100vw-2rem)] sm:w-auto"
        >
          <div className="glass rounded-2xl p-4 sm:p-5 border border-cyan-bright/30 shadow-2xl shadow-cyan-glow/15 bg-card/95 backdrop-blur-xl relative flex flex-col space-y-3.5 text-left">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-glow/10 rounded-full blur-xl pointer-events-none" />

            {/* Header: Icon + Title + Close Button */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-bright/20 to-purple-bright/20 border border-cyan-bright/30 flex items-center justify-center text-cyan-bright flex-shrink-0 shadow-inner">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-text-main flex items-center gap-1.5">
                    Install Portfolio App
                    <Sparkles className="w-3.5 h-3.5 text-cyan-bright animate-pulse" />
                  </h4>
                  <p className="font-sans text-[11px] text-text-muted">
                    Add to Desktop or Android Home Screen
                  </p>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="p-1 rounded-lg text-text-muted hover:text-text-main hover:bg-white/10 transition-colors cursor-pointer"
                title="Dismiss"
                aria-label="Dismiss install prompt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Feature Note */}
            <p className="font-sans text-xs text-text-sub leading-relaxed">
              Launch directly from your desktop or phone with zero loading delay, offline support, and native window experience.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={handleInstallClick}
                className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-bright to-purple-bright text-slate-950 font-sans font-bold text-xs uppercase tracking-wider shadow-md shadow-cyan-glow/20 hover:opacity-95 transition-all btn-glow-cyan cursor-pointer"
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Installed!</span>
                  </>
                ) : (
                  <>
                    <DownloadCloud className="w-4 h-4" />
                    <span>Install to Device</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDismiss}
                className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-muted hover:text-text-main font-sans text-xs font-semibold transition-colors cursor-pointer border border-white/5"
              >
                Not Now
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
