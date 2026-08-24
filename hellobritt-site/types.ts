import type { ProfileConfig } from '../config/types'

export function ProfileHeader({ profile }: { profile: ProfileConfig }) {
  return (
    <header className="profile">
      <div className="profile__avatar">
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt={profile.name} />
        ) : (
          <span aria-hidden="true">{profile.initials}</span>
        )}
      </div>
      <h1 className="profile__name">{profile.name}</h1>
      <p className="profile__bio">{profile.bio}</p>
    </header>
  )
}
