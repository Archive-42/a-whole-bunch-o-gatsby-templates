const projectList = [
  {
    name: 'React',
    imageSrc: 'https://camo.githubusercontent.com/22045498095171997ccf6a9554672519b9f67898/68747470733a2f2f63646e2e776f726c64766563746f726c6f676f2e636f6d2f6c6f676f732f72656163742e737667',
    githubLink: 'https://github.com/facebook/react/issues?q=is%3Aissue+is%3Aopen+label%3A%22Difficulty%3A+beginner%22',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces',
    tags: ['JavaScript', 'UI', 'Web App'],
  }, {
    name: 'Exercism',
    imageSrc: 'https://avatars2.githubusercontent.com/u/5624255?v=3&s=100',
    githubLink:
      'https://github.com/exercism/exercism.io/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+patch%22',
    description: 'Quickly ramp up in new programming languages',
    tags: ['Ruby', 'Exercises', 'CLI', 'Web App'],
    tags: ['Ruby', 'Exercises', 'CLI', 'Web app'],
  }, {
    name: 'Fun Retros',
    imageSrc: 'https://avatars3.githubusercontent.com/u/15913975?v=3&s=100',
    githubLink:
      'https://github.com/funretro/distributed/issues?utf8=%E2%9C%93&q=is%3Aopen+is%3Aissue+label%3A%22beginner+friendly%22',
    description: 'Easy to use and beautiful restrospective tool',
    tags: ['JavaScript', 'Web App', 'AngularJS', 'Firebase'],
  }, {
    name: 'Habitat',
    imageSrc: 'https://avatars1.githubusercontent.com/u/18171698?v=3&s=100',
    githubLink:
      'https://github.com/habitat-sh/habitat/issues?utf8=%E2%9C%93&q=is%3Aopen+is%3Aissue+label%3AE-Easy',
    description: 'Modern applications with built-in automation',
    tags: ['Docs','Front-End','Rust','MultiOS'],
  }, {
    name: 'Scikit-learn',
    imageSrc: 'https://avatars0.githubusercontent.com/u/365630?v=3&s=100',
    githubLink:
      'https://github.com/scikit-learn/scikit-learn/issues?q=is%3Aopen+is%3Aissue+label%3AEasy',
    description: 'Machine learning in Python',
    tags: ['Python', 'Machine Learning', 'Math'],
  }, {
    name: 'AVA',
    imageSrc: 'https://avatars0.githubusercontent.com/u/8527916?v=3&s=100',
    githubLink:
      'https://github.com/avajs/ava/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+for+beginner%22',
    description: 'Futuristic JavaScript test runner',
    tags: ['JavaScript','Tests', 'Docs', 'Babel'],
  }, {
    name: 'Numpy',
    imageSrc:
      'https://camo.githubusercontent.com/b310fd3c9c5f7da5de0911b77d201408b76b8a58/68747470733a2f2f696d616765732e706c6f742e6c792f706c6f746c792d646f63756d656e746174696f6e2f7468756d626e61696c2f6e756d70792d6c6f676f2e6a7067',
    githubLink:
      'https://github.com/numpy/numpy/issues?utf8=%E2%9C%93&q=is%3Aopen+is%3Aissue+label%3A%22difficulty%3A+Easy%22',
    description: 'Scientific computing with Python',
    tags: ['Python', 'Math', 'Module', 'Docs'],
  }, {
    name: 'Elasticsearch',
    imageSrc: 'https://avatars2.githubusercontent.com/u/6764390?v=3&s=100',
    githubLink:
      'https://github.com/elastic/elasticsearch/issues?q=is%3Aopen+is%3Aissue+label%3A%22low+hanging+fruit%22',
    description: 'Open Source, Distributed, RESTful Search Engine',
    tags: ['REST', 'Docs', 'Java', 'Lucene'],
  }, {
    name: 'Homebrew',
    imageSrc: 'https://avatars2.githubusercontent.com/u/1503512?v=3&s=100',
    githubLink:
      'https://github.com/Homebrew/brew/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22',
    description: 'The missing package manager for macOS',
    tags: ['MacOS', 'Ruby', 'C++'],
  }, {
    name: 'Rust',
    imageSrc: 'https://avatars1.githubusercontent.com/u/5430905?v=3&s=100',
    githubLink:
      'https://github.com/rust-lang/rust/issues?q=is%3Aopen+is%3Aissue+label%3AE-easy',
    description: 'A safe, concurrent, practical language',
    tags: ['Rust', 'Compiler', 'Mentored', 'Parser'],
  }, {
    name: 'Vuejs',
    imageSrc: 'https://avatars1.githubusercontent.com/u/6128107?v=3&s=100',
    githubLink: 'https://github.com/vuejs/vue/issues?q=is%3Aopen+is%3Aissue+label%3A%22contribution+welcome%22',
    description: 'A progressive, incrementally-adoptable JavaScript framework for building UI on the web',
    tags: ['JavaScript', 'UI', 'Front-End'],
  }, {
    name: 'Suave',
    imageSrc: 'https://avatars2.githubusercontent.com/u/5822862?v=3&s=100',
    githubLink: 'https://github.com/SuaveIO/suave/issues?q=is%3Aopen+is%3Aissue+label%3Ahardness-easy',
    description: 'simple web development F# library to manipulate route flow and task composition',
    tags: ['F#', 'WebDev', 'Library'],
  }, {
    name: 'OpenRA',
    imageSrc: 'https://avatars3.githubusercontent.com/u/409046?v=3&s=100',
    githubLink: 'https://github.com/OpenRA/OpenRA/issues?q=is%3Aopen+is%3Aissue+label%3AEasy',
    description: 'Open Source real-time strategy game engine for early Westwood games',
    tags: ['AI', 'C#', 'SDL', 'OpenGL'],
  }, {
    name: 'PowerShell',
    imageSrc: 'https://avatars0.githubusercontent.com/u/11524380?v=3&s=100',
    githubLink:
      'https://github.com/powershell/powershell/issues?q=is%3Aopen+is%3Aissue+label%3AUp-for-Grabs',
    description: 'PowerShell for every system',
    tags: ['Shell', 'Linux', 'MacOS', 'Windows', '*BSD'],
  }, {
    name: 'Coala',
    imageSrc: 'https://avatars2.githubusercontent.com/u/10620750?v=3&s=100',
    githubLink: 'https://github.com/coala/coala/issues?q=is%3Aopen+is%3Aissue+label%3Adifficulty%2Flow+label%3Adifficulty%2Fnewcomer',
    description: 'Unified command-line interface for linting and fixing all your code',
    tags: ['UX', 'Linter'],
  }, {
    name: 'Moment',
    imageSrc: 'https://avatars2.githubusercontent.com/u/4129662?v=3&s=100',
    githubLink:
      'https://github.com/moment/moment/issues?q=is%3Aopen+is%3Aissue+label%3AUp-For-Grabs',
    description: 'Parse, validate, manipulate, and display dates in JavaScript',
    tags: ['JavaScript', 'Front-End', 'Meta'],
  }, {
    name: 'Leiningen',
    imageSrc:
      'https://camo.githubusercontent.com/0f302c808c8457f6460913e33aed3478124612c2/687474703a2f2f6c65696e696e67656e2e6f72672f696d672f6c65696e696e67656e2e6a7067',
    githubLink:
      'https://github.com/technomancy/leiningen/issues?q=is%3Aopen+is%3Aissue+label%3ANewbie',
    description: 'Automate Clojure projects without setting your hair on fire',
    tags: ['Clojure', 'Automation'],
  }, {
    name: 'Brackets',
    imageSrc: 'https://github.com/adobe/brackets/raw/gh-pages/images/brackets_128.png?raw=true',
    githubLink: 'https://github.com/adobe/brackets/issues?q=is%3Aopen+is%3Aissue+label%3A%22Starter+bug%22',
    description: 'An open source code editor for the web, written in JavaScript, HTML and CSS',
    tags: ['Editor', 'Windows', 'Linux', 'MacOS'],
  }, {
    name: 'Webpack',
    imageSrc: 'https://avatars3.githubusercontent.com/u/2105791?v=3&s=100',
    githubLink: 'https://github.com/webpack/webpack/issues?q=is%3Aopen+is%3Aissue+label%3A%22D1%3A+Easy+%28Contrib.+Difficulty%29%22',
    description: 'A bundler for JavaScript and friends. Packs many modules into a few bundled assets',
    tags: ['Bundler', 'JavaScript', 'Compiler', 'Loader'],
  }, {
    name: 'Babel',
    imageSrc: 'https://avatars2.githubusercontent.com/u/9637642?v=3&s=100',
    githubLink:
      'https://github.com/babel/babel/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22',
    description: 'Babel is a compiler for writing next generation JavaScript',
    tags: ['es2015', 'JavaScript', 'Compiler'],
  }, {
    name: 'Pouchdb',
    imageSrc: 'https://avatars3.githubusercontent.com/u/3406112?v=3&s=100',
    githubLink:
      'https://github.com/pouchdb/pouchdb/issues?q=is%3Aopen+is%3Aissue+label%3A%22first+timers+only%22',
    description: 'Pocket-sized database',
    tags: ['JavaScript','Node.js','CouchDB'],
  }, {
    name: 'Neovim',
    imageSrc: 'https://avatars0.githubusercontent.com/u/6471485?v=3&s=100',
    githubLink:
      'https://github.com/neovim/neovim/issues?q=is%3Aopen+is%3Aissue+label%3Acomplexity%3Alow',
    description: 'Vim-fork focused on extensibility and usability',
    tags: ['Editor', 'API', 'Cross-Platform', 'Vim'],
  }, {
    name: 'Hoodie',
    imageSrc: 'https://avatars1.githubusercontent.com/u/1888826?v=3&s=100',
    githubLink:
      'https://github.com/hoodiehq/hoodie/issues?q=is%3Aopen+is%3Aissue+label%3Afirst-timers-only',
    description: 'The Offline First JavaScript Backend',
    tags: ['JavaScript','Node.js'],
  }, {
    name: 'freeCodeCamp',
    imageSrc: 'https://avatars0.githubusercontent.com/u/9892522?v=3&s=100',
    githubLink:
      'https://github.com/freeCodeCamp/freeCodeCamp/issues?q=is%3Aopen+is%3Aissue+label%3Afirst-timers-only',
    description: 'Open source codebase and curriculum',
    tags: ['Learn', 'Education', 'Non-Profit', 'Certification'],
  }, {
    name: 'Node.js',
    imageSrc: 'https://avatars1.githubusercontent.com/u/9950313?v=3&s=100',
    githubLink:
      'https://github.com/nodejs/node/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22',
    description: 'Node.js JavaScript runtime',
    tags: ['JavaScript', 'HTML', 'CSS'],
  }, {
    name: 'Semantic-UI-React',
    imageSrc:
      'https://github.com/Semantic-Org/Semantic-UI-React/raw/master/docs/app/logo.png',
    githubLink:
      'https://github.com/Semantic-Org/Semantic-UI-React/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22',
    description: 'The official Semantic-UI-React integration',
    tags: ['React', 'Library', 'Component', 'Front-End'],
  }, {
    name: 'Contribute to Open Source',
    imageSrc: 'https://image.ibb.co/fUM5oG/profile_first_pr.png',
    githubLink: 'https://github.com/danthareja/contribute-to-open-source',
    description: 'Learn GitHub\'s pull request process by contributing code in a fun simulation project ',
    tags: ['GitHub', 'Tutorial'],
  }, {
    name: 'RubyGems ecosystem',
    imageSrc: 'https://avatars.githubusercontent.com/u/17981340',
    githubLink: 'https://github.com/rubygems/contribute',
    description: 'One site to show all related RubyGems ecosystem projects and help developers get involved',
    tags: ['Ruby', 'Rubygems'],
  }, {
    name: 'Mail For Good',
    imageSrc: 'https://avatars0.githubusercontent.com/u/9892522?v=3&s=100',
    githubLink: 'https://github.com/freeCodeCamp/mail-for-good',
    description: 'An open source email campaign management tool',
    tags: ['Nodejs', 'JavaScript', 'Email-Campaigns']
  },
  {
    name: 'Visual Studio Code',
    imageSrc: 'https://i.warosu.org/data/g/img/0514/15/1447907357729.png',
    githubLink: 'https://github.com/Microsoft/vscode/issues?q=is%3Aopen+is%3Aissue',
    description: 'VS Code is a new type of tool that combines the simplicity of a code editor with what developers need for their core edit-build-debug cycle.',
    tags: ['TypeScript', 'Text-Editor', 'Electron']
  },
  {
    name: 'Scrapy',
    imageSrc: 'https://blog-media.scrapinghub.com/production/wp-content/uploads/2016/10/06054611/Scrapy-300x300.png',
    githubLink: 'https://github.com/scrapy/scrapy',
    description: 'Scrapy is a fast high-level web crawling and web scraping framework, used to crawl websites and extract structured data from their pages. ',
    tags: ['Python', 'Module', 'Data-Mining','Automated-Testing']
  },
  {
    name: 'Angular',
    imageSrc: 'https://avatars0.githubusercontent.com/u/139426?s=200&v=4',
    githubLink: 'https://github.com/angular/angular/issues?q=is%3Aopen+is%3Aissue+label%3A%22effort1%3A+easy+%28hours%29%22',
    description: 'Angular is a development platform for building mobile and desktop Web Applications using TypeScript or JavaScript and other languages.',
    tags: ['Angular', 'TypeScript', 'JavaScript']
  },
  {
    name: 'React Styleguidist',
    imageSrc: 'https://d3vv6lp55qjaqc.cloudfront.net/items/061f0A2n1B0H3p0T1p1f/react-styleguidist-logo.png',
    githubLink: 'https://github.com/styleguidist/react-styleguidist',
    description: 'React Styleguidist is a component development environment with hot reloaded dev server and a living style guide that you can share with your team. It lists component propTypes and shows live, editable usage examples based on Markdown files.',
    tags: ['JavaScript', 'UI']
  },
  {
    name: 'Ruby Koans',
    imageSrc: 'http://cdn.skilledup.com/public/images/provider/Ruby-Koans-Image-2x.jpg',
    githubLink: 'https://github.com/edgecase/ruby_koans',
    description: 'Learn Ruby With the Edgecase Ruby Koans. The Koans walk you along the path to enlightenment in order to learn Ruby. The goal is to learn the Ruby language, syntax, structure, and some common functions and libraries.',
    tags: ['Ruby', 'Exercises', 'CLI', 'Web App']
  },
  {
    name: 'Python Koans',
    imageSrc: 'https://s3.amazonaws.com/media-p.slid.es/thumbnails/akoebbe/b35d77/python-koans.jpg',
    githubLink: 'https://github.com/gregmalcolm/python_koans',
    description: 'Python Koans is a port of Edgecase\'s "Ruby Koans".',
    tags: ['Python', 'Exercises', 'CLI', 'Web App']
  },
  {
    name: 'Scala Exercises',
    imageSrc: 'https://avatars1.githubusercontent.com/u/17570897?s=200&v=4',
    githubLink: 'https://github.com/scala-exercises',
    description: 'Scala Exercises is an Open Source project for learning different technologies based in the Scala Programming Language.',
    tags: ['Scala', 'Exercises', 'Functional Programming']
  },
  {
    name: 'CodeWorkout',
    imageSrc: 'https://i.imgur.com/ZsSiCqi.png',
    githubLink: 'https://github.com/web-cat/code-workout',
    description: 'CodeWorkout is an online system for people learning a programming language for the first time. It is a free, open-source solution for practicing small programming problems. Students may practice coding exercises on a variety of programming concepts within the convenience of a web browser!',
    tags: ['Java', 'Ruby', 'Python', 'Exercises']
  },
  {
    name: 'TEAMMATES',
    imageSrc: 'https://raw.githubusercontent.com/TEAMMATES/teammates/master/src/main/webapp/images/teammateslogo-black.png',
    githubLink: 'https://github.com/TEAMMATES/teammates',
    description: 'An online feedback management system for students and teachers',
    tags: ['Java', 'Javascript', 'HTML', 'Web App']
  },
  {
    name: 'electron',
    imageSrc: 'https://avatars3.githubusercontent.com/u/13409222?s=200&v=4',
    githubLink: 'https://github.com/electron/electron',
    description: 'Build cross platform desktop apps with JavaScript, HTML, and CSS',
    tags: ['JavaScript', 'Electron', 'Css', 'Html', 'Chrome', 'Nodejs', 'V8']
  },
];

export default projectList;
