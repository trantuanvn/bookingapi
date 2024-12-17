import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  AuthPage,
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider, axiosInstance } from "./authProvider";
import { Header } from "./components/header";
import { API_URL } from "./constants";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { BookingCreate, BookingList, BookingShow } from "./pages/bookings";
import { RoomCreate, RoomList } from "./pages/rooms";
import { UserCreate, UserList, UserShow } from "./pages/user";
import {
  GroupRoomCreate,
  GroupRoomList,
  GroupRoomShow,
} from "./pages/room-groups";
import { DataProvider } from "./dataProvider";

function App() {
  return (
    <BrowserRouter>
      {/* <GitHubBanner /> */}
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                authProvider={authProvider}
                dataProvider={DataProvider(API_URL + `/api`, axiosInstance)}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                resources={[
                  {
                    name: "users",
                    list: "/users",
                    create: "/users/create",
                    edit: "/users/edit/:id",
                    show: "/users/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                  {
                    name: "rooms",
                    list: "/rooms",
                    create: "/rooms/create",
                    edit: "/rooms/edit/:id",
                    show: "/rooms/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                  {
                    name: "room-groups",
                    list: "/room-groups",
                    create: "/room-groups/create",
                    edit: "/room-groups/edit/:id",
                    show: "/room-groups/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                  // {
                  //   name: "seats",
                  //   list: "/seats",
                  //   create: "/seats/create",
                  //   edit: "/seats/edit/:id",
                  //   show: "/seats/show/:id",
                  //   meta: {
                  //     canDelete: true,
                  //   },
                  // },
                  {
                    name: "bookings",
                    list: "/bookings",
                    create: "/bookings/create",
                    edit: "/bookings/edit/:id",
                    show: "/bookings/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "bJET9a-k2ELVf-n6B5eY",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Header={Header}
                          Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="blog-posts" />}
                    />
                    <Route path="/bookings">
                      <Route index element={<BookingList />} />
                      <Route path="create" element={<BookingCreate />} />
                      <Route path="edit/:id" element={<BookingCreate />} />
                      <Route path="show/:id" element={<BookingShow />} />
                    </Route>
                    <Route path="/rooms">
                      <Route index element={<RoomList />} />
                      <Route path="create" element={<RoomCreate />} />
                      <Route path="edit/:id" element={<RoomCreate />} />
                      <Route
                        path="show/:id"
                        element={<RoomCreate disabled />}
                      />
                    </Route>
                    <Route path="/room-groups">
                      <Route index element={<GroupRoomList />} />
                      <Route path="create" element={<GroupRoomCreate />} />
                      <Route path="edit/:id" element={<GroupRoomCreate />} />
                      <Route path="show/:id" element={<GroupRoomShow />} />
                    </Route>
                    <Route path="/users">
                      <Route index element={<UserList />} />
                      <Route path="create" element={<UserCreate />} />
                      <Route path="edit/:id" element={<UserCreate />} />
                      <Route path="show/:id" element={<UserShow />} />
                    </Route>

                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route
                      path="/login"
                      element={
                        <AuthPage
                          type="login"
                          formProps={{
                            initialValues: {
                              email: "admin@booking.com",
                              password: "Demo@123",
                            },
                          }}
                        />
                      }
                    />
                    <Route
                      path="/register"
                      element={<AuthPage type="register" />}
                    />
                    <Route
                      path="/forgot-password"
                      element={<AuthPage type="forgotPassword" />}
                    />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
