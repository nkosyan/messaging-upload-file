import firebase from 'firebase';

class Firebase {
  constructor() {
    if (!firebase.apps.length) {
      this.init();
      this.observeAuth();
    }
  }

  init = () => firebase.initializeApp({
    apiKey: 'AIzaSyAVrnPZ5ksL7TEGVSCuCO0CS86EhPlDGno',
    authDomain: 'narkos-2020.firebaseapp.com',
    databaseURL: 'https://narkos-2020.firebaseio.com',
    projectId: 'narkos-2020',
    storageBucket: 'gs://narkos-2020.appspot.com',
    messagingSenderId: '34998462751',
  });
  observeAuth = () => firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  onAuthStateChanged = user => {
    if (!user) {
      try {
        firebase.auth().signInAnonymously();
      } catch ({ message }) {
        alert(message);
      }
    }
  };

  get uid() {
    return firebase.auth().currentUser?.uid;
  }
  get ref() {
    return firebase.database().ref('messages');
  }

  parse = snapshot => {
    const {
      timestamp: numberStamp, text, image, user,
    } = snapshot.val();
    return {
      _id: snapshot.key,
      timestamp: new Date(numberStamp),
      text,
      image,
      user,
    };
  };
  on = callback => this.ref.limitToLast(20).on('child_added', snapshot => callback(this.parse(snapshot)));
  off = () => this.ref.off();
  send = async ({ text, fileName, uri, user }) => {
    const message = { text, user, timestamp: firebase.database.ServerValue.TIMESTAMP };
    if (uri) {
      const id = Math.random().toString(36).slice(3);
      const storageRef = firebase.storage().ref();
      
      const response = await fetch(uri);
      const blob = await response.blob();
      const uploadTask = storageRef.child(`images/${id}-${fileName}`).put(blob);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        error => console.log(error, 'Cannot upload file.'),
        async () => {
          message.image = await uploadTask.snapshot.ref.getDownloadURL();
          this.ref.push(message);
        },
      );
      return;
    }
    this.ref.push(message);
  };
}

Firebase.shared = new Firebase();
export default Firebase;
