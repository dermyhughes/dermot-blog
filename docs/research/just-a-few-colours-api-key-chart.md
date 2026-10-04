# API-key chart anecdote: evidence and editorial opportunities

Researched 4 October 2026. No article edits. This note separates the author's recollection, empirical evidence, product practice and design inference.

## The actual anecdote and its limits

The author recalls encountering a team's usage-over-time line chart with roughly thirty to forty or more series displayed simultaneously, and a paginated legend. They believe the series represented API keys, but both that label and the exact count are uncertain. No original chart, screenshot or requirements have been verified. Preserve that uncertainty: “dozens of lines” is safer than an exact count, and “I think they were API keys” remains a recollection rather than a confirmed product fact.

The author's initial reaction was to question why the information had been presented this way. Do not rewrite their experience as an initial wish for forty distinct colours, an implemented redesign, a customer research finding, or proof of user failure. The interesting story is that what might appear to be a palette request prompted a question about the task itself.

## 1. Multiple time series: task matters more than a universal maximum

**Primary study:** Javed, McDonnel and Elmqvist, [Graphical Perception of Multiple Time Series](https://doi.org/10.1109/TVCG.2010.162), IEEE TVCG 16(6), 927–934, 2010. [Author-uploaded full text](https://www.researchgate.net/publication/47544563_Graphical_Perception_of_Multiple_Time_Series). University-hosted PDF fetches failed during this research; the author's full paper on ResearchGate was readable.

Sixteen engineering students completed 216 trials each: 3,456 trials, with two, four or eight series; four chart types; three display heights; and three tasks. Charts used synthetic data and allowed no brushing, zoom or drill-down. More series reduced correctness and increased completion time. Chart type did not significantly affect correctness overall.

Shared-space line charts were generally quicker for local comparisons, such as finding the highest series at one time. Separate layouts, including small multiples, generally helped with comparisons distributed across the chart. An informal follow-up used four experienced participants and up to sixteen series; the authors explicitly did not seek statistically significant conclusions from that sample.

**Use:** Support choosing the representation for the comparison. Do not claim the research proves eight is a human limit, quantifies a penalty for forty lines, or establishes that small multiples always win. See sections 4–7.

## 2. Interaction helps, but “add hover” is not a complete answer

**Primary study:** Adnan, Just and Baillie, [Investigating time series visualisations to improve the user experience](https://www.macs.hw.ac.uk/~mj8/Adnan_CHI2016Final.pdf), CHI 2016, 5444–5455; DOI 10.1145/2858036.2858300.

Twenty-four participants completed 96 conditions each. The study compared no interaction, highlighting, tooltips and both, across six representations and four tasks using synthetic 112-point datasets. Interaction improved reported confidence and ease of use in several conditions; it did not demonstrate significant speed or accuracy improvements from interaction. For positional charts in the maxima task, tooltips were rated easier than no interaction (pairwise p=.002) and gave higher confidence (p=.005). These are task-specific results, not percentage productivity gains.

The line-chart highlight enlarged a point and added guides to the axes. It did not test selecting an API key from a paginated legend to isolate its whole line. Participants used a mouse and did not report colour blindness.

**Use:** This supports evaluating interaction alongside encoding. It does not show that tooltips or highlighting make forty superimposed lines readable. Test the actual interaction, task and input modes rather than treating “interactive” as evidence of usability.

## 3. A first-person parallel from Heap

**Practitioner source:** Ravi Parikh, [Getting the Details Right in an Interactive Line Graph](https://www.heap.io/blog/line-graph-redesign), 16 December 2013.

Parikh describes Heap initially extending a single-line chart mainly by adding a legend. They subsequently treated multiple lines as a distinct design problem. Overlapping vertices could make points impossible to hover; the redesign turned the legend into a tooltip showing values as the pointer moved through time and removed large vertices that obscured trends. Even then, the chart displayed at most ten series, using the nine largest plus “Other” when more were returned. He explicitly acknowledged unresolved tradeoffs, including legend occlusion.

**Use:** This is an attributed historical design account, informed by customer feedback and internal use, not a controlled study or a current statement of Heap functionality. It is a close parallel for the author's discovery: adding capacity to a chart can change the design problem. It does not prove ten is optimal. The article does not substantiate a claim that the redesign dimmed all other lines on hover.

## 4. What we can and cannot say about legends

**Primary study:** Renshaw and colleagues, [Understanding visual influence in graph design through temporal and spatial eye movement characteristics](https://www.sciencedirect.com/science/article/abs/pii/S0953543804000360), *Interacting with Computers* 16(3), 557–578, 2004; DOI 10.1016/j.intcom.2004.03.001.

The accessible original abstract describes an eye-tracking experiment comparing two line-graph designs. It identifies legend design, placement and relationship to the data area as important to usability. Because the designs differed in multiple features, this should not be presented as an isolated causal effect of pagination or legend distance. The accessible material did not verify a usable sample-size/effect-size claim; omit numerical claims.

**Evidence gap:** Targeted searches for paginated chart legends found implementation examples and unrelated paginated-report documentation, but no directly applicable controlled comparison. This is a bounded search result, not proof that no such study exists.

**Design inference:** A paginated legend can leave a visible line's label off the current legend page. Identifying that line may then require page navigation in addition to matching and tracing. State the mechanism, not an invented measured time cost. Without inspecting the original chart, do not assume the absence of direct hover labels, search or series selection.

The classic Milroy and Poulton direct-labelling study was located bibliographically, but its original full text could not be verified through the available fetches. Secondary accounts vary in publication year and detail. It is unnecessary for the current argument; avoid adding an unverified sample size or percentage benefit.

## 5. Current operational practice, not experimental proof

The accompanying research checked these first-party documentation pages:

- [Amazon CloudWatch Metrics Insights query language](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-metrics-insights-querylanguage.html) supports ordering grouped results using functions including SUM, AVG and MAX, and limiting returned series. This makes the ranking criterion explicit: largest total, largest average and largest spike are different questions.
- [Grafana time-series visualisation](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/time-series/) documents filtering series visibility by name or label. This is a practical precedent for giving access to many series while controlling which are visible.

These features establish available approaches, not that any particular default is best for the remembered chart.

## 6. Editorial integration without inventing an outcome

Use the real chart as the opening incident or as a brief discovery preceding the vendor comparison. Let the paginated legend carry the surprise: the chart had so many identities that even its key could not show them together. Keep any judgement attached to the author's reaction and the inspection questions, not to an unsupported allegation that the team ignored users.

The next beat is to ask what the reader needed to do. Several plausible tasks produce different candidate views:

| Possible question — not verified requirements | Candidate view to evaluate |
| --- | --- |
| How is this known key behaving? | Search/select the key, show its series prominently, retain appropriate context. |
| Which keys consumed the most over this period? | Ranked totals/table or bars, with selected series available for temporal comparison. |
| Which key spiked? | Rank by peak or deviation appropriate to the domain, then inspect time detail. Total-volume ranking could miss the incident. |
| Did several keys change together? | A selected shared-axis comparison, or aligned small multiples with suitable common scales. |
| What is the overall usage? | An aggregate with a clearly defined breakdown rather than a distinct identity for every line. |

These are design hypotheses. The evidence does not select one without knowing the task. “Other” also changes the represented entity: an aggregate needs a stated membership rule, particularly when time ranges or ranking change.

The design-system insight is that supporting an expanding dataset does not require displaying every series at once. A palette can travel with rules for selection, stable identity, comparison and escalation to another view. Once a user selects a manageable subset, the existing Electronics example still explains why those series must retain their identities.

## Recommended claim boundaries

- Strong: the real chart raised a question about what users were being asked to compare; palette size alone could not answer it.
- Supported: more simultaneous series can worsen performance, and relative chart effectiveness depends on the task, in the studied conditions.
- Supported as practice: real analytics products use selection and ranking to manage visible series.
- Inference: paging through labels may add work when identifying visible lines.
- Unsupported: forty lines always fail; eight is a perceptual ceiling; small multiples are always superior; a particular redesign worked for this team; pagination has a measured universal performance penalty.
