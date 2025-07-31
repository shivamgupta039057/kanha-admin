import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Loader from '../common/Loader';
import PageTitle from '../components/PageTitle';
import SignIn from '../pages/Authentication/SignIn';
import ECommerce from '../pages/Dashboard/ECommerce';
import localStorageKeys from '../constant/localStorageKeys';
import { ROUTES_CONST } from '../constant/routeConstant';
import Doctors from '../pages/Doctors/Doctors.tsx';
import Protected from './ProtectedRoutes';
import DefaultLayout from '../layout/DefaultLayout';
import Patient from '../pages/Patient/Patient.tsx';
import Page404 from '../pages/Page404.tsx';
// import Cities from '../pages/State/State.tsx';
import State from '../pages/State/State.tsx';
import City from '../pages/City/CityData.tsx';
import MedicinePage from '../pages/Medicine/Medicine.tsx';
import TestPage from '../pages/Test/Test.tsx';
import ViewPatients from "../pages/ViewPatients/ViewPatients.js"
import ViewPrescription from "../pages/precription/viewPricription.jsx"
import NotificationMedicine from '../pages/Medicine/NotificationMedicine.tsx';
import Rooms from '../pages/Rooms/Rooms.tsx';
import RoomTypes from '../pages/Rooms/RoomTypes.tsx';
import RoomBooking from '../pages/Rooms/ViewBooking.tsx';
import GetAllUser from '../pages/roombooking/GetUser.tsx';
import UserBooking from '../pages/roombooking/UserBooking.tsx';
import Banquet from '../pages/banquet/Banquet.tsx';
import HallBooking from '../pages/banquet/ViewBooking.tsx';
import GalleryPage from '../pages/gallery/GalleryPage.tsx';
import CategoryPage from '../pages/categories/CategoriesPage.tsx';
import MenuPage from '../pages/menuItem/MenuPage.tsx';
import TableBookingPage from '../pages/tableBooking/TableBookingPage.tsx';
import Table from '../pages/Table/Table.tsx';
import EnquiryPage from '../pages/enquery/EnquiryPage.tsx';
import BlogPage from '../pages/blog/BlogPage.tsx';

function AllRoutes() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const isAuthenticated = localStorage.getItem(localStorageKeys.token);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const routeConfig = [
    { path: ROUTES_CONST.ROOM, component: Rooms },
    {path : `${ROUTES_CONST.ROOM_TYPE}/:roomId` , component : RoomTypes},
    {path : `${ROUTES_CONST.ROOM_BOOKING_VIEW}/:roomId` , component : RoomBooking},
    { path: ROUTES_CONST.GET_ALL_USER, component: GetAllUser },
    {path : `${ROUTES_CONST.VIEW_USER_BOOKING}/:userId` , component : UserBooking},
    { path: ROUTES_CONST.BANQUET, component: Banquet },
    {path : `${ROUTES_CONST.HALL_BOOKING_VIEW}/:hallId` , component : HallBooking},
    {path : `${ROUTES_CONST.GALLERY}` , component : GalleryPage},
    {path : `${ROUTES_CONST.CATEGORY}` , component : CategoryPage},
    {path : `${ROUTES_CONST.MENU}/:categoryId` , component : MenuPage},
    {path : `${ROUTES_CONST.TABLE_BOOKING}` , component : TableBookingPage},
    {path : `${ROUTES_CONST.TABLE}` , component : Table},
    {path : `${ROUTES_CONST.ENQUIRY}` , component : EnquiryPage},
    {path : `${ROUTES_CONST.BLOG}` , component : BlogPage},















    {path : `${ROUTES_CONST.VIEWPATIENT}/:patientId` , component : ViewPatients},
    { path: ROUTES_CONST.MEDICINE, component: MedicinePage },
    { path: ROUTES_CONST.TEST, component: TestPage },
    { path: ROUTES_CONST.DOCTOR, component: Doctors },
    { path: ROUTES_CONST.MEDICINE_NOTIFICATION, component: NotificationMedicine },
    {path : ROUTES_CONST.PATIENT , component : Patient},
    {path : ROUTES_CONST.HOME , component : ECommerce},
    {path : `${ROUTES_CONST.VIEWPRESCRIPTION}/:prescriptionId` , component : ViewPrescription},
  ];

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>

        <Route
          path={ROUTES_CONST.AUTH.SIGNIN}
          element={
            isAuthenticated ? (
              <Navigate to={ROUTES_CONST.HOME} replace />
            ) : (
              <>
                <PageTitle title="Signin" />
                <SignIn />
              </>
            )
          }
        />

        <Route element={<DefaultLayout />}>
          {routeConfig?.map((item) => {

            return(
              <Route
              key={item?.path}
              path={item?.path}
              element={<Protected Component={item?.component} />}
            />
            )
          })}
        </Route>

        
        
      <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
}

export default AllRoutes;

