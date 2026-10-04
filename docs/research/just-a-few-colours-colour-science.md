# Colour science and system behaviour for “Just a few colours”

Researched 4 October 2026. This note checks the draft's concrete claims and gathers primary research and first-person practice that could sharpen its argument. It does not validate Aperture's proposed twelve colours. The article has not been edited.

## Editorial opportunity

The strongest story is the move from choosing colours to preserving meaning while a chart changes. The existing Electronics/filter example, the fifty-colours/eight-series contradiction, and the collision between “forecast” dashes and overflow dashes already demonstrate this. Give those moments more room and reduce general explanations that considered design is invisible.

The most useful additions are a real Tableau anecdote, evidence that mark geometry changes colour discrimination, and the unresolved tension between stable identity and optimising the colours currently on screen. The latter is our design inference, not a finding reported by the sources.

## 1. Vendor counts: correct, with a revealing qualification

| Source | Verified guidance | Editorial implication |
| --- | --- | --- |
| [Atlassian: Data Visualization](https://atlassian.design/foundations/color/data-visualization-color) | Eight categorical tokens; recommends five or six displayed colours and grouping additional categories. The specified order aims to distinguish neighbouring colours. When display order cannot be controlled, such as lines, it requests other visual indicators. | The count is accurate. Distinguishable neighbours do not establish that every possible pair works equally well. |
| [Carbon: Color palettes](https://www.carbondesignsystem.com/building-blocks/data-visualization/color-palettes) | An ordered categorical palette of fourteen, with sequence chosen for neighbouring contrast. Also provides alternatives when category count is predictable. | “An ordered palette of fourteen” is accurate. This is design-system guidance, not an experimental human-capacity limit. |
| [Cloudscape: Data visualization colors](https://cloudscape.design/foundation/visual-foundation/data-vis-colors/) | Fifty categorical values drawn from five hue families. Advises considering up to eight series in line/bar charts and five points in pie/donut charts. | Keep “Fifty colours. Use eight.” It captures the distinction between library inventory and a readable view. Do not describe fifty as fifty independent hue families or eight as a universal scientific ceiling. |

**New tension to explore:** Suppose stable categories retain slots 1 and 7 when the intervening categories disappear. They are now neighbours, although the palette was arranged for good adjacent differences in its original order. Recolouring could improve the current view while damaging recognition. Direct labels, borders and other cues can help resolve the conflict. This scenario is an inference from the vendor guidance and the article's stability requirement, not an observed Aperture incident.

## 2. A real anecdote: Tableau changed the samples to make them useful

**Primary source:** Maureen Stone, [How we designed the new color palettes in Tableau 10](https://www.tableau.com/blog/colors-upgrade-tableau-10-56782), 28 July 2016.

Stone describes subdued colours designed for backgrounds and shading becoming difficult to distinguish in the small colour-picker samples. The team increased the samples' chroma until they were distinguishable. She compares this size effect to choosing paint from a small chip and being surprised by its strength on a wall. The tool also previewed palette squares, smaller legend squares, scatterplot circles, stacked areas and text.

The same account offers a valuable migration detail: upgrading Tableau preserved old views with the previous theme and classic colours. Changing to the new theme migrated automatic colours, while explicitly assigned colours kept their values.

**Use in the essay:** Attribute the anecdote to Tableau. Do not turn it into an experience the author had at Bazaarvoice. Either the picker incident or the migration decision would earn its place more readily than another famous quotation. Together they show that a palette needs contextual rendering and a policy for change.

## 3. Colour difference depends on the mark

**Primary research:** Danielle Albers Szafir, [Modeling Color Difference for Visualization Design](https://danielleszafir.com/colordiff_vis2017.pdf), IEEE TVCG 24(1), 392–401, 2018; DOI 10.1109/TVCG.2017.2744359.

Crowdsourced experiments tested colour differences in points, bars and lines. Mark size and shape changed discrimination, and conventional colour-difference measures underestimated the differences needed in these visualisation conditions. Elongated marks were more discriminable than equally thick point marks. Consequently, “thin lines are always harder than dots” would misrepresent the result; actual geometry matters.

The study deliberately simplified charts: only target marks were coloured, other marks were grey, and distances were constrained. It therefore supports testing actual marks rather than claiming a universal threshold for crowded dashboards or crossing lines. Section 8.1 explains these limits.

**Possible demonstration:** Render the same two candidate colours as large swatches, small scatterplot points and narrow lines. Keep the values unchanged and ask the reader to find one series. Present this as a demonstration to inspect, not a controlled experiment proving that every reader has the same experience.

**Earlier source:** Stone, Szafir and Setlur's [An Engineering Model for Color Difference as a Function of Size](https://www.tableau.com/research/publications/engineering-model-color-difference-function-size), 2014, describes adapting CIELAB using crowdsourced size-discrimination data. The official abstract is accessible; the legacy full-paper URL referenced elsewhere was not needed for the claims above.

## 4. Algorithms retain the designer's tradeoffs

**First-person source:** Matt Ström-Awn, [How to pick the least wrong colors](https://mattstromawn.com/writing/how-to-pick-the-least-wrong-colors/), 31 May 2022.

The draft accurately presents this as an optimisation exploration prompted by Stripe dashboard needs. His scoring combines brand resemblance, colour differences and simulations of colour-vision deficiency. A particularly useful admission is that orange and green in an optimised example still become similar under the protanopia simulation; he explicitly calls for testing with people. Increasing a criterion's weight steers the result toward it, potentially sacrificing others.

**Editorial angle:** An algorithm can search the choices we describe; it cannot choose what we owe the reader. “Which tradeoff did I encode?” is more revealing than “hand-curated versus generated.” Do not repeat the source's numerical improvement as a measured improvement in users' performance: it is improvement against the author's loss function. Nor does the post establish a production rollout or successful user study at Stripe.

**Perceptual-space primary source:** Björn Ottosson, [A perceptual color space for image processing](https://bottosson.github.io/posts/oklab/), the author's introduction of Oklab. Oklab aims to model lightness, chroma and hue with useful numerical behaviour. Its stated assumptions include normal well-lit viewing; supporting different viewing conditions is explicitly outside its practical aim. This supports using perceptual coordinates as useful tools without presenting equal numerical spacing as a guarantee of equal legibility in every chart. Keep this a sentence unless the article becomes specifically about palette generation.

## 5. Accessibility: identity and visibility are separate questions

**Primary guidance:** W3C's [Understanding SC 1.4.1: Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).

The criterion concerns information conveyed through colour alone. Text, shape and other visual distinctions can provide another route. The guidance includes a nuance: substantial lightness differences can count as an additional visual distinction, but tasks requiring identification of a particular colour still need another indicator. Avoid reducing the rule to “never use colour” or suggesting colour-vision simulation certifies a chart.

**Primary guidance:** W3C's [Understanding SC 1.4.11: Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

The draft is right to distinguish background contrast from distinguishing adjacent marks. Do not replace this with a blanket requirement for every palette colour to contrast 3:1 with every other colour. W3C's line-chart example requires contrast against the background but, with little overlap, not every line against every other. Its pie examples distinguish category labels alone from labels plus values: the latter can convey equivalent information without relying on slice boundaries. Essential graphical boundaries otherwise need adequate contrast, potentially supplied by borders.

**Use in the essay:** Ask three concrete questions: Can I see the mark? Can I identify its category? Can I obtain its value and understand the comparison? These are our editorial prompts, not three additional WCAG criteria. Accessibility is not an overflow treatment that begins with category thirteen.

## 6. Stable allocation needs an explicit scope

**Primary implementation source:** [D3 ordinal scales](https://d3js.org/d3-scale/ordinal). Its documentation warns that an implicitly inferred domain depends on encounter order; an explicit domain is recommended for deterministic behaviour. When the domain exceeds the range, colours repeat from the start.

This grounds the draft's array-position failure in real implementation behaviour, but an explicit domain alone is not an enterprise identity policy.

**Design questions, not claims about Aperture:** Is Electronics stable within a chart session, a dashboard, a customer account, or every product? What happens when a saved report reopens, a category is renamed, a category disappears then returns, or two dashboards are compared? A shared registry within a defined comparison context can preserve assignments. Globally reserving distinct colours for unlimited user-generated categories cannot guarantee both uniqueness and a finite palette.

**Candidate scenario:** Two individually consistent reports put Electronics side by side using different colours because each initialised its own mapping. Label this hypothetical. It makes “across related charts” concrete and shows why a component's correct local behaviour may still produce an inconsistent system.

## 7. Find the requirement before defending twelve

**Practitioner source:** Lisa Charlotte Muth, [A detailed guide to colors in data vis style guides](https://www.datawrapper.de/blog/colors-for-data-vis-style-guides), 30 March 2022.

Muth recommends auditing the last thirty to fifty visualisations, recording colour's role and number of colours, and identifying recurring categories. She cautions against letting a rare high-count chart determine the whole palette; a style-guide project is also an opportunity to improve chart design.

**Application:** Twelve is honestly described as provisional in the draft, but the rationale remains absent. An audit outcome or a real constraint would be a stronger beat than another vendor comparison. If that evidence does not exist yet, keep it as an open research question. No source here establishes that twelve is right for Aperture.

## Optional angle: a scale also encodes what “more” means

These sources were checked by the accompanying editorial research, and are optional directions rather than necessary additions to this essay.

Schloss and colleagues' [Mapping Color to Meaning in Colormap Data Visualizations](https://pubmed.ncbi.nlm.nih.gov/30188827/) investigates interpretation through dark-is-more and opaque-is-more associations. These can conflict on a dark background. The useful editorial lesson is to check what viewers infer from the actual scale and background, rather than state a universal rule to reverse every scale in dark mode.

Soto and colleagues' [2023 study of numerical and conceptual magnitude](https://pmc.ncbi.nlm.nih.gov/articles/PMC10279625/) offers another complication: a rank of one can represent greater quality even though the number is smaller. For a retail dashboard, this suggests checking whether a scale communicates a larger number, better performance, or distance from a target. This proposed application is our inference; neither paper tested Aperture.

## Suggested priorities for revision

1. Preserve Electronics, “That's an awkward way to introduce the Home department,” fifty/eight, and the forecast-dash collision. They make readers experience the problem.
2. Expand one consequential conflict: retaining identity while improving current-view discrimination, or coordinating mappings across reports.
3. Add one attributed Tableau anecdote and a compact mark-size demonstration. These supply concrete evidence without turning the essay into a literature review.
4. Ground twelve in product evidence when available. Keep all invented retail examples explicitly hypothetical.
5. Shorten the closing repetitions and end on the user's actual question about reviews. No study or guidance here needs an additional invisible-design maxim to explain its value.
