import './index.css'
import { ProfileHeader } from './components/ProfileHeader'
import { Divider } from './components/Divider'
import { LinkList } from './components/LinkList'
import { useSiteConfig } from './hooks/useSiteConfig'

export default function App() {
  const { config } = useSiteConfig()

  return (
    <div className="page">
      <main className="card">
        <ProfileHeader profile={config.profile} />
        <Divider />
        <LinkList links={config.links} />
      </main>
      <footer className="footer">
        <p>hellobrittrose.com</p>
      </footer>
    </div>
  )
}
