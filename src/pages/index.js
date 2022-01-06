import * as React from "react"

import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import { GatsbyImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allBlogArticle.nodes

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="All posts" />
      {posts.map(({ title, thumbnail }) => {
        console.log(thumbnail)
        return (
          <div key={title}>
            <Link to={`/${title}`} itemProp="url">
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <h2>
                  <span itemProp="headline">{title}</span>
                </h2>
                <GatsbyImage
                  style={{ width: 300 }}
                  image={thumbnail.childImageSharp.gatsbyImageData}
                />
              </article>
            </Link>
          </div>
        )
      })}
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allBlogArticle {
      nodes {
        title
        thumbnail {
          childImageSharp {
            gatsbyImageData(width: 300, layout: FIXED)
          }
        }
      }
    }
  }
`
