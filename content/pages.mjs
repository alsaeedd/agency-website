// Static content pages for raltech.dev. scripts/prerender.mjs wraps each one
// in the shared site template (content/template.mjs) and writes it to
// dist/<path>index.html at build time, so every page ships its full text as
// plain HTML with no JavaScript needed. Facts here must stay true to the
// company: no invented clients, numbers, awards or testimonials.
//
// Fields: path (with trailing slash), title (<title> and og:title), description
// (meta + og), eyebrow, h1, lead, body (HTML), updated (YYYY-MM-DD, used for
// sitemap lastmod), and for articles: type 'article', published, readMinutes.

import { readFileSync } from 'node:fs'

const privacyBody = readFileSync(new URL('./privacy-body.html', import.meta.url), 'utf8')

export const pages = [
  // ── Services ────────────────────────────────────────────────────────────
  {
    path: '/services/',
    title: 'Services: websites, systems, apps and AI automation',
    description:
      'What RAL Technologies builds for GCC founders, SMBs and enterprise teams: marketing websites, internal systems and CRMs, web and mobile apps, and AI agents and workflows. Scoped, built and shipped in-house in Bahrain.',
    eyebrow: 'Services',
    h1: 'Four things we ship, <span class="serif">end to end.</span>',
    lead:
      'We are a small, founder-led software team in Bahrain. We do four kinds of work, and the same people scope it, build it and keep it running. No sub-contractors and no hand-offs between a sales team, a design team and an offshore build team.',
    updated: '2026-10-20',
    body: `
<h2 id="websites">01. Websites</h2>
<p>Marketing sites and shop fronts that load fast and make it easy to buy, book or get in touch. Most of the sites we build have one job: turn a visitor who has never heard of you into a conversation. That means clear positioning above the fold, real content that answers the questions a buyer actually has, and a contact path that works on a phone in one tap.</p>
<p>What that looks like in practice:</p>
<ul>
  <li><strong>Positioning before pixels.</strong> We start with what you sell, who buys it and why they pick you. The design follows from that, not the other way round.</li>
  <li><strong>Performance as a feature.</strong> Self-hosted fonts, compressed images, pre-compressed builds and pages that render without waiting on a pile of third-party scripts. A slow site loses people before the first headline.</li>
  <li><strong>Bilingual when you need it.</strong> English and Arabic with proper right-to-left layout, not a mirrored afterthought. Our work for Kaak Bsemsom is a bilingual EN/AR landing page with a smooth language toggle.</li>
  <li><strong>Indexable from day one.</strong> Real text in the HTML, a sitemap, clean titles and descriptions, so search engines can read what you do.</li>
  <li><strong>Motion with restraint.</strong> We like a cinematic hero as much as anyone, but animation has to load fast and get out of the way of the content.</li>
</ul>
<p>Examples you can visit: <a href="/work/">Knights Gate Advisers, Kaak Bsemsom and CustomPC Bahrain</a>.</p>

<h2 id="systems">02. Systems</h2>
<p>Internal tools, dashboards and custom CRMs: the kind of system that replaces five spreadsheets and a group chat. These projects rarely look glamorous from the outside, and they are often where a business gets its biggest return, because they remove hours of copying, chasing and double entry every week.</p>
<p>Typical systems work includes:</p>
<ul>
  <li><strong>Custom CRMs</strong> shaped around how your team actually sells, instead of bending your process to fit a generic tool.</li>
  <li><strong>Membership and booking platforms</strong> with tiers, renewals, event registration and live availability. Palm &amp; Plate, a members-only dining platform we built from a concept on paper to a working business, is one of these.</li>
  <li><strong>Operations dashboards</strong> that pull numbers from where they already live and show the few that matter.</li>
  <li><strong>Messaging integrations</strong>, including software built on the WhatsApp Business Platform so a business can send and receive customer messages, manage templates and see conversation history in one place.</li>
  <li><strong>Event-driven backends</strong> that react when something happens (a payment, a booking, a form) instead of waiting for someone to notice.</li>
</ul>
<p>We build these with code you can actually read, real databases and proper backups, because an internal system only earns trust if it is still running smoothly a year after launch.</p>

<h2 id="apps">03. Apps</h2>
<p>Web and mobile apps with a real backend, shipped to production rather than left as a prototype or a slide deck. An app is only finished when real people use it every day without someone from the build team standing next to them.</p>
<p>Our own product, <a href="/work/letterlock/">LetterLock</a>, is the clearest example of how we work on apps. It is a trivia board game we designed, built and shipped ourselves: a web app, an iPhone and iPad app on the App Store, an Android app on Google Play and an Android TV app, all running on one codebase with accounts, online rooms, leaderboards and over-the-air updates. Everything we learned shipping it to two app stores and a TV platform goes into client work.</p>
<p>App projects usually cover:</p>
<ul>
  <li>Product scoping: what the first version must do, and what can wait.</li>
  <li>Design and front end for web, iOS and Android.</li>
  <li>The backend: accounts, data, payments, notifications and admin tools.</li>
  <li>Store submissions, signing, review and release management.</li>
  <li>Monitoring and crash reporting after launch, so problems are found before users report them.</li>
</ul>

<h2 id="ai">04. AI</h2>
<p>Agents and workflows that quietly do the work your team was about to hire for. We are practical about AI: it is excellent at reading, sorting, drafting and summarising, and it needs a human checkpoint wherever a mistake would be expensive. The useful question is never "where can we add AI?" but "which repetitive task costs us the most time each week, and can software do most of it safely?"</p>
<p>Good fits we see often:</p>
<ul>
  <li>Triaging inbound messages and routing them to the right person with a suggested reply.</li>
  <li>Turning documents, forms and emails into structured records in your system.</li>
  <li>Drafting quotes, summaries and follow-ups that a person reviews and sends.</li>
  <li>Answering repeat customer questions from your own approved content.</li>
</ul>
<p>We wrote more about this in <a href="/insights/where-ai-automation-pays-off/">Where AI automation actually pays off for a small business</a>.</p>

<h2>How a project runs</h2>
<ol>
  <li><strong>We hear you out.</strong> A conversation, not a pitch. We ask what the business needs, who will use the thing, and what success looks like in numbers you already track.</li>
  <li><strong>We scope it as if it were ours.</strong> A written scope with what is in the first release, what is not, and a quote. The bill matches the quote.</li>
  <li><strong>We build in short loops.</strong> Weekly check-ins on real channels (WhatsApp and email, not a ticket portal you never open) and working software you can click, early.</li>
  <li><strong>We ship to production.</strong> Real hosting, a real domain, backups and monitoring. Launch is the start of the useful life of the product, not the end of our involvement.</li>
  <li><strong>We stay reachable.</strong> Most of the time you can WhatsApp us before lunch.</li>
</ol>

<h2>Who we work with</h2>
<p>Our clients range from bootstrapped founders to banks, and we give every brief the same care. The audience we know best is the GCC: founders and SMBs who need a dependable technical partner, and enterprise teams who need a small, senior team that moves faster than a large vendor. We are based in Bahrain (GMT+3) and work with clients wherever they are.</p>
<p>Have something in mind? <a href="/contact/">Get in touch</a> and tell us about it.</p>
`,
  },

  // ── About ───────────────────────────────────────────────────────────────
  {
    path: '/about/',
    title: 'About RAL Technologies',
    description:
      'RAL Technologies is a small, founder-led software team in the Kingdom of Bahrain, launched in 2025. Who we are, why we started, how we work, and the company details behind the brand.',
    eyebrow: 'About',
    h1: 'The agency we wished <span class="serif">we could hire.</span>',
    lead:
      'RAL Technologies is a small, founder-led software team in the Kingdom of Bahrain. We build production-grade websites, systems, apps and AI automations for GCC founders, SMBs and enterprise teams.',
    updated: '2026-10-20',
    body: `
<h2>Why we started</h2>
<p>We launched in 2025 because we had watched too many friends pay six figures for software that did not ship, or shipped broken. The pattern was always similar: a polished sales process, a long kick-off, a build team that never met the client, and at the end a product nobody could maintain. So we built the agency we wished we had been able to hire: weekly check-ins on real channels, code you can actually read, and a bill that matches the quote.</p>

<h2>What we believe</h2>
<h3>Build it as if we owned it</h3>
<p>We scope and build every project as if it were our own business on the line. That changes small decisions every day: choosing the boring, reliable option over the fashionable one, writing the test nobody asked for, and telling a client when a feature is not worth what it costs.</p>
<h3>Less ceremony, more shipping</h3>
<p>No kick-off theatre. We sit down, hear you out, scope the work, and get moving. Working software early beats a perfect plan late, and real feedback from real users beats internal debate.</p>
<h3>In-house, end to end</h3>
<p>The same small team scopes, designs, builds, ships and supports the work. There are no sub-contractors and no hand-offs, so nothing gets lost between the person you briefed and the person writing the code.</p>
<h3>Serious work, no ego</h3>
<p>We are a small team from a small island, and proud of both. We take the work seriously without taking ourselves too seriously, and we build things made to last.</p>

<h2>What we have shipped</h2>
<p>Our work includes a members-only dining platform, a web presence for a capital and partnerships advisory firm, a bilingual cinematic landing page for a restaurant brand, a full storefront revamp with a 3D PC builder, and our own product, <a href="/work/letterlock/">LetterLock</a>, a trivia board game live on the web, the App Store, Google Play and Android TV. You can see each of them on the <a href="/work/">Work</a> page, and every one is live in production.</p>
<p>LetterLock matters to us beyond being a fun game. Building and running our own product, with real users, two app store review processes, a self-hosted backend, backups and crash reporting, keeps us honest about what "production-ready" means when we promise it to a client.</p>

<h2>Where we are</h2>
<p>We are based in the Kingdom of Bahrain, on GMT+3, and we work with clients across the GCC and beyond. Built in Bahrain, shipped to the world.</p>

<h2>Company details</h2>
<ul>
  <li><strong>Trading as:</strong> RAL Technologies</li>
  <li><strong>Legal entity:</strong> RAL SOFTWARE SERVICES, registered in the Kingdom of Bahrain (CR No. 196651-1)</li>
  <li><strong>Address:</strong> Flat 10, Building 2975, Road 7543, Block 575, Kingdom of Bahrain</li>
  <li><strong>Email:</strong> <a href="mailto:info@raltech.dev">info@raltech.dev</a></li>
  <li><strong>WhatsApp:</strong> <a href="https://wa.me/97366386602">+973 6638 6602</a></li>
</ul>
<p>Want to work with us? Start on the <a href="/contact/">Contact</a> page, or read about our <a href="/services/">services</a>.</p>
`,
  },

  // ── Contact ─────────────────────────────────────────────────────────────
  {
    path: '/contact/',
    title: 'Contact RAL Technologies',
    description:
      'Talk to RAL Technologies about a website, system, app or AI automation. Email info@raltech.dev or WhatsApp +973 6638 6602. Based in Bahrain, GMT+3.',
    eyebrow: 'Contact',
    h1: 'So, what are <span class="serif">we cooking?</span>',
    lead:
      'No formalities needed. We would genuinely love to hear what you have in mind. We are in Bahrain, and probably online right now.',
    updated: '2026-10-20',
    body: `
<h2>Reach us directly</h2>
<ul>
  <li><strong>WhatsApp:</strong> <a href="https://wa.me/97366386602">+973 6638 6602</a>. The fastest way to reach us.</li>
  <li><strong>Email:</strong> <a href="mailto:info@raltech.dev">info@raltech.dev</a></li>
  <li><strong>Time zone:</strong> Bahrain, GMT+3.</li>
</ul>
<p>The homepage also has a short contact form that opens a pre-filled WhatsApp message, so nothing you type is stored on our servers.</p>

<h2>What to send us</h2>
<p>You do not need a formal brief. A few lines are enough to start a useful conversation:</p>
<ol>
  <li><strong>What you want to build or fix.</strong> A website, an internal system, an app, an automation, or "we are not sure yet".</li>
  <li><strong>Who it is for.</strong> Your customers, your team, or both.</li>
  <li><strong>What success looks like.</strong> More enquiries, fewer hours spent on a manual process, a product launched by a date.</li>
  <li><strong>Any constraints.</strong> A deadline, a budget range, systems it has to work with.</li>
</ol>

<h2>What happens next</h2>
<p>We reply, usually within a few hours on a working day, and suggest a short call or a chat on WhatsApp. If the project is a good fit, we write a scope with what goes into the first release and a quote. If it is not a good fit for us, we will say so plainly and, where we can, point you somewhere better.</p>

<h2>Common questions</h2>
<h3>Do you take on small projects?</h3>
<p>Yes. Our clients range from bootstrapped founders to banks, and every brief gets the same care. If a project is too small to need custom software, we will tell you and suggest a simpler route.</p>
<h3>Do you work with clients outside Bahrain?</h3>
<p>Yes. We are based in Bahrain and focus on the GCC, but we work with clients wherever they are. Most of our communication happens over WhatsApp, email and video calls anyway.</p>
<h3>Who does the work?</h3>
<p>Our own in-house team, end to end. We do not pass projects to sub-contractors.</p>

<h2>Company details</h2>
<p>RAL SOFTWARE SERVICES (trading as RAL Technologies)<br />
Flat 10, Building 2975, Road 7543, Block 575, Kingdom of Bahrain<br />
CR No. 196651-1</p>

<h2>Questions about your data</h2>
<p>For privacy questions or a data deletion request, see our <a href="/privacy/">Privacy Policy</a> or email <a href="mailto:info@raltech.dev">info@raltech.dev</a> with the subject "Data Deletion Request".</p>
<p>Players of our game LetterLock can find help, rules and account deletion steps on the <a href="https://letterlock.raltech.dev/faq.html">LetterLock FAQ</a>.</p>
`,
  },

  // ── Work index ──────────────────────────────────────────────────────────
  {
    path: '/work/',
    title: 'Work: selected projects',
    description:
      'Selected RAL Technologies projects, all live in production: Palm & Plate, Knights Gate Advisers, Kaak Bsemsom, CustomPC Bahrain and our own trivia game LetterLock.',
    eyebrow: 'Selected work',
    h1: 'Five projects. <span class="serif">Five real products.</span>',
    lead:
      'Everything here is in production. Follow the links to see each one live.',
    updated: '2026-10-20',
    body: `
<h2>LetterLock: a trivia board game we built and run ourselves</h2>
<p class="tag">Gaming · Web app, iOS, Android, Android TV</p>
<p>Our own free trivia board game. Two teams claim letters on a hex board by answering questions, racing to connect their edges. It is a fair, modern take on a classic TV quiz format: both teams cross the same number of letters, the flaw in the original board fixed with real maths. It runs in any browser, on the App Store, on Google Play and on Android TV, with online rooms where every phone becomes a buzzer.</p>
<p><a href="/work/letterlock/">Read the LetterLock case study</a> · <a href="https://letterlock.raltech.dev/">Play it free</a></p>

<h2>Palm &amp; Plate: members-only dining platform</h2>
<p class="tag">Hospitality · Membership · Full platform, design to deploy</p>
<p>A complete membership platform, from a hospitality concept on paper to a working business that members across Bahrain use. It has tiered memberships with a join flow that needs no password to remember, live event registration with real-time availability and tickets delivered by email, and a member portal where everyone manages their profile, tickets and renewals in one place.</p>
<p><a href="https://www.palmandplate.com" rel="noopener">palmandplate.com</a></p>

<h2>Knights Gate Advisers: boutique advisory web presence</h2>
<p class="tag">Capital · Partnerships · Web presence, design to deploy</p>
<p>A premium marketing site for a Bahrain-based capital and partnerships advisory firm: positioning, leadership and contact in one polished surface. Modular sections for services, leadership and the firm's approach make it easy to extend as the firm grows, and it was built fast, accessible and fully indexable from day one, with the firm's navy and gold palette carried through every component.</p>
<p><a href="https://www.kgadvisers.com" rel="noopener">kgadvisers.com</a></p>

<h2>Kaak Bsemsom: bilingual landing page with cinematic motion</h2>
<p class="tag">Restaurant · F&amp;B · Bilingual landing, EN/AR</p>
<p>A bilingual Arabic and English landing site with full right-to-left support and a smooth language toggle, built around scroll-driven motion and smooth scrolling tuned to feel good on phones too. It is a static export on simple hosting, so it costs almost nothing to run and loads instantly.</p>
<p><a href="https://www.kaakbsemsom.com" rel="noopener">kaakbsemsom.com</a></p>

<h2>CustomPC Bahrain: storefront revamp and 3D PC builder</h2>
<p class="tag">E-commerce · Custom builds · Full revamp + 3D builder</p>
<p>A complete revamp for Bahrain's custom PC shop: a cinematic landing hero, a full visual overhaul from a template look to a brand-true storefront, and a 3D PC builder where customers configure a machine piece by piece with live pricing and a guided flow.</p>
<p><a href="https://www.custompcbh.com" rel="noopener">custompcbh.com</a></p>

<h2>What these projects have in common</h2>
<p>Each one was scoped, designed, built and deployed by the same in-house team, and each one is live. That is the standard we hold ourselves to: not a mock-up, not a staging link, but a product real people use. If you want something similar, <a href="/contact/">tell us about it</a> or read more about our <a href="/services/">services</a>.</p>
`,
  },

  // ── LetterLock case study ───────────────────────────────────────────────
  {
    path: '/work/letterlock/',
    title: 'LetterLock case study: a fair hex trivia game on web, iOS, Android and TV',
    description:
      'How RAL Technologies designed, built and shipped LetterLock, a two-team hex trivia board game with 193 categories and 42,745 questions, live on the web, the App Store, Google Play and Android TV.',
    eyebrow: 'Case study · Our own product',
    h1: 'LetterLock: <span class="serif">a fairer board, shipped everywhere.</span>',
    lead:
      'LetterLock is a trivia board game for two teams that we designed, built and run ourselves. It is free to play in any browser and is live on the App Store, Google Play and Android TV.',
    updated: '2026-10-20',
    body: `
<ul class="facts">
  <li><strong>193</strong> question categories</li>
  <li><strong>42,745</strong> questions, in English and Arabic</li>
  <li><strong>4</strong> platforms: web, iOS and iPadOS, Android, Android TV</li>
</ul>

<h2>The idea</h2>
<p>Many people remember a TV quiz format where contestants claim letters on a board of hexagons by answering questions, trying to build a path across the board. It is a brilliant party format with one structural flaw: the original board gave the two sides paths of different lengths, so one side always had less ground to cover.</p>
<p>LetterLock keeps the fun and fixes the board. It uses the rhombus-shaped grid from the classic connection game Hex. One team connects left to right, the other top to bottom, and both directions cross exactly the same number of hexes. A Hex board has another useful property: it can never end in a draw. However the hexes are shared out, by the time the board is full one team will have connected its edges. Every game has a winner.</p>

<h2>How a game works</h2>
<p>A team picks a hex. LetterLock serves a question whose answer starts with that hex's letter. A correct answer claims the hex; a miss gives the other team a chance to steal it. Because a hex can only belong to one team, every claim both builds your path and blocks your opponent's, so knowing the answer is only half the game. The other half is choosing where to play. The full rules are in the <a href="https://letterlock.raltech.dev/how-to-play.html">LetterLock how-to-play guide</a>, and the strategy side is in <a href="https://letterlock.raltech.dev/tips.html">tips and strategy</a>.</p>
<p>Players choose a 4 × 4, 5 × 5 or 7 × 7 board, a single game or a best of 3 or 5, and an answer timer of 20, 30 or 45 seconds or none at all. In a series the teams swap directions and the board gets fresh letters each game, so no one keeps an advantage from the round before.</p>

<h2>What we built</h2>
<h3>A rules engine we can trust</h3>
<p>Win detection is the riskiest code in a game like this: if the game declares the wrong winner, nothing else matters. The rules live in a pure engine with no user interface code in it. Connection checking uses a union-find structure, and it is cross-checked in tests against a slower, obviously-correct flood-fill, plus randomised tests over large numbers of generated games. Every move is recorded as an event in an append-only log, which is what makes undo, resuming a saved game and online play straightforward: the same events drive every screen.</p>
<h3>Play that fits the room</h3>
<ul>
  <li><strong>Couch Mode:</strong> one shared screen, a host reads the questions and taps which team answered.</li>
  <li><strong>Party Mode:</strong> the host opens a room with a 6-letter code and a QR code, and every player's phone becomes their controller and buzzer while the board stays on the big screen.</li>
  <li><strong>TV:</strong> the Android TV app is fully playable with a remote's arrow keys, including an on-screen pad for typing room codes.</li>
</ul>
<h3>Content at scale, checked properly</h3>
<p>Every question is written so its answer starts with a specific letter, which is what lets any hex serve a question. There are now 193 categories and 42,745 questions, from a Kids and Family pack to a Genius tier, plus flags, maps, logos, film, music and charades, and packs written natively in Arabic that play with Arabic letters on the board. Every pack goes through scripted checks for duplicates, wrong first letters and answers that leak into the question, then a separate fact-check. The complete list is in the <a href="https://letterlock.raltech.dev/packs.html">LetterLock packs guide</a>.</p>
<p>We learned one lesson here the hard way. Content generated cheaply can pass every automated check and still be factually wrong. We threw that content away and rewrote it, and we now treat automated checks as a floor, never as proof of quality.</p>
<h3>Accounts, progress and a backend we run</h3>
<p>Players can start as guests with no sign-up. A free account, with sign-in by email code, Google or Apple, adds XP and levels, friends, leaderboards, saved games and a pack editor for writing your own questions. The backend runs on infrastructure we operate ourselves, with automated off-site backups and error monitoring.</p>

<h2>Shipping to four platforms from one codebase</h2>
<p>LetterLock is one web codebase. The same app runs in the browser and inside native shells for iOS, Android and Android TV, and game updates reach installed apps over the air without a new store release. Native changes still go through store review, and we have now been through App Store review, Google Play review and Android TV review with the same product.</p>
<p>Before anything ships, a continuous integration gate runs type checks, unit and content tests, an end-to-end browser suite, and a layout check across a matrix of phones, tablets, laptops and TVs to make sure no screen ever needs scrolling or clips a control. A deploy only goes out once that gate is green.</p>

<h2>What it taught us, and why it matters for clients</h2>
<ul>
  <li><strong>Test the riskiest logic first.</strong> We wrote the win detection test-first and cross-checked it before building any screens.</li>
  <li><strong>Production is more than the code.</strong> Store accounts, signing keys, privacy policies, account deletion, backups and monitoring are all part of shipping.</li>
  <li><strong>One codebase can go a long way.</strong> A well-structured web app can reach phones, tablets and TVs without four separate builds to maintain.</li>
  <li><strong>Quality checks have to match the risk.</strong> Scripts catch mechanical mistakes. Facts need a careful human-grade review.</li>
</ul>
<p>Every one of those lessons goes straight into the <a href="/services/#apps">apps we build for clients</a>.</p>

<h2>Play it</h2>
<p><a href="https://letterlock.raltech.dev/">Play LetterLock free in your browser</a>, or search for "LetterLock: Hex Trivia" on the App Store and Google Play. Guides: <a href="https://letterlock.raltech.dev/how-to-play.html">How to play</a> · <a href="https://letterlock.raltech.dev/tips.html">Tips</a> · <a href="https://letterlock.raltech.dev/packs.html">Packs</a> · <a href="https://letterlock.raltech.dev/faq.html">FAQ</a> · <a href="https://letterlock.raltech.dev/about.html">About</a>.</p>
<p>We also wrote up the board maths in <a href="/insights/fair-game-board-hex-maths/">Designing a fair game board: the maths behind LetterLock's hex grid</a>.</p>
`,
  },

  // ── Insights index ──────────────────────────────────────────────────────
  {
    path: '/insights/',
    title: 'Insights: notes on building software that ships',
    description:
      'Practical articles from RAL Technologies on custom internal systems, AI automation for small businesses, and the engineering behind our own product, LetterLock.',
    eyebrow: 'Insights',
    h1: 'Notes from <span class="serif">the workshop.</span>',
    lead:
      'Practical write-ups on the work we actually do: replacing spreadsheets with real systems, using AI where it pays, and the engineering behind products we ship.',
    updated: '2026-10-20',
    body: `
<ul class="cards">
  <li>
    <p class="tag">Systems · 2026-10-20</p>
    <h2><a href="/insights/replace-spreadsheets-with-a-custom-system/">When to replace your spreadsheets with a custom system</a></h2>
    <p>The signs a spreadsheet has outgrown its job, what a first internal system should and should not do, and how to move over without stopping the business.</p>
  </li>
  <li>
    <p class="tag">AI · 2026-10-20</p>
    <h2><a href="/insights/where-ai-automation-pays-off/">Where AI automation actually pays off for a small business</a></h2>
    <p>A grounded look at which tasks AI handles well today, where it needs a human in the loop, and how to pick a first automation that earns its keep.</p>
  </li>
  <li>
    <p class="tag">Engineering · 2026-10-20</p>
    <h2><a href="/insights/fair-game-board-hex-maths/">Designing a fair game board: the maths behind LetterLock's hex grid</a></h2>
    <p>Why a hex board can never draw, how we gave both teams paths of equal length, and how we test win detection so the game never names the wrong winner.</p>
  </li>
</ul>
<p>Want to talk about any of these for your own business? <a href="/contact/">Get in touch</a>.</p>
`,
  },

  // ── Article 1 ───────────────────────────────────────────────────────────
  {
    path: '/insights/replace-spreadsheets-with-a-custom-system/',
    type: 'article',
    published: '2026-10-20',
    readMinutes: 6,
    title: 'When to replace your spreadsheets with a custom system',
    description:
      'The signs a spreadsheet has outgrown its job, what a first custom internal system should and should not do, and how to move a team over without stopping the business.',
    eyebrow: 'Insights · Systems',
    h1: 'When to replace your spreadsheets <span class="serif">with a custom system.</span>',
    lead:
      'Spreadsheets run more businesses than any software product ever sold. They are fast, flexible and free. Then one day they stop being any of those things. Here is how to tell when that day has come, and what to do about it.',
    updated: '2026-10-20',
    body: `
<h2>Spreadsheets are not the problem</h2>
<p>Let us be clear first: a spreadsheet is often the right tool. When a process is new, changing every week and owned by one person, nothing beats a sheet for speed. Building custom software too early locks in a process before you understand it. A lot of good systems we have built started life as a well-loved spreadsheet that proved what the business actually needed.</p>
<p>The problem starts when a sheet quietly changes jobs. It stops being a personal tool and becomes the shared operating system of a team, and it was never designed for that.</p>

<h2>Seven signs a spreadsheet has outgrown its job</h2>
<ol>
  <li><strong>Several people edit it at once, and someone keeps overwriting someone else.</strong> Shared sheets handle simultaneous editing better than they used to, but they cannot stop two people from making conflicting decisions in different rows.</li>
  <li><strong>There are copies.</strong> "Sales tracker FINAL", "Sales tracker FINAL v2", a version on someone's laptop and another in a chat. Nobody is sure which one is true.</li>
  <li><strong>The same data is typed twice.</strong> An order goes into the sheet, then into the invoicing tool, then into a delivery list. Each copy is a chance for a typo.</li>
  <li><strong>Only one person understands the formulas.</strong> If they are on leave, the monthly report waits for them.</li>
  <li><strong>You need to know who changed what, and you cannot.</strong> Version history shows edits, but not the business reason behind them, and it is painful to search.</li>
  <li><strong>Customers or partners need a view of it.</strong> Sharing the whole sheet exposes too much; making filtered copies brings back the copies problem.</li>
  <li><strong>Something needs to happen automatically.</strong> A reminder when a renewal is due, a message when a booking is confirmed, an alert when stock is low. A sheet records facts; it does not act on them.</li>
</ol>
<p>If three or more of these are true, the sheet is costing you more than it saves. The cost is just spread across many small moments, so it rarely shows up on a budget.</p>

<h2>What a first system should do</h2>
<p>The most common mistake is trying to replace everything at once. A good first version is deliberately narrow:</p>
<ul>
  <li><strong>One source of truth for one core record.</strong> Customers, bookings, members, orders: pick the record the business revolves around and give it a proper home in a real database.</li>
  <li><strong>Forms that prevent bad data.</strong> Required fields, dropdowns instead of free text, dates that are actually dates. Most spreadsheet pain is inconsistent data, and the cheapest fix is not letting it in.</li>
  <li><strong>Roles and permissions.</strong> Staff see what they need, managers see more, and external people see only their own records.</li>
  <li><strong>A history of changes.</strong> Who changed a status, when, and ideally why.</li>
  <li><strong>The two or three automations that hurt most.</strong> Usually a confirmation message, a reminder and a daily summary.</li>
  <li><strong>An export button.</strong> People will still want to analyse numbers in a spreadsheet, and that is fine. The difference is that the sheet becomes a read-only copy, not the master.</li>
</ul>

<h2>What a first system should not do</h2>
<ul>
  <li><strong>Copy every column.</strong> Old sheets collect columns nobody uses. Moving to a system is a good moment to ask which fields anyone actually reads.</li>
  <li><strong>Automate a process nobody agrees on.</strong> If two managers run the same process differently, software will not settle the argument. Agree the process first, then build it.</li>
  <li><strong>Build reports before there is data.</strong> Dashboards are easy to add once the records are clean. Designing them first is guessing.</li>
</ul>

<h2>Custom build or off-the-shelf tool?</h2>
<p>Off-the-shelf tools are a great answer when your process is close to the standard one: a typical sales pipeline, a typical helpdesk. You get years of product work for a monthly fee. A custom system earns its cost when the way you work is part of what makes you different, when you would spend more on workarounds and integrations than on building, or when you need to combine several things (bookings, memberships, payments, messaging) that no single product does well together.</p>
<p>A useful test: list the five things your team does most often in a day. If an existing product does four of them well, use it. If it does two, and the rest live in side spreadsheets, that is the case for building.</p>

<h2>Moving over without stopping the business</h2>
<ol>
  <li><strong>Clean the data before importing it.</strong> Remove duplicates, agree spelling for categories, fix dates. A day of cleaning saves months of confusion.</li>
  <li><strong>Run both in parallel for a short, fixed period.</strong> One or two weeks, with a clear end date. Open-ended parallel running means nobody commits to the new system.</li>
  <li><strong>Move one team or one process first.</strong> Learn from them, fix the rough edges, then move the rest.</li>
  <li><strong>Make the sheet read-only on switch-over day.</strong> If it can still be edited, it will be.</li>
  <li><strong>Collect feedback in the first month and act on it fast.</strong> Small fixes in week one decide whether people trust the new tool.</li>
</ol>

<h2>The real return</h2>
<p>The return on replacing a spreadsheet is rarely one big saving. It is many small ones: fewer messages asking "is this up to date?", no more re-typing, a renewal that is not missed, a manager who can see the week's numbers without waiting for a report. Add those up across a team over a year and they are usually worth far more than the build.</p>
<p>This is the kind of work we describe under <a href="/services/#systems">Systems</a>. If your team is running on a sheet that has outgrown its job, <a href="/contact/">tell us about it</a>.</p>
`,
  },

  // ── Article 2 ───────────────────────────────────────────────────────────
  {
    path: '/insights/where-ai-automation-pays-off/',
    type: 'article',
    published: '2026-10-20',
    readMinutes: 6,
    title: 'Where AI automation actually pays off for a small business',
    description:
      'A grounded guide to AI automation for small businesses: which tasks AI handles well, where a human must stay in the loop, how to pick a first project and how to measure whether it works.',
    eyebrow: 'Insights · AI',
    h1: 'Where AI automation actually pays off <span class="serif">for a small business.</span>',
    lead:
      'AI is genuinely useful now, and genuinely over-sold. For a small team the question is not whether to "adopt AI" but which specific, repetitive task it can take off someone\'s plate safely. Here is how we think about it.',
    updated: '2026-10-20',
    body: `
<h2>Start from the work, not the technology</h2>
<p>The best automation projects we see begin with a sentence like "two people spend every morning sorting the inbox" or "every quote takes forty minutes to write and they all look the same". The worst begin with "we should be doing something with AI". The first kind has a clear task, a clear owner and a clear way to measure improvement. The second usually ends as a demo.</p>
<p>So before any tools, write down the three most repetitive tasks in your business, roughly how long each takes per week, and what goes wrong when a person does them in a hurry. That list is your shortlist.</p>

<h2>What today's AI models are good at</h2>
<p>Language models are strong at work that involves reading and writing text, especially when the text is messy:</p>
<ul>
  <li><strong>Classifying and routing.</strong> Reading an incoming email or message and deciding whether it is a sales enquiry, a complaint, a booking change or spam, then sending it to the right person.</li>
  <li><strong>Extracting structure.</strong> Pulling names, dates, amounts and items out of emails, PDFs and forms into fields in a system.</li>
  <li><strong>Drafting.</strong> First drafts of replies, quotes, summaries and follow-ups in your house style, for a person to check and send.</li>
  <li><strong>Summarising.</strong> Turning a long thread, a call transcript or a week of tickets into a few lines someone can act on.</li>
  <li><strong>Answering from your own material.</strong> Responding to repeat questions using your approved policies, price lists and FAQs, rather than the model's general knowledge.</li>
</ul>

<h2>Where it needs a human in the loop</h2>
<p>Models can be confidently wrong. That is manageable when a mistake is cheap and visible, and dangerous when it is expensive or hidden. A simple rule works well: the more a mistake would cost, the closer a person should sit to the decision.</p>
<ul>
  <li><strong>Low risk, fully automatic:</strong> tagging and routing messages, filling internal fields, producing internal summaries. If it is wrong, someone notices and fixes it in seconds.</li>
  <li><strong>Medium risk, human approves:</strong> customer-facing replies, quotes and anything that commits the business to a price or a date. AI drafts, a person clicks send.</li>
  <li><strong>High risk, human decides:</strong> refunds, legal or medical statements, anything involving money moving. AI can gather the information, but a person makes the call.</li>
</ul>
<p>Designing these checkpoints in from the start is what separates a dependable automation from one the team stops trusting after the first embarrassing reply.</p>

<h2>Five good first projects</h2>
<ol>
  <li><strong>Inbox triage.</strong> Every inbound message is labelled, prioritised and routed, with a suggested reply waiting for the person who opens it.</li>
  <li><strong>Document to record.</strong> Supplier invoices, application forms or booking requests become structured records in your system, with anything uncertain flagged for review.</li>
  <li><strong>Quote and proposal drafts.</strong> The model fills a template from the client's request and your price list, and a person adjusts and sends it.</li>
  <li><strong>Customer questions on messaging channels.</strong> Common questions on WhatsApp or the website are answered from your own content, with a smooth hand-over to a person for anything else.</li>
  <li><strong>Daily or weekly briefings.</strong> A short summary of what came in, what is overdue and what needs a decision, delivered where the team already reads.</li>
</ol>

<h2>How to measure whether it works</h2>
<p>Pick the measure before building, and keep it boring:</p>
<ul>
  <li><strong>Time:</strong> minutes per task before and after, measured on real work for a couple of weeks.</li>
  <li><strong>Accuracy:</strong> the share of AI outputs a person accepted without changes, and the share they had to fix.</li>
  <li><strong>Speed to customer:</strong> how quickly an enquiry gets a first reply.</li>
  <li><strong>Escalations:</strong> how often the automation handed over to a person, and whether it handed over the right cases.</li>
</ul>
<p>If the acceptance rate is low, the fix is usually better instructions, better examples or a narrower task, not a bigger model.</p>

<h2>Data, privacy and cost</h2>
<p>Three practical points that are easy to skip:</p>
<ul>
  <li><strong>Know where your data goes.</strong> Use providers and settings that do not train on your business data, keep personal data to the minimum the task needs, and make sure your privacy policy says what you do.</li>
  <li><strong>Keep the source of truth in your own system.</strong> The AI reads from and writes to your records; it should not become the only place information lives.</li>
  <li><strong>Watch the running cost.</strong> Usage-based pricing is cheap for most small-business volumes, but it should be measured like any other cost, per task, not guessed.</li>
</ul>

<h2>The honest summary</h2>
<p>For most small businesses, the first useful AI automation is not a chatbot on the homepage. It is a quiet helper that reads, sorts and drafts so people spend their time on the decisions and conversations that need them. Start narrow, keep a person where mistakes are costly, measure honestly, and expand only what works.</p>
<p>This is the work we describe under <a href="/services/#ai">AI</a>. If you have a repetitive task in mind, <a href="/contact/">tell us about it</a>.</p>
`,
  },

  // ── Article 3 ───────────────────────────────────────────────────────────
  {
    path: '/insights/fair-game-board-hex-maths/',
    type: 'article',
    published: '2026-10-20',
    readMinutes: 7,
    title: "Designing a fair game board: the maths behind LetterLock's hex grid",
    description:
      'Why a Hex board can never end in a draw, how LetterLock gives both teams paths of equal length, how first-move advantage is balanced, and how we test win detection with union-find and a flood-fill oracle.',
    eyebrow: 'Insights · Engineering',
    h1: 'Designing a fair game board: <span class="serif">the maths behind LetterLock.</span>',
    lead:
      'LetterLock is our trivia board game. Two teams claim letters on a board of hexagons and race to connect their edges. Underneath the trivia is a small piece of mathematics that makes the game fair, and some engineering that makes sure it always names the right winner.',
    updated: '2026-10-20',
    body: `
<h2>The problem with the classic board</h2>
<p>The TV quiz format that inspired LetterLock used a board of hexagons where one side had to cross the board in one direction and the other side in the other. The board was not square in hex terms, so the two paths were not the same length: one side always had less ground to cover. For a television show that is a quirk. For a game people play again and again with friends, it is a built-in unfairness that the losing team will notice.</p>

<h2>Borrowing the board from Hex</h2>
<p>The fix comes from Hex, a connection game invented independently by Piet Hein in the 1940s and by John Nash a few years later. Hex is played on a rhombus of hexagons, typically 11 by 11. One player owns the left and right edges, the other owns the top and bottom. Players take turns claiming cells, and the first to link their two edges with a connected chain wins.</p>
<p>The rhombus has a lovely symmetry: rotate it and the left-right problem becomes the top-bottom problem. Both players face exactly the same shape of task, with exactly the same number of cells between their edges. LetterLock uses the same board in three sizes: 4 × 4 for a quick game, 5 × 5 as the classic, and 7 × 7 for longer, more strategic matches.</p>

<h2>Why a hex board can never draw</h2>
<p>A surprising and very convenient fact about Hex is that the game cannot end in a draw. If every cell is filled, exactly one player has a winning chain. The intuition is that hexagons meet three at a point, never four. On a square grid, two diagonal squares can touch at a corner, letting both players' paths "cross" each other at that point. On a hex grid there are no such corners: wherever two of your cells touch, they share a whole side, and so a chain from one edge to the other is a solid wall that the other player cannot get through. Either you have built that wall, or your opponent has found a way round, which is their winning chain.</p>
<p>This is more than a curiosity. The result, often called the Hex theorem, has been shown to be equivalent to the Brouwer fixed-point theorem, a famous result in topology. For a party game it means something simpler: every LetterLock game has a winner, so nobody has to invent a tie-breaker at the end of the night.</p>

<h2>Who goes first?</h2>
<p>Hex also has a well-known first-player advantage. Nash showed with a "strategy-stealing" argument that the first player has a winning strategy in principle: an extra cell can never hurt you, so if the second player had a winning strategy, the first player could steal it and win. Nobody knows what that strategy is on large boards, but the advantage is real.</p>
<p>Strict Hex players use the swap rule: after the first move, the second player can choose to take that move as their own. We tried this in LetterLock and later removed it, because in a fast party game the extra decision confused more people than it helped. Instead, LetterLock alternates who picks first and which direction each team plays every game in a best-of-3 or best-of-5 series, and gives the board fresh letters each game. Across a series, both teams get the same opportunities.</p>
<p>There is also a twist that makes LetterLock different from pure Hex: claiming a cell is not guaranteed. You have to answer a question correctly, and if you miss, your opponent can steal the hex. That makes the first-move advantage much smaller in practice, and it adds a layer of strategy Hex does not have: a hex that matters to both teams is worth more, and picking it with a letter your team is unsure about can hand it to your opponent.</p>

<h2>Detecting the winner, correctly</h2>
<p>The most important rule in the game is "who has won?", and it is checked after every claim. If that check is ever wrong, nothing else about the game matters. We built it test-first, before any screens existed.</p>
<h3>Union-find</h3>
<p>The game uses a union-find structure (also called a disjoint-set structure). Each team has two virtual nodes standing for its two edges. When a team claims a hex, we join that hex with any neighbouring hexes the team already owns, and with an edge node if the hex sits on that edge. A team has won the moment its two edge nodes end up in the same set. Each check takes almost constant time, so it is fast even on the largest board.</p>
<h3>A slow, obviously-correct oracle</h3>
<p>Fast code is easy to get subtly wrong, so the tests compare it against a deliberately simple flood fill: start from every hex a team owns on one edge, walk to neighbouring hexes the team owns, and see whether the walk reaches the other edge. It is slower, but it is easy to read and easy to trust. The tests then generate large numbers of random boards and random move orders and require the two methods to agree every time, on every board size.</p>
<h3>Events, not snapshots</h3>
<p>Every action in a game (a pick, a correct answer, a steal, an undo) is recorded as an event in an append-only log, and the board is calculated from the events. That makes undo trivial, makes a saved game a short list of events, and means online rooms can send the same events to every device. If two screens ever disagreed about the board, the event log would show exactly where.</p>

<h2>Why this matters beyond a game</h2>
<p>The habits are the same ones we bring to client systems: identify the logic that would do the most damage if it were wrong, write it as plain code that is separate from the interface, test it against a simpler independent version, and record changes as events so you can always explain how you got to the current state.</p>
<p>You can try the board yourself at <a href="https://letterlock.raltech.dev/">letterlock.raltech.dev</a>, read the <a href="https://letterlock.raltech.dev/how-to-play.html">full rules</a> and the <a href="https://letterlock.raltech.dev/tips.html">strategy guide</a>, or see the full <a href="/work/letterlock/">LetterLock case study</a>.</p>
`,
  },

  // ── Privacy (text unchanged, now inside the site template) ──────────────
  {
    path: '/privacy/',
    title: 'Privacy Policy',
    description:
      'Privacy Policy for RAL Software Services: what data our software processes, why, how long we keep it, and how to request deletion.',
    eyebrow: 'Legal',
    h1: 'Privacy Policy',
    lead: '',
    updated: '2026-09-24',
    body: privacyBody,
  },
]
