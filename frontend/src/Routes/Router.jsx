import Login from "../Component/Login";
import Signup from "../Component/Signup";
import Dashboard from "../Component/Dashboard";
import AddScholar from "../Component/AddScholar";
import ViewScholar from "../Component/ViewScholar";
import Apply from "../Component/Apply";
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
        path:'/Apply',
        element:<><Apply/></>
    },
    {
        path:'/viewscholar/:str',
        element:<><ViewScholar/></>
    }
]
export default router;