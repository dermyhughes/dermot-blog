---
title: "JavaScript Array Methods Cheatsheet"
publishedAt: "2023-05-31T22:17:45.000+01:00"
updatedAt: "2023-05-31T22:19:26.000+01:00"
tags: ["blog"]
primaryTag: "blog"
primaryTagLabel: "Blog"
excerpt: "A simple cheatsheet for all the JavaScript Array Methods"
featured: false
featureImage: "ghost-1785628038334-eli5-js-array-methods.jpg"
---

<h2 id="1-mutator-methods">1. Mutator methods</h2><p><strong>push()</strong>: Adds one or more elements to the end of an array and returns the new length of the array.</p><pre><code class="language-javascript">let arr = [1, 2, 3];
arr.push(4, 5); // returns 5
// arr is now [1, 2, 3, 4, 5]
</code></pre><p><strong>pop()</strong>: Removes the last element from an array and returns that element.</p><pre><code class="language-javascript">let arr = [1, 2, 3];
let last = arr.pop(); // returns 3
// arr is now [1, 2]
</code></pre><p><strong>shift()</strong>: Removes the first element from an array and returns that element.</p><pre><code class="language-javascript">let arr = ["a", "b", "c"];
let first = arr.shift(); // returns "a"
// arr is now ["b", "c"]
</code></pre><p><strong>unshift()</strong>: Adds one or more elements to the beginning of an array and returns the new length of the array.</p><pre><code class="language-javascript">let arr = [1, 2, 3];
arr.unshift(0); // returns 4
// arr is now [0, 1, 2, 3]
</code></pre><p><strong>splice()</strong>: Changes the contents of an array by removing or replacing existing elements and/or adding new elements in place.</p><pre><code class="language-javascript">let arr = [1, 2, 3, 4, 5];
arr.splice(2, 0, "a", "b"); // returns [], no elements removed
// arr is now [1, 2, "a", "b", 3, 4, 5]
</code></pre><p><strong>reverse()</strong>: Reverses the order of the elements of an array in place.</p><pre><code class="language-javascript">let arr = [1, 2, 3];
arr.reverse(); 
// arr is now [3, 2, 1]
</code></pre><p><strong>sort()</strong>: Sorts the elements of an array in place and returns the array.</p><pre><code class="language-javascript">let arr = [1, 3, 2];
arr.sort(); 
// arr is now [1, 2, 3]
</code></pre><h2 id="2-accessor-methods">2. Accessor methods</h2><p><strong>concat()</strong>: Returns a new array that is this array joined with other array(s) and/or value(s).</p><pre><code class="language-javascript">let arr = [1, 2, 3];
let newArr = arr.concat([4, 5]); 
// newArr is [1, 2, 3, 4, 5]
</code></pre><p><strong>join()</strong>: Joins all elements of an array into a string.</p><pre><code class="language-javascript">let arr = ["Hello", "world"];
let str = arr.join(" "); 
// str is "Hello world"
</code></pre><p><strong>slice()</strong>: Extracts a section of the calling array and returns a new array.</p><pre><code class="language-javascript">let arr = [1, 2, 3, 4, 5];
let newArr = arr.slice(1, 3); 
// newArr is [2, 3]
</code></pre><p><strong>indexOf()</strong>: Returns the first (least) index of an element within the array equal to the specified value, or -1 if none is found.</p><pre><code class="language-javascript">let arr = [1, 2, 3, 4, 5];
let index = arr.indexOf(3); 
// index is 2
</code></pre><p><strong>lastIndexOf()</strong>: Returns the last (greatest) index of an element within the array equal to the specified value, or -1 if none is found.</p><pre><code class="language-javascript">let arr = [1, 2, 3, 2, 

1];
let index = arr.lastIndexOf(2); 
// index is 3
</code></pre><h2 id="3-iteration-methods">3. Iteration methods</h2><p><strong>forEach()</strong>: Executes a provided function once per array element.</p><pre><code class="language-javascript">let arr = [1, 2, 3];
arr.forEach(item =&gt; console.log(item));
// outputs 1, 2, 3
</code></pre><p><strong>map()</strong>: Creates a new array with the results of calling a provided function on every element in this array.</p><pre><code class="language-javascript">let arr = [1, 2, 3];
let newArr = arr.map(item =&gt; item * 2);
// newArr is [2, 4, 6]
</code></pre><p><strong>filter()</strong>: Creates a new array with all elements that pass the test implemented by the provided function.</p><pre><code class="language-javascript">let arr = [1, 2, 3, 4, 5];
let newArr = arr.filter(item =&gt; item &gt; 3);
// newArr is [4, 5]
</code></pre><p><strong>reduce()</strong>: Applies a function against an accumulator and each element in the array (from left to right) to reduce it to a single value.</p><pre><code class="language-javascript">let arr = [1, 2, 3, 4, 5];
let sum = arr.reduce((total, value) =&gt; total + value, 0);
// sum is 15
</code></pre><p><strong>some()</strong>: Tests whether some element in the array passes the test implemented by the provided function.</p><pre><code class="language-javascript">let arr = [1, 2, 3, 4, 5];
let hasLargeNumber = arr.some(item =&gt; item &gt; 4);
// hasLargeNumber is true
</code></pre><p><strong>every()</strong>: Tests whether all elements in the array pass the test implemented by the provided function.</p><pre><code class="language-javascript">let arr = [1, 2, 3, 4, 5];
let allGreaterThanZero = arr.every(item =&gt; item &gt; 0);
// allGreaterThanZero is true
</code></pre><p><strong>find()</strong>: Returns the value of the first element in the array that satisfies the provided testing function.</p><pre><code class="language-javascript">let arr = [1, 2, 3, 4, 5];
let firstLargeNumber = arr.find(item =&gt; item &gt; 3);
// firstLargeNumber is 4
</code></pre><p><strong>findIndex()</strong>: Returns the index of the first element in the array that satisfies the provided testing function.</p><pre><code class="language-javascript">let arr = [1, 2, 3, 4, 5];
let firstLargeNumberIndex = arr.findIndex(item =&gt; item &gt; 3);
// firstLargeNumberIndex is 3
</code></pre><p><strong>includes()</strong>: Determines whether an array includes a certain element, returning true or false as appropriate.</p><pre><code class="language-javascript">let arr = [1, 2, 3, 4, 5];
let includesThree = arr.includes(3);
// includesThree is true
</code></pre>
