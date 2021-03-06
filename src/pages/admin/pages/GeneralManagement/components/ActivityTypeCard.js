import { IconButton, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ApprovalDialog from '../../../../../components/layout/ApprovalDialog';
import { deleteActivityType } from '../../../../../actions/constants';

// Icons
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const ActivityTypeCard = ({ activity, isDeleting, isUpdating, isEditing }) => {
  const { translation } = useSelector(state => state.theme)
  const [isDeletingActivityType, setIsDeletingActivityType] = useState(false)
  const dispatch = useDispatch()

  const deleteActivity = () => {
    dispatch(deleteActivityType(activity))
    handleIsDeletingActivityType()
  }

  const handleIsDeletingActivityType = () => setIsDeletingActivityType(!isDeletingActivityType)

  return (
    <ListItem disableGutters button>
      <ApprovalDialog
        open={isDeletingActivityType}
        onClose={handleIsDeletingActivityType}
        action={deleteActivity}
        loading={isDeleting}
        text={translation.areYouSure}
      />
      <ListItemText primary={activity} />
      {isEditing &&
        <ListItemIcon>
          <IconButton disabled={isUpdating} onClick={handleIsDeletingActivityType} size='small'>
            <DeleteOutlineIcon />
          </IconButton>
        </ListItemIcon>}
    </ListItem>
  )
}

export default ActivityTypeCard
