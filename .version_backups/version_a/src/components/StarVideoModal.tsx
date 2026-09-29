import React, { useState, useEffect, useRef } from 'react';
import { AdVideoItem, User } from '../types';
import { trackAdWatchEvent } from '../utils/auditLogger';
import { X, Sparkles, Volume2, VolumeX, CheckCircle, Star, Tv, Info, MessageSquare, Play, Pause, RotateCcw } from 'lucide-react';

interface StarVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarnStar: () => void;
  currentStars: number;
  currentUser?: User | null;
  adVideos?: AdVideoItem[];
}

export const StarVideoModal: React.FC<StarVideoModalProps> = ({
  isOpen,
  onClose,
  onEarnStar,
  currentStars,
  currentUser = null,
  adVideos = [],
}) => {
  const [currentAd, setCurrentAd] = useState<AdVideoItem | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(10);
  const [totalDuration, setTotalDuration] = useState(10);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeDialogueIndex, setActiveDialogueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Pick a random active ad from database or fallback when modal opens
  useEffect(() => {
    if (isOpen) {
      const activeAds = adVideos.filter((ad) => ad.isActive);
      const chosenAd =
        activeAds.length > 0
          ? activeAds[Math.floor(Math.random() * activeAds.length)]
          : adVideos[0] || null;

      setCurrentAd(chosenAd);
      const dur = chosenAd?.durationSeconds || 10;
      setTotalDuration(dur);
      setSecondsRemaining(dur);
      setIsCompleted(false);
      setHasClaimed(false);
      setActiveDialogueIndex(0);
      setIsPlaying(true);
    } else {
      stopAmbientAudio();
    }
  }, [isOpen, adVideos]);

  // Dialogue progression synchronization
  useEffect(() => {
    if (!isOpen || !currentAd?.dialogueDialogue || currentAd.dialogueDialogue.length === 0) return;
    const dialogCount = currentAd.dialogueDialogue.length;
    const elapsed = totalDuration - secondsRemaining;
    const intervalPerDialog = totalDuration / dialogCount;
    const curIndex = Math.min(dialogCount - 1, Math.floor(elapsed / Math.max(1, intervalPerDialog)));
    setActiveDialogueIndex(curIndex);
  }, [secondsRemaining, totalDuration, currentAd, isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || isCompleted || !isPlaying || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isCompleted, isPlaying, secondsRemaining]);

  // Ambient sound synthesizer
  const startAmbientAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Harmonic 432Hz deep meditative ambient sound
      osc.frequency.setValueAtTime(216, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
      setIsMuted(false);
    } catch (e) {
      console.warn('Audio play restricted by browser policy', e);
    }
  };

  const stopAmbientAudio = () => {
    try {
      if (gainRef.current && audioContextRef.current) {
        gainRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      }
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    } catch {
      // ignore
    }
    audioContextRef.current = null;
    oscRef.current = null;
    gainRef.current = null;
    setIsMuted(true);
  };

  const toggleSound = () => {
    if (isMuted) {
      startAmbientAudio();
    } else {
      stopAmbientAudio();
    }
  };

  const handleClaim = () => {
    if (hasClaimed) return;
    setHasClaimed(true);
    stopAmbientAudio();
    if (currentAd) {
      trackAdWatchEvent(currentUser, currentAd, true);
    }
    onEarnStar();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round(((totalDuration - secondsRemaining) / Math.max(1, totalDuration)) * 100));

  const currentDialogue = currentAd?.dialogueDialogue?.[activeDialogueIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      id="star-video-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-white/20 overflow-hidden shadow-2xl bg-[#090b15] text-white flex flex-col max-h-[92vh]"
        id="star-video-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-black/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-xs font-bold border border-amber-400/30">
              <Star className="w-4 h-4 fill-amber-300" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  廣告贊助儲星池
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-white/10 text-white/80 border border-white/10">
                  {currentAd?.category === 'alien_philosophy'
                    ? '👽 星際哲學'
                    : currentAd?.category === 'brand_sponsor'
                    ? '🌿 選物贊助'
                    : '🌙 療癒聲景'}
                </span>
              </div>
              <span className="text-[11px] text-[#8d97b5] block">
                你的目前星星結餘：<b className="text-amber-200">{currentStars}</b> 顆
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#aab3d2] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Canvas Stage */}
        <div
          className={`relative min-h-[280px] sm:min-h-[320px] w-full bg-gradient-to-b ${
            currentAd?.bgGradient || 'from-[#0d0720] via-[#1a0f3d] to-[#05020c]'
          } flex flex-col justify-between p-5 text-center overflow-hidden`}
        >
          {/* Background Poster Visual with blur if available */}
          {currentAd?.posterUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none mix-blend-luminosity scale-105 transition-transform duration-1000"
              style={{ backgroundImage: `url(${currentAd.posterUrl})` }}
            />
          )}

          {/* Glowing Aura Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-35">
            <div
              className="absolute top-1/4 left-1/4 w-44 h-44 rounded-full blur-3xl"
              style={{ backgroundColor: currentAd?.accentColor || '#aa9cff' }}
            />
            <div className="absolute bottom-1/4 right-1/4 w-44 h-44 rounded-full bg-white/20 blur-3xl" />
          </div>

          {/* Top Advertiser Tag */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-[#cbd2ef]">
              <Tv className="w-3 h-3 text-emerald-400" />
              <span>贊助商：{currentAd?.advertiser || 'DreamWisdom Partner'}</span>
            </span>

            <div className="px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-xs font-mono text-amber-300 flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 fill-amber-300" />
              <span>完播獎勵 +{currentAd?.rewardStars || 1} 星</span>
            </div>
          </div>

          {/* Center Content: Title & Dynamic Interactive Video Dialogue */}
          <div className="relative z-10 my-auto py-3 max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border border-white/25 bg-black/40 backdrop-blur-md shadow-lg">
              <Sparkles className="w-7 h-7" style={{ color: currentAd?.accentColor || '#78e1b5' }} />
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                {currentAd?.title}
              </h3>
              <p className="text-xs text-[#cbd2ef] mt-1 leading-relaxed line-clamp-2 px-2">
                {currentAd?.tagline}
              </p>
            </div>

            {/* Dynamic Dialogue Subtitles Box */}
            {currentDialogue ? (
              <div className="p-3.5 rounded-2xl bg-black/70 border border-white/20 backdrop-blur-md text-left space-y-1.5 shadow-xl transition-all duration-300 animate-fade-in">
                <div className="flex items-center justify-between text-[11px]">
                  <span
                    className="font-bold flex items-center gap-1"
                    style={{ color: currentAd?.accentColor || '#78e1b5' }}
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>{currentDialogue.speaker}：</span>
                  </span>
                  <span className="text-[#8d97b5] font-mono">
                    對話 {activeDialogueIndex + 1}/{currentAd?.dialogueDialogue?.length || 1}
                  </span>
                </div>
                <p className="text-xs text-white leading-relaxed font-sans font-medium">
                  {currentDialogue.text}
                </p>
              </div>
            ) : null}
          </div>

          {/* Bottom Bar Controls inside player */}
          <div className="relative z-10 flex items-center justify-between pt-2">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className="p-2 px-3 rounded-xl bg-black/60 border border-white/15 text-xs text-white/90 hover:bg-black/80 flex items-center gap-1.5 transition-colors cursor-pointer backdrop-blur-md"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-[#8d97b5]" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{isMuted ? '開啟聲景' : '靜音'}</span>
            </button>

            {/* Play / Pause Toggle */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 px-3 rounded-xl bg-black/60 border border-white/15 text-xs text-white/90 hover:bg-black/80 flex items-center gap-1.5 transition-colors cursor-pointer backdrop-blur-md"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-300" />
                  <span>暫停</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>繼續</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar & Reward Controls */}
        <div className="p-5 bg-[#0c1020] border-t border-white/10 space-y-3.5 shrink-0">
          <div>
            <div className="flex items-center justify-between text-xs text-[#aab3d2] mb-1.5">
              <span>{isCompleted ? '✓ 廣告觀看完成！點擊領取' : '廣告播放中，請勿關閉視窗…'}</span>
              <span className="font-mono text-white font-semibold">
                {isCompleted ? `${totalDuration}/${totalDuration} 秒` : `剩餘 ${secondsRemaining} 秒`}
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full transition-all duration-1000 ease-linear rounded-full bg-gradient-to-r from-[#aa9cff] via-[#71d9ff] to-amber-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action Button */}
          {isCompleted ? (
            <button
              type="button"
              onClick={handleClaim}
              disabled={hasClaimed}
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                hasClaimed
                  ? 'bg-[#78e1b5]/20 text-[#78e1b5] border border-[#78e1b5]/40'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/25 active:scale-98'
              }`}
              id="btn-claim-star-reward"
            >
              {hasClaimed ? (
                <>
                  <CheckCircle className="w-4 h-4 text-[#78e1b5]" />
                  <span>已成功入帳！星星 +{currentAd?.rewardStars || 1} ⭐（現有 {currentStars + (currentAd?.rewardStars || 1)} 顆）</span>
                </>
              ) : (
                <>
                  <Star className="w-4 h-4 fill-black" />
                  <span>點擊領取 {currentAd?.rewardStars || 1} 顆夢境星星 ⭐</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center justify-between text-xs text-[#8d97b5] px-1">
              <span>倒數完成後立即派發星星幣，可用於執行初步解夢（3星）及 Dream Master 深度解夢（6星）。</span>
              <button
                type="button"
                onClick={onClose}
                className="text-[#aab3d2] hover:text-white underline cursor-pointer text-xs"
              >
                略過廣告
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
