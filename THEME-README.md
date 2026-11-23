# Hemline

A free Shopify theme for fashion and apparel stores: clothing, shoes and bags, and it suits kids, sport and pet clothing too. Made by [ZeronKit](https://zeronkit.com).

Hemline is built on Online Store 2.0: JSON templates, sections everywhere, header and footer section groups, theme blocks (nested), app blocks and Custom Liquid. It ships with English and Arabic (full right-to-left support) and has no app dependencies, no build step and no frameworks.

## Free, as is, no warranty

- Hemline is free to use and change on your own store or stores. It is distributed only by ZeronKit, not from the Shopify Theme Store.
- It is **not for resale or redistribution**: do not sell it, share it, upload it to theme marketplaces or present it as your own work.
- It is provided **as is, without any warranty**, to the extent permitted by law. See `LICENSE`.
- **Support is best-effort, on request only**, through https://zeronkit.com. Support is not guaranteed.
- **Updates are released when needed and when time allows.** There is no schedule and no guarantee of future updates.

## Installing

1. Download the theme zip.
2. In Shopify admin go to **Online Store > Themes > Add theme > Upload zip file**.
3. Customize it, then publish when you are ready.

## Updating

Themes uploaded as a zip **do not update automatically** in Shopify. To update:

1. **Duplicate your current theme first** (Themes > ... > Duplicate). This keeps a backup of your settings and content.
2. Upload the new zip as a new theme.
3. Copy your settings across, or re-apply your customizations, and check every page before you publish.

## Signature features

Each feature is described with the problem it solves and why it goes further than the usual approach in leading fashion themes.

### 1. Outfit builder (section)
Shoppers pick one piece per row (top, bottom, shoes, accessory), choose a size for each, see the running total and add the whole look in one request. Rows can be optional or required, sold out pieces are skipped automatically, and a small flat-lay collage shows the chosen pieces.

*Why it is better:* premium fashion themes usually sell a look through image hotspots or a "shop the look" list where each product is added one by one. Hemline lets the shopper actually swap pieces and sizes and buy the outfit in one step, which is how people dress.

### 2. Fit confidence on the product page
- **Per image model notes.** A product metafield `hemline.model_info` (multi-line text) holds one line per image, for example `Model is 178 cm and wears M`. Each note appears under its own photo, next to the frame number.
- **Fit scale.** A product metafield `hemline.fit` with `runs_small`, `true_to_size` or `runs_large` shows a three step scale.
- **Size guide drawer.** A page chosen in the block, or per product with the page reference metafield `hemline.size_guide`, opens in an accessible side drawer.
- **Sizes on product cards.** Cards list the size values and strike through the ones that are out of stock, in the colour shown.

*Why it is better:* most themes show one generic size chart link and one "model wears" line in the description, which is wrong as soon as a second model or a second colour appears. Hemline ties the note to the image the shopper is looking at, and shows stock per size before the product page is even opened.

### 3. Colour stories
- **Palette blocks** describe a mood with up to four colours and link to a collection or a filtered URL.
- **Colour chips** are built automatically from the native swatch data on your product options (Shopify's `swatch.color` and `swatch.image`), each linking to the collection filtered by that colour.
- On collection and search pages a **colour bar** turns the colour filter into a row of swatch links above the grid.

*Why it is better:* in most themes colour filtering hides inside a filter drawer as a list of words. Hemline makes colour a way to browse, using data you already maintain, with no extra app.

### 4. Drop ledger (new arrivals without fake urgency)
A numbered release sheet: a large outlined drop code, a plain release date and each piece numbered in arrival order. An upcoming drop shows a sign-up form instead of products.

*Why it is better:* drop and launch layouts often rely on countdown timers and stock pressure. Hemline presents drops as an edition you can browse, honest by design: no countdown, no invented stock numbers.

### 5. Hang tag product card
The price hangs off the photo like a garment tag, with a punched hole drawn in CSS. It straightens on hover and focus. Colours come from native swatches, sizes in stock are listed under the title, and the second image fades in on hover.

*Why it is better:* the card carries the information fashion shoppers decide on (colour, size, price) without a quick view pop-up, while staying a single link that is simple for keyboards and screen readers.

### 6. The navigator (header)
A slim bar with a "Shop" button that opens a column navigator: top level items on the start side, their children as titled columns, third level links below, and the collection image beside them. On phones the same markup becomes sliding panels. An optional quick link rail sits under the bar.

*Why it is better:* mega menus are usually hover-only panels that are hard to use by keyboard and need a second, different mobile menu. Hemline uses one accessible pattern for every screen size and every input method.

### 7. Contact sheet gallery
Product media is laid out like a photographer's contact sheet, with frame numbers (01 / 06) and the model note under each frame. On phones it becomes a swipeable strip. Video and 3D load only when asked for.

## Theme Store feature checklist

| Feature | Where |
| --- | --- |
| Discounts per item, per order, in cart | `snippets/cart-lines.liquid`, `snippets/cart-summary.liquid` |
| Accelerated checkout on product and cart | `snippets/buy-form.liquid` (`payment_button`), `snippets/cart-summary.liquid` |
| Faceted filtering on collection and search | `snippets/facets.liquid`, `assets/facets.js` |
| Gift card page (Apple Wallet, code, QR 140 px, logo or shop name) | `templates/gift_card.liquid` |
| Image focal points | `snippets/image.liquid` |
| `page_image` for social sharing | `snippets/meta-tags.liquid` |
| Country/currency and language selectors | `snippets/localization.liquid` (header navigator and footer) |
| Nested menus (3 levels) | `sections/header.liquid` |
| Newsletter | footer block, `sections/newsletter.liquid`, password page |
| Pickup availability | `sections/pickup-availability.liquid` |
| Related and complementary products | `sections/product-recommendations.liquid`, complementary block |
| Rich media (video, external video, 3D, AR) incl. featured product | `snippets/media.liquid` |
| Search template and predictive search | `sections/main-search.liquid`, `sections/predictive-search.liquid` |
| Selling plans on product and in cart | `snippets/buy-form.liquid`, `snippets/cart-lines.liquid` |
| Shop Pay Installments banner | `payment_terms` in `snippets/buy-form.liquid` |
| Unit pricing on collection, product and cart | `snippets/price.liquid`, `snippets/cart-lines.liquid` |
| Variant images and swatches | `snippets/variant-picker.liquid`, `snippets/swatch.liquid` |
| Follow on Shop | footer |
| `shopify-account` component | header |
| SEO, canonical, Open Graph, Twitter, structured data | `layout/theme.liquid`, `snippets/meta-tags.liquid` |
| Social icons | `snippets/social-icons.liquid` |
| App blocks and Custom Liquid | product, footer, canvas, hero, apps section, Custom Liquid section and block |

## Metafields used (all optional)

| Namespace and key | Type | Purpose |
| --- | --- | --- |
| `hemline.model_info` | Multi-line text | One model note per image line |
| `hemline.fit` | Single line text | `runs_small`, `true_to_size` or `runs_large` |
| `hemline.size_guide` | Page reference | Size guide page for this product |

## Accessibility and performance

Keyboard support everywhere, visible focus, labelled controls, 4.5:1 text contrast in the default schemes, 24 px minimum touch targets (most are 44 px), `prefers-reduced-motion` respected, forced colours supported. One CSS file, one small ES module, section scripts loaded only when their section is on the page, responsive images with focal points, video and 3D loaded on request.

## Theme credit

The footer shows a small "Theme by ZeronKit" link. You can switch it off in **Theme settings > Theme credit**.

## Licence

Copyright (c) 2026 ZeronKit. Hemline is released under the ZeronKit Free Theme Licence (see `LICENSE`). In short:

- You may use and modify it, free of charge, on stores you own or run.
- You may not redistribute, resell, sublicense or upload it to theme marketplaces, or present it as your own work.
- Copyright, author and signature notices must stay in the files.
- It is provided as is, with no warranty.

Fonts are served by Shopify's font library under their own licences. Payment icons, the Apple Wallet badge and the QR code script are provided by Shopify at runtime and are not part of this package.

## Authenticity

Every copy made by ZeronKit carries the signature `ZK-HEMLINE-0DAC1CE1043A`: in the `--zk-sig` property in `assets/theme.css`, a comment in `assets/theme.js`, and a comment, a generator meta tag and the `data-zk` attribute in `layout/theme.liquid` and `layout/password.liquid`. It is plain static text: it sends nothing, tracks nothing and does not change how the store works.
