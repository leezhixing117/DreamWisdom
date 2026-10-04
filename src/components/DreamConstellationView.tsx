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
  Layers,
  ChevronRight,
  Info,
  Link as LinkIcon,
  Search,
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

  // Coordinates mapping (scale 0..100 to 0..800 width, 0..500 height)
  const getCanvasCoords = (x: number, y: number) => {
    const cx = (x / 100) * 800;
    const cy = (y / 100) * 500;
    return { cx, cy };
  };

  // Handle star click
  const handleNodeClick = (node: ConstellationNode) => {
    if (isConnectMode) {
      if (!connectFirstNodeId) {
        setConnectFirstNodeId(node.id);
        setConnectionNotice(`已選擇第一顆星「${node.primarySymbol}」，請點擊第二顆星完成連線。`);
      } else if (connectFirstNodeId === node.id) {
        setConnectFirstNodeId(null);
        setConnectionNotice('已取消選擇同一顆星。');
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
        setConnectionNotice(`✨ 成功將「${first!.primarySymbol}」與「${second.primarySymbol}」建立連線！`);
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

  // Re-layout orbits (randomize gentle celestial coordinates)
  const handleRelayout = () => {
    const updated = nodes.map((n, idx) => {
      const angle = (idx / nodes.length) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      const dist = 24 + Math.random() * 12;
      return {
        ...n,
        x: Math.min(85, Math.max(15, Math.round(50 + Math.cos(angle) * dist))),
        y: Math.min(80, Math.max(20, Math.round(50 + Math.sin(angle) * dist))),
      };
    });
    setNodes(updated);
    setConnectionNotice('🌌 已為你重新演算宇宙星宿引力軌道！');
    setTimeout(() => setConnectionNotice(null), 3000);
  };

  // Export Constellation SVG to PNG Image
  const handleExportConstellationImage = () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsExporting(false);
        return;
      }

      // Draw starry galaxy dark background
      const grad = ctx.createRadialGradient(600, 400, 50, 600, 400, 650);
      grad.addColorStop(0, '#1d1e3d');
      grad.addColorStop(0.6, '#090c1a');
      grad.addColorStop(1, '#04060e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 800);

      // Star particles
      for (let i = 0; i < 200; i++) {
        const sx = Math.random() * 1200;
        const sy = Math.random() * 800;
        const sr = Math.random() * 1.6;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Branding Header
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('DreamWisdom · DREAM CONSTELLATION™️ 夢境星圖', 50, 60);

      ctx.fillStyle = '#aa9cff';
      ctx.font = '16px sans-serif';
      ctx.fillText('每一個夢，都可以成為認識自己內在情緒的鏡子 · 專屬心靈宇宙連線', 50, 90);

      // Draw links on canvas
      links.forEach((l) => {
        const s = nodes.find((n) => n.id === l.sourceId);
        const t = nodes.find((n) => n.id === l.targetId);
        if (s && t) {
          const sx = (s.x / 100) * 1100 + 50;
          const sy = (s.y / 100) * 600 + 130;
          const tx = (t.x / 100) * 1100 + 50;
          const ty = (t.y / 100) * 600 + 130;

          ctx.strokeStyle =
            l.relationType === 'symbol'
              ? 'rgba(113, 217, 255, 0.6)'
              : l.relationType === 'emotion'
              ? 'rgba(255, 210, 122, 0.6)'
              : 'rgba(170, 156, 255, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(tx, ty);
          ctx.stroke();
        }
      });

      // Draw nodes on canvas
      nodes.forEach((n) => {
        const nx = (n.x / 100) * 1100 + 50;
        const ny = (n.y / 100) * 600 + 130;

        // Glow
        const radGrad = ctx.createRadialGradient(nx, ny, 2, nx, ny, 22);
        radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        radGrad.addColorStop(0.4, 'rgba(170, 156, 255, 0.5)');
        radGrad.addColorStop(1, 'rgba(170, 156, 255, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(nx, ny, 22, 0, Math.PI * 2);
        ctx.fill();

        // Node center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(nx, ny, 6, 0, Math.PI * 2);
        ctx.fill();

        // Title text
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(n.primarySymbol, nx, ny + 24);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px sans-serif';
        ctx.fillText(n.title, nx, ny + 38);
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
      symbol: '水 / 海洋',
      trajectory: '洪水 (恐懼) → 涉水渡河 (試煉) → 平靜海水 (放鬆接納)',
      keyword: '海',
      color: 'border-[#71d9ff]/40 bg-[#71d9ff]/10 text-[#71d9ff]',
    },
    {
      symbol: '門 / 出口',
      trajectory: '鎖死鐵門 (受困) → 推開課室 (迷惘) → 迎光之門 (希望)',
      keyword: '門',
      color: 'border-[#ffd27a]/40 bg-[#ffd27a]/10 text-[#ffd27a]',
    },
    {
      symbol: '被追逐黑影',
      trajectory: '狂奔逃離 (驚慌) → 躲入老宅 (喘息) → 直面陰影 (整合)',
      keyword: '追',
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
    },
  ];

  return (
    <div
      className="card border-[#aa9cff]/30 bg-[#090c1a] p-5 sm:p-7 rounded-3xl relative overflow-hidden space-y-6 shadow-2xl"
      id="dream-constellation-view"
    >
      {/* Background Starry Galaxy */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1d1e3d]/40 via-[#090c1a] to-[#04060e] pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 relative z-10 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge">DREAM CONSTELLATION™️</span>
            <span className="text-xs text-[#71d9ff] font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#78e1b5]" />
              星圖連線功能已全面啟用
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1.5">
            夢境星圖 · 宇宙連線
          </h2>
          <p className="text-xs text-[#71d9ff] font-medium mt-1">
            👉簡單講：將唔同夢境嘅人、地方、情緒連成星座網絡，睇清夢境之間嘅神秘關聯。
          </p>
          <p className="text-xs sm:text-sm text-[#aab3d2] mt-1 max-w-2xl leading-relaxed">
            每一顆星代表一場真實夢境。節點代表核心象徵與心靈場域，引力線串聯相同情緒與情結演變。
            點擊星辰可即時查看心理報告與轉變軌跡。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Add custom link toggle */}
          <button
            type="button"
            onClick={() => {
              setIsConnectMode(!isConnectMode);
              setConnectFirstNodeId(null);
              if (!isConnectMode) {
                setConnectionNotice('連線模式：請依序點擊兩顆星辰，建立專屬引力連線。');
              } else {
                setConnectionNotice(null);
              }
            }}
            className={`btn2 text-xs flex items-center gap-1.5 px-3.5 py-2 rounded-xl cursor-pointer transition-all ${
              isConnectMode ? 'bg-[#71d9ff] text-black font-bold border-[#71d9ff]' : ''
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{isConnectMode ? '取消連線選取' : '⚡ 自由連結兩顆星'}</span>
          </button>

          {/* Auto Connect */}
          <button
            type="button"
            onClick={handleAutoConnect}
            className="btn2 text-xs flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer"
            title="自動掃描相同情緒與象徵並建立引力連線"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ffd27a]" />
            <span>智能連線</span>
          </button>

          {/* Relayout orbits */}
          <button
            type="button"
            onClick={handleRelayout}
            className="btn2 text-xs flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer"
            title="重新微調星辰宇宙軌道"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#78e1b5]" />
            <span>重新排列</span>
          </button>

          {/* Export Constellation as PNG */}
          <button
            type="button"
            onClick={handleExportConstellationImage}
            disabled={isExporting}
            className="btn text-xs flex items-center gap-1.5 px-3.5 py-2 rounded-xl cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? '生成高解析度中...' : '匯出星圖 PNG'}</span>
          </button>
        </div>
      </div>

      {/* System Notice Banner (if any) */}
      {connectionNotice && (
        <div className="relative z-10 p-3 rounded-2xl bg-[#71d9ff]/15 border border-[#71d9ff]/40 text-xs text-[#71d9ff] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-[#71d9ff]" />
            <span>{connectionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setConnectionNotice(null)}
            className="text-[#71d9ff] hover:text-white px-2 cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* State Change Transformation Trajectory Cards */}
      <div className="relative z-10 space-y-2">
        <div className="flex items-center justify-between text-xs text-[#8d97b5]">
          <span className="flex items-center gap-1.5 text-white font-medium">
            <Compass className="w-3.5 h-3.5 text-[#78e1b5]" />
            心境演化軌跡聚焦 (State-Change Trajectories)：
          </span>
          <span>點擊快速高亮對應星辰群</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer hover:scale-[1.01] ${st.color} ${
                activeSymbolFilter === st.keyword ? 'ring-2 ring-white/50' : ''
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>{st.symbol}</span>
                <span className="text-[10px] opacity-80">點擊聚焦</span>
              </div>
              <div className="text-[11px] leading-relaxed opacity-95">{st.trajectory}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Symbol Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 relative z-10 pt-1">
        <span className="text-xs text-[#8d97b5] mr-1 flex items-center gap-1">
          <Search className="w-3 h-3 text-[#aa9cff]" />
          象徵快速篩選：
        </span>
        <button
          type="button"
          onClick={() => setActiveSymbolFilter('')}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
            !activeSymbolFilter
              ? 'bg-[#aa9cff] text-white border-[#aa9cff] shadow-md shadow-[#aa9cff]/20 font-medium'
              : 'bg-white/5 border-white/10 text-[#aab3d2] hover:bg-white/10 hover:text-white'
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
              className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#71d9ff] text-[#090c1a] font-bold border-[#71d9ff] shadow-md shadow-[#71d9ff]/30'
                  : 'bg-white/5 border-white/10 text-[#cbd2ef] hover:bg-white/10 hover:text-white'
              }`}
            >
              {sym} ({count})
            </button>
          );
        })}
      </div>

      {/* Interactive Cosmos Canvas and Evolution Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* SVG Constellation Map (8 Cols) */}
        <div className="lg:col-span-8 bg-black/50 border border-white/10 rounded-2xl p-4 sm:p-5 relative min-h-[460px] flex flex-col justify-between overflow-hidden shadow-inner">
          {/* Link Type Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#8d97b5] border-b border-white/10 pb-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-white font-medium">連線引力法則：</span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#71d9ff] rounded" /> 同一象徵
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#ffd27a] rounded" /> 同一情緒波長
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#aa9cff] rounded" /> 場域／人物呼應
              </span>
            </div>

            {/* Quick Record Button */}
            {onRecordNewDream && (
              <button
                type="button"
                onClick={onRecordNewDream}
                className="text-[11px] text-[#78e1b5] hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
              >
                <Plus className="w-3 h-3" />
                記錄新夢以點亮新星辰
              </button>
            )}
          </div>

          {/* SVG Canvas Container */}
          <div className="relative w-full h-[360px] sm:h-[400px] my-auto">
            <svg
              ref={svgRef}
              className="w-full h-full select-none"
              viewBox="0 0 800 500"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Radiant Glow Filter */}
                <filter id="glow-bright" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-soft" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Draw Constellation Lines */}
              {links.map((link, idx) => {
                const source = nodes.find((n) => n.id === link.sourceId);
                const target = nodes.find((n) => n.id === link.targetId);
                if (!source || !target) return null;

                const { cx: x1, cy: y1 } = getCanvasCoords(source.x, source.y);
                const { cx: x2, cy: y2 } = getCanvasCoords(target.x, target.y);

                const isConnected =
                  selectedNodeId === link.sourceId ||
                  selectedNodeId === link.targetId ||
                  hoveredNodeId === link.sourceId ||
                  hoveredNodeId === link.targetId;

                const isFiltered =
                  activeSymbolFilter &&
                  !source.primarySymbol.includes(activeSymbolFilter) &&
                  !target.primarySymbol.includes(activeSymbolFilter);

                let strokeColor = 'rgba(255, 255, 255, 0.2)';
                if (link.relationType === 'symbol') {
                  strokeColor = isConnected ? '#71d9ff' : 'rgba(113, 217, 255, 0.4)';
                } else if (link.relationType === 'emotion') {
                  strokeColor = isConnected ? '#ffd27a' : 'rgba(255, 210, 122, 0.4)';
                } else {
                  strokeColor = isConnected ? '#aa9cff' : 'rgba(170, 156, 255, 0.4)';
                }

                return (
                  <g key={`link-${idx}`}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={strokeColor}
                      strokeWidth={isConnected ? 2.2 : 1.2}
                      strokeDasharray={isConnected ? undefined : '4,2'}
                      opacity={isFiltered ? 0.15 : 1}
                      className="transition-all duration-300"
                    />
                  </g>
                );
              })}

              {/* Draw Nodes (Stars) */}
              {nodes.map((node) => {
                const { cx, cy } = getCanvasCoords(node.x, node.y);
                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNodeId === node.id;
                const isFirstConnect = connectFirstNodeId === node.id;

                const matchesFilter =
                  !activeSymbolFilter ||
                  node.primarySymbol.includes(activeSymbolFilter) ||
                  node.title.includes(activeSymbolFilter);

                const baseRadius = isSelected ? 12 : isHovered ? 10 : 8;

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
                        r={baseRadius + 14}
                        fill="rgba(113, 217, 255, 0.2)"
                        stroke="rgba(113, 217, 255, 0.4)"
                        strokeWidth="1.5"
                      />
                    )}

                    {/* Outer Ring */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={baseRadius + 5}
                      fill="none"
                      stroke={
                        isFirstConnect
                          ? '#ffd27a'
                          : isSelected
                          ? '#71d9ff'
                          : isHovered
                          ? '#aa9cff'
                          : 'rgba(255, 255, 255, 0.35)'
                      }
                      strokeWidth={isSelected ? 2 : 1}
                    />

                    {/* Star Core */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={baseRadius}
                      fill={
                        isFirstConnect
                          ? '#ffd27a'
                          : isSelected
                          ? '#ffffff'
                          : isHovered
                          ? '#71d9ff'
                          : '#aa9cff'
                      }
                      filter={isSelected ? 'url(#glow-bright)' : 'url(#glow-soft)'}
                    />

                    {/* Text Label: Symbol */}
                    <text
                      x={cx}
                      y={cy + baseRadius + 15}
                      textAnchor="middle"
                      fill={isSelected ? '#ffffff' : '#e2e8f0'}
                      fontSize="12"
                      fontWeight={isSelected ? 'bold' : '600'}
                      className="select-none pointer-events-none"
                    >
                      {node.primarySymbol}
                    </text>

                    {/* Text Label: Short Title */}
                    <text
                      x={cx}
                      y={cy + baseRadius + 28}
                      textAnchor="middle"
                      fill={isSelected ? '#71d9ff' : '#94a3b8'}
                      fontSize="10"
                      className="select-none pointer-events-none"
                    >
                      {node.title.slice(0, 10)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Bar Info */}
          <div className="flex flex-wrap items-center justify-between text-xs text-[#8d97b5] pt-3 border-t border-white/10 gap-2">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#71d9ff]" />
              點擊任一顆星辰，右側將展開深度心理報告與演化軌跡
            </span>
            <span className="font-mono text-[#78e1b5]">
              {nodes.length} 顆星辰已入軌 · {links.length} 條深層引力連線
            </span>
          </div>
        </div>

        {/* Right 4 Cols: Active Star & Symbol Evolution Analysis */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Selected Node Card */}
          {activeNode ? (
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141b38] to-[#0c1022] border border-[#71d9ff]/40 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] text-[#71d9ff] font-semibold uppercase tracking-wider block">
                    選取星辰
                  </span>
                  <h4 className="text-base font-bold text-white mt-0.5">{activeNode.title}</h4>
                </div>
                <span className="text-xs text-[#8d97b5] font-mono px-2 py-0.5 rounded bg-white/5">
                  {activeNode.date}
                </span>
              </div>

              {/* Symbol & Emotion Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                  <span className="text-[10px] text-[#8d97b5] block">核心象徵</span>
                  <span className="text-white font-bold">{activeNode.primarySymbol}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                  <span className="text-[10px] text-[#8d97b5] block">主情緒</span>
                  <span className="text-[#ffd27a] font-bold">{activeNode.emotion}</span>
                </div>
              </div>

              {/* Gravity Links of this node */}
              <div className="text-xs space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#8d97b5] uppercase font-semibold block">
                    引力連線 ({activeLinks.length})
                  </span>
                  <span className="text-[10px] text-[#78e1b5]">心靈共鳴</span>
                </div>

                {activeLinks.length > 0 ? (
                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {activeLinks.map((l, i) => (
                      <div
                        key={i}
                        className="text-[11px] text-[#cbd2ef] bg-white/[0.03] p-2 rounded-xl border border-white/5 flex items-start gap-1.5"
                      >
                        <span className="text-[#71d9ff] mt-0.5">•</span>
                        <span>{l.relationLabel}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[#8d97b5] p-2.5 bg-white/[0.02] rounded-xl border border-white/5">
                    這顆星辰暫無自動連線，可點擊上方「⚡ 自由連結兩顆星」手動連接！
                  </div>
                )}
              </div>

              {/* Button to view full dream report */}
              {activeDream ? (
                <button
                  type="button"
                  onClick={() => onOpenReportDetail(activeDream)}
                  className="btn w-full text-xs py-2.5 flex items-center justify-center gap-1.5 mt-2 cursor-pointer shadow-md"
                >
                  <span>查看這場夢的 4 層完整報告</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="text-center pt-2">
                  <span className="text-[11px] text-[#8d97b5]">此星辰為經典原型錨點示範星</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-xs text-[#8d97b5]">
              點擊左側星圖中的任一顆星辰以展開解析
            </div>
          )}

          {/* THE WATER ROLE CHANGING EVOLUTION CASE STUDY */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1429] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#aa9cff] uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                象徵演變觀察
              </span>
              <span className="text-[10px] text-[#78e1b5] font-mono">潛意識成長</span>
            </div>

            <h4 className="text-sm font-bold text-white">「水」的角色正在改變</h4>
            <p className="text-xs text-[#aab3d2] leading-relaxed">
              回顧星圖連線：水從暴漲的洪水、涉水渡海的試煉，漸漸變為岸邊的晨浪。這反映出你的自我防衛機制度已逐步轉化為接納與放鬆。
            </p>

            <div className="space-y-1.5 border-l-2 border-[#71d9ff]/30 pl-2.5 text-[11px]">
              <div>
                <span className="font-semibold text-white">前期：</span>
                <span className="text-[#ffd27a]"> 洪水翻滾衝擊（焦慮與未解壓抑）</span>
              </div>
              <div>
                <span className="font-semibold text-white">後期：</span>
                <span className="text-[#78e1b5]"> 風平浪靜靜立岸邊（自性整合接納）</span>
              </div>
            </div>

            <div className="pt-1">
              {onRecordNewDream && (
                <button
                  type="button"
                  onClick={onRecordNewDream}
                  className="btn2 w-full text-xs py-2 flex items-center justify-center gap-1.5 rounded-xl cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#78e1b5]" />
                  <span>記錄今晨夢境加入星圖</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
