---
title: "Why Snapshot Testing Sucks: Or, How I Learned to Stop Updating Snapshots and Write Better Tests"
publishedAt: "2025-01-06T20:51:30.000+00:00"
updatedAt: "2025-01-06T20:51:30.000+00:00"
tags: ["blog"]
primaryTag: "blog"
primaryTagLabel: "Blog"
excerpt: "A pull request lands in your codebase, and the CI pipeline fails. A snapshot test broke. You open the diff and see ...a handful of seemingly random, tiny changes. You shrug, update the snapshots, and move on. This sucks."
featured: false
featureImage: "ghost-1785628038333-why-snapshot-testing-sucks.jpg"
---

<!--kg-card-begin: markdown--><p>Imagine this: you're deep into developing a new feature. The sprint is almost over, and your team lead reminds you to ensure full test coverage. You know you should write proper unit tests, but you're feeling pressed for time. Instead, you rely on snapshot tests. They're quick, easy, and it's still testing everything, right? Resigned, you update the snapshots, commit the results, and move on, just hoping nothing breaks - even though you know you haven't really tested the code.</p>
<p>Fast forward a week. A pull request lands in your codebase, and the CI pipeline fails. A snapshot test broke. You open the diff and see ...a handful of seemingly random, tiny changes. A stray <code>div</code> appeared. An aria-label was added. Nothing that screams &quot;game-breaking bug.&quot; You shrug, update the snapshots, and move on.</p>
<p>Sound familiar? Let's talk about why this sucks.</p>
<hr>
<h3 id="what-snapshot-testing-promises"><strong>What Snapshot Testing Promises</strong></h3>
<p>At its core, snapshot testing seems brilliant. It's supposed to:</p>
<ol>
<li><strong>Catch unexpected changes</strong>: Ensure your UI or API output doesn't change unexpectedly.</li>
<li><strong>Be easy to implement</strong>: A few lines of code, and boom, your component's output is saved and tested against.</li>
<li><strong>Increase confidence</strong>: Every diff is an opportunity to catch bugs.</li>
</ol>
<p>In theory, it's like having a hawk-eyed reviewer for your code. But in practice? It's more like a pedantic roommate who complains if you move the saltshaker an inch.</p>
<hr>
<h3 id="the-reality-of-snapshot-testing"><strong>The Reality of Snapshot Testing</strong></h3>
<h4 id="1-the-everything-is-fine-updates"><strong>1. The &quot;Everything Is Fine&quot; Updates</strong></h4>
<p>You've added a small feature - say, a new button - and a snapshot test breaks.</p>
<p>&quot;Awesome&quot; you think, &quot;It's working!&quot; You update the snapshot and move on. But did you really check every line of that diff? Do you trust your future self to scrutinize a 200-line snapshot to find the single change you care about?</p>
<p>Let's face it: you probably didn't. Most developers treat snapshot diffs like terms of service agreements - skim and click &quot;I agree.&quot; This makes the test almost meaningless.</p>
<hr>
<h4 id="2-death-by-noise"><strong>2. Death by Noise</strong></h4>
<p>A co-worker changes a margin in a CSS file. Suddenly, 15 snapshots are failing. None of the failures are actual bugs, but now someone has to trudge through every single one and verify they're all &quot;acceptable&quot; changes.</p>
<p>Snapshot tests don't just catch regressions; they also catch intentional changes. In practice, this means:</p>
<ul>
<li>Developers get annoyed and stop trusting tests.</li>
<li>Teams waste time verifying or updating snapshots.</li>
</ul>
<p>Instead of being helpful, the tests turn into a time sink - the equivalent of debugging a fire alarm that blares every time you toast bread.</p>
<hr>
<h4 id="3-the-false-sense-of-security"><strong>3. The False Sense of Security</strong></h4>
<p>Here's the kicker: Snapshot tests often give a <strong>false sense of security.</strong></p>
<p>Imagine your component outputs a massive JSON object. Your snapshot test dutifully captures it all: key-value pairs, nested structures, and even random whitespace. But the bug you're looking for? It's buried deep in the output, invisible amidst the noise.</p>
<p>You think your snapshot test is comprehensive. In reality, it's just <strong>brittle</strong> and <strong>opaque.</strong> What you really need are targeted tests that verify specific behaviors, not a firehose of output.</p>
<hr>
<h3 id="working-in-large-teams-and-monorepos"><strong>Working in Large Teams and Monorepos</strong></h3>
<p>Snapshot testing can be especially problematic in large teams or monorepos.</p>
<ul>
<li>
<p><strong>Knock-On Effects</strong>: A change to a root-level dependency, like a shared component library, can trigger failures across dozens (or hundreds) of snapshot tests. For example, updating a button component to include an additional <code>aria-label</code> for accessibility might result in failed tests throughout the monorepo. These failures often represent minor visual changes, but the effort required to review and update them can grind development to a halt. Similarly, innocuous changes like adding a <code>data-*</code> attribute for analytics or debugging shouldn't cause tests to fail, but with snapshot tests, they often do.</p>
</li>
<li>
<p><strong>Flaky Tests</strong>: Snapshots are brittle, and their propensity to break over minor, intentional updates makes them unreliable. This issue is compounded when using libraries like styled-components, where dynamically generated class names or IDs are frequently part of the output. While it's possible to serialize and stabilize these IDs, you shouldn't need to go to such lengths for basic testing.</p>
</li>
<li>
<p><strong>Coordination Overhead</strong>: In a monorepo, changes often require cross-team collaboration. Imagine a shared dropdown component is updated to support new keyboard navigation. This improvement could inadvertently cause snapshots to fail in unrelated projects, requiring multiple teams to coordinate fixes and updates, further complicating the workflow. This causes friction and frustration across teams, reducing the likelihood of updating the components in the future.</p>
</li>
</ul>
<p>To address these issues, consider replacing snapshot tests with more targeted, behavior-driven tests that focus on specific functionality rather than capturing entire outputs. This reduces noise and makes it easier to manage large-scale changes.</p>
<hr>
<h3 id="how-ui-should-be-tested"><strong>How UI Should Be Tested</strong></h3>
<p>Effective UI testing focuses on replicating how users actually interact with your application. At the heart of this is proper unit testing. Well-written unit tests ensure that your components work as expected in isolation. They target specific behaviors and outputs, making it easier to identify and address bugs without relying on brittle or opaque snapshot tests. These tests provide clarity, are easier to maintain, and help developers confidently refactor code without fear of breaking unrelated functionality.</p>
<p>When designing your tests, think about how a user engages with the application. Focus on key interactions, such as button clicks or form submissions, and verify the outcomes align with expectations. This approach ensures your tests reflect real-world use and provide meaningful coverage.</p>
<p>Once you've established strong unit tests, you can layer on integration and end-to-end tests for broader coverage, ensuring every level of the application behaves cohesively under realistic scenarios.</p>
<h4 id="avoid-overusing-test-ids"><strong>Avoid Overusing Test IDs</strong></h4>
<p>While <code>data-testid</code> attributes can be useful in some cases, relying on them should be a last resort. As outlined in the <a href="https://testing-library.com/docs/guiding-principles">Testing Library Guiding Principles</a>, your tests should resemble how users interact with your software. Users don't see test IDs; they click buttons, fill out forms, and navigate based on visible content.</p>
<p>When <code>data-testid</code> becomes necessary, it's still better than querying DOM structure or CSS class names, which are prone to frequent changes. For a deeper dive into making your UI tests resilient to change, check out <a href="https://kentcdodds.com/blog/making-your-ui-tests-resilient-to-change">Kent C. Dodds' blog post</a>.</p>
<h4 id="best-practices-for-ui-testing"><strong>Best Practices for UI Testing</strong></h4>
<ol>
<li>
<p><strong>Query by Text or Role</strong>: Use selectors that reflect what users see, like button labels or ARIA roles. For example, instead of querying a button by its test ID, use its visible text: <code>screen.getByText('Submit')</code>. Leveraging <code>getByRole</code> is particularly effective for writing accessible code. For instance, <code>screen.getByRole('button', { name: 'Submit' })</code> ensures the element is not only visually correct but also follows accessibility guidelines, which benefits users relying on assistive technologies. However, note that <code>getByRole</code> can sometimes have a performance impact, especially in large DOM trees, as discussed in <a href="https://github.com/testing-library/dom-testing-library/issues/552#issuecomment-625172052">this GitHub issue</a>.</p>
</li>
<li>
<p><strong>Simulate Real User Actions</strong>: Instead of manually triggering events, use tools like Testing Library's <code>fireEvent</code> or <code>userEvent</code> to simulate real-world interactions.</p>
</li>
<li>
<p><strong>Focus on Behavior</strong>: Your tests should validate the functionality, not the implementation. For example, test that submitting a form triggers the correct API call and shows a success message, not that a specific div appears in the DOM.</p>
</li>
</ol>
<h4 id="considerations-for-i18n"><strong>Considerations for i18n</strong></h4>
<p>One challenge with queries like <code>getByText</code> is handling internationalization (i18n). If your application supports multiple languages, visible text queries may fail when running tests in different locales. To mitigate this, consider:</p>
<ul>
<li>Using ARIA roles and attributes as fallback selectors.</li>
<li>Implementing localization-aware utilities to adapt queries based on language.</li>
</ul>
<p>While these approaches add complexity, they help ensure your tests remain robust across diverse use cases.</p>
<hr>
<h3 id="a-better-way"><strong>A Better Way</strong></h3>
<p>Snapshot testing isn't inherently evil, but it's frequently overused and misapplied. To make it more effective and manageable, focus on these impactful strategies:</p>
<ol>
<li>
<p><strong>Test Specific Behaviors</strong>: Focus on what actually matters. Instead of snapshotting an entire component, test specific outputs or behaviors.</p>
<p><strong>Example:</strong> Instead of snapshotting a whole modal, write tests that check if the modal's title and button labels are correct.</p>
</li>
<li>
<p><strong>Keep Snapshots Small</strong>: If you must use snapshot tests, keep them scoped. Don't snapshot a massive DOM tree when you only care about one button.</p>
</li>
<li>
<p><strong>Review Snapshots Carefully</strong>: Treat snapshot diffs like code reviews. If you can't verify a snapshot change quickly, it's probably too big.</p>
</li>
<li>
<p><strong>Use Visual Regression Testing</strong>: For UI-heavy projects, tools like Percy or Chromatic can be better alternatives. They provide visual diffs, which are easier to understand than raw snapshot files.</p>
</li>
</ol>
<hr>
<h3 id="break-the-cycle"><strong>Break the Cycle</strong></h3>
<p>Snapshot testing is like bubble wrap: satisfying at first, but useless when overdone. It promises safety but often delivers clutter and complacency.</p>
<p>The next time you find yourself updating snapshots without a second thought, pause and ask yourself: &quot;Am I actually improving this codebase?&quot; If the answer is no, it's time to rethink your approach.</p>
<p>Testing should make your life easier, not harder. It's okay to admit that snapshot testing sucks - because it often does. By embracing accessible and behavior-driven testing practices, you can improve both your codebase and the user experience. With a little thought and restraint, you can tame snapshot testing and make it work for you, not against you.</p>
<!--kg-card-end: markdown-->
