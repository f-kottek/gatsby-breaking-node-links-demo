import * as React from "react"

import { Link, graphql } from "gatsby"

import { GatsbyImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"

const ArticleTemplate = ({ data, location, pageContext }) => {
  const { blogArticle } = data
  const { title, article_images } = blogArticle
  return (
    <Layout location={location} title={title}>
      <Seo
        title={title}
        description={"post.frontmatter.description || post.excerpt"}
      />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{title}</h1>
        </header>
        {article_images.map(image => (
          <GatsbyImage
            style={{ width: 300, margin: "20px" }}
            image={image.childImageSharp.gatsbyImageData}
          />
        ))}
      </article>
    </Layout>
  )
}

export default ArticleTemplate

export const query = graphql`
  query ($id: String!) {
    blogArticle(id: { eq: $id }) {
      title
      article_images {
        childImageSharp {
          gatsbyImageData(width: 300, layout: FIXED)
        }
      }
    }
  }
`
