---
title: "A neat dynamic glow effect for images"
publishedAt: "2021-05-19T00:19:42.000+01:00"
updatedAt: "2021-05-20T14:56:57.000+01:00"
tags: ["blog"]
primaryTag: "blog"
primaryTagLabel: "Blog"
excerpt: "This will be a quick one. I've wondered for a while how Spotify do their dynamic colours from an album cover, so went down a rabbit hole. While I might look into a more accurate way , I discovered a neat trick for getting that dynamic glow effect on an image."
featured: false
featureImage: "ghost-1785628038335-a-neat-dynamic-glow-effect-for-images.jpg"
---

<p>This will be a quick one. I've wondered for a while how Spotify do their dynamic colours from an album cover, so went down a rabbit hole. While I might look into a more <a href="https://www.npmjs.com/package/react-palette">accurate </a><a href="https://github.com/Vibrant-Colors/node-vibrant">way</a> , I discovered a neat trick for getting that dynamic glow effect on an image.</p><p>Simply stack an image on top of a second copy of that image with some absolute positioning, and blur the image underneath! Pretty fun effect. Just don't forget to hide your "blurred" image with an <code>aria-hidden="true"</code> so screen readers don't call it out unnecessarily.</p><figure class="kg-card kg-embed-card"><iframe id="cp_embed_bGqVOEe" src="https://codepen.io/dermyhughes/embed/preview/bGqVOEe?default-tabs=html%2Cresult&amp;height=300&amp;host=https%3A%2F%2Fcodepen.io&amp;slug-hash=bGqVOEe" title="Neat dynamic glow image effect" scrolling="no" frameborder="0" height="300" allowtransparency="true" class="cp_embed_iframe" style="width: 100%; overflow: hidden;"></iframe></figure>
