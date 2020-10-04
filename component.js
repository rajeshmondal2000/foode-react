var firebaseConfig = {
  apiKey: "AIzaSyA1e6LU4mCAMtwQzvNh7DlAuX42fB3oee4",
  authDomain: "basirhat-2019.firebaseapp.com",
  databaseURL: "https://basirhat-2019.firebaseio.com",
  projectId: "basirhat-2019",
  storageBucket: "basirhat-2019.appspot.com",
  messagingSenderId: "1034436096140",
  appId: "1:1034436096140:web:d1566e89b5809718e9cba9",
  measurementId: "G-WRY3G5XFFR"
};
var app = firebase.initializeApp(firebaseConfig);


function ToolBar() {
  return(
    <div className="toolbar">
      <div>
        <p className="label"><ion-icon name="location-outline"></ion-icon>&nbsp;My Location</p>
        <p className="address">I am in The Home, and I have to wait for the next few days </p>
      </div>
      <div>
        <ion-icon name="pricetags-outline"></ion-icon>&nbsp;&nbsp;Offers
      </div>
    </div>
  )
}

// Bottom Nav Bar
function BottomBar() {
  return(
    <div className="bottom-bar">
      <div onClick={()=>store.dispatch({ type: 'HOME'})}>
        <ion-icon name="home-outline"></ion-icon>
      </div>
      
      <div>
        <ion-icon name="search-outline"></ion-icon>
      </div>
      
      <div>
        <ion-icon name="cart-outline"></ion-icon>
      </div>
      
      <div>
        <ion-icon name="person-circle-outline"></ion-icon>
      </div>
    </div>
  )
}

function ResturantCards() {
  const [resturant, setResturant] = React.useState(store.getState().Resturant)
  
  React.useEffect(()=>{
    store.subscribe(() => {
      setResturant(store.getState().Resturant)
    })
  },[])
  
  
  return(
    <div className="container">
    {resturant?<div className="col-2-1">
      <div>
        <h3>All Resturant</h3>
      </div>
      <div>
        <h3><ion-icon name="funnel-outline"></ion-icon>&nbsp;Sort</h3>
      </div>
    </div>:''}
     {resturant? resturant.map(item=>
        <div className="card col-1-2" key={item.ContactNo} onClick={()=>{
        NProgress.start()
        store.dispatch({ type: 'RES'})
        store.dispatch({ type: 'SELECT_RES', 
          data: item
        })
       }}>
          <img src={item.image} alt="" />
          <div className="">
            <p className="title">{item.ResturantName}</p>
            <p className="category">{item.Category}</p>
            <div className="col-1-1">
              <p><ion-icon name="star-half-outline"></ion-icon>&nbsp;{item.Rating}</p>
              <p><ion-icon name="time-outline"></ion-icon>&nbsp;{item.DeliveryTime}</p>
            </div>
          </div>
        </div>
     ):''}
    </div>
  )
}

function ResturantScreen() {
  const [selectRes, setSelectRes] = React.useState(store.getState().SelRes)
  const [dproduct, setDproduct] = React.useState(null)
  const [oproduct, setOproduct] = React.useState(null)
  
  
  React.useEffect(()=>{
    var myProduct = []
    store.getState().Product.forEach((item)=>{
      if(item.owner == store.getState().SelRes.Email)
        myProduct.push(item)
    })
    setOproduct(myProduct)
    setDproduct(myProduct)
    NProgress.done()
    store.subscribe(() => {
      setSelectRes(store.getState().SelRes)
      var myProduct = []
      store.getState().Product.forEach((item) => {
        if (item.owner == store.getState().SelRes.Email)
          myProduct.push(item)
      })
      setDproduct(myProduct)
      setOproduct(myProduct)
    })
  },[])
  
  function Add(item) {
    store.dispatch({
      type: 'PRO_INC', 
      pid: item.id
    })
  }
  
  function Remove(item) {
    store.dispatch({
      type: 'PRO_DEC',
      pid: item.id
    })
  }
  
  return(
    <>
     <p className="title center">{selectRes.ResturantName}</p>
     <p className="category center">{selectRes.Category}</p>
     <div className="col-1-1 center">
        <p><ion-icon name="star-half-outline"></ion-icon>&nbsp;{selectRes.Rating}</p>
        <p><ion-icon name="time-outline"></ion-icon>&nbsp;{selectRes.DeliveryTime}</p>
     </div>
     <hr />
     <div className="container">
       {dproduct?dproduct.map((item)=>
          <div className="card col-2-1 padding-1em" key={item.id}>
            <div>
              <p>{item.name}</p>
              <p className="category">{item.category}</p>
              <p>&#8377;&nbsp;{item.price}</p>
            </div>
            
            <div>
              {item.count==0?<button className="btn" onClick={()=>store.dispatch({
                type: 'PRO_INC',
                pid: item.id
              })}>ADD</button>:<div className="cart-btn">
                <ion-icon name="remove-circle-outline" onClick={()=>Remove(item)}></ion-icon><span>{item.count}</span><ion-icon name="add-circle-outline" onClick={()=>Add(item)}></ion-icon>
              </div>}
            </div>
          </div>
       ):''}
     </div>
    </>
  )
}