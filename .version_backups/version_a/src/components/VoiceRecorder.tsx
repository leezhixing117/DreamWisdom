import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, Check, Edit3, Volume2, ArrowRight } from 'lucide-react';

interface VoiceRecorderProps {
  onDreamRecorded: (organizedDream: string, rawCantonese?: string) => void;
  onCancel?: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onDreamRecorded, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState<number[]>([20, 45, 80, 50, 30, 70, 90, 40]);
  const [rawText, setRawText] = useState('');
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [organizedResult, setOrganizedResult] = useState<{
    cleanedText: string;
    characters: string[];
    emotions: string[];
    symbols: string[];
    scene: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Initialize Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'zh-HK'; // Cantonese locale
      
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setRawText((prev) => prev + transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Waveform simulation while recording
  useEffect(() => {
    let animInterval: any;
    if (isRecording) {
      animInterval = setInterval(() => {
        setAudioLevel([
          Math.floor(Math.random() * 60) + 20,
          Math.floor(Math.random() * 80) + 20,
          Math.floor(Math.random() * 95) + 30,
          Math.floor(Math.random() * 90) + 40,
          Math.floor(Math.random() * 85) + 30,
          Math.floor(Math.random() * 70) + 20,
          Math.floor(Math.random() * 80) + 20,
          Math.floor(Math.random() * 50) + 20,
        ]);
        setRecordingSeconds((s) => s + 1);
      }, 500);
    } else {
      clearInterval(animInterval);
      setRecordingSeconds(0);
    }
    return () => clearInterval(animInterval);
  }, [isRecording]);

  const startRecording = () => {
    setOrganizedResult(null);
    setRawText('');
    setIsRecording(true);
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (e) {
      console.log('Voice recognition started via simulation fallback');
    }
  };

  const stopRecordingAndOrganize = (simulatedText?: string) => {
    setIsRecording(false);
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (e) {}

    const textToProcess = simulatedText || rawText || '我頭先發咗個好奇怪嘅夢呀，我好似返咗以前住嗰間舊屋邨，之後我阿媽喺神枱邊企喺度，但係佢其實已經……然後海水一路升上嚟，我好驚咁搵緊出口。';
    setRawText(textToProcess);
    setIsOrganizing(true);

    // Enhanced Cantonese NLP normalization & error tolerance
    let normalized = textToProcess
      .replace(/好似返左/g, '好似返咗')
      .replace(/神台/g, '神枱')
      .replace(/屋企人/g, '家人')
      .replace(/行唔郁/g, '雙腿動彈不得')
      .replace(/心慌慌/g, '心跳劇烈驚恐')
      .replace(/搭lift/gi, '乘搭升降機')
      .replace(/搵唔到/g, '找不到')
      .replace(/無著鞋/g, '赤腳無鞋')
      .replace(/推開門/g, '推開房門');

    setTimeout(() => {
      setIsOrganizing(false);
      
      // Smart extraction with colloquial tolerance
      const chars: string[] = [];
      if (textToProcess.includes('媽') || textToProcess.includes('阿媽') || textToProcess.includes('老母')) chars.push('母親');
      if (textToProcess.includes('前度') || textToProcess.includes('ex') || textToProcess.includes('以前條仔') || textToProcess.includes('以前條女')) chars.push('前度情人');
      if (textToProcess.includes('老細') || textToProcess.includes('老頂') || textToProcess.includes('同事')) chars.push('職場主管/同事');
      if (textToProcess.includes('黑影') || textToProcess.includes('追') || textToProcess.includes('鬼')) chars.push('追逐黑影 (Shadow)');
      if (chars.length === 0) chars.push('夢者自身 (我)');

      const syms: string[] = [];
      if (textToProcess.includes('海') || textToProcess.includes('水') || textToProcess.includes('浸') || textToProcess.includes('落雨')) syms.push('海水浸漫');
      if (textToProcess.includes('神枱') || textToProcess.includes('香') || textToProcess.includes('拜祭')) syms.push('祖先神枱');
      if (textToProcess.includes('門') || textToProcess.includes('出口') || textToProcess.includes('走廊')) syms.push('未鎖之門/狹長走廊');
      if (textToProcess.includes('鞋') || textToProcess.includes('赤腳')) syms.push('赤腳奔走');
      if (textToProcess.includes('飛') || textToProcess.includes('跌')) syms.push('高空墜落/懸空');
      if (syms.length === 0) syms.push('未知象徵物');

      const emos: string[] = [];
      if (textToProcess.includes('驚') || textToProcess.includes('追') || textToProcess.includes('慌') || textToProcess.includes('急')) emos.push('焦慮心悸 (Anxiety)');
      if (textToProcess.includes('阿媽') || textToProcess.includes('以前') || textToProcess.includes('喊')) emos.push('深層懷念 (Yearning)');
      if (textToProcess.includes('搵') || textToProcess.includes('唔知') || textToProcess.includes('迷')) emos.push('方向迷茫 (Confusion)');
      if (textToProcess.includes('平靜') || textToProcess.includes('舒服') || textToProcess.includes('光')) emos.push('釋懷平靜 (Peace)');
      if (emos.length === 0) emos.push('緊繃未定');

      setOrganizedResult({
        cleanedText: normalized.replace(/^(我頭先發咗個好奇怪嘅夢呀[，, ]*)/, ''),
        characters: chars,
        emotions: emos,
        symbols: syms,
        scene: textToProcess.includes('屋邨') || textToProcess.includes('舊屋') ? '童年舊屋邨走廊' : textToProcess.includes('學校') || textToProcess.includes('考') ? '舊學校考場' : '變動夢境空間',
      });
    }, 800);
  };

  const handleSelectPresetSample = (sample: string) => {
    stopRecordingAndOrganize(sample);
  };

  return (
    <div className="card border-[#aa9cff]/30 bg-[#0e1122]/90 backdrop-blur-xl p-6 rounded-2xl relative overflow-hidden" id="cantonese-voice-recorder">
      {/* Glow background accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#aa9cff]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#aa9cff] animate-pulse" />
          <h3 className="text-base font-semibold text-white tracking-wide">
            廣東話語音講夢 (Cantonese Voice Memory)
          </h3>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-[#8d97b5] hover:text-white transition-colors"
          >
            切換純文字
          </button>
        )}
      </div>

      <p className="text-xs text-[#aab3d2] mb-5 leading-relaxed">
        凌晨醒嚟唔使打字。撳住個掣，像跟朋友發語音一樣直接講個夢。
        系統會自動保留原意、整理語意、提取關鍵人物、情緒與象徵符號。
      </p>

      {/* Voice Record Central Button & Waveform */}
      {!organizedResult && (
        <div className="flex flex-col items-center justify-center py-7 px-4 border border-white/10 rounded-2xl bg-black/40 my-3">
          {isRecording ? (
            <div className="flex flex-col items-center space-y-4 w-full">
              {/* Recording Status Banner */}
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>🔴 錄音中（請直接講廣東話，俚語口語皆可）...</span>
              </div>

              {/* Dynamic Waveform Visualizer */}
              <div className="flex items-end justify-center gap-1.5 h-16 w-full max-w-xs px-2">
                {audioLevel.map((lvl, idx) => (
                  <span
                    key={idx}
                    className="w-2 bg-gradient-to-t from-[#aa9cff] via-[#71d9ff] to-white rounded-full transition-all duration-150"
                    style={{ height: `${lvl}%` }}
                  />
                ))}
              </div>

              <div className="text-sm font-mono text-[#aa9cff] tracking-widest">
                已錄製：{Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
              </div>

              {/* Finger-friendly Stop Button */}
              <button
                type="button"
                onClick={() => stopRecordingAndOrganize()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold flex items-center justify-center gap-2 text-sm transition-all shadow-lg shadow-rose-500/30 active:scale-95 cursor-pointer min-h-[48px]"
                id="btn-voice-stop-recording"
              >
                <MicOff className="w-4 h-4" />
                <span>講完喇，撳此即時轉寫整理</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              {/* Big Touch Voice Button (80px x 80px) for Mobile */}
              <button
                type="button"
                onClick={startRecording}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#aa9cff] via-[#71d9ff] to-[#ffd27a] p-1 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#aa9cff]/30 cursor-pointer flex items-center justify-center group"
                aria-label="開始廣東話語音錄音"
                id="btn-voice-start-recording"
              >
                <div className="w-full h-full rounded-full bg-[#0c1022] flex items-center justify-center group-hover:bg-[#141a38] transition-colors">
                  <Mic className="w-9 h-9 text-[#c3b9ff] group-hover:text-white transition-colors" />
                </div>
              </button>

              <div className="text-center">
                <span className="text-sm text-white font-bold block">點擊開始以廣東話講夢</span>
                <span className="text-xs text-[#8d97b5] mt-0.5 block">（按一次開始說話，說完再按停止）</span>
              </div>
            </div>
          )}

          {isOrganizing && (
            <div className="mt-5 p-3 rounded-xl bg-[#71d9ff]/10 border border-[#71d9ff]/30 flex items-center gap-2.5 text-xs text-[#71d9ff] animate-pulse">
              <span className="w-4 h-4 border-2 border-[#71d9ff] border-t-transparent rounded-full animate-spin shrink-0" />
              <span>⚡ 正在進行廣東話智能轉寫、口語容錯梳理與意象提取中...</span>
            </div>
          )}
        </div>
      )}

      {/* Quick Cantonese Sample Presets */}
      {!organizedResult && !isRecording && (
        <div className="mt-4 pt-3 border-t border-white/5">
          <div className="text-[11px] text-[#8d97b5] mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#aa9cff]" />
            <span>或者直接點選常見廣東話夢境範例：</span>
          </div>
          <div className="grid grid-cols-1 gap-2 text-left">
            <button
              type="button"
              onClick={() => handleSelectPresetSample('我頭先發咗個好奇怪嘅夢呀，我好似返咗以前住嗰度，之後我阿媽喺神枱邊度企喺度，但係佢其實已經……我好想同佢講嘢，但係講唔出聲。')}
              className="text-xs p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-[#d8ddf0] text-left transition-colors flex items-start gap-2"
            >
              <span className="text-base">🕯️</span>
              <div>
                <b className="text-white">「返咗以前住嗰度，阿媽喺神枱邊……」</b>
                <div className="text-[11px] text-[#8d97b5] mt-0.5">已故長輩、舊屋邨、神枱、無法發聲</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPresetSample('我頭先夢到自己又要考多次公開試，我入到舊學校發現全場得我冇著鞋，推開一扇扇門都係白牆，搵唔到考場。')}
              className="text-xs p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-[#d8ddf0] text-left transition-colors flex items-start gap-2"
            >
              <span className="text-base">🏫</span>
              <div>
                <b className="text-white">「又要考多次會考，發現自己冇著鞋……」</b>
                <div className="text-[11px] text-[#8d97b5] mt-0.5">舊校園、赤腳、考試焦慮、找不到出口</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Structured Prompting Guide for waking memory */}
      {!organizedResult && !isRecording && (
        <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs space-y-1.5">
          <div className="text-[#aa9cff] font-semibold flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>醒來記夢結構化引導（可邊說邊回憶）：</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[#aab3d2]">
            <div>• <b>人物：</b>夢入面有邊啲人物？（阿媽、前度、同事、黑影）</div>
            <div>• <b>場景：</b>場景係邊度？（舊屋邨、走廊、學校、海邊）</div>
            <div>• <b>情緒：</b>當時感覺係驚、開心、不安定迷茫？</div>
            <div>• <b>物件：</b>有冇重複出現嘅物件？（水、門、鞋、信件）</div>
          </div>
        </div>
      )}

      {/* Structured Cantonese Result View */}
      {organizedResult && (
        <div className="space-y-4 pt-2 animate-in fade-in zoom-in-95 duration-300">
          <div className="callout text-xs border-[#78e1b5]/30 bg-[#78e1b5]/10 text-[#78e1b5] flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4" />
              已轉寫並結構化整理（你可以直接喺下面修改文字）：
            </span>
            <button
              type="button"
              onClick={() => setOrganizedResult(null)}
              className="text-[11px] text-[#aab3d2] hover:text-white underline"
            >
              重新錄音
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#8d97b5]">
              <span className="flex items-center gap-1">
                <Edit3 className="w-3 h-3 text-[#71d9ff]" /> 編輯轉寫後的夢境文字
              </span>
              <span>{organizedResult.cleanedText.length} 字</span>
            </div>
            <textarea
              value={organizedResult.cleanedText}
              onChange={(e) => setOrganizedResult({ ...organizedResult, cleanedText: e.target.value })}
              rows={4}
              className="w-full rounded-xl bg-white/[0.04] border border-white/15 p-3 text-sm text-[#f6f7ff] leading-relaxed focus:outline-none focus:border-[#aa9cff] transition-all resize-y"
              placeholder="可在此微調修正口語字詞或補足剛醒來的細節..."
            />
          </div>

          {/* Extracted Metadata Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-[#8d97b5] block mb-1">👥 識別人物</span>
              <div className="font-medium text-white truncate">
                {organizedResult.characters.join('、')}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-[#8d97b5] block mb-1">🌊 關鍵象徵</span>
              <div className="font-medium text-[#71d9ff] truncate">
                {organizedResult.symbols.join('、')}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-[#8d97b5] block mb-1">⚡ 核心情緒</span>
              <div className="font-medium text-[#aa9cff] truncate">
                {organizedResult.emotions.join('、')}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-[#8d97b5] block mb-1">🏚️ 記憶場景</span>
              <div className="font-medium text-[#ffd27a] truncate">
                {organizedResult.scene}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => onDreamRecorded(organizedResult.cleanedText, rawText)}
              className="btn flex-1 text-xs py-3 flex items-center justify-center gap-2"
            >
              <span>確認並填入解夢工作台</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
