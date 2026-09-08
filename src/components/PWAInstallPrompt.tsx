import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DownloadCloud, X, Sparkles, Smartphone, Check, Monitor } from "lucide-react";

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
        // Show after a gentle 2.5s delay for smooth page entrance
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 2500);
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
        <div className="fixed top-20 sm:top-24 inset-x-0 mx-auto z-40 px-3 sm:px-4 flex justify-center pointer-events-none w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full pointer-events-auto"
          >
            <div className="glass rounded-2xl p-3 sm:p-4 border border-cyan-bright/40 shadow-2xl shadow-cyan-glow/20 bg-card/95 backdrop-blur-xl relative flex items-center justify-between gap-3 text-left">
              {/* Ambient Background Glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-cyan-glow/15 to-purple-glow/15 rounded-full blur-xl pointer-events-none" />

              {/* Left: App Circular Avatar & Details */}
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-cyan-bright/40 shadow-md flex-shrink-0 bg-slate-950">
                  <img
                    src="/icons/icon-192.png"
                    alt="Ijlal Hussain App Icon"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-display font-bold text-xs sm:text-sm text-text-main truncate">
                      Install Portfolio App
                    </h4>
                    <span className="hidden xs:inline-flex sm:inline-flex items-center px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded bg-cyan-bright/15 text-cyan-bright border border-cyan-bright/30">
                      Desktop &amp; Mobile
                    </span>
                  </div>
                  <p className="font-sans text-[11px] text-text-muted truncate">
                    Add to Desktop or Android Home Screen
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={handleInstallClick}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-bright to-purple-bright text-slate-950 font-sans font-bold text-xs shadow-md shadow-cyan-glow/20 hover:opacity-95 transition-all btn-glow-cyan cursor-pointer whitespace-nowrap"
                >
                  {isSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Installed!</span>
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="w-3.5 h-3.5" />
                      <span>Install</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDismiss}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-muted hover:text-text-main transition-colors cursor-pointer border border-white/5"
                  title="Dismiss"
                  aria-label="Dismiss install prompt"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
