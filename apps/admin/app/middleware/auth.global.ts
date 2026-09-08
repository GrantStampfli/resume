export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, fetch } = useUserSession()

  if (!loggedIn.value)
    await fetch()

  if (to.path === '/login') {
    if (loggedIn.value)
      return navigateTo('/')
    return
  }

  if (!loggedIn.value)
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
})
