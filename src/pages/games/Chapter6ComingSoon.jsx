import ComingSoonGameTemplate from "./ComingSoonGameTemplate";

export default function Chapter6ComingSoon({ username, onLogout, onComplete }) {
  return (
    <ComingSoonGameTemplate
      username={username}
      onLogout={onLogout}
      onComplete={onComplete}
      gameName="Rizal's Global Impact"
      level={1}
      chapter={6}
      theme="emerald"
      description="Explore how José Rizal's legacy continues to inspire people around the world today!"
      features={[
        "Modern applications of Rizal's teachings",
        "Global Filipino diaspora connections",
        "Contemporary social justice movements",
        "Digital heritage preservation",
        "International recognition and monuments",
      ]}
    />
  );
}

// Additional coming soon games for future content
export function ModernRizalGame({ username, onLogout, onComplete }) {
  return (
    <ComingSoonGameTemplate
      username={username}
      onLogout={onLogout}
      onComplete={onComplete}
      gameName="Rizal in the Digital Age"
      level={2}
      chapter={6}
      theme="cyan"
      description="Discover how Rizal's ideas apply to modern technology and social media!"
      features={[
        "Digital activism and social change",
        "Online education and learning",
        "Virtual museums and heritage sites",
        "Social media for positive change",
        "Digital storytelling and preservation",
      ]}
    />
  );
}

export function RizalWorldTourGame({ username, onLogout, onComplete }) {
  return (
    <ComingSoonGameTemplate
      username={username}
      onLogout={onLogout}
      onComplete={onComplete}
      gameName="Rizal Monuments Worldwide"
      level={3}
      chapter={6}
      theme="purple"
      description="Take a virtual tour of Rizal monuments and memorials around the globe!"
      features={[
        "Interactive world map exploration",
        "Historical significance of each monument",
        "Cultural connections and Filipino communities",
        "Architectural styles and artistic interpretations",
        "Stories behind each memorial's creation",
      ]}
    />
  );
}
