
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { PageTransition } from "@/components/PageTransition";
import { RequireAuth } from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TEAMS, GAMES, ANNOUNCEMENTS, COURTS, RESERVATIONS } from "@/data/mock-data";
import { Announcement, Game, Reservation } from "@/data/types";
import { AdminScheduleTab } from "./AdminScheduleTab";
import { AdminAnnouncementsTab } from "./AdminAnnouncementsTab";
import { AdminTeamsTab } from "./AdminTeamsTab";
import { AdminReservationsTab } from "./AdminReservationsTab";
import {
  Users,
  Calendar,
  MessageCircle,
  MapPin,
  LayoutDashboard,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);
  const [lastAnnouncement, setLastAnnouncement] = useState<Announcement | null>(null);
  
  // Calculate stats on component mount
  useEffect(() => {
    // Get pending reservations
    const pending = RESERVATIONS.filter(res => res.status === "pending");
    setPendingReservations(pending);
    
    // Get upcoming games
    const upcoming = GAMES
      .filter(game => new Date(game.date) >= new Date() && game.status === "scheduled")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
    setUpcomingGames(upcoming);
    
    // Get latest announcement
    const latest = [...ANNOUNCEMENTS]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    setLastAnnouncement(latest);
  }, []);

  return (
    <RequireAuth adminOnly>
      <MainLayout>
        <PageTransition>
          <div className="page-container">
            <div className="page-header">
              <h1>Admin Dashboard</h1>
              <p className="text-xl text-muted-foreground mt-2">
                Manage the basketball tournament system
              </p>
            </div>

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
                <TabsTrigger value="dashboard" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="schedule" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Schedule</span>
                </TabsTrigger>
                <TabsTrigger value="announcements" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Announcements</span>
                </TabsTrigger>
                <TabsTrigger value="teams" className="gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Teams</span>
                </TabsTrigger>
                <TabsTrigger value="reservations" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">Reservations</span>
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Teams</CardTitle>
                      <CardDescription>
                        Registered teams in the tournament
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-3xl font-bold">{TEAMS.length}</div>
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <Button 
                        variant="ghost" 
                        className="w-full mt-4" 
                        onClick={() => setActiveTab("teams")}
                      >
                        Manage Teams
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Upcoming Games</CardTitle>
                      <CardDescription>
                        Next scheduled matches
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-3xl font-bold">
                          {upcomingGames.length}
                        </div>
                        <Calendar className="h-8 w-8 text-primary" />
                      </div>
                      <Button 
                        variant="ghost" 
                        className="w-full mt-4"
                        onClick={() => setActiveTab("schedule")}
                      >
                        Manage Schedule
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Pending Reservations</CardTitle>
                      <CardDescription>
                        Court reservations waiting for approval
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-3xl font-bold">
                          {pendingReservations.length}
                        </div>
                        <MapPin className="h-8 w-8 text-primary" />
                      </div>
                      <Button 
                        variant="ghost" 
                        className="w-full mt-4"
                        onClick={() => setActiveTab("reservations")}
                      >
                        Manage Reservations
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Next Games</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {upcomingGames.length > 0 ? (
                        <div className="space-y-4">
                          {upcomingGames.map(game => (
                            <div key={game.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div>
                                <div className="font-medium">{game.homeTeam.name} vs {game.awayTeam.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(game.date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })} | {game.time}
                                </div>
                              </div>
                              <div className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                                {game.location.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">No upcoming games scheduled</p>
                        </div>
                      )}
                      <Button 
                        className="w-full mt-4" 
                        variant="outline"
                        onClick={() => setActiveTab("schedule")}
                      >
                        Add Game
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Latest Announcement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {lastAnnouncement ? (
                        <div>
                          <div className="flex justify-between mb-2">
                            <h4 className="font-semibold">{lastAnnouncement.title}</h4>
                            <span className="text-xs bg-muted px-2 py-1 rounded-full">
                              {lastAnnouncement.category}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                            {lastAnnouncement.content}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            Posted: {new Date(lastAnnouncement.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">No announcements yet</p>
                        </div>
                      )}
                      <Button 
                        className="w-full mt-4" 
                        variant="outline"
                        onClick={() => setActiveTab("announcements")}
                      >
                        Post Announcement
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Schedule Tab */}
              <TabsContent value="schedule" className="animate-fade-in">
                <AdminScheduleTab />
              </TabsContent>

              {/* Announcements Tab */}
              <TabsContent value="announcements" className="animate-fade-in">
                <AdminAnnouncementsTab />
              </TabsContent>

              {/* Teams Tab */}
              <TabsContent value="teams" className="animate-fade-in">
                <AdminTeamsTab />
              </TabsContent>

              {/* Reservations Tab */}
              <TabsContent value="reservations" className="animate-fade-in">
                <AdminReservationsTab />
              </TabsContent>
            </Tabs>
          </div>
        </PageTransition>
      </MainLayout>
    </RequireAuth>
  );
}
