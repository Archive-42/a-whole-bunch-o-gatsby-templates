---
title: How to install, setup and add new content to a Blog starter
relatesTo: ['gatsby-starter-personal-blog', 'gatsby-starter-hero-blog']
category: instruction
cover: cover.png
---

You install the starter like any other GatsbyJS [starter](https://www.gatsbyjs.org/docs/gatsby-starters/) - with the following GatsbyJS CLI command.

```bash
gatsby new [NEW_SITE_DIRECTORY_FOR_YOUR_BLOG] https://github.com/greglobinski/gatsby-starter-personal-blog.git
```

Of course you have to install the [GatsbyJS CLI](https://www.gatsbyjs.org/docs/) first, but I assume the PersonalBlog is not the first GatsbyJS starter you are installing so the CLI is already installed on your computer.

I do not recommend the PersonalBlog as your starting point with GatsbyJS. If you have no experience at all with GatsbyJS please go through the [official Tutorials](https://www.gatsbyjs.org/tutorial/) first.

After GatsbyJS CLI finishes installation you should be able to run `gatsby develop` command. Run the command from the inside of the newly created directory.

```bash
cd [NEW_SITE_DIRECTORY_FOR_YOUR_BLOG]
gatsby develop
```

You will see something more or less like this:

```bash
λ gatsby develop
success delete html and css files from previous builds — 0.277 s
success open and validate gatsby-config — 0.024 s
success copy gatsby files — 0.079 s
success onPreBootstrap — 3.538 s
success source and transform nodes — 0.676 s
success building schema — 0.839 s
success createLayouts — 0.026 s
success createPages — 0.169 s
success createPagesStatefully — 0.059 s
success onPreExtractQueries — 0.010 s
success update schema — 0.270 s
success extract queries from components — 0.337 s
success run graphql queries — 0.687 s
success write out page data — 0.015 s
success write out redirect data — 0.002 s
success onPostBootstrap — 0.001 s

info bootstrap finished
 DONE  Compiled successfully

You can now view gatsby-starter-personal-blog in the browser.
  http://localhost:8000/
```

That means you can see the blog running in your web browser under the `http://localhost:8000/` address.

## Folders structure

This is the starter's main folders structure.

```bash
root
  ├── .cache
  ├── content
  ├── node_modules
  ├── src
  └── static
```

## Content

To easily customize all texts of the blog, not only posts, I extracted all content to its own separate folder.

The folder contains four subfolders.

```bash
root
  ├── content
  │   ├── meta
  │   ├── pages
  │   ├── parts
  │   └── posts
```

### Meta

There is a `config.js` file inside the `/content/meta/` folder.

```bash
root
  ├── content
  │   ├── meta
  │   │   └── config.js
```

Content of the `config.js` file.

```javascript
module.exports = {
  siteTitle: "PersonalBlog - a blog starter for GatsbyJS", // <title>
  shortSiteTitle: "PersonalBlog GatsbyJS Starter", // <title> ending for posts and pages
  siteDescription: "PersonalBlog is a GatsbyJS starter.",
  siteUrl: "https://gatsby-starter-personal-blog.greglobinski.com",
  siteImage: "preview.jpg",
  siteLanguage: "en",
  // author
  authorName: "greg lobinski",
  authorTwitterAccount: "greglobinski",
  // info
  infoTitle: "greg lobinski",
  infoTitleNote: "personal blog",
  // manifest.json
  manifestName: "PersonalBlog - a blog starter for GatsbyJS",
  manifestShortName: "PersonalBlog", // max 12 characters
  manifestStartUrl: "/",
  manifestBackgroundColor: colors.bg,
  manifestThemeColor: colors.bg,
  manifestDisplay: "standalone",
  // social
  authorSocialLinks: [
    { name: "github", url: "https://github.com/greglobinski" },
    { name: "twitter", url: "https://twitter.com/greglobinski" },
    { name: "facebook", url: "http://facebook.com/greglobinski" }
  ]
};
```

Edit values of the object's properties according to your needs.

### Posts

Every blog post has its own folder.

```bash
root
  ├── content
  │   ├── posts
  │   │   ├── 2017-10-01--two-things-are-infinite
  │   │   ├── 2017-10-03--be-who-you-are
  │   │   ├── 2017-10-05--you-only-live-once
```

When you change or add new post, remeber to keep up with the post folder name pattern.

```bash
/YYYY-MM-DD--title-of-post/
```

There are three obligatory parts:

* a post date prefix `YYYY-MM-DD`,
* a separator `--` (two dashes)
* a slug

Only posts inside properly named folders are displayed on the blog post list.

## Pages

The same way as posts, every page has its own folder.

```bash
root
  ├── content
  │   ├── pages
  │   │   ├── 1--about
  │   │   ├── 2--starters
  │   │   └── success
```

When you change or add new page, remember to properly use the page folder name pattern.

```bash
/No--title/
```

There are three parts.

* a page order number prefix `No` (one or more digit)
* a separator `--` (two dashes)
* a slug

Only pages inside folders with order prefix are displayed in the Info menu.

## Parts

Through `parts` you can edit content of elements which are parts of the blog's layout, like an author note under a post or a footer.

```bash
root
  ├── content
  │   ├── parts
  │   │   ├── author.md
  │   │   ├── footnote.md
  │   │   └── info.md
```

## Environment variables

The starter uses some external services:

* Analytics by [Google Analytics](https://www.google.com/analytics/)
* Comments by [Facebook Comments](https://developers.facebook.com/docs/plugins/comments/)
* Search by [Algolia](https://www.algolia.com/)

To make them work you have to secure some access data. All services are free or have generous free tiers big enough for a personal blog.

Create a file in the root folder called `.env` with content like below.

```bash
GOOGLE_ANALYTICS_ID=...
ALGOLIA_APP_ID=...
ALGOLIA_SEARCH_ONLY_API_KEY=...
ALGOLIA_ADMIN_API_KEY=...
ALGOLIA_INDEX_NAME=...
FB_APP_ID=...
```

Change `...` to real strings. Do not use quote marks. Put data strings after the equal signs. Like in the example below.

```bash
GOOGLE_ANALYTICS_ID=UA-123456789-0
```

You do not have to create `.env` file just after the instalation. The `gatsby develop` command should work without it. At least it works on my localhost environment. If you get an `GraphQL Error` using `gatsby develop` just after the installation, create the `.env` file with the variables like above, even with empty string as the values.

For `gatsby build` you absolutely need a real Algolia access data, without it the `gatsby build` command will throw an error.

If you want to delay singing-up to Algolia you can temporarily turn off `gatsby-plugin-algolia`. Open the `gatsby-config.js` file in the root folder and comment or remove the `gatsby-plugin-algolia` setup.

```javascript
plugins: [
    // {
    //   resolve: `gatsby-plugin-algolia`,
    //   options: {
    //     appId: process.env.ALGOLIA_APP_ID ? process.env.ALGOLIA_APP_ID : "",
    //     apiKey: process.env.ALGOLIA_ADMIN_API_KEY ? process.env.ALGOLIA_ADMIN_API_KEY : "",
    //     indexName: process.env.ALGOLIA_INDEX_NAME ? process.env.ALGOLIA_INDEX_NAME : "",
    //     queries,
    //     chunkSize: 10000 // default: 1000
    //   }
    // },
    {
      resolve: `gatsby-source-filesystem`,
```

But hey, it's not diffucult or long to [setup](/setup-algolia-account/) your Algolia account for the starter.

## Summary

That's all for the first step. Now you should have a running blog with your own data running on your localhost. In the next post we will talk how to change the look of your blog. Stay tuned.
