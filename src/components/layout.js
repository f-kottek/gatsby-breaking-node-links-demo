import * as React from "react"
import { Link } from "gatsby"

const Layout = ({ location, children }) => {
  return (
    <div className="global-wrapper">
      <header className="global-header">
        <Link className="header-link-home" to="/">
          Home
        </Link>
      </header>
      <main>{children}</main>
    </div>
  )
}

export default Layout
