---
title: "Just a few colours. How hard could it be?"
publishedAt: "2026-09-22T14:20:00.000+01:00"
tags: ["blog"]
primaryTag: "blog"
primaryTagLabel: "Blog"
excerpt: "Fifty colours, a thirteenth category and Germany changing colour after a filter. What a simple palette request taught me about design systems."
featured: false
featureImage: "just-a-few-colours.svg"
metaTitle: "Just a few colours. How hard could it be?"
metaDescription: "A simple request for chart colours led through perception, accessibility and a filtering surprise to a finite palette with rules for keeping identities stable."
---

<p>I was asked to introduce data visualisation colours into Aperture, our design system. Pick a palette, give it some tokens, make it available in Figma.</p>
<p>A perfectly reasonable request. I’ve worked on design systems long enough to be suspicious of those.</p>
<p>I could already picture the finished work: a tidy row of swatches, a few sensible names, another useful addition to the library. Then I asked the question that started unravelling it.</p>
<p>What makes a good chart colour?</p>

<h2 id="what-is-the-colour-saying">What is the colour saying?</h2>
<p>Enough contrast seemed like a reasonable start. But against what? The background? The next segment in a stacked bar? Seven other lines crossing the same plot?</p>
<p>Before picking values, I needed to separate their jobs. <a href="https://carbondesignsystem.com/data-visualization/color-palettes/">Carbon’s guidance</a> made that useful distinction: categorical colours identify things, sequential scales show increasing amounts, diverging scales show values either side of a midpoint, and status colours carry established meanings.</p>
<p>A product category needs an identity. Review volume needs a progression. An error needs a meaning people recognise. Borrowing the error red for the next category could suggest the entire department needed somebody’s attention.</p>
<p>The categorical palette was the awkward one. We could define a scale for volume. We couldn’t know every category a customer might introduce.</p>
<p>How many colours would be enough?</p>

<h2 id="fifty-colours-use-eight">Fifty colours. Use eight.</h2>
<p>I looked at other systems, hoping somebody had solved this neatly enough for me to borrow the answer.</p>
<p><a href="https://atlassian.design/foundations/color/data-visualization-color">Atlassian provides eight categorical tokens and recommends five or six colours in a visualisation</a>. <a href="https://carbondesignsystem.com/data-visualization/color-palettes/">Carbon provides fourteen</a>. Then I found <a href="https://cloudscape.design/foundation/visual-foundation/data-vis-colors/">Cloudscape: fifty categorical colours</a>.</p>
<p>Fifty sounded promising. Until I read the same guidance recommending up to eight series in a line or bar chart, and five slices in a pie or donut.</p>
<p>That changed the question. A bigger palette gives teams more choices across a product. It doesn’t make fifty categories readable in one chart.</p>
<p>“Lots of data” wasn’t a useful requirement either. A thousand points might share five identities; twenty lines might be impossible to follow. <a href="https://www.datawrapper.de/blog/colors-for-data-vis-style-guides">Lisa Charlotte Muth’s advice at Datawrapper</a> gave me a better starting point: audit the charts your organisation actually makes.</p>
<p>The dashboard below is a demonstration made for this article, with invented review data. Its scatter plot uses eight category colours for 240 products; its heatmap needs an ordered ramp. The eight-slice donut shows a more crowded use of those same categories. These examples illustrate the questions, rather than supply evidence for the answers.</p>
<figure class="kg-card kg-image-card kg-width-wide"><img class="kg-image" src="/images/posts/data-visualisation-colours-dashboard-colour.svg" width="1440" height="1510" loading="lazy" decoding="async" alt="A fictional customer-review dashboard with six charts: 240 products in a scatter plot, eight weekly review series, stacked sentiment bars, sentiment deviations from a benchmark, a sequential review-volume heatmap and an eight-slice donut. Colour is the main cue to category identity."><figcaption>Invented review data illustrating different colour roles. More points do not necessarily require more colours.</figcaption></figure>
<p>A finite palette was looking sensible. Could an algorithm help me choose it?</p>

<h2 id="surely-we-can-generate-them">Surely we can generate them</h2>
<p>As an engineer, I liked the idea: define the qualities we want, generate the values, keep the output repeatable. But first I had to understand the controls.</p>
<p>HSL gives us hue, saturation and lightness. Set pure yellow and pure blue to 50% lightness and they ought to look equally light, surely?</p>
<p><a href="https://www.w3.org/TR/css-color-4/#the-hsl-notation">The CSS Color specification uses exactly this pair</a> to show why they don’t. Yellow looks much lighter. The numbers agree; your eyes have objections.</p>
<p>OKLCH, based on <a href="https://bottosson.github.io/posts/oklab/">Björn Ottosson’s Oklab model</a>, gives us a lightness coordinate designed around perception, alongside chroma and hue. In the second pair below, yellow and blue share that lightness value and look much more balanced. Their luminance-preserving grey equivalents make the difference easier to inspect.</p>
<figure class="kg-card kg-image-card kg-width-wide"><img class="kg-image" src="/images/posts/data-visualisation-colours-02-equal-numbers-different-colours.svg" width="1200" height="1020" loading="lazy" decoding="async" alt="Top: yellow and blue both have HSL lightness 50%, but their luminance-preserving greys are very different. Bottom: yellow and blue at OKLCH lightness 0.65 and chroma 0.12 produce much closer greys."><figcaption>HSL’s equal lightness produces very different greys; OKLCH brings them closer. Greys preserve linear-light sRGB relative luminance, rounded to 8-bit values. Luminance is not a complete model of perceived lightness, and the two colour models use different lightness scales.</figcaption></figure>
<p>Those controls let us explore a brand hue without guessing at every adjustment. <a href="https://mattstromawn.com/writing/how-to-pick-the-least-wrong-colors/">Matt Ström’s work on Stripe’s chart colours</a> shows how algorithms can search across competing goals, including resemblance to a chosen palette and distinction under colour-vision simulations.</p>
<p>But a good swatch isn’t automatically a good line. Colours that look distinct in generous squares can become hard to follow as thin, crossing strokes.</p>
<p>Generation could help author the palette. It couldn’t give us an unlimited supply of distinguishable colours. Colour thirty-seven could be perfectly repeatable and line thirty-seven still be a mess.</p>
<p>At least the screenshots would be consistent.</p>

<h2 id="category-thirteen">Category thirteen</h2>
<p>I settled on twelve curated colours as the proposal: enough room for a useful range, small enough to review individually in light and dark themes. Twelve is a product choice to validate, rather than a threshold established by the research.</p>
<p>Then comes category thirteen.</p>
<p>Adding another shade postpones the decision until fourteen. I wanted a rule we could keep: reuse the first colour, with a different treatment. Solid blue for category 1; blue with diagonal hatching for category 13. The hue repeats. The complete visual identity doesn’t.</p>
<figure class="kg-card kg-image-card kg-width-wide"><img class="kg-image" src="/images/posts/data-visualisation-colours-09-scaling-13.svg" width="1200" height="1020" loading="lazy" decoding="async" alt="Scaling demonstration at thirteen categories: category 13 reuses the first blue with diagonal hatching. The original twelve colour-and-fill assignments remain unchanged."><figcaption>The first reused colour gains a pattern. No new hex value is generated, and the existing categories keep their identities.</figcaption></figure>
<p>That gave automation a more useful job: allocate combinations of authored colours and treatments predictably. Electric blue could stay electric blue. Scaling the system wouldn’t require us to keep watering down its personality.</p>
<p>It also needed a clear boundary. Accessibility starts with category one. <a href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html">WCAG’s use-of-colour guidance</a> requires another way to convey information; its <a href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html">non-text contrast guidance</a> generally requires relevant graphical parts to have at least 3:1 contrast against adjacent colours, with exceptions. Passing a background-contrast check doesn’t prove categories are distinguishable.</p>
<p>Direct labels identify the bars above from the outset. Other charts may need shapes or line styles before twelve. The overflow rule tells us how to reuse colours; it doesn’t give the first batch an accessibility exemption.</p>
<p><a href="https://www.w3.org/WAI/WCAG22/Techniques/general/G111">Colour plus pattern is an established technique</a>, but the treatment must suit the mark: hatching for filled bars, different strokes for lines, different shapes for points.</p>
<figure class="kg-card kg-image-card kg-width-wide"><img class="kg-image" src="/images/posts/data-visualisation-colours-11-overflow-by-chart.svg" width="1200" height="522" loading="lazy" decoding="async" alt="Category 01 and category 13 share the same blue. Filled marks distinguish them with solid fill and hatching; line examples use solid and dashed strokes; point examples use circles and squares. Each example is directly labelled."><figcaption>The same reused hue, treated differently for fills, lines and points. Evaluate each treatment at the chart’s actual size.</figcaption></figure>
<p>We also need to respect existing meanings. A dash already used for “forecast” can’t quietly become “we ran out of colours”. Sequential and status colours keep their own rules.</p>
<p>Twenty-four assignments still wouldn’t guarantee a readable twenty-four-category chart. Small marks can hide patterns; repeating the same hatch on two similar colours won’t distinguish them. Sometimes the useful answer is a filter, a grouped view or smaller comparable charts. There’s a point where more stripes just gets you a carpet catalogue.</p>
<p>But suggesting a filter exposed a problem no palette could solve.</p>

<h2 id="germanys-unsolicited-rebrand">Germany’s unsolicited rebrand</h2>
<p>Imagine Germany is purple in a country comparison. Someone filters out France. Germany becomes orange.</p>
<p>Nothing about Germany has changed. The application assigned colours by array position, and everything moved up a place. An unsolicited rebrand.</p>
<figure class="kg-card kg-image-card kg-width-wide"><img class="kg-image" src="/images/posts/data-visualisation-colours-04-filter-the-data-keep-the-identity.svg" width="1200" height="760" loading="lazy" decoding="async" alt="With zero-based palette slots, France uses 00, Germany 01 and Spain 02. Filtering France out shifts the remaining colours when allocation follows array positions. A stored category mapping keeps Germany purple in slot 01 and Spain teal in slot 02."><figcaption>A hypothetical filter, using zero-based array slots. A stored category mapping keeps Germany purple when France disappears.</figcaption></figure>
<p>I’d been worrying about stable colour values. Here, every hex value could stay exactly the same while the chart changed what it meant.</p>
<p>The reader learned “purple is Germany”. One ordinary interaction made that knowledge wrong.</p>
<p>The application needs to assign a colour-and-treatment combination to a stable category ID, then preserve it through filtering, sorting and related charts. Category 13 keeps its hatch even when only three categories remain visible.</p>
<p>Dark mode follows the same principle: Germany keeps its purple identity while the value adapts to the surface, as <a href="https://atlassian.design/foundations/color/data-visualization-color">Atlassian’s theme-aware chart tokens</a> allow.</p>
<p>I’d started by imagining automation that invented more colours. What I needed was automation that remembered its decisions.</p>

<h2 id="back-to-the-swatches">Back to the swatches</h2>
<p>My recommendation is <strong>twelve fixed, curated categorical colours, authored separately for light and dark, with stable reuse through additional treatments when the palette is exhausted</strong>. Publish the same values to Figma and code. Keep category assignments stable. Set a supported capacity, and simplify charts that exceed it.</p>
<figure class="kg-card kg-image-card kg-width-wide"><img class="kg-image" src="/images/posts/data-visualisation-colours-10-curated-twelve-themes.svg" width="1200" height="752" loading="lazy" decoding="async" alt="Twelve fixed candidate colours in light and dark themes. Every value is part of the curated palette. Overflow reuses these colours with an additional treatment instead of generating more colours."><figcaption>Twelve illustrative candidates in each theme. Stated surface contrast has been checked; these are not approved brand tokens.</figcaption></figure>
<p>The values above are candidates, with the first eight used in the demonstration dashboard. They still need evaluation in our product, including colour-vision testing. Chart accessibility also includes readable text, keyboard access for interactions and <a href="https://www.w3.org/WAI/tutorials/images/complex/">descriptions and access to the underlying data</a>.</p>
<p>I began with a row of swatches in mind. The research gave that row a purpose, an overflow rule and a memory.</p>
<p>This is the work a design system should absorb: make the complicated decisions once, explain their limits, and give the next team something dependable to use. A chart shouldn’t change its story because somebody clicked a filter. Category thirteen shouldn’t send a designer back to the colour picker.</p>
<p>Just a few colours. And a clear answer when somebody needs one more.</p>
