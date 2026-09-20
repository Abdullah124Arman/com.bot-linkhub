export function detectPlatform(url) {
  if (!url) return 'link';
  const u = url.toLowerCase();
  if (u.startsWith('mailto:')) return 'email';
  if (u.includes('github.com')) return 'github';
  if (u.includes('linkedin.com')) return 'linkedin';
  if (u.includes('twitter.com') || u.includes('x.com')) return 'twitter';
  if (u.includes('instagram.com')) return 'instagram';
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('facebook.com')) return 'facebook';
  if (u.includes('tiktok.com')) return 'tiktok';
  if (u.includes('discord.gg') || u.includes('discord.com')) return 'discord';
  if (u.includes('t.me') || u.includes('telegram.')) return 'telegram';
  return 'link';
}

export function getPlatformIcon(platform) {
  const icons = {
    email: '✉️',
    github: '🐙',
    linkedin: '💼',
    twitter: '🐦',
    instagram: '📸',
    youtube: '▶️',
    facebook: '👤',
    tiktok: '🎵',
    discord: '💬',
    telegram: '✈️',
    link: '🔗',
  };
  return icons[platform] || '🔗';
}
