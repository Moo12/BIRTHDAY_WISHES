import { createRouter, createWebHistory } from 'vue-router'
import { watch } from "vue"
import UserView from '@/views/UserView.vue'
import CelebrantView from '@/views/CelebrantView.vue'
import AdminView from '@/views/AdminView.vue'
import Admin from '@/components/Admin.vue'
import useAuth from '@/composables/useAuth'


const routes = [
  {
    path: '/celebrant-view',
    component: CelebrantView,
    meta: { requiresRole: ['celebrant', 'admin'] }
  },
  {
    path: '/user-view',
    component: UserView,
    meta: { requiresRole: ['user', 'admin'] }
  },
  {
    path: '/admin',
    component: AdminView,
    meta: { requiresRole: ['admin'] }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAdmin: true }, // 🔒
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const { user, userRole, authReady } = useAuth();

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
