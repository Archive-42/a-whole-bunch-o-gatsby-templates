const crypto = require(`crypto`);
const axios = require(`axios`);

const dict = arr => Object.assign(...arr.map(([k, v]) => ({ [`size_${k}`]: v })));

// Transform the sizes and dimensions properties (these have numeral keys returned by the Behance API)
const transformImage = imageObject => ({
  ...imageObject,
  sizes: dict(Object.entries(imageObject.sizes)),
  dimensions: dict(Object.entries(imageObject.dimensions)),
});

// Transform the properties that have numbers as keys
const transformProject = project => ({
  ...project,
  covers: dict(Object.entries(project.covers)),
  owners: project.owners.map(owner => ({
    ...owner,
    images: dict(Object.entries(owner.images)),
  })),
  modules: project.modules.map(module => {
    if (module.type === 'image') return transformImage(module);
    if (module.type === 'media_collection') return { ...module, components: module.components.map(transformImage) };
    return module;
  }),
});

const transformAppreciation = appreciation => ({
  ...appreciation,
  owners: appreciation.owners.map(owner => ({
    ...owner,
    images: dict(Object.entries(owner.images)),
  })),
  covers: appreciation.project_covers.reduce((acc, cur, i) => {
    acc[`size${i}`] = cur;
    return acc;
  }, {}),
  projects: appreciation.latest_projects.map(project => ({
    ...project,
    owners: project.owners.map(owner => ({
      ...owner,
      images: dict(Object.entries(owner.images)),
    })),
    covers: dict(Object.entries(project.covers)),
  })),
});

exports.sourceNodes = async ({ actions: { createNode } }, { username, apiKey }) => {
  if (!username || !apiKey) {
    throw new Error('You need to define username and apiKey');
  }

  const axiosClient = axios.create({
    baseURL: `https://www.behance.net/v2/`,
  });

  // Thanks to https://github.com/Jedidiah/gatsby-source-twitch/blob/master/src/gatsby-node.js
  // and https://stackoverflow.com/questions/43482639/throttling-axios-requests
  const rateLimit = 500;
  let lastCalled;

  const rateLimiter = call => {
    const now = Date.now();
    if (lastCalled) {
      lastCalled += rateLimit;
      const wait = lastCalled - now;
      if (wait > 0) {
        return new Promise(resolve => setTimeout(() => resolve(call), wait));
      }
    }
    lastCalled = now;
    return call;
  };

  axiosClient.interceptors.request.use(rateLimiter);

  const {
    data: { projects },
  } = await axiosClient.get(`/users/${username}/projects?api_key=${apiKey}`);
  const {
    data: { collections },
  } = await axiosClient.get(`/users/${username}/collections?api_key=${apiKey}`);
  const {
    data: { user },
  } = await axiosClient.get(`/users/${username}?api_key=${apiKey}`);
  const jsonStringUser = JSON.stringify(user);

  // Request detailed information about each project
  const requests = projects.map(project => axiosClient.get(`/projects/${project.id}?api_key=${apiKey}`));
  const projectsDetailed = await Promise.all(requests).map(request => request.data.project);

  // Create node for each project
  projectsDetailed.map(async originalProject => {
    const project = transformProject(originalProject);
    const jsonString = JSON.stringify(project);

    const projectListNode = {
      projectID: project.id,
      name: project.name,
      published: project.published_on,
      created: project.created_on,
      modified: project.modified_on,
      url: project.url,
      privacy: project.privacy,
      areas: project.fields,
      covers: project.covers,
      matureContent: project.mature_content,
      matureAccess: project.mature_access,
      owners: project.owners,
      stats: project.stats,
      conceived: project.conceived_on,
      canvasWidth: project.canvas_width,
      tags: project.tags,
      description: project.description,
      editorVersion: project.editor_version,
      allowComments: project.allow_comments,
      modules: project.modules,
      shortURL: project.short_url,
      copyright: project.copyright,
      tools: project.tools,
      styles: project.styles,
      creatorID: project.creator_id,
      children: [],
      id: project.id.toString(),
      parent: `__SOURCE__`,
      internal: {
        type: `BehanceProjects`,
        contentDigest: crypto
          .createHash(`md5`)
          .update(jsonString)
          .digest(`hex`),
      },
    };
    createNode(projectListNode);
  });

  collections.map(async originalAppreciation => {
    const appreciation = transformAppreciation(originalAppreciation);
    const jsonString = JSON.stringify(appreciation);

    const appreciationNode = {
      projectID: appreciation.id,
      name: appreciation.title,
      projectCount: appreciation.project_count,
      followerCount: appreciation.followerCount,
      data: appreciation.data,
      public: appreciation.public,
      created: appreciation.created_on,
      updated: appreciation.updated_on,
      modified: appreciation.modified_on,
      url: appreciation.url,
      covers: appreciation.covers,
      projects: appreciation.projects,
      matureContent: appreciation.mature_content,
      matureAccess: appreciation.mature_access,
      owners: appreciation.owners,
      isOwner: appreciation.is_owner,
      isCoOwner: appreciation.is_coowner,
      multipleOwners: appreciation.multiple_owners,
      galleryText: appreciation.gallery_text,
      stats: appreciation.stats,
      conceived: appreciation.conceived_on,
      creatorID: appreciation.creator_id,
      userID: appreciation.user_id,
      children: [],
      id: appreciation.id.toString(),
      parent: `__SOURCE__`,
      internal: {
        type: `BehanceAppreciations`,
        contentDigest: crypto
          .createHash(`md5`)
          .update(jsonString)
          .digest(`hex`),
      },
    };
    createNode(appreciationNode);
  });

  const userNode = {
    userID: user.id,
    names: {
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      displayName: user.display_name,
    },
    url: user.url,
    website: user.website,
    avatar: user.images['276'],
    company: user.company,
    place: {
      city: user.city,
      state: user.state,
      country: user.country,
      location: user.location,
    },
    areas: user.fields,
    stats: user.stats,
    links: user.links,
    sections: user.sections,
    socialMedia: user.social_links,
    children: [],
    id: user.id.toString(),
    parent: `__SOURCE__`,
    internal: {
      type: `BehanceUser`,
      contentDigest: crypto
        .createHash(`md5`)
        .update(jsonStringUser)
        .digest(`hex`),
    },
  };
  createNode(userNode);
};
