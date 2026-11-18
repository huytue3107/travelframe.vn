import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const WORKSPACE = '/Users/macbook/Codex GPT/travelframe.vn';
const ARTIFACT_DIR = '/Users/macbook/.gemini/antigravity/brain/1bd72a9e-0a26-49a1-bc1f-edf91e445219';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function toBase64(relPath) {
  const full = path.join(WORKSPACE, relPath);
  if (!fs.existsSync(full)) return '';
  const ext = path.extname(full).slice(1);
  const data = fs.readFileSync(full).toString('base64');
  return `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${data}`;
}

const heroImg = toBase64('Creative-Production/Assets/AI-Generated/HANOI-Hero-Ad-V1.jpg');
const streetImg = toBase64('Creative-Production/Assets/AI-Generated/SEO-Articles/hanoi-couple-walk-historic-alley.jpg');
const coffeeImg = toBase64('Creative-Production/Assets/AI-Generated/SEO-Articles/hanoi-balcony-egg-coffee-traveler.jpg');
const photoStrollImg = toBase64('Creative-Production/Assets/AI-Generated/SEO-Articles/hanoi-private-photographer-walk.jpg');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TravelFrame Field Notes - Hanoi Secret Food & Photo Map</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 10mm 12mm 12mm 12mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #FFFDF7;
      color: #171317;
      font-size: 11px;
      line-height: 1.45;
    }

    .page {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .page-break {
      page-break-after: always;
      break-after: page;
    }

    /* Header component */
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #171317;
      padding-bottom: 6px;
      margin-bottom: 12px;
    }

    .brand-tag {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 900;
      font-size: 13px;
      letter-spacing: -0.02em;
    }

    .brand-pill {
      background: #008AA3;
      color: #FFF;
      font-size: 9px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 2px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .issue-badge {
      font-family: 'Space Grotesk', monospace;
      font-size: 10px;
      font-weight: 700;
      background: #F5D9EB;
      border: 1.5px solid #171317;
      padding: 2px 8px;
      box-shadow: 2px 2px 0px #171317;
    }

    /* Hero section */
    .hero-container {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 12px;
      margin-bottom: 14px;
      align-items: center;
    }

    .hero-titles {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .strip-pink {
      display: inline-block;
      align-self: flex-start;
      background: #FF9ED2;
      border: 1.5px solid #171317;
      padding: 3px 8px;
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      box-shadow: 2px 2px 0px #171317;
    }

    .strip-lemon {
      display: inline-block;
      align-self: flex-start;
      background: #FFF7B2;
      border: 1.5px solid #171317;
      padding: 4px 10px;
      font-size: 17px;
      font-weight: 900;
      letter-spacing: -0.02em;
      line-height: 1.15;
      box-shadow: 2px 2px 0px #171317;
    }

    .hero-sub {
      font-size: 10.5px;
      color: #333;
      margin-top: 4px;
      font-style: italic;
    }

    .hero-image-box {
      border: 1.5px solid #171317;
      box-shadow: 3px 3px 0px #171317;
      height: 125px;
      overflow: hidden;
      position: relative;
    }

    .hero-image-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .stamp {
      position: absolute;
      bottom: 4px;
      right: 4px;
      background: #FFF;
      border: 1px solid #171317;
      font-size: 8px;
      font-weight: 800;
      padding: 1px 4px;
      text-transform: uppercase;
    }

    /* Cards Grid */
    .cards-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 12px;
    }

    .food-card {
      background: #FFF;
      border: 1.5px solid #171317;
      box-shadow: 3px 3px 0px #171317;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      break-inside: avoid;
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px dashed #CCC;
      padding-bottom: 5px;
    }

    .spot-num {
      background: #171317;
      color: #FFF;
      font-size: 9px;
      font-weight: 800;
      padding: 1px 5px;
      border-radius: 2px;
    }

    .spot-title {
      font-size: 12px;
      font-weight: 900;
      line-height: 1.2;
    }

    .spot-price {
      font-family: 'Space Grotesk', monospace;
      font-size: 9.5px;
      font-weight: 700;
      background: #FFF7B2;
      border: 1px solid #171317;
      padding: 1px 5px;
      white-space: nowrap;
    }

    .info-line {
      display: flex;
      gap: 4px;
      font-size: 10px;
    }

    .info-line strong {
      min-width: 65px;
      color: #555;
      font-size: 9.5px;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .pro-move-box {
      background: #F4F6F9;
      border-left: 3px solid #008AA3;
      padding: 4px 6px;
      font-size: 9.5px;
      margin-top: 2px;
    }

    .photo-spot-box {
      background: #FFFDF0;
      border-left: 3px solid #FF9ED2;
      padding: 4px 6px;
      font-size: 9.5px;
    }

    .spot-img-thumb {
      width: 100%;
      height: 80px;
      object-fit: cover;
      border: 1px solid #171317;
      margin-top: 4px;
    }

    /* Survival guide & Photo stroll feature */
    .survival-box {
      background: #FFF;
      border: 1.5px solid #171317;
      box-shadow: 3px 3px 0px #171317;
      padding: 12px;
      margin-bottom: 14px;
    }

    .survival-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 8px;
    }

    .survival-item {
      background: #F9F9F6;
      border: 1px solid #E2E0D8;
      padding: 8px;
    }

    .survival-item h4 {
      font-size: 10.5px;
      font-weight: 800;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .feature-offer {
      background: #FFFDF7;
      border: 2px solid #171317;
      box-shadow: 4px 4px 0px #171317;
      padding: 14px;
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 14px;
      align-items: center;
    }

    .offer-title {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 19px;
      line-height: 1.15;
      margin-bottom: 6px;
    }

    .offer-tag {
      background: #008AA3;
      color: #FFF;
      font-size: 10px;
      font-weight: 800;
      padding: 2px 8px;
      display: inline-block;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .offer-price-badge {
      display: inline-flex;
      align-items: baseline;
      gap: 4px;
      background: #FFF7B2;
      border: 1.5px solid #171317;
      padding: 4px 10px;
      font-weight: 900;
      font-size: 16px;
      margin-top: 8px;
      box-shadow: 2px 2px 0px #171317;
    }

    .offer-price-badge span {
      font-size: 10px;
      font-weight: 600;
      color: #444;
    }

    .bullets {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin: 8px 0;
      font-size: 10px;
    }

    .bullets li {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .bullets li::before {
      content: "✓";
      color: #008AA3;
      font-weight: 900;
    }

    .contact-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 2px solid #171317;
      padding-top: 8px;
      margin-top: 14px;
      font-size: 9.5px;
      font-weight: 700;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  </style>
</head>
<body>

  <!-- ==================== PAGE 1 ==================== -->
  <div class="page page-break">
    <div class="header-bar">
      <div class="brand-tag">
        <span class="brand-pill">Field Notes</span>
        <span>TRAVELFRAME.VN</span>
        <span style="font-weight: 400; color: #777;">• Your Warm Local Friend in Hanoi</span>
      </div>
      <div class="issue-badge">PART 04 / FOOD & PHOTO</div>
    </div>

    <div class="hero-container">
      <div class="hero-titles">
        <div class="strip-pink">WHAT THE GUIDEBOOKS LEAVE OUT</div>
        <div class="strip-lemon">THE HANOI SECRET FOOD & PHOTO MAP</div>
        <div class="hero-sub">We go first, so you know where locals actually sit, eat and shoot. Verified on-site by TravelFrame photographers.</div>
      </div>
      <div class="hero-image-box">
        <img src="${heroImg}" alt="Hanoi street life">
        <div class="stamp">HANOI OLD QUARTER • VERIFIED</div>
      </div>
    </div>

    <div class="cards-grid-2">
      <!-- Spot 1 -->
      <div class="food-card">
        <div class="card-top">
          <div>
            <span class="spot-num">SPOT 01</span>
            <div class="spot-title">Bò Né / Bít Tết Cột Điện</div>
            <div style="font-size: 9px; color: #666;">Sizzling Cast-Iron Steak & Eggs (Our Viral Breakfast Reel)</div>
          </div>
          <div class="spot-price">105k VND (~$4.10)</div>
        </div>
        <div class="info-line">
          <strong>📍 Address:</strong>
          <span>5 Nguyễn Trung Trực, Ba Đình (Branch 5)</span>
        </div>
        <div class="info-line">
          <strong>⏰ Timing:</strong>
          <span>07:00 – 11:30 (Breakfast) & 17:30 – 21:00</span>
        </div>
        <div class="info-line">
          <strong>🔥 Order:</strong>
          <span><em>Bít tết đầy đủ</em> (Beef, runny egg, rich liver pâté, butter).</span>
        </div>
        <div class="pro-move-box">
          <strong>💡 Pro-Move:</strong> Break the egg yolk immediately, blend the pâté into the hot skillet sauce, and tear off crispy baguette chunks to mop it clean.
        </div>
        <div class="photo-spot-box">
          <strong>📸 Photo Angle:</strong> Walk 3 mins to <strong>Hàng Đậu Water Tower</strong> — iconic French colonial stone arches bathed in soft morning light.
        </div>
      </div>

      <!-- Spot 2 -->
      <div class="food-card">
        <div class="card-top">
          <div>
            <span class="spot-num">SPOT 02</span>
            <div class="spot-title">Phở Bò Gia Truyền Bát Đàn</div>
            <div style="font-size: 9px; color: #666;">The Undisputed Soul of Hanoi Phở (Queue & Carry)</div>
          </div>
          <div class="spot-price">55k–65k VND (~$2.40)</div>
        </div>
        <div class="info-line">
          <strong>📍 Address:</strong>
          <span>49 Bát Đàn, Hoàn Kiếm, Hanoi</span>
        </div>
        <div class="info-line">
          <strong>⏰ Timing:</strong>
          <span>06:30 – 10:00 (Best before 08:30 to avoid peak line)</span>
        </div>
        <div class="info-line">
          <strong>🔥 Order:</strong>
          <span><em>Phở Tái Nạm</em> (Half seared tenderloin, half slow-braised flank).</span>
        </div>
        <div class="pro-move-box">
          <strong>💡 Pro-Move:</strong> Order 2 crispy dough crullers (<em>quẩy</em>) at the counter to dunk into the 12-hour simmered bone marrow broth.
        </div>
        <div class="photo-spot-box">
          <strong>📸 Photo Angle:</strong> Right across Bát Đàn with vintage indigo wooden doors and traditional tiled roofs of old merchant houses.
        </div>
      </div>
    </div>

    <!-- Spot 3 & 4 on Page 1 -->
    <div class="cards-grid-2">
      <!-- Spot 3 -->
      <div class="food-card">
        <div class="card-top">
          <div>
            <span class="spot-num">SPOT 03</span>
            <div class="spot-title">Bún Chả Hàng Quạt (Ngõ 74)</div>
            <div style="font-size: 9px; color: #666;">Smoky Charcoal Pork in a 1-Meter Hidden Alley</div>
          </div>
          <div class="spot-price">50k–60k VND (~$2.20)</div>
        </div>
        <div class="info-line">
          <strong>📍 Address:</strong>
          <span>Ngõ 74 Hàng Quạt, Hoàn Kiếm</span>
        </div>
        <div class="info-line">
          <strong>⏰ Timing:</strong>
          <span>10:30 – 14:00 (Lunch only — sells out fast!)</span>
        </div>
        <div class="info-line">
          <strong>🔥 Order:</strong>
          <span><em>Bún Chả đầy đủ + Nem rán</em> (Charred pork patties, herbs, spring rolls).</span>
        </div>
        <div class="pro-move-box">
          <strong>💡 Pro-Move:</strong> Add garlic and fresh bird's eye chili into the warm sweet-savory fish sauce bowl before dunking your rice noodles.
        </div>
        <div class="photo-spot-box">
          <strong>📸 Photo Angle:</strong> Sun rays filtering through charcoal smoke at the mouth of the alley against whitewashed historic bricks.
        </div>
      </div>

      <!-- Spot 4 -->
      <div class="food-card">
        <div class="card-top">
          <div>
            <span class="spot-num">SPOT 04</span>
            <div class="spot-title">Bánh Mì 25</div>
            <div style="font-size: 9px; color: #666;">Golden Crispy Baguettes & Homemade Pâté</div>
          </div>
          <div class="spot-price">35k–45k VND (~$1.60)</div>
        </div>
        <div class="info-line">
          <strong>📍 Address:</strong>
          <span>25 Hàng Cá, Hoàn Kiếm</span>
        </div>
        <div class="info-line">
          <strong>⏰ Timing:</strong>
          <span>07:00 – 19:00 (All day)</span>
        </div>
        <div class="info-line">
          <strong>🔥 Order:</strong>
          <span><em>Pork & Pâté with Avocado</em> or <em>Pan-fried Beef & Cheese</em>.</span>
        </div>
        <div class="pro-move-box">
          <strong>💡 Pro-Move:</strong> Sip an iced passion fruit juice or salted caramel coconut coffee across the street while your bread is oven-toasted.
        </div>
        <div class="photo-spot-box">
          <strong>📸 Photo Angle:</strong> The cozy sidewalk seating opposite the bakery with hanging Vietnamese fabric lanterns.
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; font-size: 8.5px; color: #888; border-top: 1px solid #DDD; padding-top: 4px;">
      <span>TravelFrame Field Notes • Issue 04</span>
      <span>Page 1 of 2</span>
    </div>
  </div>

  <!-- ==================== PAGE 2 ==================== -->
  <div class="page">
    <div class="header-bar">
      <div class="brand-tag">
        <span class="brand-pill">Field Notes</span>
        <span>TRAVELFRAME.VN</span>
        <span style="font-weight: 400; color: #777;">• Coffee, Steamed Rolls & The Photo Experience</span>
      </div>
      <div class="issue-badge">AUTHENTIC HANOI</div>
    </div>

    <div class="cards-grid-2">
      <!-- Spot 5 -->
      <div class="food-card">
        <div class="card-top">
          <div>
            <span class="spot-num">SPOT 05</span>
            <div class="spot-title">Café Giảng (Original 1946)</div>
            <div style="font-size: 9px; color: #666;">Where Vietnamese Egg Coffee Was Born</div>
          </div>
          <div class="spot-price">35k–40k VND (~$1.50)</div>
        </div>
        <div class="info-line">
          <strong>📍 Address:</strong>
          <span>39 Nguyễn Hữu Huân, Hoàn Kiếm</span>
        </div>
        <div class="info-line">
          <strong>⏰ Timing:</strong>
          <span>08:00 – 11:00 or 15:00 – 17:00</span>
        </div>
        <div class="info-line">
          <strong>🔥 Order:</strong>
          <span><em>Cà phê trứng nóng</em> (Hot egg coffee) or <em>Cacao trứng</em>.</span>
        </div>
        <div class="pro-move-box">
          <strong>💡 Pro-Move:</strong> The warm water bowl keeps the custard velvety. Spoon the sweet foam first, then stir gently from bottom up.
        </div>
        <div class="photo-spot-box">
          <strong>📸 Photo Angle:</strong> Second-floor courtyard with natural daylight casting shadows across green potted plants and rustic wooden tables.
        </div>
        <img class="spot-img-thumb" src="${coffeeImg}" alt="Egg coffee balcony">
      </div>

      <!-- Spot 6 -->
      <div class="food-card">
        <div class="card-top">
          <div>
            <span class="spot-num">SPOT 06</span>
            <div class="spot-title">Bánh Cuốn Bà Hoành</div>
            <div style="font-size: 9px; color: #666;">Silky Steamed Rice Crepes with Wood Ear Pork</div>
          </div>
          <div class="spot-price">45k–55k VND (~$2.00)</div>
        </div>
        <div class="info-line">
          <strong>📍 Address:</strong>
          <span>66 Tô Hiến Thành, Hai Bà Trưng</span>
        </div>
        <div class="info-line">
          <strong>⏰ Timing:</strong>
          <span>06:30 – 12:00 (Morning delicacy)</span>
        </div>
        <div class="info-line">
          <strong>🔥 Order:</strong>
          <span><em>Bánh cuốn chả quế</em> (Rice rolls, cinnamon sausage, fried shallots).</span>
        </div>
        <div class="pro-move-box">
          <strong>💡 Pro-Move:</strong> Watch the chef spread the rice batter paper-thin over the steam drum. Sprinkle fresh chili into the warm amber dipping sauce.
        </div>
        <div class="photo-spot-box">
          <strong>📸 Photo Angle:</strong> Close-up action shot of steam rising over the bamboo roller as the crepe is lifted in one fluid motion.
        </div>
        <img class="spot-img-thumb" src="${streetImg}" alt="Hanoi street alley">
      </div>
    </div>

    <!-- Survival Kit -->
    <div class="survival-box">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span class="strip-pink" style="font-size: 9.5px;">STREET FOOD SURVIVAL KIT</span>
        <span style="font-size: 8.5px; color: #666; font-weight: 700;">3 RULES LOCALS LIVE BY</span>
      </div>
      <div class="survival-grid">
        <div class="survival-item">
          <h4>🪑 Stool Etiquette</h4>
          <p style="font-size: 9px; color: #444;">Low plastic stools are a badge of honor. A packed stall of laughing locals is your 100% guarantee of fresh turnover and delicious broth.</p>
        </div>
        <div class="survival-item">
          <h4>🧊 Ice & Water Safety</h4>
          <p style="font-size: 9px; color: #444;">Tubular ice with hollow centers (<em>đá bi</em>) is commercially filtered and perfectly safe for iced tea and coffee throughout central Hanoi.</p>
        </div>
        <div class="survival-item">
          <h4>🥢 Chopstick Ritual</h4>
          <p style="font-size: 9px; color: #444;">Look for the lime wedge on your table. Squeeze a drop onto your paper napkin to wipe your chopsticks and soup spoon before eating like a true local.</p>
        </div>
      </div>
    </div>

    <!-- Feature Offer Card -->
    <div class="feature-offer">
      <div>
        <div class="offer-tag">RECOMMENDED EXPERIENCE</div>
        <div class="offer-title">Don't Just Eat Alone — Join Our Hanoi Food & Photo Stroll</div>
        <p style="font-size: 10px; color: #333; margin-bottom: 6px;">
          Tired of awkward selfies or blurry photos taken by strangers? Spend 2 relaxed hours with a friendly local photographer from TravelFrame.
        </p>
        <ul class="bullets">
          <li><strong>Secret alleys:</strong> Taste 3–4 hidden foodie spots tourists never find.</li>
          <li><strong>No language barrier:</strong> We handle translation, dietary requests & ordering.</li>
          <li><strong>Candid photography:</strong> High-res, natural magazine-style vacation shots.</li>
          <li><strong>Fast turnaround:</strong> All original files + 10-15 graded keepers in 24 hours.</li>
        </ul>
        <div class="offer-price-badge">
          $30 / hour <span>($60 for 2-hour private stroll for your entire group)</span>
        </div>
      </div>
      <div style="border: 1.5px solid #171317; box-shadow: 2px 2px 0px #171317; overflow: hidden; height: 180px;">
        <img src="${photoStrollImg}" alt="TravelFrame photographer walk" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
    </div>

    <!-- Footer / Contact Bar -->
    <div class="contact-bar">
      <div class="contact-item">
        <span>📸 Instagram:</span> <strong>@travelframe.vn</strong>
      </div>
      <div class="contact-item">
        <span>💬 WhatsApp / Direct DM:</span> <strong>Available 24/7</strong>
      </div>
      <div class="contact-item">
        <span>🌐 Web:</span> <strong>travelframe.vn</strong>
      </div>
      <div style="font-size: 8.5px; color: #888;">
        Page 2 of 2
      </div>
    </div>
  </div>

</body>
</html>
`;

const tempHtmlPath = path.join(ARTIFACT_DIR, 'food-map-print.html');
const deliverablePdfPath = path.join(WORKSPACE, 'Creative-Production/Deliverables/TravelFrame-Hanoi-Secret-Food-And-Photo-Guide.pdf');
const artifactPdfPath = path.join(ARTIFACT_DIR, 'TravelFrame-Hanoi-Secret-Food-And-Photo-Guide.pdf');

fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');
console.log('Wrote HTML print template to:', tempHtmlPath);

// Execute Chrome headless print-to-pdf
try {
  execSync(`"${CHROME}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${deliverablePdfPath}" "${tempHtmlPath}"`, { stdio: 'inherit' });
  console.log('✅ Generated PDF in Deliverables:', deliverablePdfPath);
  
  // Copy to artifact directory
  fs.copyFileSync(deliverablePdfPath, artifactPdfPath);
  console.log('✅ Copied PDF to Artifacts:', artifactPdfPath);
  
  const stats = fs.statSync(deliverablePdfPath);
  console.log('File size:', (stats.size / 1024).toFixed(1), 'KB');
} catch (e) {
  console.error('Error generating PDF:', e.message);
  process.exit(1);
}
