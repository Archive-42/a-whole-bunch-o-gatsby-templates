import React from 'react'
import P from 'prop-types'
import {
  compose,
  setPropTypes,
  withHandlers,
  withProps,
  withPropsOnChange
} from 'recompose'
import {differenceBy, unionBy} from 'lodash'

import {Checkbox} from '../../../form'

const enhance = compose(
  setPropTypes({
    category: P.object.isRequired,
    selectedItems: P.array.isRequired,
    handleItemsChange: P.func.isRequired,
    handleCategorySelect: P.func.isRequired
  }),
  withPropsOnChange(
    ['category', 'selectedItems'],
    ({category, selectedItems}) => ({
      numSelected: numItemsSelected(category, selectedItems)
    })
  ),
  withProps(({numSelected, category}) => ({
    partiallySelected: numSelected > 0 && numSelected < category.items.length
  })),
  withHandlers({
    handleItemsChange: ({handleItemsChange, category, selectedItems, numSelected}) =>
      () => numSelected === category.items.length ?
        handleItemsChange(differenceBy(selectedItems, category.items, '_id')) :
        handleItemsChange(unionBy(selectedItems, category.items, '_id'))
  })
)

const FoodCategory = ({
  category,
  numSelected,
  partiallySelected,
  handleItemsChange,
  selectedCategoryId,
  handleCategorySelect,
}) =>
  <div
    className={selectedCategoryId === category._id ? 'active list-group-item' : 'list-group-item'}
    onClick={handleCategorySelect(category._id)}
    style={{display: 'flex'}}
  >
    <Checkbox
      name={category._id}
      style={{margin: '0 0 0 -20px'}}
      className={partiallySelected ? 'partial' : ''}
      checked={numSelected > 0}
      onChange={handleItemsChange}
    />
    <span style={{flexGrow: 1}}>
      {category.category}
    </span>
    <span style={{color: selectedCategoryId === category._id ? '#ccc' : '#999'}}>
      {`${numSelected} / ${category.items.length}`}
    </span>
  </div>

export default enhance(FoodCategory)

function numItemsSelected(category, selectedItems) {
  return category.items.reduce((acc, item) =>
    selectedItems.find(selectedItem =>
      selectedItem && selectedItem._id === item._id) ? acc + 1 : acc
    , 0)
}
