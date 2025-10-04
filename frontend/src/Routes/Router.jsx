import Login from "../Component/Login";
import Signup from "../Component/Signup";
import Dashboard from "../Component/Dashboard";
import AddScholar from "../Component/AddScholar";
import ViewScholar from "../Component/ViewScholar";
let router=[
    {
        path:'/',
        element:<><Login/></>
    },
    {
        path:'/Signup',
        element:<><Signup/></>
    },
      {
        path:'/Dashboard',
        element:<><Dashboard/></>
    },
     {
        path:'/Addscholar',
        element:<><AddScholar/></>
    },
    {
        path:'/viewscholar/:str',
        element:<><ViewScholar/></>
    }
]
export default router;