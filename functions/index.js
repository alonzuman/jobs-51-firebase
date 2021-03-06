const functions = require('firebase-functions');
const admin = require('firebase-admin');
const productionConfig = require('./config');
// const faker = require('faker');
admin.initializeApp(productionConfig);

const Constants = admin.firestore().collection('constants');
const Users = admin.firestore().collection('users');
const Activities = admin.firestore().collection('activities');
const Saved = admin.firestore().collection('saved');
const Jobs = admin.firestore().collection('jobs');
const Notifications = admin.firestore().collection('notifications');

// // SEED USER
// const uid = 'Zex7fCIlrDRKFEeRvq0n';
// const user = {
//   region: 'חיפה',
//   firstName: faker.name.firstName(),
//   lastName: faker.name.lastName(),
//   avatar: faker.image.avatar(),
//   email: faker.internet.email(),
//   activities: {
//     pending: 0,
//     approved: 0
//   }
// }

// // SEED CONSTANTS
// exports.onSeedConstants = functions.firestore
//   .document('seed-constants')
//   .onWrite(async (change, context) => {
//     try {
//       // Create constants
//       await Constants.doc('activityTypes').set({
//         all: []
//       })

//       await Constants.doc('industries').set({
//         all: []
//       })

//       await Constants.doc('listedJobLocations').set({

//       })

//       await Constants.doc('listedJobSkills').set({

//       })

//       await Constants.doc('listedMembers').set({
//         all: []
//       })

//       await Constants.doc('locations').set({
//         all: [],
//         regions: []
//       })

//       await Constants.doc('stats').set({
//         approvedActivityHoursByRegionCount: {},
//         approvedActivityHoursCount: {},
//         pendingUsersCount: {},
//         volunteersByRegionCount: {},
//         volunteersCount: {}
//       })
//     } catch (error) {
//       console.log('######################')
//       console.log('######################')
//       console.log('######################')
//       console.log(error)
//     }
//   })

// exports.onSeedUsers = functions.firestore
//   .document('seed-users/{seedId}')
//   .onWrite(async (change, context) => {
//     try {
//       // Seed users
//       await Users.doc(uid).set(user)

//       // Seed activities
//       const activity = {
//         region: 'חיפה',
//         uid,
//         user: {
//           firstName: user.firstName,
//           lastName: user.lastName,
//           avatar: user.avatar,
//           region: user.region
//         },
//         description: faker.lorem.sentence(),
//         type: 'אירוע שיא',
//         date: '23-11-2020',
//         approved: false,
//         total: faker.random.number({ min: 2, max: 12 })
//       }
//       const seedActivities = [Activities.add(activity), Activities.add(activity)]
//       Promise.all(seedActivities)

//     } catch (error) {
//       console.log('#########################')
//       console.log('######### ERROR #########')
//       console.log('#########################')
//       console.log(error)
//     }
//   })


// USERS
exports.onCreateUser = functions.firestore
  .document('users/{uid}')
  .onCreate(async (snapshot, context) => {
    const fullName = `${snapshot.data().firstName} ${snapshot.data().lastName}`
    try {
      // Update pending users count
      await Constants.doc('stats').update({
        pendingUsersCount: admin.firestore.FieldValue.increment(1)
      })

      await Constants.doc('listedMembers').update({
        all: admin.firestore.FieldValue.arrayUnion(fullName)
      })
    } catch (error) {
      console.log('################')
      console.log('################')
      console.log('################')
      console.log(error)
    }
  })

exports.onUpdateUser = functions.firestore
  .document('users/{uid}')
  .onUpdate(async (change, context) => {
    const uid = context.params.uid;
    try {
      if (change.before.exists && change.after.exists) {
        const { firstName: firstNameBefore, lastName: lastNameBefore, role: roleBefore, region: regionBefore, volunteer: volunteerBefore } = change.before.data();
        const { firstName: firstNameAfter, lastName: lastNameAfter, avatar: avatarAfter, role: roleAfter, region: regionAfter, volunteer: volunteerAfter } = change.after.data();

        const fullNameBefore = `${firstNameBefore} ${lastNameBefore}`;
        const fullNameAfter = `${firstNameAfter} ${lastNameAfter}`;

        if ((fullNameAfter !== fullNameBefore) || (!regionBefore && regionBefore !== regionAfter)) {
          // Update users on listedMembers list
          await Constants.doc('listedMembers').update({
            all: admin.firestore.FieldValue.arrayRemove(fullNameBefore)
          })
          await Constants.doc('listedMembers').update({
            all: admin.firestore.FieldValue.arrayUnion(fullNameAfter)
          })

          // Update all activities user has
          const activitiesSnapshot = await Activities.where('uid', '==', uid).get();
          activitiesSnapshot.forEach(async doc => {
            await Activities.doc(doc.id).set({
              region: regionAfter,
              user: {
                firstName: firstNameAfter,
                lastName: lastNameAfter,
                avatar: avatarAfter,
              }
            }, { merge: true })
          })

          // Update all job posts user has
          const jobsSnapshot = await Jobs.where('uid', '==', uid).get();
          jobsSnapshot.forEach(async doc => {
            await Jobs.doc(doc.id).set({
              user: {
                firstName: firstNameAfter,
                lastName: lastNameAfter,
                avatar: avatarAfter
              }
            }, { merge: true })
          })
        }
        const increment = admin.firestore.FieldValue.increment(1)
        const decrement = admin.firestore.FieldValue.increment(-1)

        // Update if role changed change approvedusers count + by role + decrement
        let updatedStats = {}

        // Update general users count
        if (!volunteerBefore && volunteerAfter) {
          updatedStats = {
            ...updatedStats,
            volunteersCount: increment,
            volunteersByRegionCount: {
              [regionAfter]: increment
            }
          }
        } else if (volunteerBefore && !volunteerAfter) {
          updatedStats = {
            ...updatedStats,
            volunteersCount: decrement,
            volunteersByRegionCount: {
              [regionAfter]: decrement
            }
          }
        }

        // Update region specific users count
        if (regionBefore && !regionAfter) {
          updatedStats = {
            ...updatedStats,
            volunteersByRegionCount: {
              [regionBefore]: decrement,
            }
          }
        } else if (!regionBefore && regionAfter) {
          updatedStats = {
            ...updatedStats,
            volunteersByRegionCount: {
              [regionAfter]: increment,
            }
          }
        } else if (regionBefore && regionBefore !== regionAfter) {
          updatedStats = {
            ...updatedStats,
            volunteersByRegionCount: {
              [regionAfter]: increment,
              [regionBefore]: decrement
            }
          }
        }

        return await Constants.doc('stats').set({
          ...updatedStats
        }, { merge: true })
      }
    } catch (error) {
      console.log('################')
      console.log('################')
      console.log('################')
      console.log(error)
    }
  })

exports.onDeleteUser = functions.firestore
  .document('users/{uid}')
  .onDelete(async (snapshot, context) => {
    const { uid } = context.params;
    const { firstName, lastName } = snapshot.data()
    const fullName = `${firstName} ${lastName}`
    try {
      // Delete user from listedMembers
      await Constants.doc('listedMembers').update({
        all: admin.firestore.FieldValue.arrayRemove(fullName)
      })

      // Delete job posts
      const jobsSnapshot = await Jobs.where('uid', '==', uid).get()
      jobsSnapshot.forEach(async doc => {
        await Jobs.doc(doc.id).delete()
      })

      // Delete saved
      const savedSnapshot = await Saved.where('uid', '==', uid).get()
      savedSnapshot.forEach(async doc => {
        await Saved.doc(doc.id).delete()
      })

      // Delete activities
      const activitiesSnapshot = await Activities.where('uid', '==', uid).get()
      activitiesSnapshot.forEach(async doc => {
        await Activities.doc(doc.id).delete()
      })

      // Delete user auth
      return await admin.auth().deleteUser(uid)
    } catch (error) {
      console.log('##################')
      console.log('##################')
      console.log('##################')
      console.log(error)
    }
  })

// ACTIVITIES
exports.onCreateActivity = functions.firestore
  .document('activities/{activityId}')
  .onCreate(async (snapshot, context) => {
    const { uid, total, approved } = snapshot.data()
    const userRef = Users.doc(uid);
    const increment = admin.firestore.FieldValue.increment(total);
    try {
      if (approved) {
        return await userRef.update('activities.approved', increment)
      } else {
        return await userRef.update('activities.pending', increment)
      }
    } catch (error) {
      console.log('#############')
      console.log('#############')
      console.log('#############')
      console.log(error)
    }
  })

exports.onUpdateActivity = functions.firestore
  .document('activities/{activityId}')
  .onUpdate(async (change, context) => {
    const { activityId } = context.params;
    const { approved: approvedBefore } = change.before.data();
    const { date, uid, approved: approvedAfter, total, type, description, approvedBy, region } = change.after.data();
    try {
      const increment = admin.firestore.FieldValue.increment(total)
      const decrement = admin.firestore.FieldValue.increment(-total)

      if (approvedBefore !== approvedAfter && change.before.exists) {
        if (approvedAfter) {
          await Notifications.add({
            uid,
            activityId,
            activity: {
              description,
              type,
              date
            },
            notificationBy: {
              ...approvedBy
            },
            type: 'activityApproved',
            seen: false,
            dateCreated: Date.now()
          })
        }

        await Constants.doc('stats').set({
          approvedActivityHoursCount: approvedAfter ? increment : decrement,
          approvedActivityHoursByRegionCount: {
            [region]: approvedAfter ? increment : decrement
          }
        }, { merge: true })

        return await Users.doc(uid).set({
          activities: {
            approved: approvedAfter ? increment : decrement,
            pending: approvedAfter ? decrement : increment
          }
        }, { merge: true })
      }
    } catch (error) {
      console.log('###############')
      console.log('###############')
      console.log('###############')
      console.log(error)
    }
  })

exports.onDeleteActivity = functions.firestore
  .document('activities/{activityId}')
  .onDelete(async (snapshot, context) => {
    const { uid, total, approved, region } = snapshot.data()
    try {
      const decrement = admin.firestore.FieldValue.increment(-total);

      // Reduce hours from stats doc
      if (approved) {
        await Constants.doc('stats').set({
          approvedActivityHoursByRegionCount: {
            [region]: decrement
          }
        }, { merge: true })
      }

      const activities = approved ? { approved: decrement } : { pending: decrement }

      await Users.doc(uid).set({
        activities
      }, { merge: true })
    } catch (error) {
      console.log('###############')
      console.log('###############')
      console.log('###############')
      console.log(error)
    }
  })

// JOBS
exports.onCreateJob = functions.firestore
  .document('jobs/{jobId}')
  .onCreate(async (snapshot, context) => {
    const { jobId } = context.params;
    const { skills, location } = snapshot.data()
    try {
      const increment = admin.firestore.FieldValue.increment(1)

      // Update job locations count
      await Constants.doc('listedJobLocations').set({
        [location]: increment
      }, { merge: true })

      // Update job skills count
      await skills.forEach(async skill => {
        await Constants.doc('listedJobSkills').set({
          [skill]: increment
        }, { merge: true })
      })
    } catch (error) {
      console.log('###############')
      console.log('###############')
      console.log('###############')
      console.log(error)
    }
  })

exports.onUpdateJob = functions.firestore
  .document('jobs/{jobId}')
  .onUpdate(async (change, context) => {
    try {
      if (change.after.exists) {
        const { location: locationBefore, skills: skillsBefore } = change.before.data();
        const { location: locationAfter, skills: skillsAfter } = change.after.data();

        const increment = admin.firestore.FieldValue.increment(1);
        const decrement = admin.firestore.FieldValue.increment(-1);

        if (locationAfter !== locationBefore) {
          await Constants.doc('listedJobLocations').set({
            [locationBefore]: decrement,
            [locationAfter]: increment
          }, { merge: true })
        }

        if (skillsBefore !== skillsAfter) {
          await skillsBefore.forEach(async skill => {
            await Constants.doc('listedJobSkills').update({
              [skill]: decrement
            })
          })

          await skillsAfter.forEach(async skill => {
            await Constants.doc('listedJobSkills').update({
              [skill]: increment
            })
          })
        }
      }
    } catch (error) {
      console.log('###############')
      console.log('###############')
      console.log('###############')
      console.log(error)
    }
  })

exports.onDeleteJob = functions.firestore
  .document('jobs/{jobId}')
  .onDelete(async (snapshot, context) => {
    const { location, skills } = snapshot.data()
    try {
      const decrement = admin.firestore.FieldValue.increment(-1)

      // Update locations count
      await Constants.doc('listedJobLocations').set({
        [location]: decrement
      }, { merge: true })

      // Update skills count
      await skills.forEach(async skill => {
        await Constants.doc('listedJobSkills').update({
          [skill]: decrement
        })
      })
    } catch (error) {
      console.log('###############')
      console.log('###############')
      console.log('###############')
      console.log(error)
    }
  })
