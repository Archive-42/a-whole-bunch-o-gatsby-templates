import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage = ({msg, description, color, status}) =>
  <section className="content">
    <div className="error-page">
      <h2 className={`headline text-${color}`}>{status}&#125;</h2>
      <div className="error-content">
        <h3>
          <i className={`fa fa-warning text-${color}`}></i>
          {msg}
        </h3>
        <p>
          {description}
          <br />Meanwhile, you may <Link to="/">return to the dashboard.</Link>
        </p>
      </div>
    </div>
  </section>

export default ErrorPage
