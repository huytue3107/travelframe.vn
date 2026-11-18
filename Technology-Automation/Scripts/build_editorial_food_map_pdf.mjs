import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const WORKSPACE = '/Users/macbook/Codex GPT/travelframe.vn';
const ARTIFACT_DIR = process.env.TF_ARTIFACT_DIR || '/Users/macbook/.gemini/antigravity/brain/1bd72a9e-0a26-49a1-bc1f-edf91e445219';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function toBase64(relPath) {
  const full = path.join(WORKSPACE, relPath);
  if (!fs.existsSync(full)) return '';
  const ext = path.extname(full).slice(1);
  const data = fs.readFileSync(full).toString('base64');
  return `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${data}`;
}

const gmaps = (q) => 'https://www.google.com/maps/search/?api=1&amp;query=' + encodeURIComponent(q + ', Hà Nội');

const heroImg = toBase64('Creative-Production/Assets/AI-Generated/HANOI-Hero-Ad-V1.jpg');
const streetImg = toBase64('Creative-Production/Assets/AI-Generated/SEO-Articles/hanoi-couple-walk-historic-alley.jpg');
const coffeeImg = toBase64('Creative-Production/Assets/AI-Generated/SEO-Articles/hanoi-balcony-egg-coffee-traveler.jpg');
const photoStrollImg = toBase64('Creative-Production/Assets/AI-Generated/SEO-Articles/hanoi-private-photographer-walk.jpg');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Hanoi Secret Food & Photo Map — TravelFrame</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@500;600;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 12mm 14mm 12mm 14mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      background-color: #FFFDF9;
      color: #1A1A1A;
      font-size: 9.2pt;
      line-height: 1.68;
      letter-spacing: -0.005em;
    }

    a {
      color: inherit;
      text-decoration: underline dotted;
      text-underline-offset: 2px;
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

    /* Minimalist Masthead */
    .masthead {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #1A1A1A;
      margin-bottom: 20px;
    }

    .masthead-logo {
      display: flex;
      align-items: baseline;
      gap: 10px;
    }

    .brand-name {
      font-weight: 900;
      font-size: 11pt;
      letter-spacing: -0.03em;
      color: #1A1A1A;
    }

    .brand-label {
      font-family: 'Space Grotesk', monospace;
      font-size: 7.5pt;
      font-weight: 700;
      background: #008AA3;
      color: #FFF;
      padding: 2px 7px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border-radius: 2px;
    }

    .masthead-coords {
      font-family: 'Space Grotesk', monospace;
      font-size: 8pt;
      color: #666;
      letter-spacing: 0.04em;
    }

    /* Editorial Headline */
    .hero-title-section {
      margin-bottom: 22px;
    }

    .kicker-row {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
    }

    .kicker-pink {
      background: #FF9ED2;
      border: 1px solid #1A1A1A;
      padding: 2px 8px;
      font-size: 7.5pt;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .kicker-lemon {
      background: #FFF7B2;
      border: 1px solid #1A1A1A;
      padding: 2px 8px;
      font-size: 7.5pt;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .headline {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 27pt;
      line-height: 1.1;
      font-weight: 400;
      letter-spacing: -0.02em;
      color: #1A1A1A;
      margin-bottom: 8px;
    }

    .headline em {
      font-style: italic;
      color: #008AA3;
    }

    .standfirst {
      font-size: 10pt;
      line-height: 1.6;
      color: #555;
      max-width: 620px;
    }

    /* Spot 01 Hero Feature Card */
    .hero-feature {
      background: #FFFFFF;
      border: 1px solid #1A1A1A;
      box-shadow: 4px 4px 0px #1A1A1A;
      padding: 20px;
      margin-bottom: 20px;
      display: grid;
      grid-template-columns: 1.35fr 1fr;
      gap: 20px;
      align-items: center;
    }

    .feature-text {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .spot-num-tag {
      font-family: 'Space Grotesk', monospace;
      font-size: 7.5pt;
      font-weight: 700;
      color: #888;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .spot-headline {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 18pt;
      line-height: 1.15;
      color: #1A1A1A;
    }

    .story-prose {
      font-size: 9.3pt;
      line-height: 1.68;
      color: #333;
    }

    .story-prose strong {
      color: #1A1A1A;
      font-weight: 700;
    }

    .editorial-meta-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      padding-top: 8px;
      border-top: 1px dashed #DDD;
      font-size: 8pt;
      color: #555;
    }

    .meta-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-weight: 600;
    }

    .price-chip {
      font-family: 'Space Grotesk', monospace;
      background: #FFF7B2;
      border: 1px solid #1A1A1A;
      padding: 1px 6px;
      font-weight: 700;
      color: #1A1A1A;
    }

    .hero-img-box {
      border: 1px solid #1A1A1A;
      box-shadow: 3px 3px 0px #1A1A1A;
      height: 205px;
      overflow: hidden;
      position: relative;
    }

    .hero-img-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .img-badge {
      position: absolute;
      bottom: 8px;
      left: 8px;
      background: rgba(26, 26, 26, 0.9);
      color: #FFF;
      font-size: 7pt;
      font-weight: 600;
      padding: 2px 7px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    /* 2-Column Balanced Cards */
    .editorial-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-bottom: 20px;
    }

    .editorial-card {
      background: #FFFFFF;
      border: 1px solid #1A1A1A;
      box-shadow: 3px 3px 0px #1A1A1A;
      padding: 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 12px;
      break-inside: avoid;
    }

    .card-heading-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .card-title {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 14pt;
      line-height: 1.2;
      color: #1A1A1A;
    }

    .card-body {
      font-size: 9pt;
      line-height: 1.66;
      color: #383838;
    }

    .card-meta-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 10px;
      border-top: 1px dashed #E2E0D8;
      font-size: 8pt;
      color: #666;
    }

    .card-meta-left {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    /* Page 2 Specifics */
    .card-side-img {
      display: grid;
      grid-template-columns: 1fr 115px;
      gap: 14px;
      align-items: stretch;
    }

    .side-img-box {
      border: 1px solid #1A1A1A;
      overflow: hidden;
      height: 100%;
      min-height: 130px;
    }

    .side-img-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Sidewalk Observations Box */
    .observations-section {
      background: #FFFFFF;
      border: 1px solid #1A1A1A;
      box-shadow: 3px 3px 0px #1A1A1A;
      padding: 18px 20px;
      margin-bottom: 18px;
    }

    .obs-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 12px;
    }

    .obs-title {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 13.5pt;
      color: #1A1A1A;
    }

    .obs-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .obs-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .obs-num {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 15pt;
      color: #008AA3;
      line-height: 1;
    }

    .obs-item h4 {
      font-size: 8.8pt;
      font-weight: 800;
      color: #1A1A1A;
    }

    .obs-item p {
      font-size: 8.2pt;
      line-height: 1.58;
      color: #4A4A4A;
    }

    /* Feature Invitation */
    .stroll-invitation {
      background: #FFFDF9;
      border: 2px solid #1A1A1A;
      box-shadow: 4px 4px 0px #1A1A1A;
      padding: 18px 22px;
      display: grid;
      grid-template-columns: 1.35fr 1fr;
      gap: 20px;
      align-items: center;
      margin-bottom: 16px;
    }

    .invitation-header {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .invitation-title {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 18pt;
      line-height: 1.15;
      color: #1A1A1A;
    }

    .invitation-lead {
      font-size: 9pt;
      line-height: 1.62;
      color: #333;
    }

    .invitation-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin: 6px 0 8px 0;
      font-size: 8.4pt;
    }

    .invitation-list li {
      display: flex;
      align-items: baseline;
      gap: 6px;
      color: #262626;
    }

    .invitation-list li::before {
      content: "—";
      color: #008AA3;
      font-weight: 700;
    }

    .price-capsule {
      display: inline-flex;
      align-items: baseline;
      gap: 6px;
      background: #FFF7B2;
      border: 1px solid #1A1A1A;
      padding: 5px 12px;
      box-shadow: 2px 2px 0px #1A1A1A;
      align-self: flex-start;
      margin-top: 4px;
    }

    .price-capsule .amount {
      font-family: 'Space Grotesk', monospace;
      font-size: 14pt;
      font-weight: 800;
      color: #1A1A1A;
    }

    .price-capsule .note {
      font-size: 8pt;
      font-weight: 600;
      color: #444;
    }

    .stroll-photo-box {
      border: 1px solid #1A1A1A;
      box-shadow: 3px 3px 0px #1A1A1A;
      height: 185px;
      overflow: hidden;
    }

    .stroll-photo-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Elegant Folio / Running Footer */
    .editorial-folio {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
      border-top: 1px solid #1A1A1A;
      font-size: 7.8pt;
      color: #666;
      font-family: 'Space Grotesk', monospace;
    }

    .contacts-cluster {
      display: flex;
      gap: 16px;
      font-size: 8pt;
      font-weight: 600;
    }

    .contact-point strong {
      color: #008AA3;
    }
  </style>
</head>
<body>

  <!-- ==================== PAGE 1 ==================== -->
  <div class="page page-break">
    
    <!-- Masthead -->
    <header class="masthead">
      <div class="masthead-logo">
        <span class="brand-name">TRAVELFRAME</span>
        <span class="brand-label">Field Notes</span>
      </div>
      <div class="masthead-coords">
        Part 04 • Hanoi • 21°02'N 105°51'E
      </div>
    </header>

    <!-- Editorial Title -->
    <section class="hero-title-section">
      <div class="kicker-row">
        <span class="kicker-pink">The Honest Food Map</span>
        <span class="kicker-lemon">Curated for Real Travelers</span>
      </div>
      <h1 class="headline">Steak for Breakfast & <em>The Soul of Old Hanoi</em></h1>
      <p class="standfirst">
        Six unpretentious street corners where locals sit on tiny plastic stools, eat piping hot meals cooked over coal and iron, and soak in the morning rhythm of the capital.
      </p>
    </section>

    <!-- Spotlight Feature: Spot 01 (Bò Né) -->
    <section class="hero-feature">
      <div class="feature-text">
        <div class="spot-num-tag">Spot 01 • The Morning Skillet</div>
        <h2 class="spot-headline">Bò Né Cột Điện (Branch 5)</h2>
        
        <p class="story-prose">
          Along Nguyễn Trung Trực, breakfast arrives as a screaming-hot iron skillet of flash-seared beef, rich liver pâté, seasoned butter, and an egg that continues frying at your table. Tear a piece of warm baguette, break the yolk directly into the bubbling gravy, and mop the skillet clean.
        </p>
        <p class="story-prose" style="font-size: 8.8pt; color: #555;">
          <strong>Photo walk note:</strong> The French-colonial stone arches of the historic <em>Hàng Đậu Water Tower</em> are just a three-minute stroll around the corner — perfect in soft morning sun.
        </p>

        <div class="editorial-meta-bar">
          <span class="meta-tag">📍 <a href="${gmaps('Bò Né Cột Điện, 5 Nguyễn Trung Trực, Ba Đình')}">5 Nguyễn Trung Trực, Ba Đình</a></span>
          <span class="meta-tag">⏰ 07:00–11:30 & 17:30–21:00</span>
          <span class="price-chip">105,000 VND (~$4.00)</span>
        </div>
      </div>

      <div class="hero-img-box">
        <img src="${heroImg}" alt="Morning food street in Hanoi">
        <div class="img-badge">Morning in Hanoi</div>
      </div>
    </section>

    <!-- 2-Column Grid: Spot 02 & Spot 03 -->
    <section class="editorial-grid">
      
      <!-- Spot 02: Phở Bát Đàn -->
      <article class="editorial-card">
        <div class="card-heading-group">
          <div class="spot-num-tag">Spot 02 • Morning Heritage</div>
          <h3 class="card-title">Phở Bò Gia Truyền Bát Đàn</h3>
        </div>

        <p class="card-body">
          The legendary queue-and-carry phở stall of the Old Quarter. You wait in line, pay at the wooden counter, and carry your own steaming bowl of clear, 12-hour bone broth simmered with roasted ginger and star anise. Order <em>Phở Tái Nạm</em> with two crispy fried crullers (<em>quẩy</em>) to soak up the rich marrow essence.
        </p>

        <div class="card-meta-line">
          <div class="card-meta-left">
            <span>📍 <a href="${gmaps('Phở Bò Gia Truyền Bát Đàn, 49 Bát Đàn, Hoàn Kiếm')}">49 Bát Đàn, Hoàn Kiếm</a></span>
            <span>⏰ 06:30–08:30 (Best early)</span>
          </div>
          <span class="price-chip">55k–65k VND (~$2.30)</span>
        </div>
      </article>

      <!-- Spot 03: Bún Chả Hàng Quạt -->
      <article class="editorial-card">
        <div class="card-heading-group">
          <div class="spot-num-tag">Spot 03 • Hidden Alley Lunch</div>
          <h3 class="card-title">Bún Chả Hàng Quạt (Alley 74)</h3>
        </div>

        <p class="card-body">
          Down a narrow one-meter-wide alley where you duck under clotheslines to find the smoke. Pork patties grilled over wood embers, resting in warm amber fish sauce broth with green papaya. Add minced garlic, fresh chili, and dunk your rice noodles while sitting elbow-to-elbow with local office workers.
        </p>

        <div class="card-meta-line">
          <div class="card-meta-left">
            <span>📍 <a href="${gmaps('Bún Chả 74 Hàng Quạt, Hoàn Kiếm')}">Ngõ 74 Hàng Quạt, Hoàn Kiếm</a></span>
            <span>⏰ 10:30–13:30 (Lunch only)</span>
          </div>
          <span class="price-chip">50k–60k VND (~$2.10)</span>
        </div>
      </article>

    </section>

    <!-- Page 1 Folio -->
    <footer class="editorial-folio">
      <span>TravelFrame Field Notes • Issue 04</span>
      <span>Tap any 📍 address to open Google Maps • Hours and prices can change</span>
      <span>Page 1 of 2</span>
    </footer>

  </div>

  <!-- ==================== PAGE 2 ==================== -->
  <div class="page">
    
    <!-- Masthead Page 2 -->
    <header class="masthead" style="margin-bottom: 12px;">
      <div class="masthead-logo">
        <span class="brand-name">TRAVELFRAME</span>
        <span class="brand-label">Field Notes</span>
      </div>
      <div class="masthead-coords">
        Afternoon Rituals • Steamed Crepes & The Stroll
      </div>
    </header>

    <!-- Grid: Spot 04 & Spot 05 -->
    <section class="editorial-grid" style="margin-bottom: 12px; grid-template-columns: 0.85fr 1.15fr;">
      
      <!-- Spot 04: Bánh Mì 25 -->
      <article class="editorial-card">
        <div class="card-heading-group">
          <div class="spot-num-tag">Spot 04 • The Golden Crackle</div>
          <h3 class="card-title">Bánh Mì 25</h3>
        </div>

        <p class="card-body">
          Warm baguettes baked to a delicate crackle, layered with smooth homemade liver pâté, pickled daikon, fresh cucumber, and cilantro. Sip a salted caramel coconut coffee across the street while waiting.
        </p>

        <div class="card-meta-line">
          <div class="card-meta-left">
            <span>📍 <a href="${gmaps('Bánh Mì 25, 25 Hàng Cá, Hoàn Kiếm')}">25 Hàng Cá, Hoàn Kiếm</a></span>
            <span>⏰ 07:00–19:00 (All day)</span>
          </div>
          <span class="price-chip">35k–45k VND (~$1.50)</span>
        </div>
      </article>

      <!-- Spot 05: Café Giảng -->
      <article class="editorial-card card-side-img">
        <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 8px;">
          <div class="card-heading-group">
            <div class="spot-num-tag">Spot 05 • 1946 Heritage</div>
            <h3 class="card-title">Café Giảng</h3>
          </div>

          <p class="card-body" style="font-size: 8.8pt;">
            The birthplace of Vietnamese egg coffee. Whipped egg custard floats over concentrated Robusta like a warm, drinkable tiramisu. Taste the velvety foam with a spoon first, then stir gently from bottom up.
          </p>

          <div class="card-meta-line" style="padding-top: 6px;">
            <span style="font-size: 7.8pt;">📍 <a href="${gmaps('Cafe Giảng, 39 Nguyễn Hữu Huân, Hoàn Kiếm')}">39 Nguyễn Hữu Huân, Hoàn Kiếm</a> • open daily</span>
            <span class="price-chip">35k VND (~$1.35)</span>
          </div>
        </div>

        <div class="side-img-box">
          <img src="${coffeeImg}" alt="Egg coffee at Cafe Giang">
        </div>
      </article>

    </section>

    <!-- Spot 06: Bánh Cuốn Bà Hoành -->
    <section class="editorial-card" style="margin-bottom: 12px; padding: 12px 18px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
        <div style="display: flex; align-items: baseline; gap: 10px;">
          <div class="spot-num-tag">Spot 06 • Steamed Craft</div>
          <h3 class="card-title" style="font-size: 13pt;">Bánh Cuốn Bà Hoành</h3>
        </div>
        <span class="price-chip">45k–55k VND (~$1.90)</span>
      </div>
      <p class="card-body">
        Paper-thin rice sheets steamed fresh over a taut cotton cloth drum, rolled around savory minced pork and wood ear mushrooms, showered with crispy shallots and served with warm cinnamon sausage (<em>chả quế</em>). Located at <a href="${gmaps('Bánh Cuốn Bà Hoành, 66 Tô Hiến Thành, Hai Bà Trưng')}">66 Tô Hiến Thành, Hai Bà Trưng</a> (Open 06:30–12:00).
      </p>
    </section>

    <!-- Sidewalk Notes -->
    <section class="observations-section" style="margin-bottom: 10px; padding: 12px 20px;">
      <div class="obs-header">
        <h3 class="obs-title">Three Unwritten Rules of the Hanoi Sidewalk</h3>
        <span style="font-family: 'Space Grotesk', monospace; font-size: 7.5pt; color: #777; text-transform: uppercase;">Field Observations</span>
      </div>

      <div class="obs-grid">
        <div class="obs-item">
          <span class="obs-num">01</span>
          <h4>The Plastic Stool Trust</h4>
          <p>Low blue stools mean rapid turnover. If motorbikes are parked two-deep and locals are chatting loudly, the broth is guaranteed fresh that morning.</p>
        </div>

        <div class="obs-item">
          <span class="obs-num">02</span>
          <h4>Safe Machine Ice (Đá Bi)</h4>
          <p>Hollow tubular ice in central Hanoi is commercially filtered and machine-made. It is perfectly safe to enjoy in iced green teas and Robusta coffee.</p>
        </div>

        <div class="obs-item">
          <span class="obs-num">03</span>
          <h4>The Lime Wipe Habit</h4>
          <p>Squeeze a drop of fresh lime onto your paper napkin to wipe your chopsticks and soup spoon before eating. It is the signature habit of true Hanoians.</p>
        </div>
      </div>
    </section>

    <!-- The Photo Stroll Feature -->
    <section class="stroll-invitation" style="margin-bottom: 10px; padding: 12px 22px;">
      <div class="invitation-header">
        <div style="display: flex; gap: 6px;">
          <span class="kicker-pink" style="font-size: 7pt;">Recommended Experience</span>
        </div>

        <h3 class="invitation-title">Don't Walk Alone — The Hanoi Food & Photo Stroll</h3>
        
        <p class="invitation-lead">
          Spend two relaxed hours exploring secret alleys with a friendly local photographer from TravelFrame.
        </p>

        <ul class="invitation-list">
          <li>Taste 3–4 hidden food stalls tourists rarely find alone.</li>
          <li>We translate and handle all the ordering for you.</li>
          <li>Natural candid photos taken while you eat and explore.</li>
          <li>Originals in 24 hours; 10–15 edited keepers per hour in 48 hours.</li>
        </ul>

        <div class="price-capsule">
          <span class="amount">From $30 / hour</span>
          <span class="note">(1-hour minimum • up to 2 guests)</span>
        </div>
      </div>

      <div class="stroll-photo-box">
        <img src="${photoStrollImg}" alt="TravelFrame photographer with travelers in Hanoi">
      </div>
    </section>

    <!-- Contacts Folio -->
    <footer class="editorial-folio">
      <div class="contacts-cluster">
        <span>📸 Instagram: <strong>@travelframe.vn</strong></span>
        <span>💬 WhatsApp / Direct DM: <strong>Active 24/7</strong></span>
        <span>🌐 Website: <strong><a href="https://travelframe.sidevn.com/news/hanoi-secret-food-photo-map">travelframe.sidevn.com</a></strong></span>
      </div>
      <span>Page 2 of 2</span>
    </footer>

  </div>

</body>
</html>
`;

const tempHtmlPath = path.join(ARTIFACT_DIR, 'food-map-editorial-v2.html');
const deliverablePdfPath = path.join(WORKSPACE, 'Creative-Production/Deliverables/TravelFrame-Hanoi-Secret-Food-And-Photo-Guide-v2.pdf');
const artifactPdfPath = path.join(ARTIFACT_DIR, 'TravelFrame-Hanoi-Secret-Food-And-Photo-Guide.pdf');
const previewImgPath = path.join(ARTIFACT_DIR, 'editorial-preview-v2.png');

fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

try {
  execSync(`"${CHROME}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${deliverablePdfPath}" "${tempHtmlPath}"`, { stdio: 'inherit' });
  console.log('✅ Generated polished PDF in Deliverables:', deliverablePdfPath);
  
  fs.copyFileSync(deliverablePdfPath, artifactPdfPath);
  console.log('✅ Copied to Artifacts:', artifactPdfPath);
  
  execSync(`"${CHROME}" --headless --disable-gpu --window-size=1200,1650 --screenshot="${previewImgPath}" "${tempHtmlPath}"`);
  console.log('✅ Generated refined screenshot:', previewImgPath);
} catch (e) {
  console.error('Error generating PDF:', e.message);
  process.exit(1);
}
