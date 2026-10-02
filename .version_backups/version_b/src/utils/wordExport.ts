/**
 * Utility for exporting reports and journal entries to Microsoft Word (.doc) and formatted clipboard text
 */

export function exportHtmlToWord(filename: string, title: string, bodyHtml: string): void {
  const content = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body {
      font-family: 'PingFang TC', 'Microsoft JhengHei', 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.7;
      color: #1f2937;
      margin: 40px;
    }
    h1 {
      font-size: 18pt;
      color: #1e1b4b;
      border-bottom: 2px solid #6366f1;
      padding-bottom: 8px;
      margin-bottom: 16px;
    }
    h2 {
      font-size: 14pt;
      color: #312e81;
      margin-top: 24px;
      margin-bottom: 8px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 4px;
    }
    h3 {
      font-size: 12pt;
      color: #4338ca;
      margin-top: 16px;
      margin-bottom: 6px;
    }
    p {
      margin-top: 0;
      margin-bottom: 12px;
      text-align: justify;
    }
    .meta-box {
      background-color: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 12px 16px;
      margin-bottom: 20px;
      font-size: 9.5pt;
      color: #4b5563;
    }
    .quote-box {
      border-left: 3px solid #818cf8;
      background-color: #f5f3ff;
      padding: 10px 14px;
      margin: 14px 0;
      font-style: italic;
      color: #3730a3;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      background: #e0e7ff;
      color: #3730a3;
      border-radius: 4px;
      font-size: 9pt;
      margin-right: 6px;
      margin-bottom: 4px;
    }
    .disclaimer {
      font-size: 9pt;
      color: #9ca3af;
      margin-top: 36px;
      border-top: 1px solid #e5e7eb;
      padding-top: 12px;
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta-box">
    <strong>DreamWisdom · 深度夢境心理檔案</strong><br>
    匯出時間：${new Date().toLocaleString('zh-HK')}<br>
    分析體系：Dream Master 經典心理學意象分析體系
  </div>
  ${bodyHtml}
  <div class="disclaimer">
    備註：本解夢報告基於分析心理學、榮格原型理論與當代文化情境提供心理參考，非命運預測。
  </div>
</body>
</html>`;

  const blob = new Blob(['\ufeff' + content], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename.replace(/[/\\?%*:|"<>]/g, '_')}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function copyFormattedText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch {
      return false;
    }
  }
}
