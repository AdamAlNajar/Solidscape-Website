# Planning and Design

## Audience note

The site is for homeowners and landlords in Dubai and the wider UAE who are
thinking about renovating a villa or apartment: a kitchen, a bathroom, a pool
area or a full refit. Most are adults aged roughly 30–60 who are comparing a
few contractors before getting in touch, and many will first see the site on a
phone after finding Solidscape on Instagram or through a referral.

What they need is reassurance: proof of real finished work, a sense that the
company is careful and trustworthy, and a quick way to make contact. That is
why the design uses calm neutral colours with a gold accent from the logo,
large clear headings, a photo showcase, and a contact option (WhatsApp button,
"Let's talk" button and form) visible on every page. Text is kept short and
plain because visitors scan rather than read.

*(143 words — limit 150)*

## Site map

```
                         ┌──────────────────┐
                         │   Home           │
                         │   index.html     │
                         └────────┬─────────┘
            ┌─────────────────────┼─────────────────────┐
            ▼                     ▼                     ▼
  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
  │  About Us        │  │  Our Work        │  │  Contact Us      │
  │  about.html      │  │  showcase.html   │  │  contactus.html  │
  └──────────────────┘  └──────────────────┘  └────────┬─────────┘
                                                       │ POST /api/contact
                                                       ▼
                                              ┌──────────────────┐
                                              │ server.js emails │
                                              │ the enquiry      │
                                              └──────────────────┘
```

Every page shares the same header navigation (Home · About Us · Our Work ·
Contact) and footer links, so any page can be reached from any other in one
click. Every page also has the floating WhatsApp / Instagram icons and the
"Let's talk" button that links to the contact page.

## Wireframes

Desktop layout is shown. At 900px and below the nav links collapse into a ☰
menu button; at 650px and below every multi-column row stacks into one column.

### Home — `index.html`

```
┌──────────────────────────────────────────────────────────────┐
│ [LOGO]                     Home  About  Our Work  Contact    │  header + nav
├──────────────────────────────────────────────────────────────┤
│  EYEBROW TEXT                       ┌───────────────────────┐│
│  Big headline                       │  S  (dark panel)      ││  hero
│  Short intro paragraph              │  Brand tagline        ││
│  [Discuss project] [Explore work]   │  ───                  ││
│                                     └───────────────────────┘│
├──────────────────────────────────────────────────────────────┤
│  WHY SOLIDSCAPE / heading     │  Paragraph about approach    │  intro
├──────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│ │01 Strength   │ │02 Strength   │ │03 Strength   │           │  3 feature cards
│ └──────────────┘ └──────────────┘ └──────────────┘           │
├──────────────────────────────────────────────────────────────┤
│▓ Have a renovation in mind?               [Talk to our team]▓│  dark CTA band
├──────────────────────────────────────────────────────────────┤
│              SOLIDSCAPE · tagline · links · ©                │  footer
└──────────────────────────────────────────────────────── (WA)(IG)[Let's talk]
```

### About Us — `about.html`

```
┌──────────────────────────────────────────────────────────────┐
│ [LOGO]                     Home  About  Our Work  Contact    │
├──────────────────────────────────────────────────────────────┤
│                 GET TO KNOW US / About Solidscape            │  page hero
│                     one-line intro                           │
├──────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐   WHO WE ARE                            │
│ │ “ Quote heading  │   Heading                               │  statement +
│ │   (dark box)     │   Two paragraphs about the company      │  company story
│ └──────────────────┘                                         │
├──────────────────────────────────────────────────────────────┤
│  WHAT GUIDES US / heading                                    │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │  values cards
│ │01 Mission    │ │02 Integrity  │ │03 Detail     │           │
│ └──────────────┘ └──────────────┘ └──────────────┘           │
├──────────────────────────────────────────────────────────────┤
│▓ Tell us what you'd like to change.              [Contact us]▓│
├──────────────────────────────────────────────────────────────┤
│                           footer                             │
└──────────────────────────────────────────────────────────────┘
```

### Our Work — `showcase.html`

```
┌──────────────────────────────────────────────────────────────┐
│ [LOGO]                     Home  About  Our Work  Contact    │
├──────────────────────────────────────────────────────────────┤
│                 SELECTED PROJECTS / Our Work                 │  page hero
├──────────────────────────────────────────────────────────────┤
│  THE PORTFOLIO / heading              "Click any photo..."   │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│ │ [photo] 01   │ │ [photo] 02   │ │ [photo] 03   │           │  6 project cards
│ │ TYPE         │ │ TYPE         │ │ TYPE         │           │  (3 × 2 grid)
│ │ Title / text │ │ Title / text │ │ Title / text │           │
│ └──────────────┘ └──────────────┘ └──────────────┘           │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│ │ 04           │ │ 05           │ │ 06           │           │
│ └──────────────┘ └──────────────┘ └──────────────┘           │
├──────────────────────────────────────────────────────────────┤
│▓ Let's plan your next renovation.   [Start a conversation]   ▓│
├──────────────────────────────────────────────────────────────┤
│                           footer                             │
└──────────────────────────────────────────────────────────────┘

  Click a photo →  ┌───────────── dark overlay ─────────────┐
                   │                                    [×] │
                   │         [ large photo ]                │  lightbox
                   │      Project title - type              │
                   └────────────────────────────────────────┘
```

### Contact Us — `contactus.html`

```
┌──────────────────────────────────────────────────────────────┐
│ [LOGO]                     Home  About  Our Work  Contact    │
├──────────────────────────────────────────────────────────────┤
│               LET'S TALK / Contact Solidscape                │  page hero
├──────────────────────────────────────────────────────────────┤
│ CONTACT INFORMATION     │ ┌────────────────────────────────┐ │
│ Heading                 │ │ Send us a message              │ │
│ Intro text              │ │ Full name *     [__________]   │ │
│ ───                     │ │ Email *         [__________]   │ │
│ PHONE  (tap to call)    │ │ Phone           [__________]   │ │
│ EMAIL  (tap to email)   │ │ Topic *         [ select ▾ ]   │ │
│ ┌─────────────────────┐ │ │ Message *       [          ]   │ │
│ │ LOCATION            │ │ │                 0 / 4000       │ │
│ │ directions + Maps   │ │ │ Reply by * (•)Email ( )Call    │ │
│ └─────────────────────┘ │ │            ( )WhatsApp         │ │
│ WhatsApp preferred note │ │ Start date      [dd/mm/yyyy]   │ │
│                         │ │ [Send enquiry →]               │ │
│                         │ │ status / error messages        │ │
│                         │ └────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────┤
│                           footer                             │
└──────────────────────────────────────────────────────────────┘
```
