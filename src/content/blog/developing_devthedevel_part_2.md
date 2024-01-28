---
title: 'Developing devthedevel - Part 2'
description: 'Developing devthedevel - Part 2'
pubDate: 'Jan 27 2024'
heroImage: '/blog/DarkMode.png'
---

Wow I never thought I would write another blog, let alone actually continue developing this site! 🎉

Welcome back to 'Developing devthedevel', a blog series where I write about developing _this very site!_

In the first post I explained why I wanted to do this project, and described (badly) how Astro kickstarted the project from scratch. I ended
the post with a list of tasks I would like to do going forward. The first post was also 6 months _after_ I originally started the project, which left a lot of foggy details in my mind while writing the post.

I'm glad to say that its only been just over two weeks between the first post and this one! Hooray for me not leaving this on the backburner 🎉! So I'm hopeful that the quality in this post would be better than the quality in the first post. 

_But will the quality be better though?_

I don't know, only you can judge.

Anyways enough chatting, lets get started.

#### Task Review

Lets have a look at the tasks I defined at the end of the last post.

- Add a dark theme (including a theme switcher)
- Add an avatar to the header
- Add tags to blog posts
- Some GitHub interactivity
- Include a short description for each blog on the `/blog` page
- Add some way to contact me
- Perhaps a time to read for each blog
- Perhaps a 'Last Updated' date for each blog

I spent a few minutes exploring a couple of them. "Adding an avatar to the header" was the first task I looked at. I wanted to add my headshot
next to the "devthedevel" button in the navbar (did you know clicking that will bring you back home?), as a little personal branding of sorts. 
Perhaps I would grayscale it, and then when you hover over "devthedevel" then the avatar would be fully colored.

Jumping into the code, I realized that I really do suck at CSS. It didn't help that my headshot image was not a square, which made it difficult to create a circular image. In fact it never created a circle at all, more of a slanted ellipse. I think the solution is to just crop
the image into a square and then tweak the CSS a little more, but I decided it wasn't really worth the effort at the moment. In fact, I 
ended up removing my headshot from the "About" page (I'm not a big fan of the image any more).

So that was all I did with that task, and I decided evaluate this task sometime later.

I looked at "Perhaps a 'Last Updated' date for each blog" next, in which I found out that I'm a dumbass and actually implemented this when I 
first started the project 6 months ago. So no need to do that again.

While exploring those two tasks, I realized how much I missed having a dark mode. The light theme was beautiful, but it was just too bright for me. It was then that I decided to add a dark theme (with a theme switcher)! In fact I bet the first update you noticed coming back to this site was dark mode!

But before I talk about that, I wanna talk about a few updates that I done under the hood.

#### Import Paths

Import paths (also known as import aliases) are a feature I read about in the TypeScript config file (I read that config documentation way too much) a few years ago and never had the chance to try them out.

For anyone that don't know, import paths allow you map imports to a specific path. 

Lets look at an example. Before updating this site, my `pages/index.astro` page imported my `component/Header.astro` component like the following:


```typescript
import Header from '../components/Header.astro';
```

Based on this information you can determine that my project structure is like the following:

```markdown
- src/
  - components/
    - Header.astro
  - pages/
    - index.astro
```

If you didn't know the project structure then determining the relative path to import `Header.astro` into `index.astro` can be troublesome. 
Honestly this is a pretty tame case. I'm sure you have seen imports like the following:

```typescript
import SomeComponent from '../../../../foo/SomeComponent.astro';
```

Disgusting 🤢.

While its nice to organize and nest your code, your relative imports usually become difficult to write. I often recieve "cannot find imported file" errors due to
imcorrectly typing out long relative import paths. I know your IDE usually helps with imports, but sometimes it doesn't. And when it doesn't, 
you become error prone. And when you become error prone, well, you get errors. And when you get errors, you become stressed and annoyed and lose valuble time and then the imposter syndrome sets in and everything sucks and you don't want to do anything anymore and then you begin to wonder what your life would be like if you didn't code and instead lived as a hermit in the mountains 😩.

So to avoid having an existential crisis, why not make our code work for us? Lets use those fancy import paths I started talking about. To use import paths, all you need to do is update your `tsconfig.json` like so:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"]
    }
  }
}
```

And now lets have a look at the updated code in the `pages/index.astro` page:

```typescript
import Header from '@components/Header.astro';
```

When TypeScript encounters this import, it resolves it by looking up `paths` in the `tsconfig.json` to see if there is any location relative to `baseUrl` that satisfies the dependency. This lets us write clean, logical imports without having to deal with crazy relative paths. To learn more about import paths, you can read [Astro's Import Aliases guide](https://docs.astro.build/en/guides/aliases/) or read the [TSConfig reference](https://www.typescriptlang.org/tsconfig#paths).

#### Implementing Dark Mode

After implementing import paths, I decided to tackle dark mode. To be honest I was kind of dreading this. I know my CSS experience is weak and I would have to learn things I didn't know existed to do this. Additionally, Astro generated lots of styles for this particular template when I created this project: styles that I didn't know anything about. Finally there always, always, _always_ seem to be unknown issues that plague a project when trying to implement multiple themes.

_Sigh_ 😩

And so I began. I decided to not use any styling frameworks: I would do this in pure CSS. Using a framework on top of a generated template is an open invitation for annoying issues. Annoying issues that I didn't want to deal with. So how do you make a dark mode in pure CSS? Well with a class I assume. Cool, but how do I create a global class that can be switched at will by the end user? This is something I didn't know.

##### Cumbersome Stupid Styling (CSS)

I decided to open my `styles/global.css` to get a grasp of the generated styling, and perhaps get a clue on how to start. At the very top was this:

```css
:root {
  --accent: #2337ff;
  --accent-dark: #000d8a;
  --black: 15, 18, 25;
  --gray: 96, 115, 159;
  --gray-light: 229, 233, 240;
  --gray-dark: 34, 41, 57;
  --gray-gradient: rgba(var(--gray-light), 50%), #fff;
  --box-shadow: 0 2px 6px rgba(var(--gray), 25%),
    0 8px 24px rgba(var(--gray), 33%), 0 16px 32px rgba(var(--gray), 33%);
}
```

What the fuck was all this?! What did it mean?! What is `:root` and why are there `--` prefixes on everything and why were there words instead of numbers (or hexes)? Was my CSS knowledge _really_ this bad?

Yes it was. Some quick searching enlightened me about CSS variables. Variables! In CSS?! Wow, what a world we live in. And those words? They let us use the variables. And `rgba` lets us add transparency. And a trailing `,` after a variable sets a fallback value if the variable is not defined. And finally `:root` was a pseudo-element that matches the root of the document tree. What a world we live in indeed. 

At this point you must be wondering how I, a full stack developer, can even call myself a full stack developer if I didn't even know about CSS variables. All I gotta say is that I really prefer logic over styling. I'll handle the app state, but don't ask me to make things pretty: I am mostly a backend developer remember?

I quickly began to understand this code. And it sparked an idea: what if I created a new `:root` class with a `dark` selector? This class would have the same variables as the `:root` class, but have its own values.

Voila:

```css
:root {
  --accent: #2337ff;
  --accent-dark: #000d8a;
  --black: 15, 18, 25;
  --gray: 96, 115, 159;
  --gray-light: 229, 233, 240;
  --gray-dark: 34, 41, 57;
  --gray-gradient: rgba(var(--gray-light), 50%), #fff;
  --box-shadow: 0 2px 6px rgba(var(--gray), 25%),
    0 8px 24px rgba(var(--gray), 33%), 0 16px 32px rgba(var(--gray), 33%);
}

:root.dark {
  --accent: red;
  --accent-dark: #000d8a;
  --black: 15, 18, 25;
  --gray: 96, 115, 159;
  --gray-light: 229, 233, 240;
  --gray-dark: 34, 41, 57;
  --gray-gradient: rgba(var(--gray-light), 50%), #fff;
  --box-shadow: 0 2px 6px rgba(var(--gray), 25%),
    0 8px 24px rgba(var(--gray), 33%), 0 16px 32px rgba(var(--gray), 33%);
}
```

I didn't want to bother with colors at this point, I was more concerned with dynamically changing the class of the `:root` element. So I set the accent color to `red` to test the dark mode and began investigating dynamically adding classes. 

It didn't take long to discover that `document.querySelector(':root')` would get me the root HTML element and calling `.classList.add('dark')` on it would add my dark class. Wow that was simple. I quickly whipped up some client-side code that checked local storage for a theme preference, falling back to the user's theme preferences for the OS. I hooked this code up to `components/Toggle.astro`, a new re-usable component that I made for a toggle input.

##### Toggling the Theme

If you have been paying attention to this blog so far, or know that Astro is primarily a static site generator, then you know that an Astro component contains a component script and a component template. The template is the HTML that will be generated, and the script allows us to dynamically build the template. Together, this tells Astro how to generate a component and output it to static content. This happens at _build_ time, not _run_ time. So you may be wondering "how do we include _client_ side code to run at _run_ time"?

Astro lets us include a `<script>` element within a component's template to do exactly that. During build time, [Astro processes and bundles](https://docs.astro.build/en/guides/client-side-scripts/) code within `<script>` elements. Damn Astro is cool!

Anyways the final code for theme toggling is as follows:

```typescript
const root = document.querySelector(':root');
const themeToggle = document.getElementById(
'themeToggle',
) as HTMLInputElement;

const savedTheme = localStorage.getItem('darkTheme');

// Check for theme preference
themeToggle.checked = savedTheme
? savedTheme === 'true'
: window.matchMedia('(prefers-color-scheme: dark)').matches;

const updateTheme = () => {
  if (themeToggle.checked) {
    root?.classList.add('dark');
    localStorage.setItem('darkTheme', 'true');
  } else {
    root?.classList.remove('dark');
    localStorage.setItem('darkTheme', 'false');
  }
};

// Set default toggle value
updateTheme();

// Add togglable theme
themeToggle?.addEventListener('change', updateTheme);
```

Alright lets review what I have for dark mode so far. I have a `:root.dark` CSS class that contains CSS variables, and I have a working client-side toggle that toggles between light and dark themes. It seems the only thing left was to actually figure out what colors to use for a dark theme.

And so begins the *dark*est chapter of this blog post (get it?).

##### Design System & Colors

Before I began selecting colors, I wanted to update the existing CSS variables so that they were more semantically descriptive. Inspired by systems like [Material UI](https://m3.material.io/styles/color/system/overview) or [DaisyUI](https://daisyui.com/theme-generator/) where a system defines tokens like `primary`, `secondary`, `warning`, etc. You then use these tokens within your code. The idea is that instead of styling components with colors like `blue`, or `gray-dark`, you instead style the component based on what its doing. Have a form with a submit button? Don't use `submit-button`, use `primary`. Have a warning message that pops up? Don't use `yellow`, use `warning`. Hopefully you get the idea.

I had to create tokens I would like to use, then inspect the existing code to see what closely matches the token, and then tweak things until everything worked. It was tedious and difficult. Eventually I had converted the generated variables over into a design system that I created.

The only thing left to do was select my colors! To do this, I re-used some existing colors (mostly neutrals), generated templates on [Coolers](https://coolors.co/), and used a color picker to _pick_ (I'm not sorry) some inspiration. After selecting some colors and inserting them into my `:root.dark` class, I realized that my design system didn't work right away. I didn't expect how heavily Astro depended on transparency to create the generated styles. It broke my design system and I had to tweak a nice few things to fix it all.

_Deep breath_

At the end of my struggle I had created my very own dark theme while preventing the light theme from breaking. I never expected the day where I could do this. This was both amazing and terrible at the same time. Kudos to any UX developers or designers: you folks have some incredible patience with this stuff.

Oh heres my final design if you are interested:

```css
:root {
  --black: #0f1219;
  --gray: #60739f;
  --gray-light: #e5e9f0;
  --gray-dark: #222939;
  --box-shadow: 0 8px 24px var(--gray);

  --primary: #2337ff;
  --primary-dark: #000d8a;

  --title: var(--black);
  --text: var(--gray-dark);
  --text-dark: var(--gray-dark);
  --text-light: var(--gray-light);

  --background: #fff;
  --background-secondary: var(--gray-light);

  --code-background: var(--gray-light);
}

:root.dark {
  --black: #0f1219;
  --gray: #60739f;
  --gray-light: #e5e9f0;
  --gray-dark: #222939;
  --box-shadow: 0 8px 24px var(--gray);

  --primary: #5fa4ff;
  --primary-dark: #1f80ff;

  --title: #ededed;
  --text: #d6d6d6;
  --text-dark: #d6d6d6;
  --text-light: #d6d6d6;

  --background: #141414;
  --background-secondary: #1f1f1f;

  --code-background: #24292e;
}
```

#### Outro

Phew what an update. I updated the code to use import paths so I can have cleaner imports, and I implemented a fully working dark theme with a toggle! Oh I done some extra stuff as well like updating the hover effects over certain elements, better aligning things, moving some images to `assets/` (so Astro can process them better and I can use my import maps), using a default blog image, and other smaller things that I don't care about including in this post.

Lets look at that task list again.

- ~~Add a dark theme (including a theme switcher)~~
- Add an avatar to the header
- Add tags to blog posts
- Some GitHub interactivity
- Include a short description for each blog on the `/blog` page
- Add some way to contact me
- Perhaps a time to read for each blog
- ~~Perhaps a 'Last Updated' date for each blog~~

I don't think I want to add an avatar to the header any more. It just doesn't feel right at the moment. As such I'll remove it.

I have thought of other things I would like to add. I would like to add a button at the bottom of every blog post that navigates the user to the top of the screen. I would also like to update the header so that I have a working side menu if on mobile. Perhaps I'll also stick the header to the top of the screen as well 🤔. And yet another thing I would like to do is add a previous/next blog post at the bottom of each blog post: this should help you navigate between posts. And I would like to add a Projects page to display all my projects (whenever I get around to making them 😅). Finally I wouldn't mind exploring a way to leave comments on posts.

Thats a lot of text regarding a bullet list. Lets update that list.

- Add tags to blog posts
- Some GitHub interactivity
- Include a short description for each blog on the `/blog` page
- Add some way to contact me
- Perhaps a time to read for each blog
- "Top of page" button for blog posts
- Side menu
- Sticky header
- "Previous/Next" buttons to navigate blog posts
- Projects page
- Add comments to blog posts

Only in software development do you gain more tasks after you complete tasks 🤣.

Anyways until next time.

Cheers 🍺