import Vue from "vue"
import Router from "vue-router"
import Login from "@/views/Login.vue"
import Dashboard from "@/views/Dashboard.vue"
import CreateProblem from "@/views/CreateProblem.vue"
import EditProblem from "@/views/EditProblem.vue"
import TestProblem from "@/views/TestProblem.vue"
import Contest from "@/views/Contest.vue"

Vue.use(Router);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard
  },
  {
    path: "/dashboard/create-problem",
    name: "CreateProblem",
    component: CreateProblem
  },
  {
    path: "/dashboard/contest",
    name: "Contest",
    component: Contest
  },
  {
    path: "/dashboard/edit/:qID",
    name: "EditProblem",
    component: EditProblem,
    props: true
  },
  {
    path: "/dashboard/test/:qID",
    name: "TestProblem",
    component: TestProblem,
    props: true
  },
  {
    path: "*",
    redirect: "/"
  }
];

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router;
