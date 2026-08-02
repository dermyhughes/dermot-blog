---
title: "Is the title Front End Developer  obsolete?"
publishedAt: "2020-07-16T17:57:12.000+01:00"
updatedAt: "2022-02-24T15:32:42.000+00:00"
tags: ["blog"]
primaryTag: "blog"
primaryTagLabel: "Blog"
excerpt: "There has been an increasing issue where \"Front End\" just means anything to do with the browser or web. The shear amount of knowledge a Front End Developer apparently needed to know is so vast as to be impossible."
featured: false
featureImage: "ghost-1785628038336-is-the-title-front-end-developer-dead.jpg"
---

<p>Edit: Since writing this, Brad Frost (of Atomic Design fame) published <a href="https://bradfrost.com/blog/post/front-of-the-front-end-and-back-of-the-front-end-web-development/">a fantastic article on this topic</a>. He says it better than I ever could. </p><p>I recently had an interviewer ask me a question about authorisation security with an application I had worked on. I described it something like so:</p><!--kg-card-begin: markdown--><ul>
<li>JWT auth token is requested using the users credentials to the back end.</li>
<li>The Angular Authentication Service checks the token.</li>
<li>If a valid token isn't returned we don't let the user in.</li>
<li>If the token is valid, we let them in.</li>
</ul>
<!--kg-card-end: markdown--><p>The interviewer didn't seem content and pressed me for more detail about how the Auth service works "under the hood". I replied simply, "I don't really know how it works under the hood, I don't need to as long as it works." Was it the wisest answer in an interview? Probably not, but my point stands. I could have gone into more detail about RxJS Subjects and Observables storing the user object and notifying components or how the token is checked.</p><p>I'm not arguing that a good fundamental knowledge isn't important. I think you should learn the basics of JavaScript before you diving straight into a framework like React or Angular. However the frameworks are there for a reason. They abstract away a lot of complicated, repeatable issues developers encounter.</p><p>The fact is I personally don't need to know how it works under the hood. The engineers at Google who wrote it are going to have a much greater understanding of it than I ever will, I frankly I'm not that interested in how it works. I'd rather implement it as Angular recommends, and go back to more interesting tasks.</p><p>There has been an increasing issue where "Front End" just means anything to do with the browser or web. The shear amount of knowledge a Front End Developer apparently needed to know is so vast as to be impossible. Off the top of my head I can list:</p><!--kg-card-begin: markdown--><ul>
<li>Semantic markup</li>
<li>CSS</li>
<li>CSS preprocessors</li>
<li>JavaScript</li>
<li>Cross browser support</li>
<li>APIs</li>
<li>Whatever JS framework is the current flavour of the month</li>
<li>Content Managment</li>
<li>Redux/Reactive Programming</li>
<li>Responsive Design</li>
<li>Accessibility</li>
<li>Internationalisation and localisation</li>
<li>Git</li>
<li>Unit Testing</li>
<li>E2E testing</li>
<li>Performance</li>
<li>Templating</li>
<li>HTML Canvas</li>
<li>Animation</li>
<li>SVG</li>
</ul>
<!--kg-card-end: markdown--><p>Front End Development spans two very different types of work - Design and Software Engineering. Chris Coyier of CSS Tricks speaks about this in his excellent article <a href="https://css-tricks.com/the-great-divide/">The Great Divide</a>.</p><!--kg-card-begin: markdown--><blockquote>
<p>The divide is between people who self-identify as a (or have the job title of) front-end developer, yet have divergent skill sets.</p>
</blockquote>
<blockquote>
<p>On one side, an army of developers whose interests, responsibilities, and skill sets are heavily revolved around JavaScript.</p>
</blockquote>
<blockquote>
<p>On the other, an army of developers whose interests, responsibilities, and skill sets are focused on other areas of the front end, like HTML, CSS, design, interaction, patterns, accessibility, etc.</p>
</blockquote>
<!--kg-card-end: markdown--><p>He raises the point that the term "Front End Developer" is so broad as to be useless.</p><figure class="kg-card kg-image-card kg-card-hascaption"><img src="/images/posts/is-the-title-front-end-developer-dead-image.png" class="kg-image" alt loading="lazy"><figcaption>These are the same role?</figcaption></figure><p>In a comment on a different post on the topic, the user Steven David commented </p><!--kg-card-begin: markdown--><blockquote>
<p>Most people are not amazing at both JavaScript and CSS. Let UX Engineers work closely with UX/Design to create great designs, interactions, prototypes, etc. and let JavaScript Engineers handle all the data parts.<br>
So sick of being great at CSS but being forced into JavaScript. I’m not a programmer!</p>
</blockquote>
<!--kg-card-end: markdown--><p>Likewise, there are many developers who coming from a more Computer Science background, who are very comfortable in JavaScript, but would struggle with the most basic of CSS - instead relying on computationally expensive JavaScript. Or important issues like responsiveness, speed, and accessibility never being a consideration.</p><p>Many developers don't want to touch databases directly, which is fine, so we separate that out to Database Architects. As JavaScript becomes ever more popular, we have Front End developers needing to understand and practice architectural principles that were traditionally in the domain of back-end developers, such as API design and data modelling. This isn't even getting into the stress that is keeping up with new technologies and frameworks under the fear of your skillset getting stale.</p><p>So why do we group all this under one title?</p><p>A few companies are starting to recognise this issue. Google now has a UI Engineer role which sits closer with designers, earlier in the process. </p><figure class="kg-card kg-image-card kg-card-hascaption"><img src="/images/posts/is-the-title-front-end-developer-dead-image-1.png" class="kg-image" alt loading="lazy"><figcaption>UX Engineering role at Google&nbsp;</figcaption></figure><p>This harks back to my point in <a href="https://dermothughes.com/blog/sympathy-for-the-developer/">my first ever blog post</a> where I raised the point that having someone with developer experience can help catch or solve issues much earlier in the design process, which is a lot cheaper than waiting until it lands on a engineers desk in the middle of a sprint.</p><p>Maybe it's time we look at the term "Front End Developer" and have a think about what that really means.</p><!--kg-card-begin: html--><p>
<div class="video-container">
    <iframe style="width: 100%;height: 100%;" src="https://www.youtube.com/embed/lFOfQsi5ye0" allowfullscreen></iframe>
</div>
</p><!--kg-card-end: html-->
