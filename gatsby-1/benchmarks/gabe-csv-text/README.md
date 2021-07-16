# Markdown Benchmark; CSV+text version

This is a baseline benchmark for tracking CSV plaintext performance in the Gabe project.

This will produce the same site as `gabe-fs-markdown` without using any markdown. It also generates one giant csv file containing all the data, rather than an individual file per page.

The site can generate an arbitrary amount of super simple pages. Each page has a small header, a quote, and two small paragraphs of random text. No images, because that's a fixed cost we're not interested in.

## Install

Run `yarn` or `npm install`

## Usage

You can start a benchmark run like this:

```shell
N=1000 M=2 yarn bench
```

- `N=1000`: instructs the run to build a site of 1000 pages
- `M=2`: instructs nodejs to use up to 2gb of memory for its long term storage
- Deletes generates files from previous run
- Generates a new `gendata.csv` file containing `N` rows, each row being one page with pseudo-random content
- Runs `gatsby clean`
- Runs `gatsby build`

The default `yarn bench` will build 512 pages with 1gb memory.
