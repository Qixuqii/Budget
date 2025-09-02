import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom";
import './tailwind.css';
import Register from "./pages/Register";
import Write from "./pages/Write";
import Home from "./pages/Home";
import Single from "./pages/Single";
import Login from "./pages/Login";
import CreateBudget from "./pages/CreateBudget";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import './style.scss';
import Budgets from "./pages/Budgets";

const Layout = () => {
  return (
    <>
    <Navbar />
    <Outlet />
    <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      { path: "/budgets", element: <Budgets /> },
      {
        path: "/budget/new",
        element: <CreateBudget />
      },
      {
        path: "/post/:id",
        element: <Single />
      },
      {
        path: "/write",
        element: <Write />
      },
    ]
  },
  {
    path: "/Register",
    element: <Register/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
]);

function App() {
  return <div className="app">
    <div className="container">
    <RouterProvider router ={router}/>
    {/* my: 相当于挂链接，只要是const router里我写有的路径和element，我都可以连接到，不管是内容还是样式 */}
    {/* RouterProvider 就像是一个**“路由电闸”，
    一旦你在里面写好的路径（在 const router = createBrowserRouter([...]) 里配置），
    它就会根据当前浏览器网址，自动渲染对应的组件页面**。 */}
    </div>
  </div>;
}

export default App;
