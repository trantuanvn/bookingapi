import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbarProvider } from "@refinedev/kbar";

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
  NavigateToResource,
} from "@refinedev/react-router-v6";
import { App as AntdApp, Typography } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider, axiosInstance } from "./authProvider";
import { Header } from "./components/header";
import { API_URL } from "./constants";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { BookingCreate, BookingList, BookingShow } from "./pages/bookings";
import { UserCreate, UserList, UserShow } from "./pages/user";
import { DataProvider } from "./dataProvider";
import { SpaceCreate, SpaceList, SpaceShow } from "./pages/spaces";
import { useEffect } from "react";
import { Board } from "./pages/board";
import "./style.css";
import {
  ControlFilled,
  GroupOutlined,
  MonitorOutlined,
  RadarChartOutlined,
  TableOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { PostList } from "./pages/post/list";
import { PlanList } from "./pages/plan/list";
import { ContactList } from "./pages/contact/list";
import { FAQList } from "./pages/faq/list";
import { PlanCreate } from "./pages/plan/create";
import { PostCreate } from "./pages/post/create";
import { FAQCreate } from "./pages/faq/create";

function App() {
  document.title = "LaSpace | Admin";
  useEffect(() => {
    localStorage.setItem("colorMode", "dark");
  }, []);
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
                    name: "board",
                    list: "/board",
                    meta: {
                      label: "Board",
                      icon: <ControlFilled />,
                    },
                  },
                  {
                    name: "users",
                    list: "/users",
                    create: "/users/create",
                    edit: "/users/edit/:id",
                    show: "/users/show/:id",
                    meta: {
                      canDelete: true,
                      label: "Members",
                      icon: <UserOutlined />,
                    },
                  },
                  {
                    name: "spaces",
                    list: "/spaces",
                    create: "/spaces/create",
                    edit: "/spaces/edit/:id",
                    show: "/spaces/show/:id",
                    meta: {
                      canDelete: true,
                      label: "Spaces / Rooms",
                      icon: <RadarChartOutlined />,
                    },
                  },
                  {
                    name: "bookings",
                    list: "/bookings",
                    create: "/bookings/create",
                    edit: "/bookings/edit/:id",
                    show: "/bookings/show/:id",
                    meta: {
                      canDelete: true,
                      label: "Bookings",
                      icon: <TableOutlined />,
                    },
                  },
                  {
                    name: "plans",
                    list: "/plans",
                    create: "/plans/create",
                    edit: "/plans/edit/:id",
                    show: "/plans/show/:id",
                    meta: {
                      parent: "Content",
                      canDelete: true,
                      label: "Plan",
                      icon: <TableOutlined />,
                    },
                  },
                  {
                    name: "posts",
                    list: "/posts",
                    create: "/posts/create",
                    edit: "/posts/edit/:id",
                    show: "/posts/show/:id",
                    meta: {
                      parent: "Content",
                      canDelete: true,
                      label: "Post",
                      icon: <TableOutlined />,
                    },
                  },
                  {
                    name: "faqs",
                    list: "/faqs",
                    create: "/faqs/create",
                    edit: "/faqs/edit/:id",
                    show: "/faqs/show/:id",
                    meta: {
                      parent: "Content",
                      canDelete: true,
                      label: "FAQ",
                      icon: <TableOutlined />,
                    },
                  },
                  {
                    name: "contacts",
                    list: "/contacts",
                    // create: "/contacts/create",
                    // edit: "/contacts/edit/:id",
                    // show: "/contacts/show/:id",
                    meta: {
                      parent: "Content",
                      canDelete: true,
                      label: "Contacts",
                      icon: <TableOutlined />,
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
                          Sider={(props) => (
                            <ThemedSiderV2
                              {...props}
                              fixed
                              Title={() => (
                                <Typography.Title level={3}>
                                  LaSpace
                                </Typography.Title>
                              )}
                            />
                          )}
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
                    <Route path="/board">
                      <Route index element={<Board />} />
                    </Route>
                    <Route path="/bookings">
                      <Route index element={<BookingList />} />
                      <Route path="create" element={<BookingCreate />} />
                      <Route path="edit/:id" element={<BookingCreate />} />
                      <Route path="show/:id" element={<BookingShow />} />
                    </Route>
                    <Route path="/spaces">
                      <Route index element={<SpaceList />} />
                      <Route path="create" element={<SpaceCreate />} />
                      <Route path="edit/:id" element={<SpaceCreate />} />
                      <Route path="show/:id" element={<SpaceShow />} />
                    </Route>

                    <Route path="/users">
                      <Route index element={<UserList />} />
                      <Route path="create" element={<UserCreate />} />
                      <Route path="edit/:id" element={<UserCreate />} />
                      <Route path="show/:id" element={<UserShow />} />
                    </Route>
                    <Route path="/posts">
                      <Route index element={<PostList />} />
                      <Route path="create" element={<PostCreate />} />
                      <Route path="edit/:id" element={<PostCreate />} />
                    </Route>
                    <Route path="/plans">
                      <Route index element={<PlanList />} />
                      <Route path="create" element={<PlanCreate />} />
                      <Route path="edit/:id" element={<PlanCreate />} />
                      {/* <Route path="show/:id" element={<PlanShow />} /> */}
                    </Route>
                    <Route path="/faqs">
                      <Route index element={<FAQList />} />
                      <Route path="create" element={<FAQCreate />} />
                      <Route path="edit/:id" element={<FAQCreate />} />
                    </Route>
                    <Route path="/contacts" element={<ContactList />} />

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

                {/* <RefineKbar /> */}
                {/* <UnsavedChangesNotifier /> */}
                {/* <DocumentTitleHandler /> */}
              </Refine>
              {/* <DevtoolsPanel /> */}
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
