export default defineAppConfig({
  site: {
    name: 'Grant Stampfli',
    tagline: 'Senior full stack engineer building Vue and Rails products',
    description: 'I’m Grant, a senior full stack engineer based in Portland, Oregon. I build Vue and Rails products for logistics companies, from component libraries to instant-rate booking flows.',
    email: 'mail@gstampfli.com',
    location: 'Portland, OR',
  },
  socials: [
    { label: 'Follow on X', href: 'https://twitter.com/grantstampfli', icon: 'x' },
    { label: 'Follow on GitHub', href: 'https://github.com/grantstampfli', icon: 'github' },
    { label: 'Follow on LinkedIn', href: 'https://www.linkedin.com/in/grantstampfli', icon: 'linkedin' },
  ] satisfies { label: string, href: string, icon: 'x' | 'github' | 'linkedin' | 'instagram' }[],
  nav: [
    { label: 'About', to: '/about' },
    { label: 'Articles', to: '/articles' },
    { label: 'Projects', to: '/projects' },
    { label: 'Speaking', to: '/speaking' },
    { label: 'Uses', to: '/uses' },
  ],
})
