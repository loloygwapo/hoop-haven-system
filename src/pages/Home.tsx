
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GAMES, ANNOUNCEMENTS } from "@/data/mock-data";
import { Calendar, Users, MessageCircle, MapPin } from "lucide-react";
import { formatDistance } from "date-fns";

export default function Home() {
  // Get upcoming games (limit to 3)
  const upcomingGames = GAMES
    .filter(game => new Date(game.date) >= new Date() && game.status === "scheduled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Get latest announcements (limit to 3)
  const latestAnnouncements = [...ANNOUNCEMENTS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <MainLayout>
      <PageTransition>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8">
            <div className="animate-slide-in space-y-4 max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Barangay Basketball Tournament
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join our community basketball tournament, showcase your skills, and compete for the championship.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/schedule">
                    <Calendar className="w-5 h-5" />
                    View Schedule
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <Link to="/teams">
                    <Users className="w-5 h-5" />
                    Teams
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container px-4 md:px-6 py-12 md:py-16 space-y-16">
          {/* Upcoming Games Section */}
          <section className="slide-in-section">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold">Upcoming Games</h2>
                <p className="text-muted-foreground mt-1">Don't miss the action</p>
              </div>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link to="/schedule">View All Games</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingGames.map((game) => (
                <Card key={game.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-4 pb-0">
                      <div className="text-sm text-muted-foreground mb-1">
                        {new Date(game.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })} | {game.time}
                      </div>
                      <div className="text-sm mb-4">{game.location.name}</div>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-muted/30">
                      <div className="text-center flex-1">
                        <div className="font-semibold mb-1">{game.homeTeam.name}</div>
                        <div className="text-2xl font-bold">VS</div>
                        <div className="font-semibold mt-1">{game.awayTeam.name}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Button variant="ghost" asChild>
                <Link to="/schedule">View All Games</Link>
              </Button>
            </div>
          </section>

          {/* Quick Links Section */}
          <section className="slide-in-section grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/announcements" className="group">
              <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all h-full flex flex-col items-center text-center group-hover:border-primary/50">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Announcements</h3>
                <p className="text-muted-foreground">Stay updated with the latest tournament news and information.</p>
              </div>
            </Link>
            
            <Link to="/teams" className="group">
              <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all h-full flex flex-col items-center text-center group-hover:border-primary/50">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Teams</h3>
                <p className="text-muted-foreground">View all participating teams, players, and their statistics.</p>
              </div>
            </Link>
            
            <Link to="/courts" className="group">
              <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-all h-full flex flex-col items-center text-center group-hover:border-primary/50">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Court Reservations</h3>
                <p className="text-muted-foreground">Reserve a court for practice sessions or friendly matches.</p>
              </div>
            </Link>
          </section>

          {/* Latest Announcements Section */}
          <section className="slide-in-section">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold">Latest Announcements</h2>
                <p className="text-muted-foreground mt-1">Tournament updates and news</p>
              </div>
              <Button variant="ghost" asChild>
                <Link to="/announcements">View All</Link>
              </Button>
            </div>

            <div className="space-y-4">
              {latestAnnouncements.map((announcement) => (
                <Card key={announcement.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-xl font-semibold">{announcement.title}</h4>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        {announcement.category}
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 mb-3">{announcement.content}</p>
                    <div className="text-sm text-muted-foreground">
                      {formatDistance(new Date(announcement.createdAt), new Date(), { addSuffix: true })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </PageTransition>
    </MainLayout>
  );
}
