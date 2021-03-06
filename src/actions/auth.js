import { app, db } from '../firebase';
import firebase from 'firebase';
import { setFeedback } from './feedback';
import store from '../store'
import { ERROR, FETCHING, SET_USER, SIGN_OUT } from '../reducers/auth';
const { translation } = store.getState().theme
const Users = db.collection('users');

export const verifyUser = () => async dispatch => {
  dispatch({
    type: FETCHING
  })
  try {
    app.auth().onAuthStateChanged(async user => {
      if (user) {
        await dispatch(setUser(user))
      } else {
        await dispatch(signOut(false))
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export const setUser = (user) => async dispatch => {
  try {
    const snapshot = await Users.doc(user.uid).get()
    dispatch({
      type: SET_USER,
      payload: {
        uid: user.uid,
        ...snapshot.data()
      }
    })
  } catch (error) {
    console.log(error)
    dispatch({
      type: ERROR
    })
    dispatch(setFeedback({
      type: 'error',
      payload: 'Not authenticated'
    }))
  }
}

export const signInWithProvider = (provider) => async dispatch => {
  dispatch({
    type: FETCHING
  })

  try {
    const firebaseProvider = () => {
      switch (provider) {
        case 'facebook': return new firebase.auth.FacebookAuthProvider();
        case 'google': return new firebase.auth.GoogleAuthProvider();
        default: return null
      }
    }

    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(async () => {
      const result = await firebase.auth().signInWithPopup(firebaseProvider())
      const { uid, displayName, email, photoURL, phoneNumber } = result.user

      const fetchedUser = await Users.doc(uid).get()
      const user = fetchedUser.data()

      if (fetchedUser.data()) {
        dispatch({
          type: SET_USER,
          payload: { ...user }
        })
        dispatch(setFeedback({
          type: 'success',
          msg: translation.welcome
        }))
      } else if (!fetchedUser.data()) {
        const newUser = {
          uid,
          email,
          firstName: displayName?.split(' ')[0] || '',
          lastName: displayName?.split(' ')[1] || '',
          serviceYear: '',
          avatar: photoURL || '',
          phone: phoneNumber || '',
          volunteer: false,
          lookingForJob: false,
          activities: {
            pending: 0,
            approved: 0
          },
          role: 'pending',
          dateCreated: Date.now(),
          region: ''
        }

        await Users.doc(uid).set(newUser, { merge: true })

        dispatch({
          type: SET_USER,
          payload: { ...newUser }
        })

        return dispatch(setFeedback({
          type: 'success',
          msg: translation.userNotListedInConst
        }))
      }
    })
  } catch (error) {
    console.log(error)
    const msg = () => {
      switch (error.code) {
        case 'auth/account-exists-with-different-credential': return translation.accountAlreadyExistsWithEmail;
        case 'auth/network-request-failed': return translation.serverError;
        case 'auth/network-request-failed': return translation.networkErrorPleaseTryAgain;
        default: return translation.serverError
      }
    }
    dispatch({
      type: ERROR
    })
    dispatch(setFeedback({
      type: 'error',
      msg: msg()
    }))
  }
}

export const signIn = (email, password) => async dispatch => {
  dispatch({
    type: FETCHING
  })
  try {
    const res = await app.auth().signInWithEmailAndPassword(email, password)
    const { uid } = res.user
    const snapshot = await Users.doc(uid).get()
    const { userInfo } = snapshot.data()
    const user = {
      uid,
      email,
      ...userInfo
    }
    dispatch({
      type: SET_USER,
      payload: {
        ...user
      }
    })
    dispatch(setFeedback({
      type: 'success',
      msg: translation.welcome
    }))
  } catch (error) {
    console.log(error)
    const msg = () => {
      switch (error.code) {
        case 'auth/user-not-found': return translation.userNotFoundTryAgain
        case 'auth/account-exists-with-different-credential': return translation.accountAlreadyExistsWithEmail
        case 'auth/network-request-failed': return translation.serverError;
        default: return translation.serverError
      }
    }
    dispatch({
      type: ERROR
    })
    dispatch(setFeedback({
      type: 'error',
      msg: msg()
    }))
  }
}

export const signUp = (user, password) => async dispatch => {
  dispatch({
    type: FETCHING
  })
  try {
    const snapshot = await app.auth().createUserWithEmailAndPassword(user.email, password)
    const { uid } = snapshot.user
    const newUser = {
      uid,
      ...user,
      activities: {
        pending: 0,
        approved: 0
      },
      lookingForJob: false,
      role: 'pending',
      dateCreated: new Date(),
    }
    await Users.doc(uid).set(newUser, { merge: true })
    dispatch({
      type: SET_USER,
      payload: { ...newUser }
    })
    dispatch(setFeedback({
      type: 'success',
      msg: translation.welcome
    }))
  } catch (error) {
    console.log(error)
    dispatch(setFeedback({
      type: 'error',
      msg: translation.serverError
    }))
  }
}

export const signOut = (showMsg = false) => async dispatch => {
  try {
    await app.auth().signOut()
    dispatch({
      type: SIGN_OUT
    })
    {
      showMsg &&
      dispatch(setFeedback({
        type: 'success',
        msg: translation.signedOutSuccess
      }))
    }
  } catch (error) {
    console.log(error)
    dispatch(setFeedback({
      type: 'error',
      msg: translation.serverError
    }))
  }
}
