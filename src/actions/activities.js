import { db } from '../firebase'
import { setFeedback } from './feedback'
import firebase from 'firebase'
import store from '../store'
const usersRef = db.collection('users')
const Activities = db.collection('activities')

export const addActivity = (activity) => async dispatch => {
  const { uid, activities } = store.getState().auth
  dispatch({
    type: 'ACTIVITY_LOADING'
  })
  try {
    const ref = Activities.doc()
    const newActivity = {
      ...activity,
      id: ref.id,
      uid,
      dateCreated: Date.now()
    }
    const { total } = activity
    await Activities.doc(ref.id).set(newActivity)
    const increment = firebase.firestore.FieldValue.increment(total);
    const userRef = await usersRef.doc(uid)
    await userRef.update('activities.pending', increment)
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: { newActivity }
    })
    dispatch({
      type: 'SET_USER',
      payload: {
        activities: {
          pending: activities.pending + total,
          approved: activities.approved
        }
      }
    })
    dispatch(setFeedback({
      type: 'success',
      msg: 'activityAdded'
    }))
  } catch (error) {
    console.log(error)
    dispatch(setFeedback({
      type: 'error',
      msg: 'ServerError'
    }))
  }
}

export const getUserActivities = ({ uid }) => async dispatch => {
  const { regionManagers } = store.getState().constants

  dispatch({
    type: 'ACTIVITY_LOADING'
  })

  try {
    const userSnap = await usersRef.doc(uid).get()
    const user = {
      uid: userSnap.id,
      ...userSnap.data()
    }
    const { region } = user;

    const activitiesSnapshot = await Activities.where('uid', '==', uid).orderBy('dateCreated', 'desc').get()
    let results = []
    activitiesSnapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() }))

    // Get region admins
    let managersSnapshot;
    let managerResults = []
    if (region) {
      managersSnapshot = await usersRef.where('uid', 'in', regionManagers[region]).get()
      managersSnapshot.forEach(doc => managerResults.push({ id: doc.id, ...doc.data() }))
    }

    dispatch({
      type: 'SET_ACTIVITIES',
      payload: {
        activities: results,
        regionManagers: managerResults,
        currentUid: uid
      }
    })
  } catch (error) {
    console.log(error)
    dispatch(setFeedback({
      type: 'error',
      msg: 'ServerError'
    }))
  }
}

export const approveActivity = (activity) => async dispatch => {
  // TODO add condition that checks if its unapproved already
  try {
    const authState = store.getState().auth
    const { id, total, uid } = activity
    await Activities.doc(id).set({ approved: true }, { merge: true })
    const increment = firebase.firestore.FieldValue.increment(total);
    const decrement = firebase.firestore.FieldValue.increment(-total);

    const userRef = await usersRef.doc(uid)
    await userRef.update('activities.pending', decrement)
    await userRef.update('activities.approved', increment)

    if (authState.uid === uid) {
      dispatch({
        type: 'SET_USER',
        payload: {
          activities: {
            pending: authState.activities.pending - total,
            approved: authState.activities.approved + total
          }
        }
      })
    }

    dispatch(setFeedback({
      type: 'success',
      msg: 'ActivityApproved'
    }))
  } catch (error) {
    console.log(error)
    dispatch(setFeedback({
      type: 'error',
      msg: 'ServerError'
    }))
  }
}

export const unApproveActivity = (activity) => async dispatch => {
  // TODO add condition that checks if its unapproved already
  try {
    const authState = store.getState().auth
    const { id, total, uid } = activity
    await Activities.doc(id).set({ approved: false }, { merge: true })
    const increment = firebase.firestore.FieldValue.increment(total);
    const decrement = firebase.firestore.FieldValue.increment(-total);

    const userRef = await usersRef.doc(uid)
    await userRef.update('activities.approved', decrement)
    await userRef.update('activities.pending', increment)

    if (authState.uid === uid) {
      dispatch({
        type: 'SET_USER',
        payload: {
          activities: {
            pending: authState.activities.pending + total,
            approved: authState.activities.approved - total
          }
        }
      })
    }

    dispatch(setFeedback({
      type: 'success',
      msg: 'ActivityApproved'
    }))
  } catch (error) {
    console.log(error)
    dispatch(setFeedback({
      type: 'error',
      msg: 'ServerError'
    }))
  }
}

export const deleteActivity = (activity) => async dispatch => {
  dispatch({
    type: 'ACTIVITY_LOADING'
  })
  try {
    const { activities } = store.getState().auth
    const { id, uid, total } = activity
    await Activities.doc(id).delete()
    const userRef = await usersRef.doc(uid)
    const decrement = firebase.firestore.FieldValue.increment(-total);

    if (activity.approved) {
      await userRef.update('activities.approved', decrement)
    } else {
      await userRef.update('activities.pending', decrement)
    }
    dispatch({
      type: 'SET_USER',
      payload: {
        activities: {
          pending: activity.approved ? activities.pending : activities.pending - total,
          approved: !activity.approved ? activities.approved : activities.approved - total,
        }
      }
    })
    dispatch({
      type: 'REMOVE_ACTIVITY',
      payload: id
    })
    dispatch(setFeedback({
      type: 'success',
      msg: 'ActivityRemoved'
    }))
    dispatch({
      type: 'ACITIVITIES_STOP_LOADING'
    })
  } catch (error) {
    console.log(error)
    dispatch(setFeedback({
      type: 'error',
      msg: 'ServerError'
    }))
  }
}

export const getActivities = queryParams => async dispatch => {
  dispatch({
    type: 'ACTIVITY_LOADING'
  });

  try {
    const { selectedRegion: region } = queryParams;
    let query = Activities;


    if (region) {
      query = query.where('region', '==', region)
    }

    if (!region) {
      query = query.limit(10);
    }

    const snapshot = await query.get();
    let activities = [];
    snapshot.forEach(doc => activities.push({ id: doc.id, ...doc.data() }))

    // TODO add pagination
    dispatch({
      type: 'SET_ACTIVITIES',
      payload: { activities }
    })

  } catch (error) {
    console.log(error)
    dispatch(setFeedback({
      type: 'error',
      msg: 'ServerError'
    }))
    dispatch({
      type: 'ACTIVITY_FAIL'
    })
  }
}

export const clearActivityFilters = () => async dispatch => {
  dispatch({
    type: 'CLEAR_ACTIVITY_FILTERS'
  })
}

export const changeView = (type) => async dispatch => {
  dispatch({
    type: 'CHANGE_VIEW',
    payload: type
  })
}
