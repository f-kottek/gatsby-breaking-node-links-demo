const path = require(`path`)
const {
  createFilePath,
  createRemoteFileNode,
} = require(`gatsby-source-filesystem`)
const allArticles = require("./src/data/articles.json")

exports.sourceNodes = async ({
  actions: { createNode, createNodeField },
  createContentDigest,
  createNodeId,
  getCache,
  getNodesByType,
}) => {
  // this is needed for the fix, unused, when part 1 and 2 are commented out
  const all_cached_file_nodes = await getNodesByType(`File`)

  const promisedArticles = allArticles.map(async article => {
    const { title, images, thumbnail_url, text_content } = article

    const article_node_id = createNodeId(title)

    const all_article_image_nodes = await Promise.all(
      images?.map(async ({ url }) => {
        let articleImageNode

        // Part 1 of the fix here

        // const cached_image_node = all_cached_file_nodes.find(
        //   image => image.url === url
        // )
        // if (!cached_image_node) {

        try {
          articleImageNode = await createRemoteFileNode({
            url: url,
            parentNodeId: article_node_id,
            createNode,
            createNodeId,
            getCache,
            name: `articleImage`,
          })
          await createNodeField({
            node: articleImageNode,
            name: `caption`,
            value: `Caption for image`,
          })
        } catch (error) {
          console.log(error)
        }

        // Part 2, uncomment these two to keep the build running after chaning the json file
        // } else {
        //   articleImageNode = cached_image_node
        // }
        return articleImageNode
      })
    )

    let thumbnailImageNode

    try {
      thumbnailImageNode = await createRemoteFileNode({
        url: thumbnail_url,
        parentNodeId: article_node_id,
        createNodeId,
        createNode,
        getCache,
      })
    } catch (error) {
      console.log(error)
    }

    const articleNode = await createNode({
      article_images_source: images,
      article_images: all_article_image_nodes?.map(({ id }) => id),
      thumbnail: thumbnailImageNode?.id,
      thumbnail_url: thumbnail_url,
      title: title,
      text_content: text_content,
      id: article_node_id,
      parent: null,
      children: [],
      internal: {
        type: `BlogArticle`,
        contentDigest: createContentDigest(article),
      },
    })
    return articleNode
  })
  await Promise.all(promisedArticles)
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `

    type BlogArticle implements Node {
      article_images: [File] @link,
      thumbnail: File @link
    }
  `
  createTypes(typeDefs)
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Get all markdown blog posts sorted by date
  const result = await graphql(
    `
      {
        allBlogArticle {
          nodes {
            id
            title
          }
        }
      }
    `
  )
  const articles = result.data.allBlogArticle.nodes
  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL
  articles.map(({ id, title }) => {
    createPage({
      path: title,
      component: path.resolve(`./src/templates/blog-article.js`),
      context: {
        id: id,
      },
    })
  })
}
