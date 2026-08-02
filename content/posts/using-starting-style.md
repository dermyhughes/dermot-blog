---
title: "Using @starting-style for Animations on First Render"
publishedAt: "2025-06-14T00:25:00.000+01:00"
updatedAt: "2025-06-14T00:25:00.000+01:00"
tags: ["blog"]
primaryTag: "blog"
primaryTagLabel: "Blog"
excerpt: "Anyone who's ever tried to animate an element that fades or slides into view the moment it appears has realised it's not as easy as you think it should be. The good news: the CSS spec folks felt our pain and introduced the new @starting-style at-rule."
featured: false
featureImage: "ghost-1785628038333-using-starting-style.jpg"
---

<p>Anyone who's ever tried to animate an element that fades or slides into view the moment it appears has realised it's not as easy as you think it should be. Until recently, doing a nice “entry” animation required extra CSS/JS tricks – like adding special classes via JavaScript or using CSS keyframes. The good news: the CSS spec folks felt our pain and introduced the new <strong><code>@starting-style</code></strong> at-rule. This rule lets you define an element’s <em>starting</em> CSS for its debut appearance, making those initial mount animations much simpler.</p><p><strong>Why was animating on first render hard?</strong> The core issue is that CSS transitions normally need a <em>previous state</em> to animate from. If an element is hidden (or not in the DOM) and then suddenly appears, there’s no prior rendered state – so by default, no transition runs. In fact, CSS transitions are <strong>not triggered on an element’s first appearance</strong> in the DOM (for example, when changing <code>display: none</code> to <code>block</code>). In the past, toggling an element from <code>display: none</code> to visible would just pop it in with no smooth transition. In frameworks like React, UI elements are frequently conditionally rendered—meaning they literally don't exist in the DOM until a certain state or prop changes. If your React component initially isn't rendered at all (for example, it's conditionally included only after a button click or state change), the browser had no previous style to animate from, leading to abrupt, jarring appearances.</p><p>The workaround typically involved pre-rendering elements invisibly (<code>opacity: 0</code>) or positioning them off-screen, ensuring they always existed in the DOM. Another common approach was toggling classes immediately after the first render to kick-start transitions, using JavaScript timing hacks like <code>setTimeout</code>.</p><p>These solutions <em>worked</em>, but were cumbersome. For example, consider a simple React component that should fade in on mount. Before <code>@starting-style</code>, you might do something like this:</p><figure class="kg-card kg-code-card"><pre><code class="language-jsx">import React, { useState, useEffect } from 'react';

function Badge({ count }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() =&gt; {
    if (count &gt; 0) {
      // Set visibility after mount to trigger the animation
      requestAnimationFrame(() =&gt; setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [count]);

  if (count === 0) return null;

  return (
    &lt;div className={`badge ${isVisible ? 'pop' : ''}`}&gt;
      {count}
    &lt;/div&gt;
  );
}
</code></pre><figcaption>fade-in-box.jsx</figcaption></figure><figure class="kg-card kg-code-card"><pre><code class="language-css">.badge {
  transform: scale(0);
  transition: transform 0.3s ease;
  background: red;
  color: white;
  border-radius: 50%;
  padding: 6px 10px;
  display: inline-block;
}

.badge.pop {
  transform: scale(1);
}
</code></pre><figcaption>styles.css</figcaption></figure><p>Initially, the badge renders without the <code>.pop</code> class, thus applying <code>transform: scale(0)</code> and hiding it. After the component mounts, <code>useEffect</code> triggers, adding the <code>.pop</code> class via <code>requestAnimationFrame</code>. With <code>.pop</code> applied, the badge transitions smoothly from <code>transform: scale(0)</code> to <code>transform: scale(1)</code>, causing it to "pop" into view.This achieves the effect, but it required extra JS logic and a hidden class in CSS. We also had to ensure the element was <em>initially</em> in the DOM  to transition – if it started as <code>display: none</code>, the transition wouldn’t run at all.</p><hr><p>The <strong><code>@starting-style</code></strong> CSS at-rule is a new feature (part of CSS Transitions Level 2) that essentially bakes those initial state values into CSS, no JavaScript needed. It allows you to <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style">define starting values for properties set on an element that you want to transition from when the element receives its first style update</a>. In plain terms, this is like telling the browser: <em>“When this element first appears, pretend it had these styles, and transition from there to its normal styles.”</em></p><p>So how do we use it? The syntax is straightforward. You can either write a standalone <code>@starting-style</code> block with selectors inside, or nest it inside an element’s CSS rule. Here’s a basic example using our badge "pop" scenario:</p><pre><code class="language-css">.badge {
  scale: 1; 
  transition: scale 0.3s ease;

  @starting-style {
    scale: 0;
  }
    
}
</code></pre><p>Now, whenever the <code>Badge</code> component is conditionally rendered (for instance, when a notification arrives and <code>count</code> goes from 0 to a positive number), it instantly pops into view, scaling up smoothly from <code>scale: 0</code> to <code>scale: 1</code>. Notice that no special JavaScript class management or visibility toggling is necessary – the browser handles it. The <code>@starting-style</code> rule defines the styles <em>before the first update</em>, and the normal <code>.badge</code> rule provides the end state. As CSS-Tricks succinctly puts it, this at-rule lets us define styles for elements “<a href="https://css-tricks.com/almanac/rules/s/starting-style/#:~:text=The%20%40starting,first%20rendered%20in%20the%20DOM">just as they are first rendered in the DOM</a>”. It’s perfect for smooth entrance animations for things like pop-ups, modals, tooltips, or any content that wasn’t on the page and then is added.</p><p>You can place <code>@starting-style</code> rules in two ways – <strong>nested</strong> inside the element’s rule (as we did above), or <strong>standalone</strong> at the top level with its own selector. Both are valid. If you use a separate block, just remember that the rules inside <code>@starting-style</code> have the <em>same specificity</em> as your normal CSS, so you typically want the <code>@starting-style</code> block <strong>to come after the regular rule</strong> in your stylesheet order. (When nested, this ordering is naturally satisfied as long as you write it after the final-state declarations.) This ensures the initial styles don’t get overridden before they can do their job.</p><p>Let’s go back to our React component example and see how it simplifies with <code>@starting-style</code>. We no longer need that extra state or effect to toggle a class:</p><figure class="kg-card kg-code-card"><pre><code class="language-jsx">function Badge({ count }) {
  return count &gt; 0 ? (
    &lt;div className="badge"&gt;{count}&lt;/div&gt;
  ) : null;
}
</code></pre><figcaption>badge.jsx</figcaption></figure><figure class="kg-card kg-code-card"><pre><code class="language-css">.badge {
  scale: 1; 
  transition: scale 0.3s ease;

  @starting-style {
    scale: 0;
  }

  /* Additional styling for clarity */
  background: red;
  color: white;
  border-radius: 50%;
  padding: 6px 10px;
  display: inline-block;
}
</code></pre><figcaption>styles.css</figcaption></figure><p>This is not only cleaner, but it sidesteps timing issues where you had to delay style changes. The browser will smoothly transition from the starting style to the final style <em>as part of the element’s first render cycle</em>. </p><p><em>As a side-note: you're probably used to the <code>transform</code> property, but modern CSS actually  lets us set transform-like properties individually. In fact, there are now separate CSS properties for <code>translate</code>, <code>rotate</code>, and <code>scale</code> – meaning you don’t always have to cram everything into a single <code>transform</code> shorthand. These <strong>individual transform properties</strong> are supported across all major browsers (Chrome, Firefox, Safari) as of the <a href="https://web.dev/articles/css-individual-transform-properties#:~:text=Shipping%20with%20Chrome%20104%20are,those%20parts%20of%20a%20transformation">last couple years</a>.</em></p><p>One of the big wins of <code>@starting-style</code> is handling elements that toggle from <code>display: none</code>. If you want to animate an element that was display-none (like a modal that’s initially not shown), you should know about the <code>transition-behavior</code> property. In CSS Transitions Level 2, they introduced <code>transition-behavior: allow-discrete</code> to enable transitions on <strong><a href="https://developer.chrome.com/blog/entry-exit-animations#:~:text=Transitioning%20discrete%20properties">discrete properties</a></strong> (properties that don’t interpolate, like <code>display</code>). To animate an element from <code>display: none</code> to <code>display: block</code>, you typically:</p><p>Include <code>display</code> in your <code>transition</code> list <em>with</em> the <code>allow-discrete</code> flag. For example: <code>transition: opacity 0.5s, display 0.5s allow-discrete;</code>.</p><ul><li>Use <code>@starting-style</code> to define the starting state when the element is made visible. Crucially, that starting state should set the element to a visible display value (like <code>display: block</code>) along with whatever visual properties you want to animate. Setting <code>display</code> to the final value in the starting-style block ensures the element is rendered (but you can keep it hidden via opacity/scale until the transition runs).</li></ul><p>For example, if a component’s CSS has <code>display: none</code> when “closed”, you might do:</p><pre><code class="language-css">.component.closed { display: none; opacity: 0; }

.component.open { 
  display: block; 
  opacity: 1; 
  transition: opacity 0.3s, display 0.3s allow-discrete;
  /* ... other final styles ... */
}

/* Starting style for entry: element is made display:block (so it can animate), but opacity starts at 0 */
@starting-style {
  .component.open {
    display: block;
    opacity: 0;
  }
}
</code></pre><p>In this setup, when you add the <code>.open</code> class (or attribute) to show the component, it will use the <code>@starting-style</code> values (display block + opacity 0) as the initial point and transition to display block + opacity 1. The result: a fade-in even though the element was previously <code>display:none</code>. This was basically impossible with pure CSS before!</p><p>The <code>@starting-style</code> rule is a welcome addition for frontend developers. It eliminates a lot of the boilerplate and timing hacks we used to need for simple entrance animations. By letting CSS define an element’s starting state on first render, it <strong>keeps our animation logic in CSS</strong>, where it arguably belongs, and reduces dependency on JavaScript for visual effects. And with <a href="https://caniuse.com/?search=%40starting-style">good browser support</a> across the board, you can now effortlessly create smooth entry animations for modals, popovers, tooltips, new list items – you name it – with a few lines of CSS.</p>
