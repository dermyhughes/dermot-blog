---
title: "The Irony of Abstraction"
draft: false
tags: ["blog"]
primaryTag: "blog"
primaryTagLabel: "Blog"
excerpt: "I've spent years encouraging engineers to use our design system. It's a little unfair to then wonder why they're less practised at the work I've asked them to stop doing."
metaDescription: "A design system engineer reflects on abstraction, front-end skills, and where the judgement to build good interfaces comes from."
featured: false
---

I've spent a fair amount of my career telling other developers not to write CSS.

Which is an odd thing to admit, because I love CSS. Semantic HTML, accessibility, interaction, animation, the details that make an interface feel right: that's my bit of front-end engineering. Front-end engineer, UX engineer, design engineer, whatever title we're using this week. I've always felt at home somewhere between design and engineering.

Brad Frost calls this the [front of the front end](https://bradfrost.com/blog/post/front-of-the-front-end-and-back-of-the-front-end-web-development/). It's a useful description of work that can otherwise disappear inside a job title expected to cover everything from typography to authentication.

Working on design systems, I've tried to make that expertise useful beyond the things I build myself. Use our components. Use the tokens. Follow the patterns. We've spent time getting the styling and behaviour right, so every product team doesn't have to start again.

If the design system is doing its job and the components meet a team's needs, engineers shouldn't have to build and style those same elements themselves. That's what I mean by not writing CSS: the system should already be taking care of that work.

Then, occasionally, I'll find myself frustrated that a front-end engineer isn't particularly comfortable with CSS, or hasn't spotted a problem with the semantics of an interface.

Recently, it occurred to me that these two positions are a little awkward together.

I've been encouraging people to use an abstraction, then quietly judging them for being less practised at the work underneath it. There's a decent chance they're doing exactly what I asked.

The reasons for building the abstraction still hold up. A shared component gives us somewhere to concentrate the fiddly work, test it properly, and make improvements that reach more than one team. A fix to keyboard behaviour shouldn't need to be discovered independently in twelve different repositories.

It also gives product teams room to concentrate on the problems specific to what they're building: managing application state, handling unreliable data, working out what happens when a customer opens checkout in three tabs, then empties their basket in a fourth. Users have a gift for finding the route nobody put on the flowchart. Being able to trust the shared components gives teams one less thing to worry about.

What I've been slower to consider is what happens to the opportunities to learn.

When a component handles the layout, you don't need to investigate why it shrinks in one container and overflows in another. When it manages focus, you might never encounter the bug that makes you understand why focus management matters. You get the benefit of the solution without necessarily meeting the problem.

That's a perfectly reasonable trade for getting something shipped. Repeated across years of everyday work, though, it might change which instincts you develop.

I can't claim our component library is causing people to lose skills. Some engineers already have those skills. Some are developing them elsewhere. Others have specialised in different work, quite reasonably. But if the ordinary working day rarely calls for a particular skill, I probably shouldn't treat its absence as a surprising personal failing.

There's an additional inconvenience here: [I've argued the other side of this before](/blog/is-the-title-front-end-developer-dead/). I wrote about how unreasonable it is to expect a front-end developer to understand everything bundled into the role, and defended relying on abstractions without knowing all their internals.

I still agree with that. I don't expect someone to write a database engine before they're allowed to query one. Expecting everyone to implement an accessible combobox from scratch would be a peculiar way to improve either productivity or accessibility.

Perhaps I'm simply more comfortable accepting a gap in someone's knowledge when it concerns something I'm less interested in myself. An unfortunate possibility, but worth keeping on the table.

The part I keep coming back to is what happens when the component works perfectly and the interface still doesn't.

Imagine a form built entirely with approved components. It's on a council website, and you're using it to request a replacement wheelie bin. Every input has a label. The error messages are associated correctly. The buttons work with a keyboard.

You select "My bin was stolen", work through the form, and press submit. Only then does it tell you a photograph of the bin is required. If you were in a position to arrange a photoshoot, you probably wouldn't need this form.

Choosing and combining components takes judgement. Some decisions need product knowledge or user research. Others need an understanding of how people navigate a page, what they can perceive, and what happens as the interface changes. No component API can make all of them on the developer's behalf.

You can learn that judgement through reviewing work, testing with users, pairing with someone or investigating a bug. Writing everything yourself isn't the only route. But those opportunities need to exist somewhere. I suspect I've sometimes assumed that experience would arrive alongside the ability to import the package.

There's a much older version of this tension in Lisanne Bainbridge's 1983 paper, [*Ironies of Automation*](https://gwern.net/doc/sociology/technology/1983-bainbridge.pdf). She describes how automating routine work can leave operators with fewer opportunities to maintain their skills, while still expecting them to intervene when something unusual goes wrong.

A component library is a rather different proposition from an industrial control system. This isn't evidence that design systems make developers worse. But I recognise the assumption: we'll take care of the ordinary cases, and trust you to have the expertise for the difficult ones.

It's worth asking where that expertise is supposed to come from.

AI adds another layer. A developer can ask for a screen, have an assistant assemble the components, and review the result. That's useful. It can also move more of the day away from making individual decisions and towards accepting or correcting decisions already made.

The usual answer is that the engineer still supplies the judgement. Fair enough, although that feels slightly incomplete when we're discussing how someone acquires it in the first place.

There's some relevant evidence, with limits. In [a small study published by Anthropic in January 2026](https://www.anthropic.com/research/AI-assistance-coding-skills), 52 developers worked with an unfamiliar Python library. The AI-assisted group averaged 50% on a subsequent comprehension quiz, compared with 67% for those working without AI. Participants who used the assistant to explore concepts and seek explanations tended to retain more understanding than those who delegated the work.

That's one short experiment about learning a library, not a verdict on a career spent using AI. It does suggest that finishing a task and learning from it can come apart. The way we use the help matters.

In [*Who Are We Writing For Now?*](/blog/who-are-we-writing-for-now/), I wrote about how decisions used to hide inside the work of building, and how implementing a plan could reveal that it was wrong. That leaves me wondering about the learning that happened along the way. Working through the code, encountering an edge case or writing a test gave us occasions to question what we'd planned.

AI can get us to something that looks finished before we've asked those questions. The implementation can contain assumptions nobody consciously examined. The screen exists; the discovery that should have changed it may never have happened.

Getting there faster can also give us more time to test and explore. That's a real opportunity, provided we treat the result as something to investigate. If looking finished becomes our cue to move on, we can skip the part where we learn why the first version was wrong.

A lot of my recent work has been on an MCP server for our design system, giving AI the reasoning and rules to build our UIs better. There's a familiar irony in that. If I abstract that judgement away and only the AI reads it, the designer or engineer gets the result without necessarily understanding why it was chosen. The next time they encounter a similar situation, that reasoning may still be missing. I've helped the tool make a better decision, but I haven't necessarily helped the person learn to make one.

I haven't arrived at a programme for fixing this. Mostly, I've become a bit less comfortable with my own expectations.

I want people to use the system. I want them to benefit from decisions they don't have to revisit every sprint. I also want them to recognise when those decisions don't fit, and feel able to question them. Supporting that last part asks more of me than supplying a component and wondering why they haven't understood it properly.

A design system lets us share the results of experience remarkably well. Sharing the experience itself takes more care.

The next time I catch myself thinking a front-end engineer ought to know something, I should probably pause long enough to consider where, in the way we've organised their work, they were supposed to learn it.
