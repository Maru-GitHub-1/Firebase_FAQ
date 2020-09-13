import React, {useState, useEffect} from 'react';
import * as firebase from 'firebase';
import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyAIV-JchCjOFS39mgTfgIqyFPT8ufXaVwA",
  authDomain: "thefirstfirebase-99cec.firebaseapp.com",
  databaseURL: "https://thefirstfirebase-99cec.firebaseio.com",
  projectId: "thefirstfirebase-99cec",
  storageBucket: "thefirstfirebase-99cec.appspot.com",
  messagingSenderId: "922364064717",
  appId: "1:922364064717:web:2a8bdea69e1b43e2870a84",
  measurementId: "G-0XMRRJH4XH"
};
firebase.initializeApp(firebaseConfig);

function App() {
  const [foods, setFoods] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [weight, setWeight] = useState('');
  const [documentId, setDocumentId] = useState('');

  useEffect(() => {
    // mount定義 -> renderでDOMが切り替わる
    const db = firebase.firestore();
    // onSnapshotでcollectionの更新を検知
    const unsubscribe = db.collection('foods').orderBy('weight', 'desc').onSnapshot((quertSnapshot) => {
      const _foods = quertSnapshot.docs.map(doc => {
        return {
          foodId: doc.id,
          ...doc.data()
        }
      });
      setFoods(_foods);
    });
    return () => {
      unsubscribe();
    };
  });

  const hundleClickFetchButton =  async () => {

    // document 取得

    // const db = firebase.firestore();
    // const doc = await db.collection('foods').doc('AuOvLSCndQuPa4iPYsH9').get();
    // console.log(doc.data());

    //collection 取得
    const db = firebase.firestore();
    const snapshot = await db
    .collection('foods')
    .get();
    const _foods = [];
    snapshot.forEach((doc) => {
      _foods.push({
        foodId: doc.id,
        ...doc.data()
      });
    });

    setFoods(_foods);
  }

  const hundleClickAddButton = async () => {
    // ifでfalseの時に止めたいならreturnを忘れないように
    if(!foodName || !weight) {
      alert('should type "userName" or "weight"')
      return;
    }

    const parsedWeight = parseInt(weight, 10);

    if( isNaN(parsedWeight) ) {
      alert('weightは半角英数字を入力してください')
      return;
    }
    const db = firebase.firestore();
    // await db
    // .collection('foods')
    // .doc('1')
    // .set({
    //   name: 'パスタ',
    //   weight: 400
    // }, {merge: true});
    await db.collection('foods').add({
      name: foodName,
      weight: parsedWeight
    });

    setFoodName('');
    setWeight('');
  }

  const hundleClickUpdateButton = async () => {
    if(!documentId) {
      alert('documentIdをセットしてください');
      return;
    }

    const newData = {};
    if(foodName) {
      // オブジェクト変数['プロパティ名']でプロパティを追加？？
      newData['name'] = foodName;
    }
    if(weight) {
      newData['weight'] = parseInt(weight, 10);
    }

    try {
      const db = firebase.firestore();
      await db.collection('foods').doc(documentId).update(newData);
      setFoodName('');
      setWeight('');
      setDocumentId('');
    } catch (error) {
      console.log(error);
    }
  }

  const hundleClickDeleteButton = async () => {
    if(!documentId) {
      alert('documentIdを指定してください');
      return;
    }

    try {
      const db = firebase.firestore();
      await db.collection('foods').doc(documentId).delete()
  
      setFoodName('');
      setWeight('');
      setDocumentId('')
    } catch (error) {
      console.log(error)
    }
  }

  const foodListItems = foods.map(food => {
    return(
      <li key={food.foodId}>
        <ul>
          <li>ID: {food.foodId}</li>
          <li>name: {food.name}</li>
          <li>weight: {food.weight}</li>
        </ul>
      </li>
    )
  })

  return (
    <div className="App">
      <h1>Hello World!!</h1>
      <div>
        <label htmlFor="foodname">foodName: </label>
        <input
          type="text"
          id="foodname"
          value={foodName}
          onChange={event => {setFoodName(event.target.value)}}
        />
        {/* htmlFor -> JSXでのfor属性 */}
        <label htmlFor="weight">weight: </label>
        <input
          type="text"
          id="weight"
          value={weight}
          onChange={event => {setWeight(event.target.value)}}
        />
        <label htmlFor="documentId">documentId: </label>
        <input
          type="text"
          id="ducumentId"
          value={documentId}
          onChange={event => {setDocumentId(event.target.value)}}
        />
      </div>
      <button onClick={hundleClickFetchButton}>取得</button>
      <button onClick={hundleClickAddButton}>追加</button>
      <button onClick={hundleClickUpdateButton}>更新</button>
      <button onClick={hundleClickDeleteButton}>消去</button>
      <ul>{foodListItems}</ul>
    </div>
  );
}

export default App;
