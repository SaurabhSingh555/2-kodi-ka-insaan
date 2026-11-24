import { CertificateData } from "../types";
import { CONFIG } from "../../config.js";

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY);
      line = words[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
  }
  return currentY;
}

function drawMiniBrandLogo(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Crown
  ctx.fillStyle = "#B68D40";
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(16, 22);
  ctx.lineTo(22, 8);
  ctx.lineTo(32, 17);
  ctx.lineTo(40, 4);
  ctx.lineTo(48, 17);
  ctx.lineTo(58, 8);
  ctx.lineTo(64, 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Circle Seal
  ctx.fillStyle = "#781C24";
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(40, 56, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#F5ECD7";
  ctx.strokeStyle = "#B68D40";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(40, 56, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // ₹2 text
  ctx.fillStyle = "#111111";
  ctx.font = "900 24px 'Playfair Display', Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("₹2", 40, 58);

  ctx.restore();
}

function drawGoldSeal(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.save();
  ctx.translate(cx, cy);

  // Ribbons
  ctx.fillStyle = "#781C24";
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-26, radius * 0.68);
  ctx.lineTo(-38, radius * 1.28);
  ctx.lineTo(-20, radius * 1.12);
  ctx.lineTo(-8, radius * 1.3);
  ctx.lineTo(-4, radius * 0.72);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(26, radius * 0.68);
  ctx.lineTo(38, radius * 1.28);
  ctx.lineTo(20, radius * 1.12);
  ctx.lineTo(8, radius * 1.3);
  ctx.lineTo(4, radius * 0.72);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Scalloped Gold Circle
  const teeth = 24;
  ctx.fillStyle = "#B68D40";
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i < teeth * 2; i++) {
    const angle = (i * Math.PI) / teeth;
    const r = i % 2 === 0 ? radius : radius * 0.88;
    const px = r * Math.cos(angle);
    const py = r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Inner ivory ring
  ctx.fillStyle = "#F5ECD7";
  ctx.strokeStyle = "#781C24";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.74, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Dashed gold ring
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "#B68D40";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.64, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Maroon core
  ctx.fillStyle = "#781C24";
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.46, 0, Math.PI * 2);
  ctx.fill();

  // Text ₹2 + CERTIFIED
  ctx.fillStyle = "#F5ECD7";
  ctx.font = `900 ${Math.round(radius * 0.36)}px 'Playfair Display', Georgia, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("₹2", 0, -radius * 0.04);

  ctx.fillStyle = "#B68D40";
  ctx.font = `700 ${Math.round(radius * 0.13)}px 'JetBrains Mono', monospace`;
  ctx.fillText("CERTIFIED", 0, radius * 0.25);

  ctx.restore();
}

function drawSignature(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(10, 38);
  ctx.bezierCurveTo(22, 12, 36, 10, 32, 32);
  ctx.bezierCurveTo(30, 46, 48, 18, 60, 26);
  ctx.bezierCurveTo(66, 30, 56, 44, 72, 32);
  ctx.bezierCurveTo(84, 22, 94, 16, 98, 29);
  ctx.bezierCurveTo(102, 38, 118, 18, 132, 28);
  ctx.bezierCurveTo(142, 34, 152, 24, 174, 25);
  ctx.stroke();

  ctx.strokeStyle = "#781C24";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 46);
  ctx.quadraticCurveTo(95, 38, 166, 44);
  ctx.stroke();

  ctx.restore();
}

function drawCornerOrnament(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rotationRad: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotationRad);
  ctx.fillStyle = "#781C24";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(44, 0);
  ctx.lineTo(44, 10);
  ctx.lineTo(10, 10);
  ctx.lineTo(10, 44);
  ctx.lineTo(0, 44);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#B68D40";
  ctx.beginPath();
  ctx.arc(23, 23, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawCertificateOnCanvas(
  ctx: CanvasRenderingContext2D,
  data: CertificateData,
  width: number,
  height: number
) {
  ctx.save();

  // Parchment background
  ctx.fillStyle = "#FAF3E3";
  ctx.fillRect(0, 0, width, height);

  // Subtle diagonal security crosshatch pattern
  ctx.save();
  ctx.strokeStyle = "rgba(182, 141, 64, 0.08)";
  ctx.lineWidth = 1.5;
  const step = 36;
  for (let i = -height; i < width + height; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i, height);
    ctx.lineTo(i + height, 0);
    ctx.stroke();
  }
  ctx.restore();

  // Repeating subtle brand watermark
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-Math.PI / 14);
  ctx.fillStyle = "rgba(120, 28, 36, 0.045)";
  ctx.font = `900 ${Math.round(width * 0.022)}px 'Playfair Display', Georgia, serif`;
  ctx.textAlign = "center";
  for (let wy = -height; wy <= height; wy += height * 0.22) {
    for (let wx = -width; wx <= width; wx += width * 0.42) {
      ctx.fillText("₹2 KA INSAAN • UNOFFICIAL", wx, wy);
    }
  }
  ctx.restore();

  // Outer black border
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, width - 8, height - 8);

  // Maroon inner border
  const mPad = Math.round(width * 0.018);
  ctx.strokeStyle = "#781C24";
  ctx.lineWidth = 5;
  ctx.strokeRect(mPad, mPad, width - mPad * 2, height - mPad * 2);

  // Gold dashed inner security border
  const gPad = Math.round(width * 0.028);
  ctx.save();
  ctx.setLineDash([14, 10]);
  ctx.strokeStyle = "#B68D40";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(gPad, gPad, width - gPad * 2, height - gPad * 2);
  ctx.restore();

  // Corner Ornaments
  const cOff = mPad + 8;
  drawCornerOrnament(ctx, cOff, cOff, 0);
  drawCornerOrnament(ctx, width - cOff, cOff, Math.PI / 2);
  drawCornerOrnament(ctx, width - cOff, height - cOff, Math.PI);
  drawCornerOrnament(ctx, cOff, height - cOff, -Math.PI / 2);

  // Top-left Brand Logo
  drawMiniBrandLogo(ctx, width * 0.048, height * 0.055, (width / 2400) * 1.45);
  ctx.textAlign = "left";
  ctx.fillStyle = "#111111";
  ctx.font = `900 ${Math.round(width * 0.016)}px 'Playfair Display', Georgia, serif`;
  ctx.fillText("2 KA INSAAN", width * 0.105, height * 0.095);
  ctx.fillStyle = "#781C24";
  ctx.font = `700 ${Math.round(width * 0.0095)}px 'JetBrains Mono', monospace`;
  ctx.fillText("PARODY DIVISION", width * 0.105, height * 0.12);

  // Top-right Ref ID
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(17,17,17,0.65)";
  ctx.font = `600 ${Math.round(width * 0.009)}px 'JetBrains Mono', monospace`;
  ctx.fillText("REF ID", width * 0.95, height * 0.085);
  ctx.fillStyle = "#111111";
  ctx.font = `700 ${Math.round(width * 0.011)}px 'JetBrains Mono', monospace`;
  ctx.fillText(data.certId, width * 0.95, height * 0.112);

  // Top Center Authority Title
  ctx.textAlign = "center";
  ctx.fillStyle = "#781C24";
  ctx.font = `700 ${Math.round(width * 0.0125)}px 'JetBrains Mono', monospace`;
  ctx.fillText("INTERNATIONAL AUKAAT CERTIFICATION AUTHORITY", width / 2, height * 0.092);

  ctx.fillStyle = "#111111";
  ctx.font = `900 ${Math.round(width * 0.036)}px 'Playfair Display', Georgia, serif`;
  ctx.fillText("CERTIFICATE OF AUKAAT", width / 2, height * 0.152);

  // Gold divider line
  ctx.fillStyle = "#B68D40";
  ctx.fillRect(width * 0.34, height * 0.175, width * 0.32, 4);

  // "This is to officially and unnecessarily certify that"
  ctx.fillStyle = "rgba(17, 17, 17, 0.85)";
  ctx.font = `italic 600 ${Math.round(width * 0.019)}px 'Cormorant Garamond', Georgia, serif`;
  ctx.fillText("This is to officially and unnecessarily certify that", width / 2, height * 0.25);

  // User Name (auto-fit font size)
  let nameFontSize = Math.round(width * 0.046);
  ctx.font = `900 ${nameFontSize}px 'Playfair Display', 'Noto Sans Devanagari', Georgia, serif`;
  while (ctx.measureText(data.name).width > width * 0.72 && nameFontSize > width * 0.024) {
    nameFontSize -= 4;
    ctx.font = `900 ${nameFontSize}px 'Playfair Display', 'Noto Sans Devanagari', Georgia, serif`;
  }
  ctx.fillStyle = "#781C24";
  ctx.fillText(data.name, width / 2, height * 0.34);

  // Name underline
  const nameLineW = Math.min(width * 0.64, Math.max(width * 0.28, ctx.measureText(data.name).width + 90));
  ctx.fillStyle = "#B68D40";
  ctx.fillRect(width / 2 - nameLineW / 2, height * 0.375, nameLineW, 5);

  // "has successfully achieved..."
  ctx.fillStyle = "rgba(17, 17, 17, 0.85)";
  ctx.font = `italic 600 ${Math.round(width * 0.019)}px 'Cormorant Garamond', Georgia, serif`;
  ctx.fillText("has successfully achieved the prestigious title of", width / 2, height * 0.435);

  // Black & Gold Badge: ₹2 KA INSAAN
  const badgeW = width * 0.32;
  const badgeH = height * 0.082;
  const badgeX = width / 2 - badgeW / 2;
  const badgeY = height * 0.462;
  ctx.fillStyle = "#111111";
  ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
  ctx.strokeStyle = "#B68D40";
  ctx.lineWidth = 4;
  ctx.strokeRect(badgeX, badgeY, badgeW, badgeH);

  ctx.fillStyle = "#B68D40";
  ctx.font = `900 ${Math.round(width * 0.028)}px 'Playfair Display', Georgia, serif`;
  ctx.textBaseline = "middle";
  ctx.fillText("₹2 KA INSAAN", width / 2, badgeY + badgeH / 2 + 2);
  ctx.textBaseline = "alphabetic";

  // Designation
  let desigSize = Math.round(width * 0.0185);
  ctx.font = `700 ${desigSize}px 'Space Grotesk', 'Noto Sans Devanagari', sans-serif`;
  const desigText = `Designation: ${data.designation}`;
  while (ctx.measureText(desigText).width > width * 0.78 && desigSize > width * 0.012) {
    desigSize -= 2;
    ctx.font = `700 ${desigSize}px 'Space Grotesk', 'Noto Sans Devanagari', sans-serif`;
  }
  ctx.fillStyle = "#111111";
  ctx.fillText(desigText, width / 2, height * 0.605);

  // Paragraph
  ctx.fillStyle = "rgba(17, 17, 17, 0.82)";
  ctx.font = `600 ${Math.round(width * 0.0145)}px 'Cormorant Garamond', Georgia, serif`;
  drawWrappedText(
    ctx,
    "After absolutely no examination, interview, background verification, or meaningful achievement, the authority hereby declares that the above-mentioned individual is officially worth ₹2 in our completely fictional universe.",
    width / 2,
    height * 0.662,
    width * 0.74,
    height * 0.032
  );

  // 3 Metrics bar
  const barY = height * 0.732;
  const barH = height * 0.088;
  const barW = width * 0.68;
  const barX = width / 2 - barW / 2;

  ctx.strokeStyle = "rgba(182, 141, 64, 0.7)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(barX, barY);
  ctx.lineTo(barX + barW, barY);
  ctx.moveTo(barX, barY + barH);
  ctx.lineTo(barX + barW, barY + barH);
  ctx.stroke();

  // Vertical dividers
  ctx.beginPath();
  ctx.moveTo(barX + barW / 3, barY + 12);
  ctx.lineTo(barX + barW / 3, barY + barH - 12);
  ctx.moveTo(barX + (barW * 2) / 3, barY + 12);
  ctx.lineTo(barX + (barW * 2) / 3, barY + barH - 12);
  ctx.stroke();

  const metrics = [
    { label: "MARKET VALUE", val: "₹2", color: "#781C24" },
    { label: "SELF CONFIDENCE", val: "₹2 Crore", color: "#111111" },
    { label: "QUALIFICATION", val: "Existing Successfully", color: "#111111" },
  ];
  metrics.forEach((m, i) => {
    const mx = barX + (barW / 3) * i + barW / 6;
    ctx.fillStyle = "rgba(17, 17, 17, 0.62)";
    ctx.font = `700 ${Math.round(width * 0.0095)}px 'JetBrains Mono', monospace`;
    ctx.fillText(m.label, mx, barY + barH * 0.34);

    ctx.fillStyle = m.color;
    ctx.font = `800 ${Math.round(width * 0.0155)}px 'Playfair Display', Georgia, serif`;
    ctx.fillText(m.val, mx, barY + barH * 0.74);
  });

  // Bottom Row: Issue Date + Disclaimer | Gold Seal | Signature
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(17,17,17,0.65)";
  ctx.font = `600 ${Math.round(width * 0.009)}px 'JetBrains Mono', monospace`;
  ctx.fillText("ISSUE DATE", width * 0.055, height * 0.875);

  ctx.fillStyle = "#111111";
  ctx.font = `700 ${Math.round(width * 0.012)}px 'JetBrains Mono', monospace`;
  ctx.fillText(data.issueDate, width * 0.055, height * 0.905);

  ctx.fillStyle = "rgba(17,17,17,0.58)";
  ctx.font = `500 ${Math.round(width * 0.0082)}px 'JetBrains Mono', monospace`;
  ctx.fillText("Unofficial parody certificate. For entertainment purposes only.", width * 0.055, height * 0.938);

  // Center Gold Seal
  drawGoldSeal(ctx, width / 2, height * 0.885, width * 0.044);

  // Bottom-right Signature
  const sigScale = (width / 2400) * 1.45;
  drawSignature(ctx, width * 0.81, height * 0.822, sigScale);

  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(width * 0.78, height * 0.888);
  ctx.lineTo(width * 0.945, height * 0.888);
  ctx.stroke();

  ctx.textAlign = "right";
  ctx.fillStyle = "#111111";
  ctx.font = `800 ${Math.round(width * 0.0125)}px 'Playfair Display', Georgia, serif`;
  ctx.fillText("Chief Bakchodi Officer", width * 0.945, height * 0.916);

  ctx.fillStyle = "#781C24";
  ctx.font = `700 ${Math.round(width * 0.0085)}px 'JetBrains Mono', monospace`;
  ctx.fillText("2 KA INSAAN AUTHORITY", width * 0.945, height * 0.938);

  ctx.restore();
}

export async function generateCertificatePngBlob(data: CertificateData): Promise<Blob> {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  const canvas = document.createElement("canvas");
  canvas.width = 2400;
  canvas.height = 1600;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  drawCertificateOnCanvas(ctx, data, 2400, 1600);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to export certificate PNG"));
    }, "image/png");
  });
}

export async function generateInstagramStoryBlob(data: CertificateData): Promise<Blob> {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  const width = 1080;
  const height = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  // Vintage Ivory background with Maroon & Gold Story Framing
  ctx.fillStyle = "#F5ECD7";
  ctx.fillRect(0, 0, width, height);

  // Subtle background texture dots
  ctx.fillStyle = "rgba(120, 28, 36, 0.04)";
  for (let y = 20; y < height; y += 36) {
    for (let x = 20; x < width; x += 36) {
      ctx.fillRect(x, y, 2, 2);
    }
  }

  // Outer frame
  ctx.strokeStyle = "#781C24";
  ctx.lineWidth = 14;
  ctx.strokeRect(24, 24, width - 48, height - 48);

  ctx.strokeStyle = "#B68D40";
  ctx.lineWidth = 4;
  ctx.strokeRect(46, 46, width - 92, height - 92);

  // Top Header Brand Banner
  ctx.fillStyle = "#111111";
  ctx.fillRect(90, 108, width - 180, 120);
  ctx.strokeStyle = "#B68D40";
  ctx.lineWidth = 4;
  ctx.strokeRect(90, 108, width - 180, 120);

  drawMiniBrandLogo(ctx, 120, 126, 0.92);

  ctx.textAlign = "left";
  ctx.fillStyle = "#F5ECD7";
  ctx.font = "900 44px 'Playfair Display', Georgia, serif";
  ctx.fillText(CONFIG.brandName, 224, 174);

  ctx.fillStyle = "#B68D40";
  ctx.font = "700 18px 'JetBrains Mono', monospace";
  ctx.fillText("INTERNATIONAL AUKAAT AUTHORITY", 224, 206);

  // Funny Headline
  ctx.textAlign = "center";
  ctx.fillStyle = "#781C24";
  ctx.font = "900 58px 'Playfair Display', Georgia, serif";
  ctx.fillText("AAJ SE MAIN OFFICIALLY", width / 2, 338);

  ctx.fillStyle = "#111111";
  ctx.font = "900 66px 'Playfair Display', Georgia, serif";
  ctx.fillText("₹2 KA INSAAN HOON.", width / 2, 418);

  ctx.fillStyle = "rgba(17,17,17,0.75)";
  ctx.font = "700 26px 'Space Grotesk', sans-serif";
  ctx.fillText("Duniya ne aukaat nahi batayi? Certificate dekh lo.", width / 2, 476);

  // Render the crisp 3:2 certificate onto an offscreen canvas and stamp it in center
  const certW = 960;
  const certH = 640;
  const certCanvas = document.createElement("canvas");
  certCanvas.width = 1800;
  certCanvas.height = 1200;
  const certCtx = certCanvas.getContext("2d");
  if (certCtx) {
    drawCertificateOnCanvas(certCtx, data, 1800, 1200);
  }

  const certX = (width - certW) / 2;
  const certY = 550;

  // Hard vintage drop shadow under certificate
  ctx.fillStyle = "#111111";
  ctx.fillRect(certX + 16, certY + 16, certW, certH);
  ctx.drawImage(certCanvas, certX, certY, certW, certH);

  // Viral Humor Pill Below Certificate
  ctx.fillStyle = "#781C24";
  ctx.fillRect(140, 1270, width - 280, 92);
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 4;
  ctx.strokeRect(140, 1270, width - 280, 92);

  ctx.fillStyle = "#F5ECD7";
  ctx.font = "800 30px 'Space Grotesk', sans-serif";
  ctx.fillText("100% Unofficial. 200% Unnecessary.", width / 2, 1326);

  // Website URL Callout
  ctx.fillStyle = "#111111";
  ctx.font = "700 30px 'Space Grotesk', sans-serif";
  ctx.fillText("Tumhari kitni aukaat hai? Apna banao at:", width / 2, 1465);

  const cleanDomain = CONFIG.websiteUrl.replace(/^https?:\/\//, "");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(160, 1500, width - 320, 96);
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 5;
  ctx.strokeRect(160, 1500, width - 320, 96);

  ctx.fillStyle = "#781C24";
  ctx.font = "700 36px 'JetBrains Mono', monospace";
  ctx.fillText(cleanDomain, width / 2, 1560);

  // Bottom Disclaimer
  ctx.fillStyle = "rgba(17,17,17,0.65)";
  ctx.font = "600 22px 'JetBrains Mono', monospace";
  ctx.fillText("Sirf ₹2 Ki Izzat • Parody Entertainment Website", width / 2, 1790);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to export Instagram Story PNG"));
    }, "image/png");
  });
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
