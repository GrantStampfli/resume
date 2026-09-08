export default defineAppConfig({
  ui: {
    colors: {
      primary: 'sky',
      neutral: 'zinc',
    },
  },
  site: {
    name: 'Grant Stampfli',
    tagline: 'Web Developer / JavaScript Enthusiast',
    email: 'mail@gstampfli.com',
    location: 'Portland, OR',
  },
  socials: [
    { label: 'GitHub', to: 'https://github.com/grantstampfli', icon: 'i-simple-icons-github' },
    { label: 'LinkedIn', to: 'https://www.linkedin.com/in/grantstampfli', icon: 'i-simple-icons-linkedin' },
    { label: 'X / Twitter', to: 'https://twitter.com/grantstampfli', icon: 'i-simple-icons-x' },
  ],
  nav: [
    { label: 'About', to: '#about' },
    { label: 'Tech', to: '#tech' },
    { label: 'Work', to: '#work' },
    { label: 'Experience', to: '#experience' },
    { label: 'Contact', to: '#contact' },
    { label: 'Projects', to: '/projects' },
  ],
})
