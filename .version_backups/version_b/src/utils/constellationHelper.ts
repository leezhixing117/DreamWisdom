import { ConstellationNode, ConstellationLink, DreamEntry } from '../types';
import { initialConstellationNodes, initialConstellationLinks } from '../data';

/**
 * Dynamically computes constellation nodes and gravity links from user dream history,
 * ensuring newly recorded dreams automatically ignite as stars and connect with past dreams.
 */
export function buildConstellationFromHistory(
  history: DreamEntry[]
): { nodes: ConstellationNode[]; links: ConstellationLink[] } {
  if (!history || history.length === 0) {
    return {
      nodes: initialConstellationNodes,
      links: initialConstellationLinks,
    };
  }

  // Build nodes for each dream in history
  const historyNodes: ConstellationNode[] = history.map((entry, idx) => {
    const report = entry.report_json;
    const dominantSymbol =
      report?.dnaContribution?.dominantSymbol ||
      report?.symbols?.[0]?.symbol ||
      extractKeySymbol(entry.title || entry.dream_text);

    const dominantEmotion =
      report?.dnaContribution?.dominantEmotion ||
      (report?.summary?.includes('焦慮') ? '焦慮' : report?.summary?.includes('平靜') ? '平靜' : '覺察');

    // Calculate pleasing orbital coordinates within 15%..85%
    const total = history.length;
    const angle = (idx / Math.max(total, 5)) * Math.PI * 2 - Math.PI / 2;
    const radiusVariation = idx % 2 === 0 ? 28 : 22;
    const x = Math.min(85, Math.max(15, Math.round(50 + Math.cos(angle) * radiusVariation)));
    const y = Math.min(82, Math.max(18, Math.round(50 + Math.sin(angle) * radiusVariation)));

    return {
      id: `star_user_${entry.id}`,
      dreamId: entry.id,
      title: entry.title || (entry.dream_text.slice(0, 16) + '...'),
      date: entry.created_at ? entry.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
      x,
      y,
      primarySymbol: dominantSymbol,
      place: report?.symbols?.[1]?.symbol?.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '') || '心靈場景',
      character: report?.symbols?.[2]?.symbol?.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '') || '自我投射',
      emotion: dominantEmotion,
      size: 16 + (idx === 0 ? 5 : 0), // newest dream is brightest
      magnitude: idx === 0 ? 5 : 4,
    };
  });

  // If user has fewer than 5 dreams, merge demo anchor stars so sky is rich
  let combinedNodes = [...historyNodes];
  if (historyNodes.length < 5) {
    const needed = 5 - historyNodes.length;
    const demoAnchors = initialConstellationNodes.slice(0, needed);
    combinedNodes = [...historyNodes, ...demoAnchors];
  }

  // Build gravity links
  const links: ConstellationLink[] = [];
  const seenPair = new Set<string>();

  const addLink = (
    sId: string,
    tId: string,
    relType: 'symbol' | 'place' | 'character' | 'emotion' | 'opposite_ending',
    label: string
  ) => {
    if (sId === tId) return;
    const pairKey = [sId, tId].sort().join('__');
    if (seenPair.has(pairKey)) return;
    seenPair.add(pairKey);
    links.push({
      sourceId: sId,
      targetId: tId,
      relationType: relType,
      relationLabel: label,
    });
  };

  // 1. Connect nodes sharing symbols or emotions
  for (let i = 0; i < combinedNodes.length; i++) {
    for (let j = i + 1; j < combinedNodes.length; j++) {
      const a = combinedNodes[i];
      const b = combinedNodes[j];

      // Symbol match
      if (
        a.primarySymbol &&
        b.primarySymbol &&
        (a.primarySymbol.includes(b.primarySymbol) ||
          b.primarySymbol.includes(a.primarySymbol) ||
          hasSharedKeyword(a.primarySymbol, b.primarySymbol))
      ) {
        addLink(a.id, b.id, 'symbol', `同一象徵線：${a.primarySymbol} ↔ ${b.primarySymbol}`);
      }
      // Emotion match
      else if (a.emotion && b.emotion && a.emotion === b.emotion) {
        addLink(a.id, b.id, 'emotion', `同一情緒波長：${a.emotion}`);
      }
      // Place / character match
      else if (a.place && b.place && a.place === b.place) {
        addLink(a.id, b.id, 'place', `同一場域呼應：${a.place}`);
      }
    }
  }

  // 2. Connect newest dream sequentially to nearest anchor if no links yet
  if (links.length === 0 && combinedNodes.length > 1) {
    for (let i = 0; i < combinedNodes.length - 1; i++) {
      addLink(
        combinedNodes[i].id,
        combinedNodes[i + 1].id,
        'symbol',
        `時間線演變：${combinedNodes[i].primarySymbol} → ${combinedNodes[i + 1].primarySymbol}`
      );
    }
  }

  // Add initial demo links if they apply
  for (const l of initialConstellationLinks) {
    if (
      combinedNodes.some((n) => n.id === l.sourceId) &&
      combinedNodes.some((n) => n.id === l.targetId)
    ) {
      addLink(l.sourceId, l.targetId, l.relationType, l.relationLabel);
    }
  }

  return { nodes: combinedNodes, links };
}

function extractKeySymbol(text: string): string {
  if (text.includes('海') || text.includes('水') || text.includes('浪')) return '水 / 海洋';
  if (text.includes('門') || text.includes('天台')) return '門 / 出口';
  if (text.includes('追') || text.includes('逃') || text.includes('跑')) return '被追逐狂奔';
  if (text.includes('校') || text.includes('書') || text.includes('考')) return '舊校課室';
  if (text.includes('屋') || text.includes('家') || text.includes('神枱')) return '舊居祖屋';
  if (text.includes('鞋') || text.includes('腳')) return '赤腳行路';
  if (text.includes('飛') || text.includes('空')) return '飛行浮空';
  if (text.includes('車') || text.includes('路')) return '迷途道路';
  return '核心意象';
}

function hasSharedKeyword(a: string, b: string): boolean {
  const keywords = ['海', '水', '門', '屋', '校', '追', '母', '鞋', '光', '黑'];
  return keywords.some((k) => a.includes(k) && b.includes(k));
}
