import React, { useState, useRef, useMemo } from 'react';
import { ConstellationNode, ConstellationLink, DreamEntry } from '../types';
import {
  Sparkles,
  Compass,
  Download,
  ExternalLink,
  Plus,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
  Search,
  Eye,
  Sun,
  Moon,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface DreamConstellationViewProps {
  nodes: ConstellationNode[];
  links: ConstellationLink[];
  dreams: DreamEntry[];
  onOpenReportDetail: (entry: DreamEntry) => void;
  onRecordNewDream?: () => void;
  focusedSymbol?: string;
  onAddCustomLink?: (link: ConstellationLink) => void;
}

export const DreamConstellationView: React.FC<DreamConstellationViewProps> = ({
  nodes: initialNodes,
  links: initialLinks,
  dreams,
  onOpenReportDetail,
  onRecordNewDream,
  focusedSymbol,
  onAddCustomLink,
}) => {
  const [nodes, setNodes] = useState<ConstellationNode[]>(initialNodes);
  const [links, setLinks] = useState<ConstellationLink[]>(initialLinks);

  // Canvas visual theme mode: 'daylight' (bright, high-contrast, clear default) vs 'cosmos' (deep navy with big white badges)
  const [canvasTheme, setCanvasTheme] = useState<'daylight' | 'cosmos'>('daylight');

  // Interactive guide expanded toggle
  const [showHowToUse, setShowHowToUse] = useState<boolean>(false);

  // Sync if props change
  React.useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  React.useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks]);

  // Selected star state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(() => {
    if (initialNodes.length > 0) return initialNodes[0].id;
    return null;
  });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Filter state
  const [activeSymbolFilter, setActiveSymbolFilter] = useState<string>(focusedSymbol || '');

  // Manual connection mode
  const [isConnectMode, setIsConnectMode] = useState(false);
  const [connectFirstNodeId, setConnectFirstNodeId] = useState<string | null>(null);
  const [connectionNotice, setConnectionNotice] = useState<string | null>(null);

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Extracted unique symbols for filter pills
  const availableSymbols = useMemo(() => {
    const set = new Set<string>();
    nodes.forEach((n) => {
      const sym = n.primarySymbol.split('/')[0].trim().replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
      if (sym) set.add(sym);
    });
    return Array.from(set).slice(0, 6);
  }, [nodes]);

  // Find active node & corresponding dream
  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  const activeDream = dreams.find(
    (d) => d.id === activeNode?.dreamId || (activeNode && activeNode.id.includes(d.id))
  );

  // Filter links related to selected or hovered node
  const activeLinks = useMemo(() => {
    if (!activeNode) return [];
    return links.filter(
      (l) =>
        l.sourceId === activeNode.id ||
        l.targetId === activeNode.id ||
        (hoveredNodeId && (l.sourceId === hoveredNodeId || l.targetId === hoveredNodeId))
    );
  }, [links, activeNode, hoveredNodeId]);

  // Dynamic coordinate spreader: scales and spreads nodes generously across 1000 x 620 canvas
  const normalizedCoords = useMemo(() => {
    if (!nodes || nodes.length === 0) return {};
    let minX = 100, maxX = 0, minY = 100, maxY = 0;
    nodes.forEach((n) => {
      if (n.x < minX) minX = n.x;
      if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.y > maxY) maxY = n.y;
    });

    const spanX = Math.max(1, maxX - minX);
    const spanY = Math.max(1, maxY - minY);

    const map: Record<string, { cx: number; cy: number }> = {};
    nodes.forEach((n, idx) => {
      // If points are clustered, spread them across wide elliptical coordinates
      if (spanX < 15 || spanY < 15) {
        const angle = (idx / nodes.length) * Math.PI * 2 - Math.PI / 2;
        const cx = 500 + Math.cos(angle) * 360;
        const cy = 300 + Math.sin(angle) * 200;
        map[n.id] = { cx, cy };
      } else {
        // Generously map across 110px..890px width and 90px..520px height
        const normX = (n.x - minX) / spanX;
        const normY = (n.y - minY) / spanY;
        const cx = Math.round(110 + normX * 780);
        const cy = Math.round(90 + normY * 430);
        map[n.id] = { cx, cy };
      }
    });
    return map;
  }, [nodes]);

  const getCanvasCoords = (id: string, fallbackX: number, fallbackY: number) => {
    if (normalizedCoords[id]) return normalizedCoords[id];
    return {
      cx: Math.round(110 + (fallbackX / 100) * 780),
      cy: Math.round(90 + (fallbackY / 100) * 430),
    };
  };

  // Helper emoji by symbol name
  const getSymbolEmoji = (sym: string) => {
    if (sym.includes('水') || sym.includes('海')) return '🌊';
    if (sym.includes('門') || sym.includes('鑰')) return '🚪';
    if (sym.includes('居') || sym.includes('屋')) return '🏚️';
    if (sym.includes('追') || sym.includes('跑')) return '🏃';
    if (sym.includes('母') || sym.includes('老')) return '👵';
    if (sym.includes('學') || sym.includes('考')) return '🏫';
    if (sym.includes('飛') || sym.includes('鳥')) return '🦅';
    return '✨';
  };

  // Handle star click
  const handleNodeClick = (node: ConstellationNode) => {
    if (isConnectMode) {
      if (!connectFirstNodeId) {
        setConnectFirstNodeId(node.id);
        setConnectionNotice(`【步驟 1/2】已選擇第 1 顆星「${node.primarySymbol} · ${node.title}」，請點擊第 2 顆星建立引力連線。`);
      } else if (connectFirstNodeId === node.id) {
        setConnectFirstNodeId(null);
        setConnectionNotice('已取消選取相同星辰。請選擇另一顆星。');
      } else {
        // Complete connection
        const first = nodes.find((n) => n.id === connectFirstNodeId);
        const second = node;
        const newLink: ConstellationLink = {
          sourceId: first!.id,
          targetId: second.id,
          relationType: 'symbol',
          relationLabel: `手動引力連線：${first!.primarySymbol} ↔ ${second.primarySymbol}`,
        };
        setLinks((prev) => [...prev, newLink]);
        if (onAddCustomLink) onAddCustomLink(newLink);
        setConnectionNotice(`✨ 成功將「${first!.primarySymbol}」與「${second.primarySymbol}」建立心靈共鳴連線！`);
        setIsConnectMode(false);
        setConnectFirstNodeId(null);
        setTimeout(() => setConnectionNotice(null), 4000);
      }
    } else {
      setSelectedNodeId(node.id);
    }
  };

  // Auto connect matching stars
  const handleAutoConnect = () => {
    const newLinks: ConstellationLink[] = [...links];
    let addedCount = 0;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const exists = newLinks.some(
          (l) =>
            (l.sourceId === a.id && l.targetId === b.id) ||
            (l.sourceId === b.id && l.targetId === a.id)
        );
        if (!exists) {
          if (a.emotion === b.emotion && a.emotion) {
            newLinks.push({
              sourceId: a.id,
              targetId: b.id,
              relationType: 'emotion',
              relationLabel: `共鳴情緒引力：${a.emotion}`,
            });
            addedCount++;
          }
        }
      }
    }

    setLinks(newLinks);
    setConnectionNotice(
      addedCount > 0
        ? `✨ 智能掃描完成，已自動連結 ${addedCount} 條心理共鳴引力線！`
        : '✨ 當前所有可能之情緒與象徵連線已全部連結完畢！'
    );
    setTimeout(() => setConnectionNotice(null), 4000);
  };

  // Re-layout orbits (spread out nicely)
  const handleRelayout = () => {
    const updated = nodes.map((n, idx) => {
      const angle = (idx / nodes.length) * Math.PI * 2 - Math.PI / 2 + (Math.random() * 0.3 - 0.15);
      const rad = 28 + Math.random() * 12;
      return {
        ...n,
        x: Math.min(88, Math.max(12, Math.round(50 + Math.cos(angle) * rad))),
        y: Math.min(85, Math.max(15, Math.round(50 + Math.sin(angle) * rad))),
      };
    });
    setNodes(updated);
    setConnectionNotice('🌌 已為你重新演算宇宙星宿引力軌道，星辰已大比例全幅鋪展！');
    setTimeout(() => setConnectionNotice(null), 3000);
  };

  // Export Constellation SVG to PNG Image
  const handleExportConstellationImage = () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1400;
      canvas.height = 900;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsExporting(false);
        return;
      }

      // Background
      if (canvasTheme === 'daylight') {
        const grad = ctx.createLinearGradient(0, 0, 0, 900);
        grad.addColorStop(0, '#EEF5FF');
        grad.addColorStop(0.5, '#E2EFFF');
        grad.addColorStop(1, '#D5E6FE');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1400, 900);
      } else {
        const grad = ctx.createRadialGradient(700, 450, 50, 700, 450, 750);
        grad.addColorStop(0, '#1d1e3d');
        grad.addColorStop(0.6, '#090c1a');
        grad.addColorStop(1, '#04060e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1400, 900);
      }

      // Branding Header
      ctx.fillStyle = canvasTheme === 'daylight' ? '#0F172A' : '#FFFFFF';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText('DreamWisdom · DREAM CONSTELLATION™️ 夢境星圖', 60, 70);

      ctx.fillStyle = canvasTheme === 'daylight' ? '#1E3A8A' : '#93C5FD';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('每一個夢，都是認識潛意識的星宿 · 專屬心靈宇宙引力連線', 60, 110);

      // Draw links
      links.forEach((l) => {
        const s = nodes.find((n) => n.id === l.sourceId);
        const t = nodes.find((n) => n.id === l.targetId);
        if (s && t) {
          const sCoords = getCanvasCoords(s.id, s.x, s.y);
          const tCoords = getCanvasCoords(t.id, t.x, t.y);
          const sx = (sCoords.cx / 1000) * 1280 + 60;
          const sy = (sCoords.cy / 620) * 680 + 150;
          const tx = (tCoords.cx / 1000) * 1280 + 60;
          const ty = (tCoords.cy / 620) * 680 + 150;

          ctx.strokeStyle =
            l.relationType === 'symbol'
              ? '#2563EB'
              : l.relationType === 'emotion'
              ? '#D97706'
              : '#7C3AED';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(tx, ty);
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach((n) => {
        const coords = getCanvasCoords(n.id, n.x, n.y);
        const nx = (coords.cx / 1000) * 1280 + 60;
        const ny = (coords.cy / 620) * 680 + 150;

        // Outer circle
        ctx.fillStyle = canvasTheme === 'daylight' ? '#FFFFFF' : '#1E293B';
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(nx, ny, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Node Title Box
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#93C5FD';
        ctx.lineWidth = 2;
        const textWidth = Math.max(140, n.title.length * 16 + 20);
        ctx.fillRect(nx - textWidth / 2, ny + 32, textWidth, 42);
        ctx.strokeRect(nx - textWidth / 2, ny + 32, textWidth, 42);

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(n.primarySymbol, nx, ny + 52);

        ctx.fillStyle = '#1E3A8A';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(n.title.slice(0, 12), nx, ny + 68);
      });

      // Download
      const link = document.createElement('a');
      link.download = `dreamwisdom-constellation-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsExporting(false);
    } catch (e) {
      console.error('Error exporting image:', e);
      setIsExporting(false);
    }
  };

  // State transformation trajectories for recurring symbols
  const stateTransformations = [
    {
      symbol: '🌊 水 / 海洋意象',
      trajectory: '洪水泛濫 (焦慮恐懼) → 涉水渡河 (試煉突破) → 平靜岸浪 (自性接納)',
      keyword: '水',
      badgeColor: 'bg-blue-100 text-blue-950 border-blue-300',
    },
    {
      symbol: '🚪 門 / 出口意象',
      trajectory: '鎖死舊木門 (受困迷茫) → 推開課室 (直面考試) → 迎向光明 (新路啟程)',
      keyword: '門',
      badgeColor: 'bg-amber-100 text-amber-950 border-amber-300',
    },
    {
      symbol: '🏃 追逐與黑影',
      trajectory: '狂奔逃離 (逃避壓力) → 躲入老屋 (尋求安全) → 轉身質問 (陰影整合)',
      keyword: '追',
      badgeColor: 'bg-purple-100 text-purple-950 border-purple-300',
    },
  ];

  return (
    <div
      className="card border-2 border-blue-300 bg-white p-5 sm:p-8 rounded-3xl relative overflow-hidden space-y-7 shadow-2xl shadow-blue-900/10 text-slate-900"
      id="dream-constellation-view"
    >
      {/* Background subtle tint & celestial watermarks */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F0F6FF] via-white to-[#EEF5FF] pointer-events-none" />

      {/* ============================================================ */}
      {/* 🌟 1. 頂部導航與主操作列 (Header Bar & Top Actions) 🌟 */}
      {/* ============================================================ */}
      <div className="flex flex-wrap items-center justify-between gap-4 relative z-10 border-b-2 border-blue-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-3.5 py-1 rounded-full bg-blue-700 text-white text-xs font-black tracking-wider uppercase shadow-xs">
              DREAM CONSTELLATION™️
            </span>
            <span className="text-xs sm:text-sm text-emerald-950 font-black flex items-center gap-1.5 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              星圖連線功能已全面啟用 · 全幅大比例展示
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-slate-950 mt-2">
            夢境星圖 · 宇宙連線
          </h2>

          <p className="text-sm sm:text-base text-blue-950 font-black mt-1">
            👉 簡單講：將唔同夢境嘅象徵與情緒連成星宿網絡，一眼睇清潛意識點樣帶你成長。
          </p>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Theme Switcher Toggle */}
          <button
            type="button"
            onClick={() => setCanvasTheme(canvasTheme === 'daylight' ? 'cosmos' : 'daylight')}
            className="text-xs sm:text-sm font-black flex items-center gap-1.5 px-4 py-2.5 rounded-xl cursor-pointer bg-white hover:bg-blue-50 text-blue-950 border-2 border-blue-300 shadow-xs transition-all"
            title="切換星圖畫布顯示模式"
          >
            {canvasTheme === 'daylight' ? (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>切換：晝天晴空（預設）</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>切換：深邃夜空</span>
              </>
            )}
          </button>

          {/* Connect Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsConnectMode(!isConnectMode);
              setConnectFirstNodeId(null);
              if (!isConnectMode) {
                setConnectionNotice('⚡ 連線模式已開啟：請點擊第 1 顆星，再點擊第 2 顆星建立引力線。');
              } else {
                setConnectionNotice(null);
              }
            }}
            className={`text-xs sm:text-sm font-black flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all border-2 ${
              isConnectMode
                ? 'bg-blue-700 text-white border-blue-800 shadow-md ring-2 ring-blue-300'
                : 'bg-white hover:bg-blue-50 text-slate-900 border-slate-300 shadow-xs'
            }`}
          >
            <LinkIcon className="w-4 h-4 text-blue-500" />
            <span>{isConnectMode ? '✕ 取消連線' : '⚡ 自由連結兩顆星'}</span>
          </button>

          {/* Auto Connect */}
          <button
            type="button"
            onClick={handleAutoConnect}
            className="text-xs sm:text-sm font-black flex items-center gap-1.5 px-4 py-2.5 rounded-xl cursor-pointer bg-amber-100 hover:bg-amber-200 text-amber-950 border-2 border-amber-300 shadow-xs transition-all"
            title="自動掃描相同情緒與象徵並建立引力連線"
          >
            <Sparkles className="w-4 h-4 fill-amber-500 text-amber-700" />
            <span>智能連線</span>
          </button>

          {/* Relayout */}
          <button
            type="button"
            onClick={handleRelayout}
            className="text-xs sm:text-sm font-black flex items-center gap-1.5 px-4 py-2.5 rounded-xl cursor-pointer bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-300 shadow-xs transition-all"
            title="重新微調星辰宇宙軌道"
          >
            <RotateCcw className="w-4 h-4 text-slate-700" />
            <span>重新排列</span>
          </button>

          {/* Export Constellation as PNG */}
          <button
            type="button"
            onClick={handleExportConstellationImage}
            disabled={isExporting}
            className="text-xs sm:text-sm font-black flex items-center gap-1.5 px-4 py-2.5 rounded-xl cursor-pointer bg-blue-700 hover:bg-blue-800 text-white shadow-md shadow-blue-700/25 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? '生成中...' : '匯出星圖 PNG'}</span>
          </button>
        </div>
      </div>

      {/* System Notice Banner (if any) */}
      {connectionNotice && (
        <div className="relative z-10 p-4 rounded-2xl bg-amber-100 border-2 border-amber-400 text-sm text-amber-950 font-black flex items-center justify-between animate-fadeIn shadow-sm">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 shrink-0 text-amber-700" />
            <span>{connectionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setConnectionNotice(null)}
            className="text-amber-950 hover:bg-amber-200 px-2.5 py-1 rounded-lg cursor-pointer font-black"
          >
            ✕
          </button>
        </div>
      )}

      {/* Quick Filter & Instructions Toggle Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        {/* Symbol Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs sm:text-sm text-slate-950 font-black mr-1 flex items-center gap-1.5">
            <Search className="w-4 h-4 text-blue-700" />
            象徵快速篩選：
          </span>

          <button
            type="button"
            onClick={() => setActiveSymbolFilter('')}
            className={`text-xs sm:text-sm px-4 py-2 rounded-xl border-2 transition-all cursor-pointer font-black ${
              !activeSymbolFilter
                ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
                : 'bg-white border-slate-300 text-slate-900 hover:bg-blue-50'
            }`}
          >
            全部星辰 ({nodes.length})
          </button>

          {availableSymbols.map((sym) => {
            const count = nodes.filter(
              (n) => n.primarySymbol.includes(sym) || n.title.includes(sym)
            ).length;
            const isActive = activeSymbolFilter === sym;
            return (
              <button
                key={sym}
                type="button"
                onClick={() => {
                  setActiveSymbolFilter(isActive ? '' : sym);
                  const matched = nodes.find((n) => n.primarySymbol.includes(sym));
                  if (matched) setSelectedNodeId(matched.id);
                }}
                className={`text-xs sm:text-sm px-4 py-2 rounded-xl border-2 transition-all cursor-pointer font-black ${
                  isActive
                    ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
                    : 'bg-white border-slate-300 text-slate-900 hover:bg-blue-50'
                }`}
              >
                {sym} ({count})
              </button>
            );
          })}
        </div>

        {/* How to use toggle */}
        <button
          type="button"
          onClick={() => setShowHowToUse(!showHowToUse)}
          className="text-xs sm:text-sm font-black px-4 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 text-blue-950 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
        >
          <Info className="w-4 h-4 text-blue-700" />
          <span>{showHowToUse ? '收起 3 秒使用指南' : '💡 點我查看星圖操作教學'}</span>
          {showHowToUse ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Collapsible How To Use Guide */}
      {showHowToUse && (
        <div className="relative z-10 p-5 rounded-2xl bg-gradient-to-r from-blue-100/90 via-sky-50 to-indigo-100/80 border-2 border-blue-300 shadow-sm animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-white border-2 border-blue-200 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 font-black text-blue-950">
                <span className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-mono">1</span>
                <span>🌟 認識星辰與連線</span>
              </div>
              <p className="text-slate-800 font-bold leading-relaxed">
                畫布上<b>每一顆星代表一場真實夢境</b>。當不同夢境有相同象徵（如海水、門、追逐）或相同情緒波長時，系統會自動拉出<b>彩色引力線</b>串聯。
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border-2 border-amber-200 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 font-black text-amber-950">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-mono">2</span>
                <span>👆 點擊星辰調閱報告</span>
              </div>
              <p className="text-slate-800 font-bold leading-relaxed">
                直接<b>點擊畫布上的任一顆星宿</b>，下方即可展開該場夢的<b>核心象徵、主情緒、引力關係與完整 4 層深度解夢報告</b>。
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border-2 border-emerald-200 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 font-black text-emerald-950">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-mono">3</span>
                <span>✍️ 記新夢點亮星圖</span>
              </div>
              <p className="text-slate-800 font-bold leading-relaxed">
                醒來記錄一個新夢，星圖就會<b>自動點亮全新星辰</b>並重新演算引力線；亦可點擊上方「<b>自由連結兩顆星</b>」手動拉線！
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🌟 2. 主星圖畫布：全新全寬、超大比例宏偉天幕 (FULL WIDTH OBSERVATORY CANVAS) 🌟 */}
      {/* ============================================================ */}
      <div
        className={`w-full rounded-3xl p-4 sm:p-6 relative min-h-[580px] sm:min-h-[640px] md:min-h-[700px] flex flex-col justify-between overflow-hidden shadow-2xl border-2 transition-all ${
          canvasTheme === 'daylight'
            ? 'bg-gradient-to-b from-[#EEF5FF] via-[#E2EFFF] to-[#D5E6FE] border-blue-300'
            : 'bg-gradient-to-b from-[#131E3A] via-[#0F172A] to-[#0A0F1D] border-slate-700'
        }`}
      >
        {/* Top Legend & Action Bar (清晰排列，絕不重疊) */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm pb-3.5 border-b-2 ${
            canvasTheme === 'daylight'
              ? 'border-blue-200 text-slate-900 bg-white/95 p-3.5 rounded-2xl shadow-sm'
              : 'border-white/20 text-white bg-slate-900/90 p-3.5 rounded-2xl shadow-sm'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-black text-sm text-slate-950">連線引力法則：</span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-100 text-blue-950 font-black border border-blue-300 shadow-2xs">
              <span className="w-3.5 h-1.5 bg-blue-600 rounded-full" /> 同一象徵 (藍線)
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-950 font-black border border-amber-300 shadow-2xs">
              <span className="w-3.5 h-1.5 bg-amber-500 rounded-full" /> 同一情緒 (黃線)
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-100 text-purple-950 font-black border border-purple-300 shadow-2xs">
              <span className="w-3.5 h-1.5 bg-purple-600 rounded-full" /> 場域呼應 (紫線)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-blue-900 font-bold bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              點擊任一星宿即可選取
            </span>

            {/* Quick Record Button */}
            {onRecordNewDream && (
              <button
                type="button"
                onClick={onRecordNewDream}
                className="text-xs sm:text-sm px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white inline-flex items-center gap-2 cursor-pointer font-black shadow-md shadow-emerald-700/25 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>記錄新夢以點亮新星辰</span>
              </button>
            )}
          </div>
        </div>

        {/* SVG Canvas Container (1000 x 620 ViewBox，大比例全幅鋪展) */}
        <div className="relative w-full flex-1 my-3 flex items-center justify-center min-h-[460px] sm:min-h-[520px]">
          <svg
            ref={svgRef}
            className="w-full h-full select-none max-h-[580px]"
            viewBox="0 0 1000 620"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Radiant Glow Filter */}
              <filter id="glow-bright" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Decorative Celestial Astrolabe Coordinates Circles (大尺寸天象座標環) */}
            <circle
              cx="500"
              cy="310"
              r="270"
              fill="none"
              stroke={canvasTheme === 'daylight' ? '#BFDBFE' : 'rgba(255,255,255,0.08)'}
              strokeWidth="2"
              strokeDasharray="8 8"
            />
            <circle
              cx="500"
              cy="310"
              r="170"
              fill="none"
              stroke={canvasTheme === 'daylight' ? '#93C5FD' : 'rgba(255,255,255,0.1)'}
              strokeWidth="1.5"
            />
            <line
              x1="120"
              y1="310"
              x2="880"
              y2="310"
              stroke={canvasTheme === 'daylight' ? '#BFDBFE' : 'rgba(255,255,255,0.08)'}
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
            <line
              x1="500"
              y1="40"
              x2="500"
              y2="580"
              stroke={canvasTheme === 'daylight' ? '#BFDBFE' : 'rgba(255,255,255,0.08)'}
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />

            {/* Draw Constellation Lines (粗線、高對比、鮮亮色彩) */}
            {links.map((link, idx) => {
              const source = nodes.find((n) => n.id === link.sourceId);
              const target = nodes.find((n) => n.id === link.targetId);
              if (!source || !target) return null;

              const { cx: x1, cy: y1 } = getCanvasCoords(source.id, source.x, source.y);
              const { cx: x2, cy: y2 } = getCanvasCoords(target.id, target.x, target.y);

              const isConnected =
                selectedNodeId === link.sourceId ||
                selectedNodeId === link.targetId ||
                hoveredNodeId === link.sourceId ||
                hoveredNodeId === link.targetId;

              const isFiltered =
                activeSymbolFilter &&
                !source.primarySymbol.includes(activeSymbolFilter) &&
                !target.primarySymbol.includes(activeSymbolFilter);

              let strokeColor = '#2563EB';
              if (link.relationType === 'symbol') {
                strokeColor = '#2563EB'; // Royal Blue
              } else if (link.relationType === 'emotion') {
                strokeColor = '#D97706'; // Warm Amber
              } else {
                strokeColor = '#7C3AED'; // Purple
              }

              return (
                <g key={`link-${idx}`}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={strokeColor}
                    strokeWidth={isConnected ? 4 : 2.5}
                    strokeDasharray={isConnected ? undefined : '6,4'}
                    opacity={isFiltered ? 0.15 : isConnected ? 1 : 0.8}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}

            {/* Draw Nodes (Stars - 大直徑、大字型卡片標籤、絕不微縮) */}
            {nodes.map((node) => {
              const { cx, cy } = getCanvasCoords(node.id, node.x, node.y);
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isFirstConnect = connectFirstNodeId === node.id;

              const matchesFilter =
                !activeSymbolFilter ||
                node.primarySymbol.includes(activeSymbolFilter) ||
                node.title.includes(activeSymbolFilter);

              const baseRadius = isSelected ? 24 : isHovered ? 21 : 18;
              const emoji = getSymbolEmoji(node.primarySymbol);

              // Pill sizes for legible Traditional Chinese text
              const symbolText = node.primarySymbol;
              const symbolWidth = Math.max(64, symbolText.length * 16 + 22);

              const shortTitle = node.title.length > 12 ? `${node.title.slice(0, 12)}...` : node.title;
              const titleWidth = Math.max(110, shortTitle.length * 14 + 22);

              return (
                <g
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className="cursor-pointer"
                  opacity={matchesFilter ? 1 : 0.25}
                  style={{ transition: 'opacity 0.3s ease' }}
                >
                  {/* Selected pulse outer aura */}
                  {(isSelected || isFirstConnect) && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={baseRadius + 16}
                      fill="rgba(37, 99, 235, 0.2)"
                      stroke="#2563EB"
                      strokeWidth="2.5"
                      strokeDasharray="5 5"
                    />
                  )}

                  {/* Outer Ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={baseRadius + 5}
                    fill={canvasTheme === 'daylight' ? '#FFFFFF' : '#1E293B'}
                    stroke={
                      isFirstConnect
                        ? '#F59E0B'
                        : isSelected
                        ? '#2563EB'
                        : isHovered
                        ? '#3B82F6'
                        : '#94A3B8'
                    }
                    strokeWidth={isSelected ? 3.5 : 2}
                  />

                  {/* Star Core */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={baseRadius}
                    fill={
                      isFirstConnect
                        ? '#FEF3C7'
                        : isSelected
                        ? '#DBEAFE'
                        : isHovered
                        ? '#E0E7FF'
                        : '#F1F5F9'
                    }
                    filter={isSelected ? 'url(#glow-bright)' : undefined}
                  />

                  {/* Emoji in core (大圖示) */}
                  <text
                    x={cx}
                    y={cy + 7}
                    textAnchor="middle"
                    fontSize="18"
                    className="select-none pointer-events-none"
                  >
                    {emoji}
                  </text>

                  {/* ============================================================ */}
                  {/* PILL 1: Primary Symbol (高清晰大字白底藍框卡片，字型大、極致銳利) */}
                  {/* ============================================================ */}
                  <g transform={`translate(${cx - symbolWidth / 2}, ${cy + baseRadius + 10})`}>
                    <rect
                      width={symbolWidth}
                      height={28}
                      rx={8}
                      fill={isSelected ? '#2563EB' : '#FFFFFF'}
                      stroke={isSelected ? '#1D4ED8' : '#3B82F6'}
                      strokeWidth="2.5"
                      className="shadow-md"
                    />
                    <text
                      x={symbolWidth / 2}
                      y={19}
                      textAnchor="middle"
                      fill={isSelected ? '#FFFFFF' : '#0F172A'}
                      fontSize="15"
                      fontWeight="900"
                      className="select-none pointer-events-none"
                    >
                      {symbolText}
                    </text>
                  </g>

                  {/* ============================================================ */}
                  {/* PILL 2: Dream Title Excerpt (大字繁體中文副標籤，絕不縮減模糊) */}
                  {/* ============================================================ */}
                  <g transform={`translate(${cx - titleWidth / 2}, ${cy + baseRadius + 42})`}>
                    <rect
                      width={titleWidth}
                      height={25}
                      rx={7}
                      fill={isSelected ? '#EFF6FF' : '#FFFFFF'}
                      stroke={isSelected ? '#60A5FA' : '#CBD5E1'}
                      strokeWidth="1.5"
                      className="shadow-2xs"
                    />
                    <text
                      x={titleWidth / 2}
                      y={17}
                      textAnchor="middle"
                      fill={isSelected ? '#1E3A8A' : '#1E293B'}
                      fontSize="13"
                      fontWeight="800"
                      className="select-none pointer-events-none"
                    >
                      {shortTitle}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Bar Info (大字高對比狀態欄) */}
        <div
          className={`flex flex-wrap items-center justify-between text-xs sm:text-sm pt-3.5 border-t-2 gap-3 ${
            canvasTheme === 'daylight'
              ? 'border-blue-200 text-slate-900 bg-white/95 p-3.5 rounded-2xl shadow-sm'
              : 'border-white/20 text-white bg-slate-900/90 p-3.5 rounded-2xl shadow-sm'
          }`}
        >
          <span className="flex items-center gap-2 font-black text-slate-950 text-sm">
            <span className="w-3 h-3 rounded-full bg-blue-600 animate-ping" />
            點擊上方任一顆星宿，下方將展開該夢的深度心理剖析、引力關係與完整報告！
          </span>

          <span className="font-mono text-blue-950 font-black bg-blue-100 px-4 py-1.5 rounded-xl border border-blue-300 text-sm">
            {nodes.length} 顆星辰已入軌 · {links.length} 條深層引力連線
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 🌟 3. 選中星宿詳細分析與心理演變面板：全幅排版、舒適大氣 🌟 */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 pt-2">
        {/* Left 7 Cols: 目前選取星宿之深度心理剖析 */}
        <div className="lg:col-span-7 space-y-5">
          {activeNode ? (
            <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-blue-300 shadow-xl space-y-5">
              <div className="flex flex-wrap items-center justify-between border-b-2 border-blue-200 pb-4 gap-3">
                <div>
                  <span className="text-xs font-mono font-black text-blue-900 uppercase tracking-wider block bg-blue-100 px-3 py-1 rounded-md w-fit mb-1.5 border border-blue-300">
                    目前選取星宿
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-950">{activeNode.title}</h4>
                </div>
                <span className="text-sm text-slate-900 font-mono font-black px-3 py-1.5 rounded-xl bg-slate-100 border-2 border-slate-300">
                  {activeNode.date}
                </span>
              </div>

              {/* Symbol & Emotion Badges */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-2xl bg-blue-50/80 border-2 border-blue-200 shadow-2xs">
                  <span className="text-xs text-blue-900 font-black block mb-1">核心原型象徵</span>
                  <span className="text-slate-950 font-black text-base sm:text-lg flex items-center gap-2">
                    <span className="text-xl">{getSymbolEmoji(activeNode.primarySymbol)}</span>
                    <span>{activeNode.primarySymbol}</span>
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-200 shadow-2xs">
                  <span className="text-xs text-amber-900 font-black block mb-1">主導情緒波長</span>
                  <span className="text-amber-950 font-black text-base sm:text-lg">
                    {activeNode.emotion || '待標記'}
                  </span>
                </div>
              </div>

              {/* Gravity Links of this node */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-950 font-black uppercase text-sm sm:text-base flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-blue-600" />
                    <span>關聯引力線 ({activeLinks.length})</span>
                  </span>
                  <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-md border border-emerald-300">
                    心靈共鳴
                  </span>
                </div>

                {activeLinks.length > 0 ? (
                  <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                    {activeLinks.map((l, i) => (
                      <div
                        key={i}
                        className="text-sm text-slate-900 bg-blue-50/70 p-3.5 rounded-xl border-2 border-blue-200 flex items-start gap-2.5 font-bold shadow-2xs"
                      >
                        <span className="text-blue-700 font-black mt-0.5">•</span>
                        <span>{l.relationLabel}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-800 p-4 bg-slate-50 rounded-xl border-2 border-slate-200 font-semibold leading-relaxed">
                    這顆星辰暫無自動連線，可點擊上方「<b>⚡ 自由連結兩顆星</b>」手動拉線！
                  </div>
                )}
              </div>

              {/* Button to view full dream report (寬版大按鈕，絕不折行溢出) */}
              {activeDream ? (
                <button
                  type="button"
                  onClick={() => onOpenReportDetail(activeDream)}
                  className="w-full text-base font-black py-4 px-6 flex items-center justify-center gap-3 mt-2 cursor-pointer bg-blue-700 hover:bg-blue-800 text-white rounded-2xl shadow-lg shadow-blue-700/25 transition-all active:scale-98"
                >
                  <span>查看這場夢的 4 層完整報告 (榮格原型、潛意識解碼、現實指引)</span>
                  <ExternalLink className="w-5 h-5 shrink-0" />
                </button>
              ) : (
                <div className="text-center pt-2">
                  <span className="text-sm text-slate-700 font-bold bg-slate-100 px-4 py-1.5 rounded-full border border-slate-300">
                    此星辰為經典原型示範星宿
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border-2 border-blue-200 text-center text-base text-slate-800 font-bold shadow-md">
              👈 請點擊上方星圖中的任一顆星辰，即可在此檢視該夢境的詳細心理剖析！
            </div>
          )}
        </div>

        {/* Right 5 Cols: 象徵演變觀察與心境轉化 */}
        <div className="lg:col-span-5 space-y-5">
          {/* THE WATER ROLE CHANGING EVOLUTION CASE STUDY */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-indigo-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-700" />
                <span>象徵演變動態觀察</span>
              </span>
              <span className="text-xs text-emerald-950 bg-emerald-100 px-3 py-1 rounded-full font-black border border-emerald-300">
                潛意識成長
              </span>
            </div>

            <h4 className="text-lg sm:text-xl font-black text-slate-950">「水」的角色正在改變</h4>
            <p className="text-sm text-slate-800 font-bold leading-relaxed">
              回顧星圖連線：水從暴漲的洪水、涉水渡海的試煉，漸漸變為岸邊的晨浪。這反映出你的自我防衛機制度已逐步轉化為接納與放鬆。
            </p>

            <div className="space-y-2.5 border-l-4 border-blue-500 pl-3.5 text-sm bg-blue-50/60 p-3 rounded-r-2xl">
              <div>
                <span className="font-black text-slate-950">前期：</span>
                <span className="text-amber-950 font-bold"> 洪水翻滾衝擊（焦慮與未解壓抑）</span>
              </div>
              <div>
                <span className="font-black text-slate-950">後期：</span>
                <span className="text-emerald-950 font-bold"> 風平浪靜靜立岸邊（自性整合接納）</span>
              </div>
            </div>

            <div className="pt-2">
              {onRecordNewDream && (
                <button
                  type="button"
                  onClick={onRecordNewDream}
                  className="w-full text-sm font-black py-3.5 px-4 flex items-center justify-center gap-2 rounded-2xl cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-950 border-2 border-blue-300 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4 text-emerald-700" />
                  <span>記錄今晨夢境加入星圖宇宙</span>
                </button>
              )}
            </div>
          </div>

          {/* State Change Transformation Trajectory Cards */}
          <div className="p-6 rounded-3xl bg-white border-2 border-blue-200 shadow-md space-y-3.5">
            <span className="flex items-center gap-2 text-slate-950 font-black text-sm sm:text-base">
              <Compass className="w-4 h-4 text-blue-700" />
              <span>心境演化軌跡聚焦（點擊快速高亮）：</span>
            </span>

            <div className="space-y-2.5">
              {stateTransformations.map((st, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setActiveSymbolFilter(st.keyword);
                    const match = nodes.find(
                      (n) => n.primarySymbol.includes(st.keyword) || n.title.includes(st.keyword)
                    );
                    if (match) setSelectedNodeId(match.id);
                  }}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer hover:scale-[1.01] shadow-2xs ${
                    activeSymbolFilter === st.keyword
                      ? 'ring-2 ring-blue-600 shadow-md bg-white border-blue-500'
                      : 'bg-slate-50 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-sm font-black mb-1 text-slate-950">
                    <span>{st.symbol}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-md border font-black ${st.badgeColor}`}>
                      點擊篩選
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm leading-relaxed text-slate-800 font-bold">{st.trajectory}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
