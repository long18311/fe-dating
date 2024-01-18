
import {Route, Routes} from "react-router-dom";
import HomePage from "./pages/homepage/index.jsx";
import LoginPage from "./pages/loginpage/index.jsx";
import NotFound from "./pages/404/index.jsx";
import PageProduct from "./pages/Products/PageProducts.jsx";
import Example from "./pages/Examp/Example.jsx";
import Location from "./pages/Location/Location.jsx";
import Testing from "./pages/Testing/Testing.jsx";
import ProfileUser from "./pages/profilepage/ProfileUser.jsx";
import Location2 from "./pages/Location/Location2.jsx";
import ProfileUsersDetail from "./pages/profilepage/ProfileUsersDetail.jsx";
import SearchBar from "./pages/Search/index.jsx";
import Friends from "./pages/friends/index.jsx";
import Propose from "./pages/Slide/Propose.jsx";
import Setting from "./pages/Setting/index.jsx";
import InfiniteScrollList from "./pages/TestRender/UserList.jsx";
import Message from "./pages/message/index.jsx";
import Welcome from "./pages/welcome/index.jsx";
import Basic from "./pages/basic/index.jsx";
import Meet from "./pages/meet/index.jsx";
import {UpdateProfileUser} from "./pages/profilepage/UpdateProfileUser.jsx";
import Def from "./pages/Home/index.jsx";
import EditProfileUser from "./pages/profilepage/EditProfileUser.jsx";
import Contentpost from "./pages/Contentpost/index.jsx";
import Report from "./pages/report/index.jsx";
import ReportFake from "./pages/report/report-fake.jsx";
import Cms from "./components/cms/pages/cms.jsx";
import ReportDetail from "./components/cms/pages/detailreport.jsx";
import Cms2 from "./components/cms/pages/cms2.jsx";
import PostEdit from "./components/cms/pages/PostEdit.jsx";
import Post from "./pages/post.jsx";
import PostDetail from "./components/cms/pages/PostDetail.jsx";
import Check from "./pages/welcome/check.jsx";
function App() {

    return (
        <div >
            <Routes>
                <Route path={"/homepage"} element={<HomePage />} />
                <Route path={"/test"} element={<PageProduct/>} />
                <Route path={"/test2"} element={<Check/>} />
                <Route path={"/report/:userId"} element={<Report/>} />
                <Route path={"/report-fake/:userId"} element={<ReportFake/>} />
                <Route path={"/"} element={<Propose />} />
                <Route path={"/contentpost"} element={<Contentpost/>} />
                <Route path={"/Home"} element={<Def/>} />
                <Route path={"/loginpage"} element={<LoginPage/>}/>
                <Route path={"/profilepage"} element={<ProfileUser/>}/>
                <Route path={"/createpage"} element={<EditProfileUser/>}/>
                <Route path={"/examp"} element={<Example/>}/>
                <Route path={"/basic"} element={<Basic/>}/>
                <Route path={"/meet"} element={<Meet/>}/>
                <Route path={"/search-friend"} element={<SearchBar/>}/>
                <Route path={"/location"} element={<Location/>}/>
                <Route path={"/location2"} element={<Location2/>}/>
                <Route path={"/testing"} element={<Testing/>}/>
                <Route path={"/setting"} element={<Setting/>}/>
                <Route path={"/search"} element={<Setting/>}/>
                <Route path={"/friends"} element={<Friends/>}/>
                <Route path={"/propose"} element={<Propose/>}/>
                <Route path={"/message"} element={<Message/>}/>
                <Route path={"/cms"} element={<Cms/>}/>
                <Route path={"/cms2"} element={<Cms2/>}/>
                <Route path={"/cmspost"} element={<Post/>}/>
                <Route path={"/rpdt/:reportId"} element={<ReportDetail/>}/>
                <Route path={"/render"} element={<InfiniteScrollList/>}/>
                <Route path={"/welcome"} element={<Welcome/>}/>
                <Route path={"/*"} element={<NotFound/>}/>
                <Route path="/profile/:userId" element={<ProfileUsersDetail/>} />
                <Route path={"/message/:userId"} element={<Message/>}/>
                <Route path={"/postedit/:postId"} element={<PostEdit/>}/>
                <Route path={"/postdetail/:postId"} element={<PostDetail/>}/>
                <Route path={"/updatepage"} element={<UpdateProfileUser/>}/>
            </Routes>

        </div>
    )
}

export default App
