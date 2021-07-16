import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import ListItem from './ListItem'

const List = styled.ul`
  margin-top: 4rem;
  margin-bottom: 4rem;
  list-style-type: none;
  margin-left: 0;
`

const Listing = ({ posts }) => (
  <List>
    {posts.map(post => {
      let categories = false
      if (post.node.data.categories[0].category) {
        categories = post.node.data.categories.map(c => c.category.document[0].data.name)
      }
      return <ListItem key={post.node.uid} node={post.node} categories={categories} />
    })}
  </List>
)

export default Listing

Listing.propTypes = {
  posts: PropTypes.array.isRequired,
}
