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
  // Add a root path route, which will be handled by beforeEach for redirection
  {
    path: '/',
    name: 'Home',
    component: UserView, // A placeholder component, as it will always redirect
  },
]

// Redirect to signin on logout if currently on protected route
watch(() => user.value , (newUser) => {
  // If user becomes authenticated AND is currently on the signin page,
  // redirect them to the root path (which will then lead to their dashboard via beforeEach)
  if (newUser && router.currentRoute.value.path === '/signin') {
    console.log("route to /")
    router.push('/');
    return; // Stop further execution in this watch handler
  }

  // Only push to signin if user becomes null AND the current route required authentication
  // This prevents redirecting authenticated users who log out from public pages
  if (!newUser && router.currentRoute.value.meta?.requiresRole) {
    router.push('/signin');
  }
});


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  // 1. Wait for authReady to be true
  // This ensures Firebase auth state is loaded before making decisions
  await new Promise((resolve) => {
    if (authReady.value) return resolve();
    const stop = watch(authReady, (ready) => {
      if (ready) {
        stop();
        resolve();
      }
    });
  });

  const isAuthenticated = user.value;
  const currentUserRole = userRole.value; // Get the current user's role

  // Define routes that are publicly accessible without authentication
  const publicRoutes = ['/signin'];

  // Check if the target route requires authentication (i.e., has a requiresRole meta)
  const requiresAuth = to.meta.requiresRole;

  // 2. Handle unauthenticated users
  if (!isAuthenticated) {
    if (publicRoutes.includes(to.path)) {
      // Allow unauthenticated users to go to public routes (e.g., /signin)
      return next();
    } else {
      // For any other route, redirect unauthenticated users to /signin
      return next('/signin');
    }
  }

  // From this point onwards, the user IS authenticated (isAuthenticated is true)

  // 3. Redirect authenticated users from /signin to their default dashboard
  // This prevents authenticated users from lingering on the signin page
  if (to.path === '/signin') {
    switch (currentUserRole) {
      case 'admin':
        return next('/admin');
      case 'celebrant':
        return next('/celebrant-view');
      case 'user':
        return next('/user-view');
      default:
        // Fallback for authenticated users with no recognized role
        return next('/user-view');
    }
  }

  // 4. Handle root path ('/') for authenticated users
  // This ensures that accessing '/' always redirects to the user's specific dashboard
  if (to.path === '/') {
    switch (currentUserRole) {
      case 'admin':
        return next('/admin');
      case 'celebrant':
        return next('/celebrant-view');
      case 'user':
        return next('/user-view');
      default:
        // Fallback for authenticated users with no recognized role
        return next('/user-view');
    }
  }

  // 5. Role-based access control for protected routes
  if (requiresAuth) {
    const allowedRoles = to.meta.requiresRole;
    if (!allowedRoles.includes(currentUserRole)) {
      // User is authenticated but does not have the required role for this route.
      // Redirect them to the root path, which will then trigger the
      // role-based redirection to their appropriate dashboard.
      return next('/');
    }
  }

  // 6. If none of the above conditions apply, allow navigation
  next();
});

export default router
