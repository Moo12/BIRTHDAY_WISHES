import { createRouter, createWebHistory } from 'vue-router'
import { watch } from "vue"
import UserView from '@/views/UserView.vue'
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
    path: '/home-page',
    name: 'HomePage',
    component: () => import('@/views/WelcomeView.vue'),
    meta: { requiresRole: ['user', 'admin', 'celebrant'] }
  },
  // New: All Wishes (open to all authenticated users)
  {
    path: '/all-wishes',
    name: 'AllWishes',
    component: () => import('@/views/UserView.vue'),
    meta: { requiresRole: ['user', 'admin'] }
  },
  // New: Add Wish (open to all authenticated users)
  {
    path: '/add-wish',
    name: 'AddWish',
    component: () => import('@/views/addWishView.vue'),
    meta: { requiresRole: ['user', 'admin'] }
  },
  // Home (redirects based on role)
  {
    path: '/',
    name: 'Home',
    component: UserView,
  },// A placeholder component, as it will always redirect
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
        path: "all-wishes",
        name: "AdminAllWishes",
        component: () => import('@/views/AdminWishesView.vue'),
      },
    ]
  },
  {
    path: '/celebrant',
    name: 'Celebrant',
    component: () => import('@/views/CelebrantView.vue'),
    meta: { requiresRole: ['celebrant', 'admin'] },
    children: [
    {
      path: "all-wishes-board",
      name: "AllWishesBoard",
      component: () => import('@/views/CelebrantAllWishesBoard.vue'),
    },
    {
      path: "all-wishes-list",
      name: "AllWishesList",
      component: () => import('@/views/CelebrantAllWishesList.vue'),
    },
    ]
  },

]

// Redirect to signin on logout if currently on protected route
watch(() => user.value , (newUser) => {
  console.log("router watch")
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
        return next('/celebrant');
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
        return next('/admin/all-wishes');
        case 'celebrant':
          return next('/celebrant');
          case 'user':
            return next('/home-page');
            default:
              // Fallback for authenticated users with no recognized role
              return next('/home-page');
            }
  }
  // 5. Role-based access control for protected routes
  if (requiresAuth) {
    const allowedRoles = to.meta.requiresRole;
    console.log("to.path", to.path)
    if (!allowedRoles.includes(currentUserRole)) {
      // User is authenticated but does not have the required role for this route.
      // Redirect them to the root path, which will then trigger the
      // role-based redirection to their appropriate dashboard.
      console.log("route to /")
      return next('/');
    }
  }
            
  // New: Auto-redirect for /admin/* paths if user is admin, only if path is invalid or exact /admin
  if (isAuthenticated && currentUserRole === 'admin') {
    if (to.path === '/admin') {
      // If admin navigates directly to /admin, redirect to default admin view
      console.log("Redirecting admin from", to.path, "to /admin/all-wishes");
      return next('/admin/all-wishes');
    } else if (to.path.startsWith('/admin/')) {
      // Check if it's a valid admin child route
      const adminRoute = routes.find(route => route.path === '/admin');
      if (adminRoute && adminRoute.children) {
        // Extract the child path part (e.g., 'images' from '/admin/images')
        const adminChildPath = to.path.substring('/admin/'.length); 
        // Check if this extracted path matches any defined child route's path
        const isValidAdminChild = adminRoute.children.some(child => child.path === adminChildPath);

        if (!isValidAdminChild) {
          // If it's an /admin/ path but not a valid child route, redirect
          console.log("Redirecting admin from invalid path", to.path, "to /admin/all-wishes");
          return next('/admin/all-wishes');
        }
      }
      // If it is a valid admin child route, or no children defined (shouldn't happen for /admin), allow access
    }
  }

  if (isAuthenticated && currentUserRole === 'celebrant') {
    if (to.path === '/celebrant') {
      return next('/celebrant/all-wishes-list');
    } 
    else if (to.path.startsWith('/celebrant/')) {
      const celebrantRoute = routes.find(route => route.path === '/celebrant');
      if (celebrantRoute && celebrantRoute.children) {
        const celebrantChildPath = to.path.substring('/celebrant/'.length);
        const isValidCelebrantChild = celebrantRoute.children.some(child => child.path === celebrantChildPath);
        if (!isValidCelebrantChild) {
          return next('/celebrant/all-wishes-board');
        }
      }
    }
  }


  // 6. If none of the above conditions apply, allow navigation
  next();
});

export default router
