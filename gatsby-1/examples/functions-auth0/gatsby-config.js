const activeEnv =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development"

require("dotenv").config({
  path: `.env.${activeEnv}`,
})

module.exports = {
  plugins: [
    {
      resolve: "gatsby-plugin-create-client-paths",
      options: { prefixes: ["/*"] },
    },
    `gatsby-plugin-postcss`,
    `gatsby-plugin-gatsby-cloud`,
  ],
}
