// User Reducer
function UserReducer(user={
  auth: false, 
  name: null, 
  mobile: null, 
  email: null, 
  uid: null, 
  address: null
}, action) {
  switch(action.type) {
    case 'ADD_ADDRESS':
      user.address = action.data
      return user
      
    case 'AUTHENTICATION':
      user.auth = true
      user.name = action.data.name
      user.mobile = action.data.mobile
      user.email = action.data.email
      return user
      
    default:
      return user
  }
}

// Screen Reducers
function ScreenReducer(screen=1,action){
  switch(action.type) {
    case 'HOME':
      screen=1
      return screen
    
    case 'RES':
      screen=2
      return screen
      
    default:
      return screen
  }
}

// Resturant Reducers
function ResturantReducer(resturants=null,action) {
  switch(action.type) {
    case 'RES_INITIAL_ADD':
      var tmpres = []
      action.resdata.forEach((child)=>{
        if(child.val().status=='In Service') {
          tmpres.push(child.val())
        } 
      })
      resturants=tmpres
      NProgress.done();
      return resturants
      
    default:
      return resturants
  }
}

// Product Reducers
function ProductReducer(products=[],action) {
  switch(action.type) {
    case 'PRO_INITIAL_ADD':
      action.prodata.forEach((item)=>{
        products.push(item)
      })
      return products
      
    default:
      return products
  }
}

function SelResturantReducer(selres=null, action) {
  switch(action.type) {
    case 'SELECT_RES':
      selres=action.data
      return selres
      
    default:
      return selres
  }
}
// Root Reducer
let Reducers = Redux.combineReducers({
  Product: ProductReducer, 
  Resturant:ResturantReducer, 
  Screen: ScreenReducer, 
  SelRes: SelResturantReducer
})

// Redux Store
let store = Redux.createStore(Reducers)


// Home Component
function Home() {
  return(
    <div>
      <ToolBar /> 
      <ResturantCards />
    </div>
  )
}

// Main App Component
function App() {
  
  const [display, setDisplay] = React.useState(store.getState().Screen)
  
  store.subscribe(()=>{
    setDisplay(store.getState().Screen)
  })
  
  React.useEffect(()=>{
    NProgress.start();
  },[])
  
  return(
    <>
     {display==1?<Home />:display==2?<ResturantScreen />:''}
     <BottomBar />
    </>
  )
}

// Rendering Applications
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// Testing
store.subscribe(()=>{
  console.log(store.getState().Resturant)
  console.log(store.getState().Product)
})

// Resturant Data Loading
firebase.database().ref('resturant/users').on('value', (snapshot) => {
  store.dispatch({
    type: 'RES_INITIAL_ADD',
    resdata: snapshot
  })
})

// Product Data Loading
firebase.database().ref('products').on('value', (snapshots)=>{
    var tmppro = []
    snapshots.forEach((child)=>{
      if(child.val().availibility == 'In Stock') {
        tmppro.push(child.val())
      }
    })
    
  store.dispatch({
    type: 'PRO_INITIAL_ADD',
    prodata: tmppro
  })
})
