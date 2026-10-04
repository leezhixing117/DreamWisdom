import React, { useState, useEffect } from 'react';
import {
  X,
  MessageSquareText,
  Coins,
  Truck,
  RefreshCw,
  Crown,
  BookOpen,
  HelpCircle,
  Send,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { User } from '../types';

export interface CustomerInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User | null;
  defaultCategory?: string;
}

export type InquiryCategoryId =
  | 'payment_status'
  | 'shipping_delivery'
  | 'refund_policy'
  | 'vip_membership'
  | 'dream_records'
  | 'other_inquiry';

interface InquiryCategory {
  id: InquiryCategoryId;
  label: string;
  tag: string;
  icon: React.ReactNode;
  summary: string;
  quickTips: string[];
  placeholder: string;
}

const INQUIRY_CATEGORIES: InquiryCategory[] = [
  {
    id: 'payment_status',
    label: '是否到賬',
    tag: '款項 / 星星幣入帳',
    icon: <Coins className="w-4 h-4 text-amber-600" />,
    summary: '查詢信用卡/Stripe 付款、VIP 開通或短片睇片儲星是否已到賬',
    quickTips: [
      'Stripe 信用卡付款通常於 1~3 分鐘內自動完成結算並更新帳戶權限。',
      '睇廣告儲星：播放完畢後一般於 15~30 秒內自動入帳 (+1 顆星)。',
      '若扣款成功但超過 5 分鐘未見更新，請在下方提供交易編號或登入電郵，我們會即時為你查驗補發。',
    ],
    placeholder: '例如：我剛才購買了 10 顆星星幣 / 開通了 VIP，Stripe 已收到扣款短訊，但帳戶餘額尚未更新，請協助查詢。',
  },
  {
    id: 'shipping_delivery',
    label: '送貨安排',
    tag: '選物店物流與進度',
    icon: <Truck className="w-4 h-4 text-blue-600" />,
    summary: '查詢身心轉化選物店（精油、噴霧、淨化水晶等）實體商品發貨與運單號',
    quickTips: [
      '實體選物現貨通常於下單付款後 1~2 個工作天內由香港順豐速運（SF Express）寄出。',
      '香港本地派送一般於寄出後 1~2 天送達（支援順豐站、順豐智能櫃或住宅/工商地址）。',
      '寄出時系統會發送含有運單追蹤碼之電郵通知；如需修改收件地址或備註派送時間，請在此提出。',
    ],
    placeholder: '例如：我想查詢昨天下單的「雪松深眠精油」何時發貨，或者想更改為順豐智能櫃取件。',
  },
  {
    id: 'refund_policy',
    label: '退款安排',
    tag: '退款政策與售後保障',
    icon: <RefreshCw className="w-4 h-4 text-rose-600" />,
    summary: '查詢退款申請流程、重複付款核實或實體商品破損退換',
    quickTips: [
      '數位服務保障：若因系統故障導致報告未生成或重複扣除星星幣/會員款項，查實後保證 100% 原路退款或即時補發。',
      '實體選物商品：商品若在運輸途中損毀或收到時有質量問題，提供簽收後 7 天內免費退換貨服務。',
      '退款申請確認後，退款金額將於 3~7 個工作天內退回原付款信用卡或 Stripe 帳戶。',
    ],
    placeholder: '例如：我不小心重複付款了一筆星星幣，或者收到實體水晶噴霧時噴頭損壞，希望申請更換或退款。',
  },
  {
    id: 'vip_membership',
    label: '會員權益',
    tag: 'VIP 方案與特權開通',
    icon: <Crown className="w-4 h-4 text-purple-600" />,
    summary: '查詢「潛意識天體星盤」專屬撥盤特權、無限次深度解夢或會籍續訂',
    quickTips: [
      'VIP 會員尊享全站「免扣星」無限次深度解夢、Dream DNA™️ 潛意識星圖及「天體星盤」專屬撥動共振指引。',
      '如已付費但進入付費會員專區仍提示未開通，請嘗試重新整理頁面或重新登入帳戶，系統會強制刷新權限令牌。',
    ],
    placeholder: '例如：我剛升級了年費 VIP，想了解天體星盤的每日撥盤指引如何搭配我的夢境歷史記錄使用。',
  },
  {
    id: 'dream_records',
    label: '報告存檔',
    tag: '解夢歷史與記錄找回',
    icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
    summary: '查詢已扣星解鎖報告的永久保存、資料讀取或換機同步問題',
    quickTips: [
      '所有經星星幣解鎖或 VIP 期間產生的完整解夢報告均永久保存於個人資料庫中。',
      '訪客模式下之記錄暫存於本地瀏覽器；登入電郵帳戶後系統會自動同步並雲端永久保存。',
    ],
    placeholder: '例如：我更換了手機瀏覽器後看不到之前的深度解夢報告，我的註冊電郵是...',
  },
  {
    id: 'other_inquiry',
    label: '其他查詢',
    tag: '一般諮詢與回饋',
    icon: <HelpCircle className="w-4 h-4 text-slate-600" />,
    summary: '合作諮詢、身心靈專業轉介、功能建議或任何其他疑問',
    quickTips: [
      '我們非常重視每一位探索者的使用反饋與心靈體驗，所有留言均有專人親自閱讀並回覆。',
      '如需緊急情緒支援或身心靈熱線，亦可點擊頁面上的情緒支援按鈕獲取香港免費熱線。',
    ],
    placeholder: '請簡述你想查詢的內容或對平台的建議...',
  },
];

interface StoredTicket {
  id: string;
  categoryLabel: string;
  email: string;
  orderNumber?: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'resolved';
}

const STORAGE_KEY = 'dreamwisdom_customer_inquiries';

export const CustomerInquiryModal: React.FC<CustomerInquiryModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  defaultCategory = 'payment_status',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<InquiryCategoryId>(
    (defaultCategory as InquiryCategoryId) || 'payment_status'
  );
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<StoredTicket | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [ticketHistory, setTicketHistory] = useState<StoredTicket[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initialize email from user if available
  useEffect(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  // Load past tickets from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTicketHistory(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentCategoryData =
    INQUIRY_CATEGORIES.find((cat) => cat.id === selectedCategory) || INQUIRY_CATEGORIES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const ticketId = `INQ-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      const newTicket: StoredTicket = {
        id: ticketId,
        categoryLabel: currentCategoryData.label,
        email: email.trim(),
        orderNumber: orderNumber.trim() || undefined,
        message: message.trim(),
        createdAt: new Date().toLocaleString('zh-HK', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'pending',
      };

      const updated = [newTicket, ...ticketHistory];
      setTicketHistory(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }

      setSubmittedTicket(newTicket);
      setIsSubmitting(false);
    }, 600);
  };

  const handleCopyTicket = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetForNew = () => {
    setSubmittedTicket(null);
    setMessage('');
    setOrderNumber('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto cursor-pointer"
      id="customer-inquiry-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-2xl bg-white border-2 border-slate-300 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative cursor-default my-auto animate-in fade-in zoom-in-95 duration-200"
        id="customer-inquiry-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-700 shadow-sm shrink-0">
              <MessageSquareText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">
                  服務與訂單查詢中心
                </h2>
                {ticketHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowHistory(!showHistory)}
                    className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    {showHistory ? '返回查詢表單' : `歷史記錄 (${ticketHistory.length})`}
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                選擇查詢範疇，我們為你提供即時自助指引及 24 小時專人跟進支援
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="關閉視窗"
            id="close-inquiry-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode: Past Ticket History */}
        {showHistory ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>你的查詢工單歷史 ({ticketHistory.length})</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="text-xs text-blue-700 font-bold hover:underline cursor-pointer"
              >
                ← 返回填寫新查詢
              </button>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {ticketHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-blue-700">{item.id}</span>
                    <span className="text-[11px] text-slate-500">{item.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold">
                      {item.categoryLabel}
                    </span>
                    {item.orderNumber && (
                      <span className="text-[11px] text-slate-600 font-mono">
                        單號: {item.orderNumber}
                      </span>
                    )}
                    <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      專人處理中
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200">
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : submittedTicket ? (
          /* Submission Success State */
          <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-950">查詢申請已順利提交！</h3>
              <p className="text-xs text-emerald-800 mt-1 font-medium">
                我們的客服專員已收到你的工單，將於 24 小時內發送詳細回覆至你的電郵：
                <strong className="text-slate-900 block mt-0.5">{submittedTicket.email}</strong>
              </p>
            </div>

            {/* Ticket Info Card */}
            <div className="p-4 rounded-xl bg-white border border-emerald-200 text-left space-y-2 max-w-md mx-auto shadow-xs">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <span className="text-slate-500">工單編號：</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                  <span>{submittedTicket.id}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyTicket(submittedTicket.id)}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors"
                    title="複製編號"
                  >
                    {copiedId === submittedTicket.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">查詢範疇：</span>
                <span className="font-bold text-slate-800">{submittedTicket.categoryLabel}</span>
              </div>

              {submittedTicket.orderNumber && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">相關單號：</span>
                  <span className="font-mono text-slate-800">{submittedTicket.orderNumber}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">提交時間：</span>
                <span className="text-slate-600">{submittedTicket.createdAt}</span>
              </div>
            </div>

            {/* Quick Urgent Support Options */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleResetForNew}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                提出另一則查詢
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
              >
                完成並關閉
              </button>
            </div>
          </div>
        ) : (
          /* Main Interactive Inquiry Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Select Inquiry Category */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                1. 請點選你要查詢的項目
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5" id="inquiry-category-selector">
                {INQUIRY_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-600 shadow-sm scale-[1.01]'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="p-1 rounded-lg bg-slate-100">{cat.icon}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        )}
                      </div>
                      <div>
                        <div
                          className={`text-sm font-black ${
                            isSelected ? 'text-blue-900 font-serif' : 'text-slate-800'
                          }`}
                        >
                          {cat.label}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 truncate font-medium">
                          {cat.tag}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Immediate Self-Help Tips for chosen category */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-xs text-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>【{currentCategoryData.label}】常見指引與即時解答：</span>
              </div>
              <ul className="space-y-1.5 pl-2 text-slate-700">
                {currentCategoryData.quickTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-amber-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 3: Detailed Inquiry Input Form */}
            <div className="space-y-3.5 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Contact Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    聯絡電郵 (必填，客服回覆用) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:border-blue-600 focus:bg-white text-slate-900 text-xs font-medium outline-hidden transition-all"
                  />
                </div>

                {/* Order / Transaction Reference */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    訂單編號 / 交易流水號 (選填)
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="如：SF-2026xxxx 或 TXN-xxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:border-blue-600 focus:bg-white text-slate-900 text-xs font-medium outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Message Details */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  查詢內容詳情 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={currentCategoryData.placeholder}
                  className="w-full p-3.5 rounded-xl bg-slate-50 border-2 border-slate-300 focus:border-blue-600 focus:bg-white text-slate-900 text-xs font-medium outline-hidden transition-all leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>專人通常於 24 小時內透過電郵專函回覆</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  取消
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim() || !message.trim()}
                  className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-extrabold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-98"
                  id="submit-inquiry-btn"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>正在發送...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>發送查詢申請</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
