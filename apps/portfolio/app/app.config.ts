export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'zinc',
    },
  },
  site: {
    name: 'Grant Stampfli',
    tagline: 'Senior full stack engineer building Vue and Rails products.',
    email: 'mail@gstampfli.com',
    location: 'Portland, OR',
  },
  socials: [
    { label: 'GitHub', to: 'https://github.com/grantstampfli', icon: 'i-simple-icons-github' },
    { label: 'LinkedIn', to: 'https://www.linkedin.com/in/grantstampfli', icon: 'i-simple-icons-linkedin' },
  ],
  nav: [
    { label: 'Projects', to: '/projects' },
    { label: 'About', to: '/about' },
  ],
})
