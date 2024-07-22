import { useToast } from "primevue/usetoast"; // Importer correctement la fonction useToast
import { createRouter, createWebHistory } from "vue-router";

import AdminHomeView from "../views/AdminHomeView.vue";
import AdminUserView from "../views/AdminUserView.vue";
import CreateUserView from "../views/CreateUserView.vue";
import HomeView from "../views/HomeView.vue";
import LandingView from "../views/LandingView.vue";
import LoginView from "../views/LoginView.vue";
import NotFound from "../views/NotFound.vue";
import RegisterView from "../views/RegisterView.vue";

import ForgotPasswordView from "../views/ForgotPasswordView.vue";
import ResetPasswordView from "../views/ResetPasswordView.vue";

const routes = [
  {
    path: "/reset-password/:token",
    name: "ResetPassword",
    component: ResetPasswordView,
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPasswordView,
  },
  {
    path: "/",
    name: "landing",
    component: LandingView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin-home",
    name: "admin-home",
    component: AdminHomeView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin-users",
    name: "admin-users",
    component: AdminUserView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/create-user",
    name: "CreateUserView",
    component: CreateUserView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  // {
  //   path: "/admin-create-users",
  //   name: "admin-create-users",
  //   component: CreateUserView,
  //   meta: { requiresAuth: true, requiresAdmin: true },
  // },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  const toast = useToast(); // Utiliser useToast pour afficher les notifications

  if (!token && requiresAuth) {
    next("/login");
  } else if (token && to.path === "/") {
    if (userRole === "admin") {
      next("/admin-home");
    } else if (userRole === "joueur") {
      next("/home");
    } else {
      next();
    }
  } else if (requiresAuth && requiresAdmin && userRole !== "admin") {
    toast.error("You do not have access to the admin page."); // Afficher un message toast d'erreur
    next("/home");
  } else if (
    requiresAuth &&
    !requiresAdmin &&
    userRole !== "joueur" &&
    to.name === "home"
  ) {
    next("/login");
  } else {
    next();
  }
});

export default router;
