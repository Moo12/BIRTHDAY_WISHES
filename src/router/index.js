import { createRouter, createWebHistory } from 'vue-router'
import { watch } from "vue"
import UserView from '@/views/UserView.vue'
import CelebrantView from '@/views/CelebrantView.vue'
import AdminView from '@/views/AdminView.vue'
import AdminImagesManager from '@/components/AdminImagesManager.vue'
import LoginView from '@/views/LoginView.vue'
import useAuth from '@/composables/useAuth'

const { user, userRole, authReady } = useAuth();


const routes = [
  {
    path: '/signin',
    name: 'Signin',
    component: LoginView,
  },
  {
    path: '/celebrant-view',
    name: 'CelebrantView',
    component: CelebrantView,
    meta: { requiresRole: ['celebrant', 'admin'] }
  },
  {
    path: '/user-view',
    name: 'UserView',
    component: UserView,
    meta: { requiresRole: ['user', 'admin'] }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresRole: ['admin'] },
    children: [
      {
        path: "images",
        name: "Images",
        component: AdminImagesManager,
      },
      {
        path: "user-view",
        name: "admin-user-view",
        component: UserView,
      },

    ]
  },
]

// Redirect to signin on logout if currently on protected route
watch(user, (newUser) => {
  if (!newUser?.value && router.currentRoute.value.meta?.requiresRole) {
    router.push('/signin');
  }
});


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  // Wait for authReady to be true
  const waitForAuth = () => new Promise((resolve) => {
    if (authReady.value) return resolve();
    const stop = watch(authReady, (ready) => {
      if (ready) {
        stop();
        resolve();
      }
    });
  });

  await waitForAuth();

  // If not logged in, block access to protected routes
  if (!user.value && to.meta.requiresRole) {
    return next('/');
  }

  // Redirect / root path to role-specific dashboard
  if (to.path === '/' && user.value) {
    switch (userRole.value) {
      case 'admin':
        return next('/admin');
      case 'celebrant':
        return next('/celebrant-view');
      case 'user':
        return next('/user-view');
      default:
        return next('/'); // fallback
    }
  }

   // Role-based access control
   const allowedRoles = to.meta.requiresRole;
   if (allowedRoles && !allowedRoles.includes(userRole.value)) {
     return next('/'); // or `/unauthorized`
   }
   else{
    return next()
   }
});

export default router
