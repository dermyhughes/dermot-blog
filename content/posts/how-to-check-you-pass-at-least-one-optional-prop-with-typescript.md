---
title: "Passing at least one optional prop with TypeScript"
publishedAt: "2022-12-20T23:22:46.000+00:00"
updatedAt: "2022-12-21T00:12:12.000+00:00"
tags: ["blog"]
primaryTag: "blog"
primaryTagLabel: "Blog"
excerpt: "Setting if a prop is optional or not in TypeScript is really simple. But what if you have several optional props, you don't care which one is passed, but one of them has to? That's where Generics can save the day."
featured: false
featureImage: "ghost-1785628038334-how-to-check-you-pass-at-least-one-optional-prop-with-typescript.jpg"
---

<p>Setting if a prop is optional or not in TypeScript is really simple. If it's optional, add a question mark after the prop name.</p><!--kg-card-begin: markdown--><pre><code class="language-js">interface Fruit {
  apples: string;
  oranges?: string;
 }
</code></pre>
<!--kg-card-end: markdown--><p>But what if you have several optional props, you don't care which one is passed, but one of them has to? That's where Generics can save the day.</p><!--kg-card-begin: markdown--><pre><code class="language-js">interface FruitOptions {
  apple: string;
  orange: number;
  pear?: boolean;
  banana?: string;
  grape?: string[];
}
</code></pre>
<!--kg-card-end: markdown--><p>In this example, I have two props you have to pass, but three optional ones. You have to give me <code>apple</code> and <code>orange</code>, but I'll be pretty full after that so I don't mind if I get a <code>pear</code>, <code>banana</code>, or <code>grape</code>s.</p><p>Let's use a <a href="https://www.typescriptlang.org/docs/handbook/2/generics.html">Generic</a> help us out.</p><!--kg-card-begin: markdown--><pre><code class="language-js">type AtLeastOneOptionalFruit&lt;T, U = {}, V = {}, W = {}&gt; = T &amp; (U | V | W)
</code></pre>
<!--kg-card-end: markdown--><p>Woah! Yes, it looks daunting, but let's break it down.<br><br>The <code>AtLeastOneOptionalFruit</code> type is a generic type that takes four type parameters: <code>T</code>, <code>U</code>, <code>V</code>, and <code>W</code>.  <code>T</code> simply stands for <code>T</code>ype. The type parameter represents the required props (<code>apple</code> and <code>orange</code>), and the <code>U</code>, <code>V</code>, and <code>W</code> type parameters represent the optional fruit props. It's generally considered <a href="https://wanago.io/2020/02/17/typescript-generics-discussing-naming-conventions/">best practice</a> to just move up the alphabet for consecutive variables.</p><p>The <code>AtLeastOneOptionalFruit</code> type is defined as a union of the <code>T</code> type and a union of the <code>U</code>, <code>V</code>, and <code>W</code> types, which means that a value of this type must have at least one of the optional fruit props.<br><br>Let's put it together in an example.</p><!--kg-card-begin: markdown--><pre><code class="language-js">interface FruitOptions {
  apple: string;
  orange: number;
  pear?: boolean;
  banana?: string;
  grape?: string[];
}

type AtLeastOneOptionalFruit&lt;T, U = {}, V = {}, W = {}&gt; = T &amp; (U | V | W);

function example(options: AtLeastOneOptionalFruit&lt;FruitOptions, { pear: boolean }, { banana: string }, { grape: string[] }&gt;) {
  // do something with the options object
}

// These calls are all valid because they pass at least one of the optional fruit props
example({ apple: 'red', orange: 4, pear: true });
example({ apple: 'red', orange: 4, banana: 'yellow' });
example({ apple: 'red', orange: 4, grape: ['white', 'red'] });
example({ apple: 'red', orange: 4, pear: true, banana: 'yellow' });
example({ apple: 'red', orange: 4, pear: true, grape: ['orange', 'yellow'] });

// This call is invalid because it doesn't pass any of the optional fruit props
example({ apple: 'red', orange: 4 });
</code></pre>
<!--kg-card-end: markdown--><p>This might seem a bit arbitrary, but I recently came across a need for exactly this when writing a custom tooltip that required either a label as a string, or a custom trigger entirely. I didn't want to set either of them as required. Either option was fine, but you had to provide one of them.<br><br>The above example isn't very scalable though. What if you want to add more optional props, and don't care which one? Imagine are building a car. We have lots of options to choose from, and many are optional. Do we want heated seats? Cruise control?  </p><!--kg-card-begin: markdown--><pre><code class="language-js">interface CarOptions {
  make?: string;
  model?: string;
  color?: string;
  engineSize?: number;
  transmission?: 'automatic' | 'manual';
  sunroof?: boolean;
  navigation?: boolean;
  heatedSeats?: boolean;
  cruiseControl?: boolean;
  // etc.
}
</code></pre>
<!--kg-card-end: markdown--><p>We can scale our type to account for any number of options using an index signature.</p><!--kg-card-begin: markdown--><pre><code class="language-js">type AtLeastOneCarOption&lt;T&gt; = { [K in keyof T]?: T[K] } &amp; { [K in keyof T]: T[K] }
</code></pre>
<!--kg-card-end: markdown--><p>The <code>AtLeastOneCarOption</code> type is defined as a type intersection, using the <code>&amp;</code> operator, between the <code>T</code> type (just like before) and an object type that has a index signature. The index signature is defined using the <code>[K in keyof T]</code> syntax (<code>K</code> stands for Key), which means that the object type has a string index signature that can be any of the keys of the <code>T</code> type. The type of the value of the index signature is set to be optional, using the <code>?</code> operator, and is set to be the same as the type of the value of the corresponding key of the <code>T</code> type.</p><p>This means that the <code>AtLeastOneCarOption</code> type is a type that has all of the props of the <code>T</code> type, and at least one of the optional props of the <code>T</code> type.</p><!--kg-card-begin: markdown--><pre><code class="language-js">type AtLeastOneCarOption&lt;T&gt; = { [K in keyof T]?: T[K] } &amp; { [K in keyof T]: T[K] }

function purchaseCar(options: AtLeastOneCarOption&lt;CarOptions&gt;) {
  // do something with the options object
}
</code></pre>
<!--kg-card-end: markdown--><p>The <code>AtLeastOneCarOption</code> type is a special type that combines two things: all of the options that we have for the car, and at least one of the optional options that we have for the car. This means that when you use the <code>AtLeastOneCarOption</code> type, you have to choose at least one of the optional options, but you can also choose any of the other options that you want.</p><p>Looking at the <code>AtLeastOneCarOption</code> type, the index signature is defined using the <code>[K in keyof T]</code> syntax (<code>K</code> standing for Key), which means that the object type has a string index signature that can be any of the keys of the <code>T</code> type (Type, just like before). The type of the value of the index signature is set to be optional, using the <code>?</code> operator, and is set to be the same as the type of the value of the corresponding key of the <code>T</code> type. This means that the <code>AtLeastOneCarOption</code> type is a type that has all of the optional props of the <code>T</code> type, and at least one of the optional props of the <code>T</code> type.</p><p>The <code>AtLeastOneCarOption</code> type is also defined as a type intersection, using the <code>&amp;</code> operator, between the object type with the index signature and the <code>T</code> type. This means that <code>AtLeastOneCarOption</code> is a type that has all of the props of the <code>T</code> type, and at least one of the optional props of the <code>T</code> type.</p><p>This allows the <code>purchaseCar</code> function to accept an object that has any combination of the optional props, as long as at least one of them is present. If the object passed to the <code>purchaseCar</code> function doesn't have any of the optional props, the TypeScript compiler will give an error.</p><!--kg-card-begin: markdown--><pre><code class="language-js">// These calls are also valid because they pass at least one of the optional car options
purchaseCar({ color: 'red' });
purchaseCar({ engineSize: 4.0 });
purchaseCar({ transmission: 'automatic' });
purchaseCar({ color: 'red', engineSize: 4.0 });

// This call is invalid because it doesn't pass any of the optional car options
purchaseCar({});
</code></pre>
<!--kg-card-end: markdown-->
