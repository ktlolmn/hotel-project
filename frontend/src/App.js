import Account from "./component/user/Account";
import BookingHistory from "./component/user/BookingHistory";
import Home from "./component/user/Home";
import Login from "./component/Login";
import RoomDetail from "./component/user/RoomDetail";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookingManagement from "./component/admin/BookingManagement";
import Statistics from "./component/admin/Statistics";
import Register from "./component/Register";
import RoomManagement from "./component/admin/RoomManagement2";
import { IsAdmin, ProtectedRoute } from "./component/service/guard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element = {<Home />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={<ProtectedRoute element={<BookingHistory />} />}/>
        <Route path="/room-detail/:id" element={<RoomDetail />} />
        <Route path="/account" element={<ProtectedRoute  element={<Account />}/>}/>
        <Route path="/admin" element={<IsAdmin element={<RoomManagement />} />}/>
        <Route path="/admin/booking" element={<IsAdmin element={<BookingManagement />} />}/>
        <Route path="/admin/statistics" element={<IsAdmin element={<Statistics />} />}/>
      </Routes>
    </Router>
  );
}

export default App;
